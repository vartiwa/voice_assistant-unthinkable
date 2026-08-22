import React from 'react';
import { X, PlusCircle, Trash2, Search, Radio } from 'lucide-react';

interface CommandHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandHelpModal: React.FC<CommandHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#F7F6F3] dark:bg-zinc-900 rounded-[32px] max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200/90 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/70 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Voice Assistant Command Guide
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Natural phrases and wake words recognized by VoiceCart AI
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {/* Hands-Free Wake Words */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1.5 text-xs">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span>Hands-Free Wake Words</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              When Hands-Free mode is enabled, start any sentence with a wake word without clicking the mic:
            </p>
            <div className="flex flex-wrap gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Hey Assistant"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"VoiceCart"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Hey Google"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Assistant"</span>
            </div>
          </div>

          {/* Section 1: Adding Items & Quantities */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>1. Adding Items with Quantities & Units</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { say: '"Add earphones"', desc: 'Adds earphones to Electronics' },
                { say: '"I need 3 organic apples"', desc: 'Adds 3 organic apples to Produce' },
                { say: '"Add 2 bottles of water"', desc: 'Parses quantity (2) and unit (bottles)' },
                { say: '"Buy 5 oranges"', desc: 'Understands quantity and item' },
              ].map((ex, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700">
                  <p className="font-bold text-slate-900 dark:text-white">{ex.say}</p>
                  <p className="text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Removing Items */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>2. Removing & Modifying Items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { say: '"Remove milk from my list"', desc: 'Removes milk from cart' },
                { say: '"Delete bananas"', desc: 'Deletes bananas immediately' },
                { say: '"Clear shopping list"', desc: 'Empties the entire list' },
              ].map((ex, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700">
                  <p className="font-bold text-rose-600 dark:text-rose-400">{ex.say}</p>
                  <p className="text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Search & Price Filter */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Search className="w-4 h-4 text-blue-500" />
              <span>3. Search & Price Filtering</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { say: '"Find organic apples"', desc: 'Searches catalog for organic apples' },
                { say: '"Find toothpaste under $5"', desc: 'Filters products priced under $5.00' },
                { say: '"Show snacks under $3"', desc: 'Filters snack category by price' },
              ].map((ex, i) => (
                <div key={i} className="p-3 rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700">
                  <p className="font-bold text-blue-600 dark:text-blue-400">{ex.say}</p>
                  <p className="text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">
            Supports English (US/IN/UK), Spanish, French, German, Hindi
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-full transition-all"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
