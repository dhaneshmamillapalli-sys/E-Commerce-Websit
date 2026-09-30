import React, { useState, useEffect } from 'react';
import { Order } from '../types/index.js';
import API from '../services/api.js';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Printer,
  ArrowLeft,
  FileText,
} from 'lucide-react';

interface OrderTrackingPageProps {
  orderId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderId,
  onNavigate,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 text-center text-slate-400">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <h3 className="font-bold">Order Not Found</h3>
        <button
          onClick={() => onNavigate('profile', { tab: 'orders' })}
          className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          View All Orders
        </button>
      </div>
    );
  }

  const milestones = [
    { key: 'Processing', label: 'Order Confirmed', icon: CheckCircle2, done: true },
    { key: 'Shipped', label: 'In Transit', icon: Truck, done: order.status === 'Shipped' || order.status === 'Out for Delivery' || order.status === 'Delivered' },
    { key: 'Out for Delivery', label: 'Out for Delivery', icon: MapPin, done: order.status === 'Out for Delivery' || order.status === 'Delivered' },
    { key: 'Delivered', label: 'Delivered', icon: Package, done: order.status === 'Delivered' },
  ];

  return (
    <div id="order-tracking-page" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={() => onNavigate('profile', { tab: 'orders' })}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </button>

        <button
          onClick={handlePrintInvoice}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold text-xs flex items-center gap-2 hover:opacity-90"
        >
          <Printer className="w-4 h-4" /> Print PDF Invoice
        </button>
      </div>

      {/* Main Order Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              Live Shipment Tracking
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Order #{order.id}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Tracking Number: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{order.trackingNumber}</span>
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200/60 dark:border-indigo-800/60 text-right">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">
              Estimated Delivery
            </span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              {new Date(order.estimatedDelivery).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Milestones Tracker */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
          {milestones.map((m, idx) => {
            const IconComponent = m.icon;
            return (
              <div
                key={m.key}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 ${
                  m.done
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300'
                    : 'border-slate-200 dark:border-slate-800 text-slate-400'
                }`}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs font-bold">{m.label}</span>
              </div>
            );
          })}
        </div>

        {/* Items Breakdown */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
            Purchased Items
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-slate-400">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          {order.discountPrice > 0 && (
            <div className="flex justify-between text-emerald-600 font-bold">
              <span>Discount</span>
              <span>-${order.discountPrice.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700 font-black text-sm text-slate-900 dark:text-white">
            <span>Total Paid</span>
            <span className="text-indigo-600 dark:text-indigo-400">${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
