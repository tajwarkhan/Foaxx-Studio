import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  Heart,
  Menu,
  Percent,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  User,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsAuthModalOpen,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    products,
    setSelectedProduct,
    homepageConfig,
    user,
    applyCoupon,
    setIsSearchModalOpen,
    pendingReviewItems,
    openReviewModal,
    coinWallet,
    appNotifications,
    unreadNotificationsCount,
    markNotificationAsRead,
  } = useStore();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close search and notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCategory('All');
      setCurrentView('shop');
      setSearchFocused(false);
    }
  };

  const navItems = [
    { label: 'New In', href: 'New In', hasDropdown: false },
    {
      label: 'Clothing',
      href: 'Clothing',
      hasDropdown: true,
      subItems: ['Co-ord Sets', 'Tops & Shirts', 'Kurtis & Tunics', 'Bottoms', 'Jumpsuits'],
      featuredImage: '/assets/extracted/prod_floral_coord.png',
      featuredTitle: 'Floral Co-ords Edit',
    },
    {
      label: 'Jewellery',
      href: 'Jewellery',
      hasDropdown: true,
      subItems: ['Polki & Kundan', 'Gold Plated', 'Silver 925', 'Earrings', 'Necklaces', 'Rings'],
      featuredImage: '/assets/extracted/banner_jewellery_edit.png',
      featuredTitle: 'Heirloom Jewellery',
    },
    {
      label: 'Accessories',
      href: 'Accessories',
      hasDropdown: true,
      subItems: ['Sunglasses', 'Belts', 'Hair Accessories', 'Scarves', 'Card Holders'],
      featuredImage: '/assets/extracted/cat_accessories.png',
      featuredTitle: 'Signature Accents',
    },
    {
      label: 'Bags',
      href: 'Bags',
      hasDropdown: true,
      subItems: ['Shoulder Bags', 'Tote Bags', 'Clutches', 'Crossbody', 'Mini Vanity'],
      featuredImage: '/assets/extracted/prod_classic_bag.png',
      featuredTitle: 'Classic Shoulder Bags',
    },
    {
      label: 'Footwear',
      href: 'Footwear',
      hasDropdown: true,
      subItems: ['Strappy Heels', 'Block Heels', 'Flats & Mules', 'Stilettos', 'Kitten Heels'],
      featuredImage: '/assets/extracted/prod_strappy_heels.png',
      featuredTitle: 'Architectural Heels',
    },
    {
      label: 'Collections',
      href: 'Collections',
      hasDropdown: true,
      subItems: ['The Jewellery Edit', 'Everyday Essentials', 'Festive Glam', 'Bestsellers'],
      featuredImage: '/assets/extracted/banner_festive_glam.png',
      featuredTitle: 'Festive Glamour',
    },
    { label: 'Sale', href: 'Sale', hasDropdown: false, isSale: true },
  ];

  const handleNavClick = (label: string) => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    if (label === 'New In') {
      setSelectedCategory('All');
      setCurrentView('shop');
    } else if (label === 'Sale') {
      setSelectedCategory('All');
      setCurrentView('shop');
    } else {
      setSelectedCategory(label);
      setCurrentView('shop');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* 1. TOP BLACK ANNOUNCEMENT BAR */}
      <div className="bg-[#111111] text-white text-[11px] sm:text-xs py-1.5 px-3 sm:px-6 tracking-wide">
        <div className="max-w-[1340px] mx-auto flex items-center justify-between">
          {/* Left Announcement */}
          <div className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
            <Truck className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <ChevronLeft className="w-3 h-3 text-stone-400 -mr-1 hidden sm:inline" />
            <span className="truncate">{homepageConfig.announcement.left}</span>
            <ChevronRight className="w-3 h-3 text-stone-400 -ml-1 hidden sm:inline" />
          </div>

          {/* Center Announcement with Auto-Apply */}
          <button
            onClick={() => applyCoupon(homepageConfig.announcement.couponCode)}
            className="flex items-center gap-1.5 text-center font-medium hover:text-[#f8b4b4] transition-colors cursor-pointer group"
          >
            <Percent className="w-3.5 h-3.5 text-[#E07A5F] group-hover:rotate-12 transition-transform" />
            <span className="font-semibold text-white tracking-wider">
              {homepageConfig.announcement.center}
            </span>
          </button>

          {/* Right Announcement */}
          <div className="hidden md:flex items-center gap-1.5 opacity-90">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{homepageConfig.announcement.right}</span>
            <ChevronRight className="w-3 h-3 text-stone-400" />
          </div>
        </div>
      </div>

      {/* 2. MAIN WHITE BRAND HEADER */}
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-8">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stone-700 hover:text-black md:hidden"
            aria-label="Open mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="text-[26px] sm:text-[32px] font-normal tracking-[0.28em] text-stone-900 leading-none font-serif-luxury">
              FOAXX
            </div>
            <div className="text-[7.5px] sm:text-[8.5px] tracking-[0.38em] text-stone-500 font-medium uppercase mt-0.5 sm:mt-1 pl-0.5">
              WEAR YOUR WOW.
            </div>
          </button>
        </div>

        {/* Center: Search Field */}
        <div className="relative flex-1 max-w-[580px] hidden sm:block">
          <div
            onClick={() => setIsSearchModalOpen(true)}
            className="relative flex items-center cursor-pointer group"
          >
            <input
              type="text"
              readOnly
              value={searchQuery}
              placeholder="Search for jewellery, dresses, bags, 18K gold..."
              className="w-full bg-[#f9f8f6] hover:bg-[#f4f2ee] text-stone-800 text-xs sm:text-[13px] pl-4 pr-12 py-2 sm:py-2.5 rounded-full border border-stone-200 transition-all placeholder:text-stone-400 cursor-pointer pointer-events-none"
            />
            <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#111111] group-hover:bg-black text-white flex items-center justify-center transition-colors">
              <Search className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Right: Notifications, Account, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Review & Delivery Notification Bell */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="flex flex-col items-center group cursor-pointer relative"
              title="Broadcasts, Offers & Notifications"
            >
              <div className="relative">
                <Bell className="w-5 h-5 text-stone-800 group-hover:text-black transition-colors stroke-[1.75]" />
                {(unreadNotificationsCount + pendingReviewItems.length) > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E07A5F] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none animate-pulse shadow-xs">
                    {unreadNotificationsCount + pendingReviewItems.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] text-stone-700 font-medium mt-0.5 group-hover:text-black">
                Alerts
              </span>
            </button>

            {/* Notification Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 p-4 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header without separate tabs */}
                <div className="flex items-center justify-between pb-2.5 border-b border-stone-100">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 text-xs">
                    <Bell className="w-4 h-4 text-amber-500" />
                    <span>FOAXX Notifications</span>
                    {(unreadNotificationsCount + pendingReviewItems.length) > 0 && (
                      <span className="bg-amber-400 text-zinc-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                        {unreadNotificationsCount + pendingReviewItems.length}
                      </span>
                    )}
                  </div>

                  {unreadNotificationsCount > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        appNotifications.forEach((n) => markNotificationAsRead(n.id));
                      }}
                      className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Unified Notifications Feed */}
                <div className="py-2 space-y-2 max-h-80 overflow-y-auto">
                  {appNotifications.length === 0 && pendingReviewItems.length === 0 ? (
                    <div className="py-8 text-center text-stone-500">
                      <Bell className="w-6 h-6 mx-auto text-stone-300 mb-2" />
                      <p className="font-medium text-stone-700 text-xs">No new notifications ✨</p>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        You're all caught up with your orders and studio drops.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Delivered Product Review Notifications */}
                      {pendingReviewItems.map(({ order, product, key }) => (
                        <div
                          key={key}
                          className="p-3 bg-amber-50/40 hover:bg-amber-50/70 border border-amber-200/80 rounded-xl transition-all space-y-2"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-14 object-cover rounded-md border border-stone-200 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded">
                                  Review Prompt
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                                  ✓ Delivered
                                </span>
                              </div>
                              <h4 className="text-xs font-semibold text-stone-900 truncate mt-1">
                                {product.name}
                              </h4>
                              <p className="text-[10px] text-stone-500">
                                Order #{order.orderNumber} · {order.date}
                              </p>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-between border-t border-amber-200/50">
                            <span className="text-[10px] text-[#E07A5F] font-bold flex items-center gap-1">
                              <span>⭐ Earn 100 FOAXX Coins</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                openReviewModal(product, order.id);
                                setIsNotificationsOpen(false);
                              }}
                              className="bg-[#E07A5F] hover:bg-[#c96a51] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                            >
                              <Camera className="w-3 h-3" />
                              <span>Review & Photo</span>
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Offers & Studio Announcements */}
                      {appNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.actionUrl) {
                              if (notif.actionUrl.includes('category=')) {
                                const cat = notif.actionUrl.split('category=')[1];
                                setSelectedCategory(cat || 'All');
                                setCurrentView('shop');
                              } else {
                                setCurrentView('home');
                              }
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                            setIsNotificationsOpen(false);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer space-y-1.5 ${
                            !notif.read
                              ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                              : 'bg-stone-50 hover:bg-stone-100/70 border-stone-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-stone-700 bg-stone-200/80 px-1.5 py-0.5 rounded">
                                Offer
                              </span>
                              <h4 className="text-xs font-bold text-stone-900 leading-snug">
                                {notif.title}
                              </h4>
                            </div>
                            {!notif.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>

                          <div className="flex items-center justify-between pt-1 text-[10px]">
                            {notif.promoCode ? (
                              <span className="font-mono font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                                {notif.promoCode}
                              </span>
                            ) : (
                              <span className="text-stone-400">foaxx.studio@gmail.com</span>
                            )}
                            <span className="text-amber-700 font-bold hover:underline">
                              {notif.actionLabel || 'Explore Offer →'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('account');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-[11px] text-stone-600 hover:text-stone-900 font-medium underline cursor-pointer"
                  >
                    Open Account Notification Hub →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          <button
            onClick={() => {
              if (user) {
                setCurrentView('account');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="flex flex-col items-center group cursor-pointer"
          >
            <User className="w-5 h-5 text-stone-800 group-hover:text-black transition-colors stroke-[1.75]" />
            <span className="text-[10px] sm:text-[11px] text-stone-700 font-medium mt-0.5 group-hover:text-black">
              {user ? 'Account' : 'Login'}
            </span>
          </button>

          {/* FOAXX Coins Quick Button */}
          <button
            onClick={() => {
              setCurrentView('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="hidden sm:flex flex-col items-center group cursor-pointer relative"
            title={`FOAXX Coins: ${coinWallet.balance.toLocaleString('en-IN')} (Value: ₹${((coinWallet.balance / 1000) * 250).toFixed(0)})`}
          >
            <div className="relative">
              <Coins className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors stroke-[1.75]" />
              <span className="absolute -top-1.5 -right-2 bg-[#d4af37] text-stone-950 text-[9px] font-black rounded-full px-1 h-3.5 flex items-center justify-center leading-none">
                {coinWallet.balance >= 1000 ? `${(coinWallet.balance / 1000).toFixed(1)}k` : coinWallet.balance}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-amber-900 font-semibold mt-0.5 group-hover:text-black">
              Coins
            </span>
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setCurrentView('wishlist')}
            className="flex flex-col items-center relative group cursor-pointer"
          >
            <div className="relative">
              <Heart
                className={`w-5 h-5 transition-colors stroke-[1.75] ${
                  wishlist.length > 0
                    ? 'fill-[#E07A5F] text-[#E07A5F]'
                    : 'text-stone-800 group-hover:text-black'
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#E07A5F] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-stone-700 font-medium mt-0.5 group-hover:text-black">
              Wishlist
            </span>
          </button>

          {/* Cart */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center relative group cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-stone-800 group-hover:text-black transition-colors stroke-[1.75]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#C93B3B] text-white text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center leading-none shadow-xs">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] sm:text-[11px] text-stone-700 font-medium mt-0.5 group-hover:text-black">
              Cart
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search bar */}
      <div className="px-4 pb-2.5 sm:hidden">
        <div
          onClick={() => setIsSearchModalOpen(true)}
          className="relative flex items-center cursor-pointer"
        >
          <input
            type="text"
            readOnly
            value={searchQuery}
            placeholder="Search jewellery, dresses, bags..."
            className="w-full bg-[#f8f7f5] text-stone-800 text-xs pl-3 pr-10 py-2 rounded-full border border-stone-200 pointer-events-none"
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* 3. SECONDARY NAVIGATION ROW */}
      <nav className="border-t border-stone-100 bg-white hidden md:block">
        <div className="max-w-[1340px] mx-auto px-6">
          <div className="flex items-center justify-center gap-7 lg:gap-10 py-2.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => handleNavClick(item.label)}
                  className={`flex items-center gap-1 text-[13px] font-medium tracking-wide transition-colors py-1 cursor-pointer ${
                    item.isSale
                      ? 'text-[#C93B3B] hover:text-[#a82525] font-semibold'
                      : 'text-stone-700 hover:text-black'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-black transition-transform" />
                  )}
                  {item.isSale && (
                    <span className="bg-[#E45858] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ml-0.5">
                      HOT
                    </span>
                  )}
                </button>

                {/* Desktop Mega-menu dropdown */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[460px] bg-white rounded-xl shadow-2xl border border-stone-100 p-5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-2.5">
                          Explore {item.label}
                        </div>
                        <ul className="space-y-1.5">
                          {item.subItems?.map((sub) => (
                            <li key={sub}>
                              <button
                                onClick={() => {
                                  setSelectedCategory(sub);
                                  setCurrentView('shop');
                                  setActiveDropdown(null);
                                }}
                                className="text-xs text-stone-600 hover:text-stone-900 hover:translate-x-1 transition-all flex items-center gap-1.5 py-0.5 w-full text-left"
                              >
                                <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                                {sub}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.featuredImage && (
                        <div
                          onClick={() => {
                            setSelectedCategory(item.label);
                            setCurrentView('shop');
                            setActiveDropdown(null);
                          }}
                          className="group/card cursor-pointer relative rounded-lg overflow-hidden border border-stone-100 bg-stone-50 p-2 text-center"
                        >
                          <img
                            src={item.featuredImage}
                            alt={item.featuredTitle || item.label}
                            className="w-full h-28 object-cover rounded-md group-hover/card:scale-105 transition-transform duration-300"
                          />
                          <p className="text-xs font-semibold text-stone-900 mt-2 truncate">
                            {item.featuredTitle}
                          </p>
                          <p className="text-[10px] text-stone-500">Shop Collection →</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden flex">
          <div className="w-[280px] bg-white h-full p-5 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <span className="font-serif-luxury text-xl font-bold tracking-[0.2em] text-stone-900">
                  FOAXX
                </span>
                <p className="text-[7px] tracking-[0.3em] text-stone-500 uppercase">WEAR YOUR WOW.</p>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                <X className="w-5 h-5 text-stone-600" />
              </button>
            </div>

            <div className="py-4 space-y-2 flex-1">
              {navItems.map((nav) => (
                <button
                  key={nav.label}
                  onClick={() => handleNavClick(nav.label)}
                  className="w-full text-left py-2 px-2 text-sm font-medium text-stone-800 hover:bg-stone-50 rounded-lg flex items-center justify-between"
                >
                  <span className={nav.isSale ? 'text-[#C93B3B] font-semibold' : ''}>
                    {nav.label}
                  </span>
                  {nav.isSale && (
                    <span className="bg-[#E45858] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                      HOT
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg text-left flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-stone-500" />
                Store Admin Panel
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
};
