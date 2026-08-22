import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { ShoppingBag, Terminal, CheckCircle2, User } from 'lucide-react';
import { ChatMessage } from './VoiceChatStream';

interface InteractionFeedCardProps {
  messages: ChatMessage[];
  onOpenCart: () => void;
}

export const InteractionFeedCard: React.FC<InteractionFeedCardProps> = ({
  messages,
  onOpenCart,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-3.5 sm:p-4 border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col h-full min-h-0 justify-between overflow-hidden">
      
      {/* Header matching Sketch (CHAT) */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-wider uppercase">
            CHAT · Activity Stream
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-zinc-800">
          {messages.length} events
        </span>
      </div>

      {/* Message Stream with isolated internal scrolling */}
      <div className="space-y-2.5 overflow-y-auto overscroll-contain pr-1 flex-1 min-h-0 my-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-700">
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
              className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                  : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-zinc-700 font-medium'
              }`}
            >
              {msg.sender === 'user' && (
                <div className="flex items-center justify-between gap-2 mb-0.5 text-[9.5px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-2 h-2" />
                    <span>USER VOICE</span>
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
              )}

              <p className="text-[11.5px]">{msg.text}</p>

              {/* NLU Diagnostics & Confidence Tag */}
              {msg.sender === 'assistant' && msg.intent && (
                <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {msg.intent}
                  </span>
                  {msg.confidenceScore && (
                    <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {Math.round(msg.confidenceScore * 100)}% Confidence
                    </span>
                  )}
                </div>
              )}

              {msg.itemDetails?.name && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2 text-[10.5px]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono truncate">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                  </span>

                  <button
                    onClick={onOpenCart}
                    className="inline-flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
                  >
                    <ShoppingBag className="w-2.5 h-2.5" />
                    <span>View</span>
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
