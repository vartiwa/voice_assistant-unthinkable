import React from 'react';
import { ShoppingItem, Category } from '../types';
import { Check, Plus, Minus, Trash2, ArrowRightLeft, Package } from 'lucide-react';
import { SMART_SUBSTITUTES_MAP } from '../data/suggestionsData';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggleComplete: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onDeleteItem: (id: string) => void;
  onApplySubstitute: (originalItem: ShoppingItem) => void;
  onClearList: () => void;
}

const CATEGORY_ICONS: Record<Category, string> = {
  'Produce': '🥬',
  'Dairy & Eggs': '🥛',
  'Bakery': '🍞',
  'Meat & Seafood': '🥩',
  'Pantry': '🥫',
  'Beverages': '🥤',
  'Snacks': '🍿',
  'Frozen': '❄️',
  'Household': '🧼',
  'Personal Care': '🧴',
  'Other': '📦'
};

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleComplete,
  onUpdateQuantity,
  onDeleteItem,
  onApplySubstitute,
  onClearList,
}) => {
  // Group items by category
  const groupedItems = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const completedCount = items.filter((i) => i.completed).length;

  if (items.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Your Shopping List is Empty
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Tap the microphone above and say <span className="font-semibold text-emerald-600">"Add milk"</span> or <span className="font-semibold text-emerald-600">"I need 3 apples"</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar with Summary & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>Shopping List</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {completedCount} of {items.length} completed
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Estimated Total</span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              ${totalCost.toFixed(2)}
            </span>
          </div>

          <button
            onClick={onClearList}
            className="text-xs px-3 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 border border-rose-200/50 dark:border-rose-900/50 font-medium transition-colors"
          >
            Clear List
          </button>
        </div>
      </div>

      {/* Categorized Items List */}
      {Object.entries(groupedItems).map(([category, categoryItems]) => {
        const catKey = category as Category;
        const icon = CATEGORY_ICONS[catKey] || '📦';

        return (
          <div
            key={category}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">{icon}</span>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {category}
                </h3>
                <span className="text-xs text-slate-400 font-normal">
                  ({categoryItems.length})
                </span>
              </div>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {categoryItems.map((item) => {
                // Check if this item has an available substitute
                const substituteKey = Object.keys(SMART_SUBSTITUTES_MAP).find((k) =>
                  item.name.toLowerCase().includes(k)
                );
                const hasSubstitute = substituteKey ? SMART_SUBSTITUTES_MAP[substituteKey] : null;

                return (
                  <div
                    key={item.id}
                    className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-opacity ${
                      item.completed ? 'opacity-60' : 'opacity-100'
                    }`}
                  >
                    {/* Left: Checkbox & Name */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={() => onToggleComplete(item.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all mt-0.5 sm:mt-0 ${
                          item.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                        }`}
                      >
                        {item.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`font-semibold text-sm text-slate-800 dark:text-slate-100 ${
                              item.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                            }`}
                          >
                            {item.name}
                          </span>
                          {item.isOrganic && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              Organic
                            </span>
                          )}
                          {item.brand && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              • {item.brand}
                            </span>
                          )}
                        </div>

                        {/* Substitute Suggestion Badge */}
                        {hasSubstitute && !item.completed && (
                          <div className="mt-1.5 flex items-center gap-2">
                            <button
                              onClick={() => onApplySubstitute(item)}
                              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
                              title={`Substitute with ${hasSubstitute.substituteName}`}
                            >
                              <ArrowRightLeft className="w-2.5 h-2.5" />
                              <span>Switch to {hasSubstitute.substituteName}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Quantity controls, Price, & Delete */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                      {/* Quantity Incrementor */}
                      <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2 min-w-[28px] text-center text-slate-800 dark:text-slate-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Item Price */}
                      <div className="w-16 text-right">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ${item.price.toFixed(2)}/{item.unit}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
