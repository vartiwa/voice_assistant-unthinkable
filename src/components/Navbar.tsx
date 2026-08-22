import React from 'react';
import { Volume2, VolumeX, HelpCircle, ShoppingBag, Radio, Compass, MessageSquare, Sun, Moon } from 'lucide-react';
import { LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES } from '../services/speechService';

interface NavbarProps {
  selectedLang: string;
  onLanguageChange: (lang: LanguageOption) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  itemCount: number;
  totalPrice: number;
  isListening?: boolean;
  activeView: 'chat' | 'cart' | 'suggestions';
  onSelectView: (view: 'chat' | 'cart' | 'suggestions') => void;
  isHandsFree: boolean;
  onToggleHandsFree: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLang,
  onLanguageChange,
  isMuted,
  onToggleMute,
  onOpenHelp,
  itemCount,
  totalPrice,
  activeView,
  onSelectView,
  isHandsFree,
  onToggleHandsFree,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FBFBFA]/95 dark:bg-[#0C0D0E]/95 backdrop-blur-md border-b border-stone-200/90 dark:border-stone-800 transition-colors">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        
        {/* Brand & Engineering Tag */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-xs">
            <span className="text-white dark:text-stone-900 font-black text-xs tracking-tighter">VC</span>
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-sm tracking-tight text-stone-900 dark:text-stone-100">
              VoiceCart
            </h1>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
              v1.2
            </span>
          </div>
        </div>

        {/* Center: Segmented Navigation Control */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs font-semibold">
          <button
            onClick={() => onSelectView('chat')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeView === 'chat'
                ? 'bg-white text-stone-900 dark:bg-stone-800 dark:text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Voice & Dialogue</span>
          </button>

          <button
            onClick={() => onSelectView('cart')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeView === 'cart'
                ? 'bg-white text-stone-900 dark:bg-stone-800 dark:text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart <span className="font-mono text-[11px] opacity-70">({itemCount})</span></span>
          </button>

          <button
            onClick={() => onSelectView('suggestions')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              activeView === 'suggestions'
                ? 'bg-white text-stone-900 dark:bg-stone-800 dark:text-white shadow-xs font-bold'
                : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-blue-500" />
            <span>Intelligence Radar</span>
          </button>
        </div>

        {/* Right Actions: Controls, Theme Switcher & Totals */}
        <div className="flex items-center gap-2">
          
          {/* Hands-Free Toggle */}
          <button
            onClick={onToggleHandsFree}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
              isHandsFree
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-bold'
                : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-50'
            }`}
            title="Toggle Hands-Free Mode"
          >
            <Radio className={`w-3 h-3 ${isHandsFree ? 'animate-pulse text-emerald-600 dark:text-emerald-400' : 'text-stone-400'}`} />
            <span>{isHandsFree ? 'Hands-Free' : 'Push-to-Talk'}</span>
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => {
                const found = SUPPORTED_LANGUAGES.find((l) => l.speechCode === e.target.value);
                if (found) onLanguageChange(found);
              }}
              className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 focus:outline-none cursor-pointer hover:bg-stone-50"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.speechCode} value={lang.speechCode}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dark / Light Mode Switcher */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-lg bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Alabaster Mode' : 'Switch to Dark Obsidian Mode'}
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
            </button>
          )}

          {/* TTS Audio Mute */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border transition-colors ${
              isMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900'
                : 'bg-white text-stone-600 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 hover:bg-stone-50'
            }`}
            title={isMuted ? 'Voice Responses Muted' : 'Voice Responses Active'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Help Modal */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded-lg bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 transition-colors"
            title="Command Syntax Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Cart Value Tag */}
          <div className="hidden sm:flex items-center gap-1.5 pl-2.5 border-l border-stone-200 dark:border-stone-800">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Total:</span>
            <span className="text-xs font-mono font-bold text-stone-900 dark:text-stone-100">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
