import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Flame,
  Heart,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Share2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
    setCurrentView,
    setIsSizeGuideOpen,
    setSizeGuideCategory,
    openShareModal,
  } = useStore();

  const [activeColor, setActiveColor] = useState<string>('');
  const [activeSize, setActiveSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  useEffect(() => {
    if (quickViewProduct) {
      setActiveColor(
        quickViewProduct.colors && quickViewProduct.colors[0]
          ? quickViewProduct.colors[0].name
          : ''
      );
      setActiveSize(
        quickViewProduct.sizes && quickViewProduct.sizes[0]
          ? quickViewProduct.sizes[0]
          : ''
      );
      setQuantity(1);
      setActiveImageIndex(0);
    }
  }, [quickViewProduct?.id]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isSaved = isInWishlist(product.id);

  const matchedColorObj = product.colors?.find((c) => c.name === activeColor);
  const currentImage = matchedColorObj?.image || product.image;

  const images = Array.from(
    new Set([currentImage, ...(product.gallery || []), product.image])
  ).filter(Boolean);

  const handleAddToCart = () => {
    addToCart(product, quantity, activeColor, activeSize);
    setQuickViewProduct(null);
  };

  const handleGoToDetails = () => {
    setSelectedProduct(product);
    setQuickViewProduct(null);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSizeGuide = () => {
    setSizeGuideCategory(product.category);
    setIsSizeGuideOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-4">
        <div
          className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-stone-200/80 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Gallery */}
            <div className="bg-[#FAF8F5] p-5 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200/60">
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-white border border-stone-200/50 group select-none">
                <img
                  src={images[activeImageIndex] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {product.badge && (
                  <span
                    className={`absolute top-2.5 left-2.5 text-[9px] font-semibold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                      product.badge === 'New'
                        ? 'bg-[#E54F4F] text-white'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Slideshow Arrows (Amazon/Flipkart style) */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-108 z-10"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-108 z-10"
                      title="Next photo"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-semibold py-0.5 px-2 rounded-full shadow-sm">
                      {activeImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Mini thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-12 h-14 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-stone-900 shadow-xs'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Social Proof Live Shoppers */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] text-stone-600 bg-white/80 py-1.5 px-2.5 rounded-md border border-stone-200/50">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>
                  <strong>16 shoppers</strong> are viewing this piece right now
                </span>
              </div>
            </div>

            {/* Right: Product Details & Selectors */}
            <div className="p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-widest text-[#E07A5F] font-semibold">
                    {product.category} {product.subCategory ? `· ${product.subCategory}` : ''}
                  </span>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-[#E07A5F] text-[#E07A5F]' : 'text-stone-400'
                      }`}
                    />
                    <span className="text-[11px]">{isSaved ? 'Saved' : 'Wishlist'}</span>
                  </button>
                </div>

                <h3 className="text-lg sm:text-xl font-serif-luxury font-medium text-stone-900 mt-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-stone-700">{product.rating}</span>
                  <span className="text-stone-400 text-[11px]">({product.reviewCount} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mt-3">
                  <span className="text-xl font-bold text-stone-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-[#E54F4F] bg-rose-50 px-1.5 py-0.5 rounded-xs">
                    {product.discount}
                  </span>
                </div>

                {/* Stock Alert */}
                {product.stock <= 5 && (
                  <div className="mt-2 text-[11px] font-medium text-rose-700 bg-rose-50/70 border border-rose-200/60 px-2 py-1 rounded-sm inline-block">
                    ⚠️ Only {product.stock} units left in stock!
                  </div>
                )}

                {/* Color Selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-stone-100">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-stone-800">
                        Color: <span className="font-normal text-stone-600">{activeColor}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {product.colors.map((color, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setActiveColor(color.name);
                            setActiveImageIndex(0);
                          }}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer transition-all ${
                            activeColor === color.name
                              ? 'border-stone-900 bg-stone-50 font-medium shadow-xs'
                              : 'border-stone-200 hover:border-stone-400 bg-white'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10 inline-block shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Selector & Guide */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-stone-800">Select Size:</span>
                      <button
                        type="button"
                        onClick={handleOpenSizeGuide}
                        className="text-[11px] text-[#E07A5F] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>Size Guide</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {product.sizes.map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setActiveSize(sz)}
                          className={`min-w-8 h-8 px-2 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                            activeSize === sz
                              ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                              : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mt-3.5 flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-800">Quantity:</span>
                  <div className="flex items-center border border-stone-200 rounded-md overflow-hidden bg-white">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-semibold text-stone-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-stone-200/80 space-y-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-[#111111] hover:bg-black text-white text-xs font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const prod = quickViewProduct;
                    setQuickViewProduct(null);
                    openShareModal(prod);
                  }}
                  className="w-full bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-300 text-xs font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Share Product & Earn 100 Coins (+₹25)</span>
                </button>

                <button
                  type="button"
                  onClick={handleGoToDetails}
                  className="w-full border border-stone-300 hover:border-stone-900 text-stone-800 hover:text-black text-xs font-medium py-2 rounded-md transition-colors text-center cursor-pointer"
                >
                  View Full Product Details & Reviews →
                </button>

                <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-500 pt-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Truck className="w-3 h-3 text-stone-600" />
                    <span>Free Shipping &gt; ₹999</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-stone-600" />
                    <span>100% Certified Authentic</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
