import React, { useState } from 'react';
import { Bell, Camera, ChevronRight, Gift, Sparkles, Star, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const DeliveryReviewReminder: React.FC = () => {
  const { pendingReviewItems, openReviewModal, currentView } = useStore();
  const [isDismissedTemporarily, setIsDismissedTemporarily] = useState(false);

  // If no pending items or user is in admin mode, do not show
  if (pendingReviewItems.length === 0 || isDismissedTemporarily || currentView === 'admin') {
    return null;
  }

  const firstPending = pendingReviewItems[0];
  const totalPending = pendingReviewItems.length;

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm sm:max-w-md w-[calc(100%-2rem)] animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-[#1C1917] text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-stone-700/80 backdrop-blur-md relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E07A5F]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex items-start gap-3">
          {/* Product Thumbnail with delivered check */}
          <div className="relative shrink-0">
            <img
              src={firstPending.product.image}
              alt={firstPending.product.name}
              className="w-12 h-14 sm:w-14 sm:h-16 object-cover rounded-lg border border-stone-700"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow-xs">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Text and Actions */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E07A5F] flex items-center gap-1">
                <Bell className="w-3 h-3 animate-bounce" />
                <span>Delivery Feedback Reminder {totalPending > 1 ? `(${totalPending} pending)` : ''}</span>
              </span>
              <button
                onClick={() => setIsDismissedTemporarily(true)}
                className="text-stone-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
                title="Remind me later"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs font-semibold text-white truncate">
              How do you like your {firstPending.product.name}?
            </p>
            <p className="text-[11px] text-stone-300 line-clamp-1 mt-0.5">
              Upload real photos & share your review to earn 100 FOAXX coins!
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-2.5">
              <button
                onClick={() => openReviewModal(firstPending.product, firstPending.order.id)}
                className="bg-[#E07A5F] hover:bg-[#c96a51] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Camera className="w-3 h-3" />
                <span>Review & Add Photo</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setIsDismissedTemporarily(true)}
                className="text-stone-400 hover:text-stone-200 text-[10px] font-medium transition-colors cursor-pointer px-1 py-1"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
