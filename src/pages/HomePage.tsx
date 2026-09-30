import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types/index.js';
import API from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import { ProductCardSkeleton } from '../components/SkeletonLoader.js';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ChevronRight,
  TrendingUp,
  Award,
  Zap,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Countdown timer for Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 45 });

  useEffect(() => {
    fetchHomeData();

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get('/products', { params: { featured: 'true', limit: 8 } }),
        API.get('/categories'),
      ]);
      setFeaturedProducts(prodRes.data.products || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="home-page" className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-12 pb-20 rounded-b-[2.5rem] lg:rounded-b-[3.5rem] shadow-2xl border-b border-slate-800">
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-slate-800/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-extrabold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>SPRING 2026 ENTERPRISE COLLECTION</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-heading">
                Next-Gen Tech & <br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  Lifestyle Essentials
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Elevate your everyday performance with studio-grade wireless noise-cancelling headphones, titanium smartwatch trackers, mechanical gaming setups, and luxury fashion.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="btn-hero-shop-now"
                  onClick={() => onNavigate('shop')}
                  className="px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm hover:bg-slate-100 shadow-xl flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                  Explore Catalog <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-special-offers"
                  onClick={() => onNavigate('shop', { category: 'electronics' })}
                  className="px-6 py-4 rounded-2xl bg-slate-900 text-slate-200 font-bold text-sm hover:bg-slate-800 border border-slate-700/80 transition-colors"
                >
                  View Featured Audio
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800 text-slate-400 text-xs">
                <div>
                  <span className="block font-black text-white text-lg font-heading">100%</span>
                  <span>Authentic Quality</span>
                </div>
                <div>
                  <span className="block font-black text-white text-lg font-heading">24/7</span>
                  <span>Customer Support</span>
                </div>
                <div>
                  <span className="block font-black text-white text-lg font-heading">4.9★</span>
                  <span>Over 10k Reviews</span>
                </div>
              </div>
            </div>

            {/* Featured Showcase Graphic */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900/90 group">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                  alt="ApexPro Headphones"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Top Rated Deal</span>
                    <h4 className="font-bold text-sm font-heading">ApexPro SoundCancel ANC</h4>
                    <p className="text-xs text-slate-300">$249.99 <span className="line-through text-slate-400">$299.99</span></p>
                  </div>
                  <button
                    onClick={() => onNavigate('product-detail', { id: 'prod-101' })}
                    className="p-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors"
                  >
                    View Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Carousel / Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Shop By Category
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View All Categories <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.slug })}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 aspect-[4/5] shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-extrabold text-xs sm:text-sm line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-slate-300 font-medium">
                  {cat.itemCount} items
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Flash Sale Banner with Ticking Clock */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 dark:bg-slate-950 text-white shadow-xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-xs font-extrabold text-amber-400 border border-slate-700">
              <Zap className="w-3.5 h-3.5 fill-current" /> LIMITED TIME FLASH DEAL
            </div>
            <h3 className="text-2xl sm:text-4xl font-black font-heading tracking-tight">
              Save Up To 50% Off Top Premium Tech
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Use promo code <strong className="bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">FLASH50</strong> at checkout on eligible orders over $300.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="z-10 flex items-center gap-3 shrink-0">
            <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 min-w-[68px]">
              <span className="text-xl sm:text-3xl font-black text-white font-heading">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Hours</span>
            </div>
            <span className="text-2xl font-black text-slate-500">:</span>
            <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 min-w-[68px]">
              <span className="text-xl sm:text-3xl font-black text-white font-heading">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Mins</span>
            </div>
            <span className="text-2xl font-black text-slate-500">:</span>
            <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 min-w-[68px]">
              <span className="text-xl sm:text-3xl font-black text-white font-heading">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Accessories Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Power & MagSafe */}
          <div
            onClick={() => onNavigate('shop', { category: 'mobile-accessories' })}
            className="group relative rounded-3xl p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-800 shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 group-hover:opacity-40 transition-opacity pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1622445268465-843d31216ace?w=800&q=80"
                alt="MagSafe Accessories"
                className="w-full h-full object-cover rounded-l-3xl"
              />
            </div>
            <div className="relative z-10 space-y-3 max-w-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/80 border border-indigo-800/60 px-3 py-1 rounded-full inline-block">
                MagSafe & Fast Power
              </span>
              <h3 className="text-2xl font-black font-heading leading-tight group-hover:text-amber-300 transition-colors">
                Magnetic Power Banks & 3-in-1 Docks
              </h3>
              <p className="text-xs text-slate-300">
                15W fast wireless charging, 240W Kevlar cables, and aircraft aluminum stands.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">
                <span>Shop Mobile Accessories</span> <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: GaN Chargers & Audio */}
          <div
            onClick={() => onNavigate('shop', { category: 'electronics' })}
            className="group relative rounded-3xl p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white border border-slate-800 shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl"
          >
            <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-30 group-hover:opacity-40 transition-opacity pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80"
                alt="GaN Fast Chargers"
                className="w-full h-full object-cover rounded-l-3xl"
              />
            </div>
            <div className="relative z-10 space-y-3 max-w-xs">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-3 py-1 rounded-full inline-block">
                Studio Electronics
              </span>
              <h3 className="text-2xl font-black font-heading leading-tight group-hover:text-emerald-300 transition-colors">
                100W GaN Chargers & 4K Webcams
              </h3>
              <p className="text-xs text-slate-300">
                Next-gen Gallium Nitride power blocks, IP67 waterproof speakers, and 32-bit audio DACs.
              </p>
              <div className="pt-2 flex items-center gap-1 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                <span>Explore Electronics</span> <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Handpicked Deals
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Featured Products
            </h2>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Explore Full Shop →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onSelectProduct={(p) => onNavigate('product-detail', { id: p.id })}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
