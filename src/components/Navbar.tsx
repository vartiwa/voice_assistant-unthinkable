import React from 'react';
import { Volume2, VolumeX, HelpCircle, ShoppingBag, Radio, Sparkles, MessageSquare } from 'lucide-react';
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
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F7F6F3]/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-slate-200/70 dark:border-zinc-800/70 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Clean Static Logo without animation */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 dark:bg-white flex items-center justify-center shadow-sm">
            <span className="text-white dark:text-zinc-950 font-black text-sm tracking-tighter">VC</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                VoiceCart
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-slate-700 dark:text-slate-300">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-medium">
              Voice Shopping Assistant
            </p>
          </div>
        </div>

        {/* Center: Desktop View Navigation Switcher */}
        <div className="flex items-center p-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm text-xs font-bold">
          <button
            onClick={() => onSelectView('chat')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
              activeView === 'chat'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Voice & Chat</span>
          </button>

          <button
            onClick={() => onSelectView('cart')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
              activeView === 'cart'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shopping Cart ({itemCount})</span>
          </button>

          <button
            onClick={() => onSelectView('suggestions')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all ${
              activeView === 'suggestions'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Suggestions</span>
          </button>
        </div>

        {/* Right Action Tools: Hands-Free, Language, Mute, Help, Cart Total */}
        <div className="flex items-center gap-2.5">
          
          {/* Hands-Free Mode Toggle */}
          <button
            onClick={onToggleHandsFree}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isHandsFree
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-900'
                : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
            }`}
            title="Toggle Hands-Free Wake Word (Say 'Hey Assistant')"
          >
            <Radio className={`w-3.5 h-3.5 ${isHandsFree ? 'animate-pulse' : ''}`} />
            <span>{isHandsFree ? 'Hands-Free ON' : 'Hands-Free'}</span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <select
              value={selectedLang}
              onChange={(e) => {
                const found = SUPPORTED_LANGUAGES.find((l) => l.speechCode === e.target.value);
                if (found) onLanguageChange(found);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-zinc-800 focus:outline-none cursor-pointer hover:bg-slate-50"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.speechCode} value={lang.speechCode}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* TTS Audio Response Toggle */}
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-full border transition-colors ${
              isMuted
                ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950 dark:border-rose-900'
                : 'bg-white text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-slate-300 dark:border-zinc-800 shadow-sm hover:bg-slate-50'
            }`}
            title={isMuted ? 'Voice Responses Muted' : 'Voice Responses Active'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Help Button */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-full bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 shadow-sm hover:text-slate-900 transition-colors"
            title="Voice Commands Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Cart Cost Indicator */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-semibold text-slate-400">Cart Total:</span>
            <span className="text-sm font-black text-slate-900 dark:text-white">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
};
