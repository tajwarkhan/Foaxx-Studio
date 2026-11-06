import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_FAQS,
  INITIAL_HOMEPAGE_CONFIG,
  INITIAL_HERO_SLIDES,
  INITIAL_HERO_CAROUSEL_SETTINGS,
  INITIAL_ORDERS,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  INITIAL_SHOP_BY_OCCASION,
  INITIAL_SHOP_THE_LOOK,
} from '../data/initialData';
import { initAuth, logoutGoogle, sendFirebasePasswordReset } from '../lib/firebase';
import {
  CartItem,
  CategoryItem,
  CoinTransaction,
  CoinWallet,
  Coupon,
  CustomerReview,
  FaqItem,
  FestivePickCard,
  FestivePicksConfig,
  FlashDealOffer,
  FlashDealsConfig,
  GiftOption,
  HeroCarouselSettings,
  HeroSlide,
  HomepageConfig,
  OccasionCardConfig,
  OccasionSaleBannerConfig,
  Order,
  Product,
  ProductReviewItem,
  ShippingAddress,
  ShopByOccasionConfig,
  ShopTheLookConfig,
  AppNotification,
  EmailTemplate,
  SentCampaignLog,
  TransactionalEmailLog,
  SubscriberUser,
  NotificationTarget,
  NotificationChannel,
  ManagerAccount,
  ManagerPermission,
  AppTask,
  TaskPriority,
  TaskStatus,
  TaskNoteEntry,
} from '../types';
import {
  SYSTEM_SENDER_EMAIL,
  SYSTEM_SENDER_NAME,
  generateWelcomeEmailHtml,
  generatePasswordResetEmailHtml,
  generateOrderConfirmationEmailHtml,
  generateShipmentStatusEmailHtml,
  sendTransactionalEmail,
} from '../services/transactionalEmailService';
import {
  INITIAL_EMAIL_TEMPLATES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SUBSCRIBERS,
  INITIAL_SENT_CAMPAIGNS,
} from '../data/initialMarketingData';
import { INITIAL_MANAGERS } from '../data/initialManagers';
import { INITIAL_TASKS } from '../data/initialTasks';

export type ViewType =
  | 'home'
  | 'shop'
  | 'product'
  | 'wishlist'
  | 'checkout'
  | 'account'
  | 'tracking'
  | 'admin'
  | 'manager'
  | 'policy'
  | 'auth';


interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

interface StoreContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authInitialMode: 'login' | 'signup';
  setAuthInitialMode: (mode: 'login' | 'signup') => void;
  openAuth: (mode?: 'login' | 'signup', asModal?: boolean) => void;
  activePolicy: string;
  setActivePolicy: (policy: string) => void;

  // Search Modal
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Size Guide Modal
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  sizeGuideCategory: string;
  setSizeGuideCategory: (cat: string) => void;

  // Tax Invoice Modal
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;

  // Recently Viewed
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // Gift Option
  giftOption: GiftOption;
  setGiftOption: React.Dispatch<React.SetStateAction<GiftOption>>;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  discountAmount: number;
  shippingAmount: number;
  giftAmount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Products & Admin state
  products: Product[];
  categories: CategoryItem[];
  homepageConfig: HomepageConfig;
  reviews: CustomerReview[];
  faqs: FaqItem[];
  orders: Order[];
  coupons: Coupon[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Review & Rating System with Picture & Reminders
  reviewedItems: string[];
  pendingReviewItems: { order: Order; product: Product; key: string }[];
  isReviewModalOpen: boolean;
  reviewModalProduct: Product | null;
  reviewModalOrderId: string | null;
  openReviewModal: (product: Product, orderId?: string) => void;
  closeReviewModal: () => void;
  addProductReview: (review: ProductReviewItem, orderId?: string) => void;

  // Order Operations (Real-time cancellation & returns)
  cancelOrder: (orderId: string, reason: string) => void;
  requestReturn: (orderId: string, reason: string) => void;

  // Admin mutation functions
  updateProduct: (product: Product) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateHomepageConfig: (config: HomepageConfig) => void;
  addReview: (review: CustomerReview) => void;
  updateReview: (review: CustomerReview) => void;
  deleteReview: (id: string) => void;
  moderateReview: (reviewId: string, status: 'approved' | 'rejected', featured?: boolean) => void;
  addFaq: (faq: FaqItem) => void;
  updateFaq: (faq: FaqItem) => void;
  deleteFaq: (id: string) => void;
  updateFlashDealsConfig: (config: FlashDealsConfig) => void;
  addFlashDeal: (deal: FlashDealOffer) => void;
  updateFlashDeal: (deal: FlashDealOffer) => void;
  deleteFlashDeal: (id: string) => void;
  updateFestivePicksConfig: (config: FestivePicksConfig) => void;
  addFestivePickCard: (card: FestivePickCard) => void;
  updateFestivePickCard: (card: FestivePickCard) => void;
  deleteFestivePickCard: (id: string) => void;
  updateOccasionSaleBanner: (config: OccasionSaleBannerConfig) => void;
  updateHeroSlides: (slides: HeroSlide[]) => void;
  addHeroSlide: (slide: HeroSlide) => void;
  updateHeroSlide: (slide: HeroSlide) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlide: (id: string, direction: 'up' | 'down') => void;
  updateHeroCarouselSettings: (settings: HeroCarouselSettings) => void;
  updateShopByOccasionConfig: (config: ShopByOccasionConfig) => void;
  addOccasionCard: (card: OccasionCardConfig) => void;
  updateOccasionCard: (card: OccasionCardConfig) => void;
  deleteOccasionCard: (id: string) => void;
  reorderOccasionCard: (id: string, direction: 'up' | 'down') => void;
  updateShopTheLookConfig: (config: ShopTheLookConfig) => void;
  updateOrderStatus: (orderId: string, status: Order['shippingStatus']) => void;
  updateOrderCourier: (
    orderId: string,
    courierData: {
      courier: string;
      trackingNumber: string;
      trackingUrl?: string;
      estimatedDelivery?: string;
      shippingStatus?: Order['shippingStatus'];
      logisticsNotes?: string;
      dispatchedAt?: string;
    }
  ) => void;
  markOrderDelayed: (
    orderId: string,
    delayData: {
      isDelayed: boolean;
      delayReason: string;
      revisedEstimatedDelivery?: string;
      logisticsNotes?: string;
      notifyCustomer?: boolean;
    }
  ) => void;
  cancelOrderWithDetails: (
    orderId: string,
    cancelData: {
      cancelledBy: 'Customer' | 'Admin' | 'Manager' | 'System';
      cancelReason: string;
      refundStatus?: 'Pending' | 'Refund Initiated' | 'Refund Completed' | 'Not Applicable';
      refundAmount?: number;
      refundMethod?: string;
      notifyCustomer?: boolean;
    }
  ) => void;
  markOrderDelivered: (
    orderId: string,
    deliveryData?: {
      deliveredAt?: string;
      deliveryNotes?: string;
      notifyCustomer?: boolean;
    }
  ) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  deleteCoupon: (code: string) => void;
  resetToDefaults: () => void;

  // FOAXX Coins & Rewards
  coinWallet: CoinWallet;
  earnCoins: (amount: number, description: string, referenceId?: string) => void;
  redeemCoins: (amount: number, description?: string) => boolean;
  redeemedCoinsAtCheckout: number;
  setRedeemedCoinsAtCheckout: (coins: number) => void;
  coinDiscountAmount: number;

  // Product Sharing & Modal
  isShareModalOpen: boolean;
  shareProduct: Product | null;
  openShareModal: (product: Product) => void;
  closeShareModal: () => void;

  // User & Checkout
  user: { name: string; email: string; phone: string; photoURL?: string } | null;
  setUser: (u: { name: string; email: string; phone: string; photoURL?: string } | null) => void;
  logoutUser: () => Promise<void>;
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: string) => Order;

  // Broadcast & Email Marketing Studio
  appNotifications: AppNotification[];
  unreadNotificationsCount: number;
  emailTemplates: EmailTemplate[];
  sentCampaignLogs: SentCampaignLog[];
  subscribers: SubscriberUser[];
  sendNotificationCampaign: (campaign: {
    title: string;
    message: string;
    targetAudience: NotificationTarget;
    channel: NotificationChannel;
    actionUrl?: string;
    actionLabel?: string;
    promoCode?: string;
    imageUrl?: string;
    templateId?: string;
    subject?: string;
  }) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  saveEmailTemplate: (template: EmailTemplate) => void;
  deleteEmailTemplate: (id: string) => void;
  addSubscriber: (email: string, source?: 'Footer' | 'Popup' | 'Checkout') => void;

  // Automated Transactional System Emails (from foaxx.studio@gmail.com)
  transactionalEmails: TransactionalEmailLog[];
  triggerWelcomeEmail: (user: { name: string; email: string }) => Promise<void>;
  triggerPasswordResetEmail: (
    target: string | { email: string; name?: string; resetPin?: string }
  ) => Promise<{ pin: string; email: string }>;
  triggerOrderConfirmationEmail: (order: Order, customerName?: string, customerEmail?: string) => Promise<void>;
  triggerShipmentStatusEmail: (data: {
    order: Order;
    status: Order['shippingStatus'] | 'In Transit' | 'Delayed';
    courier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    delayReason?: string;
    revisedEstimatedDelivery?: string;
  }) => Promise<void>;
  resendTransactionalEmail: (emailId: string) => Promise<void>;

  // Manager Portal & Access Control
  managers: ManagerAccount[];
  activeManager: ManagerAccount | null;
  setActiveManager: (m: ManagerAccount | null) => void;
  addManager: (mgr: {
    name: string;
    email: string;
    roleTitle: string;
    phone?: string;
    accessPin?: string;
    permissions: ManagerPermission[];
  }) => ManagerAccount;
  updateManager: (id: string, updates: Partial<ManagerAccount>) => void;
  deleteManager: (id: string) => void;
  toggleManagerPermission: (managerId: string, permission: ManagerPermission) => void;
  loginAsManager: (emailOrId: string, pin?: string) => boolean;
  logoutManager: () => void;

  // Task Command & Delegation System
  tasks: AppTask[];
  addTask: (taskData: Omit<AppTask, 'id' | 'createdAt' | 'notes'> & { initialNote?: string }) => AppTask;
  updateTask: (id: string, updates: Partial<AppTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  addTaskNote: (
    taskId: string,
    note: {
      authorRole: 'admin' | 'manager';
      authorName: string;
      message: string;
      noteType: 'progress' | 'blocker' | 'resolution' | 'general';
      statusUpdate?: TaskStatus;
    }
  ) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');
  const [activePolicy, setActivePolicy] = useState<string>('Shipping Policy');

  const openAuth = (mode: 'login' | 'signup' = 'login', asModal: boolean = false) => {
    setAuthInitialMode(mode);
    if (asModal) {
      setIsAuthModalOpen(true);
    } else {
      setCurrentView('auth');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Modals state
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState<boolean>(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<string>('Jewellery');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Gift Option state
  const [giftOption, setGiftOption] = useState<GiftOption>({
    enabled: false,
    recipientName: '',
    message: '',
    price: 99,
  });

  // Recently Viewed Product IDs
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_recently_viewed');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3', 'prod-6'];
    } catch {
      return ['prod-1', 'prod-3', 'prod-6'];
    }
  });

  // Load persisted state or fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        if (parsed.length > 0 && parsed[0].colors && !parsed[0].colors[0]?.image) {
          return INITIAL_PRODUCTS;
        }
        return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_categories');
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [homepageConfig, setHomepageConfig] = useState<HomepageConfig>(() => {
    try {
      const saved = localStorage.getItem('foaxx_home_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.banners && parsed.banners[0]?.image?.includes('banner_jewellery_edit.png')) {
          parsed.banners = INITIAL_HOMEPAGE_CONFIG.banners;
        }
        if (parsed.hero?.image?.includes('hero_full.png')) {
          parsed.hero.image = INITIAL_HOMEPAGE_CONFIG.hero.image;
        }
        if (!parsed.flashDeals) {
          parsed.flashDeals = INITIAL_HOMEPAGE_CONFIG.flashDeals;
        }
        if (!parsed.festivePicks) {
          parsed.festivePicks = INITIAL_HOMEPAGE_CONFIG.festivePicks;
        }
        if (!parsed.occasionSaleBanner) {
          parsed.occasionSaleBanner = INITIAL_HOMEPAGE_CONFIG.occasionSaleBanner;
        }
        if (!parsed.heroSlides || !Array.isArray(parsed.heroSlides) || parsed.heroSlides.length === 0) {
          parsed.heroSlides = INITIAL_HOMEPAGE_CONFIG.heroSlides;
        }
        if (!parsed.heroCarouselSettings) {
          parsed.heroCarouselSettings = INITIAL_HOMEPAGE_CONFIG.heroCarouselSettings;
        }
        if (!parsed.reviews || parsed.reviews.length < 15) {
          parsed.reviews = INITIAL_REVIEWS;
        }
        if (!parsed.shopByOccasion) {
          parsed.shopByOccasion = INITIAL_HOMEPAGE_CONFIG.shopByOccasion || INITIAL_SHOP_BY_OCCASION;
        }
        if (!parsed.shopTheLook) {
          parsed.shopTheLook = INITIAL_HOMEPAGE_CONFIG.shopTheLook || INITIAL_SHOP_THE_LOOK;
        }
        return parsed;
      }
      return INITIAL_HOMEPAGE_CONFIG;
    } catch {
      return INITIAL_HOMEPAGE_CONFIG;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_orders');
      if (saved) {
        const parsed: Order[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((o) => o.id));
        const missingInitial = INITIAL_ORDERS.filter((o) => !existingIds.has(o.id));
        return missingInitial.length > 0 ? [...parsed, ...missingInitial] : parsed;
      }
      return INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_coupons');
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_cart');
      if (saved) return JSON.parse(saved);
      return [
        { product: INITIAL_PRODUCTS[1], quantity: 1, selectedColor: 'Warm Gold' },
        { product: INITIAL_PRODUCTS[0], quantity: 1, selectedColor: 'Dusty Rose', selectedSize: 'S' },
        { product: INITIAL_PRODUCTS[5], quantity: 1, selectedColor: '18K Yellow Gold', selectedSize: 'Size 7' },
      ];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_wishlist');
      return saved ? JSON.parse(saved) : ['prod-2', 'prod-4'];
    } catch {
      return ['prod-2', 'prod-4'];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [user, setUser] = useState<{ name: string; email: string; phone: string; photoURL?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('foaxx_user_session');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
    };
  });

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('foaxx_user_session', JSON.stringify(user));
      } catch {}
    } else {
      try {
        localStorage.removeItem('foaxx_user_session');
      } catch {}
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = initAuth((firebaseUser) => {
      if (firebaseUser) {
        setUser((prev) => ({
          name: firebaseUser.displayName || prev?.name || 'Valued Muse',
          email: firebaseUser.email || prev?.email || 'customer@gmail.com',
          phone: firebaseUser.phoneNumber || prev?.phone || '+91 98765 43210',
          photoURL: firebaseUser.photoURL || prev?.photoURL || undefined,
        }));
      }
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logoutUser = async () => {
    try {
      await logoutGoogle();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
  };

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent Delivered Review & Rating Reminder State
  const [reviewedItems, setReviewedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_reviewed_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [reviewModalOrderId, setReviewModalOrderId] = useState<string | null>(null);

  const openReviewModal = (product: Product, orderId?: string) => {
    setReviewModalProduct(product);
    setReviewModalOrderId(orderId || null);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewModalProduct(null);
    setReviewModalOrderId(null);
  };

  // FOAXX Coin Wallet & Rewards State
  const [coinWallet, setCoinWallet] = useState<CoinWallet>(() => {
    try {
      const saved = localStorage.getItem('foaxx_coin_wallet');
      if (saved) return JSON.parse(saved);
      return {
        balance: 1200, // 1000 coins = ₹250 (1200 coins = ₹300)
        referralCode: 'FOAXX-PRIYA10',
        transactions: [
          {
            id: 'tx-1',
            type: 'credit',
            amount: 1000,
            description: 'FOAXX Privé Welcome Bonus (Worth ₹250)',
            date: '28 Oct 2026',
          },
          {
            id: 'tx-2',
            type: 'credit',
            amount: 200,
            description: 'Referral & Product Share Milestone Reward',
            date: '30 Oct 2026',
          },
        ],
      };
    } catch {
      return {
        balance: 1200,
        referralCode: 'FOAXX-PRIYA10',
        transactions: [],
      };
    }
  });

  const [redeemedCoinsAtCheckout, setRedeemedCoinsAtCheckout] = useState<number>(0);

  // Sync coinWallet to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foaxx_coin_wallet', JSON.stringify(coinWallet));
    } catch {
      // ignore
    }
  }, [coinWallet]);

  // Product Share Modal State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [shareProduct, setShareProduct] = useState<Product | null>(null);

  const openShareModal = (product: Product) => {
    setShareProduct(product);
    setIsShareModalOpen(true);
  };

  const closeShareModal = () => {
    setIsShareModalOpen(false);
    setShareProduct(null);
  };

  // Sync reviewedItems to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foaxx_reviewed_items', JSON.stringify(reviewedItems));
    } catch {
      // ignore
    }
  }, [reviewedItems]);

  // 🔔 NOTIFICATIONS & EMAIL MARKETING CAMPAIGNS STATE
  const [appNotifications, setAppNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_email_templates');
      return saved ? JSON.parse(saved) : INITIAL_EMAIL_TEMPLATES;
    } catch {
      return INITIAL_EMAIL_TEMPLATES;
    }
  });

  const [sentCampaignLogs, setSentCampaignLogs] = useState<SentCampaignLog[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_campaign_logs');
      return saved ? JSON.parse(saved) : INITIAL_SENT_CAMPAIGNS;
    } catch {
      return INITIAL_SENT_CAMPAIGNS;
    }
  });

  const [subscribers, setSubscribers] = useState<SubscriberUser[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_subscribers');
      return saved ? JSON.parse(saved) : INITIAL_SUBSCRIBERS;
    } catch {
      return INITIAL_SUBSCRIBERS;
    }
  });

  // Sync Marketing state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foaxx_notifications', JSON.stringify(appNotifications));
    } catch {
      // ignore
    }
  }, [appNotifications]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_email_templates', JSON.stringify(emailTemplates));
    } catch {
      // ignore
    }
  }, [emailTemplates]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_campaign_logs', JSON.stringify(sentCampaignLogs));
    } catch {
      // ignore
    }
  }, [sentCampaignLogs]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_subscribers', JSON.stringify(subscribers));
    } catch {
      // ignore
    }
  }, [subscribers]);

  const unreadNotificationsCount = appNotifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setAppNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setAppNotifications([]);
    showToast('All in-app notifications cleared', 'info');
  };

  const saveEmailTemplate = (template: EmailTemplate) => {
    setEmailTemplates((prev) => {
      const exists = prev.some((t) => t.id === template.id);
      if (exists) {
        return prev.map((t) => (t.id === template.id ? template : t));
      }
      return [template, ...prev];
    });
    showToast(`Template "${template.name}" saved successfully!`, 'success');
  };

  const deleteEmailTemplate = (id: string) => {
    setEmailTemplates((prev) => prev.filter((t) => t.id !== id));
    showToast('Email template deleted', 'info');
  };

  const addSubscriber = (email: string, source: 'Footer' | 'Popup' | 'Checkout' = 'Footer') => {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) return;

    setSubscribers((prev) => {
      if (prev.some((s) => s.email.toLowerCase() === trimmed)) {
        return prev;
      }
      const newSub: SubscriberUser = {
        id: `sub-${Date.now()}`,
        email: trimmed,
        subscribedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Active',
        source,
        isRegisteredUser: false,
        role: 'customer',
      };
      return [newSub, ...prev];
    });
  };

  const sendNotificationCampaign = (campaign: {
    title: string;
    message: string;
    targetAudience: NotificationTarget;
    channel: NotificationChannel;
    actionUrl?: string;
    actionLabel?: string;
    promoCode?: string;
    imageUrl?: string;
    templateId?: string;
    subject?: string;
  }) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const formattedDate = `Today, ${timeString}`;

    // Calculate simulated recipients count based on audience
    let recipientCount = 1480;
    if (campaign.targetAudience === 'subscribers') recipientCount = 3240;
    if (campaign.targetAudience === 'registered') recipientCount = 1150;
    if (campaign.targetAudience === 'managers') recipientCount = 4;
    if (campaign.targetAudience === 'all_users') recipientCount = 4720;

    // 1. Create In-App Notification if channel includes in-app
    if (campaign.channel === 'in_app' || campaign.channel === 'both') {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: campaign.title,
        message: campaign.message,
        type: campaign.promoCode ? 'sale' : 'announcement',
        targetAudience: campaign.targetAudience,
        channel: campaign.channel,
        actionUrl: campaign.actionUrl || '/?category=All',
        actionLabel: campaign.actionLabel || 'View Offer',
        promoCode: campaign.promoCode,
        imageUrl: campaign.imageUrl,
        date: formattedDate,
        read: false,
        sender: 'foaxx.studio@gmail.com',
      };
      setAppNotifications((prev) => [newNotif, ...prev]);
    }

    // 2. Add Sent Campaign Log
    const audienceLabelMap: Record<NotificationTarget, string> = {
      all_users: 'All Users & Subscribers',
      subscribers: 'Newsletter Subscribers',
      registered: 'Registered Account Users',
      managers: 'Store Managers & Staff',
    };

    const newLog: SentCampaignLog = {
      id: `camp-${Date.now()}`,
      templateId: campaign.templateId,
      subject: campaign.subject || campaign.title,
      targetAudience: campaign.targetAudience,
      channel: campaign.channel,
      recipientCount,
      sentAt: `${dateString}, ${timeString}`,
      status: 'Delivered',
      previewSnippet: campaign.message.slice(0, 100) + '...',
      promoCode: campaign.promoCode,
      senderEmail: 'foaxx.studio@gmail.com',
    };
    setSentCampaignLogs((prev) => [newLog, ...prev]);

    // 3. User feedback
    const channelLabel =
      campaign.channel === 'both'
        ? 'In-App Notification & Email'
        : campaign.channel === 'email'
        ? 'Email'
        : 'In-App Notification';

    showToast(
      `🎉 ${channelLabel} Dispatched! Sent to ${recipientCount.toLocaleString('en-IN')} ${
        audienceLabelMap[campaign.targetAudience]
      } from foaxx.studio@gmail.com`,
      'success'
    );
  };

  // 📧 AUTOMATED TRANSACTIONAL EMAILS (from foaxx.studio@gmail.com)
  const [transactionalEmails, setTransactionalEmails] = useState<TransactionalEmailLog[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_transactional_emails');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initialWelcome = generateWelcomeEmailHtml({ name: 'Priya Sharma', email: 'priya.sharma@gmail.com' });
    const initialOrder = generateOrderConfirmationEmailHtml({
      order: INITIAL_ORDERS[0],
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@gmail.com',
    });
    const initialShip = generateShipmentStatusEmailHtml({
      order: INITIAL_ORDERS[0],
      status: 'Shipped',
      courier: 'BlueDart Air Express',
      trackingNumber: INITIAL_ORDERS[0].trackingNumber,
    });
    return [
      {
        id: 'tx-seed-1',
        eventType: 'welcome',
        recipientEmail: 'priya.sharma@gmail.com',
        recipientName: 'Priya Sharma',
        subject: initialWelcome.subject,
        preheader: initialWelcome.preheader,
        senderEmail: SYSTEM_SENDER_EMAIL,
        senderName: SYSTEM_SENDER_NAME,
        htmlContent: initialWelcome.html,
        sentAt: '01 Nov 2026, 11:20',
        status: 'Delivered',
      },
      {
        id: 'tx-seed-2',
        eventType: 'order_confirmation',
        recipientEmail: 'priya.sharma@gmail.com',
        recipientName: 'Priya Sharma',
        subject: initialOrder.subject,
        preheader: initialOrder.preheader,
        senderEmail: SYSTEM_SENDER_EMAIL,
        senderName: SYSTEM_SENDER_NAME,
        htmlContent: initialOrder.html,
        sentAt: '03 Nov 2026, 14:10',
        status: 'Delivered',
        orderId: INITIAL_ORDERS[0].id,
        orderNumber: INITIAL_ORDERS[0].orderNumber,
      },
      {
        id: 'tx-seed-3',
        eventType: 'shipment_dispatched',
        recipientEmail: 'priya.sharma@gmail.com',
        recipientName: 'Priya Sharma',
        subject: initialShip.subject,
        preheader: initialShip.preheader,
        senderEmail: SYSTEM_SENDER_EMAIL,
        senderName: SYSTEM_SENDER_NAME,
        htmlContent: initialShip.html,
        sentAt: '04 Nov 2026, 09:30',
        status: 'Delivered',
        orderId: INITIAL_ORDERS[0].id,
        orderNumber: INITIAL_ORDERS[0].orderNumber,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_transactional_emails', JSON.stringify(transactionalEmails));
    } catch {}
  }, [transactionalEmails]);

  const triggerWelcomeEmail = async (userInfo: { name: string; email: string }) => {
    if (!userInfo.email) return;
    const { subject, preheader, html } = generateWelcomeEmailHtml(userInfo);
    const log = await sendTransactionalEmail({
      eventType: 'welcome',
      recipientEmail: userInfo.email,
      recipientName: userInfo.name || 'Valued Muse',
      subject,
      preheader,
      htmlContent: html,
    });
    setTransactionalEmails((prev) => [log, ...prev]);

    const notif: AppNotification = {
      id: `notif-welcome-${Date.now()}`,
      title: '✨ Welcome to FOAXX Atelier!',
      message: `Welcome email dispatched from ${SYSTEM_SENDER_EMAIL}. Flat 10% off voucher WELCOME10 and +100 Coins credited to your wallet.`,
      type: 'coins',
      targetAudience: 'all_users',
      channel: 'both',
      actionUrl: '/?view=account',
      actionLabel: 'View Member Vault',
      date: 'Just now',
      sender: SYSTEM_SENDER_NAME,
      read: false,
    };
    setAppNotifications((prev) => [notif, ...prev]);
  };

  const triggerPasswordResetEmail = async (
    target: string | { email: string; name?: string; resetPin?: string }
  ) => {
    const targetEmail = typeof target === 'string' ? target : target.email;
    const recipientName =
      typeof target === 'object' && target.name
        ? target.name
        : targetEmail.split('@')[0];
    const pin =
      typeof target === 'object' && target.resetPin
        ? target.resetPin
        : Math.floor(100000 + Math.random() * 900000).toString();
    const { subject, preheader, html } = generatePasswordResetEmailHtml({
      email: targetEmail,
      recipientName,
      resetPin: pin,
    });
    // 1. Dispatch real Firebase Authentication password reset email to user's inbox
    try {
      await sendFirebasePasswordReset(targetEmail);
    } catch (err) {
      console.warn('Firebase sendPasswordResetEmail notice:', err);
    }

    const log = await sendTransactionalEmail({
      eventType: 'password_reset',
      recipientEmail: targetEmail,
      recipientName,
      subject,
      preheader,
      htmlContent: html,
    });
    setTransactionalEmails((prev) => [log, ...prev]);
    return { pin, email: targetEmail };
  };

  const triggerOrderConfirmationEmail = async (order: Order, customerName?: string, customerEmail?: string) => {
    const email = customerEmail || order.shippingAddress.email || user?.email || SYSTEM_SENDER_EMAIL;
    const name = customerName || order.shippingAddress.name || user?.name || 'Valued Muse';
    const { subject, preheader, html } = generateOrderConfirmationEmailHtml({
      order,
      customerName: name,
      customerEmail: email,
    });
    const log = await sendTransactionalEmail({
      eventType: 'order_confirmation',
      recipientEmail: email,
      recipientName: name,
      subject,
      preheader,
      htmlContent: html,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
    setTransactionalEmails((prev) => [log, ...prev]);

    const notif: AppNotification = {
      id: `notif-ord-${order.id}`,
      title: `✨ Order Confirmed #${order.orderNumber}`,
      message: `Official receipt sent from ${SYSTEM_SENDER_EMAIL}. Total paid: ₹${order.total.toLocaleString('en-IN')}. Estimated delivery: ${order.estimatedDelivery}.`,
      type: 'order',
      targetAudience: 'registered',
      channel: 'both',
      actionUrl: `/?view=account&tab=orders`,
      actionLabel: 'View Order Details',
      date: 'Just now',
      sender: SYSTEM_SENDER_NAME,
      read: false,
    };
    setAppNotifications((prev) => [notif, ...prev]);
  };

  const triggerShipmentStatusEmail = async (data: {
    order: Order;
    status: Order['shippingStatus'] | 'In Transit' | 'Delayed';
    courier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    delayReason?: string;
    revisedEstimatedDelivery?: string;
  }) => {
    const email = data.order.shippingAddress.email || user?.email || SYSTEM_SENDER_EMAIL;
    const name = data.order.shippingAddress.name || user?.name || 'Valued Muse';
    const { subject, preheader, html } = generateShipmentStatusEmailHtml(data);
    const eventType: TransactionalEmailLog['eventType'] =
      data.status === 'Delivered'
        ? 'delivered'
        : data.status === 'Out for Delivery'
        ? 'out_for_delivery'
        : data.status === 'Cancelled'
        ? 'order_cancelled'
        : data.delayReason || data.order.isDelayed
        ? 'delivery_delayed'
        : 'shipment_dispatched';

    const log = await sendTransactionalEmail({
      eventType,
      recipientEmail: email,
      recipientName: name,
      subject,
      preheader,
      htmlContent: html,
      orderId: data.order.id,
      orderNumber: data.order.orderNumber,
    });
    setTransactionalEmails((prev) => [log, ...prev]);

    const notif: AppNotification = {
      id: `notif-ship-${data.order.id}-${Date.now()}`,
      title: subject,
      message: `Automated status update dispatched from ${SYSTEM_SENDER_EMAIL}. Courier: ${data.courier || data.order.courier} (AWB: ${data.trackingNumber || data.order.trackingNumber}).`,
      type: 'order',
      targetAudience: 'registered',
      channel: 'both',
      actionUrl: `/?view=account&tab=tracking`,
      actionLabel: 'Track Delivery Live',
      date: 'Just now',
      sender: SYSTEM_SENDER_NAME,
      read: false,
    };
    setAppNotifications((prev) => [notif, ...prev]);
  };

  const resendTransactionalEmail = async (emailId: string) => {
    const found = transactionalEmails.find((e) => e.id === emailId);
    if (!found) return;
    const newLog = await sendTransactionalEmail({
      eventType: found.eventType,
      recipientEmail: found.recipientEmail,
      recipientName: found.recipientName,
      subject: `[Re-sent] ${found.subject}`,
      preheader: found.preheader,
      htmlContent: found.htmlContent,
      orderId: found.orderId,
      orderNumber: found.orderNumber,
    });
    setTransactionalEmails((prev) => [newLog, ...prev]);
    showToast(`Email re-sent to ${found.recipientEmail} from ${SYSTEM_SENDER_EMAIL}`, 'success');
  };

  // 🛡️ MANAGERS & DUTIES ACCESS CONTROL
  const [managers, setManagers] = useState<ManagerAccount[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_managers');
      return saved ? JSON.parse(saved) : INITIAL_MANAGERS;
    } catch {
      return INITIAL_MANAGERS;
    }
  });

  const [activeManager, setActiveManager] = useState<ManagerAccount | null>(() => {
    try {
      const saved = localStorage.getItem('foaxx_active_manager');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_managers', JSON.stringify(managers));
    } catch {
      // ignore
    }
  }, [managers]);

  useEffect(() => {
    try {
      if (activeManager) {
        localStorage.setItem('foaxx_active_manager', JSON.stringify(activeManager));
      } else {
        localStorage.removeItem('foaxx_active_manager');
      }
    } catch {
      // ignore
    }
  }, [activeManager]);

  const addManager = (mgrData: {
    name: string;
    email: string;
    roleTitle: string;
    phone?: string;
    accessPin?: string;
    permissions: ManagerPermission[];
  }): ManagerAccount => {
    const newMgr: ManagerAccount = {
      id: `mgr-${Date.now()}`,
      name: mgrData.name.trim(),
      email: mgrData.email.trim().toLowerCase(),
      roleTitle: mgrData.roleTitle.trim() || 'Store Section Manager',
      phone: mgrData.phone?.trim() || '+91 98376 00000',
      accessPin: mgrData.accessPin?.trim() || '1234',
      permissions: mgrData.permissions || ['products'],
      isActive: true,
      createdAt: new Date().toISOString(),
      lastActive: 'Just created',
    };
    setManagers((prev) => [newMgr, ...prev]);
    showToast(`Manager "${newMgr.name}" created with ${newMgr.permissions.length} duties assigned`, 'success');
    return newMgr;
  };

  const updateManager = (id: string, updates: Partial<ManagerAccount>) => {
    setManagers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (activeManager && activeManager.id === id) {
            setActiveManager(updated);
          }
          return updated;
        }
        return m;
      })
    );
    showToast('Manager details updated', 'success');
  };

  const deleteManager = (id: string) => {
    setManagers((prev) => prev.filter((m) => m.id !== id));
    if (activeManager && activeManager.id === id) {
      setActiveManager(null);
      setCurrentView('home');
    }
    showToast('Manager account removed', 'info');
  };

  const toggleManagerPermission = (managerId: string, permission: ManagerPermission) => {
    setManagers((prev) =>
      prev.map((m) => {
        if (m.id === managerId) {
          const hasPerm = m.permissions.includes(permission);
          const updatedPerms = hasPerm
            ? m.permissions.filter((p) => p !== permission)
            : [...m.permissions, permission];
          const updated = { ...m, permissions: updatedPerms };
          if (activeManager && activeManager.id === managerId) {
            setActiveManager(updated);
          }
          return updated;
        }
        return m;
      })
    );
  };

  const loginAsManager = (emailOrId: string, pin?: string): boolean => {
    const target = emailOrId.trim().toLowerCase();
    const mgr = managers.find(
      (m) => m.id === target || m.email.toLowerCase() === target
    );
    if (!mgr) {
      showToast('Manager account not found with this email', 'error');
      return false;
    }
    if (pin && mgr.accessPin && mgr.accessPin !== pin) {
      showToast('Invalid Manager Access PIN', 'error');
      return false;
    }
    if (!mgr.isActive) {
      showToast('This manager account is currently deactivated', 'error');
      return false;
    }
    const updated = { ...mgr, lastActive: 'Just now' };
    setActiveManager(updated);
    setManagers((prev) => prev.map((m) => (m.id === mgr.id ? updated : m)));
    setCurrentView('manager');
    showToast(`Welcome ${mgr.name}! Logged into FOAXX Manager Dashboard.`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  };

  const logoutManager = () => {
    setActiveManager(null);
    setCurrentView('home');
    showToast('Logged out of Manager Portal', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 📋 Task Command & Manager Delegation State
  const [tasks, setTasks] = useState<AppTask[]>(() => {
    try {
      const saved = localStorage.getItem('foaxx_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_tasks', JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const addTask = (
    taskData: Omit<AppTask, 'id' | 'createdAt' | 'notes'> & { initialNote?: string }
  ): AppTask => {
    const id = `task-${Date.now()}`;
    const initialNotes: TaskNoteEntry[] = [];
    if (taskData.initialNote && taskData.initialNote.trim()) {
      const words = taskData.initialNote.trim().split(/\s+/).filter(Boolean);
      initialNotes.push({
        id: `note-${Date.now()}`,
        authorRole: 'admin',
        authorName: 'Admin',
        message: taskData.initialNote.trim(),
        wordCount: words.length,
        createdAt: 'Just now',
        noteType: 'general',
      });
    }

    const newTask: AppTask = {
      id,
      type: taskData.type,
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'General',
      priority: taskData.priority,
      status: taskData.status || 'todo',
      deadlineDate: taskData.deadlineDate,
      deadlineTime: taskData.deadlineTime,
      assignedToManagerId: taskData.assignedToManagerId,
      assignedToManagerName: taskData.assignedToManagerName,
      assignedBy: taskData.assignedBy || 'Admin',
      createdAt: 'Just now',
      notes: initialNotes,
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast(
      taskData.type === 'admin_self'
        ? 'Personal task scheduled'
        : `Task assigned to ${taskData.assignedToManagerName || 'manager'}`,
      'success'
    );
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<AppTask>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.status === 'completed' && !t.completedAt) {
            updated.completedAt = 'Just now';
          }
          return updated;
        }
        return t;
      })
    );
    showToast('Task updated', 'success');
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed', 'info');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isDone = t.status === 'completed';
          const nextStatus: TaskStatus = isDone ? 'in_progress' : 'completed';
          return {
            ...t,
            status: nextStatus,
            completedAt: nextStatus === 'completed' ? 'Just now' : undefined,
          };
        }
        return t;
      })
    );
  };

  const addTaskNote = (
    taskId: string,
    note: {
      authorRole: 'admin' | 'manager';
      authorName: string;
      message: string;
      noteType: 'progress' | 'blocker' | 'resolution' | 'general';
      statusUpdate?: TaskStatus;
    }
  ) => {
    const words = note.message.trim().split(/\s+/).filter(Boolean);
    const newNote: TaskNoteEntry = {
      id: `note-${Date.now()}`,
      authorRole: note.authorRole,
      authorName: note.authorName,
      message: note.message.trim(),
      wordCount: words.length,
      createdAt: 'Just now',
      noteType: note.noteType,
    };

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedNotes = [...t.notes, newNote];
          const updatedStatus =
            note.statusUpdate || (note.noteType === 'blocker' ? 'blocked' : t.status);
          return {
            ...t,
            status: updatedStatus,
            notes: updatedNotes,
            completedAt: updatedStatus === 'completed' ? 'Just now' : t.completedAt,
          };
        }
        return t;
      })
    );
    showToast(
      note.authorRole === 'admin'
        ? 'Resolution note added'
        : 'Progress update submitted to Admin',
      'success'
    );
  };


  // Compute pending items from delivered orders that user hasn't reviewed yet
  const pendingReviewItems = orders
    .filter((o) => o.shippingStatus === 'Delivered')
    .flatMap((order) =>
      order.items
        .filter((it) => {
          const itemKey = `${order.id}_${it.product.id}`;
          return !reviewedItems.includes(itemKey) && !reviewedItems.includes(it.product.id);
        })
        .map((it) => ({
          order,
          product: it.product,
          key: `${order.id}_${it.product.id}`,
        }))
    );

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('foaxx_products', JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_categories', JSON.stringify(categories));
    } catch {
      // ignore
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_home_config', JSON.stringify(homepageConfig));
    } catch {
      // ignore
    }
  }, [homepageConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('foaxx_recently_viewed', JSON.stringify(recentlyViewed));
    } catch {
      // ignore
    }
  }, [recentlyViewed]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Add to Recently Viewed
  const addRecentlyViewed = (productId: string) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const chosenColor = color || (product.colors && product.colors[0]?.name);
    const chosenColorObj = product.colors?.find((c) => c.name === chosenColor);
    const chosenColorHex = chosenColorObj?.hex;
    const chosenColorImage = chosenColorObj?.image || product.image;
    const chosenSize = size || (product.sizes && product.sizes[0]);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === chosenColor &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            selectedColor: chosenColor,
            selectedColorHex: chosenColorHex,
            selectedColorImage: chosenColorImage,
            selectedSize: chosenSize,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" (${chosenColor || 'Default'}) to bag`);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index].quantity = quantity;
      }
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
    showToast('Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const prod = products.find((p) => p.id === productId);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${prod?.name || 'Item'}" to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Category-specific coupon eligibility
  const eligibleCouponSubtotal = appliedCoupon?.category && appliedCoupon.category !== 'All'
    ? cart.filter(
        (item) => item.product.category?.toLowerCase() === appliedCoupon.category?.toLowerCase()
      ).reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    : cartSubtotal;

  const discountAmount = appliedCoupon
    ? Math.min(
        Math.round((eligibleCouponSubtotal * appliedCoupon.discountPercent) / 100),
        appliedCoupon.maxDiscount || Infinity
      )
    : 0;

  // 1000 Coins = ₹250 (1 Coin = ₹0.25)
  const coinDiscountAmount = Math.round((redeemedCoinsAtCheckout / 1000) * 250);

  // Free shipping above ₹999
  const shippingAmount = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const giftAmount = giftOption.enabled && cart.length > 0 ? (cartSubtotal >= 2000 ? 0 : giftOption.price) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount - coinDiscountAmount + shippingAmount + giftAmount);

  // FOAXX Coins Management
  const earnCoins = (amount: number, description: string, referenceId?: string) => {
    setCoinWallet((prev) => {
      const newTx: CoinTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'credit',
        amount,
        description,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        referenceId,
      };
      return {
        ...prev,
        balance: prev.balance + amount,
        transactions: [newTx, ...prev.transactions],
      };
    });
    showToast(`🪙 +${amount} FOAXX Coins earned! (Value: ₹${((amount / 1000) * 250).toFixed(0)})`, 'success');
  };

  const redeemCoins = (amount: number, description = 'Redeemed at checkout'): boolean => {
    if (coinWallet.balance < amount) {
      showToast('Insufficient FOAXX Coins balance', 'error');
      return false;
    }
    setCoinWallet((prev) => {
      const newTx: CoinTransaction = {
        id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: 'debit',
        amount,
        description,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      };
      return {
        ...prev,
        balance: Math.max(0, prev.balance - amount),
        transactions: [newTx, ...prev.transactions],
      };
    });
    return true;
  };

  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive
    );
    if (!found) {
      return { success: false, message: 'Invalid or inactive promo code' };
    }

    // Check dated validity if set
    if (found.validityType === 'dated' && found.expiryDate) {
      const expiryTimestamp = new Date(found.expiryDate).getTime() + 24 * 60 * 60 * 1000;
      if (Date.now() > expiryTimestamp) {
        return {
          success: false,
          message: `Promo code "${found.code}" expired on ${found.expiryDate}`,
        };
      }
    }

    // Check category restrictions
    if (found.category && found.category !== 'All') {
      const matchingItems = cart.filter(
        (item) => item.product.category?.toLowerCase() === found.category?.toLowerCase()
      );
      if (matchingItems.length === 0) {
        return {
          success: false,
          message: `Promo code "${found.code}" is exclusive to ${found.category} products. Add ${found.category} items to your bag to apply.`,
        };
      }
    }

    if (cartSubtotal < found.minOrderValue) {
      return {
        success: false,
        message: `Minimum order value of ₹${found.minOrderValue.toLocaleString('en-IN')} required for ${found.code}`,
      };
    }

    setAppliedCoupon(found);
    showToast(`Promo Code ${found.code} applied! ${found.discountPercent}% OFF ${found.category && found.category !== 'All' ? `on ${found.category}` : ''}`);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Add Product Review with Picture & Real-Time Sync
  const addProductReview = (newReview: ProductReviewItem, orderId?: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === newReview.productId) {
          const currentReviews = p.reviewsList || [];
          const updatedList = [newReview, ...currentReviews];
          const newReviewCount = (p.reviewCount || 0) + 1;
          const avgRating = Number(
            (
              (p.rating * (p.reviewCount || 1) + newReview.rating) /
              newReviewCount
            ).toFixed(1)
          );
          return {
            ...p,
            reviewsList: updatedList,
            reviewCount: newReviewCount,
            rating: Math.min(5, Math.max(1, avgRating)),
          };
        }
        return p;
      })
    );

    // Also publish to Customer Muses / Reviews so photo & review show on homepage
    const targetProduct = products.find((p) => p.id === newReview.productId);
    const museReview: CustomerReview = {
      id: `muse-${Date.now()}`,
      name: newReview.name,
      location: newReview.location || 'Verified Buyer, India',
      image: newReview.image || targetProduct?.image || '/assets/extracted/prod_pearl_earrings.png',
      quote: newReview.comment,
      rating: newReview.rating,
      productName: targetProduct?.name || 'FOAXX Luxury Atelier Piece',
      productId: newReview.productId,
      date: 'Verified Buyer · Today',
      status: 'pending',
      featured: false,
    };

    setHomepageConfig((prev) => {
      const currentReviews = prev.reviews || INITIAL_REVIEWS;
      return {
        ...prev,
        reviews: [museReview, ...currentReviews],
      };
    });

    // Mark as reviewed in state & localStorage to dismiss reminders
    const itemKey = orderId ? `${orderId}_${newReview.productId}` : newReview.productId;
    setReviewedItems((prev) => Array.from(new Set([...prev, itemKey, newReview.productId])));

    showToast('✨ Thank you! Your review and photo have been submitted for admin approval. 100 FOAXX Coins earned!', 'success');
  };

  // Order Cancellation & Returns with strict Real-Time Transit Check
  const cancelOrder = (orderId: string, reason: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // Strict rule: Cannot cancel if already Shipped or Delivered
    if (
      targetOrder.shippingStatus === 'Shipped' ||
      targetOrder.shippingStatus === 'Out for Delivery' ||
      targetOrder.shippingStatus === 'Delivered'
    ) {
      showToast(
        `Order ${targetOrder.orderNumber} is already ${targetOrder.shippingStatus.toLowerCase()} with courier. Cancellation is not allowed. You can initiate a 7-day doorstep return once delivered.`,
        'error'
      );
      return;
    }

    const updatedEvents = [
      ...targetOrder.events,
      {
        time: 'Just now',
        title: `Order Cancelled: ${reason}`,
        location: 'Customer Self-Service Portal',
        completed: true,
      },
    ];

    const updatedOrder: Order = {
      ...targetOrder,
      shippingStatus: 'Cancelled',
      cancelReason: reason,
      events: updatedEvents,
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder(updatedOrder);
    }
    showToast(`Order ${targetOrder.orderNumber} has been cancelled in real-time. 100% refund initiated to source payment method.`, 'info');
  };

  const requestReturn = (orderId: string, reason: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.shippingStatus !== 'Delivered') {
      showToast('Return / Exchange can only be initiated after your package is delivered.', 'error');
      return;
    }

    const updatedEvents = [
      ...targetOrder.events,
      {
        time: 'Just now',
        title: `Return / Exchange Request Accepted: ${reason}`,
        location: 'FOAXX Reverse Logistics Desk · BlueDart Doorstep Pickup Scheduled',
        completed: true,
      },
    ];

    const updatedOrder: Order = {
      ...targetOrder,
      shippingStatus: 'Return Requested',
      returnReason: reason,
      events: updatedEvents,
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder(updatedOrder);
    }
    showToast(`Return request accepted for ${targetOrder.orderNumber}! Reverse courier pickup scheduled within 48 hours.`, 'success');
  };

  // Order Creation
  const createOrder = (shippingAddress: ShippingAddress, paymentMethod: string): Order => {
    const newOrderNumber = `FX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: newOrderNumber,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      shipping: shippingAmount,
      giftWrappingFee: giftAmount,
      giftOption: giftOption.enabled ? { ...giftOption } : undefined,
      total: cartTotal,
      appliedCoupon: appliedCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash on Delivery (COD)' ? 'COD' : 'Paid',
      shippingStatus: 'Confirmed',
      trackingNumber: `BD${Math.floor(100000000 + Math.random() * 900000000)}IN`,
      courier: 'BlueDart Air Express',
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      shippingAddress,
      events: [
        {
          time: 'Just now',
          title: 'Order Confirmed & Processing',
          location: 'FOAXX Fulfillment Center, Mumbai',
          completed: true,
        },
        {
          time: 'Estimated tomorrow',
          title: 'Quality Check & Packaging',
          location: 'FOAXX Central Vault, Mumbai',
          completed: false,
        },
        {
          time: 'Expected in 2 days',
          title: 'Handover to Courier Partner',
          location: 'Domestic Air Transit Hub',
          completed: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrder(newOrder);

    // Automatically dispatch official order confirmation email from foaxx.studio@gmail.com
    triggerOrderConfirmationEmail(newOrder, shippingAddress.name, user?.email || shippingAddress.email);

    // If coins were redeemed at checkout, deduct from wallet and record transaction
    if (redeemedCoinsAtCheckout > 0) {
      redeemCoins(
        redeemedCoinsAtCheckout,
        `Redeemed on Order #${newOrderNumber} (Instant -₹${coinDiscountAmount} Discount)`
      );
      setRedeemedCoinsAtCheckout(0);
    }

    clearCart();
    setAppliedCoupon(null);
    setGiftOption({ enabled: false, recipientName: '', message: '', price: 99 });
    return newOrder;
  };

  // Admin mutation methods
  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Product "${updated.name}" updated`);
  };

  const addProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Product "${newProd.name}" created`);
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product deleted`, 'info');
  };

  const updateHomepageConfig = (config: HomepageConfig) => {
    setHomepageConfig(config);
    showToast(`Homepage content updated successfully`);
  };

  const addReview = (review: CustomerReview) => {
    const revWithStatus: CustomerReview = {
      ...review,
      status: review.status || 'approved',
      moderatedAt: new Date().toLocaleDateString('en-GB'),
      moderatedBy: 'Admin',
    };
    const updatedReviews = [revWithStatus, ...(homepageConfig.reviews || [])];
    updateHomepageConfig({ ...homepageConfig, reviews: updatedReviews });
    showToast(`Review from "${review.name}" published to homepage`);
  };

  const updateReview = (review: CustomerReview) => {
    const updatedReviews = (homepageConfig.reviews || []).map((r) => (r.id === review.id ? review : r));
    updateHomepageConfig({ ...homepageConfig, reviews: updatedReviews });
    showToast(`Review updated`);
  };

  const deleteReview = (id: string) => {
    const updatedReviews = (homepageConfig.reviews || []).filter((r) => r.id !== id);
    updateHomepageConfig({ ...homepageConfig, reviews: updatedReviews });
    showToast(`Review removed`, 'info');
  };

  const moderateReview = (reviewId: string, status: 'approved' | 'rejected', featured?: boolean) => {
    const nowTime = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    let targetName = '';
    const updatedReviews = (homepageConfig.reviews || []).map((r) => {
      if (r.id === reviewId) {
        targetName = r.name;
        return {
          ...r,
          status,
          moderatedAt: nowTime,
          moderatedBy: 'Admin',
          featured: featured !== undefined ? featured : r.featured,
        };
      }
      return r;
    });

    updateHomepageConfig({ ...homepageConfig, reviews: updatedReviews });

    if (status === 'approved') {
      showToast(`Review from "${targetName || 'Customer'}" approved & live on homepage!`, 'success');
    } else {
      showToast(`Review from "${targetName || 'Customer'}" rejected and hidden from homepage.`, 'info');
    }
  };

  const addFaq = (faq: FaqItem) => {
    const updatedFaqs = [...(homepageConfig.faqs || []), faq];
    updateHomepageConfig({ ...homepageConfig, faqs: updatedFaqs });
    showToast(`FAQ added to homepage`);
  };

  const updateFaq = (faq: FaqItem) => {
    const updatedFaqs = (homepageConfig.faqs || []).map((f) => (f.id === faq.id ? faq : f));
    updateHomepageConfig({ ...homepageConfig, faqs: updatedFaqs });
    showToast(`FAQ updated`);
  };

  const deleteFaq = (id: string) => {
    const updatedFaqs = (homepageConfig.faqs || []).filter((f) => f.id !== id);
    updateHomepageConfig({ ...homepageConfig, faqs: updatedFaqs });
    showToast(`FAQ removed`, 'info');
  };

  const updateFlashDealsConfig = (config: FlashDealsConfig) => {
    updateHomepageConfig({ ...homepageConfig, flashDeals: config });
    showToast('Flash deals settings updated successfully', 'success');
  };

  const addFlashDeal = (deal: FlashDealOffer) => {
    const currentDeals = homepageConfig.flashDeals?.offers || [];
    const updatedDeals = [deal, ...currentDeals];
    const updatedConfig: FlashDealsConfig = {
      ...(homepageConfig.flashDeals || {
        enabled: true,
        sectionTitle: 'LIMITED TIME DEALS',
        badgeText: '⚡ FLASH SALE',
        targetEndTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        offers: [],
      }),
      offers: updatedDeals,
    };
    updateHomepageConfig({ ...homepageConfig, flashDeals: updatedConfig });
    showToast(`New deal banner "${deal.title}" published!`, 'success');
  };

  const updateFlashDeal = (deal: FlashDealOffer) => {
    const currentDeals = homepageConfig.flashDeals?.offers || [];
    const updatedDeals = currentDeals.map((d) => (d.id === deal.id ? deal : d));
    const updatedConfig: FlashDealsConfig = {
      ...(homepageConfig.flashDeals || {
        enabled: true,
        sectionTitle: 'LIMITED TIME DEALS',
        badgeText: '⚡ FLASH SALE',
        targetEndTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        offers: [],
      }),
      offers: updatedDeals,
    };
    updateHomepageConfig({ ...homepageConfig, flashDeals: updatedConfig });
    showToast(`Deal "${deal.title}" updated`, 'success');
  };

  const deleteFlashDeal = (id: string) => {
    const currentDeals = homepageConfig.flashDeals?.offers || [];
    const updatedDeals = currentDeals.filter((d) => d.id !== id);
    const updatedConfig: FlashDealsConfig = {
      ...(homepageConfig.flashDeals || {
        enabled: true,
        sectionTitle: 'LIMITED TIME DEALS',
        badgeText: '⚡ FLASH SALE',
        targetEndTime: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
        offers: [],
      }),
      offers: updatedDeals,
    };
    updateHomepageConfig({ ...homepageConfig, flashDeals: updatedConfig });
    showToast(`Deal banner removed`, 'info');
  };

  const updateFestivePicksConfig = (config: FestivePicksConfig) => {
    updateHomepageConfig({ ...homepageConfig, festivePicks: config });
    showToast('Festive picks updated successfully', 'success');
  };

  const addFestivePickCard = (card: FestivePickCard) => {
    const currentCards = homepageConfig.festivePicks?.cards || [];
    const updatedCards = [card, ...currentCards];
    const updatedConfig: FestivePicksConfig = {
      ...(homepageConfig.festivePicks || {
        enabled: true,
        sectionTitle: 'DAZZLING FESTIVE PICKS',
        cards: [],
      }),
      cards: updatedCards,
    };
    updateHomepageConfig({ ...homepageConfig, festivePicks: updatedConfig });
    showToast(`New festive card "${card.headline}" added!`, 'success');
  };

  const updateFestivePickCard = (card: FestivePickCard) => {
    const currentCards = homepageConfig.festivePicks?.cards || [];
    const updatedCards = currentCards.map((c) => (c.id === card.id ? card : c));
    const updatedConfig: FestivePicksConfig = {
      ...(homepageConfig.festivePicks || {
        enabled: true,
        sectionTitle: 'DAZZLING FESTIVE PICKS',
        cards: [],
      }),
      cards: updatedCards,
    };
    updateHomepageConfig({ ...homepageConfig, festivePicks: updatedConfig });
    showToast(`Festive card updated`, 'success');
  };

  const deleteFestivePickCard = (id: string) => {
    const currentCards = homepageConfig.festivePicks?.cards || [];
    const updatedCards = currentCards.filter((c) => c.id !== id);
    const updatedConfig: FestivePicksConfig = {
      ...(homepageConfig.festivePicks || {
        enabled: true,
        sectionTitle: 'DAZZLING FESTIVE PICKS',
        cards: [],
      }),
      cards: updatedCards,
    };
    updateHomepageConfig({ ...homepageConfig, festivePicks: updatedConfig });
    showToast(`Festive card removed`, 'info');
  };

  const updateOccasionSaleBanner = (config: OccasionSaleBannerConfig) => {
    updateHomepageConfig({ ...homepageConfig, occasionSaleBanner: config });
    showToast(`🎉 Festive sale banner updated successfully!`, 'success');
  };

  const updateHeroSlides = (slides: HeroSlide[]) => {
    setHomepageConfig((prev) => {
      const updated = { ...prev, heroSlides: slides };
      try {
        localStorage.setItem('foaxx_home_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const addHeroSlide = (slide: HeroSlide) => {
    setHomepageConfig((prev) => {
      const currentSlides = prev.heroSlides || INITIAL_HERO_SLIDES;
      const newOrder = currentSlides.length + 1;
      const newSlide = { ...slide, order: newOrder };
      const updatedSlides = [...currentSlides, newSlide];
      const updated = { ...prev, heroSlides: updatedSlides };
      try {
        localStorage.setItem('foaxx_home_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('New hero slide added to homepage!', 'success');
  };

  const updateHeroSlide = (updatedSlide: HeroSlide) => {
    setHomepageConfig((prev) => {
      const currentSlides = prev.heroSlides || INITIAL_HERO_SLIDES;
      const updatedSlides = currentSlides.map((s) => (s.id === updatedSlide.id ? updatedSlide : s));
      const updated = { ...prev, heroSlides: updatedSlides };
      try {
        localStorage.setItem('foaxx_home_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Hero slide updated!', 'success');
  };

  const deleteHeroSlide = (id: string) => {
    setHomepageConfig((prev) => {
      const currentSlides = prev.heroSlides || INITIAL_HERO_SLIDES;
      const filtered = currentSlides.filter((s) => s.id !== id);
      const reindexed = filtered.map((s, idx) => ({ ...s, order: idx + 1 }));
      const updated = { ...prev, heroSlides: reindexed };
      try {
        localStorage.setItem('foaxx_home_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Hero slide removed', 'info');
  };

  const reorderHeroSlide = (id: string, direction: 'up' | 'down') => {
    setHomepageConfig((prev) => {
      const currentSlides = [...(prev.heroSlides || INITIAL_HERO_SLIDES)].sort((a, b) => a.order - b.order);
      const index = currentSlides.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === currentSlides.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const temp = currentSlides[index];
      currentSlides[index] = currentSlides[targetIndex];
      currentSlides[targetIndex] = temp;

      const reindexed = currentSlides.map((s, idx) => ({ ...s, order: idx + 1 }));
      const updated = { ...prev, heroSlides: reindexed };
      try {
        localStorage.setItem('foaxx_home_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast(`Slide sequence updated`, 'info');
  };

  const updateHeroCarouselSettings = (settings: HeroCarouselSettings) => {
    setHomepageConfig((prev) => {
      const updated = { ...prev, heroCarouselSettings: settings };
      try {
        localStorage.setItem('foaxx_home_config', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showToast('Auto-slide delay & carousel settings saved!', 'success');
  };

  const updateShopByOccasionConfig = (config: ShopByOccasionConfig) => {
    updateHomepageConfig({ ...homepageConfig, shopByOccasion: config });
    showToast('Shop By Occasion configuration updated', 'success');
  };

  const addOccasionCard = (card: OccasionCardConfig) => {
    const currentOccasions = homepageConfig.shopByOccasion?.occasions || INITIAL_SHOP_BY_OCCASION.occasions;
    const updatedOccasions = [...currentOccasions, card];
    const updatedConfig: ShopByOccasionConfig = {
      ...(homepageConfig.shopByOccasion || INITIAL_SHOP_BY_OCCASION),
      occasions: updatedOccasions,
    };
    updateHomepageConfig({ ...homepageConfig, shopByOccasion: updatedConfig });
    showToast(`Occasion capsule "${card.label}" created!`, 'success');
  };

  const updateOccasionCard = (card: OccasionCardConfig) => {
    const currentOccasions = homepageConfig.shopByOccasion?.occasions || INITIAL_SHOP_BY_OCCASION.occasions;
    const updatedOccasions = currentOccasions.map((o) => (o.id === card.id ? card : o));
    const updatedConfig: ShopByOccasionConfig = {
      ...(homepageConfig.shopByOccasion || INITIAL_SHOP_BY_OCCASION),
      occasions: updatedOccasions,
    };
    updateHomepageConfig({ ...homepageConfig, shopByOccasion: updatedConfig });
    showToast(`Occasion capsule "${card.label}" updated`, 'success');
  };

  const deleteOccasionCard = (id: string) => {
    const currentOccasions = homepageConfig.shopByOccasion?.occasions || INITIAL_SHOP_BY_OCCASION.occasions;
    const updatedOccasions = currentOccasions.filter((o) => o.id !== id);
    const updatedConfig: ShopByOccasionConfig = {
      ...(homepageConfig.shopByOccasion || INITIAL_SHOP_BY_OCCASION),
      occasions: updatedOccasions,
    };
    updateHomepageConfig({ ...homepageConfig, shopByOccasion: updatedConfig });
    showToast('Occasion capsule removed', 'info');
  };

  const reorderOccasionCard = (id: string, direction: 'up' | 'down') => {
    const currentOccasions = [...(homepageConfig.shopByOccasion?.occasions || INITIAL_SHOP_BY_OCCASION.occasions)];
    const index = currentOccasions.findIndex((o) => o.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === currentOccasions.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = currentOccasions[index];
    currentOccasions[index] = currentOccasions[targetIndex];
    currentOccasions[targetIndex] = temp;

    const updatedConfig: ShopByOccasionConfig = {
      ...(homepageConfig.shopByOccasion || INITIAL_SHOP_BY_OCCASION),
      occasions: currentOccasions,
    };
    updateHomepageConfig({ ...homepageConfig, shopByOccasion: updatedConfig });
    showToast('Occasion tab order updated', 'info');
  };

  const updateShopTheLookConfig = (config: ShopTheLookConfig) => {
    updateHomepageConfig({ ...homepageConfig, shopTheLook: config });
    showToast('Shop The Full Look ensemble updated', 'success');
  };

  const updateOrderStatus = (orderId: string, status: Order['shippingStatus']) => {
    let targetedOrder: Order | undefined;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedEvents = [...o.events];
          updatedEvents.push({
            time: 'Updated just now',
            title: `Status changed to ${status}`,
            location: 'System Log',
            completed: true,
          });
          const updated = { ...o, shippingStatus: status, events: updatedEvents };
          targetedOrder = updated;
          return updated;
        }
        return o;
      })
    );
    if (targetedOrder) {
      triggerShipmentStatusEmail({ order: targetedOrder, status });
    }
    showToast(`Order status updated to ${status}`);
  };

  const updateOrderCourier = (
    orderId: string,
    courierData: {
      courier: string;
      trackingNumber: string;
      trackingUrl?: string;
      estimatedDelivery?: string;
      shippingStatus?: Order['shippingStatus'];
      logisticsNotes?: string;
      dispatchedAt?: string;
    }
  ) => {
    const nowTime = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    let updatedOrderTarget: Order | null = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedEvents = [...o.events];
          const newStatus = courierData.shippingStatus || o.shippingStatus;
          updatedEvents.push({
            time: nowTime,
            title: `Courier Dispatched via ${courierData.courier} (AWB: ${courierData.trackingNumber})`,
            location: 'Central Vault Dispatch Facility',
            completed: true,
          });
          const updated = {
            ...o,
            courier: courierData.courier,
            trackingNumber: courierData.trackingNumber,
            trackingUrl: courierData.trackingUrl || o.trackingUrl,
            estimatedDelivery: courierData.estimatedDelivery || o.estimatedDelivery,
            shippingStatus: newStatus,
            logisticsNotes: courierData.logisticsNotes || o.logisticsNotes,
            dispatchedAt: courierData.dispatchedAt || o.dispatchedAt || nowTime,
            events: updatedEvents,
          };
          updatedOrderTarget = updated;
          return updated;
        }
        return o;
      })
    );

    if (updatedOrderTarget) {
      triggerShipmentStatusEmail({
        order: updatedOrderTarget,
        status: courierData.shippingStatus || 'Shipped',
        courier: courierData.courier,
        trackingNumber: courierData.trackingNumber,
        trackingUrl: courierData.trackingUrl,
      });
    }

    // Optional customer alert in-app
    setAppNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `Courier Dispatched: Tracking Ready`,
        message: `Your FOAXX shipment has been assigned to ${courierData.courier} with tracking ID ${courierData.trackingNumber}. Track your luxury package in real time.`,
        type: 'announcement',
        targetAudience: 'all_users',
        channel: 'in_app',
        actionUrl: '/account?tab=tracking',
        actionLabel: 'Track Package',
        date: 'Just now',
        read: false,
        sender: 'foaxx.studio@gmail.com',
      },
      ...prev,
    ]);

    showToast(`Courier details & live tracking link updated!`, 'success');
  };

  const markOrderDelayed = (
    orderId: string,
    delayData: {
      isDelayed: boolean;
      delayReason: string;
      revisedEstimatedDelivery?: string;
      logisticsNotes?: string;
      notifyCustomer?: boolean;
    }
  ) => {
    const nowTime = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    let delayedOrderTarget: Order | null = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedEvents = [...o.events];
          if (delayData.isDelayed) {
            updatedEvents.push({
              time: nowTime,
              title: `Transit Delay Noted: ${delayData.delayReason}`,
              location: 'Logistics Control Center',
              completed: true,
            });
          } else {
            updatedEvents.push({
              time: nowTime,
              title: 'Transit Delay Cleared - On Schedule',
              location: 'Logistics Control Center',
              completed: true,
            });
          }
          const updated = {
            ...o,
            isDelayed: delayData.isDelayed,
            delayReason: delayData.delayReason,
            originalEstimatedDelivery: o.originalEstimatedDelivery || o.estimatedDelivery,
            revisedEstimatedDelivery: delayData.revisedEstimatedDelivery || o.revisedEstimatedDelivery,
            logisticsNotes: delayData.logisticsNotes || o.logisticsNotes,
            events: updatedEvents,
          };
          delayedOrderTarget = updated;
          return updated;
        }
        return o;
      })
    );

    if (delayedOrderTarget && delayData.isDelayed) {
      triggerShipmentStatusEmail({
        order: delayedOrderTarget,
        status: (delayedOrderTarget as Order).shippingStatus,
        delayReason: delayData.delayReason,
        revisedEstimatedDelivery: delayData.revisedEstimatedDelivery,
      });
    }

    if (delayData.notifyCustomer && delayData.isDelayed) {
      setAppNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Shipment Delay Advisory`,
          message: `Delivery advisory: Your order is temporarily delayed due to: ${delayData.delayReason}. Revised delivery expected by ${delayData.revisedEstimatedDelivery || 'shortly'}.`,
          type: 'announcement',
          targetAudience: 'all_users',
          channel: 'in_app',
          actionUrl: '/account?tab=tracking',
          actionLabel: 'View Details',
          date: 'Just now',
          read: false,
          sender: 'foaxx.studio@gmail.com',
        },
        ...prev,
      ]);
    }

    showToast(
      delayData.isDelayed
        ? 'Shipment marked as delayed. Advisory logged.'
        : 'Delay cleared. Shipment marked on schedule.',
      'info'
    );
  };

  const cancelOrderWithDetails = (
    orderId: string,
    cancelData: {
      cancelledBy: 'Customer' | 'Admin' | 'Manager' | 'System';
      cancelReason: string;
      refundStatus?: 'Pending' | 'Refund Initiated' | 'Refund Completed' | 'Not Applicable';
      refundAmount?: number;
      refundMethod?: string;
      notifyCustomer?: boolean;
    }
  ) => {
    const nowTime = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    let targetOrderNumber = '';
    let cancelledOrderTarget: Order | null = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          targetOrderNumber = o.orderNumber;
          const updatedEvents = [...o.events];
          updatedEvents.push({
            time: nowTime,
            title: `Order Cancelled by ${cancelData.cancelledBy} - Reason: ${cancelData.cancelReason}`,
            location: 'FOAXX Order Operations Desk',
            completed: true,
          });
          const updated = {
            ...o,
            shippingStatus: 'Cancelled' as const,
            cancelledBy: cancelData.cancelledBy,
            cancelledAt: nowTime,
            cancelReason: cancelData.cancelReason,
            refundStatus: cancelData.refundStatus || 'Refund Initiated',
            refundAmount: cancelData.refundAmount !== undefined ? cancelData.refundAmount : o.total,
            refundMethod: cancelData.refundMethod || `Original ${o.paymentMethod}`,
            events: updatedEvents,
          };
          cancelledOrderTarget = updated;
          return updated;
        }
        return o;
      })
    );

    if (cancelledOrderTarget) {
      triggerShipmentStatusEmail({
        order: cancelledOrderTarget,
        status: 'Cancelled',
        delayReason: cancelData.cancelReason,
      });
    }

    if (cancelData.notifyCustomer) {
      setAppNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Order Cancelled: ${targetOrderNumber || orderId}`,
          message: `Your order has been cancelled by ${cancelData.cancelledBy}. Reason: ${cancelData.cancelReason}. Refund of ₹${cancelData.refundAmount !== undefined ? cancelData.refundAmount : 'full order'} initiated.`,
          type: 'announcement',
          targetAudience: 'all_users',
          channel: 'in_app',
          actionUrl: '/account?tab=orders',
          actionLabel: 'View Order',
          date: 'Just now',
          read: false,
          sender: 'foaxx.studio@gmail.com',
        },
        ...prev,
      ]);
    }

    showToast(`Order marked as cancelled with attribution & refund status logged.`, 'info');
  };

  const markOrderDelivered = (
    orderId: string,
    deliveryData?: {
      deliveredAt?: string;
      deliveryNotes?: string;
      notifyCustomer?: boolean;
    }
  ) => {
    const nowTime =
      deliveryData?.deliveredAt ||
      new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

    let deliveredOrderTarget: Order | null = null;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updatedEvents = [...o.events];
          updatedEvents.push({
            time: nowTime,
            title: 'Package Delivered to Consignee Doorstep',
            location: `${o.shippingAddress.city} Destination Hub`,
            completed: true,
          });
          const updated = {
            ...o,
            shippingStatus: 'Delivered' as const,
            deliveredAt: nowTime,
            isDelayed: false,
            events: updatedEvents,
          };
          deliveredOrderTarget = updated;
          return updated;
        }
        return o;
      })
    );

    if (deliveredOrderTarget) {
      triggerShipmentStatusEmail({
        order: deliveredOrderTarget,
        status: 'Delivered',
      });
    }

    if (deliveryData?.notifyCustomer) {
      setAppNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          title: `Package Delivered Successfully!`,
          message: `Your FOAXX luxury order has arrived at your doorstep. We hope you adore your handcrafted selection.`,
          type: 'announcement',
          targetAudience: 'all_users',
          channel: 'in_app',
          actionUrl: '/account?tab=orders',
          actionLabel: 'View Order',
          date: 'Just now',
          read: false,
          sender: 'foaxx.studio@gmail.com',
        },
        ...prev,
      ]);
    }

    showToast(`Order marked as Delivered! Doorstep timestamp recorded.`, 'success');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast(`Coupon ${coupon.code} created`);
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    if (appliedCoupon?.code === code) {
      setAppliedCoupon(null);
    }
    showToast(`Promo code ${code} deleted`, 'info');
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setHomepageConfig(INITIAL_HOMEPAGE_CONFIG);
    setOrders(INITIAL_ORDERS);
    setCoupons(INITIAL_COUPONS);
    localStorage.clear();
    showToast('Reset store data to default reference values');
  };

  return (
    <StoreContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authInitialMode,
        setAuthInitialMode,
        openAuth,
        activePolicy,
        setActivePolicy,
        isSearchModalOpen,
        setIsSearchModalOpen,
        quickViewProduct,
        setQuickViewProduct,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        sizeGuideCategory,
        setSizeGuideCategory,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
        recentlyViewed,
        addRecentlyViewed,
        giftOption,
        setGiftOption,
        cart,
        cartCount,
        cartSubtotal,
        discountAmount,
        shippingAmount,
        giftAmount,
        cartTotal,
        appliedCoupon,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        products,
        categories,
        homepageConfig,
        reviews: homepageConfig.reviews || INITIAL_REVIEWS,
        faqs: homepageConfig.faqs || INITIAL_FAQS,
        orders,
        coupons,
        activeTrackingOrder,
        setActiveTrackingOrder,
        reviewedItems,
        pendingReviewItems,
        isReviewModalOpen,
        reviewModalProduct,
        reviewModalOrderId,
        openReviewModal,
        closeReviewModal,
        addProductReview,
        cancelOrder,
        requestReturn,
        updateProduct,
        addProduct,
        deleteProduct,
        updateHomepageConfig,
        addReview,
        updateReview,
        deleteReview,
        moderateReview,
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
        updateOrderStatus,
        updateOrderCourier,
        markOrderDelayed,
        cancelOrderWithDetails,
        markOrderDelivered,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        resetToDefaults,
        // FOAXX Coins & Rewards
        coinWallet,
        earnCoins,
        redeemCoins,
        redeemedCoinsAtCheckout,
        setRedeemedCoinsAtCheckout,
        coinDiscountAmount,
        // Product Sharing & Modal
        isShareModalOpen,
        shareProduct,
        openShareModal,
        closeShareModal,
        user,
        setUser,
        logoutUser,
        createOrder,
        // Broadcast & Email Marketing Studio
        appNotifications,
        unreadNotificationsCount,
        emailTemplates,
        sentCampaignLogs,
        subscribers,
        sendNotificationCampaign,
        markNotificationAsRead,
        clearNotifications,
        saveEmailTemplate,
        deleteEmailTemplate,
        addSubscriber,
        // Automated Transactional System Emails (from foaxx.studio@gmail.com)
        transactionalEmails,
        triggerWelcomeEmail,
        triggerPasswordResetEmail,
        triggerOrderConfirmationEmail,
        triggerShipmentStatusEmail,
        resendTransactionalEmail,
        // Manager Portal & Access Control
        managers,
        activeManager,
        setActiveManager,
        addManager,
        updateManager,
        deleteManager,
        toggleManagerPermission,
        loginAsManager,
        logoutManager,
        // Tasks & Delegation System
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addTaskNote,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
