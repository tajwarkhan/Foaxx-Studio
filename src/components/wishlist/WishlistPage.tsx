import React from 'react';
import { ArrowRight, Heart, Share2, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const WishlistPage: React.FC = () => {
  const {
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setCurrentView,
    setSelectedProduct,
    showToast,
  } = useStore();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
  };

  const handleMoveAllToCart = () => {
    savedProducts.forEach((p) => addToCart(p));
    showToast(`Moved all ${savedProducts.length} items to your shopping bag!`, 'success');
  };

  const handleShareWishlist = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/?wishlist=${wishlist.join(',')}`);
      showToast('Wishlist link copied to clipboard! Share it with friends.');
    } else {
      showToast('Wishlist ready to share!');
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full bg-[#fdfcfb] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#E07A5F] fill-[#E07A5F]" />
              <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-stone-900 tracking-tight">
                My Wishlist ({savedProducts.length})
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Your saved favourites. Move to bag whenever you're ready to check out.
            </p>
          </div>

          {savedProducts.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleShareWishlist}
                className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Wishlist</span>
              </button>

              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Bag</span>
              </button>
            </div>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="py-20 text-center max-w-sm mx-auto">
            <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3 stroke-[1]" />
            <h3 className="text-base font-semibold text-stone-900">Your wishlist is empty</h3>
            <p className="text-xs text-stone-500 mt-1">
              Explore our new jewellery and clothing arrivals and tap the heart icon on any piece you love.
            </p>
            <button
              onClick={() => setCurrentView('shop')}
              className="mt-5 bg-stone-900 text-white text-xs font-semibold px-6 py-2.5 rounded-md hover:bg-black transition-colors uppercase tracking-wider cursor-pointer"
            >
              Explore Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
            {savedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg p-3 border border-stone-200/60 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => handleProductClick(product)}
                    className="relative aspect-[4/5] rounded-md overflow-hidden bg-stone-50 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-xs cursor-pointer"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3
                    onClick={() => handleProductClick(product)}
                    className="mt-2.5 text-xs font-medium text-stone-800 truncate cursor-pointer hover:text-black"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xs sm:text-sm font-bold text-stone-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-[#E54F4F]">
                      {product.discount}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleMoveToCart(product)}
                  className="mt-4 w-full bg-[#111111] hover:bg-black text-white text-xs font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Bag</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
