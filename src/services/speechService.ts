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

  constructor() {
    this.initRecognition();
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
      window.speechSynthesis.cancel();
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
      // Auto-restart if hands-free/continuous listening is active and not currently playing TTS
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
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
    } catch (err: any) {
      // Already running is okay
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
          // Ignore if already started
        }
      }
    }, 60);
  }

  public stopListening() {
    this.isListening = false;
    this.activeHandlers = null;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {}
    }
    this.stopAudioVisualizer();
  }

  private async startAudioVisualizer(onAudioLevel?: (level: number) => void) {
    if (!onAudioLevel || typeof window === 'undefined') return;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !this.mediaStream) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        this.mediaStream = stream;
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContextClass();
        const source = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 64;
        source.connect(this.analyser);

        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        const tick = () => {
          if (!this.analyser || !this.isListening) return;
          this.analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          const normalized = Math.min(100, Math.round((avg / 255) * 100 * 2));
          onAudioLevel(normalized);
          this.animFrameId = requestAnimationFrame(tick);
        };

        this.animFrameId = requestAnimationFrame(tick);
      }
    } catch (err) {
      console.warn('AudioVisualizer mic access unavailable:', err);
    }
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

  // Select warm, natural female voice across platforms (Zira, Samantha, Google, Victoria, Swara, etc.)
  private getBestFemaleVoice(langCode: string): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const shortLang = langCode.substring(0, 2).toLowerCase();
    const exactLang = langCode.toLowerCase().replace('_', '-');

    const preferredFemaleKeywords = [
      'female', 'woman', 'zira', 'samantha', 'victoria', 'karen', 'moira',
      'fiona', 'tessa', 'sangeeta', 'veena', 'priya', 'swara', 'monica',
      'amelie', 'marie', 'petra', 'marlene', 'vicki', 'natural', 'online',
      'google', 'microsoft'
    ];

    const langVoices = voices.filter((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      return vLang === exactLang || vLang.startsWith(shortLang);
    });

    if (langVoices.length === 0) {
      return voices.find((v) => {
        const name = v.name.toLowerCase();
        return preferredFemaleKeywords.some((kw) => name.includes(kw));
      }) || voices[0] || null;
    }

    const femaleMatch = langVoices.find((v) => {
      const name = v.name.toLowerCase();
      if (name.includes('david') || name.includes('george') || name.includes('mark') || name.includes('male') || name.includes('ravi') || name.includes('guy')) {
        return false;
      }
      return preferredFemaleKeywords.some((kw) => name.includes(kw));
    });

    if (femaleMatch) return femaleMatch;

    const nonMale = langVoices.find((v) => !v.name.toLowerCase().includes('male') && !v.name.toLowerCase().includes('david'));
    return nonMale || langVoices[0];
  }

  public speak(text: string, langCode: string = this.currentLanguage): Promise<void> {
    return new Promise((resolve) => {
      if (this.ttsMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.isSpeakingTTS = true;
      window.speechSynthesis.cancel();

      // Temporarily abort recognition to avoid hearing ourselves
      if (this.recognition) {
        try {
          this.recognition.abort();
        } catch (e) {}
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 1.0;
      utterance.pitch = 1.08; // Slightly elevated pitch for warm, friendly, natural female voice tone

      const matchedVoice = this.getBestFemaleVoice(langCode);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      const resumeAfterTTS = () => {
        this.isSpeakingTTS = false;
        if (this.isListening && this.activeHandlers) {
          this.safeRestartRecognition();
        }
        resolve();
      };

      utterance.onend = resumeAfterTTS;
      utterance.onerror = resumeAfterTTS;

      window.speechSynthesis.speak(utterance);
    });
  }

  // Web Audio API synthesized earcons (listen start, success chime, cancel)
  public playEarcon(type: 'listen' | 'success' | 'cancel' = 'listen') {
    if (this.ttsMuted || typeof window === 'undefined') return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtxClass) return;
      const ctx = new AudioCtxClass();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'listen') {
        // Soft rising two-tone wake chime (523Hz -> 659Hz)
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.12);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } else if (type === 'success') {
        // Harmonic confirmation triad (523Hz -> 659Hz -> 784Hz)
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.06, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.22);
        });
      } else if (type === 'cancel') {
        // Gentle descending tone (659Hz -> 440Hz)
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, now);
        osc.frequency.exponentialRampToValueAtTime(440.0, now + 0.15);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
      }
    } catch (e) {
      console.warn('Earcon audio feedback unavailable:', e);
    }
  }
}

export const speechService = new SpeechService();
