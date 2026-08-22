import React, { useState } from 'react';
import { ShoppingItem, Category } from '../types';
import { 
  Check, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRightLeft, 
  Copy, 
  Search,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Tag,
  Package
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
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const estimatedTax = (subtotal - discount) * 0.05;
  const totalCost = subtotal - discount + estimatedTax;
  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      setCouponApplied(true);
    }
  };

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

  // Emoji helper
  const getProductEmoji = (name: string, category: string) => {
    const n = name.toLowerCase();
    if (n.includes('apple')) return '🍎';
    if (n.includes('milk') || n.includes('doodh')) return '🥛';
    if (n.includes('bread') || n.includes('loaf')) return '🍞';
    if (n.includes('earphone') || n.includes('headphone') || n.includes('sony')) return '🎧';
    if (n.includes('paneer') || n.includes('cheese')) return '🧀';
    if (n.includes('atta') || n.includes('flour') || n.includes('wheat')) return '🌾';
    if (n.includes('egg')) return '🥚';
    if (n.includes('banana')) return '🍌';
    if (n.includes('coffee') || n.includes('tea')) return '☕';
    if (category === 'Produce') return '🥗';
    if (category === 'Dairy & Eggs') return '🧀';
    if (category === 'Bakery') return '🥐';
    if (category === 'Electronics') return '🔌';
    return '📦';
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 sm:p-6 border border-slate-200/90 dark:border-zinc-800 shadow-xs flex flex-col h-[calc(100vh-6rem)] max-h-[820px] overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & FILTER CONTROLS (STATIC, PINNED ON TOP)   */}
      {/* ======================================================== */}
      <div className="space-y-3 shrink-0 pb-3 border-b border-slate-100 dark:border-zinc-800">
        
        {/* Header (Cart Title & Progress) */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-slate-800 dark:text-slate-200" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                CART
              </h3>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-700">
                {items.length} items
              </span>
            </div>

            {/* Progress Meter */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-20 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {completedCount}/{items.length} packed ({progressPercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyList}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors border border-slate-200 dark:border-zinc-700 text-xs"
              title="Copy shopping list"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {items.length > 0 && (
              <button
                onClick={onClearList}
                className="px-2 py-1 text-xs font-semibold rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-900"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Copy Notification Toast */}
        {copiedNotification && (
          <div className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs text-center font-bold animate-in fade-in">
            ✓ Copied manifest to clipboard!
          </div>
        )}

        {/* Quick Search Input */}
        {items.length > 0 && (
          <div className="space-y-1.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700 focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
            </div>

            {/* Department Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                onClick={() => setFilterCategory('All')}
                className={`text-[11px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
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
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap transition-all border ${
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

        {/* Quick Item Add Bar */}
        <form
          onSubmit={handleQuickAddSubmit}
          className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700"
        >
          <input
            type="text"
            value={quickName}
            onChange={(e) => setQuickName(e.target.value)}
            placeholder="Quick add item..."
            className="flex-1 px-2 py-1 text-xs bg-transparent focus:outline-none text-slate-800 dark:text-slate-100"
          />

          <select
            value={quickCategory}
            onChange={(e) => setQuickCategory(e.target.value as Category)}
            className="text-[10.5px] px-1.5 py-1 rounded-lg bg-white dark:bg-zinc-700 border border-slate-200 dark:border-zinc-600 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="Produce">Produce</option>
            <option value="Dairy & Eggs">Dairy</option>
            <option value="Bakery">Bakery</option>
            <option value="Electronics">Tech</option>
            <option value="Pantry">Pantry</option>
            <option value="Beverages">Drinks</option>
            <option value="Other">Other</option>
          </select>

          <button
            type="submit"
            disabled={!quickName.trim()}
            className="px-2 py-1 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 disabled:opacity-30 text-xs font-bold rounded-lg transition-all shrink-0"
          >
            + Add
          </button>
        </form>

      </div>

      {/* ======================================================== */}
      {/* 2. MIDDLE PRODUCT ITEMS LIST (INDEPENDENT ISOLATED SCROLL)*/}
      {/* ======================================================== */}
      <div 
        className="flex-1 overflow-y-auto overscroll-contain pr-1.5 space-y-2.5 min-h-0 my-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-700"
        tabIndex={0}
      >
        {displayedItems.length === 0 ? (
          <div className="rounded-2xl p-6 text-center border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30">
            <div className="w-8 h-8 mx-auto rounded-lg bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400 mb-1.5">
              <Package className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Cart is Empty
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Speak: "Hey Assistant, add milk"
            </p>
          </div>
        ) : (
          displayedItems.map((item) => {
            const substituteKey = Object.keys(SMART_SUBSTITUTES_MAP).find((k) =>
              item.name.toLowerCase().includes(k)
            );
            const hasSubstitute = substituteKey ? SMART_SUBSTITUTES_MAP[substituteKey] : null;

            return (
              <div
                key={item.id}
                className={`p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200/80 dark:border-zinc-700/60 space-y-2 transition-all ${
                  item.completed ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {/* Top: Checkbox + Icon + Title + Unit Price + Delete */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleComplete(item.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
                        item.completed
                          ? 'bg-zinc-950 border-zinc-950 text-white dark:bg-white dark:border-white dark:text-zinc-950'
                          : 'border-slate-300 dark:border-zinc-600 hover:border-zinc-950 dark:hover:border-white'
                      }`}
                    >
                      {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    {/* Icon */}
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-700 flex items-center justify-center text-base shrink-0 border border-slate-200 dark:border-zinc-600 shadow-2xs">
                      {getProductEmoji(item.name, item.category)}
                    </div>

                    {/* Name & Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-bold text-xs text-slate-900 dark:text-white truncate block ${
                            item.completed ? 'line-through text-slate-400 dark:text-zinc-500' : ''
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.isOrganic && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            Organic
                          </span>
                        )}
                      </div>
                      <span className="text-[10.5px] font-mono text-slate-400">
                        ${item.price.toFixed(2)}/{item.unit || 'item'} · {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Trash Delete */}
                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dietary Substitute Switcher if available */}
                {hasSubstitute && !item.completed && (
                  <button
                    onClick={() => onApplySubstitute(item)}
                    className="w-full text-left inline-flex items-center justify-between text-[10px] px-2 py-0.5 rounded-lg bg-blue-50/80 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 transition-colors font-medium"
                  >
                    <span className="flex items-center gap-1">
                      <ArrowRightLeft className="w-3 h-3 text-blue-600" />
                      <span>Switch alternative:</span>
                    </span>
                    <span className="font-bold underline">{hasSubstitute.substituteName}</span>
                  </button>
                )}

                {/* Bottom: Quantity Stepper + Line Subtotal */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                    Qty: {item.quantity} {item.unit || ''}
                  </span>

                  <div className="flex items-center gap-3">
                    {/* Stepper */}
                    <div className="flex items-center rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-1 py-0.5 shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold px-2 text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="p-0.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Row Subtotal */}
                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. DOWN PRICING BREAKDOWN & CHECKOUT (STATIC, PINNED)    */}
      {/* ======================================================== */}
      <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-2.5 shrink-0">
        
        {/* Pricing Rows */}
        <div className="space-y-1 text-xs font-medium">
          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Subtotal</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Shipping</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              FREE
            </span>
          </div>

          {couponApplied && (
            <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
              <span>Voice Promo (10%)</span>
              <span className="font-mono font-bold">
                -${discount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>Estimated Tax (5%)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              ${estimatedTax.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Promo Coupon Form */}
        <form onSubmit={handleApplyCoupon} className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Tag className="w-3 h-3 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Promo code (VOICE10)"
              className="w-full pl-7 pr-2 py-1 text-xs rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-slate-800 dark:text-white transition-colors border border-slate-200 dark:border-zinc-700"
          >
            Apply
          </button>
        </form>

        {/* Total Highlight */}
        <div className="pt-1.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
            Total
          </span>
          <span className="text-lg font-mono font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
            ${totalCost.toFixed(2)}
          </span>
        </div>

        {/* Proceed to Checkout CTA Button */}
        <button
          onClick={handleCopyList}
          className="w-full py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-zinc-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-medium">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>SSL 256-Bit Encrypted Voice Checkout</span>
        </div>

      </div>

    </div>
  );
};
