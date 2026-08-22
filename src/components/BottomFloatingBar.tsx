import React, { useState } from 'react';
import { Mic, MicOff, Search, Send, Maximize2 } from 'lucide-react';
import { LanguageOption } from '../types';

interface BottomFloatingBarProps {
  isListening: boolean;
  onToggleListen: () => void;
  onOpenImmersiveVoice: () => void;
  onOpenCatalog: () => void;
  onExecuteCommand: (text: string) => void;
  selectedLang?: LanguageOption;
  onToggleLanguage?: () => void;
  isHandsFree: boolean;
}

export const BottomFloatingBar: React.FC<BottomFloatingBarProps> = ({
  isListening,
  onToggleListen,
  onOpenImmersiveVoice,
  onOpenCatalog,
  onExecuteCommand,
  isHandsFree,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onExecuteCommand(text.trim());
      setText('');
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 max-w-xl mx-auto px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl p-2 sm:p-2.5 rounded-full sm:rounded-full border border-slate-200/90 dark:border-zinc-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 flex items-center gap-2">
        
        {/* Search Catalog / Browse button */}
        <button
          onClick={onOpenCatalog}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          title="Search Product Catalog"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Input Text Field */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isHandsFree
                ? 'Say "Hey Assistant, add milk" or type...'
                : 'Ask or type: "Add 2 bottles of water"...'
            }
            className="w-full bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {text.trim() && (
            <button
              type="submit"
              className="p-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 mr-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Immersive Voice Mode Button */}
        <button
          onClick={onOpenImmersiveVoice}
          className="w-9 h-9 rounded-full hidden sm:flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          title="Open Immersive 3D Voice Orb"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Vibrant Orange-Coral Glowing Mic Button */}
        <div className="relative shrink-0">
          {isListening && (
            <div className="absolute -inset-2 rounded-full bg-orange-500/30 blur-md animate-ping" />
          )}
          <button
            onClick={onToggleListen}
            aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
            className={`relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-orange-500/40 animate-pulse'
                : 'bg-gradient-to-tr from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/30 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
