# 📚 Documentation Index

Welcome to the CafeByte documentation! This directory contains comprehensive guides for understanding, deploying, and extending the application.

---

## 📖 Getting Started

### New to CafeByte?
Start here:

1. **[SUMMARY.md](../SUMMARY.md)** - Quick overview of what CafeByte is and why it's awesome
2. **[QUICK_REFERENCE.md](../QUICK_REFERENCE.md)** - Login credentials, coupon codes, quick tips
3. **[README.md](../README.md)** - Complete project documentation

---

## 🏗️ Architecture & Design

### Understanding the Code

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Visual diagrams of app structure, data flow, component hierarchy
- **[FEATURES.md](../FEATURES.md)** - Complete checklist of all implemented features
- **[API.md](../API.md)** - API documentation for backend integration

---

## 🚀 Deployment & Integration

### Taking It to Production

- **[DEPLOYMENT.md](../DEPLOYMENT.md)** - Step-by-step deployment guide (Vercel, Netlify, Docker, AWS)
- **[FIREBASE_INTEGRATION.md](../FIREBASE_INTEGRATION.md)** - How to connect Firebase backend
- Environment setup
- Security best practices

---

## 📋 Feature Documentation

### Core Features

#### 🤖 AI Assistant (BYTE)
**What it does:**
- Smart food recommendations based on keywords
- Time-based suggestions (breakfast, lunch, dinner)
- Image-based food detection (mock)

**How to use:**
```typescript
import { ByteAI } from './services/byteAI';

const result = ByteAI.getRecommendations('cheap spicy');
// Returns: { items: MenuItem[], reason: string }
```

**Keywords:**
- `cheap` - Items under ₹150
- `spicy` - Spicy dishes
- `coffee/tea` - Beverages
- `combo` - Meal combos
- `healthy` - Nutritious options
- `quick` - Ready in ≤15 min

---

#### 🛒 Shopping Cart
**Location:** `src/app/context/CartContext.tsx`

**Features:**
- Add/remove items
- Update quantities
- Persistent storage
- Real-time totals
- Coupon support

**Usage:**
```typescript
const { cart, addToCart, removeFromCart, cartTotal } = useCart();

addToCart(menuItem);
removeFromCart(itemId);
updateQuantity(itemId, 5);
```

---

#### 💳 Coupons
**Active Coupons:**
- `BYTE50` - 50% off (Min ₹200, Max ₹100)
- `FIRST20` - 20% off (Min ₹100, Max ₹50)
- `WEEKEND30` - 30% off (Min ₹300, Max ₹150)

**Validation:**
```typescript
const coupon = couponsData.find(c => c.code === code);
if (cartTotal < coupon.minAmount) {
  // Error: minimum amount not met
}
const discount = Math.min(
  (cartTotal * coupon.discount) / 100,
  coupon.maxDiscount
);
```

---

#### 📦 Order Tracking
**Status Flow:**
```
pending → confirmed → preparing → ready → delivered
              ↓ (can be cancelled)
          cancelled
```

**Admin Actions:**
- Confirm order
- Start preparing
- Mark as ready
- Mark as delivered
- Cancel order

---

#### 🌓 Dark Mode
**Implementation:**
- Context-based theme management
- LocalStorage persistence
- Tailwind dark: variant

**Usage:**
```typescript
const { theme, toggleTheme } = useTheme();

// In JSX
<div className="bg-white dark:bg-gray-800">
  <button onClick={toggleTheme}>
    {theme === 'light' ? <Moon /> : <Sun />}
  </button>
</div>
```

---

## 🎨 UI/UX Guidelines

### Design System

**Colors:**
```css
Primary (Orange): #f97316
Admin (Purple):   #9333ea
Success (Green):  #10b981
Error (Red):      #ef4444
Warning (Yellow): #f59e0b
Info (Blue):      #3b82f6
```

**Typography:**
- Font: System default (San Francisco, Segoe UI, Roboto)
- Sizes: Tailwind scale (text-sm, text-base, text-lg, etc.)

**Spacing:**
- Use Tailwind spacing scale
- Standard padding: p-4, p-6
- Standard margin: mb-4, mb-6

**Shadows:**
- Card: `shadow-lg`
- Hover: `hover:shadow-xl`

---

## 🔧 Development

### Project Structure

```
src/app/
├── components/
│   ├── user/          → Customer UI
│   ├── admin/         → Admin UI
│   ├── auth/          → Auth pages
│   └── ui/            → Shared components
├── context/           → React Context
├── data/              → Mock data
├── services/          → Business logic
├── types/             → TypeScript types
├── routes.tsx         → Route config
└── App.tsx            → Root component
```

### Key Technologies

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **React Router 7** - Navigation
- **Context API** - State management
- **Lucide React** - Icons
- **Sonner** - Notifications
- **jsPDF** - PDF generation

---

## 🧪 Testing

### Manual Testing Checklist

**User Flow:**
- [ ] Browse menu
- [ ] Search items
- [ ] Filter by category/veg/spicy
- [ ] Add to cart
- [ ] Apply coupon
- [ ] Place order
- [ ] Track order
- [ ] Download invoice
- [ ] Toggle dark mode

**Admin Flow:**
- [ ] View dashboard
- [ ] Update order status
- [ ] Toggle menu availability
- [ ] View user analytics
- [ ] Manage coupons

---

## 🐛 Troubleshooting

### Common Issues

**1. Items not showing in menu**
- Check `src/app/data/mockData.ts`
- Verify images are loading (Unsplash URLs)

**2. Cart not persisting**
- Check browser localStorage
- Key: `cafebyte-cart`

**3. Dark mode not working**
- Verify `<html>` class toggle
- Check ThemeContext implementation

**4. Orders not appearing**
- Check localStorage: `cafebyte-orders`
- Verify user is logged in

**5. Coupon not applying**
- Check minimum amount requirement
- Verify coupon is active
- Check expiry date

---

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
  category: string;
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
  items: CartItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  status: OrderStatus;
  createdAt: number;
  paymentMethod: string;
  couponCode?: string;
}
```

---

## 🔐 Security

### Best Practices

1. **Environment Variables**
   - Never commit API keys
   - Use `.env` for sensitive data
   - Prefix with `VITE_`

2. **Authentication**
   - Use JWT tokens
   - Store in httpOnly cookies (production)
   - Implement refresh tokens

3. **Authorization**
   - Check user roles
   - Protect admin routes
   - Validate on backend

4. **Input Validation**
   - Sanitize user input
   - Validate on client and server
   - Use TypeScript for type safety

---

## 🚀 Performance

### Optimization Tips

1. **Images**
   - Use Unsplash CDN
   - Add lazy loading
   - Optimize sizes

2. **Code Splitting**
   - React Router handles this
   - Lazy load admin components

3. **State Management**
   - Use Context wisely
   - Memoize expensive computations
   - Debounce search inputs

4. **Caching**
   - Cache API responses
   - Use localStorage strategically

---

## 📱 Mobile Optimization

### Responsive Design

**Breakpoints:**
```css
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

**Mobile Features:**
- Bottom navigation
- Touch-friendly buttons
- Swipe gestures ready
- Optimized images

---

## 🎓 Learning Resources

### React
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com)
- [Tailwind Components](https://tailwindui.com)

### React Router
- [React Router Docs](https://reactrouter.com)

### Backend
- [Firebase Docs](https://firebase.google.com/docs)
- [Supabase Docs](https://supabase.com/docs)

---

## 📞 Support

### Getting Help

1. **Documentation** - Check these docs first
2. **Code Comments** - Most files have inline comments
3. **GitHub Issues** - Report bugs
4. **Community** - Ask questions

---

## 🔄 Updates & Changelog

### Version 1.0.0 (Current)
- ✅ User authentication
- ✅ Menu browsing with filters
- ✅ AI recommendations (BYTE)
- ✅ Shopping cart with coupons
- ✅ Order tracking
- ✅ Admin dashboard
- ✅ Dark mode
- ✅ Responsive design

### Planned Features
- [ ] Real-time order updates
- [ ] Push notifications
- [ ] Live chat
- [ ] Reviews & ratings
- [ ] Loyalty program
- [ ] Delivery tracking

---

## 🎉 Contributing

### How to Contribute

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

### Code Style

- Use TypeScript
- Follow existing patterns
- Add comments for complex logic
- Use Tailwind for styling
- Keep components small and focused

---

## 📄 License

MIT License - See LICENSE file

---

## 📞 Contact

For questions or support:
- Documentation: Check this folder
- Issues: Create GitHub issue
- Email: support@cafebyte.com

---

**Last Updated:** April 5, 2026

**Version:** 1.0.0

**Status:** Production Ready (needs backend)

---

**🎉 You're all set! Happy coding!**
