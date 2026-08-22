import React, { useState } from 'react';
import { IridescentOrb } from './IridescentOrb';
import { ChatMessage } from './VoiceChatStream';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Headphones, 
  Apple, 
  Milk, 
  Filter,
  Mic,
  MicOff,
  ArrowRight,
  Zap,
  Search,
  Send
} from 'lucide-react';

interface DesktopMainStageProps {
  messages: ChatMessage[];
  liveTranscript: string;
  isListening: boolean;
  audioLevel: number;
  onToggleListen: () => void;
  onQuickPrompt: (prompt: string) => void;
  onOpenCart: () => void;
  onOpenCatalog: () => void;
  onExecuteCommand: (text: string) => void;
  isHandsFree: boolean;
}

export const DesktopMainStage: React.FC<DesktopMainStageProps> = ({
  messages,
  liveTranscript,
  isListening,
  audioLevel,
  onToggleListen,
  onQuickPrompt,
  onOpenCart,
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

  // Clean vector SVG voice shortcuts
  const shoppingShortcuts = [
    {
      icon: <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      label: 'Organic Produce',
      example: 'Add 3 Honeycrisp apples',
    },
    {
      icon: <Milk className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      label: 'Dairy & Essentials',
      example: 'Add 2 gallons of milk',
    },
    {
      icon: <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      label: 'Tech & Electronics',
      example: 'Add wireless earphones',
    },
    {
      icon: <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      label: 'Budget Filter',
      example: 'Find toothpaste under $5',
    },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col space-y-4">
      
      {/* 1. Center Stage with 3D Plasma Orb */}
      <div className="flex flex-col items-center text-center pt-2 pb-1 space-y-2.5">
        
        {/* Compact 3D Ball */}
        <div className="relative group cursor-pointer" onClick={onToggleListen}>
          <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 20} />
          
          <div className="absolute -bottom-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md flex items-center gap-1">
              <Mic className="w-3 h-3" />
              <span>{isListening ? 'Stop Mic' : 'Click to Speak'}</span>
            </span>
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 shadow-2xs">
          <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {isListening
              ? isHandsFree
                ? '🎙️ Hands-Free Mode: Speak your command anytime'
                : 'Listening... (auto-processes upon silence)'
              : isHandsFree
              ? 'Hands-Free Ready • Say "Hey Assistant"'
              : 'Click the Orb or Mic to speak'}
          </span>
        </div>

        {/* Real-time Subtitle Banner */}
        {liveTranscript && (
          <div className="w-full px-4 py-2 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 shadow-sm animate-in fade-in">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300 block mb-0.5">
              Live Hearing:
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              "{liveTranscript}"
            </p>
          </div>
        )}
      </div>

      {/* 2. Direct Shopping Shortcuts with Clean SVGs */}
      <div className="grid grid-cols-2 gap-2">
        {shoppingShortcuts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(item.example)}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/70 dark:border-zinc-700/70 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-100 transition-all text-left group flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                  {item.label}
                </span>
                <span className="text-[10px] text-slate-400 font-medium block truncate">
                  "{item.example}"
                </span>
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>

      {/* 3. Interaction Feed Log with Auto-Scroll */}
      <div className="space-y-2 flex-1 min-h-[220px]">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2">
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Voice Interaction Feed</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-medium">
            {messages.length} logs
          </span>
        </div>

        <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in`}
            >
              {msg.sender === 'assistant' && (
                <div className="shrink-0 mt-0.5">
                  <IridescentOrb size="sm" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-zinc-950 text-white rounded-br-xs dark:bg-white dark:text-zinc-950 font-bold'
                    : 'bg-slate-50 dark:bg-zinc-800/90 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-zinc-700 font-medium'
                }`}
              >
                <p>{msg.text}</p>

                {msg.itemDetails?.name && (
                  <div className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                    </span>

                    <button
                      onClick={onOpenCart}
                      className="inline-flex items-center gap-1 font-bold px-2 py-0.2 rounded-full bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Cart</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Integrated Embedded Command Bar (Desktop Dock) */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700"
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
                ? 'Say "Hey Assistant, add milk" or type...'
                : 'Type or speak: "Add 2 bottles of milk"...'
            }
            className="flex-1 bg-transparent px-2 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />

          {inputText.trim() && (
            <button
              type="submit"
              className="p-2 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:scale-105 transition-transform shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Glowing Orange Microphone Button */}
          <button
            type="button"
            onClick={onToggleListen}
            className={`p-2.5 rounded-xl text-white font-bold transition-all shadow-md shrink-0 flex items-center justify-center ${
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

    </div>
  );
};
