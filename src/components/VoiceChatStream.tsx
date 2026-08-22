import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { ShoppingItem } from '../types';
import { Sparkles, CheckCircle2 } from 'lucide-react';

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
  onOpenCatalog?: () => void;
}

export const VoiceChatStream: React.FC<VoiceChatStreamProps> = ({
  messages,
  liveTranscript,
  isListening,
  onQuickPrompt,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Welcome Hero when no or few messages */}
      {messages.length === 0 && (
        <div className="pt-4 pb-2 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              What are we <br className="hidden sm:block" />
              shopping for today?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Speak naturally to add items, search the catalog, or get smart suggestions.
            </p>
          </div>

          {/* Quick Action Prompt Cards matching inspiration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                title: 'Add Daily Essentials',
                desc: '"Add 2 gallons of whole milk and 3 organic apples"',
                cmd: 'Add 2 gallons of whole milk and 3 organic apples',
              },
              {
                title: 'Search & Price Filter',
                desc: '"Find Colgate toothpaste under 5 dollars"',
                cmd: 'Find toothpaste under $5',
              },
              {
                title: 'Smart Suggestions',
                desc: '"What is in season and running low?"',
                cmd: 'What do you suggest?',
              },
            ].map((card, idx) => (
              <button
                key={idx}
                onClick={() => onQuickPrompt(card.cmd)}
                className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-left hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md transition-all group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-3 text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {card.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversational Stream List */}
      <div className="space-y-4 pt-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } animate-in fade-in duration-200`}
          >
            {/* Assistant Avatar */}
            {msg.sender === 'assistant' && (
              <div className="shrink-0 mt-0.5">
                <IridescentOrb size="sm" />
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-zinc-950 text-white rounded-br-sm dark:bg-white dark:text-zinc-950 font-medium'
                  : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 rounded-bl-sm border border-slate-200/70 dark:border-zinc-800'
              }`}
            >
              <p>{msg.text}</p>

              {/* Tag if item added */}
              {msg.itemDetails?.name && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{msg.itemDetails.name} ({msg.itemDetails.quantity} {msg.itemDetails.unit})</span>
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500">
                    {msg.itemDetails.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Listening Transcription Bubble */}
        {isListening && liveTranscript && (
          <div className="flex items-start gap-3 justify-end animate-in fade-in">
            <div className="max-w-[82%] sm:max-w-[70%] rounded-2xl rounded-br-sm px-4 py-3 text-sm bg-zinc-900/80 text-white backdrop-blur-md shadow-md border border-zinc-700">
              <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider mb-0.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Listening...
              </span>
              <p className="italic font-medium">"{liveTranscript}"</p>
            </div>
          </div>
        )}

        {/* Status line when listening without speech yet */}
        {isListening && !liveTranscript && (
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-1 animate-pulse">
            <IridescentOrb size="sm" isListening={true} audioLevel={30} />
            <span className="font-medium">VoiceCart is listening... Speak anytime</span>
          </div>
        )}
      </div>

    </div>
  );
};
