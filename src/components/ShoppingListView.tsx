import React, { useState } from 'react';
import { ShoppingItem, Category } from '../types';
import { 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRightLeft, 
  Package, 
  Copy, 
  Search,
  ShoppingCart
} from 'lucide-react';
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

  const groupedItems = displayedItems.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.05;
  const totalCost = subtotal + estimatedTax;
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleCopyList = () => {
    const text = items
      .map(
        (i) =>
          `[${i.completed ? 'x' : ' '}] ${i.quantity} ${i.unit ? i.unit + ' ' : ''}${i.name} ($${(
            i.price * i.quantity
          ).toFixed(2)})`
      )
      .join('\n');

    navigator.clipboard.writeText(`Shopping List (${items.length} items - Total: $${totalCost.toFixed(2)}):\n\n${text}`);
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
      
      {/* 1. High-Utility Summary Header Card */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white tracking-tight">
                Active Shopping Manifest
              </h3>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                {items.length} items
              </span>
            </div>
            
            {/* Progress status */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-24 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {completedCount}/{items.length} packed ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-mono font-semibold text-slate-400 block uppercase tracking-wider">
                Total (est. tax incl.)
              </span>
              <span className="text-xl font-mono font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                ${totalCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-zinc-800">
              <button
                onClick={handleCopyList}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-200 dark:border-zinc-700"
                title="Copy shopping list"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              {items.length > 0 && (
                <button
                  onClick={onClearList}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-900"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copy Toast */}
        {copiedNotification && (
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs text-center font-bold animate-in fade-in">
            ✓ Copied manifest to clipboard!
          </div>
        )}

        {/* Search & Category Filter Bar */}
        {items.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter cart items (e.g. Milk, Apple, Sony)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Department Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterCategory('All')}
                className={`text-xs px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all border ${
                  filterCategory === 'All'
                    ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white'
                    : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
                }`}
              >
                All ({items.length})
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all border ${
                    filterCategory === cat
                      ? 'bg-zinc-950 text-white border-zinc-950 dark:bg-white dark:text-zinc-950 dark:border-white'
                      : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Structured Quick-Add Input Form */}
      <form
        onSubmit={handleQuickAddSubmit}
        className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/90 dark:border-zinc-800 shadow-xs"
      >
        <input
          type="text"
          value={quickName}
          onChange={(e) => setQuickName(e.target.value)}
          placeholder="Manual item entry (e.g. Sourdough bread, Almond milk)..."
          className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:outline-none text-slate-800 dark:text-slate-100"
        />

        <select
          value={quickCategory}
          onChange={(e) => setQuickCategory(e.target.value as Category)}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="Produce">Produce</option>
          <option value="Dairy & Eggs">Dairy & Eggs</option>
          <option value="Bakery">Bakery</option>
          <option value="Electronics">Electronics</option>
          <option value="Meat & Seafood">Meat & Seafood</option>
          <option value="Pantry">Pantry</option>
          <option value="Beverages">Beverages</option>
          <option value="Snacks">Snacks</option>
          <option value="Household">Household</option>
          <option value="Personal Care">Personal Care</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          disabled={!quickName.trim()}
          className="px-3.5 py-1.5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 disabled:opacity-30 text-xs font-bold rounded-lg transition-all shrink-0"
        >
          + Add
        </button>
      </form>

      {/* 3. Categorized Items */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 text-center border border-slate-200/90 dark:border-zinc-800 shadow-xs">
          <div className="w-9 h-9 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 mb-2">
            <Package className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Shopping Cart Empty
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Speak into your microphone: "Hey Assistant, add milk and earphones"
          </p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([category, categoryItems]) => {
          return (
            <div
              key={category}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-200/90 dark:border-zinc-800 shadow-xs space-y-2.5"
            >
              {/* Department Heading */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400 dark:bg-zinc-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    {category}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    ({categoryItems.length})
                  </span>
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {categoryItems.map((item) => {
                  const substituteKey = Object.keys(SMART_SUBSTITUTES_MAP).find((k) =>
                    item.name.toLowerCase().includes(k)
                  );
                  const hasSubstitute = substituteKey ? SMART_SUBSTITUTES_MAP[substituteKey] : null;

                  return (
                    <div
                      key={item.id}
                      className={`py-2.5 flex items-center justify-between gap-3 transition-all ${
                        item.completed ? 'opacity-40' : 'opacity-100'
                      }`}
                    >
                      {/* Checkbox & Item Details */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={() => onToggleComplete(item.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                            item.completed
                              ? 'bg-zinc-950 border-zinc-950 text-white dark:bg-white dark:border-white dark:text-zinc-950'
                              : 'border-slate-300 dark:border-zinc-700 hover:border-zinc-950 dark:hover:border-white'
                          }`}
                        >
                          {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-semibold text-xs text-slate-900 dark:text-white ${
                                item.completed ? 'line-through text-slate-400 dark:text-zinc-600' : ''
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.isOrganic && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Organic
                              </span>
                            )}
                            {item.brand && (
                              <span className="text-xs text-slate-400 font-medium">
                                · {item.brand}
                              </span>
                            )}
                          </div>

                          {/* Substitute Switcher */}
                          {hasSubstitute && !item.completed && (
                            <button
                              onClick={() => onApplySubstitute(item)}
                              className="mt-1 inline-flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 transition-colors font-medium"
                              title={`Switch to ${hasSubstitute.substituteName}`}
                            >
                              <ArrowRightLeft className="w-3 h-3 text-blue-500" />
                              <span>Switch to {hasSubstitute.substituteName}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stepper, Price & Delete */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center rounded border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-2 min-w-[20px] text-center text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-zinc-700 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-16 text-right">
                          <span className="text-xs font-mono font-bold text-slate-900 dark:text-white block tabular-nums">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            ${item.price.toFixed(2)}/{item.unit || 'item'}
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="Delete item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
