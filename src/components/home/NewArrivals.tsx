import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';

export const NewArrivals: React.FC = () => {
  const { products, setCurrentView, setSelectedCategory } = useStore();

  // The 8 exact products from initial products
  const newArrivalsList = products.slice(0, 8);

  const handleViewAll = () => {
    setSelectedCategory('All');
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white py-8 sm:py-10 border-b border-stone-200/60">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Header row: Title on left, "View All ->" link on right */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-stone-900 tracking-tight leading-none">
              New Arrivals
            </h2>
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              Fresh styles for your next favourite look.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-stone-900 hover:text-[#E07A5F] transition-colors cursor-pointer group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 8 Product Cards in 1 row on Desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3">
          {newArrivalsList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
