# AMICE AMARINE — Anime Streetwear E-Commerce Platform

Amice Amarine is an editorial, high-octane anime streetwear fashion e-commerce storefront and full-scale administration dashboard inspired by contemporary street culture, heavy graphic aesthetics, and luxury oversized silhouettes.

## 🚀 Architecture Highlights
- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, TypeScript, REST API, Zod schema validation.
- **Database**: MongoDB with Mongoose ODM (Normalized schemas, variant-level inventory, atomic stock decrementing, transaction logs).
- **Authentication**: Dual-tier Auth (Customers & Admin RBAC: Super Admin, Manager, Order Manager) with secure HTTP-only cookies and JWT.
- **Payments**: Provider abstraction layer featuring Razorpay for India (UPI, Netbanking, Cards) and optional Stripe + Cash on Delivery.
- **Admin Dashboard**: Comprehensive /admin suite for Products, Categories, Orders, Customers, Coupons, Media, Analytics, and Store Settings.

## 📂 Project Structure
```
amice_amarine/
├── backend/          # Express.js REST API with TypeScript & MongoDB
│   ├── src/
│   │   ├── config/   # DB connection, env validation, constants
│   │   ├── models/   # Mongoose schemas (User, Product, Order, etc.)
│   │   ├── routes/   # Express routers
│   │   ├── controllers/
│   │   ├── middleware/ # Auth, RBAC, error handling, validation
│   │   ├── utils/    # Seeders, JWT helpers, API response formatters
│   │   └── server.ts # Server entry point
├── frontend/         # Next.js customer storefront & admin UI
│   ├── app/          # App router pages
│   ├── components/   # UI kit, layout, product widgets
│   ├── lib/          # API client, utilities
│   └── types/        # Shared data interfaces
├── docs/             # Architecture, Database schemas, API specs
├── .env.example      # Environment variables template
└── package.json      # Root orchestration scripts
```

## 🛠️ Quick Start

### 1. Prerequisites
- Node.js >= 18 (Tested on Node.js v24)
- MongoDB running locally on port 27017 or a MongoDB Atlas URI

### 2. Installation
```bash
# Install all dependencies across backend and frontend
npm install
```

### 3. Database Seeding
```bash
npm run seed
```
Seeds initial categories, store settings, demo anime streetwear products, and default administrator credentials.

### 4. Running the Dev Servers
```bash
# Run both Backend (port 5000) and Frontend (port 3000) concurrently
npm run dev
```

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin Portal: [http://localhost:3000/admin](http://localhost:3000/admin)
- Backend API Health: [http://localhost:5000/api/health](http://localhost:5000/api/health)
