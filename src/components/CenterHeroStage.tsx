import React, { useState } from 'react';
import { IridescentOrb } from './IridescentOrb';
import { Search, Mic, MicOff, Send, Command } from 'lucide-react';

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

  const realCommandExamples = [
    { label: 'Fresh Produce', cmd: 'Add 3 Organic Honeycrisp Apples' },
    { label: 'Dairy', cmd: 'Add 2 Gallons of Whole Milk' },
    { label: 'Electronics', cmd: 'Add Wireless Bluetooth Earphones' },
    { label: 'Price Filter', cmd: 'Find Colgate Toothpaste under $5' },
    { label: 'Seasonal', cmd: 'What is in season and on sale?' },
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col items-center text-center space-y-4">
      
      {/* 1. Center Hero 3D Orb */}
      <div className="relative group cursor-pointer" onClick={onToggleListen}>
        <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 20} />
      </div>

      {/* 2. Structured Status Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
        <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          {isListening
            ? isHandsFree
              ? 'Hands-Free Listening Active • Speak your command anytime'
              : 'Listening... (auto-processing on speech pause)'
            : isHandsFree
            ? 'Hands-Free Standby • Say "Hey Assistant"'
            : 'Voice Assistant Ready • Click Orb or Microphone to speak'}
        </span>
      </div>

      {/* 3. Real-Time Live Speech Subtitle Display */}
      {liveTranscript && (
        <div className="max-w-xl w-full px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
            Hearing Live:
          </span>
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
            "{liveTranscript}"
          </p>
        </div>
      )}

      {/* 4. Structured Command Input Bar */}
      <div className="max-w-2xl w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700"
        >
          <button
            type="button"
            onClick={onOpenCatalog}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors shrink-0"
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
                ? 'Say "Hey Assistant, add milk" or type a command...'
                : 'Type or speak: "Add 2 bottles of milk", "Find earphones"...'
            }
            className="flex-1 bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {inputText.trim() && (
            <button
              type="submit"
              className="p-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Microphone Action Button */}
          <button
            type="button"
            onClick={onToggleListen}
            className={`p-2.5 rounded-lg text-white font-bold transition-all shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-orange-600 ring-2 ring-orange-400'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* 5. Minimalist Command Prompts Bar */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
          <Command className="w-3 h-3" />
          <span>Examples:</span>
        </span>
        {realCommandExamples.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(item.cmd)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors"
          >
            "{item.cmd}"
          </button>
        ))}
      </div>

    </div>
  );
};
