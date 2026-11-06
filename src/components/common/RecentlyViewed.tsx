import React from 'react';
import { Eye, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';

interface RecentlyViewedProps {
  currentProductId?: string;
  limit?: number;
  title?: string;
}

export const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
  limit = 4,
  title = 'Recently Viewed Pieces',
}) => {
  const { recentlyViewed, products } = useStore();

  const viewedProducts = recentlyViewed
    .filter((id) => id !== currentProductId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, limit);

  if (viewedProducts.length === 0) return null;

  return (
    <section className="mt-14 pt-8 border-t border-stone-200/80">
      <div className="flex items-center justify-between mb-5">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#E07A5F] font-semibold">
            Based on your browsing
          </span>
          <h3 className="text-xl sm:text-2xl font-serif-luxury font-medium text-stone-900 mt-0.5">
            {title}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {viewedProducts.map((prod) => (
          <ProductCard key={prod.id} product={prod} showCategory={true} />
        ))}
      </div>
    </section>
  );
};
