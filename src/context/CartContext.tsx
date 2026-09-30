import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product } from '../types/index.js';
import { useToast } from './ToastContext.js';
import API from '../services/api.js';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountPrice: number;
  totalPrice: number;
  couponCode: string;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  totalCartItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('apex_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('apex_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedColor?: string,
    selectedSize?: string
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          showToast('Stock Limit Reached', `Only ${product.stock} units available in stock.`, 'error');
          return prev;
        }
        updated[existingIndex].quantity = newQty;
        showToast('Cart Updated', `Increased quantity of ${product.name}`, 'success');
        return updated;
      } else {
        if (quantity > product.stock) {
          showToast('Stock Limit', `Only ${product.stock} units available in stock.`, 'error');
          return prev;
        }
        showToast('Added to Cart', `${product.name} added to your cart`, 'success');
        return [...prev, { product, quantity, selectedColor, selectedSize }];
      }
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item Removed', 'Product removed from cart.', 'info');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          if (quantity > item.product.stock) {
            showToast('Stock Limit', `Maximum available stock is ${item.product.stock}`, 'error');
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountPercentage(0);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    try {
      const res = await API.post('/coupons/validate', {
        code,
        cartAmount: itemsPrice,
      });
      if (res.data.valid) {
        setCouponCode(res.data.code);
        setDiscountPercentage(res.data.discountPercentage);
        showToast('Coupon Applied!', res.data.message, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast('Coupon Invalid', err.response?.data?.message || 'Failed to validate coupon', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercentage(0);
    showToast('Coupon Removed', 'Discount removed from order summary.', 'info');
  };

  // Calculations
  const itemsPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountPrice = Number(((itemsPrice * discountPercentage) / 100).toFixed(2));
  const shippingPrice = itemsPrice > 100 || itemsPrice === 0 ? 0 : 15.0;
  const taxPrice = Number(((itemsPrice - discountPrice) * 0.08).toFixed(2));
  const totalPrice = Number((itemsPrice - discountPrice + shippingPrice + taxPrice).toFixed(2));
  const totalCartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        totalPrice,
        couponCode,
        applyCoupon,
        removeCoupon,
        totalCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
