import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { ChatMessage } from './VoiceChatStream';
import { CheckCircle2, ShoppingBag, Sparkles, Tag, Leaf, RefreshCw, ArrowRight } from 'lucide-react';

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
  const promptCards = [
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />,
      title: 'Daily Essentials',
      desc: '"Add 2 gallons of whole milk and 3 organic apples"',
      cmd: 'Add 2 gallons of whole milk and 3 organic apples',
    },
    {
      icon: <Tag className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />,
      title: 'Price Filter Search',
      desc: '"Find toothpaste under $5"',
      cmd: 'Find toothpaste under $5',
    },
    {
      icon: <Leaf className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />,
      title: 'In-Season & Deals',
      desc: '"What is in season and on sale?"',
      cmd: 'What is in season and on sale?',
    },
    {
      icon: <RefreshCw className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />,
      title: 'Smart Reorder',
      desc: '"What do you suggest based on routine?"',
      cmd: 'What do you suggest?',
    },
  ];

  return (
    <div className="space-y-6 pb-28">
      
      {/* 1. Compact Center Stage with Refined 3D Ball */}
      <div className="flex flex-col items-center text-center pt-1 pb-3 space-y-3">
        
        {/* Compact, Refined 3D Ball */}
        <div className="relative group cursor-pointer my-1" onClick={onToggleListen}>
          <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 20} />
          
          {/* Tooltip on hover */}
          <div className="absolute -bottom-2 inset-x-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-md">
              {isListening ? 'Pause Mic' : 'Click to Speak'}
            </span>
          </div>
        </div>

        {/* Live Status Pill */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {isListening
                ? isHandsFree
                  ? '🎙️ Hands-Free Active: Say "Hey Assistant, add milk"'
                  : 'Listening... Speak your full sentence'
                : isHandsFree
                ? 'Hands-Free Ready • Say "Hey Assistant"'
                : 'Click the Orb or Microphone to speak'}
            </span>
          </div>
        </div>

        {/* Live Hearing Subtitle Banner */}
        {liveTranscript && (
          <div className="max-w-xl w-full px-5 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-emerald-300 dark:border-emerald-700/80 shadow-md animate-in fade-in">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-0.5">
              Hearing Live:
            </span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white leading-tight">
              "{liveTranscript}"
            </p>
          </div>
        )}
      </div>

      {/* 2. Quick Capability Prompt Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5">
        {promptCards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(card.cmd)}
            className="p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-left hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xs transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                {card.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5 leading-snug line-clamp-2">
                {card.desc}
              </p>
            </div>
            <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform">
              <span>Try prompt</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* 3. Conversational Message Stream */}
      <div className="space-y-3 pt-1">
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800/80 pb-2">
          <h3 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight uppercase">
            Interaction Log
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">
            {messages.length} messages
          </span>
        </div>

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
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-zinc-950 text-white rounded-br-xs dark:bg-white dark:text-zinc-950 font-bold'
                  : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-zinc-800 font-medium'
              }`}
            >
              <p>{msg.text}</p>

              {/* Added item confirmation details */}
              {msg.itemDetails?.name && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-3 text-[11px]">
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
  );
};
