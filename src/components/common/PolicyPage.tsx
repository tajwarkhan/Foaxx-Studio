import React from 'react';
import { ArrowLeft, CheckCircle, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PolicyPage: React.FC = () => {
  const { activePolicy, setActivePolicy, setCurrentView } = useStore();

  const policies = [
    'Shipping & Delivery',
    'Returns & Exchanges',
    'Jewellery Care Guide',
    'Apparel Size Guide',
    'Materials & Authenticity',
    'Frequently Asked Questions',
    'Contact Us',
    'Privacy Policy',
    'Terms of Service',
  ];

  return (
    <div className="w-full bg-[#fdfcfb] min-h-screen py-8 sm:py-12">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
        {/* Back link */}
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar Nav */}
          <aside className="md:col-span-4 bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs h-fit space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400 p-2">
              Help & Customer Care
            </h3>
            {policies.map((p) => (
              <button
                key={p}
                onClick={() => setActivePolicy(p)}
                className={`w-full text-left py-2 px-3 rounded-md text-xs font-medium transition-colors ${
                  activePolicy === p
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                {p}
              </button>
            ))}
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-8 bg-white p-6 sm:p-8 rounded-xl border border-stone-200/80 shadow-xs text-xs sm:text-sm text-stone-700 leading-relaxed">
            <h2 className="text-2xl font-serif-luxury font-medium text-stone-900 pb-4 border-b border-stone-100 mb-6">
              {activePolicy}
            </h2>

            {activePolicy === 'Shipping & Delivery' && (
              <div className="space-y-4">
                <p>
                  At <strong>FOAXX</strong>, we understand that exceptional luxury garments and handcrafted jewellery deserve prompt and secure transit.
                </p>
                <div className="p-4 bg-stone-50 rounded-lg space-y-2 border border-stone-200">
                  <h4 className="font-semibold text-stone-900">Delivery Timelines:</h4>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li><strong>Metro Cities (Mumbai, Delhi, Bengaluru, Hyderabad):</strong> 2–3 business days</li>
                    <li><strong>Rest of India:</strong> 3–5 business days</li>
                    <li><strong>Free Standard Delivery:</strong> On all orders above ₹999</li>
                    <li><strong>Shipping Fee for orders under ₹999:</strong> Flat ₹99</li>
                  </ul>
                </div>
                <p>
                  Every consignment is packed in tamper-proof security enclosures and insured until handover to the customer.
                </p>
              </div>
            )}

            {activePolicy === 'Returns & Exchanges' && (
              <div className="space-y-4">
                <p>
                  We offer a <strong>7-Day No-Questions-Asked Return & Exchange Policy</strong> from the date of package delivery.
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-stone-900">Return Conditions:</h4>
                  <ul className="list-disc list-inside space-y-1 text-stone-600">
                    <li>Items must be unused, unwashed, and with all original tags attached.</li>
                    <li>Jewellery must include the original velvet keepsake box and warranty card.</li>
                    <li>Doorstep pickup is arranged at no extra cost.</li>
                    <li>Refunds are initiated directly to your original payment mode or UPI within 24 hours of warehouse receipt.</li>
                  </ul>
                </div>
              </div>
            )}

            {activePolicy === 'Jewellery Care Guide' && (
              <div className="space-y-4">
                <p>
                  Our jewellery features heavy 18K and 24K gold plating over surgical stainless steel or 925 sterling silver with an electro-clear anti-tarnish barrier.
                </p>
                <div className="p-4 bg-stone-50 rounded-lg space-y-2">
                  <h4 className="font-semibold text-stone-900">Care Rules to Maintain Lifetime Radiance:</h4>
                  <ul className="list-disc list-inside space-y-1.5 text-stone-600">
                    <li>Avoid direct contact with perfumes, hairsprays, and harsh sanitizers.</li>
                    <li>Remove rings and bracelets before swimming in chlorinated pools or spas.</li>
                    <li>Store individual pieces in the zip-lock pouches and velvet box provided.</li>
                    <li>Gently wipe with the complimentary microfiber polishing cloth after every wear.</li>
                  </ul>
                </div>
              </div>
            )}

            {activePolicy === 'Contact Us' && (
              <div className="space-y-6">
                <p>We are delighted to assist with bespoke orders, sizing questions, or styling consultations.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <Mail className="w-5 h-5 text-[#E07A5F] mb-2" />
                    <span className="font-semibold text-stone-900 block">Email Us</span>
                    <a href="mailto:foaxx.studio@gmail.com" className="text-stone-700 hover:text-amber-700 font-medium">
                      foaxx.studio@gmail.com
                    </a>
                    <span className="text-[11px] text-stone-400 block mt-1">Official Studio Mail · 2 hr reply</span>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                    <Phone className="w-5 h-5 text-[#25D366] mb-2" />
                    <span className="font-semibold text-stone-900 block">Phone & WhatsApp Support</span>
                    <a
                      href="https://wa.me/919837663372?text=Hello%20FOAXX%20Luxury%2C%20I%20have%20an%20inquiry%20regarding%20your%20products"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-900 hover:text-emerald-700 font-bold block"
                    >
                      +91 98376 63372
                    </a>
                    <span className="text-[11px] text-stone-400 block mt-1">Mon–Sun, 10 AM to 9 PM IST · Live Chat</span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <MapPin className="w-5 h-5 text-stone-800 mb-2" />
                  <span className="font-semibold text-stone-900 block">FOAXX Flagship Studio</span>
                  <span className="text-stone-700 font-medium block">
                    149 D L Rd, Dehradun, Uttarakhand 248001
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-1">Flagship Experience & Bespoke Consultations</span>
                </div>
              </div>
            )}

            {activePolicy !== 'Shipping & Delivery' &&
              activePolicy !== 'Returns & Exchanges' &&
              activePolicy !== 'Jewellery Care Guide' &&
              activePolicy !== 'Contact Us' && (
                <div className="space-y-3">
                  <p>
                    FOAXX complies with all Indian consumer protection statutes and e-commerce standards under the IT Act 2000.
                  </p>
                  <p>
                    All stones, cubic zirconia, and cultured pearls undergo strict gemological appraisal. Hallmarking and purity certifications accompany high-value bridal edits.
                  </p>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
};
