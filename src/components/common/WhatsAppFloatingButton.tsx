import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Package,
  Sparkles,
  Ruler,
  Tag,
  RefreshCw,
  PhoneCall,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface QuickQuestion {
  id: string;
  label: string;
  icon: React.ReactNode;
  prompt: string;
  category: string;
}

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  const phoneNumber = '919837663372';
  const officialPhoneFormatted = '+91 98376 63372';

  // Frequently asked customer queries
  const quickQuestions: QuickQuestion[] = [
    {
      id: 'order',
      label: 'Track my existing order',
      icon: <Package className="w-3.5 h-3.5 text-emerald-600" />,
      prompt: 'Namaste FOAXX, I want to check the status & dispatch tracking of my recent order.',
      category: 'Orders',
    },
    {
      id: 'custom_jewellery',
      label: 'Custom jewellery & bridal styling',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      prompt: 'Namaste FOAXX Atelier, I would like consultation regarding custom bridal jewellery & bespoke styling.',
      category: 'Jewellery',
    },
    {
      id: 'size_fit',
      label: 'Size guide & fit assistance',
      icon: <Ruler className="w-3.5 h-3.5 text-blue-500" />,
      prompt: 'Hi FOAXX team, I need help with sizing, body measurements, and fit recommendations.',
      category: 'Styling',
    },
    {
      id: 'festive_offers',
      label: 'Ongoing festive deals & coupons',
      icon: <Tag className="w-3.5 h-3.5 text-rose-500" />,
      prompt: 'Hello FOAXX, are there any exclusive festive offers, coupon codes, or studio discounts today?',
      category: 'Offers',
    },
    {
      id: 'returns',
      label: 'Return, exchange & delivery policy',
      icon: <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />,
      prompt: 'Hi FOAXX, I have a query about returns, instant store exchange, and delivery timelines.',
      category: 'Policy',
    },
    {
      id: 'direct_talk',
      label: 'Chat with live stylist / concierge',
      icon: <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />,
      prompt: 'Hello FOAXX Luxury Concierge, I would like to chat directly with a studio specialist.',
      category: 'Support',
    },
  ];

  const handleLaunchWhatsApp = (text: string) => {
    const finalMsg = text.trim() || 'Hello FOAXX Luxury Concierge, I would like to inquire about your collections.';
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMsg)}`;

    // Open WhatsApp in a new tab securely
    const link = document.createElement('a');
    link.href = waUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
    setCustomMessage('');
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        // Only close if target is not the toggle button
        const target = event.target as HTMLElement;
        if (!target.closest('#whatsapp-toggle-btn')) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <aside aria-label="WhatsApp Concierge" className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-50 select-none">
      {/* WhatsApp Question Selector Modal / Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="FOAXX WhatsApp Concierge"
          className="absolute bottom-14 right-0 w-[92vw] sm:w-[380px] bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-stone-900 z-50"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#075e54] to-[#128c7e] text-white p-4 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                    <MessageCircle className="w-5 h-5 fill-current" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075e54]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm tracking-tight text-white">FOAXX Concierge</h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  </div>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-200" />
                    Typically replies within minutes
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close WhatsApp questions"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Official Support Details Strip */}
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[10px] text-emerald-100">
              <span>Studio: 149 D L Rd, Dehradun</span>
              <span className="font-mono font-bold text-white">{officialPhoneFormatted}</span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 bg-stone-50/70 max-h-[60vh] overflow-y-auto space-y-3.5">
            {/* Greeting Bubble */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-sm shadow-sm border border-stone-200/80 text-xs text-stone-700 leading-relaxed">
              <p className="font-semibold text-stone-900 mb-1">
                Namaste! 🙏 Welcome to FOAXX Flagship Studio.
              </p>
              <p className="text-stone-600 text-[11px]">
                Please choose your inquiry topic below, or write your query to begin a direct WhatsApp conversation:
              </p>
            </div>

            {/* Quick Questions Section */}
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-2 px-1">
                Select a Question to Ask:
              </span>
              <div className="space-y-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleLaunchWhatsApp(q.prompt)}
                    className="w-full text-left bg-white hover:bg-emerald-50/80 border border-stone-200/90 hover:border-emerald-300 p-2.5 rounded-xl transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-7 h-7 rounded-lg bg-stone-100 group-hover:bg-emerald-100 flex items-center justify-center shrink-0 transition-colors">
                        {q.icon}
                      </div>
                      <span className="text-xs font-medium text-stone-800 group-hover:text-emerald-950 truncate">
                        {q.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Query Composer */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs">
              <label htmlFor="custom-wa-input" className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block mb-1.5">
                Or Type Your Custom Query:
              </label>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLaunchWhatsApp(customMessage);
                }}
                className="flex items-center gap-2"
              >
                <input
                  id="custom-wa-input"
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. Is the Polki Choker available in gold?"
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-white p-2 rounded-xl transition-colors cursor-pointer shrink-0"
                  title="Send to WhatsApp"
                  aria-label="Send query to WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Direct Instant Chat Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => handleLaunchWhatsApp('')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer inline-flex items-center gap-1"
              >
                <span>Or open direct WhatsApp chat without questions</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button - Clean static green pill without blink effects */}
      <button
        id="whatsapp-toggle-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-white px-4 py-2.5 rounded-full shadow-lg border border-white/20 transition-all cursor-pointer"
        title="Chat directly on WhatsApp (+91 98376 63372)"
        aria-label="Direct WhatsApp Chat With Us"
        aria-expanded={isOpen}
      >
        {/* WhatsApp Icon with solid yellow accent indicator dot */}
        <div className="relative flex items-center justify-center">
          <MessageCircle className="w-5 h-5 fill-current text-white" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#facc15] rounded-full border-2 border-[#22c55e]" />
        </div>

        {/* Two-line clean typography matching exact reference */}
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-100">
            DIRECT WHATSAPP
          </span>
          <span className="text-xs font-bold text-white">
            {isOpen ? 'Close Questions' : 'Chat With Us'}
          </span>
        </div>
      </button>
    </aside>
  );
};
