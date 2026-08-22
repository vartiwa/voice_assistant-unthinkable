import React from 'react';
import { Sparkles, Volume2, VolumeX, HelpCircle, ShoppingBag, Radio, MessageSquare } from 'lucide-react';
import { LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES } from '../services/speechService';
import { IridescentOrb } from './IridescentOrb';

interface NavbarProps {
  selectedLang: string;
  onLanguageChange: (lang: LanguageOption) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
  onOpenSuggestions?: () => void;
  itemCount: number;
  totalPrice: number;
  isListening: boolean;
  activeView: 'voice' | 'cart' | 'suggestions';
  onSelectView: (view: 'voice' | 'cart' | 'suggestions') => void;
  isHandsFree: boolean;
  onToggleHandsFree: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLang,
  onLanguageChange,
  isMuted,
  onToggleMute,
  onOpenHelp,
  itemCount,
  totalPrice,
  isListening,
  activeView,
  onSelectView,
  isHandsFree,
  onToggleHandsFree,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F6F3]/85 dark:bg-zinc-950/85 backdrop-blur-xl border-b border-slate-200/60 dark:border-zinc-800/60 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        
        {/* Left: Agent Avatar & Title matching inspiration header */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-zinc-950 dark:bg-white flex items-center justify-center p-0.5 shadow-md">
            <IridescentOrb size="sm" isListening={isListening} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                VoiceCart
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
              Voice Shopping Agent
            </p>
          </div>
        </div>

        {/* Center: View Switcher (Voice Chat vs Cart vs Suggestions) */}
        <div className="hidden md:flex items-center p-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm text-xs font-semibold">
          <button
            onClick={() => onSelectView('voice')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeView === 'voice'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Voice Chat</span>
          </button>

          <button
            onClick={() => onSelectView('cart')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeView === 'cart'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cart ({itemCount})</span>
          </button>

          <button
            onClick={() => onSelectView('suggestions')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              activeView === 'suggestions'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Suggestions</span>
          </button>
        </div>

        {/* Right Actions: Hands-Free, Language, Mute, Help, Cart Counter */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Hands-Free Toggle Button */}
          <button
            onClick={onToggleHandsFree}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              isHandsFree
                ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-900'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800'
            }`}
            title="Toggle Hands-Free Wake Word Mode"
          >
            <Radio className={`w-3 h-3 ${isHandsFree ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{isHandsFree ? 'Hands-Free' : 'Hands-Free'}</span>
          </button>

          {/* Language Selector */}
          <div className="relative flex items-center">
            <select
              value={selectedLang}
              onChange={(e) => {
                const found = SUPPORTED_LANGUAGES.find((l) => l.speechCode === e.target.value);
                if (found) onLanguageChange(found);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.speechCode} value={lang.speechCode}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Response Mute Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-full text-xs border transition-colors ${
              isMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:border-rose-900'
                : 'bg-white text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-slate-300 dark:border-zinc-800 shadow-sm'
            }`}
            title={isMuted ? 'Voice Responses Muted' : 'Voice Responses Active'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-full bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 shadow-sm hover:text-slate-900 transition-colors"
            title="Voice Commands Guide"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Cart Icon / Counter for Mobile */}
          <button
            onClick={() => onSelectView('cart')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-bold shadow-sm"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>${totalPrice.toFixed(2)}</span>
          </button>

        </div>
      </div>
    </header>
  );
};
