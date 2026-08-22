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
  Apple,
  Milk,
  Cookie,
  Beef,
  Coffee,
  Snowflake,
  Headphones,
  Home,
  Heart,
  Box,
  Sparkles
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

const getCategorySVG = (category: Category) => {
  switch (category) {
    case 'Produce':
      return <Apple className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    case 'Dairy & Eggs':
      return <Milk className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    case 'Bakery':
      return <Cookie className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
    case 'Meat & Seafood':
      return <Beef className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
    case 'Beverages':
      return <Coffee className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
    case 'Frozen':
      return <Snowflake className="w-4 h-4 text-sky-600 dark:text-sky-400" />;
    case 'Electronics':
      return <Headphones className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
    case 'Household':
      return <Home className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
    case 'Personal Care':
      return <Heart className="w-4 h-4 text-pink-600 dark:text-pink-400" />;
    case 'Pantry':
      return <Box className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    case 'Snacks':
      return <Sparkles className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    default:
      return <Package className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
  }
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

  const totalCost = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const completedCount = items.filter((i) => i.completed).length;

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
    <div className="space-y-4 pb-28">
      
      {/* 1. Header Summary Card (Spacious Desktop Design) */}
      <div className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Shopping Cart
              </h3>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-slate-800 dark:text-slate-200">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {completedCount} of {items.length} completed
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                Cart Total
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                ${totalCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-zinc-800">
              <button
                onClick={handleCopyList}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                title="Copy shopping list to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>

              {items.length > 0 && (
                <button
                  onClick={onClearList}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Copy Toast */}
        {copiedNotification && (
          <div className="mt-2.5 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 text-xs text-center font-bold animate-in fade-in">
            ✓ Copied shopping list to clipboard!
          </div>
        )}

        {/* Search & Category Filter Bar */}
        {items.length > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search items in cart..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Category Pills with crisp SVGs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterCategory('All')}
                className={`text-xs px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  filterCategory === 'All'
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All ({items.length})
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    filterCategory === cat
                      ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-2xs'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {getCategorySVG(cat)}
                  <span>{cat}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 2. Inline Quick-Add Form */}
      <form
        onSubmit={handleQuickAddSubmit}
        className="flex items-center gap-2 bg-white dark:bg-zinc-900 p-2.5 rounded-2xl border border-slate-200/80 dark:border-zinc-800 shadow-2xs"
      >
        <input
          type="text"
          value={quickName}
          onChange={(e) => setQuickName(e.target.value)}
          placeholder="Quick add item (e.g. Earphones, Bananas, Bread)..."
          className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 focus:outline-none text-slate-800 dark:text-slate-100"
        />

        <select
          value={quickCategory}
          onChange={(e) => setQuickCategory(e.target.value as Category)}
          className="text-xs px-2.5 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/60 dark:border-zinc-700/60 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="Produce">Produce</option>
          <option value="Dairy & Eggs">Dairy & Eggs</option>
          <option value="Bakery">Bakery</option>
          <option value="Electronics">Electronics</option>
          <option value="Meat & Seafood">Meat</option>
          <option value="Pantry">Pantry</option>
          <option value="Beverages">Beverages</option>
          <option value="Snacks">Snacks</option>
          <option value="Household">Household</option>
          <option value="Other">Other</option>
        </select>

        <button
          type="submit"
          disabled={!quickName.trim()}
          className="px-4 py-2 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 disabled:opacity-30 text-xs font-bold rounded-xl transition-all shadow-2xs shrink-0"
        >
          Add
        </button>
      </form>

      {/* 3. Items Grouped by Department with Crisp SVGs & Spacious Rows */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-10 text-center border border-slate-200/80 dark:border-zinc-800 shadow-2xs">
          <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-900 dark:text-white mb-2.5">
            <Package className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Your Shopping Cart is Empty
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Speak into your microphone: "Hey Assistant, add earphones and milk"
          </p>
        </div>
      ) : (
        Object.entries(groupedItems).map(([category, categoryItems]) => {
          const catKey = category as Category;

          return (
            <div
              key={category}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 shadow-2xs space-y-3"
            >
              {/* Category Header with Clean SVG */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                    {getCategorySVG(catKey)}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {category}
                  </h4>
                  <span className="text-xs text-slate-400 font-medium">
                    ({categoryItems.length})
                  </span>
                </div>
              </div>

              {/* Product Rows with Spacious Spacing */}
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {categoryItems.map((item) => {
                  const substituteKey = Object.keys(SMART_SUBSTITUTES_MAP).find((k) =>
                    item.name.toLowerCase().includes(k)
                  );
                  const hasSubstitute = substituteKey ? SMART_SUBSTITUTES_MAP[substituteKey] : null;

                  return (
                    <div
                      key={item.id}
                      className={`py-3 flex items-center justify-between gap-3 transition-all ${
                        item.completed ? 'opacity-50' : 'opacity-100'
                      }`}
                    >
                      {/* Checkbox & Item Details */}
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => onToggleComplete(item.id)}
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
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
                              className={`font-bold text-sm text-slate-900 dark:text-white ${
                                item.completed ? 'line-through text-slate-400 dark:text-zinc-600' : ''
                              }`}
                            >
                              {item.name}
                            </span>
                            {item.isOrganic && (
                              <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                Organic
                              </span>
                            )}
                            {item.brand && (
                              <span className="text-xs text-slate-400 font-medium">
                                • {item.brand}
                              </span>
                            )}
                          </div>

                          {/* Substitute Switcher Pill */}
                          {hasSubstitute && !item.completed && (
                            <button
                              onClick={() => onApplySubstitute(item)}
                              className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60 hover:bg-amber-100 transition-colors font-medium"
                              title={`Substitute with ${hasSubstitute.substituteName}`}
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              <span>Switch to {hasSubstitute.substituteName}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Stepper, Price & Delete */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 p-0.5">
                          <button
                            onClick={() => onUpdateQuantity(item.id, -1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2.5 min-w-[24px] text-center text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, 1)}
                            className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="w-16 text-right">
                          <span className="text-sm font-black text-slate-900 dark:text-white block">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            ${item.price.toFixed(2)}/{item.unit || 'item'}
                          </span>
                        </div>

                        <button
                          onClick={() => onDeleteItem(item.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
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
