import React from 'react';
import { useStore } from '../../context/StoreContext';

export const CategoryStrip: React.FC = () => {
  const { categories, setSelectedCategory, setCurrentView } = useStore();

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentView('shop');
  };

  return (
    <section className="w-full bg-[#fdfcfb] py-4 sm:py-6 border-b border-stone-100">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Horizontal single row on desktop, smooth scroll on mobile */}
        <div className="flex items-center justify-between gap-2.5 sm:gap-4 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center flex-1 min-w-[70px] sm:min-w-[85px] lg:min-w-[100px] group cursor-pointer focus:outline-none"
            >
              {/* Category Image Box */}
              <div className="w-full aspect-[110/93] rounded-lg overflow-hidden bg-stone-100 border border-stone-200/60 shadow-xs group-hover:border-stone-400 group-hover:shadow-sm transition-all duration-200 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              {/* Category Label */}
              <span className="mt-2 text-[11px] sm:text-[12px] font-semibold text-stone-800 tracking-tight text-center group-hover:text-black transition-colors whitespace-nowrap">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
