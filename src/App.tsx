import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext.js';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { WishlistProvider } from './context/WishlistContext.js';

import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { ToastContainer } from './components/Toast.js';
import { AuthModal } from './components/AuthModal.js';
import { CartDrawer } from './components/CartDrawer.js';
import { QuickViewModal } from './components/QuickViewModal.js';

import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductDetailPage } from './pages/ProductDetailPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderTrackingPage } from './pages/OrderTrackingPage.js';
import { ProfilePage } from './pages/ProfilePage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { NotFoundPage } from './pages/NotFoundPage.js';

import { Product, FilterParams } from './types/index.js';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomePage
            onNavigate={handleNavigate}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        );
      case 'shop':
        return (
          <ShopPage
            onNavigate={handleNavigate}
            onQuickView={(prod) => setQuickViewProduct(prod)}
            initialParams={pageParams as FilterParams}
          />
        );
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={pageParams.id || 'prod-101'}
            onNavigate={handleNavigate}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        );
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'track-order':
        return (
          <OrderTrackingPage
            orderId={pageParams.id || 'ORD-849201'}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            initialTab={pageParams.tab || 'account'}
            onNavigate={handleNavigate}
            onQuickView={(prod) => setQuickViewProduct(prod)}
          />
        );
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <NotFoundPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={handleNavigate} />

      {/* Global Overlays */}
      <CartDrawer
        onNavigateCheckout={() => handleNavigate('checkout')}
        onNavigateShop={() => handleNavigate('shop')}
      />

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onGoToDetail={(prod) => handleNavigate('product-detail', { id: prod.id })}
      />

      <AuthModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </ToastProvider>
  );
}
