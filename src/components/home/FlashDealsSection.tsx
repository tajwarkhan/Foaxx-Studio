import React, { useEffect, useState } from 'react';
import { Clock, Copy, Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FlashDealOffer } from '../../types';

export const FlashDealsSection: React.FC = () => {
  const { homepageConfig, setSelectedCategory, setCurrentView, showToast, applyCoupon } = useStore();
  const dealsConfig = homepageConfig.flashDeals;

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 2,
    minutes: 10,
    seconds: 49,
  });

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (!dealsConfig?.targetEndTime) {
      // Default 2h 10m 49s loop countdown if no fixed date provided
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          }
          if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          }
          if (prev.hours > 0) {
            return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
          }
          return { hours: 2, minutes: 30, seconds: 0 }; // reset cycle
        });
      }, 1000);
      return () => clearInterval(interval);
    }

    const calculateTimeRemaining = () => {
      const target = new Date(dealsConfig.targetEndTime).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeRemaining());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [dealsConfig?.targetEndTime]);

  // If deals section disabled in admin
  if (dealsConfig && dealsConfig.enabled === false) {
    return null;
  }

  const activeOffers = (dealsConfig?.offers || []).filter((o) => o.isActive !== false);
  if (activeOffers.length === 0) {
    return null;
  }

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Promo code ${code} copied & applied to your bag!`, 'success');
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const handleDealClick = (deal: FlashDealOffer) => {
    if (deal.targetCategory && deal.targetCategory !== 'all') {
      setSelectedCategory(deal.targetCategory);
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Gradient helper matching user's reference with luxury harmonization
  const getTicketThemeClasses = (theme?: string) => {
    switch (theme) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-r from-[#D49E35] via-[#B88120] to-[#8C5D12]',
          notchBg: 'bg-[#FAF8F5]',
          textColor: 'text-amber-100',
          accent: 'text-amber-200',
        };
      case 'emerald':
        return {
          bg: 'bg-gradient-to-r from-[#17664B] via-[#0F4734] to-[#0A3023]',
          notchBg: 'bg-[#FAF8F5]',
          textColor: 'text-emerald-100',
          accent: 'text-emerald-300',
        };
      case 'burgundy':
        return {
          bg: 'bg-gradient-to-r from-[#932438] via-[#6D1525] to-[#4A0A17]',
          notchBg: 'bg-[#FAF8F5]',
          textColor: 'text-rose-100',
          accent: 'text-rose-200',
        };
      case 'noir':
        return {
          bg: 'bg-gradient-to-r from-[#24211E] via-[#171513] to-[#0A0A09]',
          notchBg: 'bg-[#FAF8F5]',
          textColor: 'text-stone-200',
          accent: 'text-[#D4AF37]',
        };
      case 'sunset':
      default:
        // Exact vibrant coral-sunset gradient with golden sparkle from user reference
        return {
          bg: 'bg-gradient-to-r from-[#FF6B4A] via-[#FA4D66] to-[#E93B81]',
          notchBg: 'bg-[#FAF8F5]',
          textColor: 'text-rose-100',
          accent: 'text-yellow-200',
        };
    }
  };

  const formatUnit = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="w-full bg-[#FAF8F5] py-8 border-y border-[#EAE3D9]/80 overflow-hidden">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header with Realtime Countdown */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 pb-2 border-b border-stone-200/60">
          <div className="flex items-center space-x-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FA4D66]/10 text-[#FA4D66]">
              <Zap className="w-4 h-4 fill-current animate-pulse" />
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-editorial text-xl sm:text-2xl font-bold tracking-tight text-stone-900 uppercase">
                  {dealsConfig?.sectionTitle || 'LIMITED TIME DEALS'}
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                  {dealsConfig?.badgeText || 'LIVE NOW'}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-sans mt-0.5">
                Exclusive instant vouchers with limited redemption window
              </p>
            </div>
          </div>

          {/* Ticking Countdown Badge */}
          <div className="flex items-center space-x-2.5 bg-stone-900 text-white px-4 py-2 rounded-full shadow-md font-mono text-xs sm:text-sm tracking-wider">
            <Clock className="w-4 h-4 text-[#FA4D66] animate-spin-slow" />
            <span className="text-stone-300 font-sans uppercase font-medium text-[11px] tracking-widest">ENDS IN</span>
            <span className="font-bold text-white tracking-widest bg-stone-800 px-2 py-0.5 rounded">
              {formatUnit(timeLeft.hours)}h {formatUnit(timeLeft.minutes)}m {formatUnit(timeLeft.seconds)}s
            </span>
          </div>
        </div>

        {/* Perforated Ticket Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {activeOffers.map((deal) => {
            const theme = getTicketThemeClasses(deal.themeStyle);
            const isCopied = copiedCode === deal.promoCode;

            return (
              <div
                key={deal.id}
                onClick={() => handleDealClick(deal)}
                className={`group relative ${theme.bg} text-white rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden transform hover:-translate-y-1`}
              >
                {/* Subtle Luxury Sparkle Background Layer */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                  style={{
                    backgroundImage: `radial-gradient(circle at 10% 20%, white 1.5px, transparent 1.5px),
                                      radial-gradient(circle at 45% 75%, white 1.2px, transparent 1.2px),
                                      radial-gradient(circle at 80% 30%, white 1.5px, transparent 1.5px),
                                      radial-gradient(circle at 90% 85%, white 1.2px, transparent 1.2px)`,
                    backgroundSize: '100px 100px',
                  }}
                />

                {/* Perforation Semi-Circle Notches (Top and Bottom) */}
                <div
                  className={`absolute -top-3.5 right-[32%] sm:right-[30%] w-7 h-7 rounded-full ${theme.notchBg} border border-black/10 shadow-inner z-20 pointer-events-none`}
                />
                <div
                  className={`absolute -bottom-3.5 right-[32%] sm:right-[30%] w-7 h-7 rounded-full ${theme.notchBg} border border-black/10 shadow-inner z-20 pointer-events-none`}
                />

                {/* Vertical Dotted Perforation Line */}
                <div className="absolute top-3.5 bottom-3.5 right-[32%] sm:right-[30%] border-r-2 border-dotted border-white/40 z-10 pointer-events-none" />

                <div className="flex items-stretch min-h-[140px] sm:min-h-[160px] relative z-10">
                  {/* LEFT VOUCHER CONTENT */}
                  <div className="flex-1 p-4 sm:p-6 pr-5 sm:pr-8 flex flex-col justify-between">
                    <div>
                      {/* Sparkle & Prefix Header */}
                      <div className="flex items-center space-x-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-200 fill-current" />
                        <span className="text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-white/95">
                          {deal.prefix || 'UP TO'}
                        </span>
                        {deal.badgeText && (
                          <span className="ml-1 text-[9px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur px-2 py-0.5 rounded-full text-white">
                            {deal.badgeText}
                          </span>
                        )}
                      </div>

                      {/* Giant Prominent Discount Value */}
                      <div className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight text-white leading-none drop-shadow-sm font-sans">
                        {deal.discountText}
                      </div>

                      {/* Title & Subtitle */}
                      <div className="mt-2 text-sm sm:text-base font-semibold text-white/95 tracking-wide line-clamp-1">
                        {deal.title}
                      </div>
                      {deal.subtitle && (
                        <div className="text-[11px] sm:text-xs text-white/80 font-normal line-clamp-1">
                          {deal.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Promocode Copy Pill Bar */}
                    <div className="mt-3.5 flex items-center space-x-2 pt-1">
                      <div className="inline-flex items-center bg-black/30 backdrop-blur-md border border-white/30 rounded-lg px-2.5 py-1 text-xs">
                        <span className="text-white/70 text-[10px] tracking-wider uppercase mr-1.5 font-sans">Code:</span>
                        <span className="font-mono font-bold tracking-widest text-white text-xs sm:text-sm mr-2">
                          {deal.promoCode}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyCode(deal.promoCode, e)}
                          title="Copy promo code"
                          className="flex items-center space-x-1 bg-white text-stone-900 hover:bg-yellow-100 font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase shadow-sm transition active:scale-95"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <span className="hidden sm:inline-flex items-center text-[11px] text-white/80 group-hover:text-white font-medium transition">
                        Shop &rarr;
                      </span>
                    </div>
                  </div>

                  {/* RIGHT TICKET STUB: Product / Brand Showcase */}
                  <div className="w-[32%] sm:w-[30%] p-3 sm:p-4 flex flex-col items-center justify-center relative pl-4 sm:pl-6">
                    <div className="w-full aspect-square max-w-[100px] sm:max-w-[120px] rounded-xl overflow-hidden bg-white/20 backdrop-blur-md p-1.5 border border-white/30 shadow-inner group-hover:scale-105 transition duration-500">
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-contain drop-shadow-md rounded-lg"
                        onError={(e) => {
                          // Fallback to jewelry image if missing
                          (e.target as HTMLImageElement).src = '/assets/extracted/cat_jewellery.png';
                        }}
                      />
                    </div>
                    <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-white/80 font-bold text-center line-clamp-1">
                      FOAXX VAULT
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Micro Banner */}
        <div className="mt-4 flex items-center justify-between text-xs text-stone-500 px-2 font-sans">
          <span>*Discounts automatically redeemable at checkout with promo codes above. Limited availability.</span>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-1 font-semibold text-stone-800 hover:text-[#FA4D66] transition"
          >
            <span>Explore All Offers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
