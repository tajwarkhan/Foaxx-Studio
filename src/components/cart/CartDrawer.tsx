import React, { useState } from 'react';
import { ArrowRight, Check, Gift, Minus, Plus, ShoppingBag, Sparkles, Tag, Trash2, Truck, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartSubtotal,
    discountAmount,
    shippingAmount,
    giftAmount,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateCartQuantity,
    removeFromCart,
    setCurrentView,
    giftOption,
    setGiftOption,
    recentlyViewed,
    products,
    setSelectedProduct,
    coinDiscountAmount,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showGiftDetails, setShowGiftDetails] = useState(giftOption.enabled);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleGift = (checked: boolean) => {
    setGiftOption((prev) => ({
      ...prev,
      enabled: checked,
    }));
    setShowGiftDetails(checked);
  };

  const viewedItems = recentlyViewed
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity backdrop-blur-xs"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-800" />
              <h2 className="text-base font-semibold text-stone-900 font-serif-luxury">
                Your Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-[#FAF7F2] p-3 border-b border-stone-200/60">
            <div className="flex items-center gap-2 text-xs text-stone-700 font-medium">
              <Truck className="w-4 h-4 text-[#E07A5F] shrink-0" />
              {remainingForFreeShipping === 0 ? (
                <span className="text-emerald-700 font-semibold">
                  Congratulations! You unlocked FREE Standard Shipping!
                </span>
              ) : (
                <span>
                  Add <strong className="text-stone-900">₹{remainingForFreeShipping.toLocaleString('en-IN')}</strong> more for <strong className="text-emerald-700">FREE Shipping</strong>
                </span>
              )}
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#E07A5F] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShoppingBag className="w-12 h-12 text-stone-300 mb-3 stroke-[1]" />
                <p className="text-sm font-medium text-stone-800">Your bag is empty</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Discover our bestselling heirloom jewellery and fashion arrivals.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="mt-4 bg-stone-900 text-white text-xs font-semibold px-5 py-2.5 rounded-md hover:bg-black transition-colors uppercase tracking-wider"
                >
                  Start Shopping
                </button>

                {/* Recently Viewed items suggestions */}
                {viewedItems.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-stone-200 w-full text-left">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      Recently Viewed By You:
                    </span>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {viewedItems.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            setSelectedProduct(prod);
                            setIsCartOpen(false);
                            setCurrentView('product');
                          }}
                          className="cursor-pointer group"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full aspect-[4/5] object-cover rounded-md bg-stone-100 group-hover:scale-104 transition-transform"
                          />
                          <p className="text-[10px] font-medium text-stone-800 truncate mt-1">
                            {prod.name}
                          </p>
                          <p className="text-[10px] font-bold text-stone-900">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={`${item.product.id}-${index}`} className="py-4 flex gap-3.5 first:pt-0">
                  <img
                    src={item.selectedColorImage || item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-md bg-stone-50 border border-stone-200/50 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant Specs with Color Swatch */}
                      <div className="flex items-center gap-2 mt-1.5 text-[11px] text-stone-600 flex-wrap">
                        {item.selectedColor && (
                          <span className="inline-flex items-center gap-1.5 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                            {item.selectedColorHex && (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0"
                                style={{ backgroundColor: item.selectedColorHex }}
                              />
                            )}
                            <span>{item.selectedColor}</span>
                          </span>
                        )}
                        {item.selectedSize && (
                          <span className="text-stone-500">
                            Size: <strong className="text-stone-700">{item.selectedSize}</strong>
                          </span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-xs font-bold text-stone-900">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-400 line-through">
                          ₹{item.product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="p-1 hover:bg-stone-200 text-stone-700 rounded-l transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="p-1 hover:bg-stone-200 text-stone-700 rounded-r transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-stone-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200/80 bg-stone-50/50 space-y-3">
              {/* Luxury Gift Packaging Box Feature */}
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={giftOption.enabled}
                    onChange={(e) => handleToggleGift(e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-[#E07A5F]" />
                        FOAXX Velvet Keepsake Box & Note
                      </span>
                      <span className="font-bold text-stone-800">
                        {cartSubtotal >= 2000 ? (
                          <span className="text-emerald-700">FREE</span>
                        ) : (
                          `+₹${giftOption.price}`
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Signature packaging with gold wax seal ribbon and handwritten card.
                    </p>
                  </div>
                </label>

                {giftOption.enabled && (
                  <div className="mt-3 pt-2.5 border-t border-stone-100 space-y-2">
                    <input
                      type="text"
                      placeholder="Recipient's Name (e.g. For Aanya)"
                      value={giftOption.recipientName}
                      onChange={(e) =>
                        setGiftOption((prev) => ({ ...prev, recipientName: e.target.value }))
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                    <textarea
                      rows={2}
                      placeholder="Include personalized handwritten message..."
                      value={giftOption.message}
                      onChange={(e) =>
                        setGiftOption((prev) => ({ ...prev, message: e.target.value }))
                      }
                      className="w-full bg-stone-50 border border-stone-200 rounded px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                )}
              </div>

              {/* Promo Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Tag className="w-3.5 h-3.5" />
                      <span>
                        Code <strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.discountPercent}% OFF)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-emerald-700 hover:text-emerald-900 font-semibold text-[11px] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Enter coupon (e.g. FOAXX20)"
                        className="w-full bg-white border border-stone-300 text-xs rounded-md px-3 py-2 uppercase placeholder:normal-case focus:outline-none focus:border-stone-800"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-stone-900 hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Order Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#E07A5F] font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {coinDiscountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>🪙 Coins Discount</span>
                    <span>-₹{coinDiscountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  {shippingAmount === 0 ? (
                    <span className="text-emerald-700 font-semibold">FREE</span>
                  ) : (
                    <span>₹{shippingAmount}</span>
                  )}
                </div>

                {giftAmount > 0 && (
                  <div className="flex justify-between text-stone-800">
                    <span>Luxury Gift Keepsake Box</span>
                    <span>₹{giftAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total (incl. taxes)</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer tracking-wide uppercase"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-900 transition-colors py-1 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
