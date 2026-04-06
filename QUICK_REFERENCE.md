# 🎯 Quick Reference Guide

## 🔐 Login Credentials

### User Account
```
Email: user@cafebyte.com
Password: password
```

### Admin Account
```
Email: admin@cafebyte.com
Password: password
```

## 💳 Active Coupons

```
BYTE50    - 50% off (Min ₹200, Max ₹100 discount)
FIRST20   - 20% off (Min ₹100, Max ₹50 discount)
WEEKEND30 - 30% off (Min ₹300, Max ₹150 discount)
```

## 🔍 AI Search Examples

Try these in the BYTE search bar on the home page:

```
"cheap spicy"        → Budget-friendly spicy items
"coffee"             → Coffee beverages
"combo"              → Meal combos
"quick"              → Items ready in ≤15 min
"healthy"            → Nutritious options
"vegetarian"         → Veg items only
"breakfast"          → Morning items
```

## 🗺️ Routes

### User Routes
```
/                    → Home (AI recommendations, popular items)
/menu               → Full menu with search & filters
/cart               → Shopping cart & checkout
/orders             → Order history & tracking
/profile            → User profile & stats
/login              → Login page
/register           → Sign up page
```

### Admin Routes
```
/admin              → Dashboard (metrics, stats)
/admin/menu         → Menu management (CRUD)
/admin/orders       → Order management
/admin/users        → User analytics
/admin/coupons      → Coupon management
```

## 🎨 UI Components

### Color Scheme
```css
Primary:    Orange (#f97316)
Admin:      Purple (#9333ea)
Success:    Green
Error:      Red
Warning:    Yellow
Info:       Blue
```

### Icons (Lucide React)
```tsx
import { Home, Menu, ShoppingCart, Package, User } from 'lucide-react';
```

## 📊 Order Status Flow

```
pending
  ↓ (Admin confirms)
confirmed
  ↓ (Admin starts preparing)
preparing
  ↓ (Admin marks ready)
ready
  ↓ (Admin marks delivered)
delivered

(can be cancelled from pending/confirmed)
```

## 🗂️ Project Structure

```
src/app/
├── components/
│   ├── user/          # User app components
│   ├── admin/         # Admin app components
│   ├── auth/          # Login/Register
│   └── ui/            # Shared UI components
├── context/           # React Context (Auth, Cart, Theme)
├── data/              # Mock data
├── services/          # BYTE AI service
├── types/             # TypeScript types
├── routes.tsx         # React Router config
└── App.tsx            # Main app component
```

## 🔧 Key Technologies

```json
{
  "framework": "React 18",
  "language": "TypeScript",
  "styling": "Tailwind CSS 4",
  "routing": "React Router 7",
  "state": "Context API",
  "icons": "Lucide React",
  "notifications": "Sonner",
  "pdf": "jsPDF"
}
```

## 🎯 Testing Checklist

### User Flow
1. ✅ Visit home page → see AI recommendations
2. ✅ Try BYTE search → "cheap spicy"
3. ✅ Browse menu → apply filters
4. ✅ Add items to cart → see badge update
5. ✅ Go to cart → apply coupon "BYTE50"
6. ✅ Login (if not logged in)
7. ✅ Place order → check orders page
8. ✅ View profile → see stats
9. ✅ Toggle dark mode → persists on refresh

### Admin Flow
1. ✅ Login as admin
2. ✅ View dashboard → see metrics
3. ✅ Go to menu → toggle availability
4. ✅ Go to orders → update status
5. ✅ View users → see analytics
6. ✅ View coupons → toggle active/inactive

## 📱 Mobile Testing

### Responsive Breakpoints
```css
Mobile:  < 768px
Tablet:  768px - 1024px
Desktop: > 1024px
```

### Features to Test
- Bottom navigation (user app)
- Horizontal scroll (recommendations)
- Touch interactions
- Image loading
- Cart badge visibility

## 🚀 Performance Tips

### Images
- All images from Unsplash CDN (optimized)
- Lazy loading ready

### State
- Cart persists in localStorage
- Theme persists in localStorage
- User session persists

### Optimization
- Code splitting with React Router
- Context API for efficient re-renders
- Memoization where needed

## 🐛 Common Issues & Solutions

### Issue: Cart not persisting
**Solution**: Check localStorage - `cafebyte-cart`

### Issue: User logged out on refresh
**Solution**: Check localStorage - `cafebyte-user`

### Issue: Dark mode not working
**Solution**: Check `<html>` has `.dark` class

### Issue: Orders not showing
**Solution**: Check localStorage - `cafebyte-orders`

## 📦 Data Storage (LocalStorage Keys)

```javascript
'cafebyte-user'      // User session
'cafebyte-cart'      // Shopping cart
'cafebyte-orders'    // Order history
'cafebyte-theme'     // Theme preference
```

## 🎓 Code Examples

### Add to Cart
```tsx
const { addToCart } = useCart();
addToCart(menuItem);
```

### Get AI Recommendations
```tsx
const result = ByteAI.getRecommendations('cheap spicy');
console.log(result.items, result.reason);
```

### Update Order Status
```tsx
updateOrderStatus(orderId, 'confirmed');
```

### Apply Coupon
```tsx
const coupon = couponsData.find(c => c.code === 'BYTE50');
// Validate and calculate discount
```

## 📚 Further Reading

- `README.md` - Complete documentation
- `FIREBASE_INTEGRATION.md` - Backend setup
- `FEATURES.md` - Feature checklist
- `SUMMARY.md` - Project overview

---

**🎉 Happy Coding!**
