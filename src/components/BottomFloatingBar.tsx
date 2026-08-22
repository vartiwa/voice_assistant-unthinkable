import React, { useState } from 'react';
import { Mic, MicOff, Search, Send, ChevronDown } from 'lucide-react';
import { LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES } from '../services/speechService';

interface BottomFloatingBarProps {
  isListening: boolean;
  onToggleListen: () => void;
  onOpenImmersiveVoice?: () => void;
  onOpenCatalog: () => void;
  onExecuteCommand: (text: string) => void;
  selectedLang: LanguageOption;
  onLanguageChange: (lang: LanguageOption) => void;
  isHandsFree: boolean;
  onToggleHandsFree?: () => void;
}

export const BottomFloatingBar: React.FC<BottomFloatingBarProps> = ({
  isListening,
  onToggleListen,
  onOpenCatalog,
  onExecuteCommand,
  selectedLang,
  onLanguageChange,
  isHandsFree,
}) => {
  const [text, setText] = useState('');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onExecuteCommand(text.trim());
      setText('');
    }
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 inset-x-0 z-40 max-w-lg mx-auto px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl p-2 sm:p-2.5 rounded-full border border-slate-200/90 dark:border-zinc-800 shadow-2xl shadow-slate-900/10 dark:shadow-black/50 flex items-center gap-2">
        
        {/* Left: Product Search Catalog Icon */}
        <button
          onClick={onOpenCatalog}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
          title="Search Catalog"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Center-Left: Model/Language Tag Pill (Matching Opus 4.8 tag) */}
        <div className="relative">
          <button
            onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors shrink-0"
          >
            <span>{selectedLang.flag}</span>
            <span className="hidden sm:inline">{selectedLang.name.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {/* Dropdown Menu */}
          {isLangMenuOpen && (
            <div className="absolute bottom-12 left-0 w-44 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.speechCode}
                  onClick={() => {
                    onLanguageChange(lang);
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors ${
                    selectedLang.speechCode === lang.speechCode
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input Text Field */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0 flex items-center">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isHandsFree
                ? 'Say "Hey Assistant" or type...'
                : 'Ask or type: "Add 2 milk"...'
            }
            className="w-full bg-transparent px-2 py-1.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
          />
          {text.trim() && (
            <button
              type="submit"
              className="p-1.5 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 mr-1 shrink-0 hover:scale-105 transition-transform"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Right: Vibrant Orange-Coral Glowing Mic Pill matching inspiration */}
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
