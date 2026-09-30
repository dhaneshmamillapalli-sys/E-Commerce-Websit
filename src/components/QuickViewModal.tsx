import React, { useState } from 'react';
import { Product } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { X, Star, ShoppingBag, Heart, Check, Truck, ShieldCheck } from 'lucide-react';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onGoToDetail?: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onGoToDetail,
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState<number>(1);

  const isLiked = isInWishlist(product.id);

  return (
    <div id="quickview-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div
        id="quickview-modal-card"
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          id="btn-close-quickview"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Column */}
        <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col items-center justify-center">
          <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-800 mb-4 shadow-sm">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Image Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto w-full pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === img
                    ? 'border-indigo-600 dark:border-indigo-500 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <div className="mb-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {product.brand}
            </span>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mb-3 leading-snug">
            {product.name}
          </h2>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{product.rating}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">({product.numReviews} customer reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock & Quantity Control */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 py-1 text-xs font-bold text-slate-900 dark:text-slate-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <span className={`text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-6">
            <button
              id="btn-modal-add-cart"
              onClick={() => {
                addToCart(product, quantity);
                onClose();
              }}
              disabled={product.stock <= 0}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart (${(product.price * quantity).toFixed(2)})
            </button>

            <button
              id="btn-modal-wishlist"
              onClick={() => toggleWishlist(product)}
              className={`p-3 rounded-xl border transition-colors ${
                isLiked
                  ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-500'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-rose-500 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-auto border-t border-slate-100 dark:border-slate-800 pt-4 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Free delivery over $100</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>2 Year Apex Guarantee</span>
            </div>
          </div>

          {onGoToDetail && (
            <button
              id="btn-view-full-details"
              onClick={() => {
                onClose();
                onGoToDetail(product);
              }}
              className="mt-4 text-center text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              View Full Product Specifications & Reviews →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
