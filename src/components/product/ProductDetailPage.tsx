import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flame,
  Gem,
  Heart,
  HelpCircle,
  MapPin,
  Maximize2,
  RotateCcw,
  Ruler,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  ThumbsUp,
  Truck,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { RecentlyViewed } from '../common/RecentlyViewed';
import { WriteReviewModal } from './WriteReviewModal';

export const ProductDetailPage: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    products,
    showToast,
    addRecentlyViewed,
    setIsSizeGuideOpen,
    setSizeGuideCategory,
    openShareModal,
  } = useStore();

  const product = selectedProduct || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors[0] ? product.colors[0].name : ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes[0] ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews'>('details');
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [helpfulVotes, setHelpfulVotes] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      setActiveImageIndex(0);
      setSelectedColor(product.colors && product.colors[0] ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes[0] ? product.sizes[0] : '');
      setQuantity(1);
    }
  }, [product?.id]);

  const activeColorObj = product.colors?.find((c) => c.name === selectedColor) || product.colors?.[0];
  const activeColorImage = activeColorObj?.image || product.image;

  // Gallery images with active color variant image at the front
  const galleryImages = Array.from(
    new Set([activeColorImage, ...(product.gallery || []), product.image])
  ).filter(Boolean);

  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard left/right arrow navigation for slideshow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (galleryImages.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Escape') {
        setIsZoomModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [galleryImages.length]);

  const isSaved = isInWishlist(product.id);

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const today = new Date();
      const deliveryDate = new Date(today.setDate(today.getDate() + 3));
      const formatted = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
      setDeliveryInfo(`Express Delivery by ${formatted} to PIN ${pincode}`);
    } else {
      setDeliveryInfo('Please enter a valid 6-digit Indian PIN code');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareProduct = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard! Share it with your friends.');
    } else {
      showToast('Link ready to share!');
    }
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    showToast('Thank you for your feedback!', 'info');
  };

  // Combine product reviews with any user-submitted reviews
  const defaultReviews = [
    {
      id: 'rev-def-1',
      productId: product.id,
      name: 'Ananya Sen',
      location: 'Mumbai, Maharashtra',
      rating: 5,
      title: 'Exquisite luster & heavy weight feel!',
      comment:
        'The quality exceeded my expectations! The gold tone is warm and natural, not fake brassy. Wore it to a wedding sangeet and received non-stop compliments.',
      date: 'Verified Buyer · 3 days ago',
      verifiedBuyer: true,
      helpfulCount: 14,
      image: product.image,
    },
    {
      id: 'rev-def-2',
      productId: product.id,
      name: 'Kavita Reddy',
      location: 'Bengaluru, Karnataka',
      rating: 5,
      title: 'Super fast delivery and flawless box',
      comment:
        'Super fast delivery to Bengaluru in 2 days. The packaging box is gorgeous and ready to gift. Anti-tarnish coating is 100% genuine.',
      date: 'Verified Buyer · 1 week ago',
      verifiedBuyer: true,
      helpfulCount: 9,
    },
    {
      id: 'rev-def-3',
      productId: product.id,
      name: 'Pooja Malhotra',
      location: 'New Delhi',
      rating: 4,
      title: 'Stunning design, looks international',
      comment:
        'Looks even better in person than in the photos. The clasp feels durable and secure. Highly recommend to everyone looking for affordable luxury.',
      date: 'Verified Buyer · 2 weeks ago',
      verifiedBuyer: true,
      helpfulCount: 5,
    },
  ];

  const allReviews = [...(product.reviewsList || []), ...defaultReviews];

  // Customer photos from reviews
  const customerPhotos = allReviews.map((r) => r.image).filter(Boolean) as string[];

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="w-full bg-[#fcfbfa] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <button
            onClick={() => setCurrentView('home')}
            className="hover:text-stone-900 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <button
            onClick={() => {
              setCurrentView('shop');
            }}
            className="hover:text-stone-900 transition-colors"
          >
            {product.category}
          </button>
          <ChevronRight className="w-3 h-3 text-stone-400" />
          <span className="text-stone-900 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        {/* Main Product Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-5 sm:p-8 rounded-xl border border-stone-200/60 shadow-xs">
          {/* Left Column: Gallery & Thumbnails */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border-2 transition-all cursor-pointer bg-stone-50 ${
                    activeImageIndex === idx
                      ? 'border-[#111111] shadow-xs'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Image with Amazon/Flipkart Slideshow Controls */}
            <div className="flex-1 flex flex-col">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-50 border border-stone-200/60 group select-none">
                <img
                  src={galleryImages[activeImageIndex] || product.image}
                  alt={product.name}
                  onClick={() => setIsZoomModalOpen(true)}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104 cursor-zoom-in"
                />

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-semibold px-2 py-0.5 rounded-xs leading-none shadow-xs uppercase tracking-wider z-10 ${
                      product.badge === 'New'
                        ? 'bg-[#E54F4F] text-white'
                        : 'bg-[#181818] text-white'
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Slideshow Arrow Buttons (Amazon & Flipkart Style) */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      aria-label="Previous Image"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-108 z-20 border border-stone-200/60"
                      title="Previous photo (←)"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="Next Image"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-stone-800 shadow-md flex items-center justify-center transition-all cursor-pointer opacity-85 hover:opacity-100 hover:scale-108 z-20 border border-stone-200/60"
                      title="Next photo (→)"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Top Right Actions: Zoom, Wishlist, Share */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                  <button
                    onClick={() => setIsZoomModalOpen(true)}
                    aria-label="Zoom Fullscreen"
                    title="Click to view high-res full picture"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all cursor-pointer text-stone-700 hover:text-black"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Wishlist"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSaved ? 'fill-[#E07A5F] text-[#E07A5F]' : 'text-stone-700'
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleShareProduct}
                    aria-label="Share"
                    title="Share link"
                    className="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-all cursor-pointer text-stone-700 hover:text-black"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Bar: Live Viewers + Image Counter */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                  <div className="bg-black/75 backdrop-blur-xs text-white text-[11px] py-1 px-2.5 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>18 people viewing right now</span>
                  </div>

                  {galleryImages.length > 1 && (
                    <div className="bg-black/75 backdrop-blur-xs text-white text-[11px] font-semibold py-1 px-2.5 rounded-full shadow-sm">
                      {activeImageIndex + 1} / {galleryImages.length}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Dots Indicator */}
              {galleryImages.length > 1 && (
                <div className="sm:hidden flex justify-center gap-1.5 pt-2.5">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        i === activeImageIndex ? 'w-6 bg-[#E07A5F]' : 'w-1.5 bg-stone-300'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Information, Pricing, Swatches & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase tracking-widest text-[#E07A5F] font-semibold text-[11px]">
                  {product.category} {product.subCategory ? `· ${product.subCategory}` : ''}
                </span>

                <button
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1 text-stone-700 hover:text-stone-900 cursor-pointer"
                >
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-xs ml-0.5">{product.rating}</span>
                  <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-stone-900 mt-2 leading-tight">
                {product.name}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#E54F4F] bg-rose-50 px-2 py-0.5 rounded-xs">
                  {product.discount}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-1">Inclusive of all Indian taxes and GST</p>

              {/* Stock Warning */}
              {product.stock <= 5 && (
                <div className="mt-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200/80 px-3 py-1.5 rounded-md inline-block">
                  ⚠️ High demand: Only {product.stock} units left in stock!
                </div>
              )}

              {/* Interactive Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-5 pt-4 border-t border-stone-200">
                  <div className="flex items-center justify-between text-xs mb-2.5">
                    <span className="font-semibold text-stone-900">
                      Colour Variant:{' '}
                      <span className="font-normal text-stone-600">{selectedColor}</span>
                    </span>
                    <span className="text-stone-400 text-[11px]">
                      {product.colors.length} shades available
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {product.colors.map((color, idx) => {
                      const isSelected = selectedColor === color.name;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setSelectedColor(color.name);
                            setActiveImageIndex(0);
                          }}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'border-stone-900 bg-stone-50 font-semibold shadow-xs ring-1 ring-stone-900'
                              : 'border-stone-200 hover:border-stone-400 bg-white text-stone-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.name}</span>
                          {color.image && (
                            <img
                              src={color.image}
                              alt={color.name}
                              className="w-4 h-4 rounded-full object-cover ml-0.5 border border-stone-300"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Selector & Guide */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-stone-900">Select Size:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSizeGuideCategory(product.category);
                        setIsSizeGuideOpen(true);
                      }}
                      className="text-[#E07A5F] hover:underline flex items-center gap-1 cursor-pointer font-medium text-xs"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Size Guide & Fit Chart</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setSelectedSize(sz)}
                        className={`min-w-10 h-9 px-3 rounded-md border text-xs font-semibold cursor-pointer transition-all ${
                          selectedSize === sz
                            ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                            : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-900">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-md overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-6 space-y-2.5">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-[#111111] hover:bg-black text-white text-xs font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs uppercase tracking-wider"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-[#E07A5F] hover:bg-[#d46a4e] text-white text-xs font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs uppercase tracking-wider"
                  >
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* Share & Earn 100 FOAXX Coins Button */}
                <button
                  type="button"
                  onClick={() => openShareModal(product)}
                  className="w-full bg-gradient-to-r from-stone-950 via-[#1f1b17] to-stone-950 hover:from-black hover:to-[#2b251f] text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold py-2.5 px-3 rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-[#d4af37]" />
                  <span>Share Product & Earn 100 Coins (WhatsApp · Save Card)</span>
                  <span className="text-[10px] bg-[#d4af37]/20 text-[#d4af37] px-1.5 py-0.5 rounded border border-[#d4af37]/40">
                    +₹25
                  </span>
                </button>
              </div>

              {/* Pincode & Delivery Checker */}
              <div className="mt-5 p-3.5 bg-stone-50 rounded-lg border border-stone-200/70">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 mb-2">
                  <MapPin className="w-4 h-4 text-[#E07A5F]" />
                  <span>Check Delivery & Cash on Delivery Availability:</span>
                </div>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Enter 6-digit Indian PIN code"
                    className="flex-1 bg-white border border-stone-300 text-xs px-3 py-1.5 rounded-md focus:outline-none focus:border-stone-800"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 text-white text-xs font-medium px-4 py-1.5 rounded-md hover:bg-black transition-colors"
                  >
                    Check
                  </button>
                </form>
                {deliveryInfo && (
                  <p className="text-[11px] text-emerald-700 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{deliveryInfo}</span>
                  </p>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="mt-5 grid grid-cols-3 gap-2 py-3 border-y border-stone-200 text-center text-[10px] text-stone-600">
                <div className="flex flex-col items-center gap-1">
                  <RotateCcw className="w-4 h-4 text-stone-700" />
                  <span>7 Days Return</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Gem className="w-4 h-4 text-stone-700" />
                  <span>Anti-Tarnish Plating</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                  <span>Certified Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs: Description, Details & Specifications, Reviews */}
        <div className="mt-10 bg-white rounded-xl border border-stone-200/60 p-6 sm:p-8">
          <div className="flex border-b border-stone-200 gap-6 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'details'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Description & Craftsmanship
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'specs'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Material & Care
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-semibold tracking-wide transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === 'reviews'
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Customer Reviews ({allReviews.length})
            </button>
          </div>

          <div className="py-6">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-stone-700 leading-relaxed">
                <p>{product.description}</p>
                <div className="mt-4">
                  <h4 className="font-semibold text-stone-900 mb-2">Key Highlights:</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-stone-600">
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl text-xs sm:text-sm">
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-xs">Primary Material</span>
                  <span className="font-medium text-stone-800">{product.material}</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-xs">Origin</span>
                  <span className="font-medium text-stone-800">Handcrafted in India</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-xs">Plating Guarantee</span>
                  <span className="font-medium text-stone-800">1 Year Anti-Tarnish Warranty</span>
                </div>
                <div className="p-3 bg-stone-50 rounded-lg">
                  <span className="text-stone-400 block text-xs">Packaging</span>
                  <span className="font-medium text-stone-800">FOAXX Signature Keepsake Box</span>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Rating Breakdown & Write Review button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-6 bg-stone-50 rounded-xl border border-stone-200/60">
                  <div className="md:col-span-4 text-center md:text-left md:border-r border-stone-200 md:pr-6">
                    <span className="text-4xl font-serif-luxury font-bold text-stone-900">
                      {product.rating}
                    </span>
                    <div className="flex text-amber-400 justify-center md:justify-start mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Based on {allReviews.length} verified ratings
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                      98% recommend this piece
                    </p>
                  </div>

                  {/* Rating distribution bar chart */}
                  <div className="md:col-span-5 space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px]">5 Stars</span>
                      <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[85%]" />
                      </div>
                      <span className="w-8 text-[11px] text-right font-semibold">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px]">4 Stars</span>
                      <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[12%]" />
                      </div>
                      <span className="w-8 text-[11px] text-right font-semibold">12%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px]">3 Stars</span>
                      <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[3%]" />
                      </div>
                      <span className="w-8 text-[11px] text-right font-semibold">3%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px]">2 Stars</span>
                      <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[0%]" />
                      </div>
                      <span className="w-8 text-[11px] text-right">0%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-12 text-[11px]">1 Star</span>
                      <div className="flex-1 bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[0%]" />
                      </div>
                      <span className="w-8 text-[11px] text-right">0%</span>
                    </div>
                  </div>

                  {/* Write a Review Button */}
                  <div className="md:col-span-3 flex flex-col justify-center items-center md:items-end">
                    <p className="text-xs text-stone-600 mb-2.5 text-center md:text-right">
                      Have you styled or worn this item?
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2.5 rounded-md transition-colors shadow-xs cursor-pointer tracking-wider uppercase"
                    >
                      Write a Review
                    </button>
                  </div>
                </div>

                {/* Photos from Customers */}
                {customerPhotos.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">
                      Customer Photos ({customerPhotos.length})
                    </h4>
                    <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-2">
                      {customerPhotos.map((img, i) => (
                        <div
                          key={i}
                          className="w-20 h-24 rounded-lg overflow-hidden border border-stone-200 shrink-0 bg-stone-100"
                        >
                          <img
                            src={img}
                            alt={`Customer wear ${i}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-4 pt-2">
                  {allReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 bg-white rounded-lg border border-stone-100 shadow-2xs text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-stone-900 text-sm">{rev.name}</span>
                          {rev.location && (
                            <span className="text-stone-400 text-[11px] ml-1.5">
                              · {rev.location}
                            </span>
                          )}
                        </div>
                        <span className="text-stone-400 text-[10px]">{rev.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                        {rev.verifiedBuyer && (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-xs flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Verified Purchaser
                          </span>
                        )}
                      </div>

                      <h5 className="font-semibold text-stone-900 text-xs">{rev.title}</h5>
                      <p className="text-stone-600 leading-relaxed">{rev.comment}</p>

                      {rev.image && (
                        <div className="pt-1">
                          <img
                            src={rev.image}
                            alt="Review attachment"
                            className="w-20 h-24 object-cover rounded-md border border-stone-200"
                          />
                        </div>
                      )}

                      <div className="pt-2 flex items-center gap-3 text-[11px] text-stone-500">
                        <button
                          type="button"
                          onClick={() => handleHelpfulClick(rev.id)}
                          className="flex items-center gap-1 hover:text-stone-900 transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({rev.helpfulCount + (helpfulVotes[rev.id] || 0)})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Products Component */}
        <RecentlyViewed currentProductId={product.id} limit={4} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg sm:text-xl font-serif-luxury font-medium text-stone-900 mb-4">
              Complete the Look
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => {
                    setSelectedProduct(rel);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer bg-white p-2.5 rounded-lg border border-stone-200/50 hover:shadow-sm transition-shadow"
                >
                  <div className="aspect-[4/5] rounded-md overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="text-xs font-medium text-stone-800 mt-2 truncate group-hover:text-black">
                    {rel.name}
                  </h4>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xs font-bold text-stone-900">
                      ₹{rel.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-stone-400 line-through">
                      ₹{rel.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      <WriteReviewModal
        product={product}
        isOpen={isWriteReviewOpen}
        onClose={() => setIsWriteReviewOpen(false)}
      />

      {/* Fullscreen High-Resolution Zoom Lightbox Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-30"
            title="Close Zoom (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left / Right arrows inside lightbox */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-stone-900 flex items-center justify-center transition-all cursor-pointer z-30"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 hover:bg-white text-stone-900 flex items-center justify-center transition-all cursor-pointer z-30"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[activeImageIndex] || product.image}
              alt={product.name}
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="mt-3 text-white/80 text-xs flex items-center gap-3">
              <span>{product.name}</span>
              <span>•</span>
              <span>Image {activeImageIndex + 1} of {galleryImages.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
