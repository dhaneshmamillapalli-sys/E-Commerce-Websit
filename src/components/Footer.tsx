import React from 'react';
import { Store, ShieldCheck, Truck, RotateCcw, Headset, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-indigo-400 border border-slate-700/80 flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-heading">Express Global Shipping</h4>
              <p className="text-xs text-slate-400 mt-0.5">Free delivery on orders over $100</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-emerald-400 border border-slate-700/80 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-heading">Secure Stripe Payments</h4>
              <p className="text-xs text-slate-400 mt-0.5">256-bit SSL encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700/80 flex items-center justify-center shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-heading">30-Day Money Back</h4>
              <p className="text-xs text-slate-400 mt-0.5">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 text-sky-400 border border-slate-700/80 flex items-center justify-center shrink-0">
              <Headset className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm font-heading">24/7 Expert Support</h4>
              <p className="text-xs text-slate-400 mt-0.5">Live chat & dedicated desk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
        {/* Brand Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 text-white flex items-center justify-center font-black">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-white font-heading">
              Apex<span className="text-indigo-400">Mart</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Enterprise e-commerce platform featuring studio-grade audio, luxury fashion, smart gadgets, and seamless Stripe payment workflows.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-semibold text-slate-300">Accepted Gateways:</span>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-900 py-1 px-2.5 rounded-lg border border-slate-800">
              <span>💳 Stripe</span>
              <span>•</span>
              <span>🔒 SSL 256-bit</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 font-heading">Shop Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('shop', { category: 'electronics' })} className="hover:text-white transition-colors">
                Electronics & Audio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'wearables' })} className="hover:text-white transition-colors">
                Smart Wearables
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'fashion' })} className="hover:text-white transition-colors">
                Fashion & Apparel
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'footwear' })} className="hover:text-white transition-colors">
                Footwear & Kicks
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'home-kitchen' })} className="hover:text-white transition-colors">
                Home & Kitchen
              </button>
            </li>
          </ul>
        </div>

        {/* Company & Support */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 font-heading">Customer Care</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                About ApexMart
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                Contact & Help Center
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('profile', { tab: 'orders' })} className="hover:text-white transition-colors">
                Track Order Status
              </button>
            </li>
            <li>
              <span className="text-slate-500 cursor-not-allowed">Privacy Policy</span>
            </li>
            <li>
              <span className="text-slate-500 cursor-not-allowed">Terms of Service</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-white text-sm mb-4 font-heading">Stay Connected</h4>
          <p className="text-xs text-slate-400 mb-3">
            Subscribe to get $20 off your first order plus secret flash deal access.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 ApexMart Inc. Built with MERN Stack & Production Architecture.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for College Placements & Enterprise Portfolios.
        </p>
      </div>
    </footer>
  );
};
