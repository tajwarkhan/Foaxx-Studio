import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Copy, Check, ArrowRight, Tag, ShieldCheck, Flame, Gift, Percent } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { OccasionSaleBannerConfig } from '../../types';

export const OccasionSaleBanner: React.FC = () => {
  const { homepageConfig, setSelectedCategory, setCurrentView, showToast, applyCoupon } = useStore();
  const banner: OccasionSaleBannerConfig | undefined = homepageConfig.occasionSaleBanner;

  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 3,
    hours: 8,
    minutes: 42,
    seconds: 38,
  });

  // Calculate live countdown timer
  useEffect(() => {
    const targetEnd = banner?.countdownEndTime || (banner as any)?.targetEndTime;
    if (!targetEnd) {
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
          if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
          if (prev.days > 0) return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
          return { days: 3, hours: 23, minutes: 59, seconds: 59 };
        });
      }, 1000);
      return () => clearInterval(interval);
    }

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(targetEnd).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [banner?.countdownEndTime, (banner as any)?.targetEndTime]);

  if (!banner || !banner.enabled) {
    return null;
  }

  const discountVal = banner.promoDiscountPercent || (banner as any)?.discountPercentage || 40;
  const ctaLabel = banner.ctaText || (banner as any)?.ctaButtonText || 'Explore Diwali Sale';

  // Handle promo code copy & automatic cart application
  const handleCopyAndApply = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(banner.promoCode);
    setCopied(true);
    applyCoupon(banner.promoCode);
    showToast(`Code "${banner.promoCode}" copied & applied! ${discountVal}% discount ready in cart.`, 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle CTA navigation
  const handleCtaClick = () => {
    if (banner.targetCategory && banner.targetCategory !== 'All Products' && banner.targetCategory !== 'All') {
      setSelectedCategory(banner.targetCategory);
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine theme gradient and styling classes
  const getThemeStyles = () => {
    const styleKey = (banner.themeStyle || (banner as any).themeColor || 'crimson_gold') as string;
    switch (styleKey) {
      case 'emerald_gold':
      case 'eid-emerald-gold':
        return {
          wrapperBg: 'from-[#031e11] via-[#06301b] to-[#01140a]',
          borderGlow: 'border-emerald-500/50 shadow-emerald-950/50',
          badgeBg: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
          goldAccent: 'text-[#d4af37]',
          buttonBg: 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-zinc-950 hover:brightness-110',
          chipBg: 'bg-emerald-900/70 border-emerald-500/50 text-emerald-200',
          timerBoxBg: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300',
        };
      case 'rose_noir':
      case 'valentine-rose-gold':
        return {
          wrapperBg: 'from-[#23040c] via-[#330714] to-[#150206]',
          borderGlow: 'border-rose-500/50 shadow-rose-950/50',
          badgeBg: 'bg-rose-950/90 text-rose-300 border-rose-500/50',
          goldAccent: 'text-[#f5a3b7]',
          buttonBg: 'bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 text-white hover:brightness-110',
          chipBg: 'bg-rose-900/70 border-rose-500/50 text-rose-200',
          timerBoxBg: 'bg-rose-950/90 border-rose-500/50 text-rose-300',
        };
      case 'champagne_bridal':
      case 'sunset-amber':
        return {
          wrapperBg: 'from-[#211609] via-[#33220e] to-[#120a03]',
          borderGlow: 'border-amber-400/50 shadow-amber-950/50',
          badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-400/50',
          goldAccent: 'text-[#fbbf24]',
          buttonBg: 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 text-zinc-950 hover:brightness-110',
          chipBg: 'bg-amber-900/70 border-amber-400/50 text-amber-200',
          timerBoxBg: 'bg-amber-950/90 border-amber-400/50 text-amber-300',
        };
      case 'midnight_purple':
      case 'royal-navy-gold':
        return {
          wrapperBg: 'from-[#110620] via-[#1a0a33] to-[#080211]',
          borderGlow: 'border-purple-500/50 shadow-purple-950/50',
          badgeBg: 'bg-purple-950/90 text-purple-200 border-purple-500/50',
          goldAccent: 'text-[#e9d5ff]',
          buttonBg: 'bg-gradient-to-r from-purple-400 via-fuchsia-200 to-purple-500 text-zinc-950 hover:brightness-110',
          chipBg: 'bg-purple-900/70 border-purple-500/50 text-purple-200',
          timerBoxBg: 'bg-purple-950/90 border-purple-500/50 text-purple-300',
        };
      case 'crimson_gold':
      case 'diwali-red-gold':
      default:
        return {
          wrapperBg: 'from-[#2a0202] via-[#480505] to-[#1a0101]',
          borderGlow: 'border-amber-500/50 hover:border-amber-400/70 shadow-red-950/60',
          badgeBg: 'bg-red-950/90 text-amber-300 border-amber-500/50',
          goldAccent: 'text-[#f3c053]',
          buttonBg: 'bg-gradient-to-r from-[#f59e0b] via-[#fde68a] to-[#d97706] text-zinc-950 hover:brightness-110',
          chipBg: 'bg-red-950/80 border-amber-500/50 text-amber-200',
          timerBoxBg: 'bg-black/90 border-amber-500/50 text-amber-300',
        };
    }
  };

  const theme = getThemeStyles();

  return (
    <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 my-4 sm:my-8 transition-all duration-300">
      {/* Decorative Aura Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-red-500/15 to-amber-500/20 rounded-3xl blur-xl opacity-80 pointer-events-none -z-10" />

      {/* Main Luxury Container */}
      <div className={`relative overflow-hidden rounded-3xl border ${theme.borderGlow} bg-gradient-to-r ${theme.wrapperBg} shadow-2xl transition-all duration-200`}>
        {/* Subtle festive background stardust pattern */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* 1. FESTIVAL HERO BANNER GRAPHIC (Spacious, generous proportion so artwork breathes) */}
        {banner.bannerImage ? (
          <div
            onClick={handleCtaClick}
            className="relative w-full cursor-pointer overflow-hidden border-b border-amber-500/30 group/banner bg-black/40"
          >
            {/* Generous comfortable height: h-32 on small mobile, h-44 on tablet, h-56 to h-68 on desktop */}
            <div className="relative w-full h-32 sm:h-44 md:h-56 lg:h-68 max-h-[300px] overflow-hidden">
              <img
                src={banner.bannerImage}
                alt={banner.occasionName || 'Festive Sale Live'}
                className="w-full h-full object-cover object-center group-hover/banner:scale-[1.015] transition-transform duration-700 ease-out"
                loading="eager"
              />
              {/* Subtle luxury edge shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

              {/* Floating Quick Action CTA Badge on artwork */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-6 flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/50 shadow-md">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                  Live Festival Special
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCtaClick();
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-black tracking-wide shadow-xl bg-white text-zinc-950 hover:bg-amber-300 transition-all duration-200 transform group-hover/banner:translate-x-1"
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {/* 2. OPULENT LUXURY VALUE & COUNTDOWN COMMAND CENTER */}
        <div className="p-3 sm:p-4 md:p-5 relative z-10">
          
          {/* DESKTOP LAYOUT (Clean, balanced 3-column architecture) */}
          <div className="hidden lg:grid lg:grid-cols-12 items-center gap-4">
            
            {/* Col 1: Occasion Tag & Hanging Bank Plaque (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-inner ${theme.badgeBg}`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {banner.occasionName}
                </span>
                <span className="text-xs text-amber-300/90 font-medium">
                  {banner.headline}
                </span>
              </div>

              {/* Bank Offer Pill */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs shadow-md ${theme.chipBg}`}>
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
                <div className="min-w-0">
                  <span className="font-extrabold text-amber-200 uppercase tracking-wide block truncate text-[11px]">
                    {banner.plaqueTitle || 'BANK OFFER REFRESHED DAILY'}
                  </span>
                  <span className="text-zinc-200 text-[11px] block truncate">
                    {banner.plaqueSubtitle || 'Extra 10% Off on Leading Indian Credit & Debit Cards'}
                  </span>
                </div>
              </div>
            </div>

            {/* Col 2: PROMINENT LIVE COUNTDOWN TIMER (4 cols - boldly visible!) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div className="bg-black/60 border border-amber-500/40 rounded-2xl px-4 py-2.5 backdrop-blur-md shadow-lg shadow-amber-950/30 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest mb-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse fill-orange-400" />
                  <span>Celebration Sale Ends In:</span>
                </div>

                <div className="flex items-center gap-2 text-center">
                  {/* Days */}
                  <div className="flex flex-col items-center">
                    <span className="w-12 h-9 rounded-lg bg-zinc-900 border border-amber-500/50 flex items-center justify-center font-mono font-black text-lg text-amber-300 shadow-inner drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-bold mt-0.5">Days</span>
                  </div>

                  <span className="font-mono font-black text-amber-400 text-lg mb-3">:</span>

                  {/* Hours */}
                  <div className="flex flex-col items-center">
                    <span className="w-12 h-9 rounded-lg bg-zinc-900 border border-amber-500/50 flex items-center justify-center font-mono font-black text-lg text-amber-300 shadow-inner drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-bold mt-0.5">Hours</span>
                  </div>

                  <span className="font-mono font-black text-amber-400 text-lg mb-3">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center">
                    <span className="w-12 h-9 rounded-lg bg-zinc-900 border border-amber-500/50 flex items-center justify-center font-mono font-black text-lg text-amber-300 shadow-inner drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-bold mt-0.5">Mins</span>
                  </div>

                  <span className="font-mono font-black text-amber-400 text-lg mb-3">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <span className="w-12 h-9 rounded-lg bg-zinc-900 border border-amber-500/50 flex items-center justify-center font-mono font-black text-lg text-amber-400 animate-pulse shadow-inner drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-amber-200/80 font-bold mt-0.5">Secs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Col 3: Coupon Code & Action CTA (4 cols) */}
            <div className="lg:col-span-4 flex items-center justify-end gap-2.5">
              {/* Promo Code Box */}
              <div className="flex items-center rounded-xl bg-zinc-900/90 border border-dashed border-amber-400/80 p-1 pl-2.5 shadow-md">
                <Tag className="w-3.5 h-3.5 text-amber-400 mr-2 shrink-0" />
                <div className="mr-2.5">
                  <span className="font-mono font-black text-sm text-amber-300 tracking-wider">
                    {banner.promoCode}
                  </span>
                  <span className="text-[10px] text-zinc-400 block -mt-0.5">
                    {banner.discountText || `${discountVal}% OFF`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopyAndApply}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer ${
                    copied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black'
                  }`}
                  title="Copy and apply discount in checkout"
                >
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>COPIED</span>
                    </span>
                  ) : (
                    <span>COPY</span>
                  )}
                </button>
              </div>

              {/* Main CTA button */}
              <button
                type="button"
                onClick={handleCtaClick}
                className={`py-2.5 px-4 rounded-xl font-black text-xs tracking-wide shadow-xl flex items-center gap-1.5 cursor-pointer transform hover:-translate-y-0.5 transition-all ${theme.buttonBg}`}
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* TABLET LAYOUT (md to lg) */}
          <div className="hidden md:flex lg:hidden flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${theme.badgeBg}`}>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {banner.occasionName}
                </span>
                <span className="text-xs text-amber-200 font-semibold">{banner.headline}</span>
              </div>

              {/* Bank Offer Pill */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs ${theme.chipBg}`}>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span className="font-bold text-amber-200">{banner.plaqueTitle || 'Bank Offer'}:</span>
                <span className="text-zinc-200 text-[11px] truncate">{banner.plaqueSubtitle || 'Extra 10% Off on Cards'}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10 gap-2">
              {/* Visible Timer for Tablet */}
              <div className="flex items-center gap-1.5 bg-black/60 border border-amber-500/40 rounded-xl px-3 py-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1">Sale Ends:</span>
                <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-300">
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-amber-500/40">{String(timeLeft.days).padStart(2, '0')}d</span>
                  <span>:</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-amber-500/40">{String(timeLeft.hours).padStart(2, '0')}h</span>
                  <span>:</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-amber-500/40">{String(timeLeft.minutes).padStart(2, '0')}m</span>
                  <span>:</span>
                  <span className="px-1.5 py-0.5 bg-zinc-900 rounded border border-amber-500/40 text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}s</span>
                </div>
              </div>

              {/* Promo code & CTA */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAndApply}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-dashed ${
                    copied ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-zinc-900 border-amber-400/80 text-amber-300'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono font-black">{banner.promoCode}</span>
                  <span className="text-[10px] bg-amber-400 text-zinc-950 px-1.5 py-0.5 rounded font-black">
                    {copied ? '✓' : 'COPY'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCtaClick}
                  className={`px-3.5 py-2 rounded-lg text-xs font-black shadow-md flex items-center gap-1.5 ${theme.buttonBg}`}
                >
                  <span>{ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* MOBILE LAYOUT (Clean, readable, prominent timer) */}
          <div className="flex md:hidden flex-col gap-2.5">
            {/* Mobile Header Row */}
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${theme.badgeBg}`}>
                <Flame className="w-3 h-3 text-amber-400" />
                {banner.occasionName}
              </span>
              <span className="text-[11px] font-bold text-amber-200 truncate">
                {banner.headline}
              </span>
            </div>

            {/* Mobile Prominent Countdown Timer */}
            <div className="bg-black/60 border border-amber-500/40 rounded-xl p-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                Sale Ends In:
              </span>
              <div className="flex items-center gap-1 text-center font-mono font-black text-xs text-amber-300">
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-amber-500/40">
                  {String(timeLeft.days).padStart(2, '0')}d
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-amber-500/40">
                  {String(timeLeft.hours).padStart(2, '0')}h
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-amber-500/40">
                  {String(timeLeft.minutes).padStart(2, '0')}m
                </span>
                <span>:</span>
                <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-amber-500/40 text-amber-400">
                  {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Mobile Bank Plaque + Code + CTA Row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10">
              <div className="flex items-center gap-1 min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-[10px] text-zinc-300 truncate">
                  <strong className="text-amber-300">{banner.plaqueTitle || 'Bank Offer'}:</strong> {banner.plaqueSubtitle || 'Extra 10% Off'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyAndApply}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border border-dashed active:scale-95 cursor-pointer ${
                    copied
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-zinc-900 border-amber-400/80 text-amber-300'
                  }`}
                >
                  <Tag className="w-2.5 h-2.5 text-amber-400" />
                  <span className="font-mono font-black">{banner.promoCode}</span>
                  <span className="text-[8px] bg-amber-400 text-zinc-950 font-bold px-1 py-0.2 rounded ml-0.5">
                    {copied ? '✓' : 'COPY'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleCtaClick}
                  className={`p-1.5 rounded-md text-zinc-950 font-black shadow transition-all ${theme.buttonBg}`}
                  title={ctaLabel}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Mobile Coins Perks */}
            <div className="flex items-center justify-between text-[9px] text-amber-300/90 px-0.5">
              <span className="truncate">🪙 Earn <strong>100 FOAXX Coins</strong> on this order (1000 Coins = ₹250)</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
