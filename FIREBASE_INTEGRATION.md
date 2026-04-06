# Firebase Integration Guide

## Overview

This application is structured to easily integrate with Firebase services. Currently using localStorage for demo purposes.

## Services to Integrate

### 1. Firebase Authentication

**Replace in**: `src/app/context/AuthContext.tsx`

```typescript
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();

// Login
await signInWithEmailAndPassword(auth, email, password);

// Register
await createUserWithEmailAndPassword(auth, email, password);
```

### 2. Cloud Firestore

**Collections Structure**:

```
users/
  {userId}/
    - email, name, phone, role, createdAt

menu/
  {itemId}/
    - name, description, price, category, image, isVeg, isSpicy, rating, tags, available

orders/
  {orderId}/
    - userId, userName, items[], totalAmount, discount, finalAmount, status, createdAt, paymentMethod

coupons/
  {couponId}/
    - code, discount, minAmount, maxDiscount, validUntil, active, usageLimit, usedCount

chat/
  {chatId}/
    messages/
      {messageId}/
        - orderId, senderId, message, timestamp, isAdmin
```

**Replace mock data with**:

```typescript
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const db = getFirestore();

// Get menu items
const menuSnapshot = await getDocs(collection(db, 'menu'));
const items = menuSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

// Add order
await addDoc(collection(db, 'orders'), orderData);

// Update order status
await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
```

### 3. Firebase Storage

**For menu item images**:

```typescript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage();

// Upload image
const imageRef = ref(storage, `menu/${itemId}.jpg`);
await uploadBytes(imageRef, file);
const url = await getDownloadURL(imageRef);
```

### 4. Firebase Cloud Messaging (FCM)

**For push notifications**:

```typescript
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const messaging = getMessaging();

// Get FCM token
const token = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' });

// Listen for messages
onMessage(messaging, (payload) => {
  console.log('Notification received:', payload);
  // Show notification
});
```

## Firebase Configuration

Create `src/app/config/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const messaging = getMessaging(app);
```

## Razorpay Integration

### Setup

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your API keys from dashboard
3. Install Razorpay SDK:

```bash
pnpm install razorpay
```

### Implementation

**In Cart checkout flow** (`src/app/components/user/Cart.tsx`):

```typescript
const handleRazorpayPayment = () => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY,
    amount: finalAmount * 100, // Amount in paise
    currency: 'INR',
    name: 'CafeByte',
    description: 'Food Order Payment',
    order_id: orderId,
    handler: function (response: any) {
      // Payment successful
      console.log(response.razorpay_payment_id);
      // Update order status
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
    theme: {
      color: '#f97316', // Orange-500
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

**Add Razorpay script to index.html**:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

## Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Everyone can read menu
    match /menu/{itemId} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users can read their own orders
    match /orders/{orderId} {
      allow read: if request.auth.uid == resource.data.userId ||
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null;
      allow update: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Only admins can manage coupons
    match /coupons/{couponId} {
      allow read: if true;
      allow write: if get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /menu/{imageId} {
      allow read: if true;
      allow write: if request.auth != null &&
                      request.resource.size < 5 * 1024 * 1024 &&
                      request.resource.contentType.matches('image/.*');
    }
  }
}
```

## Environment Variables

Create `.env` file:

```env
# Firebase
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key

# Razorpay
REACT_APP_RAZORPAY_KEY=your_razorpay_key
REACT_APP_RAZORPAY_SECRET=your_razorpay_secret
```

## Migration Steps

1. **Install Firebase SDK**:
   ```bash
   pnpm install firebase
   ```

2. **Create Firebase project** at [Firebase Console](https://console.firebase.google.com/)

3. **Enable services**:
   - Authentication (Email/Password)
   - Cloud Firestore
   - Storage
   - Cloud Messaging

4. **Replace mock implementations** in:
   - `src/app/context/AuthContext.tsx`
   - `src/app/data/mockData.ts` (convert to Firebase queries)
   - `src/app/components/admin/*.tsx` (replace localStorage with Firestore)

5. **Test thoroughly** before deploying

## Tips

- Use Firebase Emulator Suite for local development
- Implement proper error handling for all Firebase operations
- Add loading states during Firebase operations
- Use Firebase Analytics to track user behavior
- Set up Cloud Functions for server-side logic (order processing, notifications)
- Implement rate limiting to prevent abuse

---

Need help? Check [Firebase Documentation](https://firebase.google.com/docs)
