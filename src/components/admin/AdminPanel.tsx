import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit2,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  Upload,
  Users,
  X,
  Zap,
  Flame,
  Gift,
  Percent,
  Bell,
  Mail,
  Shield,
  ShieldCheck,
  CheckSquare,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Coupon, CustomerReview, FaqItem, FestivePickCard, FestivePicksConfig, FlashDealOffer, FlashDealsConfig, OccasionSaleBannerConfig, OccasionType, Order, Product } from '../../types';
import { OCCASION_PRESETS, INITIAL_OCCASION_SALE } from '../../data/initialData';
import { ImageUploader } from './ImageUploader';
import { MultiImageUploader } from './MultiImageUploader';
import { ColorVariantEditor } from './ColorVariantEditor';
import { HomepageHub } from './HomepageHub';
import { NotificationMailStudio } from './NotificationMailStudio';
import { ManagerAccessControl } from './ManagerAccessControl';
import { TaskManagerHub } from './TaskManagerHub';
import { LogisticsHub } from './LogisticsHub';


export const AdminPanel: React.FC = () => {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    homepageConfig,
    updateHomepageConfig,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    updateFlashDealsConfig,
    addFlashDeal,
    updateFlashDeal,
    deleteFlashDeal,
    updateFestivePicksConfig,
    addFestivePickCard,
    updateFestivePickCard,
    deleteFestivePickCard,
    updateOccasionSaleBanner,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    sentCampaignLogs,
    managers,
    tasks,
    resetToDefaults,
    setCurrentView,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'tasks'
    | 'products'
    | 'deals'
    | 'festive'
    | 'occasion'
    | 'shop_by_occasion'
    | 'shop_the_look'
    | 'homepage'
    | 'reviews'
    | 'faqs'
    | 'orders'
    | 'coupons'
    | 'notifications'
    | 'managers'
  >('overview');

  const [homepageSubTab, setHomepageSubTab] = useState<
    | 'all'
    | 'hero'
    | 'occasion'
    | 'announcements'
    | 'deals'
    | 'festive'
    | 'shop_by_occasion'
    | 'shop_the_look'
    | 'reviews'
    | 'faqs'
  >('all');

  // Occasion Sale Banner form state
  const [occasionForm, setOccasionForm] = useState<OccasionSaleBannerConfig>(() => {
    return homepageConfig.occasionSaleBanner || INITIAL_OCCASION_SALE;
  });

  // Product modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Jewellery',
    price: 1299,
    originalPrice: 1899,
    discount: '31% OFF',
    badge: 'New',
    image: '/assets/extracted/cat_jewellery.png',
    gallery: ['/assets/extracted/cat_jewellery.png'],
    colors: [
      { name: 'Warm Gold', hex: '#D4AF37', image: '/assets/extracted/cat_jewellery.png' },
      { name: 'Rose Gold', hex: '#B76E79', image: '/assets/extracted/prod_charm_necklace.png' },
      { name: 'Silver Rhodium', hex: '#E5E4E2', image: '/assets/extracted/cat_necklaces.png' },
    ],
    description: 'Luxury handcrafted jewellery designed for statement elegance.',
    material: '18K Gold Plated Brass & Cubic Zirconia',
    stock: 20,
    rating: 5.0,
    reviewCount: 1,
  });

  // Review modals
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<CustomerReview | null>(null);
  const [newReviewForm, setNewReviewForm] = useState<Partial<CustomerReview>>({
    name: '',
    location: 'Mumbai, Maharashtra',
    image: '/assets/extracted/prod_pearl_earrings.png',
    quote: '',
    rating: 5,
    productName: 'Pearl Drop Earrings',
    productId: 'prod-2',
    date: 'Verified Buyer · Today',
  });

  // FAQ modals
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [newFaqForm, setNewFaqForm] = useState<{ question: string; answer: string }>({
    question: '',
    answer: '',
  });

  // Flash Deal modals & state
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<FlashDealOffer | null>(null);
  const [dealHoursInput, setDealHoursInput] = useState<number>(2);
  const [dealMinutesInput, setDealMinutesInput] = useState<number>(10);
  const [newDealForm, setNewDealForm] = useState<Partial<FlashDealOffer>>({
    prefix: 'UP TO',
    discountText: '50% OFF',
    title: 'Party Ready Co-ords',
    subtitle: 'Limited Drop · Trending',
    promoCode: 'FESTIVE50',
    image: '/assets/extracted/prod_floral_coord.png',
    targetCategory: 'clothing',
    themeStyle: 'sunset',
    badgeText: 'FLASH DEAL ⚡',
    isActive: true,
  });

  // Festive Picks modals & state
  const [isAddingFestiveCard, setIsAddingFestiveCard] = useState(false);
  const [editingFestiveCard, setEditingFestiveCard] = useState<FestivePickCard | null>(null);
  const [newFestiveCardForm, setNewFestiveCardForm] = useState<Partial<FestivePickCard>>({
    badge: 'FOAXX ATELIER',
    headline: "TARA'S FESTIVE PICKS",
    offerText: 'Up To 40% Off',
    subtitle: 'On Jewellery Bestsellers',
    image: '/assets/extracted/banner_festive_clean.png',
    buttonText: 'Shop Now →',
    productId: products[0]?.id || 'prod-1',
    targetCategory: 'jewellery',
    themeStyle: 'rose',
    isActive: true,
  });

  // Promo Code / Coupon Creation State
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState<Partial<Coupon>>({
    code: '',
    discountPercent: 20,
    maxDiscount: 1500,
    minOrderValue: 999,
    description: 'Special Festive Discount across selected styles',
    category: 'All',
    validityType: 'indefinite',
    expiryDate: '',
    isActive: true,
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code || !newCouponForm.discountPercent) {
      showToast('Please specify a promo code and discount percentage', 'error');
      return;
    }

    const cleanCode = newCouponForm.code.trim().toUpperCase();
    if (coupons.some((c) => c.code.toUpperCase() === cleanCode)) {
      showToast(`Promo code "${cleanCode}" already exists`, 'error');
      return;
    }

    const createdCoupon: Coupon = {
      code: cleanCode,
      discountPercent: Number(newCouponForm.discountPercent),
      maxDiscount: newCouponForm.maxDiscount ? Number(newCouponForm.maxDiscount) : undefined,
      minOrderValue: Number(newCouponForm.minOrderValue || 0),
      description: newCouponForm.description || `Exclusive ${newCouponForm.discountPercent}% OFF privilege`,
      isActive: newCouponForm.isActive !== false,
      category: newCouponForm.category || 'All',
      validityType: newCouponForm.validityType || 'indefinite',
      expiryDate: newCouponForm.validityType === 'dated' ? newCouponForm.expiryDate : undefined,
      createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };

    addCoupon(createdCoupon);
    setIsAddingCoupon(false);
    setNewCouponForm({
      code: '',
      discountPercent: 20,
      maxDiscount: 1500,
      minOrderValue: 999,
      description: 'Special Festive Discount across selected styles',
      category: 'All',
      validityType: 'indefinite',
      expiryDate: '',
      isActive: true,
    });
  };

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  // Product Handlers
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct);
      setEditingProduct(null);
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name) return;

    const finalGallery =
      newProductForm.gallery && newProductForm.gallery.length > 0
        ? newProductForm.gallery
        : [newProductForm.image || '/assets/extracted/cat_jewellery.png'];

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name || 'Untitled Piece',
      category: newProductForm.category || 'Jewellery',
      price: Number(newProductForm.price) || 999,
      originalPrice: Number(newProductForm.originalPrice) || 1499,
      discount: newProductForm.discount || '30% OFF',
      badge: (newProductForm.badge as any) || 'New',
      image: finalGallery[0] || '/assets/extracted/cat_jewellery.png',
      gallery: finalGallery,
      colors:
        newProductForm.colors && newProductForm.colors.length > 0
          ? newProductForm.colors
          : [{ name: 'Warm Gold', hex: '#D4AF37' }],
      description: newProductForm.description || '',
      details: ['Handcrafted luxury finish', 'Anti-tarnish electroplating'],
      material: newProductForm.material || 'Gold Plated Brass',
      stock: Number(newProductForm.stock) || 15,
      rating: 5.0,
      reviewCount: 1,
    };
    addProduct(newProd);
    setIsAddingProduct(false);
    setNewProductForm({
      name: '',
      category: 'Jewellery',
      price: 1299,
      originalPrice: 1899,
      discount: '31% OFF',
      badge: 'New',
      image: '/assets/extracted/cat_jewellery.png',
      gallery: ['/assets/extracted/cat_jewellery.png'],
      colors: [
        { name: 'Warm Gold', hex: '#D4AF37', image: '/assets/extracted/cat_jewellery.png' },
        { name: 'Rose Gold', hex: '#B76E79', image: '/assets/extracted/prod_charm_necklace.png' },
        { name: 'Silver Rhodium', hex: '#E5E4E2', image: '/assets/extracted/cat_necklaces.png' },
      ],
      description: '',
      material: '18K Gold Plated Brass',
      stock: 20,
    });
  };

  // Review Handlers
  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.quote) return;
    const rev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newReviewForm.name,
      location: newReviewForm.location || 'India',
      image: newReviewForm.image || '/assets/extracted/prod_pearl_earrings.png',
      quote: newReviewForm.quote,
      rating: Number(newReviewForm.rating) || 5,
      productName: newReviewForm.productName || 'FOAXX Jewellery',
      productId: newReviewForm.productId || 'prod-1',
      date: 'Verified Buyer · Today',
    };
    addReview(rev);
    setIsAddingReview(false);
    setNewReviewForm({
      name: '',
      location: 'Mumbai, Maharashtra',
      image: '/assets/extracted/prod_pearl_earrings.png',
      quote: '',
      rating: 5,
      productName: 'Pearl Drop Earrings',
      productId: 'prod-2',
      date: 'Verified Buyer · Today',
    });
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateReview(editingReview);
      setEditingReview(null);
    }
  };

  // FAQ Handlers
  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqForm.question || !newFaqForm.answer) return;
    addFaq({
      id: `faq-${Date.now()}`,
      question: newFaqForm.question,
      answer: newFaqForm.answer,
    });
    setIsAddingFaq(false);
    setNewFaqForm({ question: '', answer: '' });
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaq(editingFaq);
      setEditingFaq(null);
    }
  };

  // Flash Deal Handlers
  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealForm.discountText || !newDealForm.promoCode) {
      showToast('Please enter both discount text and promo code', 'error');
      return;
    }
    const deal: FlashDealOffer = {
      id: `deal-${Date.now()}`,
      prefix: newDealForm.prefix || 'UP TO',
      discountText: newDealForm.discountText,
      title: newDealForm.title || 'Special Collection Deal',
      subtitle: newDealForm.subtitle || '',
      promoCode: (newDealForm.promoCode || 'FOAXX').toUpperCase().trim(),
      image: newDealForm.image || '/assets/extracted/cat_jewellery.png',
      targetCategory: newDealForm.targetCategory || 'jewellery',
      themeStyle: newDealForm.themeStyle || 'sunset',
      badgeText: newDealForm.badgeText || '⚡ DEAL',
      isActive: newDealForm.isActive !== false,
    };
    addFlashDeal(deal);
    setIsAddingDeal(false);
    setNewDealForm({
      prefix: 'UP TO',
      discountText: '50% OFF',
      title: 'Party Ready Co-ords',
      subtitle: 'Limited Drop · Trending',
      promoCode: 'FESTIVE50',
      image: '/assets/extracted/prod_floral_coord.png',
      targetCategory: 'clothing',
      themeStyle: 'sunset',
      badgeText: 'FLASH DEAL ⚡',
      isActive: true,
    });
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      updateFlashDeal(editingDeal);
      setEditingDeal(null);
    }
  };

  const handleUpdateTimerFromInputs = () => {
    const totalMs = (dealHoursInput * 3600 + dealMinutesInput * 60) * 1000;
    const target = new Date(Date.now() + totalMs).toISOString();
    const current = homepageConfig.flashDeals || {
      enabled: true,
      sectionTitle: 'LIMITED TIME DEALS',
      badgeText: '⚡ FLASH SALE',
      targetEndTime: target,
      offers: [],
    };
    updateFlashDealsConfig({ ...current, targetEndTime: target });
  };

  // Festive Picks Handlers
  const handleCreateFestiveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFestiveCardForm.headline || !newFestiveCardForm.offerText) {
      showToast('Please enter both headline and offer text', 'error');
      return;
    }
    const card: FestivePickCard = {
      id: `festive-${Date.now()}`,
      badge: newFestiveCardForm.badge || 'FOAXX ATELIER',
      headline: newFestiveCardForm.headline,
      offerText: newFestiveCardForm.offerText,
      subtitle: newFestiveCardForm.subtitle || 'On Festive Collection',
      image: newFestiveCardForm.image || '/assets/extracted/banner_festive_clean.png',
      buttonText: newFestiveCardForm.buttonText || 'Shop Now →',
      productId: newFestiveCardForm.productId,
      targetCategory: newFestiveCardForm.targetCategory || 'jewellery',
      themeStyle: newFestiveCardForm.themeStyle || 'rose',
      isActive: newFestiveCardForm.isActive !== false,
    };
    addFestivePickCard(card);
    setIsAddingFestiveCard(false);
    setNewFestiveCardForm({
      badge: 'FOAXX ATELIER',
      headline: "TARA'S FESTIVE PICKS",
      offerText: 'Up To 40% Off',
      subtitle: 'On Jewellery Bestsellers',
      image: '/assets/extracted/banner_festive_clean.png',
      buttonText: 'Shop Now →',
      productId: products[0]?.id || 'prod-1',
      targetCategory: 'jewellery',
      themeStyle: 'rose',
      isActive: true,
    });
  };

  const handleSaveFestiveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFestiveCard) {
      updateFestivePickCard(editingFestiveCard);
      setEditingFestiveCard(null);
    }
  };

  return (
    <div className="w-full bg-[#f8f7f5] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-1.5 rounded-md bg-white border border-stone-300 text-stone-700 hover:text-black transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-xl font-bold tracking-[0.2em] text-stone-900">
                  FOAXX
                </span>
                <span className="bg-stone-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage products with image uploads, homepage banners, customer reviews & star ratings, FAQs, and order fulfilment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={resetToDefaults}
              className="bg-white border border-stone-300 text-stone-700 hover:text-rose-600 hover:border-rose-300 px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Reference Data</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-stone-900 hover:bg-black text-white px-4 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Back to Storefront</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex border-b border-stone-200 mt-6 gap-6 text-xs font-semibold overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-amber-600" />
            <span>My Tasks & Delegation</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
              {tasks.length}
            </span>
            {tasks.some((t) => t.status === 'blocked') && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Manager tasks need answer" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'products'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('homepage');
              setHomepageSubTab('all');
            }}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'homepage' || activeTab === 'deals' || activeTab === 'festive' || activeTab === 'occasion' || activeTab === 'reviews' || activeTab === 'faqs'
                ? 'border-amber-600 text-amber-700 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Homepage Manager</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Orders & Logistics ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'coupons'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promotions & Coupons ({coupons.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Broadcast & Mail Studio</span>
            {sentCampaignLogs.length > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full">
                {sentCampaignLogs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'managers'
                ? 'border-amber-600 text-amber-800 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Manager Roles & Duties</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">
              {managers.length}
            </span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="pt-8 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
                <span className="text-stone-400 text-xs font-medium block">Total Store Revenue</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-stone-900">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-semibold text-emerald-600">+18.4%</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Live simulated metrics</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
                <span className="text-stone-400 text-xs font-medium block">Total Orders Processed</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-stone-900">{totalOrders}</span>
                  <span className="text-xs text-stone-500">orders</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">100% fulfilment rate</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
                <span className="text-stone-400 text-xs font-medium block">Average Order Value (AOV)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-stone-900">
                    ₹{avgOrderValue.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">Luxury jewellery basket</span>
              </div>

              <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs">
                <span className="text-stone-400 text-xs font-medium block">Low Stock Alert</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-2xl font-bold text-amber-600">{lowStockCount}</span>
                  <span className="text-xs text-stone-500">items</span>
                </div>
                <span className="text-[10px] text-amber-700 mt-1 block">Stock ≤ 10 units</span>
              </div>
            </div>

            {/* Executive Task & Delegation Overview Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      Task Command & Manager Delegation
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {tasks.filter((t) => t.type === 'admin_self' && t.status !== 'completed').length} personal deadlines · {tasks.filter((t) => t.type === 'manager_assigned' && t.status !== 'completed').length} delegated manager tasks
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('tasks')}
                  className="text-xs text-amber-800 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
                >
                  <span>Open Task Command Hub →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Personal Tasks Quick Peek */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">My Priority Tasks</span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      {tasks.filter((t) => t.type === 'admin_self' && t.status !== 'completed').length} pending
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {tasks.filter((t) => t.type === 'admin_self').slice(0, 2).map((t) => (
                      <div key={t.id} className="text-xs flex items-center justify-between bg-white p-2.5 rounded-lg border border-stone-200/70">
                        <span className="truncate max-w-[200px] sm:max-w-[260px] font-medium text-stone-900">{t.title}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${t.priority === 'urgent' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'}`}>
                          {t.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manager Delegated Tasks Quick Peek */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-800">Manager Delegated Status</span>
                    {tasks.some((t) => t.type === 'manager_assigned' && t.status === 'blocked') && (
                      <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.2 rounded-full font-bold animate-pulse">
                        ⚠️ Action Required
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {tasks.filter((t) => t.type === 'manager_assigned').slice(0, 2).map((t) => (
                      <div key={t.id} className="text-xs flex items-center justify-between bg-white p-2.5 rounded-lg border border-stone-200/70">
                        <div className="truncate max-w-[180px] sm:max-w-[240px]">
                          <span className="font-medium text-stone-900 block truncate">{t.title}</span>
                          <span className="text-[10px] text-amber-700 font-semibold">{t.assignedToManagerName}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${t.status === 'blocked' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'}`}>
                          {t.status === 'blocked' ? 'Needs Help' : t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <h3 className="text-sm font-semibold text-stone-900">Recent Customer Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-[#E07A5F] hover:underline font-semibold cursor-pointer"
                >
                  Manage All Orders →
                </button>
              </div>

              <div className="divide-y divide-stone-100 text-xs mt-2">
                {orders.slice(0, 3).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900">{ord.orderNumber}</span>
                      <span className="text-stone-400 ml-2">({ord.date})</span>
                      <p className="text-stone-500 text-[11px] mt-0.5">
                        {ord.shippingAddress.name} · {ord.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-900">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] font-semibold text-stone-600">
                        {ord.shippingStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT WITH IMAGE UPLOADS */}
        {activeTab === 'products' && (
          <div className="pt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-stone-900">Product Catalog & Inventory</h3>
                <p className="text-xs text-stone-500">
                  Upload product photos, edit prices, manage stock levels, and set Bestseller/New badges.
                </p>
              </div>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Add New Product Form Modal */}
            {isAddingProduct && (
              <div className="bg-white rounded-xl border border-stone-300 p-6 shadow-xl text-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h4 className="text-sm font-semibold text-stone-900">
                    Create New Product with Image Upload
                  </h4>
                  <button
                    onClick={() => setIsAddingProduct(false)}
                    className="text-stone-400 hover:text-black p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Multi-Image Gallery Uploader for Slideshow */}
                  <div className="sm:col-span-3">
                    <MultiImageUploader
                      label="Product Photos Gallery (Amazon & Flipkart style slideshow) *"
                      images={
                        newProductForm.gallery && newProductForm.gallery.length > 0
                          ? newProductForm.gallery
                          : newProductForm.image
                          ? [newProductForm.image]
                          : []
                      }
                      onChange={(imgs) =>
                        setNewProductForm({
                          ...newProductForm,
                          gallery: imgs,
                          image: imgs[0] || '',
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      placeholder="e.g. Kundan Drop Earrings"
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Category *</label>
                    <select
                      value={newProductForm.category}
                      onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    >
                      {[
                        'Jewellery',
                        'Earrings',
                        'Necklaces',
                        'Rings',
                        'Clothing',
                        'Dresses',
                        'Bags',
                        'Footwear',
                        'Accessories',
                        'Gifting',
                      ].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Badge</label>
                    <select
                      value={newProductForm.badge || 'New'}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, badge: e.target.value as any })
                      }
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    >
                      <option value="New">New</option>
                      <option value="Bestseller">Bestseller</option>
                      <option value="">None</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProductForm.price}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, price: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      value={newProductForm.originalPrice}
                      onChange={(e) =>
                        setNewProductForm({
                          ...newProductForm,
                          originalPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Stock Units</label>
                    <input
                      type="number"
                      value={newProductForm.stock}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })
                      }
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    />
                  </div>

                  {/* Color Variants Editor */}
                  <div className="sm:col-span-3">
                    <ColorVariantEditor
                      colors={newProductForm.colors || []}
                      onChange={(cols) => setNewProductForm({ ...newProductForm, colors: cols })}
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-stone-600 font-medium mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newProductForm.description}
                      onChange={(e) =>
                        setNewProductForm({ ...newProductForm, description: e.target.value })
                      }
                      placeholder="Product craftsmanship, styling details..."
                      className="w-full bg-white border border-stone-300 rounded-md p-2"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end gap-2 pt-2 border-t border-stone-200">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 border border-stone-300 rounded-md hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-stone-900 text-white font-semibold px-5 py-2 rounded-md hover:bg-black cursor-pointer"
                    >
                      Publish Product
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Product Table */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3.5">Product Photo</th>
                      <th className="p-3.5">Name</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Badge</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="p-3.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-14 object-cover rounded-md bg-stone-100 shrink-0 border border-stone-200"
                          />
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-stone-900 block">{p.name}</span>
                          {p.colors && p.colors.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {p.colors.map((c, i) => (
                                <div
                                  key={i}
                                  className="inline-flex items-center gap-1 bg-stone-100 rounded px-1.5 py-0.5 border border-stone-200"
                                  title={`${c.name} (${c.hex})`}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full border border-black/15 shrink-0"
                                    style={{ backgroundColor: c.hex }}
                                  />
                                  <span className="text-[10px] text-stone-700 font-medium">{c.name}</span>
                                  {c.image && (
                                    <img
                                      src={c.image}
                                      alt={c.name}
                                      className="w-3.5 h-3.5 rounded object-cover border border-stone-300 ml-0.5"
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-stone-900">
                          ₹{p.price.toLocaleString('en-IN')}
                          <span className="block text-[10px] text-stone-400 line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`font-semibold ${
                              p.stock <= 10 ? 'text-amber-600' : 'text-stone-700'
                            }`}
                          >
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3.5">
                          {p.badge ? (
                            <span
                              className={`text-[9px] font-semibold px-2 py-0.5 rounded-xs leading-none uppercase ${
                                p.badge === 'New'
                                  ? 'bg-[#E54F4F] text-white'
                                  : 'bg-stone-900 text-white'
                              }`}
                            >
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[10px]">None</span>
                          )}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="p-1.5 hover:bg-stone-200 rounded text-stone-700 cursor-pointer"
                            title="Edit & Change Photo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 hover:bg-rose-100 rounded text-rose-600 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Edit Product Modal with Image Uploader */}
            {editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl max-w-lg w-full p-6 text-xs space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                    <h4 className="text-sm font-semibold text-stone-900">
                      Edit Product: {editingProduct.name}
                    </h4>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="text-stone-400 hover:text-black p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="space-y-4">
                    {/* Multi-Image Gallery Uploader for Slideshow */}
                    <div>
                      <MultiImageUploader
                        label="Manage Product Slideshow Photos (Amazon & Flipkart style)"
                        images={
                          editingProduct.gallery && editingProduct.gallery.length > 0
                            ? editingProduct.gallery
                            : editingProduct.image
                            ? [editingProduct.image]
                            : []
                        }
                        onChange={(imgs) =>
                          setEditingProduct({
                            ...editingProduct,
                            gallery: imgs,
                            image: imgs[0] || '',
                          })
                        }
                      />
                    </div>

                    {/* Color Variants Editor */}
                    <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                      <ColorVariantEditor
                        colors={editingProduct.colors || []}
                        onChange={(colors) =>
                          setEditingProduct({ ...editingProduct, colors })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Title</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, name: e.target.value })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-md p-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">
                          Selling Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.price}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              price: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-50 border border-stone-300 rounded-md p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">
                          Original Price (₹)
                        </label>
                        <input
                          type="number"
                          value={editingProduct.originalPrice}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              originalPrice: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-50 border border-stone-300 rounded-md p-2"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Stock Units</label>
                        <input
                          type="number"
                          value={editingProduct.stock}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              stock: Number(e.target.value),
                            })
                          }
                          className="w-full bg-stone-50 border border-stone-300 rounded-md p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-600 mb-1 font-medium">Badge</label>
                        <select
                          value={editingProduct.badge || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              badge: (e.target.value as any) || null,
                            })
                          }
                          className="w-full bg-stone-50 border border-stone-300 rounded-md p-2"
                        >
                          <option value="New">New</option>
                          <option value="Bestseller">Bestseller</option>
                          <option value="">None</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Description</label>
                      <textarea
                        rows={2}
                        value={editingProduct.description}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-stone-50 border border-stone-300 rounded-md p-2"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-4 py-2 border border-stone-300 rounded-md cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-stone-900 text-white font-semibold px-5 py-2 rounded-md hover:bg-black cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UNIFIED HOMEPAGE HUB */}
        {(activeTab === 'homepage' ||
          activeTab === 'deals' ||
          activeTab === 'festive' ||
          activeTab === 'occasion' ||
          activeTab === 'shop_by_occasion' ||
          activeTab === 'shop_the_look' ||
          activeTab === 'reviews' ||
          activeTab === 'faqs') && (
          <HomepageHub initialSubTab={homepageSubTab} />
        )}

        {/* TAB 6: LOGISTICS, COURIER & ORDER FULFILMENT */}
        {activeTab === 'orders' && (
          <div className="pt-8">
            <LogisticsHub initialFilter="all" />
          </div>
        )}

        {/* TAB 7: PROMOTIONS & PROMO CODES */}
        {activeTab === 'coupons' && (
          <div className="pt-8 space-y-8 max-w-4xl">
            {/* Header with Add Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-stone-900">Promo Codes & Discounts</h3>
                  <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                    {coupons.length} Promo Codes
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Create category-specific or storewide promo codes. Set indefinite validity (valid until you pause/delete) or specific calendar expiry dates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingCoupon(!isAddingCoupon)}
                className="bg-stone-900 hover:bg-black text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingCoupon ? 'Close Form' : 'Create Promo Code'}</span>
              </button>
            </div>

            {/* Create Promo Code Form (Collapsible/Drawer) */}
            {isAddingCoupon && (
              <form
                onSubmit={handleCreateCoupon}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-md space-y-4 animate-fadeIn"
              >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#E07A5F]" />
                    <span>Generate New Promo Code</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsAddingCoupon(false)}
                    className="p-1 text-stone-400 hover:text-stone-800 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Promo Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JEWEL25 or FOAXXVIP"
                      value={newCouponForm.code || ''}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, code: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md font-mono font-bold text-stone-900 uppercase focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Discount Percentage (%) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={90}
                      placeholder="e.g. 20"
                      value={newCouponForm.discountPercent || ''}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, discountPercent: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md font-bold text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Category Applicability
                    </label>
                    <select
                      value={newCouponForm.category || 'All'}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, category: e.target.value })}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
                    >
                      <option value="All">Overall / Storewide (All Products)</option>
                      <option value="Jewellery">Jewellery Collection Only</option>
                      <option value="Earrings">Earrings Only</option>
                      <option value="Necklaces">Necklaces Only</option>
                      <option value="Rings">Rings Only</option>
                      <option value="Clothing">Clothing / Co-ords Only</option>
                      <option value="Dresses">Dresses Only</option>
                      <option value="Bags">Bags Only</option>
                      <option value="Footwear">Footwear Only</option>
                      <option value="Accessories">Accessories Only</option>
                      <option value="Gifting">Gifting Only</option>
                    </select>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Choose &quot;Overall&quot; for all items or lock discount to a specific category.
                    </span>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Validity Period
                    </label>
                    <select
                      value={newCouponForm.validityType || 'indefinite'}
                      onChange={(e) =>
                        setNewCouponForm({
                          ...newCouponForm,
                          validityType: e.target.value as 'indefinite' | 'dated',
                        })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-800 focus:outline-none focus:border-stone-900 cursor-pointer"
                    >
                      <option value="indefinite">Valid Indefinitely (Until Admin pauses/deletes)</option>
                      <option value="dated">Valid Until Specific Expiry Date</option>
                    </select>
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Admin retains full power to toggle active status anytime.
                    </span>
                  </div>
                </div>

                {newCouponForm.validityType === 'dated' && (
                  <div className="text-xs">
                    <label className="block text-stone-700 font-semibold mb-1">
                      Expiry Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={newCouponForm.expiryDate || ''}
                      onChange={(e) => setNewCouponForm({ ...newCouponForm, expiryDate: e.target.value })}
                      className="w-full sm:w-1/2 px-3 py-2 bg-stone-50 border border-stone-300 rounded-md font-medium text-stone-900"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Minimum Order Value (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 999"
                      value={newCouponForm.minOrderValue || ''}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, minOrderValue: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Maximum Discount Cap (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 2000 (Leave blank for no limit)"
                      value={newCouponForm.maxDiscount || ''}
                      onChange={(e) =>
                        setNewCouponForm({ ...newCouponForm, maxDiscount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-stone-900"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-stone-700 font-semibold mb-1">
                    Customer Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Special 25% OFF on hand-finished jewellery and earrings"
                    value={newCouponForm.description || ''}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-md text-stone-900"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="newCouponActive"
                    checked={newCouponForm.isActive !== false}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900"
                  />
                  <label htmlFor="newCouponActive" className="text-stone-700 text-xs font-semibold">
                    Activate and enable promo code immediately
                  </label>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setIsAddingCoupon(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-md font-semibold text-xs hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 hover:bg-black text-white rounded-md font-bold text-xs shadow-md cursor-pointer"
                  >
                    Save & Publish Promo Code
                  </button>
                </div>
              </form>
            )}

            {/* List of Promo Codes */}
            <div className="space-y-3">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="bg-white p-5 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs hover:border-stone-300 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-stone-900 text-base bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                        {c.code}
                      </span>
                      <span className="text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md text-xs">
                        {c.discountPercent}% OFF
                      </span>

                      {/* Category Badge */}
                      <span className="bg-amber-50 text-amber-900 border border-amber-200/80 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                        {c.category && c.category !== 'All' ? `Exclusive to ${c.category}` : 'Storewide (All Categories)'}
                      </span>

                      {/* Validity Badge */}
                      {c.validityType === 'dated' && c.expiryDate ? (
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                          📅 Expires {c.expiryDate}
                        </span>
                      ) : (
                        <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                          <span>♾️ Indefinite Validity</span>
                        </span>
                      )}

                      {!c.isActive && (
                        <span className="text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                          Paused
                        </span>
                      )}
                    </div>

                    <p className="text-stone-600 font-medium text-xs mt-1">{c.description}</p>
                    <p className="text-[11px] text-stone-400">
                      Min Order: ₹{c.minOrderValue.toLocaleString('en-IN')} {c.maxDiscount ? `· Max Discount Cap: ₹${c.maxDiscount.toLocaleString('en-IN')}` : '· No Max Cap'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleCoupon(c.code)}
                      className={`px-3.5 py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer ${
                        c.isActive
                          ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {c.isActive ? 'Pause' : 'Activate'}
                    </button>

                    <button
                      onClick={() => deleteCoupon(c.code)}
                      className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Promo Code"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS & MAIL CAMPAIGN STUDIO */}
        {activeTab === 'notifications' && <NotificationMailStudio />}

        {/* TAB: TASK COMMAND & MANAGER DELEGATION */}
        {activeTab === 'tasks' && <TaskManagerHub />}

        {/* TAB 7: MANAGER ACCESS CONTROL & DUTY ASSIGNMENT */}
        {activeTab === 'managers' && <ManagerAccessControl />}

      </div>
    </div>
  );
};

