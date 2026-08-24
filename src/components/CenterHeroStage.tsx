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
  Activity,
  Radio,
  Sparkles,
  HelpCircle,
  Volume2
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
      setCurrentDateStr(now.toLocaleDateString('en-IN', options));
      setCurrentTimeStr(now.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }));

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
    { label: 'Dairy', icon: '🥛', cmd: 'Add 2 packets of Amul milk' },
    { label: 'Produce', icon: '🍎', cmd: 'Add 1 kg Shimla apples' },
    { label: 'Pantry', icon: '🌾', cmd: 'Add 5 kg Aashirvaad Atta' },
    { label: 'Veggies', icon: '🍅', cmd: 'Add 1 kg tomatoes and 2 kg potatoes' },
    { label: 'Breakfast', icon: '🥚', cmd: 'Add 1 dozen eggs and 1 bread' },
    { label: 'Snacks', icon: '🍪', cmd: 'Add 2 packets Maggi and Parle-G' },
    { label: 'Tea', icon: '☕', cmd: 'Add Tata Tea and 1 kg sugar' },
    { label: 'Hindi', icon: '🇮🇳', cmd: '2 packet paneer aur doodh add karo' },
    { label: 'Tamil', icon: '🇮🇳', cmd: '1 kg thakkali and arisi venum' },
    { label: 'Budget', icon: '🏷️', cmd: 'Find snacks under ₹50' },
    { label: 'Done', icon: '😴', cmd: 'Ok done' },
  ];

  // Dynamic Equalizer visualizer bars (7 bars)
  const barHeights = [
    Math.min(100, Math.max(18, (audioLevel * 1.3) % 100)),
    Math.min(100, Math.max(28, (audioLevel * 1.9) % 100)),
    Math.min(100, Math.max(45, (audioLevel * 2.5) % 100)),
    Math.min(100, Math.max(60, (audioLevel * 2.8) % 100)),
    Math.min(100, Math.max(42, (audioLevel * 2.4) % 100)),
    Math.min(100, Math.max(26, (audioLevel * 1.7) % 100)),
    Math.min(100, Math.max(18, (audioLevel * 1.2) % 100)),
  ];

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-4">
      
      {/* Top Row matching Sketch: Time/Date box on left + Spacious Open Hero Stage for Orb */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        
        {/* Left: Time & Date Box from Sketch */}
        <div className="sm:col-span-4 text-left p-4 rounded-2xl bg-stone-50/90 dark:bg-zinc-800/60 border border-stone-200 dark:border-zinc-700/80 space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-stone-200/80 dark:border-zinc-700/60">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 dark:text-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{currentDateStr}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono font-semibold text-slate-400">
              <Clock className="w-3 h-3" />
              <span>{currentTimeStr}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <RotateCcw className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>Restock Cycle</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-stone-200 dark:border-zinc-700">
                {daysToMonthEnd} days left
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="w-full h-1.5 bg-stone-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(10, 100 - (daysToMonthEnd / 30) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Spacious Dedicated Hero Pedestal for the 3D Orb */}
        <div className="sm:col-span-8 flex items-center justify-center gap-6 sm:gap-8 py-5 sm:py-7 px-4 sm:px-6 bg-stone-50/80 dark:bg-zinc-800/40 rounded-2xl border border-stone-200/90 dark:border-zinc-800/80">
          
          {/* 3D Orb with Generous Breathing Room */}
          <div 
            className="cursor-pointer shrink-0 transition-transform active:scale-95 hover:scale-105" 
            onClick={onToggleListen}
          >
            <IridescentOrb size="hero" isListening={isListening} audioLevel={audioLevel || 20} />
          </div>

          {/* Interactive Live Audio Visualizer & Voice Status */}
          <div className="flex flex-col items-start gap-2">
            <div 
              onClick={onToggleListen}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs font-semibold cursor-pointer hover:bg-stone-100 dark:hover:bg-zinc-700 transition-all shadow-xs"
            >
              {isListening ? (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-end gap-0.5 h-3.5">
                    {barHeights.map((h, i) => (
                      <span
                        key={i}
                        className="w-0.5 bg-emerald-500 rounded-full transition-all duration-75"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-300 font-extrabold text-xs tracking-wider flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>{isHandsFree ? 'HANDS-FREE LISTENING' : 'LISTENING...'}</span>
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{isHandsFree ? 'Hands-Free: Speak Directly' : 'Click Orb to Speak'}</span>
                </div>
              )}
            </div>

            <span className="text-[10.5px] font-mono text-slate-400 pl-1">
              Multilingual Voice Assistant · Natural Speech
            </span>
          </div>
        </div>

      </div>

      {/* Prominent Voice Assistant Greeting Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 shadow-2xs">
        <div className="w-7 h-7 rounded-xl bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
          <Volume2 className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white leading-tight">
            "Hello! What do you need to add? Tell me, or say 'Stop'."
          </p>
          <p className="text-[10.5px] text-emerald-800 dark:text-emerald-300 font-medium mt-0.5">
            🎙️ Continuous Hands-Free Listening active. Speak any item or say <span className="font-bold underline">"Stop"</span> / <span className="font-bold underline">"Ok done"</span> to sleep.
          </p>
        </div>
      </div>

      {/* Real-Time Live Speech Subtitle Display */}
      {liveTranscript && (
        <div className="w-full px-4 py-2.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-left animate-in fade-in">
          <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <span>HEARING REAL-TIME:</span>
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>TRANSCRIBING</span>
            </span>
          </div>
          <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight mt-0.5">
            "{liveTranscript}"
          </p>
        </div>
      )}

      {/* Command Input Dock */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/80 border border-stone-200 dark:border-zinc-700 shadow-2xs"
      >
        <button
          type="button"
          onClick={onOpenCatalog}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-zinc-700 transition-colors shrink-0"
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
              ? 'Hands-Free Active: Speak directly ("Add 2 packets milk", "Add atta", "Stop")...'
              : 'Speak or type: "Add 2 packets milk", "Add 5 kg atta", "Find snacks under ₹50"...'
          }
          className="flex-1 bg-transparent px-2.5 py-1 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
        />

        {inputText.trim() && (
          <button
            type="submit"
            className="p-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold text-xs shrink-0 hover:opacity-90 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Tactile Microphone Trigger */}
        <button
          type="button"
          onClick={onToggleListen}
          className={`p-2 sm:px-3.5 rounded-xl text-white font-bold transition-all shrink-0 flex items-center gap-1.5 shadow-xs ${
            isListening
              ? 'bg-orange-600 ring-2 ring-orange-400 animate-pulse'
              : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
          }`}
          title={isListening ? 'Stop Listening' : 'Start Voice Input'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span className="hidden sm:inline text-xs font-bold">
            {isListening ? 'Stop' : 'Speak'}
          </span>
        </button>
      </form>

      {/* Things You Can Ask To Add (Showcase of Spoken Examples) */}
      <div className="space-y-1.5 pt-0.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1 uppercase tracking-wider">
            <span>🗣️ THINGS YOU CAN ASK TO ADD:</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">Click any pill to try</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {realCommandExamples.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickPrompt(item.cmd)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-stone-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-all border border-stone-200 dark:border-zinc-700 shadow-2xs hover:border-stone-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-1.5"
            >
              <span>{item.icon}</span>
              <span>"{item.cmd}"</span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
