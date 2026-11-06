import React, { useState, useEffect } from 'react';
import { Camera, Check, FolderOpen, Image as ImageIcon, Sparkles, Star, UploadCloud, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductReviewItem } from '../../types';

interface WriteReviewModalProps {
  product?: Product;
  isOpen?: boolean;
  onClose?: () => void;
  orderId?: string;
}

const PRESET_CUSTOMER_PHOTOS = [
  { label: 'Jewellery Box Unboxing', url: '/assets/extracted/prod_pearl_earrings.png' },
  { label: 'Golden Luster Shot', url: '/assets/extracted/cat_jewellery.png' },
  { label: 'Layered Styling Look', url: '/assets/extracted/prod_charm_necklace.png' },
  { label: 'Editorial Muse Fit', url: '/assets/extracted/prod_floral_coord.png' },
  { label: 'Handbag Day Look', url: '/assets/extracted/prod_classic_bag.png' },
];

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  product: propProduct,
  isOpen: propIsOpen,
  onClose: propOnClose,
  orderId: propOrderId,
}) => {
  const {
    addProductReview,
    user,
    isReviewModalOpen,
    reviewModalProduct,
    reviewModalOrderId,
    closeReviewModal,
    earnCoins,
    showToast,
  } = useStore();

  const activeProduct = propProduct || reviewModalProduct;
  const isModalVisible = propIsOpen !== undefined ? propIsOpen : isReviewModalOpen;
  const handleModalClose = propOnClose || closeReviewModal;
  const currentOrderId = propOrderId || reviewModalOrderId;

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState<string>(user?.name || '');
  const [location, setLocation] = useState<string>('Bengaluru, Karnataka');
  const [title, setTitle] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPresets, setShowPresets] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Word count & FOAXX Coins calculation: 5-Star + 80+ words = 100 Coins (₹25 value)
  const wordCount = comment.trim() === '' ? 0 : comment.trim().split(/\s+/).filter(Boolean).length;
  const isEligibleForCoins = rating === 5 && wordCount >= 80;

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  if (!isModalVisible || !activeProduct) return null;

  const ratingLabels: { [key: number]: string } = {
    1: 'Poor - Did not meet expectations',
    2: 'Fair - Average quality',
    3: 'Good - Met expectations',
    4: 'Very Good - Impressive finish & anti-tarnish luster',
    5: 'Exceptional - Pure Luxury, Impeccable Craftsmanship & Fit',
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setShowPresets(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !comment.trim()) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);

    const newReview: ProductReviewItem = {
      id: `rev-${Date.now()}`,
      productId: activeProduct.id,
      name: name.trim(),
      location: location.trim(),
      rating,
      title: title.trim(),
      comment: comment.trim(),
      date: 'Verified Buyer · Today',
      verifiedBuyer: true,
      image: imagePreview || activeProduct.image,
      helpfulCount: 1,
    };

    setTimeout(() => {
      addProductReview(newReview, currentOrderId || undefined);

      // Reward 100 FOAXX Coins if 5-Star + 80+ Words
      if (isEligibleForCoins) {
        earnCoins(
          100,
          `5-Star Detailed Review (80+ words): ${activeProduct.name}`,
          activeProduct.id
        );
      }

      setIsSubmitting(false);
      setImagePreview('');
      setTitle('');
      setComment('');
      handleModalClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity" onClick={handleModalClose} />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-5">
        <div
          className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
            <div className="flex items-center gap-3">
              <img
                src={activeProduct.image}
                alt={activeProduct.name}
                className="w-12 h-14 object-cover rounded-md border border-stone-200 shrink-0"
              />
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#E07A5F] font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Delivered Order Review</span>
                </span>
                <h3 className="text-sm sm:text-base font-semibold text-stone-900 font-serif-luxury truncate max-w-[280px]">
                  {activeProduct.name}
                </h3>
                {currentOrderId && (
                  <span className="text-[10px] text-stone-500 font-medium">
                    Order Ref: #{currentOrderId}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={handleModalClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
            {/* Star Rating Picker */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1.5">
                Overall Rating <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-115 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#E07A5F] font-medium mt-1">
                {ratingLabels[hoverRating || rating]}
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Review Headline <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exquisite luster, luxurious feel and compliments all night!"
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-[#E07A5F] focus:bg-white text-xs"
              />
            </div>

            {/* Comment & FOAXX Coins Reward Indicator */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-stone-800">
                  Your Detailed Feedback <span className="text-rose-500">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                    wordCount >= 80
                      ? 'bg-emerald-100 text-emerald-800 font-bold border border-emerald-300'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {wordCount} / 80 words
                </span>
              </div>

              {/* FOAXX Coin Reward Helper Pill */}
              <div
                className={`mb-2 p-2.5 rounded-lg border text-[11px] transition-all flex items-center gap-2 ${
                  isEligibleForCoins
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 font-medium'
                    : rating === 5
                    ? 'bg-amber-50/70 border-amber-200 text-amber-800'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-900 font-bold flex items-center justify-center shrink-0 text-xs shadow-xs">
                  🪙
                </div>
                <div>
                  {isEligibleForCoins ? (
                    <span className="font-semibold text-amber-950">
                      🎉 100 FOAXX Coins (₹25 Value) Eligible! You have met the 5-star & 80+ words requirement.
                    </span>
                  ) : rating === 5 ? (
                    <span>
                      Write <strong>{Math.max(0, 80 - wordCount)} more words</strong> with your 5-star rating to earn <strong>100 FOAXX Coins (₹25)</strong>!
                    </span>
                  ) : (
                    <span>
                      Tip: Rate <strong>5 stars</strong> with <strong>80+ words</strong> to earn <strong>100 FOAXX Coins (₹25 value)</strong>!
                    </span>
                  )}
                </div>
              </div>

              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your detailed experience: fit, shine, anti-tarnish durability, packaging feel, weight, compliments received, and styling tips with other muses..."
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-[#E07A5F] focus:bg-white text-xs leading-relaxed"
              />
            </div>

            {/* Name & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Your Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sanya Singhal"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-[#E07A5F] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Indiranagar, Bengaluru"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:outline-none focus:border-[#E07A5F] focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Picture Upload with Live Preview */}
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-[#E07A5F]" />
                  <span>Attach Real Photo of Piece / Styling</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowPresets(!showPresets)}
                  className="text-stone-500 hover:text-stone-900 text-[11px] underline flex items-center gap-1 cursor-pointer"
                >
                  <FolderOpen className="w-3 h-3" />
                  <span>{showPresets ? 'Close Presets' : 'Choose Preset Photo'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-stone-100 border border-stone-300 rounded-lg cursor-pointer text-stone-700 transition-colors shadow-2xs font-medium">
                  <UploadCloud className="w-4 h-4 text-[#E07A5F]" />
                  <span>Upload from Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                {imagePreview ? (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-[#E07A5F] shadow-xs">
                    <img src={imagePreview} alt="Review attachment" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImagePreview('')}
                      className="absolute top-0 right-0 bg-rose-600 text-white rounded-bl-sm p-0.5 hover:bg-rose-700"
                      title="Remove picture"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-stone-400">
                    High-res customer pictures will be featured on the homepage muses carousel!
                  </span>
                )}
              </div>

              {/* Preset Photos selector */}
              {showPresets && (
                <div className="pt-2 border-t border-stone-200">
                  <div className="text-[11px] text-stone-500 mb-1.5 font-medium">
                    Or select an aesthetic studio flat-lay:
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESET_CUSTOMER_PHOTOS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImagePreview(preset.url);
                          setShowPresets(false);
                        }}
                        className="rounded-md overflow-hidden border border-stone-200 hover:border-[#E07A5F] transition-all aspect-square p-0.5 bg-white cursor-pointer group"
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover rounded-xs" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Verified buyer & reward reassurance */}
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Verified Buyer Review. Submitting will unlock <strong>100 FOAXX Coins</strong> and dismiss delivery reminders.
                </span>
              </div>
              <span className="text-amber-800 font-bold px-2 py-0.5 bg-amber-100 rounded text-[10px]">
                REWARD 🎁
              </span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-stone-100">
              <button
                type="button"
                onClick={handleModalClose}
                className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
              >
                Later
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-semibold tracking-wide uppercase transition-colors cursor-pointer shadow-md disabled:opacity-50 text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#E07A5F]" />
                <span>{isSubmitting ? 'Publishing...' : 'Publish Verified Review'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
