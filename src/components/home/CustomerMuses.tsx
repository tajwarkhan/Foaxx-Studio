import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, Star } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerReview } from '../../types';

export const CustomerMuses: React.FC = () => {
  const { products, reviews, setSelectedProduct, setCurrentView } = useStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [, setCurrentIndex] = useState<number>(0);

  // Only display approved reviews on homepage (status === 'approved' or legacy preset without status)
  const muses: CustomerReview[] = (reviews && reviews.length > 0 ? reviews : []).filter(
    (r) => r.status === undefined || r.status === 'approved'
  );

  // Auto-slide effect: every 3.2 seconds if not hovered
  useEffect(() => {
    if (isHovered || muses.length === 0) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const container = scrollRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        const cardWidth = 340; // width + gap

        if (container.scrollLeft >= maxScroll - 20) {
          // Loop back to start smoothly
          container.scrollTo({ left: 0, behavior: 'smooth' });
          setCurrentIndex(0);
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
          setCurrentIndex((prev) => (prev + 1) % muses.length);
        }
      }
    }, 3200);

    return () => clearInterval(interval);
  }, [isHovered, muses.length]);

  const handleScrollManual = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = 340;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleProductClick = (productId: string) => {
    const p = products.find((prod) => prod.id === productId);
    if (p) {
      setSelectedProduct(p);
      setCurrentView('product');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-[#FAF8F5] py-14 sm:py-20 border-b border-[#EAE3D9] overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-[#8C6538] mb-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] font-sans">
                Verified Client Love &amp; Reviews
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-stone-900 tracking-tight">
              Seen on Our Muses
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal font-sans">
              Over 25,000+ modern women elevating their celebrations and everyday style with FOAXX.
            </p>
          </div>

          {/* Rating Summary & Auto-Slide Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Stars pill */}
            <div className="flex items-center space-x-2 bg-white px-3.5 py-1.5 rounded-full border border-stone-200/80 shadow-xs text-xs font-semibold text-stone-800">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span>4.9 / 5.0</span>
              <span className="text-stone-400 font-normal">({muses.length} Reviews)</span>
            </div>

            {/* Manual Arrows */}
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => handleScrollManual('left')}
                className="w-8 h-8 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition shadow-xs cursor-pointer active:scale-95"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollManual('right')}
                className="w-8 h-8 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 flex items-center justify-center text-stone-700 transition shadow-xs cursor-pointer active:scale-95"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Auto-Slide Carousel Row */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
          className="flex space-x-5 overflow-x-auto py-2 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {muses.map((muse, idx) => (
            <div
              key={muse.id}
              className="flex-none w-[290px] sm:w-[325px] bg-white rounded-2xl p-5 border border-[#EAE3D9] hover:border-[#8C6538]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group snap-start cursor-pointer transform hover:-translate-y-1"
              onClick={() => handleProductClick(muse.productId)}
            >
              <div>
                {/* Product Thumbnail & Muse Header */}
                <div className="flex items-center space-x-3 pb-3 border-b border-stone-100">
                  <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-200/80 shrink-0 relative">
                    <img
                      src={muse.image}
                      alt={muse.productName}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/extracted/prod_pearl_earrings.png';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1">
                      <h4 className="text-xs font-bold text-stone-900 truncate">{muse.name}</h4>
                      <span title="Verified Customer" className="shrink-0 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 block truncate">{muse.location}</span>
                    <span className="text-[10px] text-emerald-700 font-semibold">{muse.date}</span>
                  </div>
                </div>

                {/* Rating Stars with Review Count Badge */}
                <div className="flex items-center justify-between my-3">
                  <div className="flex text-amber-400">
                    {[...Array(muse.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold">
                    Review #{idx + 1}
                  </span>
                </div>

                {/* Customer Quote */}
                <p className="text-xs text-stone-700 italic leading-relaxed font-normal font-sans line-clamp-4">
                  &ldquo;{muse.quote}&rdquo;
                </p>
              </div>

              {/* Styled Product Link Footer */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-900 group-hover:text-[#8C6538] transition">
                <span className="truncate text-[11px]">Wearing {muse.productName}</span>
                <span className="shrink-0 text-stone-400 group-hover:text-[#8C6538] group-hover:translate-x-1 transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Bottom Info Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-sans gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px]">
              Continuous auto-scroll active · Hover over any review to pause and read
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-[11px] text-stone-600">
            <span>Showing all <strong>{muses.length} verified reviews</strong></span>
            <span>·</span>
            <span className="text-[#8C6538] font-bold">100% Genuine Buyers</span>
          </div>
        </div>

      </div>
    </section>
  );
};
