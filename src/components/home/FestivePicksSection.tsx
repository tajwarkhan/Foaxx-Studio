import React, { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FestivePickCard } from '../../types';

export const FestivePicksSection: React.FC = () => {
  const { homepageConfig, products, setSelectedProduct, setSelectedCategory, setCurrentView, showToast } =
    useStore();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const config = homepageConfig.festivePicks;

  if (config && config.enabled === false) {
    return null;
  }

  const activeCards = (config?.cards || []).filter((c) => c.isActive !== false);
  if (activeCards.length === 0) {
    return null;
  }

  const handleCardClick = (card: FestivePickCard) => {
    // Direct product redirection if productId is specified
    if (card.productId) {
      const targetProd = products.find((p) => p.id === card.productId);
      if (targetProd) {
        setSelectedProduct(targetProd);
        setCurrentView('product');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        showToast(`Opening ${targetProd.name}`, 'info');
        return;
      }
    }

    // Fallback: category shop view
    if (card.targetCategory && card.targetCategory !== 'all') {
      setSelectedCategory(card.targetCategory);
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const getThemeGradient = (theme?: string) => {
    switch (theme) {
      case 'gold':
        return 'from-[#8C6D2D] via-[#A88438] to-[#543F14]';
      case 'emerald':
        return 'from-[#175C45] via-[#1F7A5C] to-[#0D382A]';
      case 'noir':
        return 'from-[#2B2724] via-[#38332F] to-[#121110]';
      case 'rose':
      default:
        // Vibrant magenta-rose festive glow matching user reference
        return 'from-[#8A1F4D] via-[#B8326D] to-[#5E1233]';
    }
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-12 border-b border-[#EAE3D9]/80 overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Festive Header with Sparkling Gold Stars */}
        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center space-x-2 text-rose-600 mb-1">
            <Sparkles className="w-4 h-4 fill-current text-rose-500 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-rose-600 font-sans">
              Curated Celebration Drop
            </span>
            <Sparkles className="w-4 h-4 fill-current text-rose-500 animate-pulse" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-editorial font-bold text-stone-900 tracking-tight flex items-center justify-center gap-3">
            <span className="text-amber-500 hidden sm:inline">✦</span>
            <span>{config?.sectionTitle || 'DAZZLING FESTIVE PICKS'}</span>
            <span className="text-amber-500 hidden sm:inline">✦</span>
          </h2>

          <p className="text-stone-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto font-sans">
            {config?.sectionSubtitle || 'Celebrity curated glamour & heirloom bridal editions for the grand festivities'}
          </p>

          {/* Carousel Arrows on Top-Right */}
          <div className="hidden sm:flex items-center space-x-2 absolute right-0 bottom-0">
            <button
              onClick={() => scroll('left')}
              className="w-8 h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-8 h-8 rounded-full border border-stone-300 bg-white hover:bg-stone-100 flex items-center justify-center text-stone-700 transition shadow-xs cursor-pointer active:scale-95"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Cards Row */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-5 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {activeCards.map((card) => {
            const gradient = getThemeGradient(card.themeStyle);

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card)}
                className="group relative flex-none w-[310px] sm:w-[370px] lg:w-[410px] h-[340px] sm:h-[370px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer snap-start transform hover:-translate-y-1.5 border border-stone-200/80 bg-stone-900"
              >
                {/* Background Image with Hover Scale */}
                <img
                  src={card.image}
                  alt={card.headline}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-[0.9]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/extracted/banner_festive_clean.png';
                  }}
                />

                {/* Rich Festive Gradient Overlay (Matches Reference Image) */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-75 mix-blend-multiply group-hover:opacity-70 transition duration-500`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                {/* Top-Left Brand Capsule Pill */}
                <div className="absolute top-4 left-4 z-10">
                  <div className="bg-white/90 backdrop-blur-md text-stone-900 px-3.5 py-1.5 rounded-br-2xl rounded-tl-lg shadow-md border border-white/40">
                    <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] font-sans">
                      {card.badge}
                    </span>
                  </div>
                </div>

                {/* Central Overlay Headline */}
                <div className="absolute top-1/2 -translate-y-1/2 left-5 right-5 z-10 pointer-events-none">
                  <div className="inline-block bg-black/40 backdrop-blur-xs px-3 py-1 rounded text-[10px] uppercase tracking-[0.25em] text-amber-300 font-bold mb-1">
                    FESTIVE EXCLUSIVE
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-md font-sans">
                    {card.headline}
                  </h3>
                </div>

                {/* Bottom Bar: Offer Text + "Shop Now →" Button */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 z-10 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex items-center justify-between gap-3 border-t border-white/15 backdrop-blur-xs">
                  <div>
                    <div className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                      {card.offerText}
                    </div>
                    <div className="text-xs text-white/80 font-normal line-clamp-1">
                      {card.subtitle}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="flex-none bg-white hover:bg-stone-100 text-stone-950 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider shadow-md transition-all flex items-center space-x-1.5 group-hover:bg-[#FA4D66] group-hover:text-white"
                  >
                    <span>{card.buttonText || 'Shop Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Scroll Indicator Note */}
        <div className="sm:hidden flex items-center justify-center space-x-1.5 text-stone-400 text-[11px] mt-2">
          <span>Swipe horizontally to discover more festive picks</span>
          <ArrowRight className="w-3 h-3" />
        </div>

      </div>
    </section>
  );
};
