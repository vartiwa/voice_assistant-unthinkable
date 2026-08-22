import React, { useState } from 'react';
import { SmartSuggestion, SuggestionType } from '../types';
import { Sparkles, Calendar, ArrowRightLeft, Tag, Plus, Check, Clock } from 'lucide-react';

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
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'seasonal':
        return <Calendar className="w-4 h-4 text-emerald-500" />;
      case 'sale':
        return <Tag className="w-4 h-4 text-purple-500" />;
      case 'substitute':
        return <ArrowRightLeft className="w-4 h-4 text-amber-500" />;
    }
  };

  const getBadgeColor = (type: SuggestionType) => {
    switch (type) {
      case 'history':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/60 dark:border-blue-900';
      case 'seasonal':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900';
      case 'sale':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/60 dark:border-purple-900';
      case 'substitute':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/60 dark:border-amber-900';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              Smart Suggestions
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI recommendations based on history, seasons, and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {[
          { key: 'all', label: 'All Suggestions' },
          { key: 'history', label: 'Running Low / History' },
          { key: 'seasonal', label: 'In Season' },
          { key: 'sale', label: 'On Sale' },
          { key: 'substitute', label: 'Substitutes' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white dark:bg-emerald-600 dark:text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Suggestion Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredSuggestions.map((suggestion) => {
          const isAdded = addedSuggestionIds.has(suggestion.id);

          return (
            <div
              key={suggestion.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badge and Type */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getBadgeColor(
                      suggestion.type
                    )}`}
                  >
                    {getIcon(suggestion.type)}
                    <span>{suggestion.badge}</span>
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {suggestion.reason}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {suggestion.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  {suggestion.description}
                </p>
              </div>

              {/* Item Info & Quick Add Action */}
              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2">
                <div>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block">
                    {suggestion.item.name}
                  </span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                    ${suggestion.item.price.toFixed(2)} / {suggestion.item.unit}
                  </span>
                </div>

                <button
                  onClick={() => onAddSuggestion(suggestion)}
                  disabled={isAdded}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
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
                      <span>Add to List</span>
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
