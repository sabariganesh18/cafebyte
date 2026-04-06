# 📡 API Documentation

## Overview

This document outlines the API structure for CafeByte when integrated with a backend (Supabase/Firebase).

---

## 🔐 Authentication Endpoints

### Register User
```typescript
POST /auth/register
{
  email: string;
  password: string;
  name: string;
  phone: string;
}

Response: {
  user: User;
  token: string;
}
```

### Login
```typescript
POST /auth/login
{
  email: string;
  password: string;
}

Response: {
  user: User;
  token: string;
}
```

### Logout
```typescript
POST /auth/logout
Authorization: Bearer <token>

Response: {
  message: "Logged out successfully"
}
```

### Get Current User
```typescript
GET /auth/me
Authorization: Bearer <token>

Response: User
```

---

## 🍔 Menu Endpoints

### Get All Menu Items
```typescript
GET /menu
Query: {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isVeg?: boolean;
  isSpicy?: boolean;
  available?: boolean;
}

Response: MenuItem[]
```

### Get Single Menu Item
```typescript
GET /menu/:id

Response: MenuItem
```

### Create Menu Item (Admin)
```typescript
POST /menu
Authorization: Bearer <admin-token>
{
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVeg: boolean;
  isSpicy: boolean;
  tags: string[];
  preparationTime: number;
}

Response: MenuItem
```

### Update Menu Item (Admin)
```typescript
PUT /menu/:id
Authorization: Bearer <admin-token>
{
  // Any MenuItem fields to update
}

Response: MenuItem
```

### Delete Menu Item (Admin)
```typescript
DELETE /menu/:id
Authorization: Bearer <admin-token>

Response: {
  message: "Item deleted successfully"
}
```

### Toggle Availability (Admin)
```typescript
PATCH /menu/:id/availability
Authorization: Bearer <admin-token>
{
  available: boolean;
}

Response: MenuItem
```

---

## 🛒 Order Endpoints

### Create Order
```typescript
POST /orders
Authorization: Bearer <token>
{
  items: Array<{
    itemId: string;
    quantity: number;
  }>;
  deliveryAddress: string;
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
}

Response: Order
```

### Get User Orders
```typescript
GET /orders
Authorization: Bearer <token>
Query: {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}

Response: Order[]
```

### Get Single Order
```typescript
GET /orders/:id
Authorization: Bearer <token>

Response: Order
```

### Update Order Status (Admin)
```typescript
PATCH /orders/:id/status
Authorization: Bearer <admin-token>
{
  status: OrderStatus;
}

Response: Order
```

### Get All Orders (Admin)
```typescript
GET /admin/orders
Authorization: Bearer <admin-token>
Query: {
  status?: OrderStatus;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

Response: {
  orders: Order[];
  total: number;
  page: number;
}
```

### Cancel Order
```typescript
POST /orders/:id/cancel
Authorization: Bearer <token>

Response: Order
```

---

## 💳 Coupon Endpoints

### Validate Coupon
```typescript
POST /coupons/validate
Authorization: Bearer <token>
{
  code: string;
  orderAmount: number;
}

Response: {
  valid: boolean;
  discount: number;
  finalAmount: number;
  coupon?: Coupon;
}
```

### Get All Coupons (Admin)
```typescript
GET /admin/coupons
Authorization: Bearer <admin-token>

Response: Coupon[]
```

### Create Coupon (Admin)
```typescript
POST /admin/coupons
Authorization: Bearer <admin-token>
{
  code: string;
  discount: number;
  minAmount: number;
  maxDiscount: number;
  validUntil: Date;
  usageLimit: number;
}

Response: Coupon
```

### Update Coupon (Admin)
```typescript
PUT /admin/coupons/:id
Authorization: Bearer <admin-token>
{
  // Any Coupon fields to update
}

Response: Coupon
```

### Toggle Coupon Status (Admin)
```typescript
PATCH /admin/coupons/:id/toggle
Authorization: Bearer <admin-token>

Response: Coupon
```

### Delete Coupon (Admin)
```typescript
DELETE /admin/coupons/:id
Authorization: Bearer <admin-token>

Response: {
  message: "Coupon deleted successfully"
}
```

---

## 👥 User Endpoints (Admin)

### Get All Users
```typescript
GET /admin/users
Authorization: Bearer <admin-token>
Query: {
  role?: 'user' | 'admin';
  search?: string;
  limit?: number;
  offset?: number;
}

Response: {
  users: User[];
  total: number;
}
```

### Get User Details
```typescript
GET /admin/users/:id
Authorization: Bearer <admin-token>

Response: {
  user: User;
  stats: {
    totalOrders: number;
    totalSpent: number;
    avgOrderValue: number;
  };
}
```

### Update User Role
```typescript
PATCH /admin/users/:id/role
Authorization: Bearer <admin-token>
{
  role: 'user' | 'admin';
}

Response: User
```

---

## 📊 Analytics Endpoints (Admin)

### Get Dashboard Stats
```typescript
GET /admin/analytics/dashboard
Authorization: Bearer <admin-token>

Response: {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalUsers: number;
  avgOrderValue: number;
  recentOrders: Order[];
}
```

### Get Revenue Stats
```typescript
GET /admin/analytics/revenue
Authorization: Bearer <admin-token>
Query: {
  period: 'today' | 'week' | 'month' | 'year';
}

Response: {
  revenue: number;
  orders: number;
  avgOrderValue: number;
  chart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}
```

### Get Popular Items
```typescript
GET /admin/analytics/popular-items
Authorization: Bearer <admin-token>
Query: {
  limit?: number;
}

Response: Array<{
  item: MenuItem;
  orderCount: number;
  revenue: number;
}>;
```

---

## 🤖 AI Recommendations

### Get AI Recommendations
```typescript
POST /ai/recommendations
Authorization: Bearer <token>
{
  query?: string;
  userId?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
}

Response: {
  items: MenuItem[];
  reason: string;
}
```

### Image-Based Search
```typescript
POST /ai/image-search
Authorization: Bearer <token>
Content-Type: multipart/form-data
{
  image: File;
}

Response: {
  items: MenuItem[];
  confidence: number;
}
```

---

## 💬 Chat Endpoints (Future)

### Send Message
```typescript
POST /chat/orders/:orderId/messages
Authorization: Bearer <token>
{
  message: string;
}

Response: ChatMessage
```

### Get Chat History
```typescript
GET /chat/orders/:orderId/messages
Authorization: Bearer <token>

Response: ChatMessage[]
```

---

## 🔔 Notification Endpoints

### Get User Notifications
```typescript
GET /notifications
Authorization: Bearer <token>

Response: Notification[]
```

### Mark as Read
```typescript
PATCH /notifications/:id/read
Authorization: Bearer <token>

Response: Notification
```

### Send Push Notification (Admin)
```typescript
POST /admin/notifications/push
Authorization: Bearer <admin-token>
{
  userId?: string;  // Optional, for specific user
  title: string;
  body: string;
  data?: any;
}

Response: {
  sent: number;
  failed: number;
}
```

---

## 💰 Payment Endpoints

### Create Razorpay Order
```typescript
POST /payment/create-order
Authorization: Bearer <token>
{
  amount: number;
  currency: 'INR';
  orderId: string;
}

Response: {
  id: string;  // Razorpay order ID
  amount: number;
  currency: string;
}
```

### Verify Payment
```typescript
POST /payment/verify
Authorization: Bearer <token>
{
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

Response: {
  verified: boolean;
  order: Order;
}
```

---

## 📄 Invoice Endpoints

### Generate Invoice
```typescript
GET /orders/:id/invoice
Authorization: Bearer <token>

Response: PDF file
```

### Email Invoice
```typescript
POST /orders/:id/invoice/email
Authorization: Bearer <token>
{
  email?: string;  // Optional, defaults to user email
}

Response: {
  message: "Invoice sent successfully"
}
```

---

## 🔍 Search Endpoints

### Global Search
```typescript
GET /search
Query: {
  q: string;
  type?: 'menu' | 'orders' | 'users';
}

Response: {
  menu: MenuItem[];
  orders: Order[];
  users: User[];  // Admin only
}
```

---

## 📱 Health & Status

### Health Check
```typescript
GET /health

Response: {
  status: 'ok';
  timestamp: string;
  version: string;
}
```

### API Version
```typescript
GET /version

Response: {
  version: string;
  environment: string;
}
```

---

## 🔒 Authorization Levels

```typescript
enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

// Route Access Matrix
const routeAccess = {
  '/menu': ['public'],
  '/orders': ['user', 'admin'],
  '/admin/*': ['admin'],
  '/auth/*': ['public'],
};
```

---

## 📦 Data Models

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: number;
  updatedAt?: number;
  avatar?: string;
}
```

### MenuItem
```typescript
interface MenuItem {
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
  createdAt: number;
  updatedAt?: number;
}
```

### Order
```typescript
interface Order {
  id: string;
  userId: string;
  userName: string;
  items: Array<{
    itemId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
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

### Coupon
```typescript
interface Coupon {
  id: string;
  code: string;
  discount: number;  // percentage
  minAmount: number;
  maxDiscount: number;
  validUntil: number;
  active: boolean;
  usageLimit: number;
  usedCount: number;
  createdAt: number;
}
```

---

## 🚨 Error Responses

### Standard Error Format
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

### Common Error Codes
```typescript
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict (e.g., duplicate coupon code)
422 - Unprocessable Entity (validation error)
429 - Too Many Requests (rate limit)
500 - Internal Server Error
503 - Service Unavailable
```

---

## 📝 Rate Limiting

```typescript
// Limits per minute
{
  '/auth/login': 5,
  '/auth/register': 3,
  '/orders': 20,
  '/menu': 60,
  '/admin/*': 100
}
```

---

## 🔔 WebSocket Events (Real-time)

### Subscribe to Order Updates
```typescript
socket.emit('subscribe:order', { orderId });

socket.on('order:updated', (order: Order) => {
  // Handle order update
});
```

### Admin Dashboard Updates
```typescript
socket.emit('subscribe:admin');

socket.on('new:order', (order: Order) => {
  // New order notification
});

socket.on('order:status-changed', (data) => {
  // Order status changed
});
```

---

## 📚 API Client Example

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
const menuItems = await api.get('/menu');
const order = await api.post('/orders', orderData);
```

---

**🎉 Complete API documentation for backend integration!**
