import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { isSpeechRecognitionSupported } from '../services/speechService';

interface VoiceControllerProps {
  isListening: boolean;
  onToggleListen: () => void;
  liveTranscript: string;
  lastFeedback: { message: string; success: boolean; intent?: string } | null;
  audioLevel: number;
  onExecuteCommand: (text: string) => void;
  selectedLangCode: string;
}

const QUICK_COMMANDS: Record<string, string[]> = {
  'en-US': [
    'Add milk',
    'I need 3 apples',
    'Add 2 bottles of water',
    'Buy 5 oranges',
    'Find toothpaste under $5',
    'Remove milk from my list',
    'What do you suggest?'
  ],
  'es-ES': [
    'Añadir 2 manzanas',
    'Necesito leche',
    'Comprar 3 plátanos',
    'Buscar manzanas bajo 5 dólares',
    'Eliminar leche',
    'Sugerencias'
  ],
  'fr-FR': [
    'Ajouter 2 pommes',
    'J’ai besoin de lait',
    'Acheter du pain',
    'Supprimer le lait',
    'Suggestions'
  ],
  'de-DE': [
    '2 Äpfel hinzufügen',
    'Ich brauche Milch',
    'Zahnpasta unter 5 Euro finden',
    'Milch entfernen',
    'Vorschläge'
  ],
  'hi-IN': [
    'दूध जोड़ो',
    '२ सेब चाहिए',
    'पानी की २ बोतलें जोड़ो',
    'दूध हटाओ',
    'सुझाव दिखाओ'
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
      {/* Top Header / Audio Status */}
      <div className="flex flex-col items-center text-center mb-4">
        
        {/* Main Microphone Action Button */}
        <div className="relative my-2">
          {/* Animated Pulse Rings when listening */}
          {isListening && (
            <>
              <div
                className="absolute -inset-3 rounded-full bg-emerald-500/20 animate-ping"
                style={{ animationDuration: '2s' }}
              />
              <div
                className="absolute -inset-6 rounded-full bg-emerald-500/10 animate-pulse"
                style={{ transform: `scale(${1 + audioLevel / 200})` }}
              />
            </>
          )}

          <button
            onClick={onToggleListen}
            aria-label={isListening ? 'Stop listening' : 'Start voice command'}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse-slow'
                : 'bg-gradient-to-tr from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-9 h-9 animate-bounce" />
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
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {isListening ? 'Listening for commands...' : 'Tap the microphone or type below'}
          </span>
        </div>

        {/* Audio Wave Visualizer Bars when listening */}
        {isListening && (
          <div className="flex items-center justify-center gap-1 mt-3 h-6">
            {[40, 70, 95, 60, 85, 100, 75, 50, 80, 45].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-emerald-500 rounded-full transition-all duration-150"
                style={{
                  height: `${Math.max(6, (height * audioLevel) / 100)}px`,
                  opacity: Math.max(0.4, audioLevel / 100),
                }}
              />
            ))}
          </div>
        )}

        {/* Live Speech Transcript Preview */}
        {liveTranscript && (
          <div className="mt-3 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-lg w-full text-center">
            <span className="text-xs text-slate-400 block mb-0.5">Hearing:</span>
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 italic">
              "{liveTranscript}"
            </p>
          </div>
        )}

        {/* Feedback Banner */}
        {lastFeedback && !liveTranscript && (
          <div
            className={`mt-3 px-4 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-2 max-w-lg w-full transition-all ${
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
            placeholder='Try typing "Add 2 bottles of water" or "Find apples under $5"...'
            className="w-full pl-4 pr-10 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          disabled={!manualText.trim()}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-sm font-medium rounded-xl transition-colors flex items-center justify-center shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Voice Command Suggestion Chips */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Voice Prompts (Click to test)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {currentQuickCommands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => onExecuteCommand(cmd)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 dark:bg-slate-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
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
