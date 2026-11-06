import { ManagerAccount, ManagerPermission } from '../types';

export interface PermissionDefinition {
  id: ManagerPermission;
  name: string;
  subLabel: string;
  category: 'Catalog' | 'Marketing' | 'Operations';
  description: string;
  icon: string;
  badgeColor: string;
}

export const PERMISSION_DEFINITIONS: PermissionDefinition[] = [
  {
    id: 'products',
    name: 'Products & Upload Section',
    subLabel: 'Catalog inventory, pricing & media uploads',
    category: 'Catalog',
    description: 'Add new products, upload images, update prices, discounts, stock, and descriptions',
    icon: 'Package',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'banners',
    name: 'Hero & Homepage Banners',
    subLabel: 'Hero banners & promotional carousels',
    category: 'Marketing',
    description: 'Manage editorial banners, category highlights, announcement bar, and craftsmanship story',
    icon: 'ImageIcon',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'deals',
    name: 'Flash Deals & Countdown',
    subLabel: 'Limited-time deals & countdown timers',
    category: 'Marketing',
    description: 'Control limited-time flash sales, countdown timers, deal tickets, and coupon bindings',
    icon: 'Zap',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'festive',
    name: 'Festive & Occasion Grand Sale',
    subLabel: 'Festive spotlights & bridal showcases',
    category: 'Marketing',
    description: 'Configure Festive picks carousel, occasion hero banner, bank discount tags',
    icon: 'Sparkles',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'coupons',
    name: 'Discount Coupons & Vouchers',
    subLabel: 'Promotional discount codes & rules',
    category: 'Marketing',
    description: 'Create promotional coupon codes, percentage off, minimum cart value rules, and status',
    icon: 'Tag',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'orders',
    name: 'Orders & Dispatch Management',
    subLabel: 'Fulfillment & courier dispatch tracking',
    category: 'Operations',
    description: 'Process incoming orders, change shipping status (Shipped, Out for Delivery, Delivered), manage returns',
    icon: 'Truck',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'reviews',
    name: 'Customer Reviews Moderation',
    subLabel: 'Client ratings & testimonial moderation',
    category: 'Catalog',
    description: 'Review and approve customer ratings, photo feedback, and client muse testimonials',
    icon: 'Star',
    badgeColor: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  {
    id: 'faqs',
    name: 'FAQs & Help Center',
    subLabel: 'Frequently asked customer questions',
    category: 'Operations',
    description: 'Manage store frequently asked questions, answers, and shopping concierge guidance',
    icon: 'HelpCircle',
    badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
  },
  {
    id: 'notifications',
    name: 'Notifications & Email Studio',
    subLabel: 'Broadcast notifications & email studio',
    category: 'Marketing',
    description: 'Send broadcasts to users/subscribers, compose rich email templates, review delivery logs',
    icon: 'Bell',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    id: 'subscribers',
    name: 'Subscribers & Customer List',
    subLabel: 'Customer directory & newsletter list',
    category: 'Operations',
    description: 'Access the list of newsletter subscribers, registered accounts, VIP statuses, and contacts',
    icon: 'Users',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
];

export const INITIAL_MANAGERS: ManagerAccount[] = [
  {
    id: 'mgr-1',
    name: 'Rahul Verma',
    email: 'rahul.verma@foaxx.com',
    roleTitle: 'Catalog & Upload Lead',
    phone: '+91 98376 11001',
    accessPin: '1234',
    permissions: ['products', 'reviews', 'faqs'],
    isActive: true,
    createdAt: '2026-10-15T10:00:00Z',
    lastActive: 'Today at 02:45 PM',
  },
  {
    id: 'mgr-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@foaxx.com',
    roleTitle: 'Orders & Dispatch Manager',
    phone: '+91 98376 22002',
    accessPin: '5678',
    permissions: ['orders', 'coupons'],
    isActive: true,
    createdAt: '2026-10-20T11:30:00Z',
    lastActive: 'Today at 01:15 PM',
  },
  {
    id: 'mgr-3',
    name: 'Ananya Sen',
    email: 'ananya.sen@foaxx.com',
    roleTitle: 'Marketing & Campaigns Specialist',
    phone: '+91 98376 33003',
    accessPin: '9999',
    permissions: ['banners', 'deals', 'festive', 'notifications', 'subscribers'],
    isActive: true,
    createdAt: '2026-10-25T09:00:00Z',
    lastActive: 'Yesterday at 05:30 PM',
  },
];
