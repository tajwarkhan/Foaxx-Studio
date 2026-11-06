import React, { useState, useMemo } from 'react';
import {
  Truck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Edit3,
  Clock,
  MapPin,
  Package,
  ShieldCheck,
  Search,
  Filter,
  Info,
  Phone,
  Calendar,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  Check,
  ArrowRight,
  Printer,
  Download,
  QrCode,
  Tag,
  Sliders,
  ShieldAlert,
  Copy,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { DeliveryBoxLabelStudio } from './DeliveryBoxLabelStudio';

interface LogisticsHubProps {
  initialFilter?: 'all' | 'delayed' | 'delivered' | 'cancelled' | 'in_transit' | 'pending' | 'box_label';
}

const COURIER_PRESETS: { name: string; urlTemplate: string }[] = [
  { name: 'BlueDart Air Express', urlTemplate: 'https://www.bluedart.com/tracking?awb=' },
  { name: 'Delhivery Surface', urlTemplate: 'https://www.delhivery.com/track/package/' },
  { name: 'DTDC Air Express', urlTemplate: 'https://www.dtdc.in/tracking/tracking_results.asp?trkid=' },
  { name: 'FedEx Priority', urlTemplate: 'https://www.fedex.com/fedextrack/?trknbr=' },
  { name: 'Shadowfax Express', urlTemplate: 'https://tracker.shadowfax.in/#/track/' },
  { name: 'Custom Carrier', urlTemplate: '' },
];

const DELAY_REASONS = [
  'Adverse weather & regional transit restrictions',
  'Air cargo terminal flight clearance backlog',
  'Customer delivery address verification / phone unreachable',
  'Artisan handcrafting & gold quality re-inspection',
  'Festive peak rush & logistics capacity bottleneck',
  'Customs & border transit checkpoint check',
  'Other custom operational delay',
];

const CANCEL_REASONS = [
  'Customer ordered duplicate/wrong size by mistake',
  'Customer changed mind before dispatch',
  'Requested immediate delivery address change',
  'Customer requested cancellation via WhatsApp / phone',
  'Product failed pre-dispatch hallmark & quality inspection',
  'Delivery pincode temporarily unserviceable',
  'Suspected fraudulent or unverified payment attempt',
];

export const LogisticsHub: React.FC<LogisticsHubProps> = ({ initialFilter = 'all' }) => {
  const {
    orders,
    updateOrderCourier,
    markOrderDelayed,
    cancelOrderWithDetails,
    markOrderDelivered,
    showToast,
  } = useStore();

  // Active status filter tab
  const [activeTab, setActiveTab] = useState<
    'all' | 'in_transit' | 'pending' | 'delivered' | 'delayed' | 'cancelled' | 'box_label'
  >(initialFilter);

  // Search & secondary courier filter
  const [searchQuery, setSearchQuery] = useState('');
  const [courierFilter, setCourierFilter] = useState('All');

  // Modals state
  const [editingCourierOrder, setEditingCourierOrder] = useState<Order | null>(null);
  const [delayModalOrder, setDelayModalOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [deliverModalOrder, setDeliverModalOrder] = useState<Order | null>(null);
  const [boxLabelModalOrder, setBoxLabelModalOrder] = useState<Order | null>(null);

  // Form states for Courier Modal
  const [courierForm, setCourierForm] = useState({
    courier: 'BlueDart Air Express',
    trackingNumber: '',
    trackingUrl: '',
    estimatedDelivery: '',
    shippingStatus: 'Shipped' as Order['shippingStatus'],
    dispatchedAt: '',
    logisticsNotes: '',
  });

  // Form states for Delay Modal
  const [delayForm, setDelayForm] = useState({
    isDelayed: true,
    delayReason: DELAY_REASONS[0],
    customDelayReason: '',
    revisedEstimatedDelivery: '',
    logisticsNotes: '',
    notifyCustomer: true,
  });

  // Form states for Cancel Modal
  const [cancelForm, setCancelForm] = useState<{
    cancelledBy: 'Customer' | 'Admin' | 'Manager' | 'System';
    reasonPreset: string;
    customReason: string;
    refundStatus: 'Pending' | 'Refund Initiated' | 'Refund Completed' | 'Not Applicable';
    refundAmount: number;
    refundMethod: string;
    notifyCustomer: boolean;
  }>({
    cancelledBy: 'Admin',
    reasonPreset: CANCEL_REASONS[0],
    customReason: '',
    refundStatus: 'Refund Initiated',
    refundAmount: 0,
    refundMethod: 'Original Payment Method',
    notifyCustomer: true,
  });

  // Delivered Form state
  const [deliverForm, setDeliverForm] = useState({
    deliveredAt: '',
    deliveryNotes: '',
    notifyCustomer: true,
  });

  // Metrics computation
  const metrics = useMemo(() => {
    const total = orders.length;
    const delivered = orders.filter((o) => o.shippingStatus === 'Delivered').length;
    const delayed = orders.filter((o) => o.isDelayed && o.shippingStatus !== 'Cancelled').length;
    const cancelled = orders.filter((o) => o.shippingStatus === 'Cancelled').length;
    const inTransit = orders.filter(
      (o) => o.shippingStatus === 'Shipped' || o.shippingStatus === 'Out for Delivery'
    ).length;
    const pending = orders.filter(
      (o) =>
        o.shippingStatus === 'Order Placed' ||
        o.shippingStatus === 'Confirmed' ||
        o.shippingStatus === 'Processing' ||
        o.shippingStatus === 'Packed'
    ).length;

    const totalCancelledRefund = orders
      .filter((o) => o.shippingStatus === 'Cancelled')
      .reduce((sum, o) => sum + (o.refundAmount || o.total), 0);

    return {
      total,
      delivered,
      delayed,
      cancelled,
      inTransit,
      pending,
      totalCancelledRefund,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Tab filter
      if (activeTab === 'in_transit') {
        if (o.shippingStatus !== 'Shipped' && o.shippingStatus !== 'Out for Delivery') return false;
      } else if (activeTab === 'pending') {
        if (
          o.shippingStatus !== 'Order Placed' &&
          o.shippingStatus !== 'Confirmed' &&
          o.shippingStatus !== 'Processing' &&
          o.shippingStatus !== 'Packed'
        )
          return false;
      } else if (activeTab === 'delivered') {
        if (o.shippingStatus !== 'Delivered') return false;
      } else if (activeTab === 'delayed') {
        if (!o.isDelayed || o.shippingStatus === 'Cancelled') return false;
      } else if (activeTab === 'cancelled') {
        if (o.shippingStatus !== 'Cancelled') return false;
      }

      // Courier filter
      if (courierFilter !== 'All') {
        if (!o.courier.toLowerCase().includes(courierFilter.toLowerCase())) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesOrderNum = o.orderNumber.toLowerCase().includes(q);
        const matchesCustomer = o.shippingAddress.name.toLowerCase().includes(q);
        const matchesPhone = o.shippingAddress.phone.includes(q);
        const matchesCity = o.shippingAddress.city.toLowerCase().includes(q);
        const matchesCourier = o.courier.toLowerCase().includes(q);
        const matchesAWB = o.trackingNumber.toLowerCase().includes(q);
        const matchesCancelReason = o.cancelReason ? o.cancelReason.toLowerCase().includes(q) : false;
        const matchesDelayReason = o.delayReason ? o.delayReason.toLowerCase().includes(q) : false;

        if (
          !matchesOrderNum &&
          !matchesCustomer &&
          !matchesPhone &&
          !matchesCity &&
          !matchesCourier &&
          !matchesAWB &&
          !matchesCancelReason &&
          !matchesDelayReason
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, courierFilter, searchQuery]);

  // Open Courier Modal
  const openCourierModal = (order: Order) => {
    setEditingCourierOrder(order);
    setCourierForm({
      courier: order.courier || 'BlueDart Air Express',
      trackingNumber: order.trackingNumber || '',
      trackingUrl: order.trackingUrl || '',
      estimatedDelivery: order.estimatedDelivery || '',
      shippingStatus:
        order.shippingStatus === 'Cancelled' || order.shippingStatus === 'Delivered'
          ? order.shippingStatus
          : 'Shipped',
      dispatchedAt: order.dispatchedAt || new Date().toLocaleDateString('en-GB'),
      logisticsNotes: order.logisticsNotes || '',
    });
  };

  // Open Delay Modal
  const openDelayModal = (order: Order) => {
    setDelayModalOrder(order);
    setDelayForm({
      isDelayed: order.isDelayed ?? true,
      delayReason: order.delayReason || DELAY_REASONS[0],
      customDelayReason: '',
      revisedEstimatedDelivery: order.revisedEstimatedDelivery || '',
      logisticsNotes: order.logisticsNotes || '',
      notifyCustomer: true,
    });
  };

  // Open Cancel Modal
  const openCancelModal = (order: Order) => {
    setCancelModalOrder(order);
    setCancelForm({
      cancelledBy: order.cancelledBy || 'Admin',
      reasonPreset: order.cancelReason || CANCEL_REASONS[0],
      customReason: '',
      refundStatus: order.refundStatus || 'Refund Initiated',
      refundAmount: order.refundAmount || order.total,
      refundMethod: order.refundMethod || `Original ${order.paymentMethod}`,
      notifyCustomer: true,
    });
  };

  // Open Delivered Modal
  const openDeliverModal = (order: Order) => {
    setDeliverModalOrder(order);
    setDeliverForm({
      deliveredAt:
        order.deliveredAt ||
        new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
      deliveryNotes: 'Doorstep signed & delivered safely to consignee.',
      notifyCustomer: true,
    });
  };

  // Submit Courier Form
  const handleSaveCourier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourierOrder) return;

    let finalUrl = courierForm.trackingUrl.trim();
    if (!finalUrl && courierForm.trackingNumber) {
      const match = COURIER_PRESETS.find((p) =>
        courierForm.courier.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
      );
      if (match && match.urlTemplate) {
        finalUrl = `${match.urlTemplate}${courierForm.trackingNumber.trim()}`;
      }
    }

    updateOrderCourier(editingCourierOrder.id, {
      courier: courierForm.courier,
      trackingNumber: courierForm.trackingNumber,
      trackingUrl: finalUrl,
      estimatedDelivery: courierForm.estimatedDelivery,
      shippingStatus: courierForm.shippingStatus,
      dispatchedAt: courierForm.dispatchedAt,
      logisticsNotes: courierForm.logisticsNotes,
    });

    setEditingCourierOrder(null);
  };

  // Submit Delay Form
  const handleSaveDelay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delayModalOrder) return;

    const finalReason =
      delayForm.delayReason === 'Other custom operational delay' && delayForm.customDelayReason.trim()
        ? delayForm.customDelayReason.trim()
        : delayForm.delayReason;

    markOrderDelayed(delayModalOrder.id, {
      isDelayed: delayForm.isDelayed,
      delayReason: finalReason,
      revisedEstimatedDelivery: delayForm.revisedEstimatedDelivery,
      logisticsNotes: delayForm.logisticsNotes,
      notifyCustomer: delayForm.notifyCustomer,
    });

    setDelayModalOrder(null);
  };

  // Submit Cancel Form
  const handleSaveCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    const finalReason =
      cancelForm.reasonPreset === 'Other custom operational delay' || cancelForm.customReason.trim()
        ? cancelForm.customReason.trim() || cancelForm.reasonPreset
        : cancelForm.reasonPreset;

    cancelOrderWithDetails(cancelModalOrder.id, {
      cancelledBy: cancelForm.cancelledBy,
      cancelReason: finalReason,
      refundStatus: cancelForm.refundStatus,
      refundAmount: Number(cancelForm.refundAmount) || cancelModalOrder.total,
      refundMethod: cancelForm.refundMethod,
      notifyCustomer: cancelForm.notifyCustomer,
    });

    setCancelModalOrder(null);
  };

  // Submit Deliver Form
  const handleSaveDeliver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverModalOrder) return;

    markOrderDelivered(deliverModalOrder.id, {
      deliveredAt: deliverForm.deliveredAt,
      deliveryNotes: deliverForm.deliveryNotes,
      notifyCustomer: deliverForm.notifyCustomer,
    });

    setDeliverModalOrder(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-6 sm:p-7 border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#b8860b]/20 border border-[#b8860b]/40 text-[#d4af37] flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">
                Logistics & Dispatch Operations Hub
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif-luxury font-bold text-white mt-1">
              Orders, Courier Tracking & Logistics Control
            </h2>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Manage live courier dispatch partners, enter live tracking URLs (AWB links) visible to customers on their order tracking page, monitor doorstep deliveries, record cancellation causes, and handle delivery delays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-stone-300">
              Total Shipments: <strong className="text-white">{orders.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-stone-900 text-white border-stone-900 shadow-md'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
            Total Orders
          </span>
          <span className="text-2xl font-bold mt-1 block">{metrics.total}</span>
          <span className="text-[10px] opacity-70 mt-0.5 block">Storewide Lifetime</span>
        </div>

        <div
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
            Pending Dispatch
          </span>
          <span className="text-2xl font-bold mt-1 block text-amber-700">{metrics.pending}</span>
          <span className="text-[10px] opacity-70 mt-0.5 block">Processing / Packed</span>
        </div>

        <div
          onClick={() => setActiveTab('in_transit')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'in_transit'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
            In Transit / Shipped
          </span>
          <span className="text-2xl font-bold mt-1 block text-blue-700">{metrics.inTransit}</span>
          <span className="text-[10px] opacity-70 mt-0.5 block">With Courier Partners</span>
        </div>

        <div
          onClick={() => setActiveTab('delivered')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'delivered'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
            Delivered
          </span>
          <span className="text-2xl font-bold mt-1 block text-emerald-700">{metrics.delivered}</span>
          <span className="text-[10px] opacity-70 mt-0.5 block">Doorstep Completed</span>
        </div>

        <div
          onClick={() => setActiveTab('delayed')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'delayed'
              ? 'bg-orange-600 text-white border-orange-600 shadow-md'
              : metrics.delayed > 0
              ? 'bg-orange-50/80 border-orange-300 text-orange-950 hover:bg-orange-100'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
              Delayed
            </span>
            {metrics.delayed > 0 && (
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            )}
          </div>
          <span className="text-2xl font-bold mt-1 block text-orange-700">{metrics.delayed}</span>
          <span className="text-[10px] opacity-70 mt-0.5 block">Needs Attention</span>
        </div>

        <div
          onClick={() => setActiveTab('cancelled')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            activeTab === 'cancelled'
              ? 'bg-rose-700 text-white border-rose-700 shadow-md'
              : 'bg-white text-stone-900 border-stone-200 hover:border-stone-300'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 block">
            Cancelled
          </span>
          <span className="text-2xl font-bold mt-1 block text-rose-700">{metrics.cancelled}</span>
          <span className="text-[10px] opacity-70 mt-0.5 block">
            ₹{metrics.totalCancelledRefund.toLocaleString('en-IN')} Refunded
          </span>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-stone-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>All Orders ({metrics.total})</span>
          </button>

          <button
            onClick={() => setActiveTab('in_transit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'in_transit'
                ? 'bg-blue-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>In Transit ({metrics.inTransit})</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Dispatch ({metrics.pending})</span>
          </button>

          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'delivered'
                ? 'bg-emerald-700 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Delivered Products ({metrics.delivered})</span>
          </button>

          <button
            onClick={() => setActiveTab('delayed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'delayed'
                ? 'bg-orange-600 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
            <span>Delayed Shipments ({metrics.delayed})</span>
            {metrics.delayed > 0 && (
              <span className="bg-orange-100 text-orange-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                Alert
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'cancelled'
                ? 'bg-rose-700 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancelled Orders ({metrics.cancelled})</span>
          </button>

          <button
            onClick={() => setActiveTab('box_label')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 border ${
              activeTab === 'box_label'
                ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                : 'text-stone-800 bg-amber-50/80 hover:bg-amber-100/80 border-amber-300/80 font-bold'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Box Label Generator & PDF</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-bold">
              4x6"
            </span>
          </button>
        </div>

        {/* Search & Courier Selection */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Order #, Customer, Phone, City, AWB, or Courier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-900 bg-stone-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-stone-500 whitespace-nowrap font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Courier:
            </span>
            <select
              value={courierFilter}
              onChange={(e) => setCourierFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-stone-900 font-semibold text-stone-800 cursor-pointer"
            >
              <option value="All">All Logistics Partners</option>
              <option value="BlueDart">BlueDart Express</option>
              <option value="Delhivery">Delhivery</option>
              <option value="DTDC">DTDC Air</option>
              <option value="FedEx">FedEx</option>
              <option value="Shadowfax">Shadowfax</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Content: Box Label Studio or Orders List */}
      {activeTab === 'box_label' ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
          <DeliveryBoxLabelStudio orders={orders} />
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-xs">
            <Truck className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-stone-800">No shipments match your criteria</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or switching tabs to view other order lifecycle statuses.
            </p>
            {(searchQuery || courierFilter !== 'All' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCourierFilter('All');
                  setActiveTab('all');
                }}
                className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isCancelled = order.shippingStatus === 'Cancelled';
            const isDelivered = order.shippingStatus === 'Delivered';
            const isDelayed = order.isDelayed && !isCancelled;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs space-y-4 ${
                  isDelayed
                    ? 'border-orange-300 ring-2 ring-orange-100'
                    : isCancelled
                    ? 'border-rose-200 bg-rose-50/20'
                    : isDelivered
                    ? 'border-emerald-200'
                    : 'border-stone-200'
                }`}
              >
                {/* Order Top Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-stone-900 text-base font-mono">
                      {order.orderNumber}
                    </span>
                    <span className="text-stone-400 text-xs">· Placed on {order.date}</span>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isDelivered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : isDelayed
                          ? 'bg-orange-100 text-orange-900 border border-orange-200'
                          : order.shippingStatus === 'Shipped' || order.shippingStatus === 'Out for Delivery'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {isDelivered && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isCancelled && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      {isDelayed && <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />}
                      <span>{order.shippingStatus}</span>
                    </span>

                    {/* Delay Badge if applicable */}
                    {isDelayed && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-500 text-white inline-flex items-center gap-1 shadow-xs animate-pulse">
                        ⚠️ Delayed in Transit
                      </span>
                    )}
                  </div>

                  {/* Customer details & Total */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">
                        Order Total
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        ₹{order.total.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right pl-3 border-l border-stone-200">
                      <span className="text-[10px] text-stone-400 block uppercase font-medium">
                        Payment
                      </span>
                      <span className="font-semibold text-stone-800">
                        {order.paymentMethod} ({order.paymentStatus})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Main Logistics Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  {/* Column 1: Customer Delivery Address */}
                  <div className="md:col-span-4 bg-stone-50/80 p-3.5 rounded-xl border border-stone-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E07A5F]" />
                      Consignee & Destination
                    </span>
                    <p className="font-bold text-stone-900 text-sm">
                      {order.shippingAddress.name}
                    </p>
                    <p className="text-stone-600 leading-snug">
                      {order.shippingAddress.address}
                      {order.shippingAddress.locality ? `, ${order.shippingAddress.locality}` : ''}
                    </p>
                    <p className="font-semibold text-stone-800">
                      {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                      <span className="font-mono text-[#b8860b]">
                        {order.shippingAddress.pincode}
                      </span>
                    </p>
                    <p className="text-stone-600 pt-0.5 flex items-center gap-1 font-mono">
                      <Phone className="w-3 h-3 text-stone-400" />
                      +91 {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Column 2: Courier Details & Tracking */}
                  <div className="md:col-span-5 bg-stone-50/80 p-3.5 rounded-xl border border-stone-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#b8860b]" />
                        Courier & Live Tracking
                      </span>
                      {order.dispatchedAt && (
                        <span className="text-[10px] text-stone-500 font-mono">
                          Dispatched: {order.dispatchedAt}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Partner:</span>
                        <strong className="text-stone-900">{order.courier || 'Not Assigned'}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">AWB / Tracking ID:</span>
                        <strong className="font-mono text-[#E07A5F]">
                          {order.trackingNumber || 'Pending'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Estimated Delivery:</span>
                        <strong
                          className={isDelayed ? 'text-orange-700 line-through mr-1' : 'text-emerald-700'}
                        >
                          {order.originalEstimatedDelivery || order.estimatedDelivery || 'Pending'}
                        </strong>
                      </div>
                      {isDelayed && order.revisedEstimatedDelivery && (
                        <div className="flex items-center justify-between bg-orange-100/70 p-1.5 rounded-md border border-orange-200">
                          <span className="text-orange-900 font-semibold">Revised Delivery:</span>
                          <strong className="text-orange-950 font-bold">
                            {order.revisedEstimatedDelivery}
                          </strong>
                        </div>
                      )}
                    </div>

                    {/* Live Tracking Link */}
                    {order.trackingUrl ? (
                      <div className="pt-1 flex items-center justify-between">
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-[11px] transition-colors shadow-xs"
                        >
                          <LinkIcon className="w-3 h-3 text-[#d4af37]" />
                          <span>Track with Courier Portal ↗</span>
                        </a>
                        <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Live Link Visible to User
                        </span>
                      </div>
                    ) : (
                      <div className="pt-1 flex items-center justify-between text-[11px] text-stone-400">
                        <span>No live tracking URL added yet.</span>
                        <button
                          onClick={() => openCourierModal(order)}
                          className="text-[#E07A5F] hover:underline font-bold"
                        >
                          + Add Tracking Link
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Column 3: Items Ordered Preview */}
                  <div className="md:col-span-3 bg-stone-50/80 p-3.5 rounded-xl border border-stone-100 space-y-2">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                      <Package className="w-3 h-3 text-stone-500" />
                      Items ({order.items.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                    <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px]">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-8 h-8 rounded-md object-cover border border-stone-200 shrink-0"
                          />
                          <div className="truncate">
                            <p className="font-semibold text-stone-900 truncate">
                              {item.product.name}
                            </p>
                            <p className="text-stone-500 text-[10px]">
                              Qty: {item.quantity} · {item.selectedColor || ''}{' '}
                              {item.selectedSize ? `· Size ${item.selectedSize}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delayed Shipment Notice Box (if delayed) */}
                {isDelayed && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Active Transit Delay Alert:</strong>{' '}
                        <span>{order.delayReason || 'Transit delay noted at logistics hub.'}</span>
                        {order.revisedEstimatedDelivery && (
                          <span className="block text-[11px] text-orange-800 mt-0.5">
                            Revised estimated delivery: <strong>{order.revisedEstimatedDelivery}</strong>
                          </span>
                        )}
                        {order.logisticsNotes && (
                          <span className="block text-[10px] text-stone-500 italic mt-0.5">
                            Internal note: "{order.logisticsNotes}"
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => openDelayModal(order)}
                      className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs shrink-0 self-start sm:self-auto cursor-pointer"
                    >
                      Update Delay Details
                    </button>
                  </div>
                )}

                {/* Delivered Confirmation Box (if delivered) */}
                {isDelivered && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <strong className="font-bold">Delivered to Consignee:</strong>{' '}
                        <span>Delivered safely on {order.deliveredAt || order.date}. Doorstep signature verified.</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-mono font-medium">
                      Carrier: {order.courier} · {order.trackingNumber}
                    </span>
                  </div>
                )}

                {/* Cancelled Audit Box (if cancelled) */}
                {isCancelled && (
                  <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-950 space-y-1.5">
                    <div className="flex items-center justify-between pb-1.5 border-b border-rose-200/60">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <strong className="font-bold">Cancellation Audit Record</strong>
                      </div>
                      <span className="font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full text-[10px]">
                        Cancelled by: {order.cancelledBy || 'Customer'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div>
                        <span className="text-stone-500 block text-[10px]">Cancellation Reason:</span>
                        <strong className="text-rose-900">
                          {order.cancelReason || 'Customer requested before dispatch'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Cancelled Timestamp:</span>
                        <span className="text-stone-800 font-mono">{order.cancelledAt || order.date}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[10px]">Refund Processing:</span>
                        <strong className="text-emerald-700">
                          {order.refundStatus || 'Refund Completed'} (₹
                          {(order.refundAmount || order.total).toLocaleString('en-IN')})
                        </strong>
                        <span className="block text-[10px] text-stone-500">
                          {order.refundMethod || order.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-100 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Edit Courier Details */}
                    <button
                      onClick={() => openCourierModal(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{order.trackingNumber ? 'Edit Courier & Tracking' : 'Assign Courier Details'}</span>
                    </button>

                    {/* Delivery Box Label Generator Button */}
                    <button
                      onClick={() => setBoxLabelModalOrder(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                      title="Generate and customize 4x6 delivery box shipping label & printable manifest"
                    >
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Box Label</span>
                    </button>

                    {/* Mark as Delivered */}
                    {!isDelivered && !isCancelled && (
                      <button
                        onClick={() => openDeliverModal(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Delivered</span>
                      </button>
                    )}

                    {/* Manage Delay */}
                    {!isDelivered && !isCancelled && (
                      <button
                        onClick={() => openDelayModal(order)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                          isDelayed
                            ? 'bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                        <span>{isDelayed ? 'Manage / Clear Delay' : 'Flag Delay'}</span>
                      </button>
                    )}

                    {/* Cancel Order */}
                    {!isCancelled && !isDelivered && (
                      <button
                        onClick={() => openCancelModal(order)}
                        className="px-3 py-1.5 rounded-xl text-rose-700 hover:bg-rose-50 border border-rose-200 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>

                  {/* Direct Tracking Portal Quick Link */}
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E07A5F] hover:underline font-bold flex items-center gap-1 text-[11px]"
                    >
                      <span>Public Tracking Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: EDIT COURIER DETAILS & LIVE TRACKING LINK        */}
      {/* ========================================================= */}
      {editingCourierOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-[#b8860b]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Courier Dispatch & Live Tracking Link
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Order #{editingCourierOrder.orderNumber} · Deliver to{' '}
                    <strong>{editingCourierOrder.shippingAddress.name}</strong> (
                    {editingCourierOrder.shippingAddress.city})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingCourierOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCourier} className="space-y-4 text-xs">
              {/* Courier Partner Selection */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Courier Partner *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {COURIER_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => {
                        setCourierForm((prev) => ({
                          ...prev,
                          courier: preset.name,
                          trackingUrl:
                            preset.urlTemplate && prev.trackingNumber
                              ? `${preset.urlTemplate}${prev.trackingNumber}`
                              : prev.trackingUrl,
                        }));
                      }}
                      className={`p-2 rounded-lg text-left border text-[11px] transition-all cursor-pointer ${
                        courierForm.courier === preset.name
                          ? 'border-stone-900 bg-stone-900 text-white font-bold'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  placeholder="Or enter custom carrier name"
                  value={courierForm.courier}
                  onChange={(e) => setCourierForm({ ...courierForm, courier: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>

              {/* Tracking ID (AWB) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Airway Bill / Tracking ID (AWB) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BLRD-928471IN"
                    value={courierForm.trackingNumber}
                    onChange={(e) => {
                      const val = e.target.value;
                      const preset = COURIER_PRESETS.find((p) =>
                        courierForm.courier.toLowerCase().includes(p.name.toLowerCase().split(' ')[0])
                      );
                      const suggestedUrl =
                        preset && preset.urlTemplate ? `${preset.urlTemplate}${val}` : courierForm.trackingUrl;
                      setCourierForm({
                        ...courierForm,
                        trackingNumber: val,
                        trackingUrl: suggestedUrl,
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shipment Lifecycle Status
                  </label>
                  <select
                    value={courierForm.shippingStatus}
                    onChange={(e) =>
                      setCourierForm({
                        ...courierForm,
                        shippingStatus: e.target.value as Order['shippingStatus'],
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 font-semibold"
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Live Tracking Link */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-stone-700 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>Live Tracking Portal URL (Visible to Customer) *</span>
                  </label>
                  <span className="text-[10px] text-stone-400">
                    Customer clicks this to view live GPS status
                  </span>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://www.bluedart.com/tracking?awb=..."
                  value={courierForm.trackingUrl}
                  onChange={(e) => setCourierForm({ ...courierForm, trackingUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl font-mono text-stone-800"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  This direct link is displayed on the customer's FOAXX Tracking screen with a direct button.
                </p>
              </div>

              {/* Estimated Delivery Date & Dispatched Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Estimated Delivery Date *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Nov 2026"
                    value={courierForm.estimatedDelivery}
                    onChange={(e) =>
                      setCourierForm({ ...courierForm, estimatedDelivery: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Dispatch Date / Time
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Nov 2026, 10:30 AM"
                    value={courierForm.dispatchedAt}
                    onChange={(e) =>
                      setCourierForm({ ...courierForm, dispatchedAt: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Logistics Notes */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Logistics Notes (Internal or Special Handling)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Fragile diamond jewellery box, OTP verification required on delivery."
                  value={courierForm.logisticsNotes}
                  onChange={(e) =>
                    setCourierForm({ ...courierForm, logisticsNotes: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCourierOrder(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4 text-[#d4af37]" />
                  <span>Save Courier & Tracking Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: DELAYED DELIVERY ADVISORY                        */}
      {/* ========================================================= */}
      {delayModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Logistics Delay Management
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Order #{delayModalOrder.orderNumber} · Customer:{' '}
                    <strong>{delayModalOrder.shippingAddress.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDelayModalOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDelay} className="space-y-4 text-xs">
              {/* Delay Toggle */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 block">Flag Shipment as Delayed</span>
                  <span className="text-[11px] text-stone-500 block">
                    Shows an amber advisory notice on customer's tracking screen
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={delayForm.isDelayed}
                  onChange={(e) => setDelayForm({ ...delayForm, isDelayed: e.target.checked })}
                  className="w-5 h-5 accent-orange-600 cursor-pointer"
                />
              </div>

              {delayForm.isDelayed && (
                <>
                  {/* Preset Delay Reason */}
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Reason for Delay *
                    </label>
                    <select
                      value={delayForm.delayReason}
                      onChange={(e) => setDelayForm({ ...delayForm, delayReason: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 font-semibold"
                    >
                      {DELAY_REASONS.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </select>
                  </div>

                  {delayForm.delayReason === 'Other custom operational delay' && (
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Custom Delay Reason *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Enter specific delay cause..."
                        value={delayForm.customDelayReason}
                        onChange={(e) =>
                          setDelayForm({ ...delayForm, customDelayReason: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                      />
                    </div>
                  )}

                  {/* Revised Delivery Date */}
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Revised Estimated Delivery Date *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 7 Nov 2026"
                      value={delayForm.revisedEstimatedDelivery}
                      onChange={(e) =>
                        setDelayForm({ ...delayForm, revisedEstimatedDelivery: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl font-semibold text-orange-950"
                    />
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Original ETA: {delayModalOrder.originalEstimatedDelivery || delayModalOrder.estimatedDelivery}
                    </p>
                  </div>

                  {/* Notify Customer Checkbox */}
                  <div className="flex items-center gap-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <input
                      type="checkbox"
                      id="notifyCustomerDelay"
                      checked={delayForm.notifyCustomer}
                      onChange={(e) =>
                        setDelayForm({ ...delayForm, notifyCustomer: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-600 cursor-pointer"
                    />
                    <label
                      htmlFor="notifyCustomerDelay"
                      className="text-xs text-amber-950 font-medium cursor-pointer"
                    >
                      Post real-time shipment advisory into customer's FOAXX Notifications bell
                    </label>
                  </div>
                </>
              )}

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDelayModalOrder(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>{delayForm.isDelayed ? 'Save Delay Notice' : 'Clear Delay Status'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: CANCEL ORDER WITH ATTRIBUTION & REASON           */}
      {/* ========================================================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Process Order Cancellation & Audit
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Order #{cancelModalOrder.orderNumber} · Total: ₹
                    {cancelModalOrder.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setCancelModalOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCancel} className="space-y-4 text-xs">
              {/* Who Cancelled */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Who Cancelled / Initiated Cancellation? *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Customer', 'Admin', 'Manager', 'System'] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setCancelForm({ ...cancelForm, cancelledBy: role })}
                      className={`p-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                        cancelForm.cancelledBy === role
                          ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cancellation Reason */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Cancellation Reason Preset *
                </label>
                <select
                  value={cancelForm.reasonPreset}
                  onChange={(e) => setCancelForm({ ...cancelForm, reasonPreset: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-stone-50 font-semibold"
                >
                  {CANCEL_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Additional Reason Details / Customer Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Customer called support desk stating they mistakenly selected gold finish instead of rose gold."
                  value={cancelForm.customReason}
                  onChange={(e) => setCancelForm({ ...cancelForm, customReason: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>

              {/* Refund Details */}
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                  Refund Processing
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Refund Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={cancelForm.refundAmount}
                      onChange={(e) =>
                        setCancelForm({ ...cancelForm, refundAmount: Number(e.target.value) })
                      }
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Refund Status
                    </label>
                    <select
                      value={cancelForm.refundStatus}
                      onChange={(e) =>
                        setCancelForm({
                          ...cancelForm,
                          refundStatus: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white font-semibold"
                    >
                      <option value="Refund Initiated">Refund Initiated</option>
                      <option value="Refund Completed">Refund Completed</option>
                      <option value="Pending">Pending Audit</option>
                      <option value="Not Applicable">Not Applicable (COD/Unpaid)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Refund Payout Method / Destination
                  </label>
                  <input
                    type="text"
                    value={cancelForm.refundMethod}
                    onChange={(e) =>
                      setCancelForm({ ...cancelForm, refundMethod: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Confirm Cancellation & Record Audit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: MARK AS DELIVERED                                */}
      {/* ========================================================= */}
      {deliverModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Confirm Doorstep Delivery
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Order #{deliverModalOrder.orderNumber} · Consignee:{' '}
                    <strong>{deliverModalOrder.shippingAddress.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDeliverModalOrder(null)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDeliver} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Delivery Timestamp *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4 Nov 2026, 03:30 PM"
                  value={deliverForm.deliveredAt}
                  onChange={(e) => setDeliverForm({ ...deliverForm, deliveredAt: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Delivery Note / Proof
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handed to consignee, OTP verified on delivery."
                  value={deliverForm.deliveryNotes}
                  onChange={(e) =>
                    setDeliverForm({ ...deliverForm, deliveryNotes: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <input
                  type="checkbox"
                  id="notifyCustomerDeliver"
                  checked={deliverForm.notifyCustomer}
                  onChange={(e) =>
                    setDeliverForm({ ...deliverForm, notifyCustomer: e.target.checked })
                  }
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
                <label
                  htmlFor="notifyCustomerDeliver"
                  className="text-xs text-emerald-950 font-medium cursor-pointer"
                >
                  Send "Delivered Successfully" notification to customer's account
                </label>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeliverModalOrder(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Package Delivered</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: DELIVERY BOX LABEL & PACKING SLIP STUDIO         */}
      {/* ========================================================= */}
      {boxLabelModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-stone-200">
            <DeliveryBoxLabelStudio
              orders={orders}
              selectedOrder={boxLabelModalOrder}
              onClose={() => setBoxLabelModalOrder(null)}
              isModal
            />
          </div>
        </div>
      )}
    </div>
  );
};
