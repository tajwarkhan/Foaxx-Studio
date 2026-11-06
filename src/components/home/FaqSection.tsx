import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const FaqSection: React.FC = () => {
  const { faqs, setActivePolicy, setCurrentView } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqList = faqs && faqs.length > 0 ? faqs : [];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white py-14 sm:py-20">
      <div className="max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-[#E07A5F] uppercase tracking-[0.25em] font-serif-luxury block mb-1.5">
            Transparent Answers
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif-luxury font-medium text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 font-normal">
            Everything you need to know about our finishes, delivery, and guarantees.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqList.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.id || idx}
                className="border border-stone-200 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-white hover:bg-stone-50/80 transition-colors cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-stone-900' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/40">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Bar */}
        <div className="mt-10 p-5 bg-[#FAF7F2] rounded-xl border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-stone-900">
              Need personal styling or sizing advice?
            </h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Our Dehradun studio concierge is ready to assist via phone (+91 98376 63372) or email (foaxx.studio@gmail.com).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setActivePolicy('Contact Us');
              setCurrentView('policy');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-stone-900 hover:bg-black text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors whitespace-nowrap cursor-pointer uppercase tracking-wider"
          >
            Chat with Concierge
          </button>
        </div>
      </div>
    </section>
  );
};
