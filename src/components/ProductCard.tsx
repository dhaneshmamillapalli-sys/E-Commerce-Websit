import React from 'react';
import { Product } from '../types/index.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onSelectProduct?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isLiked = isInWishlist(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full card-hover-effect"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discountPercent > 0 && (
          <span className="px-2.5 py-1 text-[11px] font-extrabold rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs">
            -{discountPercent}%
          </span>
        )}
        {product.isBestSeller && (
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-amber-400 text-slate-950 shadow-xs border border-amber-300">
            Best Seller
          </span>
        )}
        {product.isNewArrival && (
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-indigo-600 text-white shadow-xs">
            New
          </span>
        )}
      </div>

      {/* Wishlist Action Button */}
      <button
        id={`btn-wishlist-${product.id}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleWishlist(product);
        }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-950/80 backdrop-blur-md text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-400 shadow-sm transition-transform active:scale-95 border border-slate-100 dark:border-slate-800"
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Product Image Stage */}
      <div
        className="relative w-full aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950 cursor-pointer"
        onClick={() => onSelectProduct && onSelectProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Quick View Overlay Button */}
        {onQuickView && (
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
            <button
              id={`btn-quickview-${product.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onQuickView(product);
              }}
              className="px-4 py-2 rounded-xl bg-slate-900/90 dark:bg-slate-900/95 text-white font-bold text-xs shadow-lg flex items-center gap-2 hover:bg-indigo-600 transition-colors border border-slate-700"
            >
              <Eye className="w-3.5 h-3.5" /> Quick View
            </button>
          </div>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="uppercase font-bold tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">{product.category}</span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">{product.brand}</span>
        </div>

        <h3
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer mb-2 font-heading"
        >
          {product.name}
        </h3>

        {/* Rating Breakdown */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center text-amber-400">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{product.rating}</span>
          <span className="text-xs text-slate-400 dark:text-slate-500">({product.numReviews})</span>
        </div>

        {/* Price & Action Button Footer */}
        <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900 dark:text-slate-100 font-heading">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              product.stock > 0
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs active:scale-95'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-800 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? 'Add to cart' : 'Out of Stock'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
