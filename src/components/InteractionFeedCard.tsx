import React from 'react';
import { ChatMessage } from './VoiceChatStream';
import { IridescentOrb } from './IridescentOrb';
import { CheckCircle2, ShoppingBag, Terminal, User } from 'lucide-react';

interface InteractionFeedCardProps {
  messages: ChatMessage[];
  onOpenCart: () => void;
}

export const InteractionFeedCard: React.FC<InteractionFeedCardProps> = ({
  messages,
  onOpenCart,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col space-y-3 h-full">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight uppercase">
            Dialogue & Activity Stream
          </h4>
        </div>
        <span className="text-[11px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800">
          {messages.length} events
        </span>
      </div>

      {/* Message Stream */}
      <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1 flex-1">
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
              className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                  : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-zinc-700 font-medium'
              }`}
            >
              {msg.sender === 'user' && (
                <div className="flex items-center justify-between gap-2 mb-1 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <User className="w-2.5 h-2.5" />
                    <span>USER VOICE</span>
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
              )}

              <p>{msg.text}</p>

              {msg.itemDetails?.name && (
                <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                  </span>

                  <button
                    onClick={onOpenCart}
                    className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
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
