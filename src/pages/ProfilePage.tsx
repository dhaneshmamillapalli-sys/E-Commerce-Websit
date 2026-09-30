import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { Order, Product } from '../types/index.js';
import API from '../services/api.js';
import { ProductCard } from '../components/ProductCard.js';
import {
  User as UserIcon,
  Package,
  Heart,
  ShieldCheck,
  Phone,
  Mail,
  Camera,
  ExternalLink,
  Clock,
} from 'lucide-react';

interface ProfilePageProps {
  initialTab?: 'account' | 'orders' | 'wishlist';
  onNavigate: (page: string, params?: any) => void;
  onQuickView: (product: Product) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  initialTab = 'account',
  onNavigate,
  onQuickView,
}) => {
  const { user, updateProfile } = useAuth();
  const { wishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'account' | 'orders' | 'wishlist'>(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAvatar(user.avatar || '');
      fetchUserOrders();
    }
  }, [user]);

  const fetchUserOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await API.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ name, phone, avatar });
    setIsSaving(false);
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border text-center">
        <p className="text-xs font-bold text-slate-500 mb-4">Please sign in to view your profile and order history.</p>
      </div>
    );
  }

  return (
    <div id="profile-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center gap-6 shadow-xl">
        <img
          src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
          alt={user.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md"
        />

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-black">{user.name}</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold uppercase">
              {user.role}
            </span>
          </div>
          <p className="text-xs text-slate-400">{user.email}</p>
          <p className="text-[11px] text-slate-500">Member since {new Date(user.createdAt).getFullYear()}</p>
        </div>

        {user.role === 'ADMIN' && (
          <button
            onClick={() => onNavigate('admin')}
            className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:bg-amber-400 shadow-lg shadow-amber-500/20 transition-all"
          >
            <ShieldCheck className="w-4 h-4" /> Go to Admin Dashboard
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'account'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" /> Account Details
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" /> Saved Wishlist ({wishlist.length})
        </button>
      </div>

      {/* Tab Content: Account */}
      {activeTab === 'account' && (
        <form onSubmit={handleProfileSave} className="max-w-2xl p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
            Edit Personal Profile
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md"
          >
            {isSaving ? 'Saving Changes...' : 'Update Account Info'}
          </button>
        </form>
      )}

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">No orders placed yet.</p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              {orders.map((ord) => (
                <div key={ord.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{ord.id}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                        {ord.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.items.length} Items
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-black text-sm text-slate-900 dark:text-white">
                      ${ord.totalPrice.toFixed(2)}
                    </span>
                    <button
                      onClick={() => onNavigate('track-order', { id: ord.id })}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 flex items-center gap-1.5"
                    >
                      Track Order <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlist.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 mb-2">Your wishlist is empty.</p>
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onQuickView={onQuickView}
                  onSelectProduct={(p) => onNavigate('product-detail', { id: p.id })}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
