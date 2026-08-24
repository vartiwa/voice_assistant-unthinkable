import { LanguageOption } from '../types';

export interface SpeechRecognitionHandlers {
  onStart: () => void;
  onEnd: () => void;
  onResult: (transcript: string, isFinal?: boolean) => void;
  onError: (error: string) => void;
  onAudioLevel?: (level: number) => void;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', speechCode: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi', speechCode: 'hi-IN', name: 'हिन्दी (Hindi)', flag: '🇮🇳' },
  { code: 'ta', speechCode: 'ta-IN', name: 'தமிழ் (Tamil)', flag: '🇮🇳' },
  { code: 'en-US', speechCode: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', speechCode: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es', speechCode: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', speechCode: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'de', speechCode: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
];

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private currentLanguage: string = 'en-IN';
  private ttsMuted: boolean = false;
  private activeHandlers: SpeechRecognitionHandlers | null = null;
  private restartTimeout: NodeJS.Timeout | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private visualizerStream: MediaStream | null = null;
  private visualizerAnimFrame: number | null = null;
  private isSpeakingTTS: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;
  private speechKeepAliveInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return null;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      return null;
    }

    try {
      const rec = new SpeechRecognitionClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = this.currentLanguage;
      this.recognition = rec;
      return rec;
    } catch (e) {
      console.warn('SpeechRecognition initialization error:', e);
      return null;
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
      // Don't process recognition while TTS voice is speaking feedback
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
      if (event.error === 'no-speech' || event.error === 'aborted') {
        // Normal pause - continuous loop keeps running
        if (this.isListening && !this.isSpeakingTTS) {
          this.safeRestartRecognition();
        }
        return;
      }

      let msg = 'Speech recognition error';
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission denied. Please allow mic access in your browser.';
        this.isListening = false;
        this.stopAudioVisualizer();
        if (this.activeHandlers) this.activeHandlers.onError(msg);
        return;
      }

      if (this.isListening && !this.isSpeakingTTS) {
        this.safeRestartRecognition();
      }
    };

    this.recognition.onend = () => {
      // Auto-restart if listening is active
      if (this.isListening && this.activeHandlers) {
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
    } catch (e: any) {
      if (e.name !== 'InvalidStateError') {
        this.safeRestartRecognition();
      }
    }
  }

  public safeRestartRecognition() {
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
    }
    this.restartTimeout = setTimeout(() => {
      if (this.isListening && !this.isSpeakingTTS) {
        if (!this.recognition) {
          this.initRecognition();
        }
        if (this.recognition) {
          try {
            this.recognition.start();
          } catch (e: any) {
            // Already started or busy, which is fine
          }
        }
      }
    }, 150);
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

      if (!this.visualizerStream) {
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then((stream) => {
            this.visualizerStream = stream;
            if (!this.audioContext) return;
            const source = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            this.analyser.smoothingTimeConstant = 0.8;
            source.connect(this.analyser);

            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

            const updateLoop = () => {
              if (!this.isListening) return;
              if (this.analyser) {
                this.analyser.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                  sum += dataArray[i];
                }
                const average = sum / dataArray.length;
                const normalized = Math.min(100, Math.round((average / 128) * 100));
                onAudioLevel(normalized);
              }
              this.visualizerAnimFrame = requestAnimationFrame(updateLoop);
            };

            this.visualizerAnimFrame = requestAnimationFrame(updateLoop);
          })
          .catch((_err) => {
            // Simulated audio heartbeat if mic stream blocked
            let simulatedLevel = 25;
            const simulateLoop = () => {
              if (!this.isListening) return;
              simulatedLevel = 20 + Math.sin(Date.now() / 200) * 15;
              onAudioLevel(Math.round(simulatedLevel));
              this.visualizerAnimFrame = requestAnimationFrame(simulateLoop);
            };
            this.visualizerAnimFrame = requestAnimationFrame(simulateLoop);
          });
      }
    } catch (e) {
      console.warn('Audio Visualizer setup error:', e);
    }
  }

  private stopAudioVisualizer() {
    if (this.visualizerAnimFrame) {
      cancelAnimationFrame(this.visualizerAnimFrame);
      this.visualizerAnimFrame = null;
    }
    if (this.visualizerStream) {
      this.visualizerStream.getTracks().forEach((track) => track.stop());
      this.visualizerStream = null;
    }
  }

  // Voice Selection for Indian English, Hindi, Tamil & International
  private getBestFemaleVoice(langCode: string): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const femaleKeywords = [
      'female', 'zira', 'kavya', 'sangeeta', 'heera', 'swara', 'veena',
      'priya', 'neerja', 'ananya', 'geeta', 'samantha', 'victoria', 
      'karen', 'moira', 'tessa', 'helena', 'catherine', 'hazel', 'susan', 
      'serena', 'luciana', 'amira', 'monica', 'paulina', 'clara', 'marta', 
      'julie', 'celine', 'hortense', 'lea', 'hedda', 'marlene', 'vicki'
    ];

    const isFemaleName = (name: string) => {
      const lower = name.toLowerCase();
      return femaleKeywords.some((kw) => lower.includes(kw));
    };

    // 1. Language + Female exact match
    const langFemales = voices.filter((v) => {
      const langMatches = v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase().split('-')[0]);
      return langMatches && isFemaleName(v.name);
    });
    if (langFemales.length > 0) return langFemales[0];

    // 2. Language match
    const langMatches = voices.filter((v) => {
      return v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase().split('-')[0]);
    });
    if (langMatches.length > 0) return langMatches[0];

    // 3. Indian English / Global female voice fallback
    const indianFemales = voices.filter((v) => 
      v.lang.toLowerCase().includes('en-in') || 
      (v.lang.toLowerCase().includes('en') && isFemaleName(v.name))
    );
    if (indianFemales.length > 0) return indianFemales[0];

    // 4. Any female voice
    const anyFemale = voices.find((v) => isFemaleName(v.name));
    if (anyFemale) return anyFemale;

    const safeVoice = voices.find((v) => !v.name.toLowerCase().includes('david') && !v.name.toLowerCase().includes('george') && !v.name.toLowerCase().includes('mark') && !v.name.toLowerCase().includes('male'));
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

        // Auto-resume recognition smoothly after speaking finishes
        if (this.isListening && this.activeHandlers) {
          setTimeout(() => {
            this.safeRestartRecognition();
          }, 150);
        }

        resolve();
      };

      utterance.onend = cleanupAndResolve;
      utterance.onerror = (_err) => {
        cleanupAndResolve();
      };

      // Speak with a tiny delay to let the audio buffer stabilize
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
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === 'success') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(659.25, now + 0.08); // E5
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.1);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.23);
      } else if (type === 'cancel') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.12);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      }
    } catch (e) {
      // AudioContext policy fallback
    }
  }
}

export const speechService = new SpeechService();
