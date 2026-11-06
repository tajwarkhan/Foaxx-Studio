import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  ExternalLink,
  FileText,
  Gift,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  User,
  XCircle,
  Bell,
  Mail,
  Tag,
  ArrowRight,
  MailCheck,
  Eye,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, TransactionalEmailLog } from '../../types';
import { googleSignIn } from '../../lib/firebase';
import {
  SYSTEM_SENDER_EMAIL,
  createGmailComposeUrl,
  generateOrderConfirmationEmailHtml,
  generateShipmentStatusEmailHtml,
} from '../../services/transactionalEmailService';

export const AccountDashboard: React.FC = () => {
  const {
    user,
    setUser,
    logoutUser,
    orders,
    activeTrackingOrder,
    setActiveTrackingOrder,
    currentView,
    setCurrentView,
    setSelectedProduct,
    setActiveInvoiceOrder,
    cancelOrder,
    requestReturn,
    pendingReviewItems,
    openReviewModal,
    reviewedItems,
    showToast,
    coinWallet,
    earnCoins,
    products,
    appNotifications,
    markNotificationAsRead,
    clearNotifications,
    setSelectedCategory,
    transactionalEmails,
  } = useStore();

  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  const [activeTab, setActiveTab] = useState<'tracking' | 'orders' | 'profile' | 'coins' | 'notifications'>(
    currentView === 'tracking' ? 'tracking' : 'orders'
  );
  const [copiedRef, setCopiedRef] = useState(false);
  const [trackSearchId, setTrackSearchId] = useState('');

  // Transactional Email Receipt Modal & Notification Sub-tab
  const [notificationSubTab, setNotificationSubTab] = useState<'alerts' | 'emails'>('alerts');
  const [viewingEmailReceipt, setViewingEmailReceipt] = useState<TransactionalEmailLog | null>(null);

  // Cancellation modal state
  const [cancelModalOrderId, setCancelModalOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Changed mind');

  // Return modal state
  const [returnModalOrderId, setReturnModalOrderId] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState<string>('Need a different size');

  const selectedOrder = activeTrackingOrder || orders[0];

  // Customer Order Filter & Search State
  const [orderHistoryFilter, setOrderHistoryFilter] = useState<
    'all' | 'in_transit' | 'delivered' | 'cancelled' | 'pending' | 'return_requested'
  >('all');
  const [orderHistorySearch, setOrderHistorySearch] = useState('');

  // Order category counts
  const orderCounts = useMemo(() => {
    return {
      all: orders.length,
      inTransit: orders.filter(
        (o) => o.shippingStatus === 'Shipped' || o.shippingStatus === 'Out for Delivery'
      ).length,
      delivered: orders.filter((o) => o.shippingStatus === 'Delivered').length,
      pending: orders.filter((o) =>
        ['Order Placed', 'Confirmed', 'Processing', 'Packed'].includes(o.shippingStatus)
      ).length,
      cancelled: orders.filter((o) => o.shippingStatus === 'Cancelled').length,
      returnRequested: orders.filter((o) => o.shippingStatus === 'Return Requested').length,
    };
  }, [orders]);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filtering
      if (orderHistoryFilter === 'in_transit') {
        if (order.shippingStatus !== 'Shipped' && order.shippingStatus !== 'Out for Delivery') return false;
      } else if (orderHistoryFilter === 'delivered') {
        if (order.shippingStatus !== 'Delivered') return false;
      } else if (orderHistoryFilter === 'pending') {
        if (!['Order Placed', 'Confirmed', 'Processing', 'Packed'].includes(order.shippingStatus)) return false;
      } else if (orderHistoryFilter === 'cancelled') {
        if (order.shippingStatus !== 'Cancelled') return false;
      } else if (orderHistoryFilter === 'return_requested') {
        if (order.shippingStatus !== 'Return Requested') return false;
      }

      // Text search filtering (Order ID, Courier, AWB, product name)
      if (orderHistorySearch.trim()) {
        const q = orderHistorySearch.trim().toLowerCase();
        const matchesNumber = order.orderNumber.toLowerCase().includes(q);
        const matchesCourier = (order.courier || '').toLowerCase().includes(q);
        const matchesAwb = (order.trackingNumber || '').toLowerCase().includes(q);
        const matchesItem = order.items.some((it) => it.product.name.toLowerCase().includes(q));
        if (!matchesNumber && !matchesCourier && !matchesAwb && !matchesItem) {
          return false;
        }
      }

      return true;
    });
  }, [orders, orderHistoryFilter, orderHistorySearch]);

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = trackSearchId.trim().toUpperCase();
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase().includes(query) ||
        o.trackingNumber.toUpperCase().includes(query)
    );
    if (found) {
      setActiveTrackingOrder(found);
      setActiveTab('tracking');
      showToast(`Found tracking details for ${found.orderNumber}`);
    } else {
      showToast(`No shipment found matching "${trackSearchId}"`, 'error');
    }
  };

  const stepsOrder: Order['shippingStatus'][] = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const currentStepIdx = selectedOrder ? stepsOrder.indexOf(selectedOrder.shippingStatus) : 0;

  const handleConfirmCancel = () => {
    if (cancelModalOrderId) {
      cancelOrder(cancelModalOrderId, cancelReason);
      setCancelModalOrderId(null);
    }
  };

  const handleConfirmReturn = () => {
    if (returnModalOrderId) {
      requestReturn(returnModalOrderId, returnReason);
      setReturnModalOrderId(null);
    }
  };

  return (
    <div className="w-full bg-[#fdfcfb] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-widest">
              FOAXX PRIVILEGE
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-medium text-stone-900">
              Welcome back, {user?.name || 'Customer'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your orders, live courier shipment tracking, tax invoices, and account settings.
            </p>
          </div>

          {/* Quick Track Order Search */}
          <form onSubmit={handleTrackSearch} className="flex gap-2 max-w-sm w-full">
            <input
              type="text"
              value={trackSearchId}
              onChange={(e) => setTrackSearchId(e.target.value)}
              placeholder="Search Order No. (e.g. FX-88391)"
              className="flex-1 bg-white border border-stone-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-stone-900"
            />
            <button
              type="submit"
              className="bg-stone-900 text-white text-xs px-3.5 py-2 rounded-md font-medium hover:bg-black transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Track</span>
            </button>
          </form>
        </div>

        {/* Persistent Delivered Order Review Reminder Alert Banner */}
        {pendingReviewItems.length > 0 && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#1C1917] via-[#262220] to-[#1C1917] text-white border border-stone-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center shrink-0 border border-[#E07A5F]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#E07A5F] flex items-center gap-1.5">
                  <span>Feedback Reminder</span>
                  <span>•</span>
                  <span>{pendingReviewItems.length} Delivered Piece{pendingReviewItems.length > 1 ? 's' : ''} Awaiting Review</span>
                </span>
                <h4 className="text-sm font-semibold text-white mt-0.5">
                  How was your recent delivery? Share photos & claim 100 FOAXX Coins!
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Your feedback with worn photos helps thousands of fellow muses make confident luxury choices.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {pendingReviewItems.slice(0, 2).map(({ order, product }) => (
                <button
                  key={product.id}
                  onClick={() => openReviewModal(product, order.id)}
                  className="bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Review {product.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Navigation Tabs (Touch-friendly Luxury Scrollable Pills) */}
        <div className="sm:hidden mt-5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-1 -mx-4 px-4">
            {/* 1. Tracking */}
            <button
              onClick={() => setActiveTab('tracking')}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeTab === 'tracking'
                  ? 'bg-stone-900 text-white font-bold ring-1 ring-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90'
              }`}
            >
              <Truck className={`w-4 h-4 shrink-0 ${activeTab === 'tracking' ? 'text-amber-400' : 'text-stone-500'}`} />
              <span>Shipment Tracking</span>
              {selectedOrder && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'tracking'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {selectedOrder.shippingStatus}
                </span>
              )}
            </button>

            {/* 2. Order History */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeTab === 'orders'
                  ? 'bg-stone-900 text-white font-bold ring-1 ring-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90'
              }`}
            >
              <Package className={`w-4 h-4 shrink-0 ${activeTab === 'orders' ? 'text-amber-400' : 'text-stone-500'}`} />
              <span>Order History</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                {orders.length}
              </span>
            </button>

            {/* 3. Profile Details */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeTab === 'profile'
                  ? 'bg-stone-900 text-white font-bold ring-1 ring-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90'
              }`}
            >
              <User className={`w-4 h-4 shrink-0 ${activeTab === 'profile' ? 'text-amber-400' : 'text-stone-500'}`} />
              <span>Profile Details</span>
            </button>

            {/* 4. FOAXX Coins */}
            <button
              onClick={() => setActiveTab('coins')}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeTab === 'coins'
                  ? 'bg-stone-900 text-amber-300 font-bold ring-1 ring-amber-400/50 shadow-sm'
                  : 'bg-white text-stone-800 hover:text-amber-800 border border-amber-200/80 bg-amber-50/20'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-500 shrink-0" />
              <span>FOAXX Coins</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === 'coins'
                    ? 'bg-amber-400 text-stone-950'
                    : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}
              >
                {coinWallet.balance.toLocaleString('en-IN')} (₹{((coinWallet.balance / 1000) * 250).toFixed(0)})
              </span>
            </button>

            {/* 5. Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`min-h-[42px] px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
                activeTab === 'notifications'
                  ? 'bg-stone-900 text-white font-bold ring-1 ring-stone-900 shadow-sm'
                  : 'bg-white text-stone-700 hover:text-stone-900 border border-stone-200/90'
              }`}
            >
              <Bell className={`w-4 h-4 shrink-0 ${activeTab === 'notifications' ? 'text-amber-400' : 'text-stone-500'}`} />
              <span>Notifications</span>
              {appNotifications.filter((n) => !n.read).length > 0 ? (
                <span className="text-[10px] bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                  {appNotifications.filter((n) => !n.read).length} New
                </span>
              ) : (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === 'notifications' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {appNotifications.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Active Section Subtitle & Quick Status Info */}
          <div className="mt-2.5 px-3 py-2 bg-stone-100/80 rounded-xl border border-stone-200/80 flex items-center justify-between text-[11px] text-stone-600">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="font-medium text-stone-500 uppercase tracking-wider text-[10px] shrink-0">Viewing:</span>
              <span className="font-bold text-stone-900 truncate">
                {activeTab === 'tracking' && `Shipment Tracking ${selectedOrder ? `(${selectedOrder.orderNumber})` : ''}`}
                {activeTab === 'orders' && `Order History (${orders.length} total orders)`}
                {activeTab === 'profile' && 'Customer Profile & Address'}
                {activeTab === 'coins' && `FOAXX Coins Balance (₹${((coinWallet.balance / 1000) * 250).toFixed(0)} Rupee Value)`}
                {activeTab === 'notifications' && `Notifications & Alerts (${appNotifications.length})`}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 font-medium shrink-0 ml-2">Swipe tabs ↔</span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:flex border-b border-stone-200 mt-6 gap-6 text-xs font-semibold overflow-x-auto no-scrollbar whitespace-nowrap">
          <button
            onClick={() => setActiveTab('tracking')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Shipment Tracking</span>
            {selectedOrder && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full ml-1">
                {selectedOrder.shippingStatus}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile Details</span>
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'coins'
                ? 'border-amber-600 text-amber-900 font-bold'
                : 'border-transparent text-amber-700/70 hover:text-amber-900'
            }`}
          >
            <Coins className="w-4 h-4 text-amber-500" />
            <span>FOAXX Coins ({coinWallet.balance.toLocaleString('en-IN')})</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-300">
              ₹{((coinWallet.balance / 1000) * 250).toFixed(0)} Value
            </span>
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'notifications'
                ? 'border-stone-900 text-stone-900 font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Notifications ({appNotifications.length})</span>
            {appNotifications.filter((n) => !n.read).length > 0 && (
              <span className="text-[10px] bg-amber-400 text-zinc-950 font-bold px-1.5 py-0.2 rounded-full">
                {appNotifications.filter((n) => !n.read).length} New
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: SHIPMENT TRACKING */}
        {activeTab === 'tracking' && selectedOrder && (
          <div className="pt-8 space-y-8">
            {/* Courier Summary Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-6 border-b border-stone-100 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Order Number</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedOrder.orderNumber}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Courier & Tracking (AWB)</span>
                  <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-stone-800">
                      {selectedOrder.courier} · <span className="text-[#E07A5F] font-mono">{selectedOrder.trackingNumber}</span>
                    </span>
                    {selectedOrder.trackingUrl && (
                      <a
                        href={selectedOrder.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-900 text-[#d4af37] hover:text-white font-bold text-[10px] transition-colors shadow-2xs"
                        title="Open real-time courier tracking website"
                      >
                        <span>Live Tracking ↗</span>
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Estimated Delivery</span>
                  {selectedOrder.isDelayed && selectedOrder.revisedEstimatedDelivery ? (
                    <div>
                      <span className="font-bold text-orange-700 block">
                        {selectedOrder.revisedEstimatedDelivery} (Revised)
                      </span>
                      <span className="text-[10px] text-stone-400 line-through">
                        Original: {selectedOrder.originalEstimatedDelivery || selectedOrder.estimatedDelivery}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-emerald-700">{selectedOrder.estimatedDelivery}</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-stone-400 block text-[11px]">Current Status</span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-sm font-semibold text-[11px] ${
                        selectedOrder.shippingStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : selectedOrder.shippingStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : selectedOrder.isDelayed
                          ? 'bg-orange-100 text-orange-900'
                          : selectedOrder.shippingStatus === 'Return Requested'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-900 text-white'
                      }`}
                    >
                      {selectedOrder.shippingStatus}
                    </span>
                  </div>

                  {/* Quick Tax Invoice button */}
                  <button
                    onClick={() => setActiveInvoiceOrder(selectedOrder)}
                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="View Tax Invoice"
                  >
                    <FileText className="w-4 h-4 text-[#E07A5F]" />
                    <span className="hidden sm:inline">Invoice</span>
                  </button>
                </div>
              </div>

              {/* Delayed Delivery Alert Notice */}
              {selectedOrder.isDelayed && selectedOrder.shippingStatus !== 'Cancelled' && (
                <div className="mt-4 p-4 bg-orange-50/90 border border-orange-200 rounded-xl text-xs text-orange-950 flex items-start gap-3 shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0 text-orange-700 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="font-bold text-orange-900 text-sm">Delivery Advisory: Temporary Transit Delay</strong>
                      <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Notice
                      </span>
                    </div>
                    <p className="text-stone-700">
                      Your FOAXX luxury package is temporarily delayed: <strong>{selectedOrder.delayReason || 'Transit delay noted at regional logistics hub.'}</strong>
                    </p>
                    {selectedOrder.revisedEstimatedDelivery && (
                      <p className="text-orange-900 font-semibold text-[11px]">
                        Revised Target Delivery Date: <strong>{selectedOrder.revisedEstimatedDelivery}</strong>
                      </p>
                    )}
                    {selectedOrder.trackingUrl && (
                      <div className="pt-1">
                        <a
                          href={selectedOrder.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 hover:text-[#d4af37] underline"
                        >
                          Check Real-Time Courier GPS Tracking ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Delivered Confirmation Box */}
              {selectedOrder.shippingStatus === 'Delivered' && (
                <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <strong className="font-bold">Delivered to Consignee Doorstep</strong>
                      <span className="block text-[11px] text-emerald-800">
                        Package delivered safely on {selectedOrder.deliveredAt || selectedOrder.date}.
                      </span>
                    </div>
                  </div>
                  {selectedOrder.trackingUrl && (
                    <a
                      href={selectedOrder.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-[10px] transition-colors self-start sm:self-auto"
                    >
                      Official Delivery Proof ↗
                    </a>
                  )}
                </div>
              )}

              {/* Visual Timeline: 7 Steps */}
              {selectedOrder.shippingStatus !== 'Cancelled' && (
                <div className="pt-8 pb-4">
                  <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-6">
                    Shipment Progress Timeline
                  </h3>
                  <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-4 left-4 right-4 h-1 bg-stone-200 hidden sm:block">
                      <div
                        className="h-full bg-stone-900 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (Math.max(0, currentStepIdx) / (stepsOrder.length - 1)) * 100)}%`,
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 relative z-10">
                      {stepsOrder.map((stepName, idx) => {
                        const isCompleted = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;

                        return (
                          <div
                            key={stepName}
                            className="flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                                isCompleted
                                  ? 'bg-stone-900 text-white shadow-xs'
                                  : 'bg-stone-100 text-stone-400 border border-stone-200'
                              } ${isCurrent ? 'ring-4 ring-stone-900/10' : ''}`}
                            >
                              {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div>
                              <span
                                className={`text-[11px] font-semibold block leading-tight ${
                                  isCompleted ? 'text-stone-900' : 'text-stone-400'
                                }`}
                              >
                                {stepName}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {selectedOrder.shippingStatus === 'Cancelled' && (
                <div className="pt-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-950 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-rose-200">
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <strong className="font-bold text-rose-900">Order Cancelled</strong>
                    </div>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Cancelled by: {selectedOrder.cancelledBy || 'Customer'}
                    </span>
                  </div>
                  <p className="text-stone-700">
                    Cancellation Reason: <strong>{selectedOrder.cancelReason || 'Cancelled upon customer request.'}</strong>
                  </p>
                  <div className="pt-1 text-[11px] text-stone-600 flex flex-wrap items-center justify-between">
                    <span>
                      Refund Status: <strong className="text-emerald-700">{selectedOrder.refundStatus || 'Refund Completed'}</strong> (₹{(selectedOrder.refundAmount || selectedOrder.total).toLocaleString('en-IN')})
                    </span>
                    <span className="font-mono text-stone-500">
                      Destination: {selectedOrder.refundMethod || selectedOrder.paymentMethod}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Activity Events & Address */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Event Log */}
              <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 p-6 shadow-xs">
                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-stone-500" />
                  <span>Real-Time Courier Activity Log</span>
                </h3>
                <div className="space-y-4 text-xs border-l-2 border-stone-200 pl-4 ml-2">
                  {selectedOrder.events.map((ev, i) => (
                    <div key={i} className="relative">
                      <div
                        className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${
                          ev.completed ? 'bg-stone-900 ring-2 ring-white' : 'bg-stone-300'
                        }`}
                      />
                      <div className="flex items-baseline justify-between">
                        <span className="font-semibold text-stone-900">{ev.title}</span>
                        <span className="text-[10px] text-stone-400">{ev.time}</span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5">{ev.location}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Consignee Information & Actions */}
              <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 shadow-xs text-xs space-y-4">
                <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
                  <span>Delivery Address</span>
                </h3>
                <div className="p-3 bg-stone-50 rounded-lg space-y-1">
                  <p className="font-semibold text-stone-900">{selectedOrder.shippingAddress.name}</p>
                  <p className="text-stone-600">{selectedOrder.shippingAddress.address}</p>
                  {selectedOrder.shippingAddress.locality && (
                    <p className="text-stone-600">{selectedOrder.shippingAddress.locality}</p>
                  )}
                  <p className="text-stone-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                    <strong className="text-stone-800">{selectedOrder.shippingAddress.pincode}</strong>
                  </p>
                  <p className="text-stone-600 pt-1">Phone: +91 {selectedOrder.shippingAddress.phone}</p>
                </div>

                {/* Gift Option Note */}
                {selectedOrder.giftOption?.enabled && (
                  <div className="p-3 bg-[#FAF7F2] border border-[#EDE5DA] rounded-lg text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#E07A5F]">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Velvet Keepsake Box & Gift Card Attached</span>
                    </div>
                    {selectedOrder.giftOption.recipientName && (
                      <p className="text-stone-700">For: {selectedOrder.giftOption.recipientName}</p>
                    )}
                    {selectedOrder.giftOption.message && (
                      <p className="text-stone-600 italic">"{selectedOrder.giftOption.message}"</p>
                    )}
                  </div>
                )}

                {/* Order Action Buttons */}
                <div className="pt-2 border-t border-stone-100 space-y-2">
                  <button
                    onClick={() => setActiveInvoiceOrder(selectedOrder)}
                    className="w-full bg-[#FAF8F5] hover:bg-[#F3EFE9] border border-stone-300 text-stone-900 text-xs font-semibold py-2 rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E07A5F]" />
                    <span>Download Tax Invoice (GST)</span>
                  </button>

                  {/* Pre-Shipped Orders: Real-Time Instant Cancellation */}
                  {(selectedOrder.shippingStatus === 'Order Placed' ||
                    selectedOrder.shippingStatus === 'Confirmed' ||
                    selectedOrder.shippingStatus === 'Processing' ||
                    selectedOrder.shippingStatus === 'Packed') && (
                    <button
                      onClick={() => setCancelModalOrderId(selectedOrder.id)}
                      className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancel Order (Instant Refund)</span>
                    </button>
                  )}

                  {/* Shipped / Out for Delivery: Cannot Cancel (In Transit) */}
                  {(selectedOrder.shippingStatus === 'Shipped' ||
                    selectedOrder.shippingStatus === 'Out for Delivery') && (
                    <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-relaxed space-y-1">
                      <p className="font-semibold flex items-center gap-1.5 text-amber-800">
                        <Truck className="w-3.5 h-3.5 text-[#E07A5F]" />
                        <span>Package Dispatched with {selectedOrder.courier}</span>
                      </p>
                      <p className="text-stone-600">
                        This piece is already in transit and cannot be cancelled. You can easily initiate a 7-day doorstep return once the package is delivered.
                      </p>
                    </div>
                  )}

                  {/* Delivered Orders: 7-Day Return / Exchange and Review Submission */}
                  {selectedOrder.shippingStatus === 'Delivered' && (
                    <div className="space-y-2.5">
                      <button
                        onClick={() => setReturnModalOrderId(selectedOrder.id)}
                        className="w-full text-stone-800 hover:bg-stone-100 border border-stone-300 text-xs font-semibold py-2 rounded-md transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                        <span>Initiate 7-Day Return / Exchange</span>
                      </button>

                      {/* Product Review Reminders & Photo Action */}
                      <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                        <span className="font-semibold text-stone-800 text-[11px] block">
                          Delivered Items Feedback (with Photos):
                        </span>
                        {selectedOrder.items.map((it) => {
                          const isReviewed =
                            reviewedItems.includes(`${selectedOrder.id}_${it.product.id}`) ||
                            reviewedItems.includes(it.product.id);
                          return (
                            <div
                              key={it.product.id}
                              className="flex items-center justify-between gap-2 p-2 bg-white rounded-md border border-stone-200 text-xs"
                            >
                              <span className="font-medium text-stone-900 truncate">
                                {it.product.name}
                              </span>
                              {isReviewed ? (
                                <span className="text-emerald-700 font-semibold text-[10px] flex items-center gap-1 shrink-0">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Reviewed</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => openReviewModal(it.product, selectedOrder.id)}
                                  className="text-[#E07A5F] hover:text-[#c96a51] font-semibold text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>Review & Photo</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cancelled State Note */}
                  {selectedOrder.shippingStatus === 'Cancelled' && (
                    <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[11px]">
                      <strong>Order Cancelled:</strong> {selectedOrder.cancelReason || 'Cancelled upon customer request'}. 100% refund initiated to source payment method.
                    </div>
                  )}

                  {/* Return Requested State Note */}
                  {selectedOrder.shippingStatus === 'Return Requested' && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
                      <strong>Return Scheduled:</strong> {selectedOrder.returnReason || 'Exchange/Return'}. Our BlueDart reverse pickup agent will arrive within 48 hours.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="pt-8 space-y-6">
            {/* Order Filter and Search Bar */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderHistorySearch}
                    onChange={(e) => setOrderHistorySearch(e.target.value)}
                    placeholder="Search by order ID, item name, courier or AWB..."
                    className="w-full pl-9 pr-8 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 bg-stone-50/50"
                  />
                  {orderHistorySearch && (
                    <button
                      onClick={() => setOrderHistorySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs p-0.5"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Showing results summary */}
                <div className="text-[11px] text-stone-500 whitespace-nowrap">
                  Showing <strong className="text-stone-900 font-semibold">{filteredOrders.length}</strong> of{' '}
                  <strong className="text-stone-900 font-semibold">{orders.length}</strong> orders
                </div>
              </div>

              {/* Filter Tabs / Pills */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-stone-100 text-xs">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider mr-1">
                  Filter:
                </span>
                <button
                  onClick={() => setOrderHistoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    orderHistoryFilter === 'all'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>All</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderHistoryFilter === 'all' ? 'bg-stone-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {orderCounts.all}
                  </span>
                </button>

                <button
                  onClick={() => setOrderHistoryFilter('in_transit')}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    orderHistoryFilter === 'in_transit'
                      ? 'bg-[#E07A5F] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>In Transit</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderHistoryFilter === 'in_transit' ? 'bg-[#c96a51] text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {orderCounts.inTransit}
                  </span>
                </button>

                <button
                  onClick={() => setOrderHistoryFilter('delivered')}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    orderHistoryFilter === 'delivered'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Delivered</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderHistoryFilter === 'delivered' ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {orderCounts.delivered}
                  </span>
                </button>

                <button
                  onClick={() => setOrderHistoryFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    orderHistoryFilter === 'pending'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Dispatch</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderHistoryFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {orderCounts.pending}
                  </span>
                </button>

                <button
                  onClick={() => setOrderHistoryFilter('cancelled')}
                  className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                    orderHistoryFilter === 'cancelled'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancelled</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${orderHistoryFilter === 'cancelled' ? 'bg-rose-800 text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {orderCounts.cancelled}
                  </span>
                </button>

                {orderCounts.returnRequested > 0 && (
                  <button
                    onClick={() => setOrderHistoryFilter('return_requested')}
                    className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 ${
                      orderHistoryFilter === 'return_requested'
                        ? 'bg-stone-800 text-white shadow-xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                    }`}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Returns</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-600">
                      {orderCounts.returnRequested}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
                <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-stone-900">No orders placed yet</h3>
                <p className="text-xs text-stone-500 mt-1">Explore our latest luxury drops.</p>
                <button
                  onClick={() => setCurrentView('shop')}
                  className="mt-4 bg-stone-900 text-white text-xs px-5 py-2.5 rounded-md hover:bg-black font-semibold uppercase tracking-wider"
                >
                  Start Shopping
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-stone-200">
                <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-stone-900">No orders match your filter criteria</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Try adjusting your filter selection or clear the search query.
                </p>
                <button
                  onClick={() => {
                    setOrderHistoryFilter('all');
                    setOrderHistorySearch('');
                  }}
                  className="mt-4 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-stone-100 gap-3">
                    <div className="flex items-center gap-4 text-xs">
                      <div>
                        <span className="text-stone-400 block text-[10px]">Order Placed</span>
                        <span className="font-bold text-stone-900">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Date</span>
                        <span className="font-medium text-stone-700">{order.date}</span>
                      </div>
                      <div>
                        <span className="text-stone-400 block text-[10px]">Total</span>
                        <span className="font-bold text-stone-900">
                          ₹{order.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                          order.shippingStatus === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : order.shippingStatus === 'Return Requested'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-800'
                        }`}
                      >
                        {order.shippingStatus}
                      </span>

                      {/* Download Invoice Button */}
                      <button
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="View GST Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#E07A5F]" />
                        <span>Invoice</span>
                      </button>

                      {/* Official Email Receipt from foaxx.studio@gmail.com */}
                      <button
                        onClick={() => {
                          const found = transactionalEmails.find(
                            (e) => (e.orderId === order.id || e.orderNumber === order.orderNumber)
                          );
                          if (found) {
                            setViewingEmailReceipt(found);
                          } else {
                            const { subject, preheader, html } = generateOrderConfirmationEmailHtml(order);
                            setViewingEmailReceipt({
                              id: `tx-view-${order.id}`,
                              eventType: 'order_confirmation',
                              recipientEmail: order.shippingAddress.email || user?.email || 'customer@gmail.com',
                              recipientName: order.shippingAddress.name || user?.name || 'Valued Muse',
                              subject,
                              preheader,
                              senderEmail: SYSTEM_SENDER_EMAIL,
                              senderName: 'FOAXX Luxury Atelier',
                              htmlContent: html,
                              sentAt: order.date,
                              status: 'Delivered',
                              orderId: order.id,
                              orderNumber: order.orderNumber,
                            });
                          }
                        }}
                        className="bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-700 px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title="View Official Email sent from foaxx.studio@gmail.com"
                      >
                        <Mail className="w-3.5 h-3.5 text-amber-600" />
                        <span>Email Receipt</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveTrackingOrder(order);
                          setActiveTab('tracking');
                        }}
                        className="bg-stone-900 hover:bg-black text-white px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="divide-y divide-stone-100">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={it.selectedColorImage || it.product.image}
                            alt={it.product.name}
                            className="w-12 h-14 object-cover rounded-md bg-stone-50 border border-stone-200/50 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{it.product.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-stone-500">
                              <span>Qty: {it.quantity}</span>
                              {it.selectedColor && (
                                <span className="inline-flex items-center gap-1 text-stone-700 font-medium">
                                  ·{' '}
                                  {it.selectedColorHex && (
                                    <span
                                      className="w-2 h-2 rounded-full border border-black/15 inline-block"
                                      style={{ backgroundColor: it.selectedColorHex }}
                                    />
                                  )}
                                  <span>{it.selectedColor}</span>
                                </span>
                              )}
                              {it.selectedSize && <span>· Size {it.selectedSize}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className="font-semibold text-stone-900">
                            ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                          </span>
                          {/* Delivered item review trigger & status */}
                          {order.shippingStatus === 'Delivered' && (
                            <div>
                              {reviewedItems.includes(`${order.id}_${it.product.id}`) ||
                              reviewedItems.includes(it.product.id) ? (
                                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Reviewed with Photo</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => openReviewModal(it.product, order.id)}
                                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-white bg-[#E07A5F] hover:bg-[#c96a51] px-2.5 py-1 rounded-md shadow-2xs transition-colors cursor-pointer"
                                >
                                  <Camera className="w-3 h-3" />
                                  <span>Review & Photo</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gift Wrap Note in Order if present */}
                  {order.giftOption?.enabled && (
                    <div className="pt-2 text-[11px] text-[#E07A5F] flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5" />
                      <span>Gift packaging & greeting card included</span>
                    </div>
                  )}

                  {/* Order Level Real-Time Actions Bar */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      {order.shippingStatus === 'Cancelled' && (
                        <div className="text-rose-700 font-medium text-[11px] flex flex-wrap items-center gap-1.5">
                          <span>Reason: {order.cancelReason || 'Cancelled upon customer request'}</span>
                          {order.cancelledBy && (
                            <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-sm text-[10px] font-bold">
                              By {order.cancelledBy}
                            </span>
                          )}
                        </div>
                      )}
                      {order.isDelayed && order.shippingStatus !== 'Cancelled' && (
                        <div className="text-orange-800 bg-orange-50 border border-orange-200 px-2 py-1 rounded-md text-[11px] flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                          <span>
                            <strong>Transit Delay:</strong> {order.delayReason}
                            {order.revisedEstimatedDelivery && ` · Revised: ${order.revisedEstimatedDelivery}`}
                          </span>
                        </div>
                      )}
                      {order.shippingStatus === 'Return Requested' && (
                        <span className="text-amber-800 font-medium text-[11px]">
                          Reason: {order.returnReason || 'Exchange/Return requested'} (Courier pickup within 48h)
                        </span>
                      )}
                      {(order.shippingStatus === 'Shipped' || order.shippingStatus === 'Out for Delivery') && (
                        <div className="text-stone-500 text-[11px] flex flex-wrap items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-[#E07A5F]" />
                            <span>Dispatched via {order.courier} (AWB: <strong className="font-mono text-stone-700">{order.trackingNumber}</strong>)</span>
                          </span>
                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#d4af37] bg-stone-900 hover:text-white px-2 py-0.5 rounded font-bold text-[10px] inline-flex items-center gap-1 shadow-2xs"
                            >
                              <span>Track Online ↗</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Pre-shipped real-time cancellation */}
                      {(order.shippingStatus === 'Order Placed' ||
                        order.shippingStatus === 'Confirmed' ||
                        order.shippingStatus === 'Processing' ||
                        order.shippingStatus === 'Packed') && (
                        <button
                          onClick={() => setCancelModalOrderId(order.id)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order</span>
                        </button>
                      )}

                      {/* Delivered: 7-day return option */}
                      {order.shippingStatus === 'Delivered' && (
                        <button
                          onClick={() => setReturnModalOrderId(order.id)}
                          className="text-stone-800 hover:bg-stone-100 border border-stone-300 text-xs font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                          <span>Return / Exchange</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: PROFILE */}
        {activeTab === 'profile' && (
          <div className="pt-8 max-w-lg space-y-5">
            {/* Google OAuth Account Card */}
            <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-stone-200 object-cover shadow-2xs"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-900 text-amber-400 font-bold flex items-center justify-center text-sm shadow-2xs">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-stone-900 text-sm block">
                      {user?.name || 'Customer'}
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      {user?.email || 'No email registered'}
                    </span>
                  </div>
                </div>

                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Verified Muse</span>
                </span>
              </div>

              {/* 1-Click Connect with Google */}
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span className="text-[11px] font-semibold text-stone-700">
                    Google OAuth Status: Active
                  </span>
                </div>

                <button
                  type="button"
                  disabled={isConnectingGoogle}
                  onClick={async () => {
                    setIsConnectingGoogle(true);
                    try {
                      const res = await googleSignIn();
                      if (res && res.user) {
                        setUser({
                          name: res.user.displayName || user?.name || 'Valued Muse',
                          email: res.user.email || user?.email || '',
                          phone: res.user.phoneNumber || user?.phone || '+91 98765 43210',
                          photoURL: res.user.photoURL || undefined,
                        });
                        showToast('Google account connected successfully!', 'success');
                      }
                    } catch (err: any) {
                      if (err?.code !== 'auth/popup-closed-by-user') {
                        showToast('Google sign-in error. Please try again.', 'error');
                      }
                    } finally {
                      setIsConnectingGoogle(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-white border border-stone-300 hover:border-stone-400 rounded-md font-semibold text-stone-800 transition shadow-2xs hover:bg-stone-50 cursor-pointer self-start sm:self-auto text-[11px]"
                >
                  {isConnectingGoogle ? 'Syncing...' : 'Switch / Reconnect Google'}
                </button>
              </div>
            </div>

            {/* Editable Profile Information Form */}
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-xs text-xs space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 pb-3 border-b border-stone-100">
                Personal Information
              </h3>
              <div>
                <label className="block text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={user?.name || ''}
                  onChange={(e) => user && setUser({ ...user, name: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2.5"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  onChange={(e) => user && setUser({ ...user, email: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2.5"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  value={user?.phone || ''}
                  onChange={(e) => user && setUser({ ...user, phone: e.target.value })}
                  className="w-full bg-stone-50 border border-stone-300 rounded-md p-2.5"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => showToast('Profile details updated')}
                  className="flex-1 bg-stone-900 text-white font-semibold py-2.5 rounded-md hover:bg-black transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    showToast('Logged out securely.', 'info');
                    setCurrentView('auth');
                  }}
                  className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-md font-semibold transition-colors cursor-pointer text-xs"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FOAXX COINS & REWARDS */}
        {activeTab === 'coins' && (
          <div className="pt-8 space-y-8 animate-fadeIn">
            {/* Hero Coin Wallet Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-950 via-[#1a1715] to-[#12100e] border border-[#d4af37]/40 p-6 sm:p-8 text-white shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold uppercase tracking-widest mb-1.5">
                    <Coins className="w-4 h-4" />
                    <span>FOAXX Privé Loyalty Vault</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight flex items-baseline gap-2">
                    <span>{coinWallet.balance.toLocaleString('en-IN')}</span>
                    <span className="text-base sm:text-lg font-sans font-normal text-[#d4af37]">
                      FOAXX Coins
                    </span>
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                    <span className="px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-bold">
                      ₹{((coinWallet.balance / 1000) * 250).toLocaleString('en-IN', { minimumFractionDigits: 2 })} Rupee Redemption Value
                    </span>
                    <span className="text-stone-400">
                      (1,000 Coins = ₹250 · 1 Coin = ₹0.25)
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#c5a059] to-[#b8860b] text-stone-950 font-bold text-xs hover:from-[#e5c048] hover:to-[#c9971c] transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Redeem in Shop →</span>
                  </button>
                </div>
              </div>

              {/* Conversion Rule Pill */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>
                    Coins are automatically redeemable at checkout in ₹250 blocks per 1,000 coins.
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#d4af37]">
                  Total Transactions: {coinWallet.transactions.length}
                </div>
              </div>
            </div>

            {/* Earning Rules Grid */}
            <div>
              <h3 className="text-base font-serif-luxury font-bold text-stone-900 mb-3">
                How to Earn More FOAXX Coins
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rule 1: 5-Star 80+ Word Review */}
                <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 font-bold text-lg">
                      ⭐
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900">
                        5-Star Detailed Review (80+ Words)
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        +100 Coins (₹25)
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Share honest, detailed feedback (at least 80 words) and a photo of your delivered FOAXX piece. Once published with a 5-star rating, 100 coins will immediately credit into your wallet.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      {pendingReviewItems.length > 0
                        ? `${pendingReviewItems.length} delivered order ready for review`
                        : 'Review when your next delivery arrives'}
                    </span>
                    {pendingReviewItems.length > 0 && (
                      <button
                        onClick={() => openReviewModal(pendingReviewItems[0].product, pendingReviewItems[0].order.id)}
                        className="text-xs font-bold text-[#E07A5F] hover:underline"
                      >
                        Write Review →
                      </button>
                    )}
                  </div>
                </div>

                {/* Rule 2: Share & Friend Buys */}
                <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 font-bold text-lg">
                      🔗
                    </div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900">
                        Share Product & Friend Purchases
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        +100 Coins (₹25)
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                      Share any product with your friends on WhatsApp or download the branded photo card to your phone gallery. When your friend orders using your link or code, you earn 100 FOAXX Coins.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-500 font-medium">
                      Unlimited referral earnings
                    </span>
                    <button
                      onClick={() => {
                        setCurrentView('shop');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs font-bold text-[#b8860b] hover:text-[#d4af37] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Go to Shop →</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* VIP Referral Link & Code Box */}
            <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800">
                    Your Exclusive Referral Hub
                  </span>
                  <h4 className="text-base font-bold text-stone-900 mt-0.5">
                    Invite Friends & Earn 100 Coins per Purchase
                  </h4>
                  <p className="text-xs text-stone-600 mt-1 max-w-xl">
                    Share your code or link with friends. They receive welcome VIP privileges, and you receive 100 FOAXX Coins (₹25 value) every time they place an order.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex items-center bg-white border border-stone-300 rounded-xl px-3 py-2 shadow-xs">
                    <span className="text-xs font-mono font-bold text-stone-800 tracking-wider">
                      {coinWallet.referralCode}
                    </span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(
                          `${window.location.origin}/?ref=${coinWallet.referralCode}`
                        );
                        setCopiedRef(true);
                        showToast('Referral link copied to clipboard!');
                        setTimeout(() => setCopiedRef(false), 2000);
                      }}
                      className="ml-3 text-stone-400 hover:text-stone-900 transition-colors p-1"
                      title="Copy Link"
                    >
                      {copiedRef ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      const waMsg = `✨ Join me on FOAXX Luxury Atelier! Use my VIP referral code *${coinWallet.referralCode}* to explore handcrafted luxury jewellery, dresses & accessories: ${window.location.origin}/?ref=${coinWallet.referralCode}`;
                      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}`, '_blank');
                    }}
                    className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>WhatsApp Share</span>
                  </button>

                  <button
                    onClick={() => {
                      earnCoins(100, `Friend Purchase via Referral (${coinWallet.referralCode})`);
                      showToast('🎉 Simulated Friend Order! 100 FOAXX Coins credited to your wallet.', 'success');
                    }}
                    className="px-3 py-2 bg-stone-900 hover:bg-black text-amber-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-colors"
                    title="Simulate friend buy for testing"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Test Referral (+100)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Passbook / Transactions Ledger */}
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 font-serif-luxury">
                    Coins Passbook & Ledger
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Complete credit and debit history of your FOAXX Coins
                  </p>
                </div>
                <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full">
                  {coinWallet.transactions.length} Records
                </span>
              </div>

              {coinWallet.transactions.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  No coin transactions yet. Earn coins by leaving 5-star reviews or sharing products!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50/80 border-b border-stone-100 text-stone-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-5 font-semibold">Date</th>
                        <th className="py-3 px-5 font-semibold">Description</th>
                        <th className="py-3 px-5 font-semibold">Type</th>
                        <th className="py-3 px-5 font-semibold text-right">Coins</th>
                        <th className="py-3 px-5 font-semibold text-right">Cash Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {coinWallet.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[11px] text-stone-500">
                            {tx.date}
                          </td>
                          <td className="py-3.5 px-5 font-medium text-stone-800">
                            {tx.description}
                          </td>
                          <td className="py-3.5 px-5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                tx.type === 'credit'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td
                            className={`py-3.5 px-5 text-right font-bold font-mono text-sm ${
                              tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {tx.type === 'credit' ? `+${tx.amount}` : `-${tx.amount}`}
                          </td>
                          <td className="py-3.5 px-5 text-right font-medium text-stone-600">
                            {tx.type === 'credit' ? '+' : '-'}₹{((tx.amount / 1000) * 250).toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: NOTIFICATIONS & BROADCAST INBOX */}
        {activeTab === 'notifications' && (
          <div className="pt-8 space-y-6">
            {/* Header Strip & Sub-navigation */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-stone-900 text-base">
                      Account Inbox & Official Communications
                    </h3>
                    {appNotifications.filter((n) => !n.read).length > 0 && (
                      <span className="bg-amber-400 text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {appNotifications.filter((n) => !n.read).length} New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Order confirmations, shipment tracking, welcome vouchers, and account security notices dispatched from <strong className="text-stone-800 font-mono">foaxx.studio@gmail.com</strong>.
                  </p>
                </div>

                {appNotifications.length > 0 && notificationSubTab === 'alerts' && (
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        appNotifications.forEach((n) => markNotificationAsRead(n.id));
                        showToast('All notifications marked as read', 'info');
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
                    >
                      Mark All as Read
                    </button>
                    <button
                      type="button"
                      onClick={clearNotifications}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-500 transition-colors cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Sub-Tabs: In-App Alerts vs Official Email Transcripts */}
              <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setNotificationSubTab('alerts')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    notificationSubTab === 'alerts'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span>In-App Alerts</span>
                  <span className="px-1.5 py-0.2 bg-white/20 text-[10px] rounded-full">
                    {appNotifications.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setNotificationSubTab('emails')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    notificationSubTab === 'emails'
                      ? 'bg-amber-400 text-zinc-950 shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <MailCheck className="w-3.5 h-3.5 text-zinc-900" />
                  <span>Official Emails ({SYSTEM_SENDER_EMAIL})</span>
                  <span className="px-1.5 py-0.2 bg-zinc-900/10 text-[10px] rounded-full font-bold">
                    {transactionalEmails.length}
                  </span>
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: IN-APP ALERTS */}
            {notificationSubTab === 'alerts' && (
              <>
                {appNotifications.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      <Bell className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">Your Inbox is Empty</h4>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      New festive offers, flash drops, and account coin credits will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        className={`bg-white rounded-2xl border p-5 transition-all shadow-xs space-y-3 cursor-pointer ${
                          !notif.read
                            ? 'border-amber-400/90 ring-1 ring-amber-400/30 bg-amber-50/20'
                            : 'border-stone-200/90 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!notif.read && (
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                            )}
                            <h4 className="font-bold text-stone-900 text-sm leading-snug">
                              {notif.title}
                            </h4>
                          </div>
                          <span className="text-[11px] text-stone-400 font-medium">
                            {notif.date}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 leading-relaxed">
                          {notif.message}
                        </p>

                        {/* Promo Code & Graphic if available */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
                          <div className="flex items-center gap-2">
                            {notif.promoCode && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-dashed border-amber-400/80">
                                <Tag className="w-3.5 h-3.5 text-amber-600" />
                                <span className="text-[10px] text-stone-500 font-medium">Code:</span>
                                <span className="font-mono font-bold text-xs text-amber-900">
                                  {notif.promoCode}
                                </span>
                              </div>
                            )}
                            <span className="text-[10px] text-stone-400">
                              From: <strong className="text-stone-600 font-mono">{notif.sender}</strong>
                            </span>
                          </div>

                          {notif.actionUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markNotificationAsRead(notif.id);
                                if (notif.actionUrl?.includes('category=')) {
                                  const cat = notif.actionUrl.split('category=')[1];
                                  setSelectedCategory(cat || 'All');
                                  setCurrentView('shop');
                                } else {
                                  setCurrentView('home');
                                }
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="bg-stone-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5 self-end sm:self-auto"
                            >
                              <span>{notif.actionLabel || 'View Offer'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SUB-VIEW 2: OFFICIAL EMAILS FROM foaxx.studio@gmail.com */}
            {notificationSubTab === 'emails' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-stone-900 to-black text-white p-4 rounded-xl border border-stone-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 flex items-center justify-center font-bold text-xs shrink-0">
                      FX
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-100">
                        Official Sender: {SYSTEM_SENDER_EMAIL}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        FOAXX Luxury Atelier signature obsidian & gold templates delivered to your inbox.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
                    ✓ Verified Delivery
                  </span>
                </div>

                {transactionalEmails.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 space-y-2">
                    <Mail className="w-8 h-8 mx-auto text-stone-300" />
                    <h4 className="font-bold text-stone-900 text-sm">No Emails Dispatched Yet</h4>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      Emails triggered by account registration, password resets, and order placed/dispatched will show here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactionalEmails.map((item) => {
                      const gmailUrl = createGmailComposeUrl({
                        to: item.recipientEmail,
                        subject: item.subject,
                        body: item.preheader,
                      });
                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-xl border border-stone-200/90 p-4 hover:border-amber-400/80 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-amber-300">
                                {item.eventType.replace(/_/g, ' ')}
                              </span>
                              {item.orderNumber && (
                                <span className="font-mono font-bold text-[11px] text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                                  {item.orderNumber}
                                </span>
                              )}
                              <span className="text-[11px] text-stone-400">• {item.sentAt}</span>
                            </div>

                            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">
                              {item.subject}
                            </h4>
                            <p className="text-xs text-stone-500 line-clamp-1">
                              {item.preheader}
                            </p>
                            <div className="text-[11px] text-stone-400 font-mono">
                              From: <strong className="text-stone-600">{item.senderEmail}</strong> ({item.senderName})
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => setViewingEmailReceipt(item)}
                              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>View Luxury Email</span>
                            </button>

                            <a
                              href={gmailUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer inline-flex items-center"
                              title="Open in Gmail"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {cancelModalOrderId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setCancelModalOrderId(null)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div
              className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-xs z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-stone-900 mb-1">Cancel Order?</h3>
              <p className="text-stone-500 mb-4">
                Please let us know the reason for cancellation:
              </p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-md p-2.5 mb-4 text-stone-800"
              >
                <option value="Changed mind">Changed mind</option>
                <option value="Ordered wrong color or size">Ordered wrong color or size</option>
                <option value="Delivery time too long">Delivery time too long</option>
                <option value="Found alternative piece">Found alternative piece</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrderId(null)}
                  className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-semibold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Confirmation Modal */}
      {returnModalOrderId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setReturnModalOrderId(null)}
          />
          <div className="min-h-full flex items-center justify-center p-4">
            <div
              className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-xs z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-semibold text-stone-900 mb-1">
                Initiate Doorstep Return / Exchange
              </h3>
              <p className="text-stone-500 mb-4">
                Our BlueDart courier will collect the package from your doorstep within 48 hours.
              </p>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-md p-2.5 mb-4 text-stone-800"
              >
                <option value="Need a different size">Need a different size</option>
                <option value="Color shade differs slightly from screen">
                  Color shade differs slightly from screen
                </option>
                <option value="Style did not suit me">Style did not suit me</option>
                <option value="Exchange for another item">Exchange for another item</option>
              </select>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOrderId(null)}
                  className="px-4 py-2 border border-stone-300 rounded-md text-stone-700 hover:bg-stone-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white rounded-md font-semibold"
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Official Transactional Email Modal Preview */}
      {viewingEmailReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-zinc-950 text-stone-100 rounded-2xl shadow-2xl border border-stone-800 overflow-hidden my-4 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-zinc-900 to-black border-b border-stone-800 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-zinc-950">
                    Official Communication
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    From: <strong className="text-amber-300 font-bold">{viewingEmailReceipt.senderEmail}</strong> ({viewingEmailReceipt.senderName})
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate max-w-md sm:max-w-xl">
                  {viewingEmailReceipt.subject}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                  <span>To: {viewingEmailReceipt.recipientName} ({viewingEmailReceipt.recipientEmail})</span>
                  <span>•</span>
                  <span>Sent: {viewingEmailReceipt.sentAt}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={createGmailComposeUrl({
                    to: viewingEmailReceipt.recipientEmail,
                    subject: viewingEmailReceipt.subject,
                    body: viewingEmailReceipt.preheader,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs items-center gap-1.5 transition-all shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail</span>
                </a>
                <button
                  type="button"
                  onClick={() => setViewingEmailReceipt(null)}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Rendered Email Preview Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0a09]">
              <div className="max-w-[600px] mx-auto rounded-xl overflow-hidden shadow-2xl border border-stone-800 bg-[#12100E]">
                <iframe
                  title="Official FOAXX Email Receipt"
                  srcDoc={viewingEmailReceipt.htmlContent}
                  className="w-full h-[620px] border-0 rounded-xl bg-[#12100E]"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
