import { LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en-US', name: 'English (US)', nativeName: 'English (US)', flag: '🇺🇸', speechCode: 'en-US' },
  { code: 'en-IN', name: 'English (India)', nativeName: 'English (India)', flag: '🇮🇳', speechCode: 'en-IN' },
  { code: 'en-GB', name: 'English (UK)', nativeName: 'English (UK)', flag: '🇬🇧', speechCode: 'en-GB' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
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
  private currentLanguage: string = 'en-US';
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private ttsMuted: boolean = false;
  private isSpeakingTTS: boolean = false;
  private activeHandlers: SpeechRecognitionHandlers | null = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      this.recognition = new SpeechRecognitionAPI();
      // Continuous = true allows complete sentences without early cutoffs
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

  public startListening(handlers: SpeechRecognitionHandlers) {
    if (this.isSpeakingTTS) {
      return;
    }

    this.activeHandlers = handlers;

    if (!this.recognition) {
      this.initRecognition();
    }

    if (!this.recognition) {
      handlers.onError('Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
      return;
    }

    if (this.isListening) {
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      handlers.onStart();
      this.startAudioVisualizer(handlers.onAudioLevel);
    };

    this.recognition.onresult = (event: any) => {
      if (this.isSpeakingTTS) return;

      let fullTranscript = '';
      let hasFinal = false;

      // Accumulate entire sentence across all results
      for (let i = 0; i < event.results.length; ++i) {
        const res = event.results[i];
        fullTranscript += res[0].transcript + ' ';
        if (res.isFinal) {
          hasFinal = true;
        }
      }

      const clean = fullTranscript.trim();
      if (clean) {
        handlers.onResult(clean, hasFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      if (event.error === 'no-speech') {
        // Natural pause - do not abort or disconnect
        return;
      }
      if (event.error === 'aborted') {
        return;
      }

      let msg = 'Speech recognition error';
      if (event.error === 'not-allowed') {
        msg = 'Microphone access denied. Please allow microphone permission in your browser URL bar.';
      } else if (event.error === 'network') {
        msg = 'Network connection issue with speech service.';
      }

      this.isListening = false;
      this.stopAudioVisualizer();
      handlers.onError(msg);
    };

    this.recognition.onend = () => {
      this.stopAudioVisualizer();

      // If user is still marked as listening and TTS is not active, auto-restart to prevent unexpected dropouts
      if (this.isListening && !this.isSpeakingTTS && this.activeHandlers) {
        try {
          this.recognition.start();
          return;
        } catch (e) {
          // Ignore if already starting
        }
      }

      this.isListening = false;
      handlers.onEnd();
    };

    try {
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
    } catch (err: any) {
      console.warn('SpeechRecognition start error:', err);
    }
  }

  public stopListening() {
    this.isListening = false;
    this.activeHandlers = null;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        console.warn('Error stopping recognition', err);
      }
    }
    this.stopAudioVisualizer();
  }

  private async startAudioVisualizer(onAudioLevel?: (level: number) => void) {
    if (!onAudioLevel || typeof window === 'undefined') return;

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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

  public speak(text: string, langCode: string = this.currentLanguage): Promise<void> {
    return new Promise((resolve) => {
      if (this.ttsMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
        resolve();
        return;
      }

      this.isSpeakingTTS = true;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(
        (v) => v.lang.startsWith(langCode.substring(0, 2)) || v.lang === langCode
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => {
        this.isSpeakingTTS = false;
        resolve();
      };
      utterance.onerror = () => {
        this.isSpeakingTTS = false;
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }
}

export const speechService = new SpeechService();
