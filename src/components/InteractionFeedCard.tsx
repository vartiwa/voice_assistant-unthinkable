import React from 'react';
import { ChatMessage } from './VoiceChatStream';
import { IridescentOrb } from './IridescentOrb';
import { CheckCircle2, ShoppingBag, Zap } from 'lucide-react';

interface InteractionFeedCardProps {
  messages: ChatMessage[];
  onOpenCart: () => void;
}

export const InteractionFeedCard: React.FC<InteractionFeedCardProps> = ({
  messages,
  onOpenCart,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-sm flex flex-col space-y-3 h-full">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5">
        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-tight uppercase flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Conversational Interaction Feed</span>
        </h4>
        <span className="text-[11px] text-slate-400 font-medium">
          {messages.length} messages
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1 flex-1">
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
                  : 'bg-slate-50 dark:bg-zinc-800/90 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-zinc-700 font-medium'
              }`}
            >
              <p>{msg.text}</p>

              {msg.itemDetails?.name && (
                <div className="mt-2 pt-2 border-t border-slate-200 dark:border-zinc-700 flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                  </span>

                  <button
                    onClick={onOpenCart}
                    className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors shadow-2xs"
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
