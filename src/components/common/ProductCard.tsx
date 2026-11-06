import React, { useState } from 'react';
import { Eye, Heart, Share2, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
  showCategory?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, showCategory = false }) => {
  const {
    setSelectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
    addRecentlyViewed,
    openShareModal,
  } = useStore();

  const [activeColor, setActiveColor] = useState<string>(
    product.colors && product.colors[0] ? product.colors[0].name : ''
  );

  const matchedColorObj = product.colors?.find((c) => c.name === activeColor);
  const displayedImage = matchedColorObj?.image || product.image;

  const isSaved = isInWishlist(product.id);

  const handleCardClick = () => {
    addRecentlyViewed(product.id);
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addRecentlyViewed(product.id);
    addToCart(product, 1, activeColor);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    addRecentlyViewed(product.id);
    setQuickViewProduct(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col cursor-pointer bg-white rounded-lg p-2.5 border border-stone-200/50 hover:shadow-md transition-all relative"
    >
      {/* Product Image Container */}
      <div className="relative w-full aspect-[146/155] rounded-md overflow-hidden bg-stone-100 border border-stone-200/50">
        <img
          src={displayedImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top-Left Badge */}
        {product.badge && (
          <span
            className={`absolute top-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-xs leading-none shadow-xs uppercase tracking-wider ${
              product.badge === 'New'
                ? 'bg-[#E54F4F] text-white'
                : 'bg-[#181818] text-white'
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Top-Right Actions: Wishlist Heart & Quick View Eye */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            aria-label="Add to wishlist"
            className="w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs group/heart"
          >
            <Heart
              className={`w-3.5 h-3.5 transition-colors ${
                isSaved
                  ? 'fill-[#E07A5F] text-[#E07A5F]'
                  : 'text-stone-700 group-hover/heart:text-stone-900'
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleQuickView}
            aria-label="Quick View"
            title="Quick View"
            className="w-6 h-6 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all cursor-pointer shadow-2xs text-stone-700 hover:text-black sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openShareModal(product);
            }}
            aria-label="Share & Earn 100 FOAXX Coins"
            title="Share & Earn 100 FOAXX Coins"
            className="w-6 h-6 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs text-amber-800 hover:text-amber-950 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Add Overlay on desktop hover */}
        <div className="absolute inset-x-1.5 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={handleQuickView}
              className="bg-white/95 hover:bg-white text-stone-900 text-[10px] font-semibold py-1.5 rounded-xs shadow-xs tracking-wider cursor-pointer border border-stone-200"
            >
              Quick View
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              className="bg-stone-900/95 hover:bg-black text-white text-[10px] font-semibold py-1.5 rounded-xs shadow-xs tracking-wider cursor-pointer"
            >
              + Quick Bag
            </button>
          </div>
        </div>
      </div>

      {/* Category tag if enabled */}
      {showCategory && (
        <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-2 block font-medium">
          {product.category}
        </span>
      )}

      {/* Product Name */}
      <h3 className="mt-2 text-xs font-medium text-stone-800 truncate group-hover:text-black leading-tight">
        {product.name}
      </h3>

      {/* Pricing: Current (Bold), Original (Strikethrough), Discount (Coral) */}
      <div className="flex items-baseline gap-1 mt-0.5 flex-wrap">
        <span className="text-xs sm:text-[13px] font-bold text-stone-900">
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] sm:text-[11px] text-stone-400 line-through">
          ₹{product.originalPrice.toLocaleString('en-IN')}
        </span>
        <span className="text-[10px] sm:text-[11px] font-bold text-[#E54F4F]">
          {product.discount}
        </span>
      </div>

      {/* Low Stock Indicator */}
      {product.stock <= 5 && (
        <span className="text-[9px] font-medium text-amber-700 mt-1 block">
          Only {product.stock} units left
        </span>
      )}

      {/* Interactive Color Swatches with Instant Image Swap */}
      {product.colors && product.colors.length > 0 && (
        <div className="flex items-center gap-1.5 mt-2">
          {product.colors.map((color, idx) => {
            const isSelected = activeColor === color.name;
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveColor(color.name);
                }}
                onMouseEnter={() => {
                  setActiveColor(color.name);
                }}
                title={`${color.name} (Click to view)`}
                className={`w-3 h-3 rounded-full border transition-all cursor-pointer p-0 relative ${
                  isSelected
                    ? 'ring-2 ring-stone-900 ring-offset-1 scale-115 border-transparent shadow-xs'
                    : 'border-stone-300 hover:scale-110 hover:border-stone-500'
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
          {product.colors.length > 1 && (
            <span className="text-[9px] text-stone-400 ml-1">
              {product.colors.length} shades
            </span>
          )}
        </div>
      )}
    </div>
  );
};
