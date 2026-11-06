import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { INITIAL_HERO_SLIDES, INITIAL_HERO_CAROUSEL_SETTINGS } from '../../data/initialData';
import { HeroSlide } from '../../types';

export const HeroBanner: React.FC = () => {
  const { homepageConfig, setCurrentView, setSelectedCategory } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Touch swipe handling for mobile devices
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Active slides sorted by explicit order
  const activeSlides: HeroSlide[] = useMemo(() => {
    const rawSlides = homepageConfig.heroSlides && homepageConfig.heroSlides.length > 0
      ? homepageConfig.heroSlides
      : INITIAL_HERO_SLIDES;

    const filtered = rawSlides.filter((s) => s.isActive !== false);
    const sorted = [...(filtered.length > 0 ? filtered : INITIAL_HERO_SLIDES)].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    return sorted;
  }, [homepageConfig.heroSlides]);

  // Carousel playback settings
  const settings = useMemo(() => {
    return homepageConfig.heroCarouselSettings || INITIAL_HERO_CAROUSEL_SETTINGS;
  }, [homepageConfig.heroCarouselSettings]);

  // Ensure currentSlide is within bounds if slides count changes
  useEffect(() => {
    if (currentSlide >= activeSlides.length) {
      setCurrentSlide(0);
    }
  }, [activeSlides.length, currentSlide]);

  // Automatic slide interval transition
  useEffect(() => {
    if (!settings.autoSlide || activeSlides.length <= 1) return;
    if (settings.pauseOnHover && isHovered) return;

    const delayMs = Math.max(2, settings.intervalSeconds || 5) * 1000;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, delayMs);

    return () => clearInterval(interval);
  }, [settings.autoSlide, settings.intervalSeconds, settings.pauseOnHover, isHovered, activeSlides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  };

  // Mobile Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchStartY.current = e.targetTouches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distanceX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45; // 45px swipe threshold

    if (distanceX > minSwipeDistance) {
      // Swiped Left -> Next slide
      handleNext();
    } else if (distanceX < -minSwipeDistance) {
      // Swiped Right -> Previous slide
      handlePrev();
    }

    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
  };

  const activeSlide = activeSlides[currentSlide] || activeSlides[0];
  if (!activeSlide) return null;

  const accentColor = activeSlide.accentColor || '#DE7A62';

  const handlePrimaryClick = () => {
    if (activeSlide.primaryBtnLinkCategory) {
      setSelectedCategory(activeSlide.primaryBtnLinkCategory);
    } else {
      setSelectedCategory('All');
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSecondaryClick = () => {
    if (activeSlide.secondaryBtnLinkCategory) {
      setSelectedCategory(activeSlide.secondaryBtnLinkCategory);
    } else {
      setSelectedCategory('Jewellery');
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      className="relative w-full bg-[#E8DDD2] overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="FOAXX Featured Hero Slides"
    >
      <div className="max-w-[1340px] mx-auto relative aspect-[1312/344] min-h-[300px] sm:min-h-[340px] md:min-h-[370px] lg:min-h-[410px] xl:min-h-[440px] flex items-center">
        {/* Background Slide Image with Smooth Crossfade */}
        <div className="absolute inset-0 w-full h-full">
          <img
            key={activeSlide.id}
            src={activeSlide.image}
            alt={activeSlide.titlePart1 || 'FOAXX Luxury'}
            className="w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out"
          />
          {/* Subtle mobile-optimized contrast gradient scrim to guarantee text legibility on all phone screens */}
          <div
            className={`absolute inset-0 pointer-events-none ${
              activeSlide.isDarkText
                ? 'bg-gradient-to-r from-stone-100/70 via-stone-100/30 to-transparent sm:via-stone-100/10'
                : 'bg-gradient-to-r from-stone-950/70 via-stone-950/40 to-transparent sm:via-stone-950/15'
            }`}
          />
        </div>

        {/* Clear, Crisp Typography & Buttons Container */}
        <div className="relative z-10 w-full px-5 sm:px-12 md:px-16 lg:px-20 max-w-2xl py-6 sm:py-8">
          {/* Brand tag */}
          {activeSlide.brandTag && (
            <span
              className={`text-[9px] sm:text-xs font-semibold tracking-[0.25em] sm:tracking-[0.3em] uppercase block mb-1 sm:mb-2 font-serif-luxury ${
                activeSlide.isDarkText ? 'text-stone-700' : 'text-[#E07A5F]'
              }`}
            >
              {activeSlide.brandTag}
            </span>
          )}

          {/* Main Headline */}
          <h1
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-[46px] xl:text-[48px] font-serif-luxury font-normal tracking-tight leading-[1.08] ${
              activeSlide.isDarkText ? 'text-stone-900' : 'text-white'
            }`}
          >
            {activeSlide.titlePart1}
            {activeSlide.titlePart2 && (
              <>
                <br />
                {activeSlide.titlePart2}{' '}
              </>
            )}
            <span style={{ color: accentColor }}>{activeSlide.statementWord}</span>
          </h1>

          {/* Subtitle */}
          {activeSlide.subtitle && (
            <p
              className={`text-[11px] sm:text-xs md:text-sm mt-2 sm:mt-3 font-normal max-w-xs sm:max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none ${
                activeSlide.isDarkText ? 'text-stone-700' : 'text-stone-200'
              }`}
            >
              {activeSlide.subtitle}
            </p>
          )}

          {/* Interactive CTA Buttons */}
          <div className="flex items-center gap-2 sm:gap-3.5 mt-3.5 sm:mt-6 flex-wrap sm:flex-nowrap">
            {activeSlide.primaryBtnText && (
              <button
                type="button"
                onClick={handlePrimaryClick}
                className="bg-[#151515] hover:bg-black text-white text-[11px] sm:text-xs font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-xs tracking-wider transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[40px] sm:min-h-[44px]"
              >
                <span>{activeSlide.primaryBtnText.replace('→', '').trim()}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {activeSlide.secondaryBtnText && (
              <button
                type="button"
                onClick={handleSecondaryClick}
                className={`text-[11px] sm:text-xs font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded-xs border tracking-wider transition-all cursor-pointer backdrop-blur-xs min-h-[40px] sm:min-h-[44px] flex items-center justify-center ${
                  activeSlide.isDarkText
                    ? 'border-stone-800 text-stone-900 bg-white/50 hover:bg-white/80'
                    : 'border-white/70 text-white bg-black/25 hover:bg-black/45'
                }`}
              >
                {activeSlide.secondaryBtnText}
              </button>
            )}
          </div>
        </div>

        {/* Carousel Previous / Next circular controls */}
        {settings.showArrows !== false && activeSlides.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-20 group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-stone-800 flex items-center justify-center shadow-md transition-all cursor-pointer z-20 group"
            >
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Carousel Dots & Mobile Swipe Indicator */}
        {settings.showDots !== false && activeSlides.length > 1 && (
          <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-stone-900/20 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {activeSlides.map((s, idx) => (
              <button
                key={s.id || idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx
                    ? 'w-5 bg-stone-900 dark:bg-white'
                    : 'w-1.5 bg-stone-700/40 hover:bg-stone-700/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
