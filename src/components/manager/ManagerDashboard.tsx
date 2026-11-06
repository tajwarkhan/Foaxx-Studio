import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit2,
  ExternalLink,
  Flame,
  HelpCircle,
  Image as ImageIcon,
  KeyRound,
  LayoutDashboard,
  Lock,
  LogOut,
  Mail,
  Package,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  Upload,
  User,
  Users,
  X,
  Zap,
  CheckSquare,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  Coupon,
  CustomerReview,
  FaqItem,
  FestivePickCard,
  FlashDealOffer,
  ManagerPermission,
  Order,
  Product,
} from '../../types';
import { ManagerTasksView } from './ManagerTasksView';
import { ImageUploader } from '../admin/ImageUploader';
import { MultiImageUploader } from '../admin/MultiImageUploader';
import { ColorVariantEditor } from '../admin/ColorVariantEditor';
import { HomepageHub } from '../admin/HomepageHub';
import { NotificationMailStudio } from '../admin/NotificationMailStudio';
import { LogisticsHub } from '../admin/LogisticsHub';
import { PERMISSION_DEFINITIONS } from '../../data/initialManagers';

export const ManagerDashboard: React.FC = () => {
  const {
    activeManager,
    managers,
    loginAsManager,
    logoutManager,
    setCurrentView,
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    reviews,
    addReview,
    updateReview,
    deleteReview,
    faqs,
    addFaq,
    updateFaq,
    deleteFaq,
    homepageConfig,
    updateHomepageConfig,
    updateFlashDealsConfig,
    addFlashDeal,
    updateFlashDeal,
    deleteFlashDeal,
    updateFestivePicksConfig,
    addFestivePickCard,
    updateFestivePickCard,
    deleteFestivePickCard,
    updateOccasionSaleBanner,
    subscribers,
    addSubscriber,
    tasks,
    showToast,
  } = useStore();

  // If no manager is currently active, show Manager Sign-in screen
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPin, setLoginPin] = useState('');

  // Active manager permissions
  const permissions: ManagerPermission[] = activeManager?.permissions || [];

  // Active tab inside manager portal - default to tasks
  const [activeTab, setActiveTab] = useState<ManagerPermission | 'tasks'>('tasks');

  // Keep active tab in sync if permissions change
  React.useEffect(() => {
    if (activeTab !== 'tasks' && permissions.length > 0 && !permissions.includes(activeTab)) {
      setActiveTab('tasks');
    }
  }, [permissions, activeTab]);

  // Product states for upload/edit
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');

  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Jewellery',
    subCategory: 'Earrings & Jhumkas',
    price: 1499,
    originalPrice: 2199,
    discount: '32% OFF',
    badge: 'New',
    image: '/assets/extracted/cat_jewellery.png',
    gallery: [
      '/assets/extracted/cat_jewellery.png',
      '/assets/extracted/banner_jewellery_edit.png',
    ],
    colors: [
      { name: 'Kundan Gold', hex: '#E5C158', image: '/assets/extracted/cat_jewellery.png' },
      { name: 'Antique Silver', hex: '#C0C0C0', image: '/assets/extracted/banner_jewellery_edit.png' },
    ],
    material: '24K Gold Plated Brass & Kundan Stones',
    stock: 25,
    description: 'Artisanal masterpiece handcrafted by seasoned FOAXX Atelier karigars.',
    details: [
      'Hallmarked 24K micron plating',
      'Hypoallergenic, nickel & lead free',
      'Includes luxury gift velvet box & authenticity card',
    ],
  });

  // Coupon form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(25);
  const [newCouponMin, setNewCouponMin] = useState(1499);
  const [newCouponDesc, setNewCouponDesc] = useState('Exclusive Seasonal Privilege Offer');

  // Order status filter
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // If activeManager is null, render clean Manager Portal Sign-in screen
  if (!activeManager) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>FOAXX Staff Portal</span>
            </div>
            <h1 className="text-3xl font-serif font-bold tracking-wider text-amber-100">
              FOAXX STORE MANAGER
            </h1>
            <p className="text-xs text-stone-400">
              Enter your work email and access PIN to open your authorized duties portal.
            </p>
          </div>

          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Quick 1-Click Profile Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Quick Select Manager Profile:
              </label>
              <div className="space-y-2">
                {managers.map((mgr) => (
                  <button
                    key={mgr.id}
                    onClick={() => loginAsManager(mgr.id)}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-stone-800 bg-stone-950/70 hover:bg-amber-950/30 hover:border-amber-500/50 transition-all text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs border border-amber-500/30">
                        {mgr.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-200 group-hover:text-amber-200">
                          {mgr.name}
                        </div>
                        <div className="text-[10px] text-amber-400/80">{mgr.roleTitle}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-400 group-hover:text-amber-300 font-medium">
                      {mgr.permissions.length} duties →
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-stone-800" />
              <span className="flex-shrink mx-3 text-stone-500 text-[10px] uppercase font-bold">
                Or sign in with email
              </span>
              <div className="flex-grow border-t border-stone-800" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginAsManager(loginEmail, loginPin);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs text-stone-300 font-medium mb-1">
                  Manager Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.verma@foaxx.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-300 font-medium mb-1">
                  Access PIN
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="Enter 4-digit PIN (default 1234)"
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b38f2a] hover:from-[#e5bf43] hover:to-[#c49f34] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Sign In to Manager Portal
              </button>
            </form>

            <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-stone-800">
              <button
                onClick={() => setCurrentView('home')}
                className="hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
              </button>
              <button
                onClick={() => setCurrentView('admin')}
                className="text-amber-400 hover:text-amber-300 transition-colors cursor-pointer font-medium"
              >
                Admin Master Panel →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle saving new product
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name?.trim()) {
      showToast('Please enter product name', 'error');
      return;
    }

    const price = Number(newProductForm.price) || 999;
    const originalPrice = Number(newProductForm.originalPrice) || price + 500;
    const discount =
      originalPrice > price
        ? `${Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF`
        : '0% OFF';

    const productToAdd: Product = {
      id: `prod-${Date.now()}`,
      name: newProductForm.name,
      category: newProductForm.category || 'Jewellery',
      subCategory: newProductForm.subCategory,
      price,
      originalPrice,
      discount,
      badge: (newProductForm.badge as any) || 'New',
      image: newProductForm.image || '/assets/extracted/cat_jewellery.png',
      gallery: newProductForm.gallery && newProductForm.gallery.length > 0
        ? newProductForm.gallery
        : [newProductForm.image || '/assets/extracted/cat_jewellery.png'],
      colors: newProductForm.colors && newProductForm.colors.length > 0
        ? newProductForm.colors
        : [{ name: 'Default', hex: '#d4af37', image: newProductForm.image }],
      description:
        newProductForm.description ||
        'Handcrafted with utmost care and luxury detailing by FOAXX Atelier.',
      details: newProductForm.details || ['Authentic FOAXX creation', 'Certified materials'],
      material: newProductForm.material || 'Premium Gold Plating',
      stock: Number(newProductForm.stock) || 20,
      rating: 4.8,
      reviewCount: 1,
      isNewArrival: true,
      isFeatured: true,
    };

    addProduct(productToAdd);
    setIsAddingProduct(false);
    setNewProductForm({
      name: '',
      category: 'Jewellery',
      price: 1499,
      originalPrice: 2199,
      discount: '32% OFF',
      badge: 'New',
      image: '/assets/extracted/cat_jewellery.png',
    });
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat =
      selectedProductCategory === 'All' || p.category === selectedProductCategory;
    return matchesSearch && matchesCat;
  });

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.shippingStatus === orderStatusFilter;
  });

  const getPermissionDef = (id: ManagerPermission) => {
    return PERMISSION_DEFINITIONS.find((p) => p.id === id);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Bar for Manager Portal */}
      <header className="bg-stone-900 border-b border-stone-800 text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
              title="Return to Storefront"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-widest font-black text-amber-400 text-sm sm:text-base">
                  FOAXX
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Manager Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Official Duties Dashboard for Authorized Staff
              </p>
            </div>
          </div>

          {/* Active Manager Profile Pill */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="bg-stone-800/80 border border-stone-700/80 px-3 py-1.5 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-black text-xs flex items-center justify-center">
                {activeManager.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {activeManager.name}
                </div>
                <div className="text-[10px] text-amber-400 font-medium">
                  {activeManager.roleTitle} · {permissions.length} duties
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('admin')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Open Admin Master Panel"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Panel</span>
            </button>

            <button
              onClick={logoutManager}
              className="px-2.5 py-1.5 text-xs font-semibold bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sign out of Manager Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Assigned Tasks + Permitted Sections) */}
        <div className="border-t border-stone-800/90 bg-stone-950/90 px-4 sm:px-6">
          <div className="max-w-[1400px] mx-auto flex items-center gap-1.5 overflow-x-auto py-1.5 no-scrollbar">
            {/* Always accessible: My Assigned Tasks */}
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'tasks'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'text-stone-300 hover:text-white hover:bg-stone-900'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>My Assigned Tasks</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === 'tasks'
                    ? 'bg-stone-950 text-amber-300'
                    : 'bg-stone-800 text-stone-300'
                }`}
              >
                {
                  tasks.filter(
                    (t) =>
                      t.type === 'manager_assigned' &&
                      (t.assignedToManagerId === activeManager.id || !t.assignedToManagerId) &&
                      t.status !== 'completed'
                  ).length
                }
              </span>
              {tasks.some(
                (t) =>
                  t.type === 'manager_assigned' &&
                  (t.assignedToManagerId === activeManager.id || !t.assignedToManagerId) &&
                  t.status === 'blocked'
              ) && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
            </button>

            {/* Separator if permissions exist */}
            {permissions.length > 0 && <div className="h-4 w-px bg-stone-800 mx-1" />}

            {/* Dynamic Duties Navigation Tabs */}
            {permissions.map((permId) => {
              const def = getPermissionDef(permId);
              const isActive = activeTab === permId;

              return (
                <button
                  key={permId}
                  onClick={() => setActiveTab(permId)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-900'
                  }`}
                >
                  <span>{def?.name || permId}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Render Assigned Tasks View */}
        {activeTab === 'tasks' ? (
          <ManagerTasksView
            managerId={activeManager.id}
            managerName={activeManager.name}
          />
        ) : permissions.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="text-lg font-bold text-stone-900">
              No Section Duties Assigned Yet
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              No specific section duties (Catalog, Orders, Banners, etc.) have been assigned to your manager account yet. You can still manage your delegated workflows in the <strong>&ldquo;My Assigned Tasks&rdquo;</strong> tab above.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('tasks')}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold rounded-xl shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4 text-amber-400" />
                <span>View Assigned Tasks</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1. PRODUCTS & UPLOAD SECTION */}
            {activeTab === 'products' && (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      Product Catalog & Upload Studio
                    </h3>
                    <p className="text-xs text-stone-500">
                      Manage inventory, pricing, discount tags, and upload new luxury merchandise.
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddingProduct(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b38f2a] hover:from-[#e5bf43] hover:to-[#c49f34] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Upload New Product</span>
                  </button>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search products by title or category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                    {['All', 'Jewellery', 'Clothing', 'Dresses', 'Bags', 'Footwear'].map(
                      (cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedProductCategory(cat)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                            selectedProductCategory === cat
                              ? 'bg-stone-900 text-white'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Products Table */}
                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Item & Visual</th>
                          <th className="py-3 px-3">Category</th>
                          <th className="py-3 px-3">Price & MRP</th>
                          <th className="py-3 px-3">Discount</th>
                          <th className="py-3 px-3">Stock Units</th>
                          <th className="py-3 px-3">Colors</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {filteredProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-12 h-14 object-cover rounded-lg border border-stone-200 shrink-0"
                                />
                                <div>
                                  <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                                  <div className="text-[10px] text-stone-400 font-mono">ID: {p.id}</div>
                                  {p.badge && (
                                    <span className="inline-block mt-0.5 text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase">
                                      {p.badge}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-medium text-stone-700">{p.category}</td>
                            <td className="py-3 px-3 font-semibold text-stone-900">
                              ₹{p.price.toLocaleString('en-IN')}
                              <span className="text-[10px] text-stone-400 line-through block font-normal">
                                ₹{p.originalPrice.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                                {p.discount}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  value={p.stock}
                                  onChange={(e) => {
                                    const val = Math.max(0, parseInt(e.target.value) || 0);
                                    updateProduct({ ...p, stock: val });
                                  }}
                                  className="w-16 px-2 py-1 text-xs border border-stone-200 rounded font-semibold text-stone-800 text-center"
                                />
                                <span className="text-[10px] text-stone-400">units</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                {p.colors?.map((c, i) => (
                                  <span
                                    key={i}
                                    className="w-4 h-4 rounded-full border border-stone-300"
                                    style={{ backgroundColor: c.hex }}
                                    title={c.name}
                                  />
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingProduct(p)}
                                  className="p-1.5 text-stone-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Delete "${p.name}"?`)) {
                                      deleteProduct(p.id);
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDERS & FULFILLMENT SECTION */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <LogisticsHub initialFilter="all" />
              </div>
            )}

            {/* 3. BANNERS & HOMEPAGE HUB */}
            {activeTab === 'banners' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Hero & Homepage Editorial Banners
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live visual control for hero headlines, luxury collection banners, and brand statements.
                  </p>
                </div>
                <HomepageHub initialSubTab="all" />
              </div>
            )}

            {/* 4. FLASH DEALS */}
            {activeTab === 'deals' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Flash Deals & Limited-Time Offers
                  </h3>
                  <p className="text-xs text-stone-500">
                    Manage countdown timers, perforated tickets, and instant promo deals.
                  </p>
                </div>
                <HomepageHub initialSubTab="deals" />
              </div>
            )}

            {/* 5. FESTIVE & OCCASION */}
            {activeTab === 'festive' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Festive & Occasion Grand Sale Hub
                  </h3>
                  <p className="text-xs text-stone-500">
                    Curate seasonal bridal, Diwali, and festive couture showcase sections.
                  </p>
                </div>
                <HomepageHub initialSubTab="occasion" />
              </div>
            )}

            {/* 6. COUPONS & DISCOUNTS */}
            {activeTab === 'coupons' && (
              <div className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900">
                      Discount Coupons & Vouchers
                    </h3>
                    <p className="text-xs text-stone-500">
                      Create promotional codes for customers to apply at checkout.
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newCouponCode.trim()) return;
                      addCoupon({
                        code: newCouponCode.trim().toUpperCase(),
                        discountPercent: Number(newCouponDiscount),
                        minOrderValue: Number(newCouponMin),
                        description: newCouponDesc,
                        isActive: true,
                        category: 'All',
                        validityType: 'indefinite',
                      });
                      setNewCouponCode('');
                    }}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2"
                  >
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Coupon Code *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. FESTIVE30"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold uppercase border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={90}
                        value={newCouponDiscount}
                        onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                        Min Order (₹)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={newCouponMin}
                        onChange={(e) => setNewCouponMin(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs uppercase rounded-lg cursor-pointer"
                      >
                        + Create Coupon
                      </button>
                    </div>
                  </form>
                </div>

                {/* Coupons List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div
                      key={c.code}
                      className={`p-4 rounded-2xl border transition-all ${
                        c.isActive
                          ? 'bg-white border-stone-200 shadow-xs'
                          : 'bg-stone-100/60 border-stone-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-stone-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <button
                          onClick={() => toggleCoupon(c.code)}
                          className={`text-xs font-bold px-2 py-0.5 rounded-full cursor-pointer ${
                            c.isActive
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </div>

                      <div className="mt-3">
                        <div className="text-xl font-bold text-stone-900">
                          {c.discountPercent}% OFF
                        </div>
                        <p className="text-xs text-stone-600 mt-1">{c.description}</p>
                        <p className="text-[11px] text-stone-400 mt-1">
                          Min order: ₹{c.minOrderValue.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-stone-100 flex justify-end">
                        <button
                          onClick={() => deleteCoupon(c.code)}
                          className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. CUSTOMER REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Customer Reviews & Rating Moderation
                  </h3>
                  <p className="text-xs text-stone-500">
                    Moderate client testimonials, approve feedback, and monitor product satisfaction.
                  </p>
                </div>
                <HomepageHub initialSubTab="reviews" />
              </div>
            )}

            {/* 8. FAQS */}
            {activeTab === 'faqs' && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Frequently Asked Questions & Studio Concierge
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add and update frequent queries regarding hallmarking, shipping, and order returns.
                  </p>
                </div>
                <HomepageHub initialSubTab="faqs" />
              </div>
            )}

            {/* 9. NOTIFICATIONS & EMAIL STUDIO */}
            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <NotificationMailStudio />
              </div>
            )}

            {/* 10. SUBSCRIBERS */}
            {activeTab === 'subscribers' && (
              <div className="space-y-5">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <h3 className="text-base sm:text-lg font-bold text-stone-900">
                    Newsletter Subscribers & Customers Directory
                  </h3>
                  <p className="text-xs text-stone-500">
                    Total active subscribers: {subscribers.length}. Send marketing campaigns or export list.
                  </p>
                </div>

                <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Customer Email</th>
                        <th className="py-3 px-3">Date Subscribed</th>
                        <th className="py-3 px-3">Source</th>
                        <th className="py-3 px-3">Account Status</th>
                        <th className="py-3 px-3">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {subscribers.map((s) => (
                        <tr key={s.id} className="hover:bg-stone-50">
                          <td className="py-3 px-4 font-mono font-medium text-stone-900">
                            {s.email}
                          </td>
                          <td className="py-3 px-3 text-stone-600">{s.subscribedAt}</td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-semibold">
                              {s.source}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                              {s.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-stone-500 uppercase text-[10px]">
                            {s.role || 'Customer'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Upload Product Modal for Managers */}
      {isAddingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Upload New Product</h3>
                  <p className="text-[11px] text-stone-500">
                    Add high-resolution image, pricing, and stock details.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddingProduct(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Nizam Emerald & Polki Choker"
                  value={newProductForm.name}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) =>
                      setNewProductForm({ ...newProductForm, category: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  >
                    <option value="Jewellery">Jewellery</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Bags">Bags</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Collections">Collections</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProductForm.price}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    MRP / Original (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newProductForm.originalPrice}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        originalPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={newProductForm.stock}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Badge
                  </label>
                  <select
                    value={newProductForm.badge || 'New'}
                    onChange={(e) =>
                      setNewProductForm({
                        ...newProductForm,
                        badge: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  >
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Sale">Sale</option>
                  </select>
                </div>
              </div>

              {/* Picture Upload via ImageUploader */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Primary Product Photo (Upload or Select)
                </label>
                <ImageUploader
                  currentImage={newProductForm.image || '/assets/extracted/cat_jewellery.png'}
                  onImageChange={(img: string) =>
                    setNewProductForm({ ...newProductForm, image: img })
                  }
                  label="Upload Product Photo"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Artisanal craftsmanship, materials and styling guidance..."
                  value={newProductForm.description}
                  onChange={(e) =>
                    setNewProductForm({ ...newProductForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProduct(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b38f2a] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                >
                  Save & Publish Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Edit {editingProduct.name}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Price (₹)
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
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        stock: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Product Picture
                </label>
                <ImageUploader
                  currentImage={editingProduct.image}
                  onImageChange={(img: string) =>
                    setEditingProduct({ ...editingProduct, image: img })
                  }
                  label="Change Picture"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3 py-2 text-xs font-semibold text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateProduct(editingProduct);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-stone-900 text-amber-300 font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
