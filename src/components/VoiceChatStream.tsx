import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { ShoppingItem } from '../types';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  itemDetails?: Partial<ShoppingItem>;
  intent?: string;
}

interface VoiceChatStreamProps {
  messages: ChatMessage[];
  liveTranscript: string;
  isListening: boolean;
  onQuickPrompt: (prompt: string) => void;
  onOpenCart: () => void;
}

export const VoiceChatStream: React.FC<VoiceChatStreamProps> = ({
  messages,
  liveTranscript,
  isListening,
  onOpenCart,
}) => {
  return (
    <div className="space-y-4 pt-2 pb-24 animate-in fade-in duration-200">
      
      {/* Messages Stream */}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Assistant Iridescent Avatar */}
            {msg.sender === 'assistant' && (
              <div className="shrink-0 mt-0.5">
                <IridescentOrb size="sm" />
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-[24px] px-5 py-3.5 text-sm leading-relaxed shadow-sm transition-all ${
                msg.sender === 'user'
                  ? 'bg-zinc-950 text-white rounded-br-md dark:bg-white dark:text-zinc-950 font-semibold'
                  : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 rounded-bl-md border border-slate-200/80 dark:border-zinc-800'
              }`}
            >
              <p>{msg.text}</p>

              {/* Tag if item added */}
              {msg.itemDetails?.name && (
                <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                  </span>

                  <button
                    onClick={onOpenCart}
                    className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>View in Cart</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Listening Transcription Bubble */}
        {isListening && liveTranscript && (
          <div className="flex items-start gap-3 justify-end animate-in fade-in">
            <div className="max-w-[85%] sm:max-w-[75%] rounded-[24px] rounded-br-md px-5 py-3.5 text-sm bg-zinc-900 text-white shadow-xl border border-zinc-700">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Hearing...
              </span>
              <p className="italic font-bold">"{liveTranscript}"</p>
            </div>
          </div>
        )}

        {/* Status indicator when actively listening */}
        {isListening && !liveTranscript && (
          <div className="flex items-center gap-2.5 text-xs text-slate-400 dark:text-zinc-500 pl-1 animate-pulse font-semibold">
            <IridescentOrb size="sm" isListening={true} audioLevel={35} />
            <span>VoiceCart is listening... Speak your sentence</span>
          </div>
        )}
      </div>

    </div>
  );
};
