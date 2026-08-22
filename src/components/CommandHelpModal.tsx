import React from 'react';
import { X, PlusCircle, Trash2, Search, Radio, Globe } from 'lucide-react';

interface CommandHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandHelpModal: React.FC<CommandHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#F7F6F3] dark:bg-zinc-900 rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200/90 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/70 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Voice Assistant Command Guide
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Natural Indian English, Hindi, and Tamil phrasing supported by VoiceCart AI
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
              <span>Hands-Free Wake Words (English, Hindi, Tamil)</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              When Hands-Free mode is enabled, speak naturally with any wake word:
            </p>
            <div className="flex flex-wrap gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Hey Assistant"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"VoiceCart"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Namaste Assistant"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Vanakkam Assistant"</span>
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-700">"Assistant"</span>
            </div>
          </div>

          {/* Section 1: Indian English & Multilingual Adding */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>1. Adding Items with Indian Units & Phrasing</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { say: '"Add 1 kg atta and 2 packets milk"', desc: 'Parses Indian units (kg, packets) & items' },
                { say: '"2 packet paneer aur doodh add karo"', desc: 'Hindi / Hinglish natural speech' },
                { say: '"1 kg thakkali and arisi venum"', desc: 'Tamil / Tanglish natural command' },
                { say: '"Add wireless Bluetooth earphones"', desc: 'Adds earphones to Electronics' },
                { say: '"Need half kg paneer and 1 packet curd"', desc: 'Fractions (half kg) & Dairy' },
                { say: '"Add 1 dozen eggs and sourdough bread"', desc: 'Multi-item / dozen parsing' },
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
                { say: '"Doodh hatao"', desc: 'Hindi removal command' },
                { say: '"Paal delete pannu"', desc: 'Tamil removal command' },
                { say: '"Clear shopping list"', desc: 'Empties the entire cart' },
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
              <span>3. Search & Currency / Price Filtering</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { say: '"Find toothpaste under $5"', desc: 'Filters products priced under $5.00' },
                { say: '"Find earphones under 500 rupees"', desc: 'Recognizes Indian Rupees / Rs filter' },
                { say: '"Show seasonal items"', desc: 'Opens peak harvest recommendations' },
                { say: '"What is on sale?"', desc: 'Opens weekly discounts & flyer deals' },
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
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Languages: English (India/US/UK), हिन्दी (Hindi), தமிழ் (Tamil), Español, Français, Deutsch</span>
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
