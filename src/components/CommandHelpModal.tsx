import React from 'react';
import { X, Mic, PlusCircle, Trash2, Search, Sparkles, Globe, ShieldCheck } from 'lucide-react';

interface CommandHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandHelpModal: React.FC<CommandHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Voice Assistant Command Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Natural language voice phrases recognized by VoiceCart AI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Section 1: Adding Items & Quantities */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>1. Adding Items with Quantities & Units</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { say: '"Add milk"', desc: 'Adds milk to Dairy & Eggs' },
                { say: '"I need apples"', desc: 'Adds apples to Produce' },
                { say: '"Add 2 bottles of water"', desc: 'Parses quantity (2) and unit (bottles)' },
                { say: '"Buy 5 oranges"', desc: 'Adds 5 oranges to Produce' },
                { say: '"I want to buy bananas"', desc: 'Understands natural phrasing' },
                { say: '"Add organic whole wheat bread"', desc: 'Extracts organic tag & bakery' },
              ].map((ex, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">{ex.say}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Removing Items */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>2. Removing & Modifying Items</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { say: '"Remove milk from my list"', desc: 'Removes milk from your cart' },
                { say: '"Delete bananas"', desc: 'Removes bananas immediately' },
                { say: '"Clear shopping list"', desc: 'Empties the entire list' },
              ].map((ex, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-rose-600 dark:text-rose-400">{ex.say}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Voice-Activated Search & Price Filters */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              <Search className="w-4 h-4 text-blue-500" />
              <span>3. Voice-Activated Search & Price Filters</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { say: '"Find me organic apples"', desc: 'Searches catalog for organic apples' },
                { say: '"Find toothpaste under $5"', desc: 'Filters toothpaste priced under $5.00' },
                { say: '"Show snacks under $3"', desc: 'Filters snack items by max price' },
                { say: '"Search for coffee"', desc: 'Opens product catalog search' },
              ].map((ex, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-blue-600 dark:text-blue-400">{ex.say}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Smart Suggestions */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>4. Smart Suggestions & Seasonal Deals</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { say: '"What do you suggest?"', desc: 'Shows predictive reorders & favorites' },
                { say: '"What is in season?"', desc: 'Highlights fresh seasonal produce' },
                { say: '"Show on sale items"', desc: 'Displays discounted weekly deals' },
              ].map((ex, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                  <p className="font-semibold text-amber-600 dark:text-amber-400">{ex.say}</p>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Multilingual Support */}
          <div>
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-2.5">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>5. Multilingual Support</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-700 dark:text-slate-300">🇪🇸 Spanish: </span>
                <span className="text-slate-600 dark:text-slate-400">"Añadir dos manzanas", "Necesito leche", "Eliminar pan"</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-700 dark:text-slate-300">🇫🇷 French: </span>
                <span className="text-slate-600 dark:text-slate-400">"Ajouter deux pommes", "J’ai besoin de lait", "Supprimer le pain"</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-700 dark:text-slate-300">🇩🇪 German: </span>
                <span className="text-slate-600 dark:text-slate-400">"2 Äpfel hinzufügen", "Ich brauche Milch", "Brot entfernen"</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-slate-700 dark:text-slate-300">🇮🇳 Hindi: </span>
                <span className="text-slate-600 dark:text-slate-400">"दूध जोड़ो", "२ सेब चाहिए", "दूध हटाओ"</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Browser Native Web Speech API & Local Storage</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors"
          >
            Got it!
          </button>
        </div>

      </div>
    </div>
  );
};
