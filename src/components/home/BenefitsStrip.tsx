import React from 'react';
import { Gem, PackageCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BenefitsStrip: React.FC = () => {
  const { homepageConfig } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'truck':
        return <Truck className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800 stroke-[1.5]" />;
      case 'package':
        return <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800 stroke-[1.5]" />;
      case 'shield':
        return <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800 stroke-[1.5]" />;
      case 'gem':
      default:
        return <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-stone-800 stroke-[1.5]" />;
    }
  };

  return (
    <section className="w-full bg-[#f9f7f4] border-b border-stone-200/80 py-4 sm:py-5">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 lg:divide-x divide-stone-200/70">
          {homepageConfig.benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="flex items-center justify-center gap-3.5 px-2 py-1 text-left"
            >
              <div className="shrink-0">{getIcon(benefit.iconName)}</div>
              <div>
                <h4 className="text-xs sm:text-[13px] font-semibold text-stone-900 leading-snug">
                  {benefit.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-stone-500 font-normal leading-tight">
                  {benefit.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
