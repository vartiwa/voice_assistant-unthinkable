import React from 'react';
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
  ArrowRight,
  Zap
} from 'lucide-react';

interface DesktopMainStageProps {
  messages: ChatMessage[];
  liveTranscript: string;
  isListening: boolean;
  audioLevel: number;
  onToggleListen: () => void;
  onQuickPrompt: (prompt: string) => void;
  onOpenCart: () => void;
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
  isHandsFree,
}) => {
  // Clean, authentic shopping voice shortcuts with crisp vector SVGs
  const shoppingShortcuts = [
    {
      icon: <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      label: 'Organic Produce',
      example: 'Add 3 Honeycrisp apples',
      category: 'Produce',
    },
    {
      icon: <Milk className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
      label: 'Dairy & Essentials',
      example: 'Add 2 gallons of milk',
      category: 'Dairy',
    },
    {
      icon: <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
      label: 'Tech & Electronics',
      example: 'Add wireless earphones',
      category: 'Electronics',
    },
    {
      icon: <Filter className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
      label: 'Price Filter',
      example: 'Find toothpaste under $5',
      category: 'Smart Filter',
    },
  ];

  return (
    <div className="space-y-5 pb-28">
      
      {/* 1. Compact Center Stage with 3D Orb */}
      <div className="flex flex-col items-center text-center pt-1 pb-1 space-y-3">
        
        {/* Refined 3D Orb */}
        <div className="relative group cursor-pointer my-1" onClick={onToggleListen}>
          <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 20} />
          
          <div className="absolute -bottom-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md flex items-center gap-1">
              <Mic className="w-3 h-3" />
              <span>{isListening ? 'Stop Mic' : 'Click to Speak'}</span>
            </span>
          </div>
        </div>

        {/* Live Listening Status */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
            {isListening
              ? isHandsFree
                ? '🎙️ Hands-Free: Speak command anytime'
                : 'Listening... (auto-processing on silence)'
              : isHandsFree
              ? 'Hands-Free Ready • Say "Hey Assistant"'
              : 'Tap Orb or Mic below to speak'}
          </span>
        </div>

        {/* Real-Time Live Speech Subtitle */}
        {liveTranscript && (
          <div className="max-w-lg w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-400 dark:border-emerald-600 shadow-md animate-in fade-in">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
              Live Speech:
            </span>
            <p className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              "{liveTranscript}"
            </p>
          </div>
        )}
      </div>

      {/* 2. Direct Shopping Voice Shortcuts (Clean Vector SVGs) */}
      <div className="grid grid-cols-2 gap-2">
        {shoppingShortcuts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(item.example)}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all text-left group flex items-center justify-between gap-2 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                  {item.label}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block truncate">
                  "{item.example}"
                </span>
              </div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>

      {/* 3. Interaction Dialogue Stream */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Voice Interaction Feed</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            {messages.length} logs
          </span>
        </div>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              } animate-in fade-in`}
            >
              {msg.sender === 'assistant' && (
                <div className="shrink-0 mt-0.5">
                  <IridescentOrb size="sm" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-zinc-950 text-white rounded-br-xs dark:bg-white dark:text-zinc-950 font-bold'
                    : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-zinc-800 font-medium'
                }`}
              >
                <p>{msg.text}</p>

                {msg.itemDetails?.name && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                    </span>

                    <button
                      onClick={onOpenCart}
                      className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>In Cart</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
