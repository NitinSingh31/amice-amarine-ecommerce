# REST API Specification — Amice Amarine

All endpoints respond with standardized JSON envelopes:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional descriptive status message"
}
```
Error envelopes:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR | UNAUTHORIZED | NOT_FOUND | INTERNAL_SERVER_ERROR",
    "message": "Human-readable error description",
    "details": [ ... ]
  }
}
```

## 1. System & Public APIs
- `GET /api/health` — Returns server status, uptime, environment, and MongoDB connection state.
- `GET /api/settings/public` — Returns public storefront settings (Announcement bar, Hero banner, Shipping thresholds).
- `GET /api/categories` — List all active categories with product counts.
- `GET /api/categories/:slug` — Category details by slug.
- `GET /api/products` — List/search products with filters (category, size, color, price range, sort).
- `GET /api/products/:slug` — Full product details with variants, specs, and stock indicators.
- `GET /api/products/featured` — Featured anime streetwear drops.
- `GET /api/products/new-arrivals` — Latest catalog additions.

## 2. Authentication APIs (`/api/auth`)
- `POST /api/auth/register` — Register customer account (Validates name, email, password >= 8 chars).
- `POST /api/auth/login` — Customer/Admin login with JWT cookie generation.
- `POST /api/auth/logout` — Clears auth session cookie.
- `GET /api/auth/me` — Returns current authenticated user profile and roles.
- `PUT /api/auth/profile` — Update profile info and addresses.

## 3. Cart & Checkout APIs (`/api/cart`, `/api/checkout`)
- `GET /api/cart` — Fetch active cart for user or guest session token.
- `POST /api/cart/items` — Add item/variant to cart with real-time stock check.
- `PUT /api/cart/items/:itemId` — Update quantity.
- `DELETE /api/cart/items/:itemId` — Remove item from cart.
- `POST /api/cart/apply-coupon` — Server-side coupon validation.
- `POST /api/checkout/quote` — Real-time price, discount, tax, and shipping calculation.
- `POST /api/checkout/create-order` — Create pending order & generate Razorpay order ID.

## 4. Protected Admin APIs (`/api/admin/*`)
- `GET /api/admin/dashboard/stats` — Revenue, orders breakdown, low-stock warnings, top products.
- `GET /api/admin/products` — Admin product table with pagination, draft filters, and SKU search.
- `POST /api/admin/products` — Create new product with variants and images.
- `PUT /api/admin/products/:id` — Update product and variants.
- `DELETE /api/admin/products/:id` — Archive product (preserves historical order integrity).
- `GET /api/admin/orders` — Orders management with status filters and customer search.
- `PUT /api/admin/orders/:id/status` — Update fulfillment and tracking numbers.
- `PUT /api/admin/settings` — Update Announcement bar, hero banners, shipping rates.
