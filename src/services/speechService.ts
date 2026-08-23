import { LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳', speechCode: 'en-IN' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', speechCode: 'en-GB' },
  { code: 'es-ES', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', speechCode: 'es-ES' },
  { code: 'fr-FR', name: 'French', nativeName: 'Français', flag: '🇫🇷', speechCode: 'fr-FR' },
  { code: 'de-DE', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', speechCode: 'de-DE' },
];

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart: () => void;
  onEnd: () => void;
  onAudioLevel?: (level: number) => void;
}

export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

type SpeechRecognitionType = any;

class SpeechService {
  private recognition: SpeechRecognitionType | null = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-IN';
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private ttsMuted: boolean = false;
  private isSpeakingTTS: boolean = false;
  private activeHandlers: SpeechRecognitionHandlers | null = null;
  private restartTimeout: any = null;
  
  // Persistent reference to prevent Chrome garbage-collection speech cutoff
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private speechKeepAliveInterval: any = null;

  constructor() {
    this.initRecognition();
    this.initVoices();
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      this.cachedVoices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = this.currentLanguage;
    }
  }

  public setLanguage(langCode: string) {
    this.currentLanguage = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  public setMuted(muted: boolean) {
    this.ttsMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.stopSpeaking();
    }
  }

  public getIsMuted(): boolean {
    return this.ttsMuted;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public startListening(handlers: SpeechRecognitionHandlers) {
    this.activeHandlers = handlers;

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      handlers.onError('Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    this.isListening = true;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.activeHandlers) {
        this.activeHandlers.onStart();
        this.startAudioVisualizer(this.activeHandlers.onAudioLevel);
      }
    };

    this.recognition.onresult = (event: any) => {
      if (this.isSpeakingTTS) return;

      let fullTranscript = '';
      let hasFinal = false;

      for (let i = 0; i < event.results.length; ++i) {
        const res = event.results[i];
        fullTranscript += res[0].transcript + ' ';
        if (res.isFinal) {
          hasFinal = true;
        }
      }

      const clean = fullTranscript.trim();
      if (clean && this.activeHandlers) {
        this.activeHandlers.onResult(clean, hasFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Normal pause - continuous loop keeps running
        return;
      }
      if (event.error === 'aborted') {
        return;
      }

      let msg = 'Speech recognition error';
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission denied. Please allow mic access in your browser.';
        this.isListening = false;
        this.stopAudioVisualizer();
        if (this.activeHandlers) this.activeHandlers.onError(msg);
        return;
      } else if (event.error === 'network') {
        msg = 'Network connection issue with speech service.';
      }

      if (this.isListening && !this.isSpeakingTTS) {
        this.safeRestartRecognition();
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if listening is active and not currently playing TTS
      if (this.isListening && !this.isSpeakingTTS && this.activeHandlers) {
        this.safeRestartRecognition();
        return;
      }

      this.stopAudioVisualizer();
      if (!this.isListening && this.activeHandlers) {
        this.activeHandlers.onEnd();
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.safeRestartRecognition();
    }
  }

  private safeRestartRecognition() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    this.restartTimeout = setTimeout(() => {
      if (this.isListening && !this.isSpeakingTTS && this.recognition) {
        try {
          this.recognition.start();
        } catch (e) {
          // Already started or busy
        }
      }
    }, 300);
  }

  public stopListening() {
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.stopAudioVisualizer();
    if (this.activeHandlers) {
      this.activeHandlers.onEnd();
    }
  }

  // Real-Time Web Audio API Decibel Analyser
  private startAudioVisualizer(onAudioLevel?: (level: number) => void) {
    if (!onAudioLevel || typeof window === 'undefined') return;

    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioContext || this.audioContext.state === 'closed') {
        this.audioContext = new AudioCtxClass();
      }

      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaStream = stream;
          if (!this.audioContext) return;

          const source = this.audioContext.createMediaStreamSource(stream);
          this.analyser = this.audioContext.createAnalyser();
          this.analyser.fftSize = 256;
          this.analyser.smoothingTimeConstant = 0.8;
          source.connect(this.analyser);

          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

          const updateVolume = () => {
            if (!this.analyser || !this.isListening) {
              if (onAudioLevel) onAudioLevel(0);
              return;
            }

            this.analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            const normalized = Math.min(100, Math.round((average / 128) * 100));

            onAudioLevel(normalized);
            this.animFrameId = requestAnimationFrame(updateVolume);
          };

          updateVolume();
        })
        .catch(() => {
          // Mic visualizer fallback
        });
    } catch (e) {}
  }

  private stopAudioVisualizer() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
  }

  // Pure Female Voice Selection across Windows, macOS, Android, iOS, Chrome, Edge
  private getBestFemaleVoice(langCode: string): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    
    const voices = this.cachedVoices.length > 0 
      ? this.cachedVoices 
      : window.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) return null;

    const shortLang = langCode.substring(0, 2).toLowerCase();
    const exactLang = langCode.toLowerCase().replace('_', '-');

    // Known male voice keywords to strictly reject
    const maleBlacklist = [
      'david', 'george', 'mark', 'male', 'ravi', 'guy', 'richard', 
      'stefan', 'paul', 'james', 'thomas', 'daniel', 'oliver', 'alex'
    ];

    // Priority female voice engines
    const femalePriority = [
      'zira', 'samantha', 'victoria', 'karen', 'moira', 'fiona', 'tessa',
      'heera', 'swara', 'veena', 'sangeeta', 'priya', 'female', 'woman',
      'google uk english female', 'google us english', 'google हिन्दी', 'google தமிழ்',
      'natural (female)', 'online (natural) - english'
    ];

    // 1. Filter voices in target language
    const langVoices = voices.filter((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === exactLang || vLang.startsWith(shortLang);
    });

    // Search in target language first
    if (langVoices.length > 0) {
      // Find top female priority
      for (const keyword of femalePriority) {
        const found = langVoices.find((v) => {
          const name = v.name.toLowerCase();
          const isBlacklisted = maleBlacklist.some((m) => name.includes(m));
          return !isBlacklisted && name.includes(keyword);
        });
        if (found) return found;
      }

      // Any non-male voice in target language
      const nonMale = langVoices.find((v) => {
        const name = v.name.toLowerCase();
        return !maleBlacklist.some((m) => name.includes(m));
      });
      if (nonMale) return nonMale;
    }

    // 2. Global fallback to female voice
    for (const keyword of femalePriority) {
      const found = voices.find((v) => {
        const name = v.name.toLowerCase();
        const isBlacklisted = maleBlacklist.some((m) => name.includes(m));
        return !isBlacklisted && name.includes(keyword);
      });
      if (found) return found;
    }

    // 3. Any non-male voice globally
    const safeVoice = voices.find((v) => {
      const name = v.name.toLowerCase();
      return !maleBlacklist.some((m) => name.includes(m));
    });

    return safeVoice || voices[0] || null;
  }

  public stopSpeaking() {
    if (this.speechKeepAliveInterval) {
      clearInterval(this.speechKeepAliveInterval);
      this.speechKeepAliveInterval = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeakingTTS = false;
    this.activeUtterance = null;
  }

  // Robust, Glitch-Free Natural Female Speech Synthesis
  public speak(text: string, langCode: string = this.currentLanguage): Promise<void> {
    return new Promise((resolve) => {
      if (this.ttsMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      // Clean spoken text: strip markdown syntax, currency symbols, backticks
      const cleanSpokenText = text
        .replace(/[*_#`~]/g, '')
        .replace(/\$(\d+(?:\.\d+)?)/g, '$1 dollars')
        .replace(/₹(\d+(?:\.\d+)?)/g, '$1 rupees')
        .trim();

      if (!cleanSpokenText) {
        resolve();
        return;
      }

      // Ensure clean state before speaking
      this.stopSpeaking();
      this.isSpeakingTTS = true;

      // Pause speech recognition while speaking to prevent feedback echo loops
      if (this.recognition && this.isListening) {
        try {
          this.recognition.stop();
        } catch (e) {}
      }

      const utterance = new SpeechSynthesisUtterance(cleanSpokenText);
      this.activeUtterance = utterance; // Strong reference prevents GC cutoff!

      utterance.lang = langCode;
      utterance.rate = 0.98; // Stable, natural human cadence (prevents voice stutter)
      utterance.pitch = 1.0; // Clean natural pitch (prevents cracking/distortion)

      const matchedVoice = this.getBestFemaleVoice(langCode);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      // Chromium keep-alive to prevent 15-second speech freeze bug
      this.speechKeepAliveInterval = setInterval(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          if (this.speechKeepAliveInterval) {
            clearInterval(this.speechKeepAliveInterval);
            this.speechKeepAliveInterval = null;
          }
        }
      }, 5000);

      const cleanupAndResolve = () => {
        if (this.speechKeepAliveInterval) {
          clearInterval(this.speechKeepAliveInterval);
          this.speechKeepAliveInterval = null;
        }
        this.isSpeakingTTS = false;
        this.activeUtterance = null;

        // Restart recognition cleanly after speaking
        if (this.isListening && this.activeHandlers) {
          setTimeout(() => {
            this.safeRestartRecognition();
          }, 200);
        }

        resolve();
      };

      utterance.onend = cleanupAndResolve;
      utterance.onerror = (err) => {
        // Ignore aborted errors
        cleanupAndResolve();
      };

      // Speak with a tiny 30ms delay to let the audio buffer stabilize
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          cleanupAndResolve();
        }
      }, 30);
    });
  }

  // Web Audio API synthesized earcons (listen start, success chime, cancel)
  public playEarcon(type: 'listen' | 'success' | 'cancel' = 'listen') {
    if (this.ttsMuted || typeof window === 'undefined') return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;

      const ctx = new AudioCtxClass();
      const now = ctx.currentTime;

      if (type === 'listen') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 triad
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const noteTime = now + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.06, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.2);
        });
      } else if (type === 'cancel') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        osc.frequency.exponentialRampToValueAtTime(349.23, now + 0.12); // F4
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.16);
      }
    } catch (e) {}
  }
}

export const speechService = new SpeechService();
