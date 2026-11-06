import React from 'react';
import { Award, Feather, Gem, Gift, HeartHandshake, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CraftsmanshipStory: React.FC = () => {
  const { setCurrentView, setActivePolicy } = useStore();

  const pillars = [
    {
      icon: <Gem className="w-6 h-6 text-[#E07A5F]" />,
      title: '18K & 24K Micron Gold Plating',
      description:
        'Electroplated with heavy 18K/24K gold and sealed with a transparent anti-tarnish e-coating that resists sweat, perfumes, and humidity for 365+ days.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#E07A5F]" />,
      title: 'Jaipur Heirloom Craftsmanship',
      description:
        'Each statement piece is meticulously set by master karigars using centuries-old Jadau kundan foil techniques, hand-carved prongs, and meenakari reverse enameling.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#E07A5F]" />,
      title: '100% Hypoallergenic & Skin-Safe',
      description:
        'Zero nickel, zero lead, and zero cadmium. Safe for the most sensitive ears and necklines, built over certified 925 silver and surgical-grade alloy bases.',
    },
    {
      icon: <Gift className="w-6 h-6 text-[#E07A5F]" />,
      title: 'The Signature Velvet Unboxing',
      description:
        'Every order arrives nestled in an ivory-lined blush velvet keepsake box with satin ribbon accents, storage zip-pouches, and a personalized warranty certificate.',
    },
  ];

  const handleLearnMore = () => {
    setActivePolicy('Materials & Authenticity');
    setCurrentView('policy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-[#181615] text-white py-16 sm:py-24">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Editorial Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-[0.3em] font-serif-luxury block mb-2">
            The FOAXX Standard
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-medium tracking-tight">
            Designed for Modern Muses, Handcrafted for Generations
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 mt-3 font-light leading-relaxed">
            We reject the disposable fashion cycle. We craft affordable demi-fine jewellery and garments with the rigorous engineering, weight, and finishes of fine high jewellery.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-stone-900/60 border border-stone-800 hover:border-stone-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-stone-800/80 flex items-center justify-center mb-5 border border-stone-700/60">
                  {pillar.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white font-serif-luxury mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-stone-800 text-[10px] text-stone-500 font-mono">
                PILLAR 0{idx + 1} · QUALITY CERTIFIED
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Action */}
        <div className="mt-12 text-center">
          <button
            onClick={handleLearnMore}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-300 hover:text-white border-b border-stone-600 hover:border-white pb-1 transition-colors cursor-pointer uppercase tracking-wider"
          >
            <span>Read Our Materials & Plating Guarantee Guide</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
};
