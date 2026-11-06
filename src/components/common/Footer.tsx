import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, Shield, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { user, setCurrentView, setSelectedCategory, setActivePolicy, openAuth, showToast, addSubscriber } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      addSubscriber(newsletterEmail, 'Footer');
      setSubscribed(true);
      showToast('Thank you for subscribing to FOAXX insider updates!');
      setNewsletterEmail('');
    }
  };

  const openPolicy = (policyName: string) => {
    setActivePolicy(policyName);
    setCurrentView('policy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryNav = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#141414] text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6">
        {/* Top Newsletter & Brand Promise */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          <div className="md:col-span-5">
            <div className="font-serif-luxury text-2xl tracking-[0.25em] text-white">
              FOAXX
            </div>
            <p className="text-[9px] tracking-[0.35em] text-stone-400 uppercase mt-0.5 font-medium">
              WEAR YOUR WOW.
            </p>
            <p className="text-xs text-stone-400 mt-3 leading-relaxed max-w-sm">
              Contemporary women's luxury jewellery, dresses, handbags, and accessories designed for the modern muse. Handcrafted in India with certified anti-tarnish finishes and ethically sourced stones.
            </p>
          </div>

          <div className="md:col-span-7 flex flex-col justify-center">
            <h4 className="text-sm font-semibold text-white tracking-wide">
              Join the FOAXX Collective
            </h4>
            <p className="text-xs text-stone-400 mt-1">
              Receive 10% off your first luxury order, exclusive access to festive drops, and private styling sessions.
            </p>

            <form onSubmit={handleSubscribe} className="mt-3 flex items-center max-w-md">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 bg-stone-900 border border-stone-700 text-xs text-white px-4 py-2.5 rounded-l-md focus:outline-none focus:border-stone-400 placeholder:text-stone-500"
                required
              />
              <button
                type="submit"
                className="bg-[#E07A5F] hover:bg-[#c96a51] text-white text-xs font-semibold px-4 py-2.5 rounded-r-md transition-colors flex items-center gap-1 cursor-pointer"
              >
                {subscribed ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <>
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-b border-stone-800 text-xs">
          {/* Col 1: Shop */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Shop Categories
            </h5>
            <ul className="space-y-2 text-stone-400">
              {['Jewellery', 'Earrings', 'Necklaces', 'Rings', 'Clothing', 'Dresses', 'Bags', 'Footwear'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => handleCategoryNav(cat)}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Customer Service */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Customer Service
            </h5>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => openAuth('login')}
                  className="hover:text-white transition-colors cursor-pointer text-[#E07A5F] font-medium inline-flex items-center gap-1.5"
                >
                  <span>{user ? `Account (${user.name})` : 'Sign In / Register'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('account');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  My Account & Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Contact Us')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Shipping & Delivery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Shipping & Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Returns & Exchanges')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Returns & Exchanges (7 Days)
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Order Tracking')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Track Your Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('FAQs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Guides & Trust */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Guides & Care
            </h5>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button
                  onClick={() => openPolicy('Jewellery Care Guide')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Jewellery Care Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Apparel Size Guide')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Size & Ring Fit Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Materials & Authenticity')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hallmarking & Materials
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Privacy Policy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy('Terms of Service')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Info & Admin Access */}
          <div>
            <h5 className="font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Studio & Customer Care
            </h5>
            <div className="text-stone-400 space-y-2 text-xs">
              <p className="font-medium text-stone-200">FOAXX Flagship Studio</p>
              <p>149 D L Rd, Dehradun, Uttarakhand 248001</p>
              <p className="text-stone-300">
                <a href="mailto:foaxx.studio@gmail.com" className="hover:text-amber-400 transition-colors">
                  foaxx.studio@gmail.com
                </a>
                {' '}|{' '}
                <a href="tel:+919837663372" className="hover:text-amber-400 transition-colors font-medium text-white">
                  +91 98376 63372
                </a>
              </p>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setCurrentView('manager');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-medium border border-amber-500/40 bg-stone-900/80 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Manager Portal</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-[#E07A5F] hover:text-[#f3957d] font-medium border border-stone-700 bg-stone-900/60 px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} FOAXX Retail India Pvt Ltd. All rights reserved.</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-stone-400">
              <Shield className="w-3 h-3 text-emerald-500" /> 100% Encrypted 256-bit SSL Checkout
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-stone-400">
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900 border border-stone-800">UPI</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900 border border-stone-800">RuPay</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900 border border-stone-800">VISA</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900 border border-stone-800">Mastercard</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900 border border-stone-800">NetBanking</span>
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900 border border-stone-800">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
