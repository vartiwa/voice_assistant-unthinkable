import React from 'react';
import { IridescentOrb } from './IridescentOrb';
import { Sparkles, ArrowRight, Zap, ShoppingBag, Tag, Leaf, RefreshCw } from 'lucide-react';

interface HomeCanvasViewProps {
  onQuickPrompt: (cmd: string) => void;
  onOpenImmersiveVoice: () => void;
  onOpenCatalog?: () => void;
  onOpenCart: () => void;
  itemCount: number;
  totalPrice: number;
  isListening: boolean;
  audioLevel: number;
}

export const HomeCanvasView: React.FC<HomeCanvasViewProps> = ({
  onQuickPrompt,
  onOpenImmersiveVoice,
  onOpenCart,
  itemCount,
  totalPrice,
  isListening,
  audioLevel,
}) => {
  const promptCards = [
    {
      icon: <Sparkles className="w-4 h-4 text-zinc-950 dark:text-white" />,
      title: 'Daily Essentials',
      desc: 'Add 2 gallons of whole milk and 3 organic Honeycrisp apples',
      cmd: 'Add 2 gallons of whole milk and 3 organic apples',
      tag: 'Popular',
    },
    {
      icon: <Tag className="w-4 h-4 text-zinc-950 dark:text-white" />,
      title: 'Price Filter Search',
      desc: 'Find Colgate toothpaste priced under 5 dollars',
      cmd: 'Find toothpaste under $5',
      tag: 'Smart Filter',
    },
    {
      icon: <Leaf className="w-4 h-4 text-zinc-950 dark:text-white" />,
      title: 'In-Season & Deals',
      desc: 'Show fresh seasonal harvest and weekly discount flyer',
      cmd: 'What is in season and on sale?',
      tag: 'Seasonal',
    },
    {
      icon: <RefreshCw className="w-4 h-4 text-zinc-950 dark:text-white" />,
      title: 'Smart Reorder',
      desc: 'Reorder items you are running low on based on routine',
      cmd: 'What do you suggest for routine reorder?',
      tag: 'Routine AI',
    },
  ];

  return (
    <div className="space-y-6 pt-2 pb-24 animate-in fade-in duration-300">
      
      {/* Hero Headline matching inspiration */}
      <div className="space-y-2">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          What are we <br />
          shopping today?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
          Speak naturally or tap any capability below to begin.
        </p>
      </div>

      {/* Floating 3D Iridescent Orb Interactive Showcase */}
      <div
        onClick={onOpenImmersiveVoice}
        className="relative group p-6 rounded-[28px] bg-white/70 dark:bg-zinc-900/70 border border-slate-200/80 dark:border-zinc-800 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6"
      >
        <div className="space-y-1.5 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 text-[11px] font-bold">
            <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />
            <span>Interactive Holographic Voice AI</span>
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tap the Orb to Speak
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs font-medium">
            Natural language understanding with hands-free wake word detection.
          </p>
        </div>

        {/* 3D Orb Display */}
        <div className="relative shrink-0 group-hover:scale-110 transition-transform duration-300">
          <IridescentOrb size="lg" isListening={isListening} audioLevel={audioLevel || 35} />
        </div>
      </div>

      {/* Grid of Clean Prompt Cards matching inspiration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {promptCards.map((card, idx) => (
          <button
            key={idx}
            onClick={() => onQuickPrompt(card.cmd)}
            className="p-5 rounded-[24px] bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-left hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-md transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
                  {card.tag}
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                {card.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                {card.desc}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform">
              <span>Try voice prompt</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>

      {/* Cart Quick Status Pill */}
      <div
        onClick={onOpenCart}
        className="p-4 rounded-[24px] bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-between shadow-xl cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 dark:bg-zinc-900/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold opacity-70 block">Current Shopping Cart</span>
            <span className="text-sm font-extrabold">{itemCount} items ready in cart</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-base font-black">${totalPrice.toFixed(2)}</span>
          <ArrowRight className="w-4 h-4 opacity-70" />
        </div>
      </div>

    </div>
  );
};
