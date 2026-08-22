import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { ShoppingBag, Terminal, CheckCircle2, User, Plus, RotateCcw } from 'lucide-react';
import { ChatMessage } from './VoiceChatStream';

interface InteractionFeedCardProps {
  messages: ChatMessage[];
  onOpenCart: () => void;
  onQuickIncrement?: (itemName: string) => void;
  onQuickUndo?: (itemName: string) => void;
}

export const InteractionFeedCard: React.FC<InteractionFeedCardProps> = ({
  messages,
  onOpenCart,
  onQuickIncrement,
  onQuickUndo,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col space-y-3">
      
      {/* Header matching Sketch (CHAT) */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-500" />
          <h4 className="font-extrabold text-xs text-slate-900 dark:text-white tracking-wider uppercase">
            CHAT · Activity Stream
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800">
          {messages.length} events
        </span>
      </div>

      {/* Message Stream with flexible scrolling */}
      <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-700">
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
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-xs'
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

              <p className="text-[12px]">{msg.text}</p>

              {/* NLU Diagnostics & Confidence Tag */}
              {msg.sender === 'assistant' && msg.intent && (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {msg.intent}
                  </span>
                  {msg.confidenceScore && (
                    <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {Math.round(msg.confidenceScore * 100)}% Match
                    </span>
                  )}
                </div>
              )}

              {/* Interactive Item Action Receipt */}
              {msg.itemDetails?.name && (
                <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-zinc-700/80 space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                    </span>

                    <button
                      onClick={onOpenCart}
                      className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs shrink-0"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>In Cart</span>
                    </button>
                  </div>

                  {/* Interactive Quick Reaction Buttons */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    {onQuickIncrement && (
                      <button
                        onClick={() => onQuickIncrement(msg.itemDetails?.name || '')}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors font-bold flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>+1 More</span>
                      </button>
                    )}

                    {onQuickUndo && (
                      <button
                        onClick={() => onQuickUndo(msg.itemDetails?.name || '')}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 dark:bg-rose-950 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors font-bold flex items-center gap-0.5"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Undo</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
