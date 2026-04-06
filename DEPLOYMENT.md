# 🚀 Deployment Guide

## Overview

This guide covers deploying CafeByte to production with a real backend.

---

## 📦 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] Backend configured (Supabase/Firebase)
- [ ] Environment variables set
- [ ] Payment gateway configured
- [ ] Domain name ready (optional)

---

## 🔥 Option 1: Vercel (Recommended)

### Why Vercel?
- ✅ Zero-config React deployment
- ✅ Automatic SSL
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Free tier available

### Steps

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Login**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables** (in Vercel dashboard)
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_RAZORPAY_KEY=your_razorpay_key
```

5. **Deploy to Production**
```bash
vercel --prod
```

---

## 🌐 Option 2: Netlify

### Why Netlify?
- ✅ Easy continuous deployment
- ✅ Form handling
- ✅ Split testing
- ✅ Edge functions

### Steps

1. **Install Netlify CLI**
```bash
npm i -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Initialize**
```bash
netlify init
```

4. **Deploy**
```bash
netlify deploy --prod
```

5. **Set Environment Variables**
```bash
netlify env:set VITE_FIREBASE_API_KEY your_key
netlify env:set VITE_RAZORPAY_KEY your_key
```

---

## 🐳 Option 3: Docker

### Dockerfile

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Build & Run

```bash
docker build -t cafebyte .
docker run -p 80:80 cafebyte
```

---

## ☁️ Option 4: AWS S3 + CloudFront

### Steps

1. **Build the app**
```bash
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://cafebyte-app
```

3. **Upload files**
```bash
aws s3 sync dist/ s3://cafebyte-app --acl public-read
```

4. **Enable static website hosting**
```bash
aws s3 website s3://cafebyte-app --index-document index.html
```

5. **Create CloudFront distribution** (optional, for CDN)

---

## 🔗 Supabase Setup (Backend)

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for setup to complete

### 2. Create Tables

Run in SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Menu table
CREATE TABLE menu (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  is_veg BOOLEAN DEFAULT true,
  is_spicy BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  tags TEXT[],
  available BOOLEAN DEFAULT true,
  preparation_time INTEGER DEFAULT 15,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  user_name TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  final_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  coupon_code TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Coupons table
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  discount INTEGER NOT NULL,
  min_amount NUMERIC NOT NULL,
  max_discount NUMERIC NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  active BOOLEAN DEFAULT true,
  usage_limit INTEGER DEFAULT 100,
  used_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Enable Row Level Security

```sql
-- Users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Menu (public read)
ALTER TABLE menu ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menu"
  ON menu FOR SELECT
  TO public
  USING (true);

-- Orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

### 4. Get Connection Details

From Supabase Dashboard → Settings → API:
- Project URL
- Public anon key

### 5. Update Code

In your app, replace localStorage with Supabase client:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Example: Get menu
const { data } = await supabase.from('menu').select('*');
```

---

## 💳 Razorpay Setup

### 1. Sign Up
Go to [razorpay.com](https://razorpay.com) and create account

### 2. Get API Keys
Dashboard → Settings → API Keys → Generate Test Key

### 3. Add Script to index.html
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 4. Update Cart Component

```typescript
const handlePayment = () => {
  const options = {
    key: process.env.VITE_RAZORPAY_KEY,
    amount: finalAmount * 100,
    currency: 'INR',
    name: 'CafeByte',
    description: 'Food Order',
    handler: function(response) {
      // Payment successful
      console.log(response.razorpay_payment_id);
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

---

## 🌍 Custom Domain

### Vercel
1. Go to Vercel Dashboard
2. Project Settings → Domains
3. Add your domain
4. Update DNS records as instructed

### Netlify
1. Go to Netlify Dashboard
2. Domain Settings → Add custom domain
3. Update DNS records

---

## 📊 Monitoring & Analytics

### Google Analytics
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Sentry (Error Tracking)
```bash
npm install @sentry/react
```

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: "production",
});
```

---

## 🔒 Security Checklist

- [ ] Enable HTTPS (automatic with Vercel/Netlify)
- [ ] Set environment variables (never commit .env)
- [ ] Enable CORS properly
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use CSP headers
- [ ] Enable Supabase RLS policies

---

## 📱 PWA (Progressive Web App)

### 1. Add manifest.json

```json
{
  "name": "CafeByte",
  "short_name": "CafeByte",
  "description": "AI-Powered Food Ordering",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 2. Add Service Worker

```javascript
// service-worker.js
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('cafebyte-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js',
      ]);
    })
  );
});
```

---

## ✅ Post-Deployment Checklist

- [ ] Test all user flows
- [ ] Test admin flows
- [ ] Test payment flow
- [ ] Test on mobile devices
- [ ] Test dark/light mode
- [ ] Check loading times
- [ ] Test error scenarios
- [ ] Verify SSL certificate
- [ ] Check console for errors
- [ ] Test PWA installation
- [ ] Setup monitoring
- [ ] Setup backups
- [ ] Document known issues

---

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear cache
rm -rf node_modules
pnpm install

# Type check
tsc --noEmit
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check `.env` is in `.gitignore`

### Deployment Fails
- Check build logs
- Verify all dependencies in package.json
- Test build locally first: `npm run build`

---

## 📞 Support

- **Documentation**: See README.md
- **Issues**: Create GitHub issue
- **Questions**: Check QUICK_REFERENCE.md

---

**🎉 Ready to Deploy!**

Start with Vercel for the easiest deployment experience.
