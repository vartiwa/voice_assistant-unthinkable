import React from 'react';
import { ChatMessage } from './VoiceChatStream';
import { IridescentOrb } from './IridescentOrb';
import { CheckCircle2, ShoppingBag, Terminal } from 'lucide-react';

interface InteractionFeedCardProps {
  messages: ChatMessage[];
  onOpenCart: () => void;
}

export const InteractionFeedCard: React.FC<InteractionFeedCardProps> = ({
  messages,
  onOpenCart,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col space-y-3 h-full">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-500" />
          <h4 className="font-bold text-xs text-slate-900 dark:text-white tracking-tight uppercase">
            Voice Activity Log
          </h4>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {messages.length} interactions
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[480px] pr-1 flex-1">
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
              className={`max-w-[88%] rounded-xl px-4 py-2.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold'
                  : 'bg-slate-50 dark:bg-zinc-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-zinc-700 font-medium'
              }`}
            >
              <p>{msg.text}</p>

              {msg.itemDetails?.name && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                  </span>

                  <button
                    onClick={onOpenCart}
                    className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>View Cart</span>
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
