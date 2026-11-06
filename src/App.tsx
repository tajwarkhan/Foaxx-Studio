import React from 'react';
import { AccountDashboard } from './components/account/AccountDashboard';
import { InvoiceModal } from './components/account/InvoiceModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { Footer } from './components/common/Footer';
import { Header } from './components/common/Header';
import { PolicyPage } from './components/common/PolicyPage';
import { QuickViewModal } from './components/common/QuickViewModal';
import { SearchModal } from './components/common/SearchModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { ToastContainer } from './components/common/ToastContainer';
import { DeliveryReviewReminder } from './components/common/DeliveryReviewReminder';
import { WhatsAppFloatingButton } from './components/common/WhatsAppFloatingButton';
import { WriteReviewModal } from './components/product/WriteReviewModal';
import { BenefitsStrip } from './components/home/BenefitsStrip';
import { CategoryStrip } from './components/home/CategoryStrip';
import { CollectionBanners } from './components/home/CollectionBanners';
import { CraftsmanshipStory } from './components/home/CraftsmanshipStory';
import { CustomerMuses } from './components/home/CustomerMuses';
import { FaqSection } from './components/home/FaqSection';
import { FestivePicksSection } from './components/home/FestivePicksSection';
import { FlashDealsSection } from './components/home/FlashDealsSection';
import { OccasionSaleBanner } from './components/home/OccasionSaleBanner';
import { HeroBanner } from './components/home/HeroBanner';
import { NewArrivals } from './components/home/NewArrivals';
import { ShopByOccasion } from './components/home/ShopByOccasion';
import { ShopTheLook } from './components/home/ShopTheLook';
import { ProductDetailPage } from './components/product/ProductDetailPage';
import { ShopPage } from './components/shop/ShopPage';
import { WishlistPage } from './components/wishlist/WishlistPage';
import { AuthPage } from './components/auth/AuthPage';
import { ProductShareModal } from './components/product/ProductShareModal';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { StoreProvider, useStore } from './context/StoreContext';

const MainContent: React.FC = () => {
  const { currentView, isShareModalOpen, shareProduct, closeShareModal } = useStore();

  if (currentView === 'admin') {
    return (
      <main className="min-h-screen">
        <AdminPanel />
      </main>
    );
  }

  if (currentView === 'manager') {
    return (
      <main className="min-h-screen">
        <ManagerDashboard />
      </main>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {currentView === 'home' && (
          <>
            {/* EXACT HOMEPAGE SECTIONS IN STRICT SEQUENCE */}
            {/* 1. Hero Editorial Banner */}
            <HeroBanner />

            {/* 2. Ten-Category Image Strip */}
            <CategoryStrip />

            {/* 3. Four-Item Trust & Benefits Strip */}
            <BenefitsStrip />

            {/* 3.2. Festive & Occasion Grand Sale Banner (Admin-Managed with Live Deals) */}
            <OccasionSaleBanner />

            {/* 3.5. Flash Deals / Limited Time Offer Perforated Ticket Banners */}
            <FlashDealsSection />

            {/* 4. New Arrivals Section with 8 Product Cards in 1 row */}
            <NewArrivals />

            {/* 5. Three Side-by-Side Bottom Collection Banners */}
            <CollectionBanners />

            {/* 5.5. Dazzling Festive Picks Carousel (Right Before Shop by Occasion) */}
            <FestivePicksSection />

            {/* EXTENDED STRUCTURED HOMEPAGE SECTIONS */}
            {/* 6. Shop by Occasion Curated Tabs */}
            <ShopByOccasion />

            {/* 7. The Signature Lookbook / Shop The Full Look Bundle */}
            <ShopTheLook />

            {/* 8. Craftsmanship & Purity Guarantee Story */}
            <CraftsmanshipStory />

            {/* 9. Seen on Our Muses / Client Testimonials */}
            <CustomerMuses />

            {/* 10. Frequently Asked Questions & Studio Concierge */}
            <FaqSection />
          </>
        )}

        {currentView === 'shop' && <ShopPage />}
        {currentView === 'product' && <ProductDetailPage />}
        {currentView === 'wishlist' && <WishlistPage />}
        {currentView === 'checkout' && <CheckoutPage />}
        {(currentView === 'account' || currentView === 'tracking') && <AccountDashboard />}
        {currentView === 'policy' && <PolicyPage />}
        {currentView === 'auth' && <AuthPage />}
      </main>

      <Footer />
      <WhatsAppFloatingButton />
      <CartDrawer />
      <AuthModal />
      <ToastContainer />

      {/* Global Luxury Modals */}
      <QuickViewModal />
      <SizeGuideModal />
      <InvoiceModal />
      <SearchModal />
      <WriteReviewModal />
      <DeliveryReviewReminder />
      <ProductShareModal
        product={shareProduct}
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
