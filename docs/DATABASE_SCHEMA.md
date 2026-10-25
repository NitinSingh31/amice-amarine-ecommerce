# Database Schemas — Mongoose Models Design

### 1. User (`User.ts`)
- `_id`: ObjectId
- `name`: String (required, trimmed)
- `email`: String (required, unique, lowercase, indexed)
- `password`: String (bcrypt hashed)
- `phone`: String
- `role`: Enum ['customer', 'super_admin', 'manager', 'order_manager']
- `addresses`: Array of Address subdocuments (street, city, state, postalCode, country, isDefault)
- `wishlist`: Array of Product ObjectIds
- `isActive`: Boolean (default: true)
- `timestamps`: createdAt, updatedAt

### 2. Category (`Category.ts`)
- `_id`: ObjectId
- `name`: String (e.g., 'Oversized T-Shirts', 'Hoodies', 'Denim Jackets')
- `slug`: String (unique, slugified)
- `description`: String
- `image`: String (URL or uploads path)
- `parentCategory`: ObjectId (optional self-reference for subcategories)
- `sortOrder`: Number
- `isActive`: Boolean (default: true)
- `timestamps`: createdAt, updatedAt

### 3. Product & ProductVariant (`Product.ts`)
- `name`: String (e.g., "ASTA // BLACK BULLS VEST", "GOJO // VOID OVERSIZED HOODIE")
- `slug`: String (unique, indexed)
- `description`: String (Markdown/HTML rich text)
- `category`: ObjectId (ref Category, indexed)
- `basePrice`: Number (INR)
- `compareAtPrice`: Number (Original MRP for discount calculation)
- `discountPercentage`: Number (auto-calculated virtual or stored)
- `images`: Array of Strings (Primary, Back, Detail, Model)
- `tags`: Array of Strings (e.g. ['oversized', 'jujutsu', 'heavyweight-280gsm', 'bestseller'])
- `specifications`: Map / Object (GSM: "280 GSM Terry Cotton", Fit: "Boxy Oversized", Print: "High-density puff screen print")
- `careInstructions`: Array of Strings
- `isFeatured`: Boolean
- `isBestseller`: Boolean
- `isNewArrival`: Boolean
- `status`: Enum ['draft', 'published', 'archived']
- `variants`: [
    {
      _id: ObjectId,
      sku: String (unique, e.g. "AA-HOOD-GOJO-BLK-L"),
      size: Enum ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'FREE_SIZE'],
      color: String,
      colorHex: String,
      stock: Number (default: 0),
      priceAdjustment: Number (default: 0)
    }
  ]
- `totalStock`: Number (calculated aggregate)

### 4. Order & OrderItem (`Order.ts`)
- `orderNumber`: String (Unique, e.g. "AA-2026-1001", indexed)
- `user`: ObjectId (ref User, optional for guest checkout)
- `customerEmail`: String
- `customerPhone`: String
- `shippingAddress`: Subdocument (name, address, city, state, postalCode, country)
- `items`: [
    {
      productId: ObjectId,
      variantId: ObjectId,
      productName: String (immutable snapshot),
      variantTitle: String (e.g. "Size L / Obsidian Black"),
      sku: String,
      image: String,
      unitPrice: Number,
      quantity: Number,
      totalPrice: Number
    }
  ]
- `subtotal`: Number
- `discountAmount`: Number
- `couponCode`: String
- `shippingFee`: Number
- `taxAmount`: Number
- `totalAmount`: Number
- `paymentMethod`: Enum ['razorpay', 'stripe', 'cod']
- `paymentStatus`: Enum ['pending', 'paid', 'failed', 'refunded']
- `fulfillmentStatus`: Enum ['order_placed', 'payment_confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned']
- `trackingNumber`: String
- `courierName`: String
- `statusHistory`: Array of { status, timestamp, note, updatedBy }

### 5. StoreSettings (`StoreSettings.ts`)
- `storeName`: String ("Amice Amarine")
- `announcementBar`: {
    text: String ("EXCLUSIVE DROP: FLAT 15% OFF PREPAID ORDERS | FREE DOMESTIC SHIPPING OVER ₹999"),
    link: String ("/collections/all-products"),
    isActive: Boolean,
    backgroundColor: String,
    textColor: String
  }
- `heroBanner`: {
    headline: String ("ANIME STREETWEAR REIMAGINED"),
    subheadline: String ("Heavyweight 280 GSM Cotton. Raw Urban Silhouettes. Drop 01 Live Now."),
    ctaText: String ("EXPLORE THE DROP"),
    ctaLink: String ("/collections/new-arrivals"),
    backgroundImage: String
  }
- `shipping`: {
    freeShippingThreshold: Number (999),
    standardShippingFee: Number (99),
    codEnabled: Boolean (true),
    codFee: Number (50)
  }
- `socialLinks`: { instagram: String, twitter: String, discord: String }
