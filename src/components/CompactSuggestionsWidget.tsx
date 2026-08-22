import React from 'react';
import { SmartSuggestion } from '../types';
import { Plus, Check, RotateCcw, Leaf, TrendingUp } from 'lucide-react';

interface CompactSuggestionsWidgetProps {
  suggestions: SmartSuggestion[];
  onAddSuggestion: (suggestion: SmartSuggestion) => void;
  addedSuggestionIds: Set<string>;
}

export const CompactSuggestionsWidget: React.FC<CompactSuggestionsWidgetProps> = ({
  suggestions,
  onAddSuggestion,
  addedSuggestionIds,
}) => {
  const habitualSuggestions = suggestions.filter((s) => s.type === 'history').slice(0, 3);
  const seasonalSuggestions = suggestions.filter((s) => s.type === 'seasonal' || s.type === 'sale').slice(0, 3);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col space-y-3">
      
      {/* Top Header matching Sketch (Recomeds) */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 dark:text-white">
            RECOMMENDED
          </h4>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800">
          Smart Radar
        </span>
      </div>

      {/* Content Stream with comfortable scrolling */}
      <div className="max-h-[400px] overflow-y-auto pr-1.5 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-700">
        
        {/* 1. Habitual Routine Reorders Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
              <span>Routine Reorders</span>
            </span>
          </div>

          <div className="space-y-2">
            {habitualSuggestions.map((sug) => {
              const isAdded = addedSuggestionIds.has(sug.id);

              return (
                <div
                  key={sug.id}
                  className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-600 transition-all"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block truncate">
                      {sug.item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-400 mt-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ${sug.item.price.toFixed(2)}
                      </span>
                      <span>· {sug.reason}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddSuggestion(sug)}
                    disabled={isAdded}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 shadow-2xs active:scale-95'
                    }`}
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Seasonal Harvest & Market Specials */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-emerald-500" />
              <span>Seasonal Harvest</span>
            </span>
          </div>

          <div className="space-y-2">
            {seasonalSuggestions.map((sug) => {
              const isAdded = addedSuggestionIds.has(sug.id);

              return (
                <div
                  key={sug.id}
                  className="p-3 rounded-xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 flex items-center justify-between gap-3 shadow-2xs hover:border-slate-300 dark:hover:border-zinc-600 transition-all"
                >
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block truncate">
                      {sug.item.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10.5px] font-mono text-slate-400 mt-0.5">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ${sug.item.price.toFixed(2)}
                      </span>
                      <span>· {sug.badge}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onAddSuggestion(sug)}
                    disabled={isAdded}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 shadow-2xs active:scale-95'
                    }`}
                  >
                    {isAdded ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
