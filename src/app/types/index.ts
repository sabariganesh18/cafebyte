// Firebase-style data models

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'user' | 'admin';
  createdAt: number;
  avatar?: string;
}

export interface MenuItem {
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
  preparationTime: number; // in minutes
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
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

export interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage
  minAmount: number;
  maxDiscount: number;
  validUntil: number;
  active: boolean;
  usageLimit: number;
  usedCount: number;
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
  isAdmin: boolean;
}

export interface AIRecommendation {
  query: string;
  items: MenuItem[];
  reason: string;
}
