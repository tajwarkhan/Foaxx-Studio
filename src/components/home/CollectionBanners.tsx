import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CollectionBanners: React.FC = () => {
  const { homepageConfig, setSelectedCategory, setCurrentView } = useStore();

  const handleBannerClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#fcfbfa] py-6 sm:py-8">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {homepageConfig.banners.map((banner) => {
            return (
              <div
                key={banner.id}
                onClick={() => handleBannerClick(banner.category)}
                className="group relative aspect-[415/175] min-h-[160px] rounded-xs overflow-hidden cursor-pointer shadow-xs hover:shadow-md transition-shadow flex items-center"
              >
                {/* Clean Background Image with Photography on Right */}
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Clear, Non-Overlapping Content Overlay on Left */}
                <div className="relative z-10 p-4 sm:p-5 lg:p-6 max-w-[62%] flex flex-col justify-center items-start text-left">
                  {/* Title */}
                  <h3 className="font-serif-luxury text-base sm:text-lg lg:text-xl font-medium text-white leading-tight drop-shadow-xs">
                    {banner.title === 'The Jewellery Edit' ? (
                      <>
                        <span className="font-serif italic font-normal mr-1">The</span>
                        Jewellery Edit
                      </>
                    ) : (
                      banner.title
                    )}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-[11px] sm:text-xs text-white/90 font-light mt-1 leading-snug drop-shadow-xs">
                    {banner.subtitle}
                  </p>

                  {/* Clear, Crisp Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBannerClick(banner.category);
                    }}
                    className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-xs border border-white text-white text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider bg-black/25 hover:bg-white hover:text-stone-900 transition-all backdrop-blur-2xs cursor-pointer shadow-xs"
                  >
                    <span>{banner.buttonText.replace('→', '').trim()}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
