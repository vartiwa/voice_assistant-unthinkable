import React, { useState } from 'react';
import { SmartSuggestion, SuggestionType } from '../types';
import { Calendar, ArrowRightLeft, Tag, Plus, Check, Clock } from 'lucide-react';

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

  const getIcon = (type: SuggestionType) => {
    switch (type) {
      case 'history':
        return <Clock className="w-3.5 h-3.5 text-blue-500" />;
      case 'seasonal':
        return <Calendar className="w-3.5 h-3.5 text-emerald-500" />;
      case 'sale':
        return <Tag className="w-3.5 h-3.5 text-purple-500" />;
      case 'substitute':
        return <ArrowRightLeft className="w-3.5 h-3.5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-6 border border-slate-200/80 dark:border-zinc-800 shadow-sm space-y-5 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">
              Smart Suggestions
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
            Recommendations tailored to your routine, season, and preferences
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'All Suggestions' },
          { key: 'history', label: 'Routine Reorder' },
          { key: 'seasonal', label: 'In Season' },
          { key: 'sale', label: 'Deals & Sales' },
          { key: 'substitute', label: 'Substitutes' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`text-xs px-3.5 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSuggestions.map((suggestion) => {
          const isAdded = addedSuggestionIds.has(suggestion.id);

          return (
            <div
              key={suggestion.id}
              className="p-5 rounded-[22px] border border-slate-200/80 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-slate-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white dark:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700 text-slate-700 dark:text-slate-300 shadow-2xs">
                    {getIcon(suggestion.type)}
                    <span>{suggestion.badge}</span>
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {suggestion.reason}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mt-2">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {suggestion.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-zinc-700/60 flex items-center justify-between gap-2">
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    {suggestion.item.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">
                    ${suggestion.item.price.toFixed(2)} / {suggestion.item.unit}
                  </span>
                </div>

                <button
                  onClick={() => onAddSuggestion(suggestion)}
                  disabled={isAdded}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isAdded
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-sm hover:scale-105 active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
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
