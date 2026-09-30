import { Product, Category, Coupon, User, Order } from '../types/index.js';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Electronics & Audio',
    slug: 'electronics',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    itemCount: 36,
  },
  {
    id: 'cat-2',
    name: 'Mobile Accessories',
    slug: 'mobile-accessories',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    itemCount: 42,
  },
  {
    id: 'cat-3',
    name: 'Smartphones & Tech',
    slug: 'smartphones',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
    itemCount: 28,
  },
  {
    id: 'cat-4',
    name: 'Smart Wearables',
    slug: 'wearables',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    itemCount: 24,
  },
  {
    id: 'cat-5',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    itemCount: 30,
  },
  {
    id: 'cat-6',
    name: 'Footwear & Kicks',
    slug: 'footwear',
    icon: 'Footprints',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    itemCount: 22,
  },
  {
    id: 'cat-7',
    name: 'Home & Smart Living',
    slug: 'home-kitchen',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    itemCount: 18,
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-101',
    name: 'ApexPro SoundCancel ANC Wireless Headphones',
    slug: 'apexpro-soundcancel-anc-headphones',
    description: 'Experience studio-grade spatial audio with active noise cancellation, 40-hour battery stamina, ultra-soft memory foam ear cushions, and seamless multipoint Bluetooth 5.3 pairing.',
    price: 249.99,
    originalPrice: 299.99,
    category: 'electronics',
    brand: 'ApexAudio',
    stock: 28,
    rating: 4.9,
    numReviews: 142,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
    ],
    featured: true,
    isBestSeller: true,
    tags: ['wireless', 'noise-cancelling', 'audio', 'premium'],
    specifications: {
      'Battery Life': '40 Hours (ANC On)',
      'Connectivity': 'Bluetooth 5.3 + 3.5mm Jack',
      'Noise Control': 'Adaptive ANC with Transparency Mode',
      'Weight': '250g'
    },
    reviews: [
      {
        id: 'rev-1',
        userId: 'usr-2',
        userName: 'Alex Morgan',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
        rating: 5,
        comment: 'Mind-blowing noise cancellation! Used these on a 14-hour flight and my ears didn’t feel tired at all.',
        createdAt: '2026-07-20T10:15:00Z'
      },
      {
        id: 'rev-2',
        userId: 'usr-3',
        userName: 'David Chen',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
        rating: 4.8,
        comment: 'Crisp highs, deep bass response, and build quality feels like a $500 luxury headphone set.',
        createdAt: '2026-07-28T14:30:00Z'
      }
    ],
    createdAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'prod-201',
    name: 'MagPulse 10,000mAh Magnetic Power Bank with Stand',
    slug: 'magpulse-10000mah-magnetic-power-bank',
    description: '15W MagSafe-compatible magnetic wireless power bank equipped with 20W USB-C Power Delivery, pass-through charging capabilities, and an integrated zinc alloy folding kickstand.',
    price: 49.99,
    originalPrice: 69.99,
    category: 'mobile-accessories',
    brand: 'ApexPower',
    stock: 50,
    rating: 4.9,
    numReviews: 184,
    images: [
      'https://images.unsplash.com/photo-1622445268465-843d31216ace?w=800&q=80',
      'https://images.unsplash.com/photo-1609592807663-7eb92723363d?w=800&q=80'
    ],
    featured: true,
    isBestSeller: true,
    tags: ['magsafe', 'power-bank', 'wireless-charger', 'mobile-accessory'],
    specifications: {
      'Capacity': '10,000mAh / 38.5Wh',
      'Wireless Output': '15W Fast Wireless Charging',
      'USB-C Port': 'PD 20W Bi-directional Fast Charge',
      'Kickstand': 'Foldable Aluminum Alloy Ring Stand'
    },
    reviews: [
      {
        id: 'rev-10',
        userId: 'usr-5',
        userName: 'Elena Rostova',
        userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
        rating: 5,
        comment: 'Magnet snaps on like iron! The kickstand lets me watch videos hands-free while my phone charges.',
        createdAt: '2026-07-29T11:00:00Z'
      }
    ],
    createdAt: '2026-07-01T08:00:00Z'
  },
  {
    id: 'prod-202',
    name: 'MagDock 3-in-1 Foldable Wireless Charger Stand',
    slug: 'magdock-3-in-1-foldable-wireless-charger',
    description: 'Aircraft-grade aluminum foldable station designed to fast-charge iPhone, Apple Watch, and AirPods simultaneously with smart heat dissipation and ambient LED indicator.',
    price: 59.99,
    originalPrice: 79.99,
    category: 'mobile-accessories',
    brand: 'ApexPower',
    stock: 35,
    rating: 4.8,
    numReviews: 112,
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'
    ],
    featured: true,
    isNewArrival: true,
    tags: ['wireless-charger', 'dock', 'magsafe', 'apple-accessory'],
    specifications: {
      'Compatibility': 'iPhone 12-16 Series, Apple Watch 1-9/Ultra, AirPods Pro',
      'Total Output': '25W Max Fast Charging',
      'Material': 'CNC Machined Anodized Aluminum',
      'Folded Dimensions': '12mm Thin Travel Design'
    },
    createdAt: '2026-07-15T09:00:00Z'
  },
  {
    id: 'prod-203',
    name: 'HyperFlex 240W Braided USB-C Cable with Power Meter',
    slug: 'hyperflex-240w-braided-usbc-power-meter-cable',
    description: 'Bulletproof Kevlar reinforced USB-C to USB-C cable featuring a built-in real-time OLED wattage readout meter, PD 3.1 240W charging, and 30,000+ bend lifetime.',
    price: 24.99,
    originalPrice: 34.99,
    category: 'mobile-accessories',
    brand: 'CableCraft',
    stock: 60,
    rating: 4.9,
    numReviews: 210,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80'
    ],
    featured: false,
    isBestSeller: true,
    tags: ['cable', 'usb-c', '240w', 'fast-charging'],
    specifications: {
      'Max Power': '240W (48V/5A) PD 3.1 Extended Power Range',
      'Display': 'Integrated OLED Power Watt Meter',
      'Length': '2 Meters / 6.6 Feet',
      'Data Rate': 'USB 2.0 (480Mbps)'
    },
    createdAt: '2026-06-25T14:00:00Z'
  },
  {
    id: 'prod-204',
    name: 'PowerPulse 100W GaN Fast Wall Charger (4-Port)',
    slug: 'powerpulse-100w-gan-fast-wall-charger',
    description: 'Advanced Gallium Nitride (GaN III) power station delivering 100W output across 3x USB-C and 1x USB-A ports. Powers two laptops and two smartphones simultaneously.',
    price: 69.99,
    originalPrice: 89.99,
    category: 'electronics',
    brand: 'ApexPower',
    stock: 32,
    rating: 4.9,
    numReviews: 165,
    images: [
      'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&q=80'
    ],
    featured: true,
    isBestSeller: true,
    tags: ['gan-charger', 'fast-charger', '100w', 'power-adapter'],
    specifications: {
      'Max Power Output': '100W Single Port / Intelligent Power Distribution',
      'Ports': '3x USB-C PD 3.0 + 1x USB-A QC 4.0',
      'Technology': 'GaN III Semiconductor',
      'Plug': 'Foldable US/EU Travel Plug'
    },
    createdAt: '2026-06-18T10:30:00Z'
  },
  {
    id: 'prod-205',
    name: 'SonicWave 360° Waterproof Bluetooth Speaker',
    slug: 'sonicwave-360-waterproof-bluetooth-speaker',
    description: 'Rugged IP67 dustproof and waterproof speaker pumping out 360-degree spatial acoustic punch, dual passive radiators, 24-hour battery endurance, and TWS party mode link.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'electronics',
    brand: 'ApexAudio',
    stock: 20,
    rating: 4.8,
    numReviews: 129,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'
    ],
    featured: true,
    isNewArrival: true,
    tags: ['speaker', 'bluetooth', 'waterproof', 'outdoor'],
    specifications: {
      'Water Rating': 'IP67 Submersible Waterproof',
      'Playtime': 'Up to 24 Hours at 50% Volume',
      'Connectivity': 'Bluetooth 5.3 True Wireless Stereo',
      'Driver Output': '30W RMS Deep Bass System'
    },
    createdAt: '2026-07-10T12:00:00Z'
  },
  {
    id: 'prod-206',
    name: 'OmniVision 4K Ultra-HD AI Webcam with Ring Light',
    slug: 'omnivision-4k-ultrahd-ai-webcam',
    description: 'Studio 4K HDR Sony sensor webcam featuring AI face-tracking auto-framing, dual noise-isolating microphones, touch adjustable warm ring lighting, and magnetic privacy cover.',
    price: 119.00,
    originalPrice: 149.00,
    category: 'electronics',
    brand: 'VisionTech',
    stock: 18,
    rating: 4.7,
    numReviews: 88,
    images: [
      'https://images.unsplash.com/photo-1587826080691-7270d8c828e1?w=800&q=80'
    ],
    featured: true,
    tags: ['webcam', '4k', 'streaming', 'desk-gear'],
    specifications: {
      'Resolution': '4K UHD 2160p @ 30fps / 1080p @ 60fps',
      'Microphone': 'Dual Omni-directional Stereo Mics with AI Noise Cancel',
      'Field of View': '90° Wide Angle Glass Lens',
      'Lighting': 'Touch Controlled 3-Stage Dimmable Ring Light'
    },
    createdAt: '2026-06-28T16:00:00Z'
  },
  {
    id: 'prod-102',
    name: 'Titan Watch Ultra Smart Fitness Tracker',
    slug: 'titan-watch-ultra-smart-tracker',
    description: 'Precision grade aerospace titanium casing with AMOLED display, ECG monitoring, dual-frequency GPS, 100m water resistance, and 7-day active battery life.',
    price: 329.00,
    originalPrice: 389.00,
    category: 'wearables',
    brand: 'TitanTech',
    stock: 14,
    rating: 4.8,
    numReviews: 98,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80'
    ],
    featured: true,
    isNewArrival: true,
    tags: ['fitness', 'titanium', 'smartwatch', 'gps'],
    specifications: {
      'Display': '1.92-inch Sapphire AMOLED',
      'Water Resistance': '10 ATM / 100 Meters',
      'Sensors': 'Optical Heart Rate, SpO2, ECG, Altimeter',
      'Battery': 'Up to 7 Days Normal Use'
    },
    reviews: [
      {
        id: 'rev-3',
        userId: 'usr-4',
        userName: 'Sophia Rodriguez',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
        rating: 5,
        comment: 'Tracks my trail runs with insane GPS accuracy. Solid battery performance!',
        createdAt: '2026-07-25T09:12:00Z'
      }
    ],
    createdAt: '2026-06-15T10:00:00Z'
  },
  {
    id: 'prod-103',
    name: 'Nomad Urban Tactical Backpack 30L',
    slug: 'nomad-urban-tactical-backpack-30l',
    description: 'Weatherproof Cordura fabric featuring air-mesh ergonomics, quick-access padded 16-inch laptop chamber, integrated USB pass-through port, and anti-theft hidden pockets.',
    price: 89.95,
    originalPrice: 119.95,
    category: 'fashion',
    brand: 'NomadGear',
    stock: 45,
    rating: 4.7,
    numReviews: 64,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80'
    ],
    featured: false,
    isBestSeller: true,
    tags: ['backpack', 'travel', 'waterproof', 'laptop-bag'],
    specifications: {
      'Capacity': '30 Liters',
      'Material': '1000D Waterproof Cordura Nylon',
      'Laptop Compartment': 'Fits up to 16-inch MacBook Pro',
      'Warranty': 'Lifetime Guarantee'
    },
    createdAt: '2026-05-10T12:00:00Z'
  },
  {
    id: 'prod-104',
    name: 'Velocity Nitro Cushion Running Sneakers',
    slug: 'velocity-nitro-cushion-running-sneakers',
    description: 'Engineered breathability mesh uppers paired with nitrogen-infused foam cushioning for high energy return, optimal arch support, and rubber traction outsoles.',
    price: 139.99,
    originalPrice: 169.99,
    category: 'footwear',
    brand: 'Velocity',
    stock: 30,
    rating: 4.8,
    numReviews: 112,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80'
    ],
    featured: true,
    isNewArrival: true,
    tags: ['footwear', 'running', 'sneakers', 'sports'],
    specifications: {
      'Upper': 'Seamless Flyknit Mesh',
      'Midsole': 'NitroFoam Responsive Cushion',
      'Weight': '210g (Size 9)',
      'Closure': 'Lace-Up System'
    },
    createdAt: '2026-07-01T11:20:00Z'
  },
  {
    id: 'prod-105',
    name: 'Lumino Smart Ambient LED Desk Lamp',
    slug: 'lumino-smart-ambient-led-desk-lamp',
    description: 'Minimalist aluminum desk light with touch slide dimming, customizable color temperature (2700K - 6500K), wireless smartphone fast charging base, and Apple HomeKit / Alexa integration.',
    price: 74.50,
    originalPrice: 95.00,
    category: 'home-kitchen',
    brand: 'LuminoHome',
    stock: 19,
    rating: 4.6,
    numReviews: 53,
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
      'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?w=800&q=80'
    ],
    featured: false,
    tags: ['smart-home', 'lighting', 'desk-setup', 'wireless-charging'],
    specifications: {
      'Brightness': '1000 Lumens',
      'Wireless Output': '15W Fast Qi Charging Base',
      'Color Temp': '2700K to 6500K Adjustable',
      'Control': 'Touch Panel + Mobile App / Voice'
    },
    createdAt: '2026-06-20T09:45:00Z'
  },
  {
    id: 'prod-106',
    name: 'Aura Minimalist Mechanical Keyboard (RGB)',
    slug: 'aura-minimalist-mechanical-keyboard-rgb',
    description: '75% compact hot-swappable mechanical keyboard featuring lubricated linear switches, custom PBT keycaps, sound-dampening foam layer, and triple mode connectivity (Type-C, 2.4Ghz, BT5.1).',
    price: 119.00,
    originalPrice: 149.00,
    category: 'smartphones',
    brand: 'AuraKey',
    stock: 8,
    rating: 4.9,
    numReviews: 87,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80'
    ],
    featured: true,
    isBestSeller: true,
    tags: ['keyboard', 'mechanical', 'gaming', 'desk-setup'],
    specifications: {
      'Switch Type': 'Aura Linear Yellow (Hot-Swappable)',
      'Layout': '75% Compact (82 Keys)',
      'Battery': '4000mAh Rechargeable',
      'Backlight': 'Per-key South-facing RGB'
    },
    createdAt: '2026-07-10T14:15:00Z'
  },
  {
    id: 'prod-107',
    name: 'BrewMaster Italian Espresso Machine',
    slug: 'brewmaster-italian-espresso-machine',
    description: '19-bar professional pump pressure espresso extraction machine with commercial steam wand for silky micro-foam latte art, 1.8L removable water tank, and thermal warming tray.',
    price: 289.99,
    originalPrice: 349.99,
    category: 'home-kitchen',
    brand: 'BrewMaster',
    stock: 12,
    rating: 4.8,
    numReviews: 76,
    images: [
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?w=800&q=80',
      'https://images.unsplash.com/photo-1517668808822-9e428824603b?w=800&q=80'
    ],
    featured: false,
    tags: ['espresso', 'coffee', 'kitchen', 'appliance'],
    specifications: {
      'Pressure': '19-Bar Italian Electromagnetic Pump',
      'Water Tank': '1.8L BPA-Free Removable',
      'Steam Wand': '360-degree Stainless Steel Frother',
      'Power': '1350W Fast Thermoblock System'
    },
    createdAt: '2026-05-22T16:00:00Z'
  },
  {
    id: 'prod-108',
    name: 'Elegance Classic Wool Trench Coat',
    slug: 'elegance-classic-wool-trench-coat',
    description: 'Tailored premium double-breasted Australian wool blend trench coat featuring structured lapels, removable waist tie belt, interior passport pocket, and deep side pockets.',
    price: 199.50,
    originalPrice: 250.00,
    category: 'fashion',
    brand: 'EleganceCo',
    stock: 22,
    rating: 4.7,
    numReviews: 41,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80',
      'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80'
    ],
    featured: false,
    tags: ['jacket', 'coat', 'winter', 'fashion'],
    specifications: {
      'Material': '80% Australian Wool, 20% Silk Polyester',
      'Fit': 'Tailored European Cut',
      'Care': 'Dry Clean Only',
      'Lining': '100% Breathable Viscose'
    },
    createdAt: '2026-06-05T08:30:00Z'
  }
];

export const initialCoupons: Coupon[] = [
  {
    id: 'c-1',
    code: 'WELCOME10',
    discountPercentage: 10,
    minSpend: 50,
    expiresAt: '2027-12-31',
    isActive: true,
  },
  {
    id: 'c-2',
    code: 'APEX20',
    discountPercentage: 20,
    minSpend: 150,
    expiresAt: '2027-12-31',
    isActive: true,
  },
  {
    id: 'c-3',
    code: 'FLASH50',
    discountPercentage: 50,
    minSpend: 300,
    expiresAt: '2027-12-31',
    isActive: true,
  },
];

export const initialUsers: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Sarah Connor (Admin)',
    email: 'admin@apexmart.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    phone: '+1 (555) 019-2834',
    createdAt: '2026-01-01T00:00:00Z'
  },
  {
    id: 'usr-customer-1',
    name: 'John Doe',
    email: 'customer@apexmart.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    phone: '+1 (555) 432-8765',
    createdAt: '2026-02-15T00:00:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-849201',
    userId: 'usr-customer-1',
    userName: 'John Doe',
    userEmail: 'customer@apexmart.com',
    items: [
      {
        productId: 'prod-101',
        name: 'ApexPro SoundCancel ANC Wireless Headphones',
        price: 249.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
      phone: '+1 (555) 432-8765'
    },
    paymentMethod: 'Credit Card (Stripe)',
    paymentIntentId: 'pi_3Mv8s2Lkd901XyZa',
    itemsPrice: 249.99,
    taxPrice: 20.00,
    shippingPrice: 0.00,
    discountPrice: 25.00,
    totalPrice: 244.99,
    isPaid: true,
    paidAt: '2026-07-28T14:22:00Z',
    status: 'Shipped',
    trackingNumber: 'TRK-98213-APX',
    createdAt: '2026-07-28T14:20:00Z',
    estimatedDelivery: '2026-08-05T18:00:00Z'
  },
  {
    id: 'ORD-849202',
    userId: 'usr-customer-1',
    userName: 'John Doe',
    userEmail: 'customer@apexmart.com',
    items: [
      {
        productId: 'prod-104',
        name: 'Velocity Nitro Cushion Running Sneakers',
        price: 139.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'John Doe',
      address: '742 Evergreen Terrace',
      city: 'Springfield',
      postalCode: '97477',
      country: 'United States',
      phone: '+1 (555) 432-8765'
    },
    paymentMethod: 'Credit Card (Stripe)',
    paymentIntentId: 'pi_3Mv9t1Lkd902AbCd',
    itemsPrice: 139.99,
    taxPrice: 11.20,
    shippingPrice: 10.00,
    discountPrice: 0.00,
    totalPrice: 161.19,
    isPaid: true,
    paidAt: '2026-08-01T09:10:00Z',
    status: 'Processing',
    trackingNumber: 'TRK-98214-APX',
    createdAt: '2026-08-01T09:05:00Z',
    estimatedDelivery: '2026-08-07T18:00:00Z'
  }
];
