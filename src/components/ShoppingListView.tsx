import React, { useState } from 'react';
import { ShoppingItem, Category } from '../types';
import { Check, Plus, Minus, Trash2, ArrowRightLeft, Package, Copy, Search } from 'lucide-react';
import { SMART_SUBSTITUTES_MAP } from '../data/suggestionsData';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggleComplete: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onDeleteItem: (id: string) => void;
  onApplySubstitute: (originalItem: ShoppingItem) => void;
  onClearList: () => void;
  onQuickAddItem: (name: string, category: Category, price: number) => void;
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
  'Electronics': '🎧',
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
  onQuickAddItem,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [quickName, setQuickName] = useState('');
  const [quickCategory, setQuickCategory] = useState<Category>('Produce');
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filter items by category & search term
  const displayedItems = items.filter((item) => {
    if (filterCategory !== 'All' && item.category !== filterCategory) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Group filtered items by category
  const groupedItems = displayedItems.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const completedCount = items.filter((i) => i.completed).length;

  // Copy list text to clipboard
  const handleCopyList = () => {
    const text = items
      .map(
        (i) =>
          `[${i.completed ? 'x' : ' '}] ${i.quantity} ${i.unit ? i.unit + ' ' : ''}${i.name} ($${(
            i.price * i.quantity
          ).toFixed(2)})`
      )
      .join('\n');

    navigator.clipboard.writeText(`🛒 Shopping List (${items.length} items - Total: $${totalCost.toFixed(2)}):\n\n${text}`);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickName.trim()) {
      onQuickAddItem(quickName.trim(), quickCategory, 3.49);
      setQuickName('');
    }
  };

  const availableCategories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <div className="space-y-4">
      
      {/* 1. Interactive Cart Summary & Action Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">
                Cart Items
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {completedCount} of {items.length} items checked off
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Total Estimate
              </span>
              <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${totalCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={handleCopyList}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Copy Shopping List to Clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>

              {items.length > 0 && (
                <button
                  onClick={onClearList}
                  className="px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60 border border-rose-200/60 dark:border-rose-900/60 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copy confirmation notification */}
        {copiedNotification && (
          <div className="mt-3 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs text-center font-semibold">
            ✓ Copied shopping list to clipboard!
          </div>
        )}

        {/* 2. Search & Category Filters within Cart */}
        {items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Filter items in cart..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setFilterCategory('All')}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    filterCategory === 'All'
                      ? 'bg-slate-900 text-white dark:bg-emerald-600'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  All ({items.length})
                </button>
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-white dark:bg-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {CATEGORY_ICONS[cat] || '📦'} {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Manual Quick-Add Input Row */}
      <form
        onSubmit={handleQuickAddSubmit}
        className="flex items-center gap-2 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
      >
        <input
          type="text"
          value={quickName}
          onChange={(e) => setQuickName(e.target.value)}
          placeholder="Type an item (e.g. Wireless Earphones, Mangoes, Milk)..."
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
        />

        <select
          value={quickCategory}
          onChange={(e) => setQuickCategory(e.target.value as Category)}
          className="text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="Produce">🥬 Produce</option>
          <option value="Dairy & Eggs">🥛 Dairy & Eggs</option>
          <option value="Bakery">🍞 Bakery</option>
          <option value="Electronics">🎧 Electronics</option>
          <option value="Meat & Seafood">🥩 Meat</option>
          <option value="Pantry">🥫 Pantry</option>
          <option value="Beverages">🥤 Beverages</option>
          <option value="Snacks">🍿 Snacks</option>
          <option value="Household">🧼 Household</option>
          <option value="Personal Care">🧴 Personal Care</option>
          <option value="Other">📦 Other</option>
        </select>

        <button
          type="submit"
          disabled={!quickName.trim()}
          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-sm"
        >
          Add Item
        </button>
      </form>

      {/* 4. Categorized Items Display */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            Your Cart is Empty
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Tap the microphone above and speak naturally, or type an item using the quick-add bar above.
          </p>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500">No items match your filter.</p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([category, categoryItems]) => {
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
                              className={`font-bold text-sm text-slate-800 dark:text-slate-100 ${
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
                                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 hover:bg-amber-100 transition-colors font-medium"
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
                          <span className="text-xs font-bold px-2 min-w-[28px] text-center text-slate-800 dark:text-slate-200">
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
                            ${item.price.toFixed(2)}/{item.unit || 'item'}
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
        })
      )}
    </div>
  );
};
