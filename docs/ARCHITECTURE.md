# System Architecture — Amice Amarine

## Overview
Amice Amarine is built as a modular multi-tier e-commerce system decoupled into an Express.js API backend and a Next.js App Router frontend, sharing TypeScript schemas and security standards.

```
+-------------------------------------------------------------+
|               CUSTOMER & ADMIN CLIENT (Next.js)              |
|  - Modern Editorial Anime Streetwear UX (Dark Mode)        |
|  - Server & Client Components (Tailwind CSS, Lucide)        |
|  - Customer Accounts, Wishlist, Cart Drawer, Checkout UI    |
|  - Dedicated /admin Dashboard with RBAC Protected Views     |
+------------------------------+------------------------------+
                               | HTTPS / REST / JSON
                               v
+-------------------------------------------------------------+
|                 EXPRESS.JS BACKEND (Node.js)                |
|  - Helmet, CORS, Morgan, Express Rate Limiter               |
|  - JWT Authentication + HttpOnly Secure Cookies             |
|  - Role-Based Access Control (Super Admin, Manager, Staff)  |
|  - Zod Request Body & Query Validation                      |
|  - Centralized Error Handling & AppError                    |
|  - Razorpay / Stripe Payment Gateway Abstraction            |
|  - Inventory Reservation & Concurrency Management           |
+------------------------------+------------------------------+
                               | Mongoose ODM
                               v
+-------------------------------------------------------------+
|                     MONGODB DATABASE                        |
|  - Users & Admins (Bcrypt hashed, indexes on email)         |
|  - Categories & Products with embedded Variants & SKUs      |
|  - Orders with immutable item snapshots & tracking timeline |
|  - Payments, Coupons, Store Settings, Audit Logs            |
+-------------------------------------------------------------+
```

## Security Baseline
1. **Password Hashing**: Strong bcrypt (12 salt rounds) with automated pre-save hooks.
2. **Session Security**: JWT stored in HTTP-Only, SameSite, Secure cookies with automatic expiration.
3. **Price Integrity**: Zero frontend trust. All product prices, discounts, coupons, shipping, and taxes are recalculated strictly server-side before order creation.
4. **Payment Idempotency**: Razorpay signature verification and server-side payment order reconciliation prevents replay attacks or double-fulfillment.
5. **Inventory Safety**: Atomic stock decrementing using MongoDB operations (`$inc: { stock: -qty }` with `stock >= qty` filter) ensures zero overselling during flash drops.
