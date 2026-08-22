import React from 'react';
import { SmartSuggestion } from '../types';
import { Plus, Check, RotateCcw, Leaf } from 'lucide-react';

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
  const habitualSuggestions = suggestions.filter((s) => s.type === 'history');
  const seasonalSuggestions = suggestions.filter((s) => s.type === 'seasonal' || s.type === 'sale');

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-4">
      
      {/* 1. Habitual Routine Reorders Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Habitual Routine Reorders
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Automated Reorder Radar
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {habitualSuggestions.map((sug) => {
            const isAdded = addedSuggestionIds.has(sug.id);

            return (
              <div
                key={sug.id}
                className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-700/60 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                    {sug.item.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ${sug.item.price.toFixed(2)}
                    </span>
                    <span>· {sug.reason}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAddSuggestion(sug)}
                  disabled={isAdded}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 shadow-2xs'
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
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Seasonal Harvest & Market Specials
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Peak Harvest
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {seasonalSuggestions.map((sug) => {
            const isAdded = addedSuggestionIds.has(sug.id);

            return (
              <div
                key={sug.id}
                className="p-2.5 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border border-slate-200/70 dark:border-zinc-700/60 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                    {sug.item.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ${sug.item.price.toFixed(2)}
                    </span>
                    <span>· {sug.badge}</span>
                  </div>
                </div>

                <button
                  onClick={() => onAddSuggestion(sug)}
                  disabled={isAdded}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90 shadow-2xs'
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
  );
};
