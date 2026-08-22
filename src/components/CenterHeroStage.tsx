import React, { useState } from 'react';
import { IridescentOrb } from './IridescentOrb';
import { 
  Apple, 
  Milk, 
  Headphones, 
  Filter, 
  Mic, 
  MicOff, 
  Search, 
  Send,
  Zap
} from 'lucide-react';

interface CenterHeroStageProps {
  liveTranscript: string;
  isListening: boolean;
  audioLevel: number;
  onToggleListen: () => void;
  onQuickPrompt: (prompt: string) => void;
  onOpenCatalog: () => void;
  onExecuteCommand: (text: string) => void;
  isHandsFree: boolean;
}

export const CenterHeroStage: React.FC<CenterHeroStageProps> = ({
  liveTranscript,
  isListening,
  audioLevel,
  onToggleListen,
  onQuickPrompt,
  onOpenCatalog,
  onExecuteCommand,
  isHandsFree,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onExecuteCommand(inputText.trim());
      setInputText('');
    }
  };

  const quickShortcuts = [
    {
      icon: <Apple className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
      label: 'Produce',
      cmd: 'Add 3 Honeycrisp apples',
    },
    {
      icon: <Milk className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
      label: 'Dairy',
      cmd: 'Add 2 gallons of milk',
    },
    {
      icon: <Headphones className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
      label: 'Tech',
      cmd: 'Add wireless earphones',
    },
    {
      icon: <Filter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
      label: 'Budget',
      cmd: 'Find toothpaste under $5',
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col items-center text-center space-y-4">
      
      {/* 1. Center Hero 3D Orb */}
      <div className="relative group cursor-pointer" onClick={onToggleListen}>
        <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 22} />
        
        <div className="absolute -bottom-2.5 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md flex items-center gap-1">
            <Mic className="w-3 h-3" />
            <span>{isListening ? 'Pause Mic' : 'Click to Speak'}</span>
          </span>
        </div>
      </div>

      {/* 2. Hero Status Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 shadow-2xs">
        <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {isListening
            ? isHandsFree
              ? '🎙️ Hands-Free Mode: Speak your full command anytime'
              : 'Listening... (auto-processing on silence)'
            : isHandsFree
            ? 'Hands-Free Ready • Say "Hey Assistant"'
            : 'Click the Center Orb or Mic below to speak'}
        </span>
      </div>

      {/* 3. Real-Time Live Speech Subtitle Banner */}
      {liveTranscript && (
        <div className="max-w-xl w-full px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 shadow-sm animate-in fade-in">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-0.5">
            Hearing Live:
          </span>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
            "{liveTranscript}"
          </p>
        </div>
      )}

      {/* 4. Center Command Input Bar */}
      <div className="max-w-2xl w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-50 dark:bg-zinc-800/90 border border-slate-200 dark:border-zinc-700 shadow-xs"
        >
          <button
            type="button"
            onClick={onOpenCatalog}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors shrink-0"
            title="Browse Catalog"
          >
            <Search className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isHandsFree
                ? 'Say "Hey Assistant, add milk" or type here...'
                : 'Speak or type: "Add 2 bottles of milk", "Find earphones"...'
            }
            className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {inputText.trim() && (
            <button
              type="submit"
              className="p-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:scale-105 transition-transform shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          )}

          {/* Glowing Orange Microphone Button */}
          <button
            type="button"
            onClick={onToggleListen}
            className={`p-3 rounded-xl text-white font-bold transition-all shadow-md shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-gradient-to-tr from-orange-600 to-amber-500 animate-pulse ring-2 ring-orange-400'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:scale-105'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* 5. Clean Voice Shortcut Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>Quick Prompts:</span>
        </span>
        {quickShortcuts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(item.cmd)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            {item.icon}
            <span>"{item.cmd}"</span>
          </button>
        ))}
      </div>

    </div>
  );
};
