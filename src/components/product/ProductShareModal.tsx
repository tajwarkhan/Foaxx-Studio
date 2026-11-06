import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Send,
  Twitter,
  Sparkles,
  Coins,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

interface ProductShareModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductShareModal: React.FC<ProductShareModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { coinWallet, earnCoins, showToast } = useStore();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const referralCode = coinWallet.referralCode || 'FOAXX-VIP10';
  const shareUrl = `${window.location.origin}/?product=${product.id}&ref=${referralCode}`;

  // WhatsApp formatted luxury preview message
  const whatsappMessage = `✨ *FOAXX LUXURY ATELIER* ✨
Hey! I thought you'd fall in love with this:

💎 *${product.name}*
🏷️ Category: ${product.category}${product.subCategory ? ` · ${product.subCategory}` : ''}
💰 Special Price: *₹${product.price.toLocaleString('en-IN')}* ${product.originalPrice ? `~(₹${product.originalPrice.toLocaleString('en-IN')})~` : ''} ${product.discount ? `(${product.discount})` : ''}
⭐ Rating: ${product.rating || '4.9'} / 5.0 (Handcrafted Luxury)

🛍️ *Click to Buy / View Details:*
${shareUrl}

Use my VIP code *${referralCode}* at checkout for exclusive festive privileges!`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareUrl}\n\nUse Code: ${referralCode}`);
      setCopied(true);
      showToast('Exclusive referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Failed to copy. Please copy manually.', 'error');
    }
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(waUrl, '_blank');
    showToast('Opening WhatsApp...');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
      `Check out ${product.name} on FOAXX Luxury! Special Price: ₹${product.price}`
    )}`;
    window.open(tgUrl, '_blank');
  };

  const handleTwitterShare = () => {
    const tweetText = `Obsessed with ${product.name} from @FOAXX_Luxury! Handcrafted perfection in ${product.category}. ✨`;
    const twUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twUrl, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FOAXX Luxury: ${product.name}`,
          text: whatsappMessage,
          url: shareUrl,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  // Test simulation helper for friend buy
  const handleSimulateFriendBuy = () => {
    earnCoins(100, `Friend Referral Purchase: ${product.name}`, product.id);
    showToast(
      `🎉 Simulated Friend Purchase! 100 FOAXX Coins (₹25 value) credited to your wallet!`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-lg bg-[#141210] border border-[#d4af37]/30 text-white rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-white/10 bg-gradient-to-r from-[#1c1917] via-[#241f1a] to-[#1c1917]">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close Share Modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-[#d4af37] text-xs font-semibold tracking-widest uppercase mb-1">
            <Share2 className="w-4 h-4" />
            <span>Share & Earn Rewards</span>
          </div>
          <h3 className="text-xl font-serif font-bold text-white tracking-wide">
            Share this Masterpiece
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Share with friends & receive <strong className="text-[#d4af37]">100 FOAXX Coins (₹25)</strong> automatically when they make a purchase.
          </p>
        </div>

        <div className="p-6 space-y-5">
          {/* Product Mini Preview Card */}
          <div className="flex gap-4 p-3 rounded-xl bg-stone-900/80 border border-stone-800">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover rounded-lg border border-stone-700 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-semibold">
                {product.category}
              </span>
              <h4 className="text-sm font-serif font-bold text-white truncate">
                {product.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-base font-bold text-white">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
                {product.discount && (
                  <span className="text-[10px] bg-red-900/60 text-red-200 border border-red-800 px-1.5 py-0.5 rounded font-medium">
                    {product.discount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-400">
                <span>★ {product.rating || '4.9'}</span>
                <span className="text-stone-400">({product.reviewCount || 42} reviews)</span>
              </div>
            </div>
          </div>

          {/* Referral Reward Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-amber-950/40 border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-200">Your Referral VIP Code</div>
                <div className="text-xs font-mono font-bold text-white tracking-wider">{referralCode}</div>
              </div>
            </div>
            <span className="text-[11px] font-semibold bg-[#d4af37]/20 text-[#d4af37] px-2.5 py-1 rounded-full border border-[#d4af37]/40">
              +100 Coins / Sale
            </span>
          </div>

          {/* Primary Action: WhatsApp Direct Share */}
          <div>
            <label className="block text-xs font-medium text-stone-300 uppercase tracking-wider mb-2">
              Instant Share Options
            </label>
            <button
              onClick={handleWhatsAppShare}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Share to WhatsApp</span>
            </button>
          </div>

          {/* Other Share Channels */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Copy className="w-5 h-5 text-stone-300" />
              )}
              <span className="text-[10px] text-stone-300">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleTelegramShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors"
            >
              <Send className="w-5 h-5 text-[#229ED9]" />
              <span className="text-[10px] text-stone-300">Telegram</span>
            </button>

            <button
              onClick={handleTwitterShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors"
            >
              <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              <span className="text-[10px] text-stone-300">Twitter / X</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 transition-colors"
            >
              <Share2 className="w-5 h-5 text-stone-300" />
              <span className="text-[10px] text-stone-300">More Apps</span>
            </button>
          </div>

          {/* Simulation / Testing helper for Friend Buy */}
          <div className="pt-3 border-t border-stone-800">
            <div className="p-3 rounded-lg bg-stone-900/60 border border-dashed border-stone-700 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-stone-300 block">
                  Simulate Friend Buy (+100 Coins)
                </span>
                <span className="text-[10px] text-stone-400">
                  Test the +100 FOAXX Coin referral reward right now.
                </span>
              </div>
              <button
                onClick={handleSimulateFriendBuy}
                className="px-3 py-1.5 bg-[#d4af37]/20 hover:bg-[#d4af37]/30 text-[#d4af37] border border-[#d4af37]/40 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test Buy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
