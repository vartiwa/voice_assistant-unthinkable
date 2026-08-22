import React, { useState, useEffect } from 'react';
import { X, Search, Filter, Plus, Check } from 'lucide-react';
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

  // Filter Catalog
  const filteredProducts = PRODUCT_CATALOG.filter((product) => {
    // Text search (name, brand, category)
    if (query.trim()) {
      const q = query.toLowerCase();
      const matchesText =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q);
      if (!matchesText) return false;
    }

    // Price filter
    if (maxPrice !== null && product.price > maxPrice) {
      return false;
    }

    // Organic filter
    if (organicOnly && !product.isOrganic) {
      return false;
    }

    // Sales filter
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Voice-Activated Catalog Search
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name, brand, or category..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Filters:
            </span>

            {[
              { label: 'All Prices', val: null },
              { label: 'Under $3', val: 3 },
              { label: 'Under $5', val: 5 },
              { label: 'Under $10', val: 10 },
            ].map((p) => (
              <button
                key={p.label}
                onClick={() => setMaxPrice(p.val)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  maxPrice === p.val
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                }`}
              >
                {p.label}
              </button>
            ))}

            <button
              onClick={() => setOrganicOnly(!organicOnly)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                organicOnly
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              🌱 Organic Only
            </button>

            <button
              onClick={() => setSalesOnly(!salesOnly)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                salesOnly
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              🏷️ On Sale
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
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
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl">{product.imageIcon}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                          {product.name}
                        </span>
                        {product.isOrganic && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Organic
                          </span>
                        )}
                        {product.onSale && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
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
                      <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        per {product.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddProduct(product)}
                      disabled={isAdded}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
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

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
          Showing {filteredProducts.length} items from product database
        </div>

      </div>
    </div>
  );
};
