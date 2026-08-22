import React, { useState, useEffect } from 'react';
import { IridescentOrb } from './IridescentOrb';
import { SmartSuggestion } from '../types';
import { 
  Search, 
  Mic, 
  MicOff, 
  Send, 
  Command, 
  Calendar, 
  Clock, 
  RotateCcw, 
  Sparkles, 
  Plus, 
  Check 
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
  suggestions?: SmartSuggestion[];
  onAddSuggestion?: (suggestion: SmartSuggestion) => void;
  addedSuggestionIds?: Set<string>;
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
  suggestions = [],
  onAddSuggestion,
  addedSuggestionIds = new Set(),
}) => {
  const [inputText, setInputText] = useState('');
  const [currentDateStr, setCurrentDateStr] = useState('');
  const [currentTimeStr, setCurrentTimeStr] = useState('');
  const [daysToMonthEnd, setDaysToMonthEnd] = useState(0);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      };
      setCurrentDateStr(now.toLocaleDateString('en-US', options));
      setCurrentTimeStr(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }));

      const currentDay = now.getDate();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      setDaysToMonthEnd(lastDayOfMonth - currentDay);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 30000);
    return () => clearInterval(interval);
  }, []);

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
  ];

  // Top 2-3 prominent suggestions (Habitual + Seasonal) to flank the orb on the right
  const flankSuggestions = suggestions.slice(0, 2);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
      
      {/* 3-Column Top Hero Row: [Left Context] --- [Center 3D Orb] --- [Right Flank Suggestions] */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Left Flank (3 or 4 cols): Subtle Date/Time & Month-End Cycle Widget */}
        <div className="md:col-span-3 lg:col-span-3 text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 space-y-2 hidden md:block">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDateStr}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{currentTimeStr}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Month-End Cycle</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white dark:bg-zinc-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-600">
                {daysToMonthEnd}d left
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 leading-tight">
              Pantry & household staple restock window active.
            </p>
          </div>
        </div>

        {/* Center Primary Hero Stage (6 cols): 3D Orb & Status */}
        <div className="md:col-span-6 lg:col-span-6 flex flex-col items-center text-center space-y-2.5">
          <div className="relative group cursor-pointer" onClick={onToggleListen}>
            <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 20} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {isListening
                ? isHandsFree
                  ? 'Hands-Free Active • Speak command anytime'
                  : 'Listening... (auto-processing on pause)'
                : isHandsFree
                ? 'Hands-Free Ready • Say "Hey Assistant"'
                : 'Click Orb or Microphone to speak'}
            </span>
          </div>
        </div>

        {/* Right Flank (3 or 4 cols): Subtle Habitual & Seasonal Suggestions Widget */}
        <div className="md:col-span-3 lg:col-span-3 text-left p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/80 space-y-2 hidden md:block">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Routine & Harvest</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Suggestions</span>
          </div>

          <div className="space-y-1.5">
            {flankSuggestions.map((sug) => {
              const isAdded = addedSuggestionIds.has(sug.id);

              return (
                <div
                  key={sug.id}
                  className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-700"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                      {sug.item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      ${sug.item.price.toFixed(2)} • {sug.badge}
                    </span>
                  </div>

                  {onAddSuggestion && (
                    <button
                      onClick={() => onAddSuggestion(sug)}
                      disabled={isAdded}
                      className={`p-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200'
                          : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90'
                      }`}
                      title={isAdded ? 'Added' : 'Add to cart'}
                    >
                      {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Real-Time Live Speech Subtitle Display */}
      {liveTranscript && (
        <div className="max-w-xl mx-auto w-full px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block mb-0.5">
            Hearing Live:
          </span>
          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-tight">
            "{liveTranscript}"
          </p>
        </div>
      )}

      {/* Structured Center Command Input Bar */}
      <div className="max-w-2xl mx-auto w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 shadow-2xs"
        >
          <button
            type="button"
            onClick={onOpenCatalog}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors shrink-0"
            title="Browse Product Catalog"
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

          {/* Glowing Orange Microphone Button */}
          <button
            type="button"
            onClick={onToggleListen}
            className={`p-2.5 rounded-lg text-white font-bold transition-all shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-orange-600 ring-2 ring-orange-400 animate-pulse'
                : 'bg-orange-500 hover:bg-orange-600'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Minimalist Command Prompts Bar */}
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
