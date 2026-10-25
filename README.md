# AMICE AMARINE // PREMIUM ANIME STREETWEAR & ADMIN PLATFORM

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Amice Amarine** is an editorial, production-grade e-commerce platform and administrative control room for high-octane anime streetwear culture, inspired by the aesthetic, layout, and shopping experience of [Zenin.co.in](https://zenin.co.in/).
>
> Features heavy luxury knit silhouettes (280–320 GSM French Terry), cyberpunk dark mode aesthetics, atomic inventory management, server-side verified cart & checkout, dual-mode Razorpay payment processing, GPS milestone order tracking, and a full-featured admin management dashboard.

---

## ⚡ Architecture & Tech Stack

```
+-------------------------------------------------------------+
|               CUSTOMER & ADMIN CLIENT (Next.js 14)          |
|  - App Router, Server & Client Components                   |
|  - Editorial Cyberpunk Anime Streetwear Design System       |
|  - Slide-Over Cart Drawer, Live Debounced Search Modal      |
|  - Multi-Angle Lookbook Gallery, Interactive PIN Delivery   |
|  - Public Order Radar Tracking (/tracking?order=...)        |
|  - Complete Admin Control Suite (/admin) with RBAC Guards   |
+------------------------------+------------------------------+
                               | REST API (JSON / Cookies)
                               v
+-------------------------------------------------------------+
|               EXPRESS.JS BACKEND (Node.js + TypeScript)     |
|  - Helmet, CORS, Morgan, Express Rate Limiter               |
|  - JWT Authentication + HttpOnly Secure Cookie Management   |
|  - Role-Based Access Control (Super Admin, Manager, Staff)  |
|  - Zod Request Body & Query Validation                      |
|  - Atomic Inventory Concurrency Management ($inc stock)     |
|  - Razorpay Gateway Service (Dual Live & Developer Sandbox) |
|  - Indian GST Tax Invoice Generation (CGST 2.5%, SGST 2.5%) |
+------------------------------+------------------------------+
                               | Mongoose ODM
                               v
+-------------------------------------------------------------+
|                     MONGODB DATABASE                        |
|  - Users & Admins (Bcrypt-12 hashed passwords)              |
|  - Products with embedded Variants & Unique SKUs            |
|  - Orders with immutable item snapshots & tracking history  |
|  - Coupons Engine (Percentage, Fixed, Min Cart, Usage Caps) |
|  - Store Settings (Dynamic Banners, Shipping Fees, COD)     |
+-------------------------------------------------------------+
```

---

## 🚀 Key Features Implemented Across All 7 Phases

### Phase 1: Foundation & Design System
- Monorepo structure with decoupled `backend/` and `frontend/`.
- Mongoose schemas (`User`, `Product`, `Category`, `Cart`, `Order`, `StoreSettings`).
- Dark anime streetwear design tokens, neon accents (`#FF003C` crimson glow, `#00F5FF` cyan, `#0A0A0C` surface), custom scrollbars, and modern typography.
- Initial catalog seeding with 10 anime streetwear pieces and Super Admin credentials.

### Phase 2: Storefront Shopping Experience
- Slide-over **Cart Drawer** with live subtotal calculation and dynamic free shipping progress bar (threshold: ₹999).
- Debounced **Live Search Modal** with suggestions API (`/api/search/suggestions`) and dedicated `/search` page.
- Interactive **Filter Sidebar** (sizes XS–XXL, categories, price range, discount pills, sort by newest/price).
- Comprehensive **Product Details Page** (`/products/[slug]`) with multi-angle image gallery, size selector pills, live stock indicator, 6-digit Indian PIN code delivery checker, fabric specifications, and size chart modal.
- Editorial Homepage with Hero Cyberpunk Video/Banner, Curated Category Matrix, Best Sellers Grid, and Instagram Syndicate Lookbook.

### Phase 3: Authentication & Customer Dashboard
- Dual authentication via JWT tokens and HttpOnly secure cookies.
- Customer registration and login with 1-click **Demo Customer** and **Super Admin** fill buttons.
- Tabbed **Customer Account Dashboard** (`/account`):
  - Personal Details (Name, email, phone)
  - Saved Shipping Addresses (Add, delete, set default)
  - Order History archive with live delivery status
  - Security settings
- Synchronized Customer **Wishlist** (`/account/wishlist`).

### Phase 4: Cart Persistence & Server-Side Checkout
- Context-backed cart persistence with localStorage sync and coupon engine.
- Active seeded coupons (`AMICE15` for 15% off, `DROP100` for ₹100 flat cash, `OVERSIZED20` for 20% off hauls above ₹1,999).
- **Server Price Validation**: All pricing, coupon discounts, prepaid discounts (10% online bonus), and shipping fees are recalculated strictly on the server (`/api/checkout/quote`).
- **Atomic Concurrency Protection**: Inventory stock is atomically checked and decremented via MongoDB operations to eliminate overselling during high-demand drops.

### Phase 5: Payments, Tracking Radar & Invoicing
- **Razorpay Payment Integration**: Dual-mode service supporting live production API keys and local sandbox simulation with HMAC-SHA256 signature verification.
- **Live Radar Tracking** (`/tracking?order=AA-2026-XXXX`): 6-milestone visual stepper (Placed → Payment Verified → Packed → Shipped in Transit → Out for Delivery → Delivered) with courier partner details (**Delhivery Express**, **Bluedart Express**) and Air Waybill (AWB) copy.
- **GST Tax Invoice Modal**: Generates official Indian GST invoices (HSN `61091000`, GSTIN `27AABCA1234F1Z5`, CGST 2.5%, SGST 2.5%) with 1-click printing (`window.print()`).
- **Self-Service Order Cancellation**: Allows customers to cancel orders before dispatch, atomically restoring items to inventory.

### Phase 6: Admin Dashboard & Control Room (`/admin`)
- **Restricted Clearance Gate**: Secured with Role-Based Access Control (`super_admin`, `manager`, `order_manager`) and 1-click Super Admin authentication.
- **Executive Analytics Overview**: Live KPI metric cards (Gross Revenue, Total Orders, Average Order Value, Catalog Count, Low Stock Alerts) + order pipeline distribution + recent transaction streams.
- **Products Catalog CRUD**: Create new anime garments with multi-size stock matrix (S–XXL) and automated SKU generation, edit prices, and archive products.
- **Orders & Fulfillment Management**: Filter orders by status, view shipping addresses, update fulfillment state, assign courier partners, and attach AWB codes.
- **Coupons Manager**: Create, view usage, and deactivate promo codes.
- **Store Settings Editor**: Update announcement banner text, free shipping threshold, standard fee, and COD settings live in MongoDB.

### Phase 7: Production Polish, SEO & Deployment
- SEO metadata with OpenGraph cards, Twitter cards, and JSON-LD structured schema for Apparel/OnlineStore.
- Dynamic `sitemap.xml` (`app/sitemap.ts`) and `robots.txt` (`app/robots.ts`).
- Multi-container `docker-compose.yml` and Dockerfiles for backend and frontend.
- Production process configuration (`ecosystem.config.cjs`) for PM2 cluster deployment.

---

## 🔑 Default Credentials (Pre-Seeded)

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Super Admin** | `admin@amiceamarine.com` | `Admin@Amice2026!` | Full Root Access to `/admin` Suite |
| **Demo Customer** | `shopper@amiceamarine.com` | `Shopper@Amice2026!` | Customer Storefront, Cart, Orders, Wishlist |

---

## 🛠️ Quickstart Guide

### 1. Prerequisites
- **Node.js** >= 18.0 (Tested on Node.js v24)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017/amice_amarine` (or MongoDB Atlas connection string)
- **Git**

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/NitinSingh31/amice-amarine-ecommerce.git
cd amice-amarine-ecommerce

# Install dependencies across both backend and frontend
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Database Seeding
```bash
# Seed initial categories, demo products, coupons, and admin accounts
cd backend
npm run seed
cd ..
```

### 4. Running the Development Servers
```bash
# Terminal 1: Backend API (runs on port 5000 with tsx watch)
cd backend
npm run dev

# Terminal 2: Frontend App (runs on port 3000)
cd frontend
npm run dev
```

- **Customer Storefront**: [http://localhost:3000](http://localhost:3000)
- **Order Tracking**: [http://localhost:3000/tracking](http://localhost:3000/tracking)
- **Admin Suite**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Backend API Health**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Healthcheck and server timestamp |
| `POST` | `/api/auth/register` | Public | Register customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated profile session |
| `GET` | `/api/products` | Public | Filtered and paginated products catalog |
| `GET` | `/api/products/:slug` | Public | Single product details with variant inventory |
| `GET` | `/api/categories` | Public | List categories with parent hierarchies |
| `GET` | `/api/search/suggestions` | Public | Live debounced search suggestions |
| `GET` | `/api/coupons/active` | Public | List active promotional discount codes |
| `POST` | `/api/coupons/apply` | Public | Validate coupon code against cart value |
| `POST` | `/api/checkout/quote` | Public | Server-side price, coupon, and shipping recalculation |
| `POST` | `/api/checkout/create-order` | Public | Atomic inventory check and order creation |
| `POST` | `/api/payments/razorpay/create-order` | Public | Create Razorpay payment transaction in paise |
| `POST` | `/api/payments/razorpay/verify` | Public | Verify payment signature (HMAC-SHA256) |
| `GET` | `/api/orders/track/:orderNumber` | Public | Public order tracking radar with milestones |
| `GET` | `/api/orders/:orderNumber/invoice` | Public | Compute 5% apparel GST tax invoice |
| `GET` | `/api/orders/my-orders` | Authenticated | Customer past orders list |
| `POST` | `/api/orders/:orderNumber/cancel` | Authenticated | Cancel order & restore inventory atomically |
| `GET` | `/api/admin/analytics` | Admin RBAC | Executive KPI metrics, revenue, and order breakdown |
| `GET` | `/api/admin/products` | Admin RBAC | Admin catalog with variant stock controls |
| `POST` | `/api/admin/products` | Admin RBAC | Create new anime streetwear garment |
| `PUT` | `/api/admin/products/:id` | Admin RBAC | Update product details & prices |
| `DELETE`| `/api/admin/products/:id` | Admin RBAC | Remove product from store |
| `GET` | `/api/admin/orders` | Admin RBAC | View all customer orders |
| `PUT` | `/api/admin/orders/:orderNumber/status` | Admin RBAC | Update status, assign courier & AWB tracking |
| `GET` | `/api/admin/coupons` | Admin RBAC | List all promo codes with usage counters |
| `POST` | `/api/admin/coupons` | Admin RBAC | Create new promotional discount voucher |
| `DELETE`| `/api/admin/coupons/:id` | Admin RBAC | Deactivate promotional code |
| `GET` | `/api/admin/settings` | Admin RBAC | Retrieve store policies and banner copy |
| `PUT` | `/api/admin/settings` | Admin RBAC | Save store settings to database |

---

## 🐳 Production Deployment

### Option A: Docker Compose (Recommended)
```bash
# Build and run MongoDB, Backend API, and Next.js frontend in detached mode
docker-compose up -d --build
```

### Option B: PM2 Process Manager (VPS)
```bash
# 1. Build backend and frontend
cd backend && npm run build
cd ../frontend && npm run build
cd ..

# 2. Launch with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
Built with passion for high-fashion anime streetwear enthusiasts.
