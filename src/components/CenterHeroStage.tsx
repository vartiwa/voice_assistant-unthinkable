import React, { useState, useEffect } from 'react';
import { IridescentOrb } from './IridescentOrb';
import { 
  Search, 
  Mic, 
  MicOff, 
  Send, 
  Calendar, 
  Clock, 
  RotateCcw, 
  Leaf,
  Activity
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
    { label: 'Produce', cmd: 'Add 3 Organic Honeycrisp Apples' },
    { label: 'Pantry', cmd: 'Add 1 kg Atta and 2 packets milk' },
    { label: 'Hindi', cmd: '2 packet paneer aur doodh add karo' },
    { label: 'Tamil', cmd: '1 kg thakkali and arisi venum' },
    { label: 'Filter', cmd: 'Find toothpaste under $5' },
  ];

  // Equalizer visualizer bars (5 bars)
  const barHeights = [
    Math.min(100, Math.max(15, (audioLevel * 1.2) % 100)),
    Math.min(100, Math.max(25, (audioLevel * 1.8) % 100)),
    Math.min(100, Math.max(35, (audioLevel * 2.2) % 100)),
    Math.min(100, Math.max(20, (audioLevel * 1.6) % 100)),
    Math.min(100, Math.max(15, (audioLevel * 1.1) % 100)),
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-4">
      
      {/* Top Row matching Sketch: Time/Date box on left + 3D Orb in middle */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        
        {/* Left: Time & Date Box from Sketch */}
        <div className="sm:col-span-4 text-left p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-700/60 space-y-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDateStr}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{currentTimeStr}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Month-End Cycle</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                {daysToMonthEnd}d left
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-1 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.max(10, 100 - (daysToMonthEnd / 30) * 100)}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-400 leading-tight">
              Pantry & household staple restock active.
            </p>
          </div>
        </div>

        {/* Center: The ORB from Sketch */}
        <div className="sm:col-span-8 flex flex-col items-center justify-center text-center space-y-2">
          <div className="relative group cursor-pointer" onClick={onToggleListen}>
            <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 20} />
          </div>

          {/* Audio Visualizer & Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-xs font-semibold">
            {isListening ? (
              <div className="flex items-center gap-1">
                <div className="flex items-end gap-0.5 h-3">
                  {barHeights.map((h, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-emerald-500 rounded-full transition-all duration-75"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold ml-1">
                  {isHandsFree ? 'LIVE (Hands-Free)' : 'LISTENING...'}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>{isHandsFree ? 'Say "Hey Assistant"' : 'Click Orb or Mic to Speak'}</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Real-Time Live Speech Subtitle Display */}
      {liveTranscript && (
        <div className="w-full px-4 py-2.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-left animate-in fade-in">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-0.5">
            <span>HEARING REAL-TIME:</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>TRANSCRIBING</span>
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
            "{liveTranscript}"
          </p>
        </div>
      )}

      {/* Command Input Dock */}
      <div className="w-full">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 shadow-2xs"
        >
          <button
            type="button"
            onClick={onOpenCatalog}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors shrink-0"
            title="Browse Catalog (⌘K)"
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
            className="flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {inputText.trim() && (
            <button
              type="submit"
              className="p-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Tactile Microphone Trigger */}
          <button
            type="button"
            onClick={onToggleListen}
            className={`p-2.5 rounded-xl text-white font-bold transition-all shrink-0 flex items-center justify-center ${
              isListening
                ? 'bg-orange-600 ring-2 ring-orange-400 animate-pulse'
                : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
            }`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </form>
      </div>

      {/* Clean Prompt Chips */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 pt-0.5">
        <span className="text-[10.5px] font-mono text-slate-400 mr-1 flex items-center gap-1">
          <Leaf className="w-3 h-3 text-emerald-500" />
          <span>PROMPTS:</span>
        </span>
        {realCommandExamples.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(item.cmd)}
            className="px-2.5 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10.5px] font-medium text-slate-700 dark:text-slate-300 transition-colors border border-slate-200/60 dark:border-zinc-700/60"
          >
            "{item.cmd}"
          </button>
        ))}
      </div>

    </div>
  );
};
