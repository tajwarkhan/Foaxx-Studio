import React, { useState } from 'react';
import { ArrowRight, Check, CheckCircle2, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopTheLook: React.FC = () => {
  const { homepageConfig, products, addToCart, setIsCartOpen, setSelectedProduct, setCurrentView, showToast } = useStore();

  const lookConfig = homepageConfig.shopTheLook;
  if (lookConfig && lookConfig.enabled === false) {
    return null;
  }

  const editorialImg = lookConfig?.editorialImage || '/assets/extracted/banner_festive_clean.png';
  const editorialBadge = lookConfig?.editorialBadge || 'Curated Ensemble';
  const editorialHeadline = lookConfig?.editorialHeadline || 'The Royal Festive Muse';
  const editorialSubtitle = lookConfig?.editorialSubtitle || 'An opulent harmony of antique Jadau uncut Polki, lustrous baroque drops, and barely-there architectural stiletto heels.';
  const sectionBadge = lookConfig?.sectionBadge || 'Shop The Full Look';
  const sectionTitle = lookConfig?.sectionTitle || 'Complete the Ensemble';
  const sectionSubtitle = lookConfig?.sectionSubtitle || 'Hand-picked by our chief jewelry stylist to eliminate the guesswork of wedding styling.';
  const bundleTitle = lookConfig?.bundleTitle || 'Curated Ensemble Bundle (3 Pieces)';
  const bundleDiscountPercent = lookConfig?.bundleDiscountPercent ?? 15;
  const bundlePerkText = lookConfig?.bundlePerkText || `Special ${bundleDiscountPercent}% Lookbook Discount Applied`;

  // Complementary pieces from config productIds or fallback
  const pieceIds = lookConfig?.productIds?.length ? lookConfig.productIds : ['prod-9', 'prod-2', 'prod-8'];
  const lookItems = pieceIds
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Fallback to default products if catalog IDs not found
  const finalLookItems = lookItems.length >= 2 ? lookItems : [products[1] || products[0], products[2] || products[0], products[7] || products[0]];

  const originalBundleTotal = finalLookItems.reduce((acc, it) => acc + it.price, 0);
  const discountedBundleTotal = Math.round(originalBundleTotal * (1 - bundleDiscountPercent / 100));
  const savings = originalBundleTotal - discountedBundleTotal;

  const [addedAll, setAddedAll] = useState(false);

  const handleAddBundleToBag = () => {
    finalLookItems.forEach((item) => addToCart(item, 1));
    setAddedAll(true);
    showToast(`Added entire 3-piece look to bag! Saved ₹${savings.toLocaleString('en-IN')}`);
    setTimeout(() => {
      setIsCartOpen(true);
      setAddedAll(false);
    }, 600);
  };

  const handleViewItem = (item: (typeof finalLookItems)[0]) => {
    setSelectedProduct(item);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#FAF7F2] py-14 sm:py-20 border-b border-stone-200">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Styled Editorial Imagery */}
          <div className="lg:col-span-6 relative aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-stone-300/60 group">
            <img
              src={editorialImg}
              alt={editorialHeadline}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
            />
            {/* Dark gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E07A5F] font-serif-luxury">
                {editorialBadge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif-luxury font-medium leading-tight mt-1">
                {editorialHeadline}
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 font-light mt-1 max-w-md">
                {editorialSubtitle}
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Pieces & Bundle Module */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-[0.25em] block mb-1 font-serif-luxury">
                {sectionBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-medium text-stone-900 leading-tight">
                {sectionTitle}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-2">
                {sectionSubtitle}
              </p>

              {/* Items in the look */}
              <div className="mt-6 space-y-3.5">
                {finalLookItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleViewItem(item)}
                    className="p-3 bg-white rounded-lg border border-stone-200 hover:border-stone-900 transition-colors flex items-center justify-between gap-3 cursor-pointer group/item shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-md bg-stone-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-semibold text-stone-900 truncate group-hover/item:text-[#E07A5F] transition-colors">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold text-stone-900 block mt-0.5">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item);
                      }}
                      className="text-xs font-semibold text-stone-800 hover:text-black border border-stone-200 hover:border-stone-400 px-3 py-1.5 rounded-md shrink-0 bg-stone-50 transition-colors"
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bundle & Save Box */}
            <div className="mt-8 p-5 bg-white rounded-xl border-2 border-stone-900 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {bundleTitle}
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                    {bundlePerkText}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm line-through text-stone-400 block">
                    ₹{originalBundleTotal.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xl font-bold text-stone-900">
                    ₹{discountedBundleTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-xs text-stone-500">
                  You save <strong>₹{savings.toLocaleString('en-IN')}</strong> when purchased together
                </span>
                <button
                  onClick={handleAddBundleToBag}
                  className="bg-[#111111] hover:bg-black text-white text-xs font-semibold px-6 py-3 rounded-md transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider shadow-sm"
                >
                  {addedAll ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add Complete Look</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
