export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ProductReviewItem {
  id: string;
  productId: string;
  name: string;
  location?: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  image?: string;
  helpfulCount: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  originalPrice: number;
  discount: string;
  badge: 'New' | 'Bestseller' | 'Sale' | null;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  sizes?: string[];
  description: string;
  details: string[];
  material: string;
  stock: number;
  rating: number;
  reviewCount: number;
  reviewsList?: ProductReviewItem[];
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  subCategories?: string[];
}

export interface CollectionBanner {
  id: string;
  title: string;
  prefix?: string;
  subtitle: string;
  buttonText: string;
  image: string;
  category: string;
  visualTheme: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedColorHex?: string;
  selectedColorImage?: string;
  selectedSize?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  address: string;
  locality?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface TrackingEvent {
  time: string;
  title: string;
  location: string;
  completed: boolean;
}

export interface GiftOption {
  enabled: boolean;
  recipientName: string;
  message: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  giftWrappingFee?: number;
  giftOption?: GiftOption;
  total: number;
  appliedCoupon?: string;
  paymentMethod: string;
  paymentStatus: 'Paid' | 'Pending' | 'COD';
  shippingStatus: 'Order Placed' | 'Confirmed' | 'Processing' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Return Requested';
  trackingNumber: string;
  courier: string;
  trackingUrl?: string; // Live courier tracking URL (BlueDart, Delhivery, DTDC, etc.)
  estimatedDelivery: string;
  shippingAddress: ShippingAddress;
  events: TrackingEvent[];
  cancelReason?: string;
  cancelledBy?: 'Customer' | 'Admin' | 'Manager' | 'System';
  cancelledAt?: string;
  refundStatus?: 'Pending' | 'Refund Initiated' | 'Refund Completed' | 'Not Applicable';
  refundAmount?: number;
  refundMethod?: string;
  returnReason?: string;
  isDelayed?: boolean;
  delayReason?: string;
  originalEstimatedDelivery?: string;
  revisedEstimatedDelivery?: string;
  deliveredAt?: string;
  dispatchedAt?: string;
  logisticsNotes?: string;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  maxDiscount?: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
  category?: string; // 'All' or specific category like 'Jewellery', 'Clothing', 'Bags', etc.
  validityType?: 'indefinite' | 'dated'; // valid until disabled by admin or dated
  expiryDate?: string;
  createdAt?: string;
}

export interface CoinTransaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  referenceId?: string;
}

export interface CoinWallet {
  balance: number;
  transactions: CoinTransaction[];
  referralCode: string;
}

export interface AnnouncementConfig {
  left: string;
  center: string;
  right: string;
  couponCode: string;
}

export interface HeroConfig {
  brandTag: string;
  headlineLine1: string;
  headlineLine2: string;
  statementWord: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  image: string;
}

export interface HeroSlide {
  id: string;
  order: number;
  image: string;
  mobileImage?: string;
  brandTag: string;
  titlePart1: string;
  titlePart2: string;
  statementWord: string;
  subtitle: string;
  primaryBtnText: string;
  primaryBtnLinkCategory?: string;
  secondaryBtnText: string;
  secondaryBtnLinkCategory?: string;
  isDarkText: boolean;
  isActive: boolean;
  accentColor?: string;
}

export interface HeroCarouselSettings {
  autoSlide: boolean;
  intervalSeconds: number;
  pauseOnHover: boolean;
  showDots: boolean;
  showArrows: boolean;
}

export interface BenefitConfig {
  id: string;
  title: string;
  subtitle: string;
  iconName: 'truck' | 'package' | 'shield' | 'gem';
}

export interface CustomerReview {
  id: string;
  name: string;
  location: string;
  image: string;
  quote: string;
  rating: number;
  productName: string;
  productId: string;
  date: string;
  status?: 'pending' | 'approved' | 'rejected';
  moderatedAt?: string;
  moderatedBy?: string;
  featured?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FlashDealOffer {
  id: string;
  prefix: string; // e.g. "UP TO", "FLAT", "EXCLUSIVE"
  discountText: string; // e.g. "70% OFF", "30% OFF", "₹500 OFF"
  title: string; // e.g. "Bodycare Combos", "Polki & Choker Sets"
  subtitle?: string; // e.g. "+ Free Gifts", "Limited Edition"
  promoCode: string; // e.g. "FOAXX70", "FLASH30"
  image: string; // Product or offer image
  targetCategory?: string; // Target category to view on click
  themeStyle?: 'sunset' | 'gold' | 'emerald' | 'burgundy' | 'noir';
  badgeText?: string;
  isActive: boolean;
}

export interface FlashDealsConfig {
  enabled: boolean;
  sectionTitle: string;
  badgeText: string;
  targetEndTime: string; // ISO string or time string
  offers: FlashDealOffer[];
}

export interface FestivePickCard {
  id: string;
  badge: string; // e.g. "FOAXX ATELIER", "KUNDAN COUTURE", "SILVER 925"
  headline: string; // e.g. "KIARA'S FESTIVE PICKS", "BIG FESTIVE DIWALI BASH", "FESTIVE ICONS"
  offerText: string; // e.g. "Up To 40% Off", "Flat 30% Off"
  subtitle: string; // e.g. "On Jewellery Bestsellers", "On Handcrafted Co-ords"
  image: string; // Model + product hero image
  buttonText: string; // "Shop Now →"
  productId?: string; // Target product to redirect to on click
  targetCategory?: string; // Fallback category if product not set
  themeStyle?: 'rose' | 'gold' | 'emerald' | 'noir';
  isActive: boolean;
}

export interface FestivePicksConfig {
  enabled: boolean;
  sectionTitle: string;
  sectionSubtitle?: string;
  cards: FestivePickCard[];
}

export type OccasionType =
  | 'diwali'
  | 'eid'
  | 'valentines'
  | 'bridal'
  | 'newyear'
  | 'custom';

export interface OccasionSaleBannerConfig {
  enabled: boolean;
  occasionType: OccasionType;
  occasionName: string; // e.g. "BIG BANG DIWALI", "EID ROYALE BASH", "VALENTINE LOVE AFFAIR"
  headline: string; // e.g. "SALE IS LIVE", "GRANDEUR UNVEILED"
  subheadline?: string; // e.g. "Bank Offers Refreshed Daily · Handcrafted Kundan & Polki Editions"
  discountText: string; // e.g. "FLAT 40% OFF", "UP TO 50% OFF"
  promoCode: string; // e.g. "DIWALI40", "EIDMUBARAK", "VALENTINE30"
  promoDiscountPercent: number; // e.g. 40
  bannerImage: string; // e.g. "/assets/aistudio/image_8b11f93e.png"
  plaqueTitle: string; // e.g. "BANK OFFER REFRESHED DAILY"
  plaqueSubtitle?: string; // e.g. "10% Instant Discount on HDFC & ICICI Bank Cards"
  ctaText: string; // e.g. "EXPLORE DIWALI SALE →"
  targetCategory: string; // 'All' | 'Jewellery' | 'Clothing' | 'Dresses' | 'Bags' etc.
  themeStyle: 'crimson_gold' | 'emerald_gold' | 'rose_noir' | 'champagne_bridal' | 'midnight_purple' | 'custom';
  countdownEndTime?: string; // ISO string for live countdown timer
  showDiyasAndSparkles?: boolean;
}

export interface OccasionCardConfig {
  id: string;
  label: string;
  icon: string;
  tagline: string;
  stylistNote: string;
  heroImage: string;
  heroTitle: string;
  heroBadge: string;
  bundleProductIds: string[];
  isActive: boolean;
}

export interface ShopByOccasionConfig {
  enabled: boolean;
  sectionEyebrow: string;
  sectionTitle: string;
  sectionSubtitle?: string;
  bundleDiscountPercent: number;
  occasions: OccasionCardConfig[];
}

export interface ShopTheLookConfig {
  enabled: boolean;
  sectionBadge: string;
  sectionTitle: string;
  sectionSubtitle: string;
  editorialImage: string;
  editorialBadge: string;
  editorialHeadline: string;
  editorialSubtitle: string;
  bundleTitle: string;
  bundleDiscountPercent: number;
  bundlePerkText: string;
  productIds: string[];
}

export interface HomepageConfig {
  announcement: AnnouncementConfig;
  hero: HeroConfig;
  heroSlides?: HeroSlide[];
  heroCarouselSettings?: HeroCarouselSettings;
  benefits: BenefitConfig[];
  banners: CollectionBanner[];
  reviews?: CustomerReview[];
  faqs?: FaqItem[];
  flashDeals?: FlashDealsConfig;
  festivePicks?: FestivePicksConfig;
  occasionSaleBanner?: OccasionSaleBannerConfig;
  shopByOccasion?: ShopByOccasionConfig;
  shopTheLook?: ShopTheLookConfig;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  badge: string;
  searchQuery: string;
  sortBy: 'featured' | 'newest' | 'price-low-high' | 'price-high-low' | 'discount';
  inStockOnly: boolean;
}

// 🔔 NOTIFICATIONS & EMAIL CAMPAIGN TYPES
export type NotificationTarget =
  | 'all_users'
  | 'subscribers'
  | 'registered'
  | 'managers';

export type NotificationChannel = 'in_app' | 'email' | 'both';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'sale' | 'festive' | 'coins' | 'order' | 'system';
  targetAudience: NotificationTarget;
  channel: NotificationChannel;
  actionUrl?: string;
  actionLabel?: string;
  date: string;
  read?: boolean;
  sender: string;
  promoCode?: string;
  imageUrl?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: 'festive_sale' | 'flash_deal' | 'welcome_vip' | 'privilege_exclusive' | 'cart_abandoned' | 'custom';
  subject: string;
  preheader: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  badgeText: string;
  bodyContent: string;
  ctaText: string;
  ctaUrl: string;
  promoCode?: string;
  discountText?: string;
  themeColor: 'crimson_gold' | 'emerald_gold' | 'rose_noir' | 'sunset_amber' | 'royal_noir';
  senderEmail: string; // "foaxx.studio@gmail.com"
  senderName: string; // "FOAXX Luxury Atelier"
  updatedAt?: string;
}

export interface SentCampaignLog {
  id: string;
  templateId?: string;
  subject: string;
  targetAudience: NotificationTarget;
  channel: NotificationChannel;
  recipientCount: number;
  sentAt: string;
  status: 'Delivered' | 'Sending' | 'Failed';
  previewSnippet: string;
  promoCode?: string;
  senderEmail: string;
}

export interface TransactionalEmailLog {
  id: string;
  eventType:
    | 'welcome'
    | 'password_reset'
    | 'order_confirmation'
    | 'shipment_dispatched'
    | 'out_for_delivery'
    | 'delivered'
    | 'delivery_delayed'
    | 'order_cancelled';
  recipientEmail: string;
  recipientName: string;
  subject: string;
  preheader: string;
  senderEmail: string; // 'foaxx.studio@gmail.com'
  senderName: string;  // 'FOAXX Luxury Atelier'
  htmlContent: string;
  sentAt: string;
  status: 'Delivered' | 'Sent via Gmail' | 'Queued';
  orderId?: string;
  orderNumber?: string;
}

export interface SubscriberUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  subscribedAt: string;
  status: 'Active' | 'Unsubscribed';
  source: 'Footer' | 'Popup' | 'Checkout' | 'Auth';
  isRegisteredUser: boolean;
  role?: 'customer' | 'vip' | 'manager';
}

// 🛡️ ROLE-BASED ACCESS CONTROL & MANAGER PORTAL
export type ManagerPermission =
  | 'products'        // Product catalog, inventory, pricing, upload new items
  | 'banners'         // Homepage hero banners, video banner, craftsmanship story
  | 'deals'           // Flash deals & countdown offers
  | 'festive'         // Festive picks & occasion sale banners
  | 'coupons'         // Discount coupons & vouchers
  | 'orders'          // Order dispatch, tracking status, fulfillment
  | 'reviews'         // Customer review moderation
  | 'faqs'            // FAQs & help center
  | 'notifications'   // Notification & email campaign studio
  | 'subscribers';    // Customer & subscriber directory

export interface ManagerAccount {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  phone?: string;
  accessPin?: string;
  permissions: ManagerPermission[];
  isActive: boolean;
  createdAt: string;
  lastActive?: string;
}

// 📋 WORKFLOW & TASK MANAGEMENT (ADMIN PERSONAL & MANAGER DELEGATION)
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'completed';
export type TaskType = 'admin_self' | 'manager_assigned';

export interface TaskNoteEntry {
  id: string;
  authorRole: 'admin' | 'manager';
  authorName: string;
  message: string; // concise update or problem, max 100 words
  wordCount: number;
  createdAt: string;
  noteType: 'progress' | 'blocker' | 'resolution' | 'general';
}

export interface AppTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadlineDate: string; // YYYY-MM-DD
  deadlineTime?: string; // HH:MM
  assignedToManagerId?: string;
  assignedToManagerName?: string;
  assignedBy: string;
  createdAt: string;
  completedAt?: string;
  notes: TaskNoteEntry[];
}

