import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Flame,
  Gift,
  Clock,
  Plus,
  Edit2,
  Trash2,
  X,
  Zap,
  Tag,
  ShieldCheck,
  Star,
  HelpCircle,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  MoveUp,
  MoveDown,
  Play,
  Pause,
  Sliders,
  Layers,
  Eye,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  CustomerReview,
  FaqItem,
  FestivePickCard,
  FlashDealOffer,
  HeroCarouselSettings,
  HeroSlide,
  OccasionCardConfig,
  OccasionSaleBannerConfig,
  OccasionType,
  Product,
  ShopByOccasionConfig,
  ShopTheLookConfig,
} from '../../types';
import {
  OCCASION_PRESETS,
  INITIAL_OCCASION_SALE,
  INITIAL_HERO_SLIDES,
  INITIAL_HERO_CAROUSEL_SETTINGS,
  INITIAL_SHOP_BY_OCCASION,
  INITIAL_SHOP_THE_LOOK,
} from '../../data/initialData';
import { ImageUploader } from './ImageUploader';

interface HomepageHubProps {
  initialSubTab?:
    | 'all'
    | 'hero'
    | 'occasion'
    | 'announcements'
    | 'deals'
    | 'festive'
    | 'shop_by_occasion'
    | 'shop_the_look'
    | 'reviews'
    | 'faqs';
}

export const HomepageHub: React.FC<HomepageHubProps> = ({ initialSubTab = 'all' }) => {
  const {
    homepageConfig,
    updateHomepageConfig,
    updateOccasionSaleBanner,
    updateHeroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlide,
    updateHeroCarouselSettings,
    updateShopByOccasionConfig,
    addOccasionCard,
    updateOccasionCard,
    deleteOccasionCard,
    reorderOccasionCard,
    updateShopTheLookConfig,
    coupons,
    addCoupon,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    moderateReview,
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
    products,
    setCurrentView,
    showToast,
  } = useStore();

  const [subTab, setSubTab] = useState<
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
  >(initialSubTab);

  // Hero Carousel & Slides state
  const heroSlides = (homepageConfig.heroSlides && homepageConfig.heroSlides.length > 0)
    ? homepageConfig.heroSlides
    : INITIAL_HERO_SLIDES;

  const currentHeroSettings = homepageConfig.heroCarouselSettings || INITIAL_HERO_CAROUSEL_SETTINGS;
  const [carouselSettingsForm, setCarouselSettingsForm] = useState<HeroCarouselSettings>(currentHeroSettings);
  const [isAddingHeroSlide, setIsAddingHeroSlide] = useState(false);
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null);
  const [newHeroSlideForm, setNewHeroSlideForm] = useState<Partial<HeroSlide>>({
    brandTag: 'F O A X X',
    titlePart1: 'NEW ARRIVALS.',
    titlePart2: 'TIMELESS',
    statementWord: 'ELEGANCE.',
    subtitle: 'Curated artisanal jewelry and couture handcrafted for luxury living.',
    primaryBtnText: 'SHOP COLLECTION →',
    primaryBtnLinkCategory: 'All',
    secondaryBtnText: 'EXPLORE EDIT',
    secondaryBtnLinkCategory: 'Jewellery',
    image: '/assets/extracted/hero_clean_bg.png',
    isDarkText: true,
    isActive: true,
    accentColor: '#DE7A62',
  });

  useEffect(() => {
    if (homepageConfig.heroCarouselSettings) {
      setCarouselSettingsForm(homepageConfig.heroCarouselSettings);
    }
  }, [homepageConfig.heroCarouselSettings]);

  // 1. Occasion Sale Banner form state
  const [occasionForm, setOccasionForm] = useState<OccasionSaleBannerConfig>(() => {
    return homepageConfig.occasionSaleBanner || INITIAL_OCCASION_SALE;
  });

  // 2. Flash Deals modals & state
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

  // 3. Festive Picks modals & state
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

  // 4. Review modals & state
  const [reviewFilter, setReviewFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
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

  // 5. FAQ modals & state
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [newFaqForm, setNewFaqForm] = useState<{ question: string; answer: string }>({
    question: '',
    answer: '',
  });

  // Deal Handlers
  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealForm.title || !newDealForm.discountText || !newDealForm.promoCode) {
      showToast('Please fill out Title, Discount, and Promo Code', 'error');
      return;
    }
    const deal: FlashDealOffer = {
      id: `deal-${Date.now()}`,
      prefix: newDealForm.prefix || 'UP TO',
      discountText: newDealForm.discountText,
      title: newDealForm.title,
      subtitle: newDealForm.subtitle || '',
      promoCode: (newDealForm.promoCode || 'DEAL50').toUpperCase(),
      image: newDealForm.image || '/assets/extracted/prod_floral_coord.png',
      targetCategory: newDealForm.targetCategory || 'clothing',
      themeStyle: newDealForm.themeStyle || 'sunset',
      badgeText: newDealForm.badgeText || 'FLASH DEAL ⚡',
      isActive: newDealForm.isActive !== false,
    };
    addFlashDeal(deal);
    setIsAddingDeal(false);
    showToast('Flash deal created successfully!', 'success');
  };

  const handleSaveDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDeal) {
      updateFlashDeal(editingDeal);
      setEditingDeal(null);
      showToast('Flash deal updated!', 'success');
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
    showToast('Flash deal countdown timer updated!', 'success');
  };

  // Festive Card Handlers
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
    showToast('Festive card published!', 'success');
  };

  const handleSaveFestiveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFestiveCard) {
      updateFestivePickCard(editingFestiveCard);
      setEditingFestiveCard(null);
      showToast('Festive card updated!', 'success');
    }
  };

  // Hero Carousel Handlers
  const handleSaveCarouselSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateHeroCarouselSettings(carouselSettingsForm);
  };

  const handleCreateHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeroSlideForm.titlePart1 || !newHeroSlideForm.statementWord) {
      showToast('Please provide headline text and highlighted statement word', 'error');
      return;
    }
    const newSlide: HeroSlide = {
      id: `hero-slide-${Date.now()}`,
      order: heroSlides.length + 1,
      image: newHeroSlideForm.image || '/assets/extracted/hero_clean_bg.png',
      brandTag: newHeroSlideForm.brandTag || 'F O A X X',
      titlePart1: newHeroSlideForm.titlePart1 || 'YOUR STYLE.',
      titlePart2: newHeroSlideForm.titlePart2 || 'YOUR',
      statementWord: newHeroSlideForm.statementWord || 'STATEMENT.',
      subtitle: newHeroSlideForm.subtitle || 'Discover the pieces that make every moment yours.',
      primaryBtnText: newHeroSlideForm.primaryBtnText || 'SHOP NEW ARRIVALS →',
      primaryBtnLinkCategory: newHeroSlideForm.primaryBtnLinkCategory || 'All',
      secondaryBtnText: newHeroSlideForm.secondaryBtnText || 'EXPLORE COLLECTION',
      secondaryBtnLinkCategory: newHeroSlideForm.secondaryBtnLinkCategory || 'Jewellery',
      isDarkText: newHeroSlideForm.isDarkText !== undefined ? newHeroSlideForm.isDarkText : true,
      isActive: newHeroSlideForm.isActive !== undefined ? newHeroSlideForm.isActive : true,
      accentColor: newHeroSlideForm.accentColor || '#DE7A62',
    };
    addHeroSlide(newSlide);
    setIsAddingHeroSlide(false);
    setNewHeroSlideForm({
      brandTag: 'F O A X X',
      titlePart1: 'NEW ARRIVALS.',
      titlePart2: 'TIMELESS',
      statementWord: 'ELEGANCE.',
      subtitle: 'Curated artisanal jewelry and couture handcrafted for luxury living.',
      primaryBtnText: 'SHOP COLLECTION →',
      primaryBtnLinkCategory: 'All',
      secondaryBtnText: 'EXPLORE EDIT',
      secondaryBtnLinkCategory: 'Jewellery',
      image: '/assets/extracted/hero_clean_bg.png',
      isDarkText: true,
      isActive: true,
      accentColor: '#DE7A62',
    });
  };

  const handleSaveHeroSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHeroSlide) {
      updateHeroSlide(editingHeroSlide);
      setEditingHeroSlide(null);
    }
  };

  // Review Handlers
  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.quote) {
      showToast('Please fill out customer name and quote', 'error');
      return;
    }
    const rev: CustomerReview = {
      id: `rev-${Date.now()}`,
      name: newReviewForm.name,
      location: newReviewForm.location || 'Mumbai, Maharashtra',
      image: newReviewForm.image || '/assets/extracted/prod_pearl_earrings.png',
      quote: newReviewForm.quote,
      rating: newReviewForm.rating || 5,
      productName: newReviewForm.productName || 'Handcrafted Luxury',
      productId: newReviewForm.productId || 'prod-1',
      date: newReviewForm.date || 'Verified Buyer · Today',
    };
    addReview(rev);
    setIsAddingReview(false);
    showToast('Customer review published to homepage!', 'success');
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReview) {
      updateReview(editingReview);
      setEditingReview(null);
      showToast('Customer review updated!', 'success');
    }
  };

  // FAQ Handlers
  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqForm.question || !newFaqForm.answer) {
      showToast('Please fill out question and answer', 'error');
      return;
    }
    const item: FaqItem = {
      id: `faq-${Date.now()}`,
      question: newFaqForm.question,
      answer: newFaqForm.answer,
    };
    addFaq(item);
    setIsAddingFaq(false);
    setNewFaqForm({ question: '', answer: '' });
    showToast('New FAQ added to homepage!', 'success');
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFaq) {
      updateFaq(editingFaq);
      setEditingFaq(null);
      showToast('FAQ updated!', 'success');
    }
  };

  // ⚜️ Shop By Occasion State & Form
  const currentOccasionConfig = homepageConfig.shopByOccasion || INITIAL_SHOP_BY_OCCASION;
  const [occasionSectionForm, setOccasionSectionForm] = useState<ShopByOccasionConfig>(currentOccasionConfig);
  const occasionsList = homepageConfig.shopByOccasion?.occasions || INITIAL_SHOP_BY_OCCASION.occasions;

  useEffect(() => {
    if (homepageConfig.shopByOccasion) {
      setOccasionSectionForm(homepageConfig.shopByOccasion);
    }
  }, [homepageConfig.shopByOccasion]);

  const [isAddingOccasion, setIsAddingOccasion] = useState(false);
  const [editingOccasion, setEditingOccasion] = useState<OccasionCardConfig | null>(null);
  const [newOccasionForm, setNewOccasionForm] = useState<Partial<OccasionCardConfig>>({
    label: '',
    icon: '⚜️',
    tagline: '',
    stylistNote: '',
    heroImage: '/assets/extracted/banner_festive_clean.png',
    heroTitle: '',
    heroBadge: 'CURATED CAPSULE',
    bundleProductIds: ['prod-2', 'prod-4', 'prod-1'],
    isActive: true,
  });

  const handleSaveOccasionSectionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopByOccasionConfig(occasionSectionForm);
  };

  const handleCreateOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOccasionForm.label) {
      showToast('Please enter an occasion tab label', 'error');
      return;
    }
    const newCard: OccasionCardConfig = {
      id: `occ-${Date.now()}`,
      label: newOccasionForm.label,
      icon: newOccasionForm.icon || '✨',
      tagline: newOccasionForm.tagline || '',
      stylistNote: newOccasionForm.stylistNote || '',
      heroImage: newOccasionForm.heroImage || '/assets/extracted/banner_festive_clean.png',
      heroTitle: newOccasionForm.heroTitle || newOccasionForm.label,
      heroBadge: newOccasionForm.heroBadge || 'CURATED CAPSULE',
      bundleProductIds: newOccasionForm.bundleProductIds?.length
        ? newOccasionForm.bundleProductIds
        : ['prod-2', 'prod-4', 'prod-1'],
      isActive: newOccasionForm.isActive !== false,
    };
    addOccasionCard(newCard);
    setIsAddingOccasion(false);
    setNewOccasionForm({
      label: '',
      icon: '⚜️',
      tagline: '',
      stylistNote: '',
      heroImage: '/assets/extracted/banner_festive_clean.png',
      heroTitle: '',
      heroBadge: 'CURATED CAPSULE',
      bundleProductIds: ['prod-2', 'prod-4', 'prod-1'],
      isActive: true,
    });
  };

  const handleSaveEditingOccasion = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOccasion) {
      updateOccasionCard(editingOccasion);
      setEditingOccasion(null);
    }
  };

  // 👗 Shop The Full Look State & Form
  const currentLookConfig = homepageConfig.shopTheLook || INITIAL_SHOP_THE_LOOK;
  const [lookForm, setLookForm] = useState<ShopTheLookConfig>(currentLookConfig);

  useEffect(() => {
    if (homepageConfig.shopTheLook) {
      setLookForm(homepageConfig.shopTheLook);
    }
  }, [homepageConfig.shopTheLook]);

  const handleSaveLookSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopTheLookConfig(lookForm);
  };

  const isVisible = (section: string) => {
    return subTab === 'all' || subTab === section;
  };

  return (
    <div className="pt-6 sm:pt-8 space-y-8">
      {/* 🌟 UNIFIED HOMEPAGE HUB HEADER */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Homepage Manager
              </h2>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Manage every section of the FOAXX homepage from this central dashboard. Toggle sections, customize curated occasion capsules, manage the full look ensemble, configure festival sales, and moderate reviews.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <span>Preview Live Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-Navigation Pills Bar */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: '🌟 All Sections', count: 'Overview' },
            { id: 'hero', label: '🎬 1. Hero Carousel & Slides', count: `${heroSlides.length} Slides` },
            { id: 'occasion', label: '🎉 2. Festival & Occasion Sale', count: occasionForm.enabled ? 'Active' : 'Off' },
            { id: 'announcements', label: '📢 3. Announcements & Banners', count: `${homepageConfig.banners.length} Cards` },
            { id: 'deals', label: '⚡ 4. Flash Deals & Countdown', count: `${homepageConfig.flashDeals?.offers?.length || 0} Deals` },
            { id: 'festive', label: '✨ 5. Festive Picks Carousel', count: `${homepageConfig.festivePicks?.cards?.length || 0} Cards` },
            { id: 'shop_by_occasion', label: '⚜️ 6. Shop by Occasion', count: `${occasionsList.length} Occasions` },
            { id: 'shop_the_look', label: '👗 7. Shop The Full Look', count: lookForm.enabled ? 'Active' : 'Off' },
            { id: 'reviews', label: '⭐ 8. Customer Reviews & Stars', count: `${reviews.length} Reviews` },
            { id: 'faqs', label: '❓ 9. Homepage FAQs', count: `${faqs.length} FAQs` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                subTab === tab.id
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-md scale-[1.01]'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  subTab === tab.id ? 'bg-zinc-950 text-amber-300' : 'bg-stone-700 text-stone-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Quick Jumps Directory (when subTab === 'all') */}
      {subTab === 'all' && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 gap-2">
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Homepage Layout Sequence & Quick Access</span>
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Manage all 9 storefront homepage sections in their exact visual sequence, including Shop by Occasion capsules and Shop The Full Look ensemble.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-lg">
              9 Active Modules
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mt-3 text-xs">
            <button
              type="button"
              onClick={() => setSubTab('hero')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">🎬</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">1. Hero Carousel</span>
              <span className="text-[10px] text-stone-500 block">{heroSlides.length} Slides</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('occasion')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">🎉</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">2. Festival Sale</span>
              <span className="text-[10px] text-stone-500 block">{occasionForm.enabled ? 'Active' : 'Disabled'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('announcements')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">📢</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">3. Announcements</span>
              <span className="text-[10px] text-stone-500 block">{homepageConfig.banners.length} Promo Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('deals')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">⚡</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">4. Flash Deals</span>
              <span className="text-[10px] text-stone-500 block">{homepageConfig.flashDeals?.offers?.length || 0} Offers</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('festive')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">✨</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">5. Festive Picks</span>
              <span className="text-[10px] text-stone-500 block">{homepageConfig.festivePicks?.cards?.length || 0} Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('shop_by_occasion')}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-100/60 transition-all text-left group cursor-pointer ring-1 ring-amber-300/60"
            >
              <span className="text-base block mb-1">⚜️</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-800">6. Shop by Occasion</span>
              <span className="text-[10px] text-amber-700 font-semibold block">{occasionsList.length} Occasions</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('shop_the_look')}
              className="p-2.5 rounded-xl border border-amber-300 bg-amber-50/40 hover:border-amber-500 hover:bg-amber-100/60 transition-all text-left group cursor-pointer ring-1 ring-amber-300/60"
            >
              <span className="text-base block mb-1">👗</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-800">7. Shop The Full Look</span>
              <span className="text-[10px] text-amber-700 font-semibold block">{lookForm.enabled ? 'Active' : 'Disabled'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('reviews')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">⭐</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">8. Reviews Moderation</span>
              <span className="text-[10px] text-stone-500 block">{reviews.length} Reviews</span>
            </button>

            <button
              type="button"
              onClick={() => setSubTab('faqs')}
              className="p-2.5 rounded-xl border border-stone-200 hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group cursor-pointer"
            >
              <span className="text-base block mb-1">❓</span>
              <span className="font-bold text-stone-900 block truncate group-hover:text-amber-700">9. Homepage FAQs</span>
              <span className="text-[10px] text-stone-500 block">{faqs.length} FAQs</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: 🎬 HERO BANNER CAROUSEL & SLIDES MANAGEMENT */}
      {/* ========================================================================= */}
      {isVisible('hero') && (
        <section id="section-hero" className="space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-stone-900">
                  1. Hero Banner Carousel & Multi-Slide Rotation
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                  {heroSlides.length} Slides ({heroSlides.filter((s) => s.isActive !== false).length} Active)
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage hero banner slides, reorder slide sequence (1st, 2nd, 3rd), set automatic slide delay in seconds, and customize texts & CTA buttons. Fully optimized with swipe gestures for mobile phones.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingHeroSlide(true)}
                className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add New Slide</span>
              </button>
            </div>
          </div>

          {/* Carousel Playback & Interval Controls */}
          <form
            onSubmit={handleSaveCarouselSettings}
            className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-700" />
                <h4 className="font-bold text-stone-900 text-xs">
                  Carousel Playback & Auto-Slide Timing
                </h4>
              </div>
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Playback Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Auto Slide Toggle */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Automatic Slide Rotation</span>
                  <input
                    type="checkbox"
                    checked={carouselSettingsForm.autoSlide}
                    onChange={(e) =>
                      setCarouselSettingsForm({ ...carouselSettingsForm, autoSlide: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  Automatically glide to the next banner without user interaction.
                </p>
              </div>

              {/* Interval / Delay in Seconds */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Slide Delay (Duration)</span>
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">
                    {carouselSettingsForm.intervalSeconds || 5}s
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  step="1"
                  value={carouselSettingsForm.intervalSeconds || 5}
                  onChange={(e) =>
                    setCarouselSettingsForm({
                      ...carouselSettingsForm,
                      intervalSeconds: parseInt(e.target.value, 10),
                    })
                  }
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>Fast (2s)</span>
                  <span>Default (5s)</span>
                  <span>Slow (15s)</span>
                </div>
              </div>

              {/* Pause on Hover */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Pause on Hover</span>
                  <input
                    type="checkbox"
                    checked={carouselSettingsForm.pauseOnHover}
                    onChange={(e) =>
                      setCarouselSettingsForm({ ...carouselSettingsForm, pauseOnHover: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  Temporarily pause rotation when a shopper hovers or touches the slide.
                </p>
              </div>

              {/* Show Arrows & Dots */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Navigation Controls</span>
                </div>
                <div className="flex items-center gap-4 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={carouselSettingsForm.showArrows !== false}
                      onChange={(e) =>
                        setCarouselSettingsForm({
                          ...carouselSettingsForm,
                          showArrows: e.target.checked,
                        })
                      }
                      className="accent-amber-500"
                    />
                    <span>Left / Right Arrows</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={carouselSettingsForm.showDots !== false}
                      onChange={(e) =>
                        setCarouselSettingsForm({
                          ...carouselSettingsForm,
                          showDots: e.target.checked,
                        })
                      }
                      className="accent-amber-500"
                    />
                    <span>Pagination Dots</span>
                  </label>
                </div>
              </div>
            </div>
          </form>

          {/* Slide Sequence & Order Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Slide Sequence & Ordering (Which slide appears 1st, 2nd, 3rd)
                </h4>
                <p className="text-[11px] text-stone-500">
                  Click the Up (↑) or Down (↓) buttons to reorder slides. Top slide displays first upon page visit.
                </p>
              </div>
              <span className="text-xs text-stone-500">
                {heroSlides.length} total banners
              </span>
            </div>

            <div className="space-y-2.5">
              {[...heroSlides]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((slide, index, arr) => (
                  <div
                    key={slide.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between p-3.5 rounded-xl border transition-all ${
                      slide.isActive !== false
                        ? 'bg-white border-stone-200 shadow-xs'
                        : 'bg-stone-50/70 border-stone-200/80 opacity-60'
                    }`}
                  >
                    {/* Left: Sequence Position & Controls */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={() => reorderHeroSlide(slide.id, 'up')}
                          disabled={index === 0}
                          aria-label={`Move slide ${index + 1} up`}
                          className={`p-1 rounded hover:bg-stone-100 transition cursor-pointer ${
                            index === 0 ? 'opacity-25 cursor-not-allowed text-stone-400' : 'text-stone-700'
                          }`}
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-800 border border-stone-200">
                          #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => reorderHeroSlide(slide.id, 'down')}
                          disabled={index === arr.length - 1}
                          aria-label={`Move slide ${index + 1} down`}
                          className={`p-1 rounded hover:bg-stone-100 transition cursor-pointer ${
                            index === arr.length - 1 ? 'opacity-25 cursor-not-allowed text-stone-400' : 'text-stone-700'
                          }`}
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Image Thumbnail */}
                      <div className="w-24 h-16 rounded-lg overflow-hidden bg-stone-200 relative shrink-0 border border-stone-200">
                        <img
                          src={slide.image}
                          alt={slide.titlePart1}
                          className="w-full h-full object-cover"
                        />
                        <span
                          className={`absolute bottom-1 right-1 text-[8px] font-bold px-1 rounded ${
                            slide.isDarkText ? 'bg-white/90 text-stone-900' : 'bg-black/80 text-white'
                          }`}
                        >
                          {slide.isDarkText ? 'Dark Text' : 'Light Text'}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono tracking-wider font-semibold text-stone-500 uppercase">
                            {slide.brandTag || 'F O A X X'}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.2 rounded-full ${
                              slide.isActive !== false
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-stone-200 text-stone-600'
                            }`}
                          >
                            {slide.isActive !== false ? 'Active' : 'Draft / Off'}
                          </span>
                        </div>
                        <h5 className="font-serif font-bold text-sm text-stone-900 leading-tight">
                          {slide.titlePart1} {slide.titlePart2 && `${slide.titlePart2} `}
                          <span style={{ color: slide.accentColor || '#DE7A62' }}>
                            {slide.statementWord}
                          </span>
                        </h5>
                        <p className="text-[11px] text-stone-500 line-clamp-1 max-w-md">
                          {slide.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-stone-600 pt-0.5">
                          <span className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            CTA 1: {slide.primaryBtnText} ({slide.primaryBtnLinkCategory || 'All'})
                          </span>
                          {slide.secondaryBtnText && (
                            <span className="bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                              CTA 2: {slide.secondaryBtnText} ({slide.secondaryBtnLinkCategory || 'Jewellery'})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 mt-3 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
                      <button
                        type="button"
                        onClick={() =>
                          updateHeroSlide({
                            ...slide,
                            isActive: slide.isActive === false ? true : false,
                          })
                        }
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition cursor-pointer ${
                          slide.isActive !== false
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300'
                        }`}
                      >
                        {slide.isActive !== false ? 'Turn Off' : 'Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingHeroSlide(slide)}
                        className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 border border-stone-200 transition cursor-pointer flex items-center gap-1 text-xs px-2.5 font-medium"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (heroSlides.length <= 1) {
                            showToast('You must keep at least one hero slide', 'error');
                            return;
                          }
                          deleteHeroSlide(slide.id);
                        }}
                        disabled={heroSlides.length <= 1}
                        className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-xs px-2 font-medium ${
                          heroSlides.length <= 1
                            ? 'opacity-30 cursor-not-allowed border-stone-200 text-stone-400'
                            : 'hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: 🎉 FESTIVAL & OCCASION SALE BANNER MANAGEMENT */}
      {/* ========================================================================= */}
      {isVisible('occasion') && (
        <section id="section-occasion" className="space-y-6 bg-stone-50/70 p-5 sm:p-6 rounded-2xl border border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-base font-bold text-stone-900">
                  1. Festive & Occasion Sale Banner Management
                </h3>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    occasionForm.enabled ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {occasionForm.enabled ? '● Active on Homepage' : '○ Paused / Hidden'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage festival sales (Diwali, Eid, Valentine&apos;s, Bridal, etc.) with custom promo codes, bank offers, banner pictures, and countdown timers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                updateOccasionSaleBanner(occasionForm);
                const existingCoupon = coupons.find((c) => c.code === occasionForm.promoCode);
                if (!existingCoupon && occasionForm.promoCode) {
                  addCoupon({
                    code: occasionForm.promoCode,
                    discountPercent: occasionForm.promoDiscountPercent || 40,
                    description: `${occasionForm.occasionName} Festive Offer - ${occasionForm.discountText}`,
                    minOrderValue: 999,
                    category: occasionForm.targetCategory === 'All' ? undefined : occasionForm.targetCategory,
                    isActive: true,
                    validityType: 'indefinite',
                  });
                }
                showToast('🎉 Festive sale banner published to homepage!', 'success');
              }}
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 fill-zinc-950" />
              <span>Publish Banner to Storefront</span>
            </button>
          </div>

          {/* Quick Preset Selector */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                Instant Festival Presets (1-Click Switch)
              </span>
              <span className="text-[10px] text-stone-400">Loads festive copy, colors, codes & artwork</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(
                [
                  { id: 'diwali', label: '🪔 Diwali Sale', color: 'border-red-400 bg-red-50 text-red-950' },
                  { id: 'eid', label: '🌙 Eid Mubarak', color: 'border-emerald-400 bg-emerald-50 text-emerald-950' },
                  { id: 'valentines', label: "🌹 Valentine's Day", color: 'border-rose-400 bg-rose-50 text-rose-950' },
                  { id: 'wedding', label: '👑 Bridal Heritage', color: 'border-amber-400 bg-amber-50 text-amber-950' },
                  { id: 'newyear', label: '🎆 New Year Gala', color: 'border-purple-400 bg-purple-50 text-purple-950' },
                  { id: 'custom', label: '🎪 Custom Event', color: 'border-stone-400 bg-stone-50 text-stone-950' },
                ] as const
              ).map((preset) => {
                const isSelected = occasionForm.occasionType === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      const template = OCCASION_PRESETS[preset.id as OccasionType];
                      if (template) {
                        setOccasionForm({
                          ...template,
                          enabled: true,
                          bannerImage:
                            preset.id === 'diwali'
                              ? '/assets/aistudio/image_8b11f93e.png'
                              : template.bannerImage,
                        });
                        showToast(`Loaded ${preset.label} preset!`, 'info');
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition cursor-pointer ${
                      isSelected
                        ? `ring-2 ring-stone-900 shadow-md ${preset.color}`
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasion Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Form Controls */}
            <div className="lg:col-span-7 space-y-4 text-xs">
              {/* Visibility & Titles */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                    Banner Visibility & Headline Copy
                  </span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-xs font-semibold text-stone-700">
                      {occasionForm.enabled ? 'Visible on Store' : 'Hidden'}
                    </span>
                    <input
                      type="checkbox"
                      checked={occasionForm.enabled}
                      onChange={(e) => setOccasionForm({ ...occasionForm, enabled: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Occasion / Tag Name</label>
                    <input
                      type="text"
                      value={occasionForm.occasionName}
                      onChange={(e) => setOccasionForm({ ...occasionForm, occasionName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Target Category Link</label>
                    <select
                      value={occasionForm.targetCategory || 'All'}
                      onChange={(e) => setOccasionForm({ ...occasionForm, targetCategory: e.target.value })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-medium"
                    >
                      <option value="All">All Products</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Bags">Bags</option>
                      <option value="Footwear">Footwear</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Main Banner Headline</label>
                  <input
                    type="text"
                    value={occasionForm.headline}
                    onChange={(e) => setOccasionForm({ ...occasionForm, headline: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bold font-serif"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Subheadline / Perks Prose</label>
                  <input
                    type="text"
                    value={occasionForm.subheadline}
                    onChange={(e) => setOccasionForm({ ...occasionForm, subheadline: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                  />
                </div>
              </div>

              {/* Bank Plaque & Promo Code */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block pb-2 border-b border-stone-100">
                  Bank Offer Plaque & Promo Code
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Hanging Plaque Title</label>
                    <input
                      type="text"
                      value={occasionForm.plaqueTitle || ''}
                      onChange={(e) => setOccasionForm({ ...occasionForm, plaqueTitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bold uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Hanging Plaque Subtitle</label>
                    <input
                      type="text"
                      value={occasionForm.plaqueSubtitle || ''}
                      onChange={(e) => setOccasionForm({ ...occasionForm, plaqueSubtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Promo Code</label>
                    <input
                      type="text"
                      value={occasionForm.promoCode}
                      onChange={(e) => setOccasionForm({ ...occasionForm, promoCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-mono font-bold text-stone-900 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Discount %</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={occasionForm.promoDiscountPercent || 40}
                      onChange={(e) => setOccasionForm({ ...occasionForm, promoDiscountPercent: parseInt(e.target.value) || 40 })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-bold text-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Discount Text Badge</label>
                    <input
                      type="text"
                      value={occasionForm.discountText}
                      onChange={(e) => setOccasionForm({ ...occasionForm, discountText: e.target.value })}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Countdown Timer & Artwork */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
                <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] block pb-2 border-b border-stone-100">
                  Artwork Graphic & Live Countdown End Time
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Quick Timer Extension</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { hours: 24, label: '+24h' },
                        { hours: 72, label: '+3 Days' },
                        { hours: 168, label: '+7 Days' },
                      ].map((t) => (
                        <button
                          key={t.label}
                          type="button"
                          onClick={() => {
                            const newEnd = new Date(Date.now() + t.hours * 3600 * 1000).toISOString();
                            setOccasionForm({ ...occasionForm, countdownEndTime: newEnd });
                            showToast(`Timer set to expire in ${t.label}`, 'info');
                          }}
                          className="py-1 px-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 rounded text-center text-[10px] font-semibold cursor-pointer"
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">End Date & Time</label>
                    <input
                      type="datetime-local"
                      value={
                        occasionForm.countdownEndTime
                          ? new Date(occasionForm.countdownEndTime).toISOString().slice(0, 16)
                          : ''
                      }
                      onChange={(e) => {
                        if (e.target.value) {
                          setOccasionForm({
                            ...occasionForm,
                            countdownEndTime: new Date(e.target.value).toISOString(),
                          });
                        }
                      }}
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg font-mono text-stone-900 text-xs"
                    />
                  </div>
                </div>

                {/* Banner Graphic Uploader */}
                <ImageUploader
                  label="Upload Custom Banner Graphic (PNG / JPEG)"
                  currentImage={occasionForm.bannerImage}
                  onImageChange={(img) => setOccasionForm({ ...occasionForm, bannerImage: img })}
                />
              </div>
            </div>

            {/* Right Column: Live Storefront Mini Preview */}
            <div className="lg:col-span-5 space-y-3">
              <div className="sticky top-6 bg-zinc-950 text-white p-4 rounded-xl border border-zinc-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                      Live Storefront Preview
                    </span>
                  </div>
                  <span className="text-[10px] bg-zinc-800 text-amber-400 px-2 py-0.5 rounded font-mono font-bold">
                    {occasionForm.themeStyle}
                  </span>
                </div>

                {/* Compact Mini Preview */}
                <div className="rounded-xl overflow-hidden border border-amber-500/30 bg-zinc-900 p-3 space-y-2.5">
                  {occasionForm.bannerImage && (
                    <div className="w-full h-20 rounded-lg overflow-hidden relative">
                      <img
                        src={occasionForm.bannerImage}
                        alt="Banner Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                      <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-white text-zinc-950 font-bold text-[9px] rounded-full shadow">
                        {occasionForm.ctaText || 'Shop Now →'}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="inline-block px-2 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase mb-1">
                      {occasionForm.occasionName}
                    </span>
                    <h4 className="text-xs font-serif font-black text-white leading-tight">
                      {occasionForm.headline}
                    </h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                      {occasionForm.subheadline}
                    </p>
                  </div>

                  {/* Hanging Plaque & Coupon */}
                  <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-300 truncate">{occasionForm.plaqueTitle}</span>
                    <span className="text-zinc-300 font-mono font-bold px-1.5 py-0.5 bg-black/60 rounded text-amber-200">
                      {occasionForm.promoCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      updateOccasionSaleBanner(occasionForm);
                      showToast('🎉 Festive sale banner published to homepage!', 'success');
                    }}
                    className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs shadow text-center cursor-pointer hover:from-amber-300 hover:to-amber-400 transition"
                  >
                    Publish Changes to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: 📢 TOP ANNOUNCEMENT BAR & HERO EDITORIAL BANNERS */}
      {/* ========================================================================= */}
      {isVisible('announcements') && (
        <section id="section-announcements" className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-stone-700" />
                <h3 className="text-base font-bold text-stone-900">
                  3. Top Announcement Bar & Collection Cards
                </h3>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Configure the top ticker announcement strip and the 3 editorial collection showcase cards.
              </p>
            </div>
          </div>

          {/* Top Announcement Messages */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-3">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Top Black Announcement Bar Messages
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Left Message</label>
                <input
                  type="text"
                  value={homepageConfig.announcement.left}
                  onChange={(e) =>
                    updateHomepageConfig({
                      ...homepageConfig,
                      announcement: { ...homepageConfig.announcement, left: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Center Offer Message</label>
                <input
                  type="text"
                  value={homepageConfig.announcement.center}
                  onChange={(e) =>
                    updateHomepageConfig({
                      ...homepageConfig,
                      announcement: { ...homepageConfig.announcement, center: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded-md p-2"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1 font-semibold">Right Trust Message</label>
                <input
                  type="text"
                  value={homepageConfig.announcement.right}
                  onChange={(e) =>
                    updateHomepageConfig({
                      ...homepageConfig,
                      announcement: { ...homepageConfig.announcement, right: e.target.value },
                    })
                  }
                  className="w-full bg-white border border-stone-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          {/* Hero Carousel Shortcut */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                  Hero Banner Multi-Slide Carousel
                </h4>
                <span className="font-bold text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full">
                  {heroSlides.length} Slides ({heroSlides.filter((s) => s.isActive !== false).length} Active)
                </span>
              </div>
              <p className="text-stone-500 text-[11px]">
                Full slide reordering, timing delay controls, and custom CTA button options are configured in Section 1.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubTab('hero');
                const el = document.getElementById('section-hero');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-all cursor-pointer shadow-xs whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
            >
              <span>Manage Carousel Slides</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          {/* Three Collection Banners */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-3">
            <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
              Three Editorial Collection Cards
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {homepageConfig.banners.map((banner, index) => (
                <div key={banner.id} className="p-3 bg-white border border-stone-200 rounded-lg space-y-2">
                  <span className="font-bold text-stone-900 block text-xs">Banner {index + 1}</span>
                  <ImageUploader
                    label={`Banner ${index + 1} Image`}
                    currentImage={banner.image}
                    onImageChange={(img) => {
                      const updatedBanners = [...homepageConfig.banners];
                      updatedBanners[index].image = img;
                      updateHomepageConfig({ ...homepageConfig, banners: updatedBanners });
                    }}
                    aspectRatioClass="aspect-[4/3]"
                  />
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Title</label>
                    <input
                      type="text"
                      value={banner.title}
                      onChange={(e) => {
                        const updatedBanners = [...homepageConfig.banners];
                        updatedBanners[index].title = e.target.value;
                        updateHomepageConfig({ ...homepageConfig, banners: updatedBanners });
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded p-1.5 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1 font-semibold">Subtitle</label>
                    <input
                      type="text"
                      value={banner.subtitle}
                      onChange={(e) => {
                        const updatedBanners = [...homepageConfig.banners];
                        updatedBanners[index].subtitle = e.target.value;
                        updateHomepageConfig({ ...homepageConfig, banners: updatedBanners });
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded p-1.5 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ⚡ FLASH DEALS & PROMO TICKET BANNERS */}
      {/* ========================================================================= */}
      {isVisible('deals') && (
        <section id="section-deals" className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#FA4D66] fill-[#FA4D66]" />
                <h3 className="text-base font-bold text-stone-900">
                  3. Flash Deals & Live Countdown Ticker
                </h3>
                <span className="bg-[#FA4D66]/10 text-[#FA4D66] text-xs font-bold px-2 py-0.5 rounded-full">
                  {homepageConfig.flashDeals?.offers?.length || 0} Deals
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage perforated coupon banners with live countdown timers, discount text, product graphics, and promo codes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingDeal(true)}
              className="bg-[#FA4D66] hover:bg-[#e03d55] text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Deal Banner</span>
            </button>
          </div>

          {/* Flash Deals Global Controls */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FA4D66]" />
                Countdown Duration & Section Controls
              </span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <span className="text-xs font-semibold text-stone-700">
                  {homepageConfig.flashDeals?.enabled !== false ? 'Section Visible' : 'Section Hidden'}
                </span>
                <input
                  type="checkbox"
                  checked={homepageConfig.flashDeals?.enabled !== false}
                  onChange={(e) => {
                    const current = homepageConfig.flashDeals || {
                      enabled: true,
                      sectionTitle: 'LIMITED TIME DEALS',
                      badgeText: '⚡ FLASH SALE',
                      targetEndTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
                      offers: [],
                    };
                    updateFlashDealsConfig({ ...current, enabled: e.target.checked });
                  }}
                  className="w-4 h-4 rounded text-[#FA4D66]"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Section Title</label>
                <input
                  type="text"
                  value={homepageConfig.flashDeals?.sectionTitle || 'LIMITED TIME DEALS'}
                  onChange={(e) => {
                    const current = homepageConfig.flashDeals || {
                      enabled: true,
                      sectionTitle: 'LIMITED TIME DEALS',
                      badgeText: '⚡ FLASH SALE',
                      targetEndTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
                      offers: [],
                    };
                    updateFlashDealsConfig({ ...current, sectionTitle: e.target.value });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-md text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Badge Text</label>
                <input
                  type="text"
                  value={homepageConfig.flashDeals?.badgeText || '⚡ FLASH SALE'}
                  onChange={(e) => {
                    const current = homepageConfig.flashDeals || {
                      enabled: true,
                      sectionTitle: 'LIMITED TIME DEALS',
                      badgeText: '⚡ FLASH SALE',
                      targetEndTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
                      offers: [],
                    };
                    updateFlashDealsConfig({ ...current, badgeText: e.target.value });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-md text-stone-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-semibold mb-1">Set Timer (Hours : Mins)</label>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min="0"
                    value={dealHoursInput}
                    onChange={(e) => setDealHoursInput(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-14 px-2 py-1.5 bg-white border border-stone-200 rounded-md text-center font-bold"
                  />
                  <span className="font-bold text-stone-400">h</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={dealMinutesInput}
                    onChange={(e) => setDealMinutesInput(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                    className="w-14 px-2 py-1.5 bg-white border border-stone-200 rounded-md text-center font-bold"
                  />
                  <span className="font-bold text-stone-400">m</span>
                  <button
                    type="button"
                    onClick={handleUpdateTimerFromInputs}
                    className="px-2.5 py-1.5 bg-stone-900 hover:bg-black text-white rounded font-bold text-[10px] uppercase tracking-wider ml-auto cursor-pointer"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* List of Deals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {homepageConfig.flashDeals?.offers?.map((deal) => (
              <div key={deal.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{deal.title}</span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-white border border-stone-200 text-[#FA4D66]">
                    {deal.discountText}
                  </span>
                </div>
                <p className="text-stone-500 text-[11px]">{deal.subtitle}</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className="font-mono text-[11px] font-bold text-stone-800">Code: {deal.promoCode}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => updateFlashDeal({ ...deal, isActive: !deal.isActive })}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                    >
                      {deal.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingDeal(deal)}
                      className="p-1 text-stone-600 hover:text-black rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete deal "${deal.title}"?`)) deleteFlashDeal(deal.id);
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: ✨ FESTIVE PICKS CAROUSEL CARDS */}
      {/* ========================================================================= */}
      {isVisible('festive') && (
        <section id="section-festive" className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-rose-500 fill-rose-500" />
                <h3 className="text-base font-bold text-stone-900">
                  4. Festive Picks Carousel Cards
                </h3>
                <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {homepageConfig.festivePicks?.cards?.length || 0} Cards
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage festive curation cards placed before &quot;Shop by Occasion&quot;. Clicking a card directly opens the target product!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingFestiveCard(true)}
              className="bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Festive Showcase Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homepageConfig.festivePicks?.cards?.map((card) => (
              <div key={card.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs">
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200">
                  <img src={card.image} alt={card.headline} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-700">{card.badge}</span>
                  <h4 className="font-bold text-stone-900 text-xs">{card.headline}</h4>
                  <p className="text-stone-600 font-semibold text-[11px]">{card.offerText} · {card.subtitle}</p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${card.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                    {card.isActive ? 'Active' : 'Hidden'}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => updateFestivePickCard({ ...card, isActive: !card.isActive })}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
                    >
                      {card.isActive ? 'Pause' : 'Activate'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingFestiveCard(card)}
                      className="p-1 text-stone-600 hover:text-black rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete card "${card.headline}"?`)) deleteFestivePickCard(card.id);
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: ⚜️ SHOP BY OCCASION (CAPSULES & 3-PIECE BUNDLES) */}
      {/* ========================================================================= */}
      {isVisible('shop_by_occasion') && (
        <section id="section-shop-by-occasion" className="space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">⚜️</span>
                <h3 className="text-base font-bold text-stone-900">
                  6. Shop by Occasion (Capsules & Stylist Curations)
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    occasionSectionForm.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {occasionSectionForm.enabled ? 'Active on Homepage' : 'Section Hidden'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage occasion tabs (Royal Wedding, Cocktail Soirée, Sundowner Brunch, Everyday Minimal, Milestone Gifting), customize headline, stylist quote, spotlight imagery, and link 3-piece curated product bundles with instant discount perk.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAddingOccasion(true)}
                className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add New Occasion</span>
              </button>
            </div>
          </div>

          {/* Section Settings Form (Enable/Disable, Eyebrow, Title, Bundle Discount) */}
          <form
            onSubmit={handleSaveOccasionSectionSettings}
            className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-stone-700" />
                <h4 className="font-bold text-stone-900 text-xs">
                  Section Master Header & Bundle Settings
                </h4>
              </div>
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Section Settings</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Enable Toggle */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Show on Homepage</span>
                  <input
                    type="checkbox"
                    checked={occasionSectionForm.enabled !== false}
                    onChange={(e) =>
                      setOccasionSectionForm({ ...occasionSectionForm, enabled: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-500 leading-tight">
                  Display the interactive Shop by Occasion section on the storefront homepage.
                </p>
              </div>

              {/* Eyebrow */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <label className="font-semibold text-stone-800 block">Section Eyebrow Text</label>
                <input
                  type="text"
                  value={occasionSectionForm.sectionEyebrow}
                  onChange={(e) =>
                    setOccasionSectionForm({ ...occasionSectionForm, sectionEyebrow: e.target.value })
                  }
                  placeholder="Curated For Life's Grand Moments"
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs bg-stone-50"
                />
              </div>

              {/* Section Title */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <label className="font-semibold text-stone-800 block">Main Headline</label>
                <input
                  type="text"
                  value={occasionSectionForm.sectionTitle}
                  onChange={(e) =>
                    setOccasionSectionForm({ ...occasionSectionForm, sectionTitle: e.target.value })
                  }
                  placeholder="Shop by Occasion"
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded text-xs bg-stone-50 font-serif"
                />
              </div>

              {/* Bundle Discount % */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <label className="font-semibold text-stone-800 block">Bundle Discount Perk (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={60}
                    value={occasionSectionForm.bundleDiscountPercent ?? 15}
                    onChange={(e) =>
                      setOccasionSectionForm({
                        ...occasionSectionForm,
                        bundleDiscountPercent: Number(e.target.value),
                      })
                    }
                    className="w-20 px-2.5 py-1.5 border border-stone-200 rounded text-xs bg-stone-50 font-bold"
                  />
                  <span className="text-stone-500 text-[11px] font-semibold">% OFF on 3-item bundle</span>
                </div>
              </div>
            </div>
          </form>

          {/* Occasion Capsules List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                Active Occasion Capsules ({occasionsList.length})
              </span>
              <span className="text-[11px] text-stone-400">
                Use arrows to change tab order on storefront
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {occasionsList.map((occ, idx) => {
                const linkedProducts = (occ.bundleProductIds || [])
                  .map((id) => products.find((p) => p.id === id))
                  .filter((p): p is Product => Boolean(p));

                const bundleOrig = linkedProducts.reduce((sum, p) => sum + p.originalPrice, 0);
                const bundleNow = Math.round(
                  linkedProducts.reduce((sum, p) => sum + p.price, 0) *
                    (1 - (occasionSectionForm.bundleDiscountPercent || 15) / 100)
                );

                return (
                  <div
                    key={occ.id}
                    className={`p-4 rounded-xl border transition-all text-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      occ.isActive === false
                        ? 'bg-stone-50/60 border-stone-200 opacity-60'
                        : 'bg-white border-stone-200 shadow-xs hover:border-amber-400'
                    }`}
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      {/* Reorder Buttons */}
                      <div className="flex flex-col gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => reorderOccasionCard(occ.id, 'up')}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="w-3 h-3 text-stone-700" />
                        </button>
                        <button
                          type="button"
                          disabled={idx === occasionsList.length - 1}
                          onClick={() => reorderOccasionCard(occ.id, 'down')}
                          className="p-1 rounded bg-stone-100 hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="w-3 h-3 text-stone-700" />
                        </button>
                      </div>

                      {/* Spotlight Photo */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative group">
                        <img
                          src={occ.heroImage || '/assets/extracted/banner_festive_clean.png'}
                          alt={occ.label}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-1 left-1 text-sm bg-black/40 backdrop-blur-xs rounded px-1">
                          {occ.icon}
                        </span>
                      </div>

                      {/* Text Details */}
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-stone-900 text-sm">{occ.label}</span>
                          <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.2 rounded-full font-bold">
                            {occ.heroBadge || 'CAPSULE'}
                          </span>
                          {occ.isActive === false && (
                            <span className="text-[10px] bg-stone-200 text-stone-600 px-1.5 py-0.2 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-stone-600 text-[11px] line-clamp-1">{occ.tagline}</p>
                        <p className="text-stone-400 text-[10px] italic line-clamp-1">
                          {occ.stylistNote}
                        </p>
                      </div>
                    </div>

                    {/* Middle: Linked Products Preview */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-stone-100 pt-2 md:pt-0 md:pl-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                          3-Piece Bundle ({linkedProducts.length})
                        </span>
                        <div className="flex items-center gap-1.5">
                          {linkedProducts.map((p) => (
                            <div
                              key={p.id}
                              className="w-9 h-11 rounded-md overflow-hidden border border-stone-200 relative group/item"
                              title={`${p.name} - ₹${p.price}`}
                            >
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          ))}
                        </div>
                        {linkedProducts.length > 0 && (
                          <div className="text-[10px] text-stone-600">
                            Bundle:{' '}
                            <strong className="text-emerald-700">₹{bundleNow.toLocaleString('en-IN')}</strong>{' '}
                            <span className="line-through text-stone-400">
                              ₹{bundleOrig.toLocaleString('en-IN')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() =>
                          updateOccasionCard({
                            ...occ,
                            isActive: occ.isActive === false ? true : false,
                          })
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer border ${
                          occ.isActive !== false
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 border-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        {occ.isActive !== false ? 'Active' : 'Enable'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingOccasion(occ)}
                        className="p-1.5 text-stone-600 hover:text-black hover:bg-stone-100 rounded-lg cursor-pointer border border-stone-200"
                        title="Edit Occasion Capsule"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Remove occasion capsule "${occ.label}"?`)) {
                            deleteOccasionCard(occ.id);
                          }
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer border border-rose-200"
                        title="Delete Occasion"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 7: 👗 SHOP THE FULL LOOK (3-PIECE ENSEMBLE) */}
      {/* ========================================================================= */}
      {isVisible('shop_the_look') && (
        <section id="section-shop-the-look" className="space-y-6 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg">👗</span>
                <h3 className="text-base font-bold text-stone-900">
                  7. Shop The Full Look (Editorial Ensemble Manager)
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lookForm.enabled
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {lookForm.enabled ? 'Active on Storefront' : 'Section Hidden'}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Customize the high-impact editorial showcase on the homepage where shoppers can buy a complete styled outfit (e.g. choker, earrings, and heels) with a single click and an instant bundle discount perk.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveLookSettings}
              className="bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Check className="w-4 h-4" />
              <span>Save Full Look Settings</span>
            </button>
          </div>

          <form onSubmit={handleSaveLookSettings} className="space-y-6 text-xs">
            {/* Top Row: Master Visibility & Section Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              {/* Active Toggle */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-800">Show Section</span>
                  <input
                    type="checkbox"
                    checked={lookForm.enabled !== false}
                    onChange={(e) => setLookForm({ ...lookForm, enabled: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-stone-500">
                  Enable or temporarily hide the Shop The Look module from the homepage.
                </p>
              </div>

              {/* Section Eyebrow Badge */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <label className="font-semibold text-stone-800 block">Section Eyebrow</label>
                <input
                  type="text"
                  value={lookForm.sectionBadge}
                  onChange={(e) => setLookForm({ ...lookForm, sectionBadge: e.target.value })}
                  placeholder="Shop The Full Look"
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-stone-50 uppercase tracking-wider text-[11px]"
                />
              </div>

              {/* Main Headline */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <label className="font-semibold text-stone-800 block">Main Headline</label>
                <input
                  type="text"
                  value={lookForm.sectionTitle}
                  onChange={(e) => setLookForm({ ...lookForm, sectionTitle: e.target.value })}
                  placeholder="Complete the Ensemble"
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-stone-50 font-serif"
                />
              </div>

              {/* Subtitle */}
              <div className="p-3 bg-white border border-stone-200 rounded-lg space-y-1.5">
                <label className="font-semibold text-stone-800 block">Stylist Subtitle</label>
                <input
                  type="text"
                  value={lookForm.sectionSubtitle}
                  onChange={(e) => setLookForm({ ...lookForm, sectionSubtitle: e.target.value })}
                  placeholder="Hand-picked by our chief jewelry stylist..."
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-stone-50"
                />
              </div>
            </div>

            {/* Split Grid: Left Editorial Banner | Right 3-Piece Product Selection & Bundle */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT: Lookbook Editorial Image & Overlays */}
              <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>Editorial Lookbook Imagery</span>
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono">Aspect 4:5</span>
                </div>

                <ImageUploader
                  label="Editorial Image (High-res model lookbook photo)"
                  currentImage={lookForm.editorialImage || '/assets/extracted/banner_festive_clean.png'}
                  onImageChange={(img) => setLookForm({ ...lookForm, editorialImage: img })}
                  aspectRatioClass="aspect-[4/5]"
                />

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Editorial Badge</label>
                    <input
                      type="text"
                      value={lookForm.editorialBadge}
                      onChange={(e) => setLookForm({ ...lookForm, editorialBadge: e.target.value })}
                      placeholder="Curated Ensemble"
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Editorial Headline</label>
                    <input
                      type="text"
                      value={lookForm.editorialHeadline}
                      onChange={(e) => setLookForm({ ...lookForm, editorialHeadline: e.target.value })}
                      placeholder="The Royal Festive Muse"
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Editorial Subtitle Prose</label>
                    <textarea
                      rows={3}
                      value={lookForm.editorialSubtitle}
                      onChange={(e) => setLookForm({ ...lookForm, editorialSubtitle: e.target.value })}
                      placeholder="An opulent harmony of antique Jadau uncut Polki..."
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT: 3 Complementary Pieces Picker & Bundle Pricing */}
              <div className="lg:col-span-7 space-y-5">
                <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <h4 className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Select 3 Curated Complementary Pieces</span>
                    </h4>
                    <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                      Exact Storefront Sync
                    </span>
                  </div>

                  {/* 3 Pieces Selectors */}
                  {[0, 1, 2].map((slotIndex) => {
                    const currentPieceId = lookForm.productIds?.[slotIndex] || '';
                    const matchedProduct = products.find((p) => p.id === currentPieceId);

                    return (
                      <div
                        key={slotIndex}
                        className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-stone-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                            {slotIndex + 1}
                          </span>

                          {matchedProduct ? (
                            <img
                              src={matchedProduct.image}
                              alt={matchedProduct.name}
                              className="w-11 h-13 object-cover rounded border border-stone-200 shrink-0 bg-white"
                            />
                          ) : (
                            <div className="w-11 h-13 rounded border border-dashed border-stone-300 flex items-center justify-center text-stone-400 shrink-0">
                              ?
                            </div>
                          )}

                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                              Piece {slotIndex + 1}: {slotIndex === 0 ? 'Statement / Choker' : slotIndex === 1 ? 'Earrings / Rings' : 'Heels / Stiletto / Bag'}
                            </span>
                            <span className="font-semibold text-stone-900 truncate block">
                              {matchedProduct ? matchedProduct.name : 'Select a product from catalog'}
                            </span>
                            {matchedProduct && (
                              <span className="text-stone-900 font-bold block mt-0.5">
                                ₹{matchedProduct.price.toLocaleString('en-IN')}{' '}
                                <span className="line-through text-[10px] text-stone-400">
                                  ₹{matchedProduct.originalPrice.toLocaleString('en-IN')}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Product Dropdown Selector */}
                        <div className="shrink-0 max-w-[200px]">
                          <select
                            value={currentPieceId}
                            onChange={(e) => {
                              const newIds = [...(lookForm.productIds || ['prod-9', 'prod-2', 'prod-8'])];
                              newIds[slotIndex] = e.target.value;
                              setLookForm({ ...lookForm, productIds: newIds });
                            }}
                            className="bg-white border border-stone-300 rounded px-2 py-1 text-xs max-w-full truncate font-medium cursor-pointer"
                          >
                            <option value="">-- Choose Item --</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                [{p.category}] {p.name} (₹{p.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bundle Perks & Savings Calculation */}
                {(() => {
                  const items = (lookForm.productIds || [])
                    .map((id) => products.find((p) => p.id === id))
                    .filter((p): p is Product => Boolean(p));

                  const origSum = items.reduce((sum, p) => sum + p.price, 0);
                  const discPercent = lookForm.bundleDiscountPercent ?? 15;
                  const discountedSum = Math.round(origSum * (1 - discPercent / 100));
                  const savings = origSum - discountedSum;

                  return (
                    <div className="p-4 bg-white rounded-xl border-2 border-stone-900 shadow-md space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div>
                          <span className="font-bold text-stone-900 text-sm block">
                            Bundle Pricing & Savings Summary
                          </span>
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {lookForm.bundlePerkText || `Special ${discPercent}% Lookbook Discount Applied`}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-stone-400 line-through block">
                            ₹{origSum.toLocaleString('en-IN')}
                          </span>
                          <span className="text-lg font-bold text-stone-900">
                            ₹{discountedSum.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">Bundle Card Title</label>
                          <input
                            type="text"
                            value={lookForm.bundleTitle}
                            onChange={(e) => setLookForm({ ...lookForm, bundleTitle: e.target.value })}
                            placeholder="Curated Ensemble Bundle (3 Pieces)"
                            className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                          />
                        </div>

                        <div>
                          <label className="block text-stone-600 font-semibold mb-1">Bundle Discount (%)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              max={50}
                              value={lookForm.bundleDiscountPercent ?? 15}
                              onChange={(e) =>
                                setLookForm({ ...lookForm, bundleDiscountPercent: Number(e.target.value) })
                              }
                              className="w-20 px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                            />
                            <span className="text-stone-500 text-[11px]">
                              Total savings: <strong>₹{savings.toLocaleString('en-IN')}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-stone-600 font-semibold mb-1">Perk Badge Prose</label>
                        <input
                          type="text"
                          value={lookForm.bundlePerkText}
                          onChange={(e) => setLookForm({ ...lookForm, bundlePerkText: e.target.value })}
                          placeholder="Special 15% Lookbook Discount Applied"
                          className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer transition flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-amber-400" />
                    <span>Save Lookbook & Ensemble</span>
                  </button>
                </div>
              </div>

            </div>
          </form>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 8: ⭐ CUSTOMER REVIEWS & STARS ("SEEN ON OUR MUSES") */}
      {/* ========================================================================= */}
      {isVisible('reviews') && (
        <section id="section-reviews" className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-base font-bold text-stone-900">
                  8. Customer Reviews & Moderation Queue (&quot;Seen on Our Muses&quot;)
                </h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {reviews.length} Total
                </span>
                {reviews.filter((r) => r.status === 'pending').length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {reviews.filter((r) => r.status === 'pending').length} Pending Approval
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Review and moderate customer feedback before it appears on the homepage. Approve high-fashion client photos or reject inappropriate submissions.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingReview(true)}
              className="bg-stone-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer Review</span>
            </button>
          </div>

          {/* Moderation Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                reviewFilter === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                reviewFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              <span>Pending Moderation ({reviews.filter((r) => r.status === 'pending').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('approved')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                reviewFilter === 'approved'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approved & Live ({reviews.filter((r) => r.status === undefined || r.status === 'approved').length})</span>
            </button>
            <button
              type="button"
              onClick={() => setReviewFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                reviewFilter === 'rejected'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              <X className="w-3.5 h-3.5" />
              <span>Rejected ({reviews.filter((r) => r.status === 'rejected').length})</span>
            </button>
          </div>

          {/* Reviews Grid */}
          {reviews.filter((r) => {
            if (reviewFilter === 'pending') return r.status === 'pending';
            if (reviewFilter === 'approved') return r.status === undefined || r.status === 'approved';
            if (reviewFilter === 'rejected') return r.status === 'rejected';
            return true;
          }).length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-500">
              No reviews in the &quot;{reviewFilter}&quot; moderation queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews
                .filter((r) => {
                  if (reviewFilter === 'pending') return r.status === 'pending';
                  if (reviewFilter === 'approved') return r.status === undefined || r.status === 'approved';
                  if (reviewFilter === 'rejected') return r.status === 'rejected';
                  return true;
                })
                .map((rev) => {
                  const isPending = rev.status === 'pending';
                  const isRejected = rev.status === 'rejected';
                  const isApproved = rev.status === 'approved' || rev.status === undefined;

                  return (
                    <div
                      key={rev.id}
                      className={`p-4 rounded-xl border space-y-3 text-xs transition-all ${
                        isPending
                          ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-100'
                          : isRejected
                          ? 'bg-rose-50/40 border-rose-200 opacity-80'
                          : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      {/* Top bar with reviewer and status */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={rev.image}
                            alt={rev.name}
                            className="w-11 h-11 rounded-full object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <h4 className="font-bold text-stone-900 text-xs">{rev.name}</h4>
                            <p className="text-[10px] text-stone-500">{rev.location}</p>
                            <div className="flex text-amber-500 mt-0.5">
                              {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            isPending
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : isRejected
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {isPending && '⏳ Pending Approval'}
                          {isApproved && '✓ Live on Homepage'}
                          {isRejected && '✕ Rejected'}
                        </span>
                      </div>

                      {/* Review Quote */}
                      <p className="text-stone-700 italic text-[11px] line-clamp-3 leading-relaxed">
                        &quot;{rev.quote}&quot;
                      </p>

                      <div className="pt-2 border-t border-stone-200 text-[10px] text-stone-500 flex items-center justify-between">
                        <span className="truncate max-w-[150px]">Styled: <strong>{rev.productName}</strong></span>
                        <span className="text-[10px] text-stone-400 font-mono">{rev.date}</span>
                      </div>

                      {/* Moderation Actions Toolbar */}
                      <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => moderateReview(rev.id, 'approved', true)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                              >
                                <Check className="w-3 h-3" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => moderateReview(rev.id, 'rejected')}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                              >
                                <X className="w-3 h-3" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <button
                              type="button"
                              onClick={() => moderateReview(rev.id, 'rejected')}
                              className="px-2 py-1 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-semibold text-[10px] cursor-pointer transition-colors"
                            >
                              Hide / Reject
                            </button>
                          )}

                          {isRejected && (
                            <button
                              type="button"
                              onClick={() => moderateReview(rev.id, 'approved', true)}
                              className="px-2 py-1 text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg font-semibold text-[10px] cursor-pointer transition-colors flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              <span>Re-Approve</span>
                            </button>
                          )}
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingReview(rev)}
                            className="p-1 text-stone-600 hover:text-black rounded hover:bg-stone-200/60 cursor-pointer"
                            title="Edit Review"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete review by ${rev.name}?`)) deleteReview(rev.id);
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 9: ❓ HOMEPAGE FAQS ACCORDIONS */}
      {/* ========================================================================= */}
      {isVisible('faqs') && (
        <section id="section-faqs" className="space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-stone-700" />
                <h3 className="text-base font-bold text-stone-900">
                  9. Homepage FAQs Accordions
                </h3>
                <span className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {faqs.length} FAQs
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Add, edit, or remove the transparent question accordions displayed right before the footer.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingFaq(true)}
              className="bg-stone-900 hover:bg-black text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs">{faq.question}</h4>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setEditingFaq(faq)}
                      className="p-1 text-stone-600 hover:text-black rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete FAQ?`)) deleteFaq(faq.id);
                      }}
                      className="p-1 text-rose-500 hover:text-rose-700 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed text-[11px]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* 1. Add Deal Modal */}
      {isAddingDeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Add Flash Deal Banner</h3>
              <button type="button" onClick={() => setIsAddingDeal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDeal} className="space-y-3">
              <ImageUploader
                label="Deal Product Image"
                currentImage={newDealForm.image || '/assets/extracted/prod_floral_coord.png'}
                onImageChange={(img) => setNewDealForm({ ...newDealForm, image: img })}
                aspectRatioClass="aspect-square"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Deal Title</label>
                  <input
                    type="text"
                    required
                    value={newDealForm.title || ''}
                    onChange={(e) => setNewDealForm({ ...newDealForm, title: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Discount Text</label>
                  <input
                    type="text"
                    required
                    value={newDealForm.discountText || ''}
                    onChange={(e) => setNewDealForm({ ...newDealForm, discountText: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Promo Code</label>
                  <input
                    type="text"
                    required
                    value={newDealForm.promoCode || ''}
                    onChange={(e) => setNewDealForm({ ...newDealForm, promoCode: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={newDealForm.subtitle || ''}
                    onChange={(e) => setNewDealForm({ ...newDealForm, subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddingDeal(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Create Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Deal Modal */}
      {editingDeal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Edit Deal Banner</h3>
              <button type="button" onClick={() => setEditingDeal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveDeal} className="space-y-3">
              <ImageUploader
                label="Deal Product Image"
                currentImage={editingDeal.image}
                onImageChange={(img) => setEditingDeal({ ...editingDeal, image: img })}
                aspectRatioClass="aspect-square"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Deal Title</label>
                  <input
                    type="text"
                    value={editingDeal.title}
                    onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Discount Text</label>
                  <input
                    type="text"
                    value={editingDeal.discountText}
                    onChange={(e) => setEditingDeal({ ...editingDeal, discountText: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Promo Code</label>
                  <input
                    type="text"
                    value={editingDeal.promoCode}
                    onChange={(e) => setEditingDeal({ ...editingDeal, promoCode: e.target.value.toUpperCase() })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingDeal.subtitle || ''}
                    onChange={(e) => setEditingDeal({ ...editingDeal, subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingDeal(null)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Add Festive Card Modal */}
      {isAddingFestiveCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Add Festive Showcase Card</h3>
              <button type="button" onClick={() => setIsAddingFestiveCard(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFestiveCard} className="space-y-3">
              <ImageUploader
                label="Model Photo"
                currentImage={newFestiveCardForm.image || '/assets/extracted/banner_festive_clean.png'}
                onImageChange={(img) => setNewFestiveCardForm({ ...newFestiveCardForm, image: img })}
                aspectRatioClass="aspect-[4/3]"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={newFestiveCardForm.headline || ''}
                    onChange={(e) => setNewFestiveCardForm({ ...newFestiveCardForm, headline: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Offer Text</label>
                  <input
                    type="text"
                    required
                    value={newFestiveCardForm.offerText || ''}
                    onChange={(e) => setNewFestiveCardForm({ ...newFestiveCardForm, offerText: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Badge</label>
                  <input
                    type="text"
                    value={newFestiveCardForm.badge || ''}
                    onChange={(e) => setNewFestiveCardForm({ ...newFestiveCardForm, badge: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={newFestiveCardForm.subtitle || ''}
                    onChange={(e) => setNewFestiveCardForm({ ...newFestiveCardForm, subtitle: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Target Product</label>
                <select
                  value={newFestiveCardForm.productId || products[0]?.id}
                  onChange={(e) => setNewFestiveCardForm({ ...newFestiveCardForm, productId: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddingFestiveCard(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Publish Card</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Edit Festive Card Modal */}
      {editingFestiveCard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Edit Festive Showcase Card</h3>
              <button type="button" onClick={() => setEditingFestiveCard(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveFestiveCard} className="space-y-3">
              <ImageUploader
                label="Model Photo"
                currentImage={editingFestiveCard.image}
                onImageChange={(img) => setEditingFestiveCard({ ...editingFestiveCard, image: img })}
                aspectRatioClass="aspect-[4/3]"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Headline</label>
                  <input
                    type="text"
                    value={editingFestiveCard.headline}
                    onChange={(e) => setEditingFestiveCard({ ...editingFestiveCard, headline: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Offer Text</label>
                  <input
                    type="text"
                    value={editingFestiveCard.offerText}
                    onChange={(e) => setEditingFestiveCard({ ...editingFestiveCard, offerText: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Target Product</label>
                <select
                  value={editingFestiveCard.productId || products[0]?.id}
                  onChange={(e) => setEditingFestiveCard({ ...editingFestiveCard, productId: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingFestiveCard(null)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Add Review Modal */}
      {isAddingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Add Customer Review</h3>
              <button type="button" onClick={() => setIsAddingReview(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateReview} className="space-y-3">
              <ImageUploader
                label="Customer Photo"
                currentImage={newReviewForm.image || '/assets/extracted/prod_pearl_earrings.png'}
                onImageChange={(img) => setNewReviewForm({ ...newReviewForm, image: img })}
                aspectRatioClass="aspect-square"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={newReviewForm.name || ''}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newReviewForm.location || ''}
                    onChange={(e) => setNewReviewForm({ ...newReviewForm, location: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Review Quote</label>
                <textarea
                  rows={3}
                  required
                  value={newReviewForm.quote || ''}
                  onChange={(e) => setNewReviewForm({ ...newReviewForm, quote: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddingReview(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Publish Review</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Edit Customer Review</h3>
              <button type="button" onClick={() => setEditingReview(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveReview} className="space-y-3">
              <ImageUploader
                label="Customer Photo"
                currentImage={editingReview.image}
                onImageChange={(img) => setEditingReview({ ...editingReview, image: img })}
                aspectRatioClass="aspect-square"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editingReview.name}
                    onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={editingReview.location}
                    onChange={(e) => setEditingReview({ ...editingReview, location: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Review Quote</label>
                <textarea
                  rows={3}
                  value={editingReview.quote}
                  onChange={(e) => setEditingReview({ ...editingReview, quote: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setEditingReview(null)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Add FAQ Modal */}
      {isAddingFaq && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4 my-8 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-bold text-stone-900 text-sm">Add New FAQ to Homepage</h3>
              <button type="button" onClick={() => setIsAddingFaq(false)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFaq} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Question Text</label>
                <input
                  type="text"
                  required
                  value={newFaqForm.question}
                  onChange={(e) => setNewFaqForm({ ...newFaqForm, question: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Answer Text</label>
                <textarea
                  rows={4}
                  required
                  value={newFaqForm.answer}
                  onChange={(e) => setNewFaqForm({ ...newFaqForm, answer: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsAddingFaq(false)} className="px-3 py-1.5 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded">Publish FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Add Hero Slide Modal */}
      {isAddingHeroSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-stone-900 text-sm">Add New Hero Carousel Slide</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingHeroSlide(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Miniature Preview */}
            <div className="space-y-1.5">
              <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider block">
                Live Banner Preview
              </span>
              <div className="relative aspect-[1312/360] min-h-[140px] rounded-xl overflow-hidden border border-stone-300 shadow-inner flex items-center p-4">
                <img
                  src={newHeroSlideForm.image || '/assets/extracted/hero_clean_bg.png'}
                  alt="Slide preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    newHeroSlideForm.isDarkText
                      ? 'bg-gradient-to-r from-stone-100/70 via-stone-100/30 to-transparent'
                      : 'bg-gradient-to-r from-stone-950/70 via-stone-950/40 to-transparent'
                  }`}
                />
                <div className="relative z-10 max-w-xs space-y-1">
                  <span
                    className={`text-[8px] font-semibold tracking-widest uppercase block ${
                      newHeroSlideForm.isDarkText ? 'text-stone-700' : 'text-[#E07A5F]'
                    }`}
                  >
                    {newHeroSlideForm.brandTag || 'F O A X X'}
                  </span>
                  <h4
                    className={`font-serif font-bold text-base leading-tight ${
                      newHeroSlideForm.isDarkText ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    {newHeroSlideForm.titlePart1 || 'YOUR STYLE.'}
                    {newHeroSlideForm.titlePart2 && <br />}
                    {newHeroSlideForm.titlePart2 && `${newHeroSlideForm.titlePart2} `}
                    <span style={{ color: newHeroSlideForm.accentColor || '#DE7A62' }}>
                      {newHeroSlideForm.statementWord || 'STATEMENT.'}
                    </span>
                  </h4>
                  <p
                    className={`text-[9px] line-clamp-1 ${
                      newHeroSlideForm.isDarkText ? 'text-stone-700' : 'text-stone-200'
                    }`}
                  >
                    {newHeroSlideForm.subtitle}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-black text-white rounded text-[8px] font-bold">
                      {newHeroSlideForm.primaryBtnText || 'SHOP NOW'}
                    </span>
                    {newHeroSlideForm.secondaryBtnText && (
                      <span className="px-2 py-0.5 border border-stone-400 bg-white/40 text-stone-900 rounded text-[8px] font-bold">
                        {newHeroSlideForm.secondaryBtnText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreateHeroSlide} className="space-y-4">
              {/* Image Uploader & Quick Presets */}
              <div className="space-y-2">
                <ImageUploader
                  label="Hero Slide Background Image"
                  currentImage={newHeroSlideForm.image || '/assets/extracted/hero_clean_bg.png'}
                  onImageChange={(img) => setNewHeroSlideForm({ ...newHeroSlideForm, image: img })}
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-stone-500 font-semibold">Quick Presets:</span>
                  {[
                    { label: 'Original Model', url: '/assets/aistudio/image_e1c6b041.png' },
                    { label: 'Clean Luxury', url: '/assets/extracted/hero_clean_bg.png' },
                    { label: 'Polki Jewellery', url: '/assets/extracted/banner_jewellery_clean.png' },
                    { label: 'Festive Glam', url: '/assets/extracted/banner_festive_clean.png' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setNewHeroSlideForm({ ...newHeroSlideForm, image: preset.url })}
                      className="text-[10px] px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 text-stone-700 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Brand Tag</label>
                  <input
                    type="text"
                    value={newHeroSlideForm.brandTag}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, brandTag: e.target.value })}
                    placeholder="e.g. F O A X X"
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Headline Part 1</label>
                  <input
                    type="text"
                    required
                    value={newHeroSlideForm.titlePart1}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, titlePart1: e.target.value })}
                    placeholder="e.g. YOUR STYLE."
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Headline Part 2 (Optional)</label>
                  <input
                    type="text"
                    value={newHeroSlideForm.titlePart2}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, titlePart2: e.target.value })}
                    placeholder="e.g. YOUR"
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Highlighted Statement Word</label>
                  <input
                    type="text"
                    required
                    value={newHeroSlideForm.statementWord}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, statementWord: e.target.value })}
                    placeholder="e.g. STATEMENT."
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif font-bold text-amber-700"
                  />
                </div>
              </div>

              {/* Accent Word Color Presets */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Accent Word Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Terracotta', hex: '#DE7A62' },
                    { label: 'Imperial Gold', hex: '#D4AF37' },
                    { label: 'Emerald Green', hex: '#2D6A4F' },
                    { label: 'Crimson Noir', hex: '#9B2226' },
                    { label: 'Onyx Black', hex: '#1C1B1A' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setNewHeroSlideForm({ ...newHeroSlideForm, accentColor: c.hex })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] cursor-pointer transition ${
                        newHeroSlideForm.accentColor === c.hex
                          ? 'border-stone-900 bg-stone-100 font-bold'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                  <input
                    type="text"
                    value={newHeroSlideForm.accentColor || '#DE7A62'}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, accentColor: e.target.value })}
                    className="w-24 px-2 py-1 border border-stone-200 rounded font-mono text-[10px]"
                    placeholder="#DE7A62"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Subtitle Prose</label>
                <input
                  type="text"
                  value={newHeroSlideForm.subtitle}
                  onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, subtitle: e.target.value })}
                  placeholder="e.g. Discover the pieces that make every moment yours."
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>

              {/* Buttons and Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold">Primary Button (Solid Black)</label>
                  <input
                    type="text"
                    value={newHeroSlideForm.primaryBtnText}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, primaryBtnText: e.target.value })}
                    placeholder="e.g. SHOP NEW ARRIVALS →"
                    className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-600">
                    <span>Target Category:</span>
                    <select
                      value={newHeroSlideForm.primaryBtnLinkCategory || 'All'}
                      onChange={(e) =>
                        setNewHeroSlideForm({ ...newHeroSlideForm, primaryBtnLinkCategory: e.target.value })
                      }
                      className="bg-white border border-stone-200 rounded px-1.5 py-0.5"
                    >
                      <option value="All">All Items</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Bags">Bags</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold">Secondary Button (Outlined)</label>
                  <input
                    type="text"
                    value={newHeroSlideForm.secondaryBtnText}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, secondaryBtnText: e.target.value })}
                    placeholder="e.g. EXPLORE COLLECTION"
                    className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-600">
                    <span>Target Category:</span>
                    <select
                      value={newHeroSlideForm.secondaryBtnLinkCategory || 'Jewellery'}
                      onChange={(e) =>
                        setNewHeroSlideForm({ ...newHeroSlideForm, secondaryBtnLinkCategory: e.target.value })
                      }
                      className="bg-white border border-stone-200 rounded px-1.5 py-0.5"
                    >
                      <option value="All">All Items</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Bags">Bags</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Theme & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 block">Text Contrast Theme</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="addThemeStyle"
                        checked={newHeroSlideForm.isDarkText === true}
                        onChange={() => setNewHeroSlideForm({ ...newHeroSlideForm, isDarkText: true })}
                        className="accent-stone-900"
                      />
                      <span>Dark Text (for light photos)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="addThemeStyle"
                        checked={newHeroSlideForm.isDarkText === false}
                        onChange={() => setNewHeroSlideForm({ ...newHeroSlideForm, isDarkText: false })}
                        className="accent-stone-900"
                      />
                      <span>Light Text (for dark photos)</span>
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={newHeroSlideForm.isActive !== false}
                    onChange={(e) => setNewHeroSlideForm({ ...newHeroSlideForm, isActive: e.target.checked })}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span>Active on Homepage</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddingHeroSlide(false)}
                  className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Publish Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Edit Hero Slide Modal */}
      {editingHeroSlide && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Edit Hero Carousel Slide #{editingHeroSlide.order || 1}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingHeroSlide(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Live Interactive Miniature Preview */}
            <div className="space-y-1.5">
              <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider block">
                Live Banner Preview
              </span>
              <div className="relative aspect-[1312/360] min-h-[140px] rounded-xl overflow-hidden border border-stone-300 shadow-inner flex items-center p-4">
                <img
                  src={editingHeroSlide.image || '/assets/extracted/hero_clean_bg.png'}
                  alt="Slide preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 pointer-events-none ${
                    editingHeroSlide.isDarkText
                      ? 'bg-gradient-to-r from-stone-100/70 via-stone-100/30 to-transparent'
                      : 'bg-gradient-to-r from-stone-950/70 via-stone-950/40 to-transparent'
                  }`}
                />
                <div className="relative z-10 max-w-xs space-y-1">
                  <span
                    className={`text-[8px] font-semibold tracking-widest uppercase block ${
                      editingHeroSlide.isDarkText ? 'text-stone-700' : 'text-[#E07A5F]'
                    }`}
                  >
                    {editingHeroSlide.brandTag || 'F O A X X'}
                  </span>
                  <h4
                    className={`font-serif font-bold text-base leading-tight ${
                      editingHeroSlide.isDarkText ? 'text-stone-900' : 'text-white'
                    }`}
                  >
                    {editingHeroSlide.titlePart1 || 'YOUR STYLE.'}
                    {editingHeroSlide.titlePart2 && <br />}
                    {editingHeroSlide.titlePart2 && `${editingHeroSlide.titlePart2} `}
                    <span style={{ color: editingHeroSlide.accentColor || '#DE7A62' }}>
                      {editingHeroSlide.statementWord || 'STATEMENT.'}
                    </span>
                  </h4>
                  <p
                    className={`text-[9px] line-clamp-1 ${
                      editingHeroSlide.isDarkText ? 'text-stone-700' : 'text-stone-200'
                    }`}
                  >
                    {editingHeroSlide.subtitle}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2 py-0.5 bg-black text-white rounded text-[8px] font-bold">
                      {editingHeroSlide.primaryBtnText || 'SHOP NOW'}
                    </span>
                    {editingHeroSlide.secondaryBtnText && (
                      <span className="px-2 py-0.5 border border-stone-400 bg-white/40 text-stone-900 rounded text-[8px] font-bold">
                        {editingHeroSlide.secondaryBtnText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-4">
              {/* Image Uploader & Presets */}
              <div className="space-y-2">
                <ImageUploader
                  label="Hero Slide Background Image"
                  currentImage={editingHeroSlide.image || '/assets/extracted/hero_clean_bg.png'}
                  onImageChange={(img) => setEditingHeroSlide({ ...editingHeroSlide, image: img })}
                />
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] text-stone-500 font-semibold">Quick Presets:</span>
                  {[
                    { label: 'Original Model', url: '/assets/aistudio/image_e1c6b041.png' },
                    { label: 'Clean Luxury', url: '/assets/extracted/hero_clean_bg.png' },
                    { label: 'Polki Jewellery', url: '/assets/extracted/banner_jewellery_clean.png' },
                    { label: 'Festive Glam', url: '/assets/extracted/banner_festive_clean.png' },
                  ].map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => setEditingHeroSlide({ ...editingHeroSlide, image: preset.url })}
                      className="text-[10px] px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded border border-stone-200 text-stone-700 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Brand Tag</label>
                  <input
                    type="text"
                    value={editingHeroSlide.brandTag}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, brandTag: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Headline Part 1</label>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.titlePart1}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, titlePart1: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Headline Part 2 (Optional)</label>
                  <input
                    type="text"
                    value={editingHeroSlide.titlePart2}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, titlePart2: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-semibold mb-1">Highlighted Statement Word</label>
                  <input
                    type="text"
                    required
                    value={editingHeroSlide.statementWord}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, statementWord: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-serif font-bold text-amber-700"
                  />
                </div>
              </div>

              {/* Accent Word Color Presets */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">
                  Accent Word Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { label: 'Terracotta', hex: '#DE7A62' },
                    { label: 'Imperial Gold', hex: '#D4AF37' },
                    { label: 'Emerald Green', hex: '#2D6A4F' },
                    { label: 'Crimson Noir', hex: '#9B2226' },
                    { label: 'Onyx Black', hex: '#1C1B1A' },
                  ].map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setEditingHeroSlide({ ...editingHeroSlide, accentColor: c.hex })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] cursor-pointer transition ${
                        editingHeroSlide.accentColor === c.hex
                          ? 'border-stone-900 bg-stone-100 font-bold'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.label}</span>
                    </button>
                  ))}
                  <input
                    type="text"
                    value={editingHeroSlide.accentColor || '#DE7A62'}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, accentColor: e.target.value })}
                    className="w-24 px-2 py-1 border border-stone-200 rounded font-mono text-[10px]"
                    placeholder="#DE7A62"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-stone-600 font-semibold mb-1">Subtitle Prose</label>
                <input
                  type="text"
                  value={editingHeroSlide.subtitle}
                  onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, subtitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>

              {/* Buttons and Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold">Primary Button (Solid Black)</label>
                  <input
                    type="text"
                    value={editingHeroSlide.primaryBtnText}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, primaryBtnText: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-600">
                    <span>Target Category:</span>
                    <select
                      value={editingHeroSlide.primaryBtnLinkCategory || 'All'}
                      onChange={(e) =>
                        setEditingHeroSlide({ ...editingHeroSlide, primaryBtnLinkCategory: e.target.value })
                      }
                      className="bg-white border border-stone-200 rounded px-1.5 py-0.5"
                    >
                      <option value="All">All Items</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Bags">Bags</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-stone-800 font-bold">Secondary Button (Outlined)</label>
                  <input
                    type="text"
                    value={editingHeroSlide.secondaryBtnText}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, secondaryBtnText: e.target.value })}
                    className="w-full px-2 py-1.5 bg-white border border-stone-200 rounded"
                  />
                  <div className="flex items-center gap-1.5 text-[10px] text-stone-600">
                    <span>Target Category:</span>
                    <select
                      value={editingHeroSlide.secondaryBtnLinkCategory || 'Jewellery'}
                      onChange={(e) =>
                        setEditingHeroSlide({ ...editingHeroSlide, secondaryBtnLinkCategory: e.target.value })
                      }
                      className="bg-white border border-stone-200 rounded px-1.5 py-0.5"
                    >
                      <option value="All">All Items</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Bags">Bags</option>
                      <option value="Footwear">Footwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Text Theme & Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-lg border border-stone-200">
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 block">Text Contrast Theme</span>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editThemeStyle"
                        checked={editingHeroSlide.isDarkText === true}
                        onChange={() => setEditingHeroSlide({ ...editingHeroSlide, isDarkText: true })}
                        className="accent-stone-900"
                      />
                      <span>Dark Text (for light photos)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="editThemeStyle"
                        checked={editingHeroSlide.isDarkText === false}
                        onChange={() => setEditingHeroSlide({ ...editingHeroSlide, isDarkText: false })}
                        className="accent-stone-900"
                      />
                      <span>Light Text (for dark photos)</span>
                    </label>
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={editingHeroSlide.isActive !== false}
                    onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, isActive: e.target.checked })}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <span>Active on Homepage</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingHeroSlide(null)}
                  className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Add New Occasion Modal */}
      {isAddingOccasion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚜️</span>
                <h3 className="font-bold text-stone-900 text-sm">Add New Occasion Capsule</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingOccasion(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOccasion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Occasion Tab Label *</label>
                  <input
                    type="text"
                    required
                    value={newOccasionForm.label}
                    onChange={(e) => setNewOccasionForm({ ...newOccasionForm, label: e.target.value })}
                    placeholder="e.g. Sangeet & Mehendi Gala"
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-semibold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Tab Emoji Icon</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={newOccasionForm.icon}
                      onChange={(e) => setNewOccasionForm({ ...newOccasionForm, icon: e.target.value })}
                      placeholder="⚜️"
                      className="w-14 px-2 py-1.5 border border-stone-200 rounded text-center text-base"
                    />
                    <div className="flex items-center gap-1">
                      {['⚜️', '🍸', '🥂', '✨', '🎁', '💃', '💍'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewOccasionForm({ ...newOccasionForm, icon: emoji })}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-xs flex items-center justify-center cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Occasion Tagline Prose *</label>
                <input
                  type="text"
                  required
                  value={newOccasionForm.tagline}
                  onChange={(e) => setNewOccasionForm({ ...newOccasionForm, tagline: e.target.value })}
                  placeholder="e.g. Opulent Jadau, uncut Polki statement haars, and rich embroidered silhouettes."
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>

              {/* Spotlight Imagery & Headlines */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-xs">Hero Spotlight Imagery & Text</h4>
                
                <ImageUploader
                  label="Spotlight Image (High-res horizontal photo)"
                  currentImage={newOccasionForm.heroImage || '/assets/extracted/banner_festive_clean.png'}
                  onImageChange={(img) => setNewOccasionForm({ ...newOccasionForm, heroImage: img })}
                  aspectRatioClass="aspect-[16/10]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={newOccasionForm.heroTitle}
                      onChange={(e) => setNewOccasionForm({ ...newOccasionForm, heroTitle: e.target.value })}
                      placeholder="e.g. Imperial Festive Grandeur"
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={newOccasionForm.heroBadge}
                      onChange={(e) => setNewOccasionForm({ ...newOccasionForm, heroBadge: e.target.value })}
                      placeholder="e.g. BRIDAL & TROUSSEAU"
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white uppercase text-[10px] tracking-wider"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Atelier Stylist Advice Quote</label>
                  <textarea
                    rows={2}
                    value={newOccasionForm.stylistNote}
                    onChange={(e) => setNewOccasionForm({ ...newOccasionForm, stylistNote: e.target.value })}
                    placeholder="e.g. “For wedding grandeur, pair a cascading pearl choker with heavy polki studs...”"
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white text-stone-700 italic"
                  />
                </div>
              </div>

              {/* Linked 3 Products */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs">Curated 3-Piece Capsule Products</h4>
                  <span className="text-[10px] text-stone-500 font-mono">3 pieces will form the bundle</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((slotIdx) => {
                    const selectedId = newOccasionForm.bundleProductIds?.[slotIdx] || '';
                    const matched = products.find((p) => p.id === selectedId);

                    return (
                      <div key={slotIdx} className="p-2 bg-white rounded-lg border border-stone-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-500 block uppercase">
                          Slot {slotIdx + 1}
                        </span>
                        <select
                          value={selectedId}
                          onChange={(e) => {
                            const updated = [...(newOccasionForm.bundleProductIds || ['prod-2', 'prod-4', 'prod-1'])];
                            updated[slotIdx] = e.target.value;
                            setNewOccasionForm({ ...newOccasionForm, bundleProductIds: updated });
                          }}
                          className="w-full border border-stone-300 rounded p-1 text-[11px] truncate bg-stone-50"
                        >
                          <option value="">-- Choose item --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.category}] {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>

                        {matched && (
                          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                            <img src={matched.image} alt={matched.name} className="w-8 h-10 object-cover rounded" />
                            <div className="min-w-0">
                              <span className="font-semibold truncate block text-[10px] text-stone-800">{matched.name}</span>
                              <span className="text-[10px] font-bold text-stone-900">₹{matched.price}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visibility Switch */}
              <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                <input
                  type="checkbox"
                  checked={newOccasionForm.isActive !== false}
                  onChange={(e) => setNewOccasionForm({ ...newOccasionForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="font-semibold text-stone-800">Show this occasion tab live on the homepage</span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddingOccasion(false)}
                  className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Create Occasion Capsule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 11. Edit Occasion Modal */}
      {editingOccasion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl space-y-4 my-8 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">{editingOccasion.icon || '⚜️'}</span>
                <h3 className="font-bold text-stone-900 text-sm">
                  Edit Occasion: {editingOccasion.label}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOccasion(null)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditingOccasion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Occasion Tab Label *</label>
                  <input
                    type="text"
                    required
                    value={editingOccasion.label}
                    onChange={(e) => setEditingOccasion({ ...editingOccasion, label: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded font-semibold text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Tab Emoji Icon</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={editingOccasion.icon}
                      onChange={(e) => setEditingOccasion({ ...editingOccasion, icon: e.target.value })}
                      className="w-14 px-2 py-1.5 border border-stone-200 rounded text-center text-base"
                    />
                    <div className="flex items-center gap-1">
                      {['⚜️', '🍸', '🥂', '✨', '🎁', '💃', '💍'].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setEditingOccasion({ ...editingOccasion, icon: emoji })}
                          className="w-6 h-6 rounded bg-stone-100 hover:bg-stone-200 text-xs flex items-center justify-center cursor-pointer"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Occasion Tagline Prose *</label>
                <input
                  type="text"
                  required
                  value={editingOccasion.tagline}
                  onChange={(e) => setEditingOccasion({ ...editingOccasion, tagline: e.target.value })}
                  className="w-full px-2.5 py-1.5 border border-stone-200 rounded"
                />
              </div>

              {/* Spotlight Imagery & Headlines */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-stone-900 text-xs">Hero Spotlight Imagery & Text</h4>

                <ImageUploader
                  label="Spotlight Image (High-res horizontal photo)"
                  currentImage={editingOccasion.heroImage || '/assets/extracted/banner_festive_clean.png'}
                  onImageChange={(img) => setEditingOccasion({ ...editingOccasion, heroImage: img })}
                  aspectRatioClass="aspect-[16/10]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Hero Title</label>
                    <input
                      type="text"
                      value={editingOccasion.heroTitle}
                      onChange={(e) => setEditingOccasion({ ...editingOccasion, heroTitle: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white font-serif"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Hero Badge Text</label>
                    <input
                      type="text"
                      value={editingOccasion.heroBadge}
                      onChange={(e) => setEditingOccasion({ ...editingOccasion, heroBadge: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white uppercase text-[10px] tracking-wider"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Atelier Stylist Advice Quote</label>
                  <textarea
                    rows={2}
                    value={editingOccasion.stylistNote}
                    onChange={(e) => setEditingOccasion({ ...editingOccasion, stylistNote: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-stone-200 rounded bg-white text-stone-700 italic"
                  />
                </div>
              </div>

              {/* Linked 3 Products */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-xs">Curated 3-Piece Capsule Products</h4>
                  <span className="text-[10px] text-stone-500 font-mono">3 pieces will form the bundle</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((slotIdx) => {
                    const selectedId = editingOccasion.bundleProductIds?.[slotIdx] || '';
                    const matched = products.find((p) => p.id === selectedId);

                    return (
                      <div key={slotIdx} className="p-2 bg-white rounded-lg border border-stone-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-500 block uppercase">
                          Slot {slotIdx + 1}
                        </span>
                        <select
                          value={selectedId}
                          onChange={(e) => {
                            const updated = [...(editingOccasion.bundleProductIds || ['prod-2', 'prod-4', 'prod-1'])];
                            updated[slotIdx] = e.target.value;
                            setEditingOccasion({ ...editingOccasion, bundleProductIds: updated });
                          }}
                          className="w-full border border-stone-300 rounded p-1 text-[11px] truncate bg-stone-50"
                        >
                          <option value="">-- Choose item --</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.category}] {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>

                        {matched && (
                          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
                            <img src={matched.image} alt={matched.name} className="w-8 h-10 object-cover rounded" />
                            <div className="min-w-0">
                              <span className="font-semibold truncate block text-[10px] text-stone-800">{matched.name}</span>
                              <span className="text-[10px] font-bold text-stone-900">₹{matched.price}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Visibility Switch */}
              <label className="flex items-center gap-2 cursor-pointer p-2.5 bg-stone-50 rounded-lg border border-stone-200">
                <input
                  type="checkbox"
                  checked={editingOccasion.isActive !== false}
                  onChange={(e) => setEditingOccasion({ ...editingOccasion, isActive: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span className="font-semibold text-stone-800">Show this occasion tab live on the homepage</span>
              </label>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingOccasion(null)}
                  className="px-3 py-1.5 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 cursor-pointer font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Save Occasion Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
