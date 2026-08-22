import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Zap, CheckCircle2, AlertCircle, ArrowRight, Radio } from 'lucide-react';
import { isSpeechRecognitionSupported } from '../services/speechService';

interface VoiceControllerProps {
  isListening: boolean;
  onToggleListen: () => void;
  liveTranscript: string;
  lastFeedback: { message: string; success: boolean; intent?: string } | null;
  audioLevel: number;
  onExecuteCommand: (text: string) => void;
  selectedLangCode: string;
  onForceProcessNow?: () => void;
  isHandsFree?: boolean;
  onToggleHandsFree?: () => void;
}

const QUICK_COMMANDS: Record<string, string[]> = {
  'en-US': [
    'Hey Assistant, add earphones',
    'Hey Assistant, I need 3 apples',
    'VoiceCart, add 2 bottles of water',
    'Hey Assistant, find toothpaste under $5',
    'Hey Assistant, remove milk',
    'Hey Assistant, what do you suggest?'
  ],
  'en-IN': [
    'Hey Assistant, add earphones',
    'VoiceCart, add 2 litres of milk',
    'Hey Assistant, I need 1 kg apples',
    'Hey Assistant, find coffee under 10 dollars',
    'VoiceCart, show suggestions'
  ],
  'es-ES': [
    'Hey Assistant, añadir auriculares',
    'Hey Assistant, añadir 2 manzanas',
    'VoiceCart, necesito leche',
    'Hey Assistant, buscar manzanas bajo 5 dólares',
    'VoiceCart, sugerencias'
  ],
  'fr-FR': [
    'Hey Assistant, ajouter des écouteurs',
    'VoiceCart, ajouter 2 pommes',
    'Hey Assistant, j’ai besoin de lait',
    'VoiceCart, suggestions'
  ],
  'de-DE': [
    'Hey Assistant, Kopfhörer hinzufügen',
    'VoiceCart, 2 Äpfel hinzufügen',
    'Hey Assistant, Zahnpasta unter 5 Euro finden',
    'VoiceCart, Vorschläge'
  ],
  'hi-IN': [
    'हे असिस्टेंट, इयरफ़ोन जोड़ो',
    'हे असिस्टेंट, दूध जोड़ो',
    'वॉइस कार्ट, २ सेब चाहिए',
    'हे असिस्टेंट, पानी की २ बोतलें जोड़ो',
    'वॉइस कार्ट, सुझाव दिखाओ'
  ]
};

export const VoiceController: React.FC<VoiceControllerProps> = ({
  isListening,
  onToggleListen,
  liveTranscript,
  lastFeedback,
  audioLevel,
  onExecuteCommand,
  selectedLangCode,
  onForceProcessNow,
  isHandsFree = false,
  onToggleHandsFree,
}) => {
  const [manualText, setManualText] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      onExecuteCommand(manualText.trim());
      setManualText('');
    }
  };

  const currentQuickCommands = QUICK_COMMANDS[selectedLangCode] || QUICK_COMMANDS['en-US'];

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-all">
      
      {/* Top Bar: Hands-Free Wake Word Toggle */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${isHandsFree ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Hands-Free Wake Word Mode
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hidden sm:inline">
            Say: "Hey Assistant" or "VoiceCart"
          </span>
        </div>

        {onToggleHandsFree && (
          <button
            onClick={onToggleHandsFree}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl transition-all ${
              isHandsFree
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isHandsFree ? 'bg-white animate-ping' : 'bg-slate-400'}`} />
            <span>{isHandsFree ? 'Hands-Free ON' : 'Turn ON Hands-Free'}</span>
          </button>
        )}
      </div>

      {/* Main Microphone Area */}
      <div className="flex flex-col items-center text-center mb-4">
        
        {/* Main Microphone Button */}
        <div className="relative my-2">
          {/* Animated Pulse Rings when listening */}
          {isListening && (
            <>
              <div
                className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
              <div
                className="absolute -inset-8 rounded-full bg-emerald-500/10 animate-pulse"
                style={{ transform: `scale(${1 + audioLevel / 180})` }}
              />
            </>
          )}

          <button
            onClick={onToggleListen}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse-slow ring-4 ring-rose-200 dark:ring-rose-950'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-9 h-9" />
            ) : (
              <Mic className="w-9 h-9" />
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full ${
              isListening ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          />
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isListening
              ? isHandsFree
                ? '🎙️ Hands-Free Active: Say "Hey Assistant, add earphones"...'
                : 'Listening continuously... Speak your full sentence'
              : isHandsFree
              ? 'Hands-Free Ready. Tap to re-activate mic'
              : 'Tap the microphone or enable Hands-Free mode'}
          </span>
        </div>

        {/* Audio Wave Visualizer Bars when listening */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 mt-3 h-7">
            {[30, 60, 90, 50, 80, 100, 70, 40, 85, 45, 65, 95].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-emerald-500 rounded-full transition-all duration-100"
                style={{
                  height: `${Math.max(8, (height * audioLevel) / 100)}px`,
                  opacity: Math.max(0.4, audioLevel / 100),
                }}
              />
            ))}
          </div>
        )}

        {/* Live Speech Transcript Preview with "Done" Action */}
        {liveTranscript && (
          <div className="mt-3 px-4 py-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 max-w-lg w-full text-center animate-in fade-in">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Hearing:
              </span>

              {isListening && onForceProcessNow && (
                <button
                  onClick={onForceProcessNow}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 transition-all shadow-sm"
                  title="Process this command now"
                >
                  <span>Done</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              "{liveTranscript}"
            </p>
            {isListening && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">
                Keep speaking, or pause for 1.8s to auto-process...
              </span>
            )}
          </div>
        )}

        {/* Feedback Banner */}
        {lastFeedback && !liveTranscript && (
          <div
            className={`mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 max-w-lg w-full transition-all ${
              lastFeedback.success
                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200/60 dark:border-emerald-800/60'
                : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-200 border border-amber-200/60 dark:border-amber-800/60'
            }`}
          >
            {lastFeedback.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            )}
            <span>{lastFeedback.message}</span>
          </div>
        )}
      </div>

      {/* Manual Input Fallback & Search Form */}
      <form onSubmit={handleManualSubmit} className="mt-2 flex gap-2 max-w-xl mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder='Type a command (e.g. "Add earphones", "Buy 3 apples", "Find toothpaste under $5")...'
            className="w-full pl-4 pr-10 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={!manualText.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Voice Command Suggestion Chips */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Wake Word & Voice Prompts (Tap to test)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentQuickCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => onExecuteCommand(cmd)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer font-medium"
            >
              💬 "{cmd}"
            </button>
          ))}
        </div>
      </div>

      {/* Browser Support Warning if needed */}
      {!isSupported && (
        <div className="mt-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>
            Speech recognition is optimized for Google Chrome, Microsoft Edge, and Safari. You can also use the text input box above.
          </span>
        </div>
      )}
    </div>
  );
};
