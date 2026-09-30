import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useTheme } from '../context/ThemeContext.js';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Moon,
  Sun,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Store,
} from 'lucide-react';
import API from '../services/api.js';
import { Product } from '../types/index.js';

interface NavbarProps {
  onNavigate: (page: string, params?: any) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, openAuthModal } = useAuth();
  const { totalCartItemsCount, setIsCartDrawerOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await API.get('/products', { params: { search: searchQuery, limit: 5 } });
        setSearchResults(res.data.products || []);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    if (searchQuery.trim()) {
      onNavigate('shop', { search: searchQuery });
    }
  };

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      {/* Top Banner Announcement */}
      <div className="bg-slate-900 dark:bg-slate-950 text-slate-200 py-1.5 px-4 text-center text-xs font-semibold tracking-wide flex items-center justify-center gap-2 border-b border-slate-800">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
        <span>PROMO: Use Code <strong className="text-white underline decoration-indigo-400">APEX20</strong> for 20% OFF | Free Worldwide Express Delivery over $100</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div
            id="nav-logo"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1 font-heading">
                Apex<span className="text-indigo-600 dark:text-indigo-400">Mart</span>
              </span>
              <span className="block text-[9px] text-slate-400 uppercase tracking-widest -mt-1 font-extrabold">
                Enterprise Platform
              </span>
            </div>
          </div>

          {/* Search Bar & Auto-Complete */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                id="search-input"
                type="text"
                placeholder="Search products, brands, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
              />
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div
                id="search-autocomplete-dropdown"
                className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in"
              >
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400">Searching catalog...</div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery('');
                          onNavigate('product-detail', { id: item.id });
                        }}
                        className="p-3 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setShowSearchDropdown(false);
                        onNavigate('shop', { search: searchQuery });
                      }}
                      className="w-full p-2.5 text-center text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-800/50 hover:underline"
                    >
                      View all results for "{searchQuery}" →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No products matching "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                currentPage === 'home' ? 'text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                currentPage === 'shop' ? 'text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Shop Catalog
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                currentPage === 'about' ? 'text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              About
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
                currentPage === 'contact' ? 'text-indigo-600 dark:text-indigo-400' : ''
              }`}
            >
              Contact Support
            </button>
          </nav>

          {/* Actions & Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              id="btn-toggle-theme"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist Button */}
            <button
              id="btn-nav-wishlist"
              onClick={() => onNavigate('profile', { tab: 'wishlist' })}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Button */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {totalCartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-user-dropdown"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block mr-1" />
                </button>

                {isUserMenuOpen && (
                  <div
                    id="user-menu-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 p-2 animate-in fade-in"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-extrabold text-slate-900 dark:text-slate-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase">
                        {user.role} Account
                      </span>
                    </div>

                    <div className="py-1">
                      {user.role === 'ADMIN' && (
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" /> Admin Analytics Suite
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('profile', { tab: 'orders' });
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <Package className="w-4 h-4" /> Order History
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigate('profile', { tab: 'account' });
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <UserIcon className="w-4 h-4" /> Profile & Settings
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="btn-nav-login"
                onClick={() => openAuthModal('login')}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" /> Sign In
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Quick Category Navigation Bar */}
        <div className="hidden sm:block border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40 py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold mr-2">
              <span>Categories:</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap">
              <button
                onClick={() => onNavigate('shop', { category: 'mobile-accessories' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>⚡ Mobile Accessories</span>
              </button>
              <button
                onClick={() => onNavigate('shop', { category: 'electronics' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>🎧 Audio & Electronics</span>
              </button>
              <button
                onClick={() => onNavigate('shop', { category: 'smartphones' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>📱 Smartphones & Laptops</span>
              </button>
              <button
                onClick={() => onNavigate('shop', { category: 'wearables' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>⌚ Smart Wearables</span>
              </button>
              <button
                onClick={() => onNavigate('shop', { category: 'fashion' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>👔 Fashion & Apparel</span>
              </button>
              <button
                onClick={() => onNavigate('shop', { category: 'footwear' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>👟 Footwear & Kicks</span>
              </button>
              <button
                onClick={() => onNavigate('shop', { category: 'home-kitchen' })}
                className="px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white transition-all flex items-center gap-1.5"
              >
                <span>🏠 Home & Living</span>
              </button>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 text-[11px] font-black pl-2"
            >
              All Products →
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 pb-6">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 mb-2"
            />
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('home');
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              Home
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('shop');
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              Shop Catalog
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('about');
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              About
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onNavigate('contact');
              }}
              className="block w-full text-left py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              Contact
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
