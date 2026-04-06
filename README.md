# CafeByte - Full-Stack Food Ordering System

A complete, production-ready web application for food ordering with user and admin portals.

## 🚀 Features

### User App
- **Authentication**: Login/Register with Firebase-style architecture
- **AI Assistant (BYTE)**: Smart food recommendations based on:
  - Keywords (cheap, spicy, coffee, combo, etc.)
  - Time of day (breakfast, lunch, dinner)
  - User preferences
- **Menu Browsing**:
  - Search by name, tags, category
  - Advanced filters (veg/non-veg, spicy, price)
  - Category navigation
- **Shopping Cart**:
  - Add/remove/update quantities
  - Coupon support (BYTE50, FIRST20, WEEKEND30)
  - Real-time total calculation
- **Order Tracking**:
  - Live status updates
  - Progress visualization
  - Invoice generation (PDF download)
- **Profile Management**: Order history, stats, dark/light mode
- **Dark Mode**: Full dark theme support

### Admin App
- **Dashboard**: Revenue, orders, users statistics with visual metrics
- **Menu Management**: CRUD operations for menu items
- **Order Management**: Update order status workflow (pending → confirmed → preparing → ready → delivered)
- **User Management**: View user stats, orders, spending
- **Coupon Management**: Create, activate/deactivate, track usage

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF Generation**: jsPDF
- **State Management**: React Context API
- **Storage**: LocalStorage (ready for backend integration)

## 📦 Installation

```bash
# Install dependencies
pnpm install

# The dev server is already running in this environment
# Just start making changes and see them live!
```

## 🎯 Demo Accounts

### User Account
- Email: `user@cafebyte.com`
- Password: `password`

### Admin Account
- Email: `admin@cafebyte.com`
- Password: `password`

## 🎨 Key Components

### User Features
- **Home**: AI recommendations, popular items, category browsing
- **Menu**: Advanced search and filtering
- **Cart**: Coupon application, checkout flow
- **Orders**: Order history with invoice download
- **Profile**: User stats and preferences

### Admin Features
- **Dashboard**: Business metrics and recent orders
- **Menu**: Full CRUD for menu items with availability toggle
- **Orders**: Order status management workflow
- **Users**: Customer analytics and spending patterns
- **Coupons**: Discount code management with usage tracking

## 🤖 BYTE AI Assistant

The AI assistant provides intelligent recommendations based on:

1. **Keyword Detection**:
   - "cheap" → Budget-friendly items under ₹150
   - "spicy" → Spicy dishes
   - "coffee/tea" → Beverages
   - "combo" → Meal combos
   - "healthy" → Nutritious options
   - "quick" → Items ready in ≤15 minutes

2. **Time-Based**:
   - Morning (6-12): Breakfast + beverages
   - Afternoon (12-5): Lunch + snacks
   - Evening (5-9): Snacks + beverages
   - Night (9-6): Dinner items

3. **Image Detection** (Mock): Returns similar items from menu

## 🔐 Backend Integration

This app is ready for backend integration. To connect to a real backend:

1. **Connect Supabase** from the Make settings page
2. **Add API Keys** for:
   - Razorpay payment gateway
   - Firebase services (optional)
   - Any external APIs

Currently uses localStorage for demo purposes.

## 📱 Mobile Responsive

Fully responsive design optimized for:
- Desktop (1920px+)
- Tablet (768px - 1920px)
- Mobile (320px - 768px)

## 🎨 Theme Customization

Dark/Light mode toggle available in navbar. Theme persists across sessions.

## 🛒 Order Flow

1. Browse menu or use AI search
2. Add items to cart
3. Apply coupon code (optional)
4. Login (if not logged in)
5. Place order
6. Track order status
7. Download invoice when delivered

## 🔑 Coupon Codes

- **BYTE50**: 50% off (Min: ₹200, Max: ₹100)
- **FIRST20**: 20% off (Min: ₹100, Max: ₹50)
- **WEEKEND30**: 30% off (Min: ₹300, Max: ₹150)

## 📊 Data Models

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: number;
}
```

### MenuItem
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverages' | 'desserts';
  image: string;
  isVeg: boolean;
  isSpicy: boolean;
  rating: number;
  tags: string[];
  available: boolean;
  preparationTime: number;
}
```

### Order
```typescript
{
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: number;
  updatedAt: number;
  deliveryAddress: string;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'pending' | 'completed' | 'failed';
  couponCode?: string;
}
```

## 🚀 Future Enhancements

- Real-time order updates with WebSockets
- Push notifications (FCM integration)
- Live chat support
- Multi-restaurant support
- Delivery tracking with maps
- Reviews and ratings
- Loyalty program
- Advanced ML-based recommendations

## 📄 License

MIT License - feel free to use this for your projects!

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
