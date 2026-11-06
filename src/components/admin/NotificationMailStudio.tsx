import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Send,
  Sparkles,
  Users,
  CheckCircle2,
  Copy,
  Check,
  Eye,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Tag,
  Smartphone,
  Monitor,
  Flame,
  ArrowRight,
  Filter,
  Search,
  Gift,
  Coins,
  Clock,
  ChevronRight,
  RefreshCw,
  Inbox,
  Truck,
  KeyRound,
  FileCode,
  X,
  Package,
  AlertTriangle,
  MailCheck,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  EmailTemplate,
  NotificationChannel,
  NotificationTarget,
  SubscriberUser,
  TransactionalEmailLog,
} from '../../types';
import {
  createGmailComposeUrl,
  generateFirebaseConsolePasswordResetTemplate,
  SYSTEM_SENDER_EMAIL,
  SYSTEM_SENDER_NAME,
} from '../../services/transactionalEmailService';
import { ImageUploader } from './ImageUploader';

export const NotificationMailStudio: React.FC = () => {
  const {
    appNotifications,
    emailTemplates,
    sentCampaignLogs,
    subscribers,
    sendNotificationCampaign,
    saveEmailTemplate,
    deleteEmailTemplate,
    showToast,
    transactionalEmails,
    resendTransactionalEmail,
    triggerWelcomeEmail,
    triggerPasswordResetEmail,
    triggerOrderConfirmationEmail,
    triggerShipmentStatusEmail,
    orders,
    user,
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'compose' | 'templates' | 'history' | 'audience' | 'automated'
  >('compose');

  // Automated Transactional Mails state
  const [autoEventFilter, setAutoEventFilter] = useState<string>('all');
  const [autoSearchQuery, setAutoSearchQuery] = useState<string>('');
  const [viewingEmailModal, setViewingEmailModal] = useState<TransactionalEmailLog | null>(null);
  const [modalViewMode, setModalViewMode] = useState<'rendered' | 'html'>('rendered');
  const [testRecipientEmail, setTestRecipientEmail] = useState<string>(user?.email || 'foaxx.customer@gmail.com');
  const [testRecipientName, setTestRecipientName] = useState<string>(user?.name || 'Priya Sharma');
  const [isTestTriggering, setIsTestTriggering] = useState(false);

  // Preview display mode
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile' | 'inapp'>('desktop');
  const [copiedCode, setCopiedCode] = useState(false);

  // Composer Form State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl-diwali-grand');
  const [targetAudience, setTargetAudience] = useState<NotificationTarget>('all_users');
  const [channel, setChannel] = useState<NotificationChannel>('both');
  const [subject, setSubject] = useState(
    'Diwali Grand Sale is LIVE! 🪔 Flat 40% Off on Kundan & Polki Edits'
  );
  const [preheader, setPreheader] = useState(
    'Claim your festive look before midnight. Tap to reveal your golden gift.'
  );
  const [heroHeadline, setHeroHeadline] = useState('SHINE BRIGHTER THIS DIWALI ✨');
  const [heroSubheadline, setHeroSubheadline] = useState(
    'Handcrafted Kundan, 22K Gold Plated Sets & Heritage Bridal Edits'
  );
  const [heroImage, setHeroImage] = useState('/assets/aistudio/image_8b11f93e.png');
  const [badgeText, setBadgeText] = useState('FESTIVE MEGA DROP');
  const [bodyContent, setBodyContent] = useState(
    'Celebrate auspicious beginnings with bespoke luxury. Each piece is crafted with certified anti-tarnish micro-plating and guaranteed authenticity. Enjoy complimentary luxury gift boxes and express domestic delivery.'
  );
  const [promoCode, setPromoCode] = useState('DIWALI40');
  const [discountText, setDiscountText] = useState('FLAT 40% OFF');
  const [ctaText, setCtaText] = useState('SHOP FESTIVE DIWALI DROP (40% OFF) →');
  const [ctaUrl, setCtaUrl] = useState('/?category=Jewellery');
  const [themeColor, setThemeColor] = useState<
    'crimson_gold' | 'emerald_gold' | 'rose_noir' | 'sunset_amber' | 'royal_noir'
  >('crimson_gold');
  const [customTestEmail, setCustomTestEmail] = useState('');

  // Template Editing / Creation Modal
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Subscriber Directory search
  const [subscriberFilter, setSubscriberFilter] = useState<'all' | 'registered' | 'subscribers' | 'managers'>('all');
  const [searchSubscriber, setSearchSubscriber] = useState('');

  // Quick load template into composer
  const handleApplyTemplate = (tpl: EmailTemplate) => {
    setSelectedTemplateId(tpl.id);
    setSubject(tpl.subject);
    setPreheader(tpl.preheader);
    setHeroHeadline(tpl.heroHeadline);
    setHeroSubheadline(tpl.heroSubheadline);
    setHeroImage(tpl.heroImage);
    setBadgeText(tpl.badgeText);
    setBodyContent(tpl.bodyContent);
    setPromoCode(tpl.promoCode || '');
    setDiscountText(tpl.discountText || '');
    setCtaText(tpl.ctaText);
    setCtaUrl(tpl.ctaUrl);
    setThemeColor(tpl.themeColor);
    showToast(`Template "${tpl.name}" loaded into composer!`, 'info');
  };

  // Dispatch campaign
  const handleDispatchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      showToast('Please enter a campaign subject line', 'error');
      return;
    }

    sendNotificationCampaign({
      title: subject,
      message: bodyContent,
      targetAudience,
      channel,
      actionUrl: ctaUrl,
      actionLabel: ctaText.replace('→', '').trim(),
      promoCode: promoCode.trim() || undefined,
      imageUrl: heroImage,
      templateId: selectedTemplateId,
      subject,
    });
  };

  // Theme styling for preview
  const getThemeClasses = () => {
    switch (themeColor) {
      case 'emerald_gold':
        return {
          wrapper: 'bg-[#031d10] border-emerald-500/40 text-emerald-100',
          accent: 'text-[#d4af37]',
          badge: 'bg-emerald-900/80 text-emerald-300 border-emerald-500/40',
          button: 'bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-zinc-950',
          ticket: 'bg-emerald-950/80 border-emerald-500/50',
        };
      case 'rose_noir':
        return {
          wrapper: 'bg-[#22040c] border-rose-500/40 text-rose-100',
          accent: 'text-rose-300',
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
          button: 'bg-gradient-to-r from-rose-500 via-pink-400 to-rose-600 text-white',
          ticket: 'bg-rose-950/80 border-rose-500/50',
        };
      case 'sunset_amber':
        return {
          wrapper: 'bg-[#1e1305] border-amber-500/40 text-amber-100',
          accent: 'text-amber-300',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
          button: 'bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 text-zinc-950',
          ticket: 'bg-amber-950/80 border-amber-500/50',
        };
      case 'royal_noir':
        return {
          wrapper: 'bg-[#0c0a09] border-stone-700 text-stone-200',
          accent: 'text-amber-400',
          badge: 'bg-stone-900 text-stone-300 border-stone-700',
          button: 'bg-white hover:bg-stone-200 text-stone-950',
          ticket: 'bg-stone-900/90 border-stone-700',
        };
      case 'crimson_gold':
      default:
        return {
          wrapper: 'bg-[#270303] border-amber-500/40 text-amber-100',
          accent: 'text-[#f59e0b]',
          badge: 'bg-red-950/80 text-amber-300 border-amber-500/40',
          button: 'bg-gradient-to-r from-[#f59e0b] via-[#fde68a] to-[#d97706] text-zinc-950',
          ticket: 'bg-red-950/80 border-amber-500/50',
        };
    }
  };

  const previewTheme = getThemeClasses();

  // Audience counts
  const audienceStats = {
    all_users: 4720,
    subscribers: 3240,
    registered: 1150,
    managers: 4,
  };

  // Filtered subscribers
  const filteredSubscribers = subscribers.filter((sub) => {
    if (subscriberFilter === 'registered' && !sub.isRegisteredUser) return false;
    if (subscriberFilter === 'subscribers' && sub.isRegisteredUser) return false;
    if (subscriberFilter === 'managers' && sub.role !== 'manager') return false;
    if (searchSubscriber) {
      const q = searchSubscriber.toLowerCase();
      return (
        sub.email.toLowerCase().includes(q) ||
        (sub.name && sub.name.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pt-6">
      {/* 🌟 STUDIO HEADER WITH VERIFIED DISPATCH BADGE */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-stone-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Bell className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Notifications & Mail Campaign Studio
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Live Dispatch Ready
              </span>
            </div>
            <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
              Broadcast festive drops, flash deals, and rewards directly to customer inboxes and FOAXX account notification centers. Fully styled with rich Zomato-style luxury email templates.
            </p>
          </div>

          {/* Official Sender Pill */}
          <div className="bg-stone-800/90 border border-stone-700/80 rounded-xl p-3 flex items-center gap-3 self-start lg:self-auto">
            <div className="w-9 h-9 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
            <div className="text-left text-xs">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Official Studio Sender
              </span>
              <span className="font-mono font-bold text-white text-xs sm:text-sm">
                foaxx.studio@gmail.com
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-stone-800/80">
          <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Audience Reach</span>
            <span className="text-base sm:text-lg font-bold text-white">4,720 contacts</span>
          </div>
          <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Marketing Sent</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">{sentCampaignLogs.length} Sent</span>
          </div>
          <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">foaxx.studio@gmail.com</span>
            <span className="text-base sm:text-lg font-bold text-amber-300">{transactionalEmails.length} Logs</span>
          </div>
          <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Atelier Templates</span>
            <span className="text-base sm:text-lg font-bold text-white">{emailTemplates.length} Ready</span>
          </div>
          <div className="p-3 bg-stone-800/50 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Active In-App Alerts</span>
            <span className="text-base sm:text-lg font-bold text-white">{appNotifications.length} Live</span>
          </div>
        </div>

        {/* Studio Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-stone-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'compose', label: '🚀 Compose & Broadcast', count: 'Instant Send' },
            { id: 'templates', label: '🎨 Email Template Studio', count: `${emailTemplates.length} Templates` },
            { id: 'history', label: '📜 Campaign History', count: `${sentCampaignLogs.length} Sent` },
            { id: 'audience', label: '👥 Audience Directory', count: `${subscribers.length} Profiles` },
            { id: 'automated', label: '📨 Automated Mails (foaxx.studio@gmail.com)', count: `${transactionalEmails.length} Logs` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === tab.id
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-md scale-[1.01]'
                  : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                  activeSubTab === tab.id ? 'bg-zinc-950 text-amber-300' : 'bg-stone-700 text-stone-300'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 🚀 SUB-TAB 1: COMPOSE & BROADCAST */}
      {activeSubTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Composer Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Send className="w-4 h-4 text-amber-600" />
                  <span>Compose Marketing Broadcast</span>
                </h3>
                <span className="text-[11px] text-stone-500 font-medium">
                  Sender: <strong className="text-stone-800">foaxx.studio@gmail.com</strong>
                </span>
              </div>

              {/* Quick Template Picker Strip */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  1. Load a High-Converting Luxury Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {emailTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex flex-col justify-between ${
                        selectedTemplateId === tpl.id
                          ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                          : 'border-stone-200 hover:border-stone-400 bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-stone-900 truncate">{tpl.name}</span>
                        {tpl.promoCode && (
                          <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded">
                            {tpl.promoCode}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 truncate mt-1">{tpl.subject}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience Selector & Channel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    2. Select Target Audience
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as NotificationTarget)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all_users">🌟 All Users & Subscribers (~4,720 reach)</option>
                    <option value="subscribers">📩 Newsletter Subscribers Only (~3,240 subscribers)</option>
                    <option value="registered">👤 Registered Account Holders Only (~1,150 accounts)</option>
                    <option value="managers">🛡️ Store Managers & Staff (Reserved - 4 managers)</option>
                  </select>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Estimated delivery: <strong>{audienceStats[targetAudience].toLocaleString('en-IN')} recipients</strong>
                  </span>
                </div>

                {/* Dispatch Channel */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    3. Dispatch Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value as NotificationChannel)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="both">🔔 In-App Notification & Email (Both)</option>
                    <option value="email">✉️ Email Only (Zomato-Style Rich HTML)</option>
                    <option value="in_app">🔔 In-App Account Notification Only</option>
                  </select>
                  <span className="text-[10px] text-stone-500 mt-1 block">
                    Arrives instantly in FOAXX account & user email
                  </span>
                </div>
              </div>

              {/* Subject & Preheader */}
              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email Subject Line / In-App Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Diwali Grand Sale is LIVE! 🪔 Flat 40% Off on Kundan & Polki Edits"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Inbox Preheader Snippet (Preview text before opening)
                  </label>
                  <input
                    type="text"
                    value={preheader}
                    onChange={(e) => setPreheader(e.target.value)}
                    placeholder="e.g. Claim your festive look before midnight. Tap to reveal your golden gift."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Hero Banner Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hero Headline
                  </label>
                  <input
                    type="text"
                    value={heroHeadline}
                    onChange={(e) => setHeroHeadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Top Badge Text
                  </label>
                  <input
                    type="text"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Hero Sub-headline
                  </label>
                  <input
                    type="text"
                    value={heroSubheadline}
                    onChange={(e) => setHeroSubheadline(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-800"
                  />
                </div>

                <div className="sm:col-span-2 bg-stone-50/80 p-3 rounded-xl border border-stone-200">
                  <ImageUploader
                    label="Hero Banner Picture (Upload from phone/PC, select presets, or URL)"
                    currentImage={heroImage}
                    onImageChange={(img) => setHeroImage(img)}
                    aspectRatioClass="aspect-[16/9]"
                  />
                </div>
              </div>

              {/* Offer & Coupon Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Promo Coupon Code
                  </label>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="e.g. DIWALI40"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Discount Highlight
                  </label>
                  <input
                    type="text"
                    value={discountText}
                    onChange={(e) => setDiscountText(e.target.value)}
                    placeholder="e.g. FLAT 40% OFF"
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-bold text-stone-800"
                  />
                </div>
              </div>

              {/* Body Copy */}
              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email & Notification Body Copy
                </label>
                <textarea
                  rows={3}
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 text-stone-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Call to Action Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-bold text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 font-mono text-stone-800"
                  />
                </div>
              </div>

              {/* Theme Color Selector */}
              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Luxury Theme Styling
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { id: 'crimson_gold', label: '🪔 Diwali Crimson Gold' },
                    { id: 'emerald_gold', label: '🌙 Eid Emerald Gold' },
                    { id: 'rose_noir', label: '🌹 Valentine Rose Noir' },
                    { id: 'sunset_amber', label: '⚡ Sunset Amber Flash' },
                    { id: 'royal_noir', label: '👑 Midnight Heritage' },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => setThemeColor(thm.id as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        themeColor === thm.id
                          ? 'bg-stone-900 text-white ring-2 ring-amber-400'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {thm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-[11px] text-stone-500">
                  <span>From: </span>
                  <strong className="text-stone-800 font-mono">foaxx.studio@gmail.com</strong>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      showToast(`Test email simulated to foaxx.studio@gmail.com!`, 'info');
                    }}
                    className="flex-1 sm:flex-initial px-4 py-2.5 border border-stone-300 hover:border-stone-400 text-stone-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Send Test Preview
                  </button>

                  <button
                    type="button"
                    onClick={handleDispatchCampaign}
                    className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:brightness-105 text-zinc-950 font-black rounded-xl text-xs tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Broadcast Campaign Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Real-Time Zomato-Style Visual Simulator (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between bg-stone-900 text-white p-3 rounded-2xl border border-stone-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">Live Preview</span>
              </div>

              <div className="flex items-center gap-1 bg-stone-800 p-1 rounded-xl border border-stone-700">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    previewDevice === 'desktop' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Desktop Email View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    previewDevice === 'mobile' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                  title="Mobile Email View"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">Mobile</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('inapp')}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1 ${
                    previewDevice === 'inapp' ? 'bg-amber-400 text-zinc-950 font-bold' : 'text-stone-400 hover:text-white'
                  }`}
                  title="In-App Account Notification View"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[10px]">In-App</span>
                </button>
              </div>
            </div>

            {/* SIMULATOR CONTAINER */}
            {previewDevice !== 'inapp' ? (
              <div
                className={`mx-auto bg-stone-950 text-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-stone-800 transition-all ${
                  previewDevice === 'mobile' ? 'max-w-sm' : 'w-full'
                }`}
              >
                {/* Email Client Metadata Chrome */}
                <div className="bg-stone-900/90 rounded-2xl p-3 border border-stone-800 mb-3 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-stone-400">
                    <span>From: <strong className="text-white">FOAXX Luxury Atelier &lt;foaxx.studio@gmail.com&gt;</strong></span>
                    <span className="text-[10px] text-emerald-400">Verified TLS</span>
                  </div>
                  <div className="text-stone-400 truncate">
                    To: <span className="text-stone-200">priya.sharma@example.com, and 4,719 others</span>
                  </div>
                  <div className="text-stone-300 font-semibold truncate pt-0.5">
                    Subject: {subject}
                  </div>
                  <div className="text-stone-500 text-[10px] truncate">
                    {preheader}
                  </div>
                </div>

                {/* EMAIL BODY CARD (Zomato-style Luxury Card) */}
                <div className={`overflow-hidden rounded-2xl border ${previewTheme.wrapper} shadow-xl`}>
                  {/* Brand Header */}
                  <div className="text-center p-4 border-b border-white/10 bg-black/30">
                    <span className="text-base sm:text-lg font-serif font-black tracking-[0.25em] text-white">
                      F O A X X
                    </span>
                    <span className="block text-[8px] uppercase tracking-[0.3em] text-amber-300/80 mt-0.5 font-bold">
                      LUXURY ATELIER · PRIVATE RESERVE
                    </span>
                  </div>

                  {/* Hero Graphic */}
                  <div className="relative w-full h-44 sm:h-52 bg-black/60 overflow-hidden">
                    <img
                      src={heroImage}
                      alt={heroHeadline}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-md ${previewTheme.badge}`}>
                        {badgeText}
                      </span>
                    </div>
                  </div>

                  {/* Offer Content */}
                  <div className="p-4 sm:p-5 space-y-3.5 text-center">
                    <div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-white uppercase font-serif">
                        {heroHeadline}
                      </h4>
                      <p className="text-[11px] text-amber-200 font-semibold mt-0.5">
                        {heroSubheadline}
                      </p>
                    </div>

                    {/* Perforated Coupon Ticket (Zomato style) */}
                    {promoCode && (
                      <div className={`p-3 rounded-xl border border-dashed text-center shadow-md ${previewTheme.ticket}`}>
                        <div className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                          {discountText || 'SPECIAL FESTIVE OFFER'}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <Tag className="w-3.5 h-3.5 text-amber-400" />
                          <span className="font-mono font-black text-sm text-white tracking-widest">
                            {promoCode}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(promoCode);
                              setCopiedCode(true);
                              setTimeout(() => setCopiedCode(false), 2000);
                            }}
                            className="text-[9px] bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black px-2 py-0.5 rounded uppercase cursor-pointer"
                          >
                            {copiedCode ? 'COPIED!' : 'COPY'}
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-stone-300 leading-relaxed max-w-md mx-auto">
                      {bodyContent}
                    </p>

                    {/* Big Vibrant CTA Button */}
                    <button
                      type="button"
                      className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider shadow-xl transition-all cursor-pointer ${previewTheme.button}`}
                    >
                      {ctaText}
                    </button>

                    {/* Trust Badges */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-4 text-[10px] text-stone-400">
                      <span>✓ 100% Anti-Tarnish</span>
                      <span>✓ Insured Express Delivery</span>
                      <span>✓ 7-Day Easy Returns</span>
                    </div>

                    {/* Footer Signature */}
                    <div className="pt-3 border-t border-white/10 text-[9px] text-stone-400 text-center leading-normal">
                      <p className="font-bold text-stone-300">FOAXX Flagship Studio</p>
                      <p>149 D L Rd, Dehradun, Uttarakhand 248001</p>
                      <p className="mt-1">
                        Official Care: +91 98376 63372 · Mail: foaxx.studio@gmail.com
                      </p>
                      <p className="text-stone-500 mt-1">
                        You received this because you are a valued member of the FOAXX luxury atelier.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* IN-APP ACCOUNT NOTIFICATION VIEW */
              <div className="bg-stone-900 rounded-3xl p-4 border border-stone-800 shadow-2xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>In-App Notification Bubble</span>
                  </span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Just Now
                  </span>
                </div>

                <div className="p-3.5 bg-stone-950 border border-amber-500/30 rounded-2xl space-y-2.5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Flame className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-white leading-snug">
                        {subject}
                      </h5>
                      <p className="text-[11px] text-stone-300 leading-relaxed mt-1">
                        {bodyContent}
                      </p>
                    </div>
                  </div>

                  {promoCode && (
                    <div className="flex items-center justify-between p-2 rounded-lg bg-stone-900 border border-dashed border-amber-400/50">
                      <span className="text-[10px] text-stone-400 font-medium">Promo Coupon:</span>
                      <span className="font-mono font-bold text-xs text-amber-300">{promoCode}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-stone-400">From: foaxx.studio@gmail.com</span>
                    <button
                      type="button"
                      className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>{ctaText.replace('→', '').trim()}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🎨 SUB-TAB 2: TEMPLATE STUDIO */}
      {activeSubTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Luxury Email & Campaign Templates ({emailTemplates.length})
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Pre-styled marketing templates inspired by high-conversion Zomato/luxury campaigns. Fully customizable.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingTemplate({
                  id: `tpl-${Date.now()}`,
                  name: 'New Custom Festive Template',
                  category: 'custom',
                  subject: 'Special Surprise Unlocked for You ✨',
                  preheader: 'Limited access to our new luxury drop.',
                  heroHeadline: 'CELEBRATE IN LUXURY ✨',
                  heroSubheadline: 'Handcrafted in Dehradun Atelier',
                  heroImage: '/assets/aistudio/image_8b11f93e.png',
                  badgeText: 'EXCLUSIVE DROP',
                  bodyContent: 'Enjoy private pricing across our signature edits for a limited time.',
                  ctaText: 'SHOP EXCLUSIVE DROP →',
                  ctaUrl: '/?category=All',
                  promoCode: 'FESTIVE25',
                  discountText: 'FLAT 25% OFF',
                  themeColor: 'crimson_gold',
                  senderEmail: 'foaxx.studio@gmail.com',
                  senderName: 'FOAXX Luxury Atelier',
                  updatedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                });
                setIsTemplateModalOpen(true);
              }}
              className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Template</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {emailTemplates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden flex flex-col justify-between group hover:border-amber-400/80 transition-all"
              >
                <div>
                  {/* Template Card Graphic */}
                  <div className="relative h-40 bg-stone-900 overflow-hidden">
                    <img
                      src={tpl.heroImage}
                      alt={tpl.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/30" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/40">
                      {tpl.badgeText || tpl.category}
                    </span>
                    {tpl.promoCode && (
                      <span className="absolute bottom-3 right-3 text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-400 text-zinc-950 shadow-md">
                        {tpl.promoCode}
                      </span>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <span className="capitalize">{tpl.category.replace('_', ' ')}</span>
                      <span>{tpl.updatedAt || '02 Nov 2026'}</span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1">{tpl.name}</h4>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {tpl.subject}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleApplyTemplate(tpl);
                      setActiveSubTab('compose');
                    }}
                    className="flex-1 py-1.5 px-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Use Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingTemplate(tpl);
                      setIsTemplateModalOpen(true);
                    }}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit Template"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteEmailTemplate(tpl.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📜 SUB-TAB 3: CAMPAIGN HISTORY & LOGS */}
      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">
                Dispatched Campaigns & Broadcast Log
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Every marketing email & in-app notification sent from foaxx.studio@gmail.com
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full self-start sm:self-auto">
              {sentCampaignLogs.length} Broadcasts Recorded
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Subject & Content</th>
                  <th className="py-3 px-4">Audience</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Recipients</th>
                  <th className="py-3 px-4">Promo</th>
                  <th className="py-3 px-4">Sent At</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sentCampaignLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-stone-900 truncate">{log.subject}</div>
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">{log.previewSnippet}</div>
                      <div className="text-[10px] text-stone-400 font-mono mt-0.5">From: {log.senderEmail}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="capitalize text-stone-700 font-medium">
                        {log.targetAudience.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                        {log.channel === 'both' ? '🔔+✉️ Both' : log.channel === 'email' ? '✉️ Email' : '🔔 In-App'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-stone-800">
                      {log.recipientCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {log.promoCode ? (
                        <span className="font-mono text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                          {log.promoCode}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-stone-500">{log.sentAt}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{log.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 👥 SUB-TAB 4: AUDIENCE & SUBSCRIBER DIRECTORY */}
      {activeSubTab === 'audience' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">
                  Customer & Subscriber Directory ({subscribers.length})
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Manage all contacts eligible for in-app broadcasts and marketing emails.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {(['all', 'registered', 'subscribers', 'managers'] as const).map((flt) => (
                  <button
                    key={flt}
                    type="button"
                    onClick={() => setSubscriberFilter(flt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                      subscriberFilter === flt
                        ? 'bg-stone-900 text-white font-bold'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {flt}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchSubscriber}
                onChange={(e) => setSearchSubscriber(e.target.value)}
                placeholder="Search by email, customer name..."
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Directory Table */}
          <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Contact Profile</th>
                    <th className="py-3 px-4">Phone</th>
                    <th className="py-3 px-4">Role / Segment</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Subscribed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredSubscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900">{sub.name || 'Anonymous Muse'}</div>
                        <div className="text-[11px] text-stone-600 font-mono">{sub.email}</div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                        {sub.phone || '+91 —'}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            sub.role === 'manager'
                              ? 'bg-purple-100 text-purple-900 border border-purple-200'
                              : sub.role === 'vip'
                              ? 'bg-amber-100 text-amber-900 border border-amber-200'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {sub.role === 'manager' ? '🛡️ Manager' : sub.role === 'vip' ? '💎 VIP Privé' : '👤 Customer'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">{sub.source}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                          ✓ {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-stone-500 whitespace-nowrap">{sub.subscribedAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 📨 SUB-TAB 5: AUTOMATED TRANSACTIONAL MAILS (foaxx.studio@gmail.com) */}
      {activeSubTab === 'automated' && (
        <div className="space-y-6">
          {/* Header & Verification Card */}
          <div className="bg-gradient-to-r from-stone-900 via-zinc-900 to-black text-white p-6 rounded-2xl border border-stone-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-zinc-950 flex items-center gap-1.5 shadow-sm">
                    <MailCheck className="w-3.5 h-3.5" />
                    Verified Sender: {SYSTEM_SENDER_EMAIL}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    FOAXX Atelier Luxury Template Engine
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-100">
                  Automated Transactional Emails & Event Dispatches
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Every critical milestone in the customer journey automatically generates and dispatches an authentic FOAXX Luxury Atelier HTML email from <strong className="text-amber-300 font-mono">{SYSTEM_SENDER_EMAIL}</strong>. Includes anti-tarnish guarantee certification, order receipts, live tracking links, and security authorization PINs.
                </p>
              </div>

              <div className="bg-stone-800/80 backdrop-blur-sm p-4 rounded-xl border border-stone-700/80 flex flex-col gap-2 shrink-0 sm:min-w-[260px]">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Total System Dispatches:</span>
                  <span className="font-bold text-amber-300 text-sm">{transactionalEmails.length}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Default Sender:</span>
                  <span className="font-mono text-stone-200 text-[11px]">{SYSTEM_SENDER_EMAIL}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>Brand Identity:</span>
                  <span className="font-medium text-stone-200 text-[11px]">{SYSTEM_SENDER_NAME}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span>HTML Template:</span>
                  <span className="font-medium text-emerald-400 text-[11px]">Signature Obsidian & Gold</span>
                </div>
              </div>
            </div>

            {/* Quick Test Trigger Bar */}
            <div className="mt-6 pt-5 border-t border-stone-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Instant Test Dispatcher (Simulate Any Lifecycle Event):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testRecipientName}
                    onChange={(e) => setTestRecipientName(e.target.value)}
                    placeholder="Recipient Name"
                    className="bg-stone-800 border border-stone-700 text-stone-200 text-xs px-2.5 py-1 rounded-lg w-32 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="email"
                    value={testRecipientEmail}
                    onChange={(e) => setTestRecipientEmail(e.target.value)}
                    placeholder="Recipient Email"
                    className="bg-stone-800 border border-stone-700 text-stone-200 text-xs px-2.5 py-1 rounded-lg w-48 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isTestTriggering}
                  onClick={async () => {
                    setIsTestTriggering(true);
                    await triggerWelcomeEmail({ email: testRecipientEmail, name: testRecipientName });
                    setIsTestTriggering(false);
                    showToast(`Welcome email dispatched to ${testRecipientEmail}!`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-400/60 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Welcome Mail</span>
                </button>

                <button
                  type="button"
                  disabled={isTestTriggering || orders.length === 0}
                  onClick={async () => {
                    if (orders.length === 0) return;
                    setIsTestTriggering(true);
                    await triggerOrderConfirmationEmail(orders[0]);
                    setIsTestTriggering(false);
                    showToast(`Order confirmation dispatched for ${orders[0].orderNumber}!`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-400/60 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Package className="w-3.5 h-3.5 text-blue-400" />
                  <span>Send Order Confirmation</span>
                </button>

                <button
                  type="button"
                  disabled={isTestTriggering || orders.length === 0}
                  onClick={async () => {
                    if (orders.length === 0) return;
                    setIsTestTriggering(true);
                    await triggerShipmentStatusEmail({
                      order: orders[0],
                      status: 'Shipped',
                      courier: 'Bluedart Express Priority',
                      trackingNumber: 'BD-884920194',
                      trackingUrl: 'https://www.bluedart.com',
                    });
                    setIsTestTriggering(false);
                    showToast(`Shipment dispatched email sent for ${orders[0].orderNumber}!`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-400/60 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Dispatched Mail</span>
                </button>

                <button
                  type="button"
                  disabled={isTestTriggering || orders.length === 0}
                  onClick={async () => {
                    if (orders.length === 0) return;
                    setIsTestTriggering(true);
                    await triggerShipmentStatusEmail({
                      order: orders[0],
                      status: 'Delivered',
                    });
                    setIsTestTriggering(false);
                    showToast(`Delivered notification dispatched for ${orders[0].orderNumber}!`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-400/60 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Send Delivered Mail</span>
                </button>

                <button
                  type="button"
                  disabled={isTestTriggering || orders.length === 0}
                  onClick={async () => {
                    if (orders.length === 0) return;
                    setIsTestTriggering(true);
                    await triggerShipmentStatusEmail({
                      order: orders[0],
                      status: 'Shipped',
                      delayReason: 'Regional festive logistics traffic check',
                      revisedEstimatedDelivery: 'Tomorrow, 5:00 PM',
                    });
                    setIsTestTriggering(false);
                    showToast(`Transit delay advisory dispatched for ${orders[0].orderNumber}!`, 'info');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-400/60 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send Delay Advisory</span>
                </button>

                <button
                  type="button"
                  disabled={isTestTriggering}
                  onClick={async () => {
                    setIsTestTriggering(true);
                    const pin = Math.floor(100000 + Math.random() * 900000).toString();
                    await triggerPasswordResetEmail({
                      email: testRecipientEmail,
                      name: testRecipientName,
                      resetPin: pin,
                    });
                    setIsTestTriggering(false);
                    showToast(`Password reset security PIN email sent to ${testRecipientEmail}!`, 'success');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-400/60 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>Send Password Reset PIN</span>
                </button>
              </div>
            </div>
          </div>

          {/* Official Firebase Console Luxury HTML Template Box */}
          <div className="bg-[#141210] border border-[#38312B] rounded-2xl p-5 text-stone-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                  Firebase Console Ready
                </span>
                <span className="text-xs font-bold text-white">Official FOAXX Luxury Email Template for Password Reset</span>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed max-w-2xl">
                By default, Firebase Auth sends plain text without styling. Copy this pre-styled Obsidian &amp; Gold HTML template and paste it directly into <strong className="text-stone-200">Firebase Console &gt; Authentication &gt; Templates &gt; Password reset</strong> to ensure all automated reset emails arrive in certified FOAXX luxury format.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateFirebaseConsolePasswordResetTemplate());
                  showToast('FOAXX Luxury Template copied! Paste it into Firebase Console > Authentication > Templates > Password reset.', 'success');
                }}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#C5A030] text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Luxury HTML Template</span>
              </button>
            </div>
          </div>

          {/* Filter, Search & Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                  <Inbox className="w-4 h-4 text-amber-600" />
                  <span>Automated Transactional Mail Log</span>
                </h4>
                <p className="text-xs text-stone-500">
                  Audit real emails triggered by customer actions, view luxury HTML previews, or resend to Gmail.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={autoSearchQuery}
                  onChange={(e) => setAutoSearchQuery(e.target.value)}
                  placeholder="Search recipient, order, subject..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 'all', label: 'All Events' },
                { id: 'welcome', label: '✨ Welcome' },
                { id: 'order_confirmation', label: '🧾 Order Placed' },
                { id: 'shipment_dispatched', label: '🚚 Dispatched' },
                { id: 'out_for_delivery', label: '🛵 Out for Delivery' },
                { id: 'delivered', label: '📦 Delivered' },
                { id: 'delivery_delayed', label: '⏳ Delayed' },
                { id: 'password_reset', label: '🔐 Password Reset' },
                { id: 'order_cancelled', label: '✕ Cancelled' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setAutoEventFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    autoEventFilter === f.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Transactional Emails Table */}
            {transactionalEmails.length === 0 ? (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <Mail className="w-8 h-8 mx-auto text-stone-300" />
                <p className="font-semibold text-stone-700">No automated emails logged yet.</p>
                <p className="text-xs">Use the instant test dispatcher above or place an order to see it in action.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-stone-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Subject & Details</th>
                      <th className="py-3 px-4">Sent At</th>
                      <th className="py-3 px-4">Status & Sender</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {transactionalEmails
                      .filter((item) => {
                        if (autoEventFilter !== 'all' && item.eventType !== autoEventFilter) {
                          return false;
                        }
                        if (autoSearchQuery.trim()) {
                          const q = autoSearchQuery.toLowerCase();
                          return (
                            item.recipientEmail.toLowerCase().includes(q) ||
                            item.recipientName.toLowerCase().includes(q) ||
                            item.subject.toLowerCase().includes(q) ||
                            (item.orderNumber && item.orderNumber.toLowerCase().includes(q))
                          );
                        }
                        return true;
                      })
                      .map((mail) => {
                        const getEventBadge = () => {
                          switch (mail.eventType) {
                            case 'welcome':
                              return {
                                bg: 'bg-amber-100 text-amber-900 border-amber-200',
                                label: 'Welcome Mail',
                                icon: Sparkles,
                              };
                            case 'order_confirmation':
                              return {
                                bg: 'bg-blue-100 text-blue-900 border-blue-200',
                                label: 'Order Confirmed',
                                icon: Package,
                              };
                            case 'shipment_dispatched':
                              return {
                                bg: 'bg-indigo-100 text-indigo-900 border-indigo-200',
                                label: 'Dispatched',
                                icon: Truck,
                              };
                            case 'out_for_delivery':
                              return {
                                bg: 'bg-cyan-100 text-cyan-900 border-cyan-200',
                                label: 'Out for Delivery',
                                icon: Truck,
                              };
                            case 'delivered':
                              return {
                                bg: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                                label: 'Delivered',
                                icon: CheckCircle2,
                              };
                            case 'delivery_delayed':
                              return {
                                bg: 'bg-amber-100 text-amber-900 border-amber-300',
                                label: 'Transit Delayed',
                                icon: AlertTriangle,
                              };
                            case 'password_reset':
                              return {
                                bg: 'bg-purple-100 text-purple-900 border-purple-200',
                                label: 'Password Reset',
                                icon: KeyRound,
                              };
                            case 'order_cancelled':
                              return {
                                bg: 'bg-rose-100 text-rose-900 border-rose-200',
                                label: 'Order Cancelled',
                                icon: X,
                              };
                            default:
                              return {
                                bg: 'bg-stone-100 text-stone-800 border-stone-200',
                                label: mail.eventType,
                                icon: Mail,
                              };
                          }
                        };
                        const badge = getEventBadge();
                        const BadgeIcon = badge.icon;

                        const gmailComposeUrl = createGmailComposeUrl({
                          to: mail.recipientEmail,
                          subject: mail.subject,
                          body: mail.preheader,
                        });

                        return (
                          <tr key={mail.id} className="hover:bg-stone-50/80 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}
                              >
                                <BadgeIcon className="w-3 h-3" />
                                {badge.label}
                              </span>
                              {mail.orderNumber && (
                                <div className="mt-1 text-[11px] font-mono font-bold text-stone-700">
                                  {mail.orderNumber}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-stone-900">{mail.recipientName}</div>
                              <div className="text-[11px] text-stone-500 font-mono">{mail.recipientEmail}</div>
                            </td>

                            <td className="py-3 px-4 max-w-xs">
                              <div className="font-semibold text-stone-900 truncate" title={mail.subject}>
                                {mail.subject}
                              </div>
                              <div className="text-[11px] text-stone-500 truncate" title={mail.preheader}>
                                {mail.preheader}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-stone-500 whitespace-nowrap text-[11px]">
                              {mail.sentAt}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{mail.status}</span>
                              </div>
                              <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                                From: {mail.senderEmail}
                              </div>
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setViewingEmailModal(mail);
                                    setModalViewMode('rendered');
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-stone-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                                  title="View Authentic FOAXX Atelier HTML Email"
                                >
                                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Preview HTML</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    await resendTransactionalEmail(mail.id);
                                    showToast(`Re-sent email to ${mail.recipientEmail}!`, 'success');
                                  }}
                                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                                  title="Re-send Email"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>

                                <a
                                  href={gmailComposeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-amber-50 hover:border-amber-300 text-stone-600 hover:text-amber-700 transition-colors cursor-pointer inline-flex items-center"
                                  title="Open in Gmail Web with foaxx.studio@gmail.com"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LUXURY HTML EMAIL PREVIEW MODAL */}
      {viewingEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-zinc-950 text-stone-100 rounded-2xl shadow-2xl border border-stone-800 overflow-hidden my-4 flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-zinc-900 to-black border-b border-stone-800 flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-zinc-950">
                    FOAXX Luxury Dispatch
                  </span>
                  <span className="text-xs font-mono text-stone-400">
                    From: <strong className="text-amber-300 font-bold">{viewingEmailModal.senderEmail}</strong> ({viewingEmailModal.senderName})
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate max-w-xl">
                  {viewingEmailModal.subject}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-400">
                  <span>To: <strong className="text-stone-200">{viewingEmailModal.recipientName}</strong> &lt;{viewingEmailModal.recipientEmail}&gt;</span>
                  <span>•</span>
                  <span>Sent: {viewingEmailModal.sentAt}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">✓ {viewingEmailModal.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingEmailModal(null)}
                  className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab controls inside modal */}
            <div className="px-5 py-2.5 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-xs shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setModalViewMode('rendered')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    modalViewMode === 'rendered'
                      ? 'bg-amber-400 text-zinc-950'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🎨 Rendered Luxury Email
                </button>
                <button
                  type="button"
                  onClick={() => setModalViewMode('html')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    modalViewMode === 'html'
                      ? 'bg-amber-400 text-zinc-950'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  📄 HTML Source
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await resendTransactionalEmail(viewingEmailModal.id);
                    showToast(`Email re-sent to ${viewingEmailModal.recipientEmail}!`, 'success');
                  }}
                  className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Re-send Now</span>
                </button>

                <a
                  href={createGmailComposeUrl({
                    to: viewingEmailModal.recipientEmail,
                    subject: viewingEmailModal.subject,
                    body: viewingEmailModal.preheader,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Gmail Web</span>
                </a>
              </div>
            </div>

            {/* Email Body / Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0a09]">
              {modalViewMode === 'rendered' ? (
                <div className="max-w-[620px] mx-auto rounded-xl overflow-hidden shadow-2xl border border-stone-800 bg-[#12100E]">
                  <iframe
                    title="FOAXX Email Preview"
                    srcDoc={viewingEmailModal.htmlContent}
                    className="w-full h-[650px] border-0 rounded-xl bg-[#12100E]"
                    sandbox="allow-same-origin"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Clean Responsive HTML (Zero External Dependencies)</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(viewingEmailModal.htmlContent);
                        showToast('HTML copied to clipboard!', 'success');
                      }}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1 font-mono text-[11px] cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy HTML</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-black border border-stone-800 text-[11px] font-mono text-amber-200/90 overflow-x-auto max-h-[580px] leading-relaxed">
                    {viewingEmailModal.htmlContent}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT TEMPLATE */}
      {isTemplateModalOpen && editingTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm">
                  {editingTemplate.id.startsWith('tpl-') && editingTemplate.updatedAt
                    ? 'Edit Luxury Email Template'
                    : 'Create New Campaign Template'}
                </h4>
                <p className="text-xs text-stone-300 mt-0.5">
                  Design a reusable Zomato-style promotional card
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-stone-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Template Name</label>
                  <input
                    type="text"
                    value={editingTemplate.name}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Category</label>
                  <select
                    value={editingTemplate.category}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, category: e.target.value as any })}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="festive_sale">Festive Sale</option>
                    <option value="flash_deal">Flash Deal</option>
                    <option value="welcome_vip">Welcome VIP</option>
                    <option value="privilege_exclusive">Privilege Exclusive</option>
                    <option value="cart_abandoned">Cart Abandoned</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Email Subject Line</label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className="w-full p-2.5 border rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Inbox Preheader</label>
                <input
                  type="text"
                  value={editingTemplate.preheader}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, preheader: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Hero Headline</label>
                  <input
                    type="text"
                    value={editingTemplate.heroHeadline}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, heroHeadline: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={editingTemplate.badgeText}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, badgeText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <ImageUploader
                  label="Hero Banner Picture (Upload from phone/PC, select presets, or URL)"
                  currentImage={editingTemplate.heroImage}
                  onImageChange={(img) => setEditingTemplate({ ...editingTemplate, heroImage: img })}
                  aspectRatioClass="aspect-[16/9]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Body Content</label>
                <textarea
                  rows={3}
                  value={editingTemplate.bodyContent}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, bodyContent: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Promo Code (Optional)</label>
                  <input
                    type="text"
                    value={editingTemplate.promoCode || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, promoCode: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 border rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Discount Text</label>
                  <input
                    type="text"
                    value={editingTemplate.discountText || ''}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, discountText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingTemplate.ctaText}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, ctaText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">CTA Target URL</label>
                  <input
                    type="text"
                    value={editingTemplate.ctaUrl}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, ctaUrl: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-stone-700 font-bold hover:bg-stone-100 cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveEmailTemplate(editingTemplate);
                  setIsTemplateModalOpen(false);
                }}
                className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold rounded-xl cursor-pointer text-xs shadow-md"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
