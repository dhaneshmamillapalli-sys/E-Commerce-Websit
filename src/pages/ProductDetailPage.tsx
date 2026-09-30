import React, { useState, useEffect } from 'react';
import { Product, ProductReview } from '../types/index.js';
import API from '../services/api.js';
import { useCart } from '../context/CartContext.js';
import { useWishlist } from '../context/WishlistContext.js';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../context/ToastContext.js';
import { ProductCard } from '../components/ProductCard.js';
import { ProductCardSkeleton } from '../components/SkeletonLoader.js';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  MessageSquare,
  Send,
  ArrowLeft,
  Check,
} from 'lucide-react';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, params?: any) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onNavigate,
  onQuickView,
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Review Form state
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, openAuthModal } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${productId}`);
      setProduct(res.data.product);
      setRelatedProducts(res.data.relatedProducts || []);
      if (res.data.product?.images?.length) {
        setSelectedImage(res.data.product.images[0]);
      }
    } catch (err) {
      console.error(err);
      showToast('Error', 'Product details could not be loaded.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (!reviewComment.trim()) return;

    try {
      setIsSubmittingReview(true);
      const res = await API.post(`/products/${productId}/reviews`, {
        rating: reviewRating,
        comment: reviewComment,
      });

      setProduct(res.data.product);
      setReviewComment('');
      showToast('Review Published', 'Thank you for your feedback!', 'success');
    } catch (err: any) {
      showToast('Review Failed', err.response?.data?.message || 'Could not submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductCardSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);

  return (
    <div id="product-detail-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        id="btn-back-shop"
        onClick={() => onNavigate('shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      {/* Main Grid: Gallery & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="w-full aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-lg">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === img
                    ? 'border-indigo-600 dark:border-indigo-400 scale-105 shadow-md'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
              {product.brand} • {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">{product.rating}</span>
            <span className="text-xs text-slate-500">({product.numReviews} Verified Reviews)</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span
              className={`text-xs font-bold ${
                product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
              }`}
            >
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Grid */}
          {product.specifications && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Technical Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key}>
                    <span className="text-slate-400 block">{key}:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                >
                  -
                </button>
                <span className="px-4 text-xs font-bold text-slate-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-detail-add-cart"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock <= 0}
                className="flex-1 py-4 px-6 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 dark:hover:bg-slate-100 shadow-sm transition-all"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart (${(product.price * quantity).toFixed(2)})
              </button>

              <button
                id="btn-detail-wishlist"
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-2xl border transition-colors ${
                  isLiked
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-500'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Value props */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-indigo-600" /> Free Global Shipping
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 2-Year Warranty
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-4 h-4 text-amber-500" /> 30-Day Returns
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <section className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Customer Reviews ({product.numReviews})
          </h3>
        </div>

        {/* Add Review Form */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Write a Product Review</h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Your Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform"
                >
                  <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-current' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleAddReview} className="space-y-3">
            <textarea
              rows={3}
              placeholder="Share your experience regarding build quality, audio, durability..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSubmittingReview}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </form>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80'}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-xs text-slate-900 dark:text-white">{rev.userName}</h5>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.round(rev.rating) ? 'fill-current' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pl-11">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No reviews yet. Be the first to leave a review!</p>
          )}
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            You Might Also Like
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onQuickView={onQuickView}
                onSelectProduct={(p) => onNavigate('product-detail', { id: p.id })}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
