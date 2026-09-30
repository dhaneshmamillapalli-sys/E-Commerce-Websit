import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';

import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialUsers,
  initialOrders,
} from './src/server/mockData.js';
import {
  Product,
  Category,
  Coupon,
  User,
  Order,
  FilterParams,
  Role,
} from './src/types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'apexmart_super_secret_jwt_key_2026';
const PORT = 3000;

// In-Memory Database State
let productsStore: Product[] = [...initialProducts];
let categoriesStore: Category[] = [...initialCategories];
let couponsStore: Coupon[] = [...initialCoupons];
let usersStore: User[] = [...initialUsers];
let ordersStore: Order[] = [...initialOrders];

// Passwords store (bcrypt hashed)
const passwordsMap = new Map<string, string>([
  ['admin@apexmart.com', bcrypt.hashSync('admin123', 10)],
  ['customer@apexmart.com', bcrypt.hashSync('customer123', 10)],
]);

interface AuthRequest extends Request {
  user?: User;
}

// Token helper
function generateToken(user: User) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// Authentication Middleware
function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    const user = usersStore.find((u) => u.id === decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User account not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

// Optional Auth Middleware (attaches user if present)
function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = usersStore.find((u) => u.id === decoded.id);
      if (user) req.user = user;
    } catch {
      // Ignore invalid token in optional auth
    }
  }
  next();
}

// Admin Authorization Middleware
function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
}

async function startServer() {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());

  // Log requests
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });

  // ==========================================
  // AUTHENTICATION ROUTES
  // ==========================================

  // Signup
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, role = 'USER' } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      const existingUser = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      passwordsMap.set(email.toLowerCase(), hashedPassword);

      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        role: (role === 'ADMIN' ? 'ADMIN' : 'USER') as Role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
        createdAt: new Date().toISOString(),
      };

      usersStore.push(newUser);

      const token = generateToken(newUser);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: 'Registration successful',
        user: newUser,
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error during registration' });
    }
  });

  // Login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = usersStore.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const storedHash = passwordsMap.get(email.toLowerCase());
      if (!storedHash) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, storedHash);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: 'Login successful',
        user,
        token,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error during login' });
    }
  });

  // Get Current Profile
  app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res: Response) => {
    return res.json({ user: req.user });
  });

  // Update Profile
  app.put('/api/auth/profile', authenticateToken, (req: AuthRequest, res: Response) => {
    const { name, phone, avatar } = req.body;
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });

    const userIndex = usersStore.findIndex((u) => u.id === req.user!.id);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    usersStore[userIndex] = {
      ...usersStore[userIndex],
      name: name || usersStore[userIndex].name,
      phone: phone !== undefined ? phone : usersStore[userIndex].phone,
      avatar: avatar || usersStore[userIndex].avatar,
    };

    return res.json({
      message: 'Profile updated successfully',
      user: usersStore[userIndex],
    });
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    res.clearCookie('token');
    return res.json({ message: 'Logged out successfully' });
  });

  // ==========================================
  // PRODUCT & CATEGORY ROUTES
  // ==========================================

  // Get Categories
  app.get('/api/categories', (req: Request, res: Response) => {
    // Update item counts based on current productsStore
    const categories = categoriesStore.map((cat) => ({
      ...cat,
      itemCount: productsStore.filter((p) => p.category === cat.slug).length,
    }));
    return res.json(categories);
  });

  // Get Products (Search, Filter, Sort, Paginate)
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...productsStore];

    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      sortBy,
      page = 1,
      limit = 12,
      featured,
    } = req.query as unknown as FilterParams & { featured?: string };

    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (rating !== undefined && !isNaN(Number(rating))) {
      result = result.filter((p) => p.rating >= Number(rating));
    }

    if (inStock === true || String(inStock) === 'true') {
      result = result.filter((p) => p.stock > 0);
    }

    if (featured === 'true') {
      result = result.filter((p) => p.featured);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // Default: featured or popularity
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const total = result.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedProducts = result.slice(startIndex, startIndex + limitNum);

    return res.json({
      products: paginatedProducts,
      page: pageNum,
      totalPages,
      total,
    });
  });

  // Get Single Product
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = productsStore.find((p) => p.id === req.params.id || p.slug === req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get related products in same category
    const relatedProducts = productsStore
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);

    return res.json({
      product,
      relatedProducts,
    });
  });

  // Add Product Review
  app.post('/api/products/:id/reviews', authenticateToken, (req: AuthRequest, res: Response) => {
    const { rating, comment } = req.body;
    const productIndex = productsStore.findIndex((p) => p.id === req.params.id);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and comment are required' });
    }

    const newReview = {
      id: `rev-${Date.now()}`,
      userId: req.user!.id,
      userName: req.user!.name,
      userAvatar: req.user!.avatar,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString(),
    };

    const existingReviews = productsStore[productIndex].reviews || [];
    const updatedReviews = [newReview, ...existingReviews];
    const totalRating = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));

    productsStore[productIndex] = {
      ...productsStore[productIndex],
      reviews: updatedReviews,
      rating: avgRating,
      numReviews: updatedReviews.length,
    };

    return res.status(201).json({
      message: 'Review added successfully',
      review: newReview,
      product: productsStore[productIndex],
    });
  });

  // Admin: Create Product
  app.post('/api/products', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
    const {
      name,
      description,
      price,
      originalPrice,
      category,
      brand,
      stock,
      images,
      tags,
      specifications,
      featured,
    } = req.body;

    if (!name || !price || !category || !brand) {
      return res.status(400).json({ message: 'Missing required product fields' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name,
      slug,
      description: description || '',
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      category,
      brand,
      stock: Number(stock || 10),
      rating: 5.0,
      numReviews: 0,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
      featured: Boolean(featured),
      tags: tags || [],
      specifications: specifications || {},
      reviews: [],
      createdAt: new Date().toISOString(),
    };

    productsStore.unshift(newProduct);
    return res.status(201).json({ message: 'Product created successfully', product: newProduct });
  });

  // Admin: Edit Product
  app.put('/api/products/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
    const index = productsStore.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Product not found' });

    productsStore[index] = {
      ...productsStore[index],
      ...req.body,
      price: req.body.price ? Number(req.body.price) : productsStore[index].price,
      stock: req.body.stock !== undefined ? Number(req.body.stock) : productsStore[index].stock,
    };

    return res.json({ message: 'Product updated successfully', product: productsStore[index] });
  });

  // Admin: Delete Product
  app.delete('/api/products/:id', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
    const initialLen = productsStore.length;
    productsStore = productsStore.filter((p) => p.id !== req.params.id);
    if (productsStore.length === initialLen) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json({ message: 'Product deleted successfully' });
  });

  // ==========================================
  // COUPON ROUTES
  // ==========================================

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, cartAmount = 0 } = req.body;
    if (!code) return res.status(400).json({ message: 'Coupon code required' });

    const coupon = couponsStore.find(
      (c) => c.code.toUpperCase() === String(code).trim().toUpperCase() && c.isActive
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    if (cartAmount < coupon.minSpend) {
      return res.status(400).json({
        message: `Minimum spend of $${coupon.minSpend} required for coupon ${coupon.code}`,
      });
    }

    const discountAmount = Number(((cartAmount * coupon.discountPercentage) / 100).toFixed(2));

    return res.json({
      valid: true,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount,
      message: `Coupon applied! You saved ${coupon.discountPercentage}% ($${discountAmount})`,
    });
  });

  // ==========================================
  // PAYMENT & ORDERS ROUTES
  // ==========================================

  // Stripe Payment Intent Simulation
  app.post('/api/payment/create-intent', authenticateToken, (req: AuthRequest, res: Response) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const clientSecret = `pi_sim_${Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`;

    return res.json({
      clientSecret,
      amount,
      currency: 'usd',
      status: 'requires_payment_method',
    });
  });

  // Create Order
  app.post('/api/orders', authenticateToken, (req: AuthRequest, res: Response) => {
    try {
      const {
        items,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        discountPrice,
        totalPrice,
      } = req.body;

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart items cannot be empty' });
      }

      if (!shippingAddress) {
        return res.status(400).json({ message: 'Shipping address is required' });
      }

      const newOrder: Order = {
        id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: req.user!.id,
        userName: req.user!.name,
        userEmail: req.user!.email,
        items,
        shippingAddress,
        paymentMethod: paymentMethod || 'Stripe Credit Card',
        paymentIntentId: `pi_live_${Date.now()}`,
        itemsPrice: Number(itemsPrice),
        taxPrice: Number(taxPrice),
        shippingPrice: Number(shippingPrice),
        discountPrice: Number(discountPrice || 0),
        totalPrice: Number(totalPrice),
        isPaid: true,
        paidAt: new Date().toISOString(),
        status: 'Processing',
        trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}-APX`,
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Decrement product inventory
      for (const item of items) {
        const prod = productsStore.find((p) => p.id === item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }

      ordersStore.unshift(newOrder);

      return res.status(201).json({
        message: 'Order created successfully',
        order: newOrder,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Failed to create order' });
    }
  });

  // Get My Orders or All Orders (Admin)
  app.get('/api/orders', authenticateToken, (req: AuthRequest, res: Response) => {
    if (req.user!.role === 'ADMIN') {
      return res.json(ordersStore);
    }
    const myOrders = ordersStore.filter((o) => o.userId === req.user!.id);
    return res.json(myOrders);
  });

  // Get Order By ID
  app.get('/api/orders/:id', authenticateToken, (req: AuthRequest, res: Response) => {
    const order = ordersStore.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    return res.json(order);
  });

  // Admin Update Order Status
  app.patch('/api/orders/:id/status', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
    const { status } = req.body;
    const orderIndex = ordersStore.findIndex((o) => o.id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    ordersStore[orderIndex] = {
      ...ordersStore[orderIndex],
      status,
    };

    return res.json({
      message: `Order status updated to ${status}`,
      order: ordersStore[orderIndex],
    });
  });

  // ==========================================
  // ADMIN DASHBOARD ANALYTICS ROUTES
  // ==========================================

  app.get('/api/admin/analytics', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
    const totalRevenue = ordersStore.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = ordersStore.length;
    const totalProducts = productsStore.length;
    const totalCustomers = usersStore.filter((u) => u.role === 'USER').length;

    const monthlyRevenue = [
      { month: 'Mar', revenue: 4200, orders: 18 },
      { month: 'Apr', revenue: 5800, orders: 24 },
      { month: 'May', revenue: 7100, orders: 31 },
      { month: 'Jun', revenue: 8900, orders: 42 },
      { month: 'Jul', revenue: 11400, orders: 58 },
      { month: 'Aug', revenue: Number(totalRevenue.toFixed(2)), orders: totalOrders },
    ];

    const categorySalesMap = new Map<string, number>();
    productsStore.forEach((p) => {
      const current = categorySalesMap.get(p.category) || 0;
      categorySalesMap.set(p.category, current + 1);
    });

    const categorySales = Array.from(categorySalesMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));

    const topSellingProducts = productsStore
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        sales: 40 + Math.floor(Math.random() * 60),
        revenue: Number((p.price * 50).toFixed(2)),
      }));

    const lowStockProducts = productsStore.filter((p) => p.stock < 15);

    return res.json({
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      totalCustomers,
      recentOrders: ordersStore.slice(0, 5),
      monthlyRevenue,
      categorySales,
      topSellingProducts,
      lowStockProducts,
    });
  });

  app.get('/api/admin/users', authenticateToken, requireAdmin, (req: AuthRequest, res: Response) => {
    return res.json(usersStore);
  });

  // Contact Form Endpoint
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }
    return res.json({ message: 'Thank you for reaching out! Our team will get back to you within 24 hours.' });
  });

  // ==========================================
  // VITE & STATIC FILES MIDDLEWARE
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApexMart E-Commerce Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ApexMart server:', err);
});
