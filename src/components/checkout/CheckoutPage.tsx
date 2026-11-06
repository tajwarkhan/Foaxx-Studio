import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Lock,
  Package,
  QrCode,
  ShieldCheck,
  Truck,
  Wallet,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, ShippingAddress } from '../../types';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    shippingAmount,
    giftAmount,
    cartTotal,
    appliedCoupon,
    createOrder,
    setCurrentView,
    setActiveTrackingOrder,
    setActiveInvoiceOrder,
    coinWallet,
    redeemedCoinsAtCheckout,
    setRedeemedCoinsAtCheckout,
    coinDiscountAmount,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Address form
  const [address, setAddress] = useState<ShippingAddress>({
    name: 'Priya Sharma',
    phone: '9876543210',
    address: 'A-402, Prestige Hermitage, Kensington Road',
    locality: 'Ulsoor',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560042',
  });

  const [email, setEmail] = useState('priya.sharma@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('priyasharma@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  if (cart.length === 0 && step !== 'success') {
    return (
      <div className="w-full bg-[#fdfcfb] min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-serif-luxury font-medium text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500 mt-1">Please add items to your bag before checking out.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="mt-4 bg-stone-900 text-white text-xs font-semibold px-6 py-2.5 rounded-md hover:bg-black transition-colors"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.name || !address.phone || !address.address || !address.pincode) {
      alert('Please fill in all required delivery fields.');
      return;
    }
    setStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    const paymentLabel =
      paymentMethod === 'upi'
        ? `UPI (${upiId})`
        : paymentMethod === 'card'
        ? 'Debit/Credit Card'
        : paymentMethod === 'netbanking'
        ? 'Net Banking'
        : 'Cash on Delivery (COD)';

    setTimeout(() => {
      const order = createOrder(address, paymentLabel);
      setCreatedOrder(order);
      setIsProcessing(false);
      setStep('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  return (
    <div className="w-full bg-[#fcfbfa] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (step === 'payment') setStep('details');
                else setCurrentView('home');
              }}
              className="p-1 text-stone-600 hover:text-black"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl sm:text-2xl font-serif-luxury font-medium text-stone-900">
              {step === 'success' ? 'Order Confirmed!' : 'Secure Express Checkout'}
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Success Screen */}
        {step === 'success' && createdOrder && (
          <div className="max-w-xl mx-auto py-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 stroke-[2]" />
            </div>

            <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-widest block">
              WEAR YOUR WOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-stone-900 mt-1">
              Thank you, {createdOrder.shippingAddress.name}!
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              Your order <strong className="text-stone-900">{createdOrder.orderNumber}</strong> has been placed and is being prepared with care in our Mumbai vault.
            </p>

            {/* Order Brief Box */}
            <div className="mt-8 bg-white rounded-xl p-5 border border-stone-200 text-left text-xs space-y-3">
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-500">Order Number</span>
                <span className="font-bold text-stone-900">{createdOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-500">Estimated Delivery</span>
                <span className="font-semibold text-emerald-700">{createdOrder.estimatedDelivery}</span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-500">Delivery Address</span>
                <span className="text-right text-stone-800 max-w-xs">
                  {createdOrder.shippingAddress.address}, {createdOrder.shippingAddress.city} - {createdOrder.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between pb-3 border-b border-stone-100">
                <span className="text-stone-500">Payment Mode</span>
                <span className="font-medium text-stone-800">{createdOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 pt-1 text-sm">
                <span>Total Amount Paid</span>
                <span>₹{createdOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => {
                  setActiveTrackingOrder(createdOrder);
                  setCurrentView('tracking');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 bg-stone-900 hover:bg-black text-white text-xs font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>Track Shipment</span>
              </button>
              <button
                onClick={() => {
                  setActiveInvoiceOrder(createdOrder);
                }}
                className="flex-1 bg-[#FAF7F2] border border-[#E07A5F]/40 hover:bg-[#F3ECE0] text-stone-900 text-xs font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Download Tax Invoice (GST)</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex-1 border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-semibold py-3 rounded-md transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* Two-Column Checkout Form & Order Summary */}
        {step !== 'success' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
            {/* Left Column: Form Steps */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Delivery Address */}
              <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                  <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center">
                      1
                    </span>
                    <span>Shipping & Delivery Details</span>
                  </h3>
                  {step === 'payment' && (
                    <button
                      onClick={() => setStep('details')}
                      className="text-xs text-[#E07A5F] hover:underline font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {step === 'details' ? (
                  <form onSubmit={handleDetailsSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={address.name}
                          onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">Mobile Phone *</label>
                        <input
                          type="tel"
                          required
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Email for Invoices *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Street Address / House No. *</label>
                      <input
                        type="text"
                        required
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">PIN Code *</label>
                        <input
                          type="text"
                          maxLength={6}
                          required
                          value={address.pincode}
                          onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">City *</label>
                        <input
                          type="text"
                          required
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-700 font-medium mb-1">State *</label>
                        <input
                          type="text"
                          required
                          value={address.state}
                          onChange={(e) => setAddress({ ...address, state: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-md p-2.5 focus:border-stone-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-stone-900 hover:bg-black text-white text-xs font-semibold py-3 rounded-md transition-colors uppercase tracking-wider mt-4"
                    >
                      Continue to Payment Method
                    </button>
                  </form>
                ) : (
                  <div className="text-xs text-stone-600">
                    <p className="font-semibold text-stone-900">{address.name} ({address.phone})</p>
                    <p className="mt-0.5">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                  </div>
                )}
              </div>

              {/* Step 2: Payment Selection */}
              {step === 'payment' && (
                <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs">
                  <h3 className="text-sm font-semibold text-stone-900 flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
                    <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center">
                      2
                    </span>
                    <span>Select Payment Method (INR ₹)</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    {/* UPI */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="mt-0.5 accent-stone-900"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">UPI Instant Payment (Zero Extra Fee)</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs font-bold">
                            FASTEST
                          </span>
                        </div>
                        <p className="text-stone-500 mt-0.5">Google Pay, PhonePe, Paytm, or BHIM</p>
                        {paymentMethod === 'upi' && (
                          <div className="mt-3 pt-3 border-t border-stone-200">
                            <input
                              type="text"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="Enter your UPI ID (e.g. mobile@upi)"
                              className="w-full bg-white border border-stone-300 rounded-md p-2 text-xs"
                            />
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Debit / Credit Cards */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="mt-0.5 accent-stone-900"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-stone-900">Credit / Debit Card</span>
                          <span className="text-[10px] text-stone-400">Visa, Mastercard, RuPay</span>
                        </div>
                        <p className="text-stone-500 mt-0.5">Safe 3D Secure authentication</p>
                        {paymentMethod === 'card' && (
                          <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
                            <input
                              type="text"
                              placeholder="Card Number (4000 1234 5678 9010)"
                              defaultValue="4111 8923 1042 8891"
                              className="w-full bg-white border border-stone-300 rounded-md p-2 text-xs"
                            />
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="MM / YY"
                                defaultValue="08/29"
                                className="bg-white border border-stone-300 rounded-md p-2 text-xs"
                              />
                              <input
                                type="password"
                                placeholder="CVV"
                                defaultValue="321"
                                maxLength={4}
                                className="bg-white border border-stone-300 rounded-md p-2 text-xs"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-stone-900 bg-stone-50'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mt-0.5 accent-stone-900"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-stone-900">Cash on Delivery (COD)</span>
                        <p className="text-stone-500 mt-0.5">Pay in cash or UPI QR upon receiving delivery</p>
                      </div>
                    </label>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="w-full bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-semibold py-3.5 rounded-md transition-colors uppercase tracking-wider mt-6 flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-60"
                  >
                    {isProcessing ? (
                      <span>Verifying & Securing Order...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Place Order · ₹{cartTotal.toLocaleString('en-IN')}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 rounded-xl border border-stone-200/80 shadow-xs sticky top-28">
                <h3 className="text-sm font-semibold text-stone-900 pb-3 border-b border-stone-100">
                  Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
                </h3>

                {/* Items preview */}
                <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto my-3">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center gap-3 text-xs">
                      <img
                        src={item.selectedColorImage || item.product.image}
                        alt={item.product.name}
                        className="w-12 h-14 object-cover rounded-md bg-stone-50 border border-stone-200/50 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 truncate">{item.product.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500">
                          <span>Qty: {item.quantity}</span>
                          {item.selectedColor && (
                            <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
                              ·{' '}
                              {item.selectedColorHex && (
                                <span
                                  className="w-2 h-2 rounded-full border border-black/15 inline-block"
                                  style={{ backgroundColor: item.selectedColorHex }}
                                />
                              )}
                              <span>{item.selectedColor}</span>
                            </span>
                          )}
                          {item.selectedSize && <span>· Size {item.selectedSize}</span>}
                        </div>
                      </div>
                      <span className="font-semibold text-stone-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                {/* FOAXX Coins Instant Redemption Card */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50/80 via-yellow-50/60 to-amber-50/80 border border-amber-200/90 my-3 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950">
                      <span>🪙 FOAXX Coins Balance</span>
                      <span className="text-[11px] font-semibold text-amber-800">
                        ({coinWallet.balance.toLocaleString('en-IN')} Coins)
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      ₹{((coinWallet.balance / 1000) * 250).toFixed(0)} Value
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 mt-1">
                    Redeem 1,000 Coins for an instant ₹250 discount on your order. (1,000 Coins = ₹250)
                  </p>

                  {coinWallet.balance >= 1000 ? (
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-amber-200/60">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={redeemedCoinsAtCheckout > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const maxPossible = Math.min(
                                Math.floor(coinWallet.balance / 1000) * 1000,
                                1000
                              );
                              setRedeemedCoinsAtCheckout(maxPossible);
                            } else {
                              setRedeemedCoinsAtCheckout(0);
                            }
                          }}
                          className="w-4 h-4 rounded text-amber-600 accent-amber-600 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-stone-900">
                          Redeem 1,000 Coins (-₹250 Discount)
                        </span>
                      </label>

                      {redeemedCoinsAtCheckout > 0 && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded">
                          -₹250 Applied
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="mt-2 text-[10px] text-stone-500 italic">
                      Earn coins with 5-star reviews (100 coins) or by sharing products with friends!
                    </div>
                  )}
                </div>

                {/* Cost breakdown */}
                <div className="space-y-2 text-xs text-stone-600 pt-3 border-t border-stone-200">
                  <div className="flex justify-between">
                    <span>Bag Subtotal</span>
                    <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#E07A5F] font-semibold">
                      <span>Promo Discount ({appliedCoupon?.code})</span>
                      <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {coinDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>🪙 FOAXX Coins Redeemed ({redeemedCoinsAtCheckout} Coins)</span>
                      <span>-₹{coinDiscountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    {shippingAmount === 0 ? (
                      <span className="text-emerald-700 font-semibold">FREE</span>
                    ) : (
                      <span>₹{shippingAmount}</span>
                    )}
                  </div>

                  {giftAmount > 0 && (
                    <div className="flex justify-between text-stone-800">
                      <span>Luxury Keepsake Gift Box</span>
                      <span>₹{giftAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                    <span>Total Amount</span>
                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Return guarantee */}
                <div className="mt-5 p-3 rounded-lg bg-stone-50 text-[11px] text-stone-500 space-y-1">
                  <p className="font-semibold text-stone-800">FOAXX 7-Day Guarantee</p>
                  <p>Hassle-free doorstep exchanges and returns. 100% money-back guarantee.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
