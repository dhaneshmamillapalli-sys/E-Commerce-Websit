import React, { useState } from 'react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import API from '../services/api.js';
import { ShippingAddress, Order } from '../types/index.js';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PackageCheck,
  FileText,
} from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const {
    cart,
    itemsPrice,
    discountPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    clearCart,
  } = useCart();

  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  // Form State
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.name || '',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    postalCode: '97477',
    country: 'United States',
    phone: user?.phone || '+1 (555) 019-2834',
  });

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('stripe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (cart.length === 0 && !completedOrder) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Authentication Required', 'Please sign in to complete checkout.', 'info');
      openAuthModal('login');
      return;
    }

    try {
      setIsProcessing(true);

      // Simulate Stripe intent creation call
      await API.post('/payment/create-intent', { amount: totalPrice });

      // Create Order
      const res = await API.post('/orders', {
        items: cart.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0],
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod === 'stripe' ? 'Credit Card (Stripe)' : 'Cash on Delivery',
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        totalPrice,
      });

      setCompletedOrder(res.data.order);
      clearCart();
      showToast('Order Placed Successfully!', `Order ID: ${res.data.order.id}`, 'success');
    } catch (err: any) {
      showToast('Order Failed', err.response?.data?.message || 'Payment processing error.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Success Screen
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-8 sm:p-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Payment Confirmed
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
            Thank You For Your Order!
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Order Confirmation ID: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{completedOrder.id}</strong>
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-left text-xs space-y-3">
          <div className="flex justify-between font-bold text-slate-900 dark:text-white border-b pb-2 border-slate-200 dark:border-slate-700">
            <span>Shipping Address</span>
            <span>Total Paid: ${completedOrder.totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300">
            {completedOrder.shippingAddress.fullName}<br />
            {completedOrder.shippingAddress.address}, {completedOrder.shippingAddress.city}<br />
            {completedOrder.shippingAddress.postalCode}, {completedOrder.shippingAddress.country}
          </p>
          <p className="text-slate-500">
            Tracking Number: <span className="font-mono text-slate-900 dark:text-white font-bold">{completedOrder.trackingNumber}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate('track-order', { id: completedOrder.id })}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <PackageCheck className="w-4 h-4" /> Track Package Live
          </button>

          <button
            onClick={() => onNavigate('shop')}
            className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">Secure Checkout</h1>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-emerald-500" /> 256-Bit Encrypted Stripe Payment Gateway
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1 & 2: Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" /> 1. Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-600" /> 2. Stripe Payment Gateway
            </h3>

            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Credit Card (Simulated Stripe Intent)
                </span>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded font-bold uppercase">
                  Active
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-sm h-fit">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b pb-3 border-slate-100 dark:border-slate-800">
            Order Summary ({cart.reduce((a, b) => a + b.quantity, 0)} Items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">
                    {item.product.name}
                  </p>
                  <p className="text-slate-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Items Total</span>
              <span className="font-bold text-slate-900 dark:text-white">${itemsPrice.toFixed(2)}</span>
            </div>
            {discountPrice > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Promo Discount</span>
                <span>-${discountPrice.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Shipping Charge</span>
              <span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Estimated Tax (8%)</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-base font-black text-slate-900 dark:text-white font-heading">
              <span>Grand Total</span>
              <span className="text-slate-900 dark:text-white font-heading">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            id="btn-place-order"
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all"
          >
            {isProcessing ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white dark:border-slate-900 border-t-transparent"></span>
            ) : (
              <>
                Confirm & Pay ${totalPrice.toFixed(2)} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
