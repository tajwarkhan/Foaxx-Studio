import React, { useEffect, useRef } from 'react';
import { ArrowRight, Flame, History, Search, Sparkles, Tag, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    setCurrentView,
    setSelectedCategory,
  } = useStore();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const trendingQueries = [
    'Pearl Drop Earrings',
    '18K Gold Plated Necklace',
    'Stackable Rings',
    'Floral Co-ord Set',
    'Classic Shoulder Bag',
    'Strappy Heels',
    'Ruched Bodycon Dress',
  ];

  const searchResults = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectProduct = (product: typeof products[0]) => {
    setSelectedProduct(product);
    setIsSearchModalOpen(false);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyQuery = (query: string) => {
    setSearchQuery(query);
  };

  const handleViewAllResults = () => {
    setIsSearchModalOpen(false);
    setSelectedCategory('All');
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      <div className="min-h-full flex items-start justify-center p-3 sm:p-6 pt-10 sm:pt-16">
        <div
          className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery, co-ords, rings, heels, bags..."
              className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(false)}
              className="text-xs font-semibold text-stone-500 hover:text-stone-900 px-2 py-1 rounded-md bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Body: Trending searches & quick categories if no query */}
          {!searchQuery.trim() ? (
            <div className="p-5 sm:p-6 space-y-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
                  <Flame className="w-4 h-4 text-[#E07A5F]" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingQueries.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleApplyQuery(t)}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-stone-400" />
                      <span>{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider mb-3">
                  Popular Categories
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {['Jewellery', 'Earrings', 'Clothing', 'Footwear'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsSearchModalOpen(false);
                        setCurrentView('shop');
                      }}
                      className="p-3 bg-[#FAF8F5] hover:bg-[#F4EFEA] rounded-xl border border-stone-200/50 text-left transition-colors cursor-pointer group"
                    >
                      <p className="text-xs font-semibold text-stone-900 group-hover:text-black">
                        {cat}
                      </p>
                      <span className="text-[10px] text-stone-400">Explore collection →</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Results list */
            <div className="max-h-[60vh] overflow-y-auto divide-y divide-stone-100">
              <div className="p-3 bg-stone-50/70 text-[11px] font-semibold text-stone-500 uppercase tracking-wider flex items-center justify-between">
                <span>
                  {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} Found
                </span>
                {searchResults.length > 0 && (
                  <button
                    onClick={handleViewAllResults}
                    className="text-stone-900 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View All in Catalog</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="p-10 text-center text-stone-500">
                  <p className="text-sm font-semibold text-stone-800">No matching pieces found</p>
                  <p className="text-xs text-stone-400 mt-1">
                    Try searching for "gold", "pearl", "dress", or "ring"
                  </p>
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectProduct(item)}
                    className="w-full p-3 sm:p-4 flex items-center gap-3.5 hover:bg-stone-50 transition-colors text-left cursor-pointer group"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-md bg-stone-100 border border-stone-200/50 shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-900 truncate group-hover:text-black">
                        {item.name}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.category} {item.subCategory ? `· ${item.subCategory}` : ''}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {item.colors?.slice(0, 4).map((c, i) => (
                          <span
                            key={i}
                            className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: c.hex }}
                          />
                        ))}
                        {item.colors && item.colors.length > 4 && (
                          <span className="text-[9px] text-stone-400">+{item.colors.length - 4}</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-stone-900">
                        ₹{item.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-[#E07A5F] font-semibold">{item.discount}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div className="p-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Free Shipping on prepaid orders above ₹999</span>
            <span className="text-stone-400">Press ESC to dismiss</span>
          </div>
        </div>
      </div>
    </div>
  );
};
