import React, { useMemo, useState } from 'react';
import { ArrowUpDown, Check, Filter, Heart, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { RecentlyViewed } from '../common/RecentlyViewed';

export const ShopPage: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setSelectedProduct,
    setCurrentView,
    toggleWishlist,
    isInWishlist,
    addToCart,
    categories,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low-high' | 'price-high-low' | 'discount'>('featured');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'New In' && selectedCategory !== 'Sale') {
        const catMatch =
          p.category.toLowerCase() === selectedCategory.toLowerCase() ||
          (p.subCategory && p.subCategory.toLowerCase() === selectedCategory.toLowerCase());
        if (!catMatch) return false;
      }

      // Sale match
      if (selectedCategory === 'Sale' && !p.discount) {
        return false;
      }

      // Badge filter
      if (selectedBadge !== 'all') {
        if (selectedBadge === 'New' && p.badge !== 'New') return false;
        if (selectedBadge === 'Bestseller' && p.badge !== 'Bestseller') return false;
      }

      // In stock
      if (inStockOnly && p.stock <= 0) return false;

      // Price range
      if (p.price > maxPrice) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [products, selectedCategory, selectedBadge, inStockOnly, maxPrice, searchQuery]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'newest') {
      return list.reverse();
    } else if (sortBy === 'price-low-high') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      return list.sort((a, b) => {
        const discA = parseInt(a.discount) || 0;
        const discB = parseInt(b.discount) || 0;
        return discB - discA;
      });
    }
    return list;
  }, [filteredProducts, sortBy]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedBadge('all');
    setInStockOnly(false);
    setMaxPrice(5000);
    setSortBy('featured');
  };

  const hasActiveFilters =
    (selectedCategory !== 'All' && selectedCategory !== 'New In') ||
    selectedBadge !== 'all' ||
    inStockOnly ||
    maxPrice < 5000 ||
    searchQuery.trim().length > 0;

  return (
    <div className="w-full bg-[#fdfcfb] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Header Title & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200/80 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-stone-900 tracking-tight">
              {selectedCategory === 'All' ? 'Complete Collection' : selectedCategory}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Showing {sortedProducts.length} handcrafted designer pieces
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-stone-300 rounded-md bg-white"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 hidden sm:inline">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-stone-300 rounded-md px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">New Arrivals First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap py-3 border-b border-stone-100 text-xs">
            <span className="text-stone-400 font-medium">Active Filters:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                Category: {selectedCategory}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSelectedCategory('All')}
                />
              </span>
            )}
            {selectedBadge !== 'all' && (
              <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                Badge: {selectedBadge}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSelectedBadge('all')}
                />
              </span>
            )}
            {inStockOnly && (
              <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                In Stock Only
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setInStockOnly(false)}
                />
              </span>
            )}
            {maxPrice < 5000 && (
              <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                Up to ₹{maxPrice.toLocaleString('en-IN')}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setMaxPrice(5000)}
                />
              </span>
            )}
            {searchQuery && (
              <span className="bg-stone-100 text-stone-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                Query: "{searchQuery}"
                <X
                  className="w-3 h-3 cursor-pointer hover:text-black"
                  onClick={() => setSearchQuery('')}
                />
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-[#E07A5F] hover:underline font-medium text-xs ml-2 cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block md:col-span-3 space-y-6 pr-4">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-3">
                Categories
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-600">
                <li>
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                      selectedCategory === 'All'
                        ? 'font-bold bg-stone-900 text-white'
                        : 'hover:bg-stone-100'
                    }`}
                  >
                    All Categories ({products.length})
                  </button>
                </li>
                {categories.map((c) => {
                  const count = products.filter((p) => p.category === c.name).length;
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => setSelectedCategory(c.name)}
                        className={`w-full text-left py-1 px-2 rounded-md transition-colors flex items-center justify-between ${
                          selectedCategory === c.name
                            ? 'font-bold bg-stone-900 text-white'
                            : 'hover:bg-stone-100'
                        }`}
                      >
                        <span>{c.name}</span>
                        <span className="text-[10px] opacity-60">({count})</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Price Range */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between text-xs font-semibold text-stone-900 mb-2">
                <span>Max Price:</span>
                <span className="text-[#E07A5F]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-stone-900 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹500</span>
                <span>₹5,000+</span>
              </div>
            </div>

            {/* Product Badges */}
            <div className="pt-4 border-t border-stone-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-900 mb-2.5">
                Collection Type
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  { label: 'All Pieces', value: 'all' },
                  { label: 'New Arrivals', value: 'New' },
                  { label: 'Bestsellers', value: 'Bestseller' },
                ].map((b) => (
                  <label key={b.value} className="flex items-center gap-2 cursor-pointer text-stone-700">
                    <input
                      type="radio"
                      name="badgeFilter"
                      checked={selectedBadge === b.value}
                      onChange={() => setSelectedBadge(b.value)}
                      className="accent-stone-900"
                    />
                    <span>{b.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-4 border-t border-stone-200">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-stone-900 rounded-sm"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="md:col-span-9">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-stone-200/60 p-8">
                <SlidersHorizontal className="w-10 h-10 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-800">No products match your filters</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                  Try broadening your price limit or clearing active search keywords.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 bg-stone-900 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-black transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} showCategory />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Recently Viewed in Shop Catalog */}
        <RecentlyViewed limit={4} />
      </div>
    </div>
  );
};
