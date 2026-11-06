import React, { useState } from 'react';
import { ArrowRight, Check, Eye, Heart, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OccasionCardConfig, Product } from '../../types';
import { INITIAL_SHOP_BY_OCCASION } from '../../data/initialData';

export const ShopByOccasion: React.FC = () => {
  const {
    homepageConfig,
    products,
    setSelectedProduct,
    setQuickViewProduct,
    setCurrentView,
    setSelectedCategory,
    addToCart,
    toggleWishlist,
    isInWishlist,
    showToast,
  } = useStore();

  const occasionConfig = homepageConfig.shopByOccasion || INITIAL_SHOP_BY_OCCASION;
  if (occasionConfig.enabled === false) {
    return null;
  }

  const occasionsList = (occasionConfig.occasions || []).filter((o) => o.isActive !== false);
  const occasions: OccasionCardConfig[] = occasionsList.length > 0 ? occasionsList : INITIAL_SHOP_BY_OCCASION.occasions;

  const [activeOccasion, setActiveOccasion] = useState<string>(() => occasions[0]?.id || 'wedding');
  const [addingBundle, setAddingBundle] = useState(false);

  // Fallback to first occasion if activeOccasion doesn't exist in current list
  const currentOccasion = occasions.find((o) => o.id === activeOccasion) || occasions[0];

  // Resolve bundle items from product catalog using bundleProductIds
  const bundleItems = (currentOccasion.bundleProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));

  // Curated showcase items: display bundle items first, then fallback to catalog products
  const curatedItems: Product[] =
    bundleItems.length >= 3
      ? bundleItems.slice(0, 3)
      : [
          ...bundleItems,
          ...products.filter((p) => !bundleItems.some((b) => b.id === p.id)),
        ].slice(0, 3);

  const bundleDiscountPercent = occasionConfig.bundleDiscountPercent ?? 15;
  const bundleOriginalTotal = bundleItems.reduce((acc, p) => acc + p.originalPrice, 0);
  const bundlePrice = Math.round(
    bundleItems.reduce((acc, p) => acc + p.price, 0) * (1 - bundleDiscountPercent / 100)
  );

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddBundleToBag = () => {
    if (bundleItems.length === 0) return;
    setAddingBundle(true);
    bundleItems.forEach((p) => {
      addToCart(p, 1, p.colors?.[0]?.name, p.sizes?.[0]);
    });
    showToast(
      `Complete ${currentOccasion.label} capsule (${bundleItems.length} items) added to bag with ${bundleDiscountPercent}% bundle perk!`,
      'success'
    );
    setTimeout(() => {
      setAddingBundle(false);
    }, 1200);
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-14 sm:py-20 border-b border-[#EAE3D9]/90 overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 text-stone-600 mb-2">
            <span className="w-8 h-px bg-stone-300" />
            <span className="text-[11px] font-bold text-[#8C6538] uppercase tracking-[0.3em] font-sans">
              {occasionConfig.sectionEyebrow || "Curated For Life's Grand Moments"}
            </span>
            <span className="w-8 h-px bg-stone-300" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-stone-900 tracking-tight">
            {occasionConfig.sectionTitle || 'Shop by Occasion'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-500 mt-2 font-normal font-sans max-w-xl mx-auto leading-relaxed">
            {currentOccasion.tagline}
          </p>

          {/* Occasion Segmented Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-8 flex-wrap">
            {occasions.map((occ) => {
              const isSelected = activeOccasion === occ.id;
              return (
                <button
                  key={occ.id}
                  onClick={() => setActiveOccasion(occ.id)}
                  className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 flex items-center space-x-2 cursor-pointer shadow-xs active:scale-95 ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-md ring-2 ring-stone-900 ring-offset-2 ring-offset-[#FAF8F5]'
                      : 'bg-white text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200/80'
                  }`}
                >
                  <span className="text-sm">{occ.icon}</span>
                  <span>{occ.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* OCCASION EDITORIAL DISPLAY: 1 Hero Spotlight + 3 Curated Products */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* COLUMN 1: Large Editorial Spotlight & Bundle Card (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-7 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            {/* Background Texture Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/60 rounded-full blur-3xl pointer-events-none" />

            {/* Top Spotlight Media Card */}
            <div>
              <div className="relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 shadow-md mb-5">
                <img
                  src={currentOccasion.heroImage}
                  alt={currentOccasion.heroTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.9]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Badge on Image */}
                <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-stone-900 uppercase tracking-widest shadow-sm">
                  {currentOccasion.heroBadge}
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold block mb-1">
                    Occasion Spotlight
                  </span>
                  <h3 className="text-xl sm:text-2xl font-editorial font-bold text-white tracking-wide">
                    {currentOccasion.heroTitle}
                  </h3>
                </div>
              </div>

              {/* Stylist Quote Box */}
              <div className="bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/70 mb-5 relative">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6538] font-bold block mb-1">
                  Atelier Stylist Advice
                </span>
                <p className="text-xs text-stone-700 italic leading-relaxed font-editorial font-normal">
                  {currentOccasion.stylistNote}
                </p>
              </div>
            </div>

            {/* Complete Occasion Bundle Box */}
            <div className="bg-stone-900 text-white p-5 rounded-2xl border border-stone-800 space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-amber-300 block">
                    Curated Ensemble Bundle
                  </span>
                  <h4 className="text-sm font-bold text-white mt-0.5">
                    Complete {currentOccasion.label} Look
                  </h4>
                </div>
                <span className="bg-amber-400 text-stone-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow">
                  Save {bundleDiscountPercent}% Extra
                </span>
              </div>

              {/* Thumbnails of Bundle Items */}
              <div className="flex items-center space-x-2">
                {bundleItems.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <div
                      onClick={() => handleProductClick(item)}
                      title={item.name}
                      className="w-12 h-14 rounded-lg bg-stone-800 overflow-hidden border border-stone-700 relative cursor-pointer hover:border-amber-300 transition"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    {idx < bundleItems.length - 1 && <span className="text-stone-500 text-xs font-bold">+</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Pricing & Add Button */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-800">
                <div>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-bold text-amber-300">₹{bundlePrice.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-stone-400 line-through">₹{bundleOriginalTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">Includes {bundleItems.length} Handcrafted Pieces</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddBundleToBag}
                  disabled={addingBundle}
                  className="bg-white hover:bg-amber-100 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow active:scale-95 flex items-center space-x-1.5 cursor-pointer"
                >
                  {addingBundle ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Bundle</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* COLUMN 2: 3 Curated Product Cards for this Occasion (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {curatedItems.map((product) => {
                const isSaved = isInWishlist(product.id);

                return (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl p-3.5 border border-[#EAE3D9] hover:border-[#8C6538]/60 transition-all duration-300 shadow-xs hover:shadow-xl flex flex-col justify-between relative cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Media Area (3:4 Tall Portrait) */}
                    <div>
                      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF8F5] mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                          loading="lazy"
                        />

                        {/* Top Badge */}
                        {product.badge && (
                          <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm bg-stone-900 text-white">
                            {product.badge}
                          </span>
                        )}

                        {/* Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition shadow-xs cursor-pointer active:scale-90"
                          aria-label="Wishlist"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              isSaved ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
                            }`}
                          />
                        </button>

                        {/* Quick View Hover Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(product);
                          }}
                          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 shadow-md cursor-pointer"
                          title="Quick View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Color Variant Swatches */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex items-center space-x-1.5 mb-2">
                          {product.colors.slice(0, 4).map((c, i) => (
                            <span
                              key={i}
                              title={c.name}
                              className="w-3 h-3 rounded-full border border-stone-300"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                          {product.colors.length > 4 && (
                            <span className="text-[9px] text-stone-400">+{product.colors.length - 4}</span>
                          )}
                        </div>
                      )}

                      {/* Product Metadata */}
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C6538] font-semibold block">
                        {product.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 mt-1 line-clamp-1 group-hover:text-[#8C6538] transition">
                        {product.name}
                      </h4>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-stone-800">{product.rating}</span>
                        <span className="text-[10px] text-stone-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    {/* Price & Add to Bag Footer */}
                    <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-xs sm:text-sm font-bold text-stone-900">
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold text-rose-600 block">
                          {product.discount}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product, 1, product.colors?.[0]?.name, product.sizes?.[0]);
                          showToast(`${product.name} added to your bag!`, 'success');
                        }}
                        className="p-2 rounded-lg bg-stone-100 hover:bg-stone-900 text-stone-800 hover:text-white transition shadow-xs cursor-pointer active:scale-95"
                        title="Add to Bag"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Full Collection Banner */}
            <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-[#1C1815] via-[#2A2420] to-[#141210] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center flex-none">
                  <Sparkles className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h5 className="font-editorial text-base sm:text-lg font-bold">
                    Need Personalized Styling For Your {currentOccasion.label}?
                  </h5>
                  <p className="text-xs text-stone-300 font-sans mt-0.5">
                    Our atelier concierge curates custom matching sets for weddings, vacations, and cocktail galas.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setCurrentView('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-none bg-[#C5A880] hover:bg-[#b0936b] text-stone-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center space-x-2 cursor-pointer"
              >
                <span>View Full {currentOccasion.label} Edit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
