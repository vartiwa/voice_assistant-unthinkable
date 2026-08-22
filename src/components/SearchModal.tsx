import React, { useState, useEffect } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { CatalogProduct, ShoppingItem } from '../types';
import { PRODUCT_CATALOG } from '../data/catalog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialMaxPrice?: number;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'addedAt' | 'completed'>) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  initialMaxPrice,
  onAddItem,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState<number | null>(initialMaxPrice || null);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [salesOnly, setSalesOnly] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setQuery(initialQuery);
    setMaxPrice(initialMaxPrice || null);
  }, [initialQuery, initialMaxPrice, isOpen]);

  if (!isOpen) return null;

  const filteredProducts = PRODUCT_CATALOG.filter((product) => {
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchesText =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    if (maxPrice !== null && product.price > maxPrice) {
      return false;
    }

    if (organicOnly && !product.isOrganic) {
      return false;
    }

    if (salesOnly && !product.onSale) {
      return false;
    }

    return true;
  });

  const handleAddProduct = (product: CatalogProduct) => {
    onAddItem({
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: product.unit,
      price: product.price,
      brand: product.brand,
      isOrganic: product.isOrganic,
    });
    setAddedIds((prev) => new Set([...prev, product.id]));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#F7F6F3] dark:bg-zinc-900 rounded-[32px] max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200/90 dark:border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200/70 dark:border-zinc-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Product Catalog
            </h3>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-slate-300">
              {filteredProducts.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-white/70 dark:bg-zinc-900/70 border-b border-slate-200/70 dark:border-zinc-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name, brand, or category..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-zinc-800 border border-slate-200/70 dark:border-zinc-700 focus:outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {[
              { label: 'All Prices', val: null },
              { label: 'Under $3', val: 3 },
              { label: 'Under $5', val: 5 },
              { label: 'Under $10', val: 10 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => setMaxPrice(p.val)}
                className={`px-3 py-1 rounded-full font-bold transition-all ${
                  maxPrice === p.val
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                    : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
                }`}
              >
                {p.label}
              </button>
            ))}

            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                organicOnly
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
              }`}
            >
              🌱 Organic
            </button>

            <button
              onClick={() => setSalesOnly(!salesOnly)}
              className={`px-3 py-1 rounded-full font-bold transition-all ${
                salesOnly
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                  : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50'
              }`}
            >
              🏷️ On Sale
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-200/60 dark:divide-zinc-800">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                No matching products found.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Try adjusting your search term or increasing the price filter.
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isAdded = addedIds.has(product.id);

              return (
                <div
                  key={product.id}
                  className="py-3 flex items-center justify-between gap-3 px-2 rounded-2xl hover:bg-white/60 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{product.imageIcon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {product.name}
                        </span>
                        {product.isOrganic && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Organic
                          </span>
                        )}
                        {product.onSale && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Sale
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {product.brand} • {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-sm font-black text-slate-900 dark:text-white block">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        per {product.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddProduct(product)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
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
            })
          )}
        </div>

      </div>
    </div>
  );
};
