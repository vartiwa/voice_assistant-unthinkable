import React, { useState } from 'react';
import { SmartSuggestion, SuggestionType } from '../types';
import { Plus, Check, Compass, RotateCcw, Leaf, Percent, ArrowRightLeft } from 'lucide-react';

interface SuggestionsViewProps {
  suggestions: SmartSuggestion[];
  onAddSuggestion: (suggestion: SmartSuggestion) => void;
  addedSuggestionIds: Set<string>;
}

export const SuggestionsView: React.FC<SuggestionsViewProps> = ({
  suggestions,
  onAddSuggestion,
  addedSuggestionIds,
}) => {
  const [activeTab, setActiveTab] = useState<SuggestionType | 'all'>('all');

  const filteredSuggestions =
    activeTab === 'all'
      ? suggestions
      : suggestions.filter((s) => s.type === activeTab);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight uppercase">
              Intelligence Radar & Routine Reorders
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Predictive replenish alerts based on consumption habits and seasonal harvests
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'All Items', icon: <Compass className="w-3 h-3" /> },
          { key: 'history', label: 'Routine Reorders', icon: <RotateCcw className="w-3 h-3" /> },
          { key: 'seasonal', label: 'In-Season Harvest', icon: <Leaf className="w-3 h-3 text-emerald-500" /> },
          { key: 'sale', label: 'Weekly Flyer Deals', icon: <Percent className="w-3 h-3 text-amber-500" /> },
          { key: 'substitute', label: 'Dietary Switches', icon: <ArrowRightLeft className="w-3 h-3 text-blue-500" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`text-xs px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
              activeTab === tab.key
                ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white'
                : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSuggestions.map((suggestion) => {
          const isAdded = addedSuggestionIds.has(suggestion.id);

          return (
            <div
              key={suggestion.id}
              className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 font-mono">
                    {suggestion.badge}
                  </span>

                  <span className="text-[11px] font-mono text-slate-400 font-medium">
                    {suggestion.reason}
                  </span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {suggestion.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-200/80 dark:border-zinc-700/80 flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-xs text-slate-900 dark:text-white block">
                    {suggestion.item.name}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                    ${suggestion.item.price.toFixed(2)} / {suggestion.item.unit}
                  </span>
                </div>

                <button
                  onClick={() => onAddSuggestion(suggestion)}
                  disabled={isAdded}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:opacity-90'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>+ Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
