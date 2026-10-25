import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { StoreSettings } from '../models/StoreSettings.js';
import { USER_ROLES } from '../config/constants.js';

async function seedDatabase(): Promise<void> {
  try {
    await connectDB();
    console.log('[Seed] Re-seeding database with full anime streetwear catalog...');

    // 1. Seed Store Settings
    await StoreSettings.deleteMany({});
    await StoreSettings.create({
      storeName: 'Amice Amarine',
      announcementBar: {
        text: '⚡ EXCLUSIVE DROP: FLAT 15% OFF ON PREPAID ORDERS | FREE SHIPPING OVER ₹999',
        link: '/collections/all-products',
        isActive: true,
        backgroundColor: '#09090b',
        textColor: '#fafafa',
      },
      heroBanner: {
        headline: 'AMICE AMARINE // ANIME X STREETWEAR',
        subheadline: 'Heavyweight 280 GSM Cotton. Cyberpunk raw aesthetics. Engineered for the oversized lifestyle.',
        ctaText: 'EXPLORE THE DROP',
        ctaLink: '/collections/all-products',
        backgroundImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600&auto=format&fit=crop',
      },
      shipping: {
        freeShippingThreshold: 999,
        standardShippingFee: 99,
        codEnabled: true,
        codFee: 50,
      },
      socialLinks: {
        instagram: 'https://instagram.com/amiceamarine',
        discord: 'https://discord.gg/amiceamarine',
        twitter: 'https://twitter.com/amiceamarine',
      },
    });

    // 2. Seed Default Admin and Demo Customer
    await User.deleteMany({});
    await User.create({
      name: 'Amice Amarine Admin',
      email: 'admin@amiceamarine.com',
      password: 'Admin@Amice2026!',
      phone: '+91 9876543210',
      role: USER_ROLES.SUPER_ADMIN,
      isActive: true,
    });

    await User.create({
      name: 'Kenji Sato',
      email: 'shopper@amiceamarine.com',
      password: 'Customer@Amice2026!',
      phone: '+91 9123456789',
      role: USER_ROLES.CUSTOMER,
      isActive: true,
      addresses: [
        {
          fullName: 'Kenji Sato',
          phone: '+91 9123456789',
          addressLine1: 'Flat 402, Neo Tokyo Heights, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    // 3. Seed Full Categories
    await Category.deleteMany({});
    const categoriesData = [
      {
        name: 'Oversized T-Shirts',
        slug: 'oversized-t-shirts',
        description: '240-280 GSM luxury combed cotton oversized drop-shoulder graphic tees.',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        sortOrder: 1,
      },
      {
        name: 'Full Sleeves',
        slug: 'full-sleeves',
        description: 'Waffle textured and heavyweight thermal long-sleeves with sleeve typography.',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
        sortOrder: 2,
      },
      {
        name: 'Hoodies',
        slug: 'hoodies',
        description: '420 GSM brushed fleece winter armor with double-layered hoods and raw cyber typography.',
        image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
        sortOrder: 3,
      },
      {
        name: 'Jackets',
        slug: 'jackets',
        description: '14oz distressed denim, sherpa-lined utility outerwear, and tactical parkas.',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
        sortOrder: 4,
      },
      {
        name: 'Bottoms & Sweatpants',
        slug: 'bottoms',
        description: 'Barrel-fit cargo trackpants and relaxed sweatpants with bungee ankle toggles.',
        image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
        sortOrder: 5,
      },
      {
        name: 'Backpacks & Bags',
        slug: 'backpacks',
        description: 'Tactical crossbody sling packs and modular Cordura utility backpacks.',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
        sortOrder: 6,
      },
      {
        name: 'Vests',
        slug: 'vests',
        description: 'Raw drop armhole gym and streetwear graphic vests with reinforced ribbing.',
        image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
        sortOrder: 7,
      },
      {
        name: 'Compression Wear',
        slug: 'compression-wear',
        description: 'High-tensile moisture-wicking compression tees for training and layering.',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
        sortOrder: 8,
      },
      {
        name: 'Caps & Headwear',
        slug: 'caps',
        description: 'Low-profile distressed dad hats with 3D cyber embroidery.',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
        sortOrder: 9,
      },
      {
        name: 'Accessories & Desk Mats',
        slug: 'accessories',
        description: 'High-density 900x400mm gaming desk mats, anime socks, and tactical keychains.',
        image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
        sortOrder: 10,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = new Map(createdCategories.map((c) => [c.slug, c._id]));

    // 4. Seed Rich Product Catalog
    await Product.deleteMany({});
    const productsData = [
      {
        name: 'VOID DOMAIN // OVERSIZED GRAPHIC TEE',
        slug: 'void-domain-oversized-graphic-tee',
        subtitle: '280 GSM Heavy French Terry / Infinite Void Graphic',
        description: 'Constructed from custom-milled 280 GSM heavyweight combed cotton. Features an oversized boxy drop-shoulder cut with custom high-density puff screen printing inspired by metaphysical domain expansions. Silicon-washed for ultra-soft hand feel.',
        category: catMap.get('oversized-t-shirts'),
        basePrice: 1299,
        compareAtPrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['oversized', 'graphic-tee', 'jujutsu', 'heavyweight-cotton', 'bestseller'],
        specifications: {
          GSM: '280 GSM Luxury French Terry',
          Fit: 'Boxy Drop Shoulder Oversized Fit',
          Print: 'Multilayer Puff Screen Print + Metallic Accents',
          Finish: 'Pre-shrunk Silicon Bio-washed',
        },
        careInstructions: ['Machine wash cold inside out', 'Do not iron directly on graphics', 'Hang dry in shade'],
        isFeatured: true,
        isBestseller: true,
        isNewArrival: true,
        variants: [
          { sku: 'AA-VD-TEE-BLK-S', size: 'S', color: 'Obsidian Black', stock: 25 },
          { sku: 'AA-VD-TEE-BLK-M', size: 'M', color: 'Obsidian Black', stock: 40 },
          { sku: 'AA-VD-TEE-BLK-L', size: 'L', color: 'Obsidian Black', stock: 35 },
          { sku: 'AA-VD-TEE-BLK-XL', size: 'XL', color: 'Obsidian Black', stock: 20 },
        ],
      },
      {
        name: 'SHADOW MONARCH // HEAVYWEIGHT ZIP HOODIE',
        slug: 'shadow-monarch-heavyweight-zip-hoodie',
        subtitle: '420 GSM Brushed Fleece / Cyber Dagger Embroidery',
        description: 'Heavy-gauge 420 GSM brushed cotton fleece hoodie designed for ruthless winter streetwear. High-durability gunmetal two-way zipper, deep double-lined hood, and high-precision sleeve typography.',
        category: catMap.get('hoodies'),
        basePrice: 2499,
        compareAtPrice: 4999,
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['hoodie', 'solo-leveling', 'heavyweight-fleece', 'winter-armor', 'bestseller'],
        specifications: {
          GSM: '420 GSM Ultra Heavy Cotton Fleece',
          Hardware: 'Custom YKK Gunmetal 2-Way Zipper',
          Embroidery: '50,000 Stitch High Precision Monogram',
        },
        careInstructions: ['Dry clean recommended or cold gentle wash', 'Do not tumble dry'],
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        variants: [
          { sku: 'AA-SM-HOD-BLK-M', size: 'M', color: 'Midnight Pitch', stock: 15 },
          { sku: 'AA-SM-HOD-BLK-L', size: 'L', color: 'Midnight Pitch', stock: 30 },
          { sku: 'AA-SM-HOD-BLK-XL', size: 'XL', color: 'Midnight Pitch', stock: 12 },
        ],
      },
      {
        name: 'BLEACHED ESPADA // TACTICAL DENIM JACKET',
        slug: 'bleached-espada-tactical-denim-jacket',
        subtitle: '14oz Raw Denim / Distressed Laser Wash',
        description: '14oz structured white and washed-charcoal denim jacket. Features modular chest utility cargo pockets, raw frayed hem detailing, and back panel spiritual pressure iconography.',
        category: catMap.get('jackets'),
        basePrice: 2899,
        compareAtPrice: 5499,
        images: [
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['jacket', 'denim', 'tactical', 'limited-edition'],
        specifications: {
          Fabric: '14oz Japanese Rigid Selvedge Denim Blend',
          Wash: 'Hand-distressed Acid Mineral Wash',
          Pockets: '4 Exterior Utility Pockets + Dual Internal Pouches',
        },
        careInstructions: ['Spot clean or dry clean only'],
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        variants: [
          { sku: 'AA-ESP-JKT-WHT-M', size: 'M', color: 'Bone White', stock: 10 },
          { sku: 'AA-ESP-JKT-WHT-L', size: 'L', color: 'Bone White', stock: 18 },
          { sku: 'AA-ESP-JKT-WHT-XL', size: 'XL', color: 'Bone White', stock: 8 },
        ],
      },
      {
        name: 'BARREL CARGO // TACTICAL TRACKPANTS',
        slug: 'barrel-cargo-tactical-trackpants',
        subtitle: 'Bungee Cord Cuffs / Water-Resistant Ripstop',
        description: 'Engineered with an exaggerated balloon barrel cut that tapers aggressively at the ankle with adjustable bungee toggles. Crafted with durable lightweight matte ripstop for all-day urban agility.',
        category: catMap.get('bottoms'),
        basePrice: 1899,
        compareAtPrice: 3499,
        images: [
          'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['cargo', 'bottoms', 'trackpants', 'streetwear', 'bestseller'],
        specifications: {
          Fabric: 'Matte Cotton-Nylon Stretch Ripstop',
          Cut: 'Wide Barrel Tapered Ankle Fit',
          Hardware: 'Elasticated Drawstring Waist with Matte Bungees',
        },
        careInstructions: ['Machine wash cold', 'Tumble dry low'],
        isFeatured: false,
        isBestseller: true,
        isNewArrival: true,
        variants: [
          { sku: 'AA-TRK-PNT-S', size: 'S', color: 'Charcoal Black', stock: 20 },
          { sku: 'AA-TRK-PNT-M', size: 'M', color: 'Charcoal Black', stock: 25 },
          { sku: 'AA-TRK-PNT-L', size: 'L', color: 'Charcoal Black', stock: 22 },
        ],
      },
      {
        name: 'CHERRY BLOSSOM // WAFFLE FULL SLEEVE',
        slug: 'cherry-blossom-waffle-full-sleeve',
        subtitle: '300 GSM Heavy Waffle Knit / Minimalist Sleeve Kanji',
        description: 'Textured 300 GSM honeycomb waffle knit full-sleeve shirt with rib-knit cuffs and an oversized silhouette. Features minimalist kanji typography along the forearm.',
        category: catMap.get('full-sleeves'),
        basePrice: 1799,
        compareAtPrice: 3299,
        images: [
          'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['full-sleeve', 'waffle-knit', 'oversized', 'spring-drop'],
        specifications: {
          Fabric: '300 GSM Combed Waffle Thermal Cotton',
          Fit: 'Relaxed Dropped Shoulder',
          Cuffs: 'Heavy Ribbed Elasticated Cuffs',
        },
        careInstructions: ['Cold wash delicate cycle', 'Dry flat'],
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        variants: [
          { sku: 'AA-WAF-FS-BLK-M', size: 'M', color: 'Washed Black', stock: 15 },
          { sku: 'AA-WAF-FS-BLK-L', size: 'L', color: 'Washed Black', stock: 20 },
          { sku: 'AA-WAF-FS-BLK-XL', size: 'XL', color: 'Washed Black', stock: 10 },
        ],
      },
      {
        name: 'BLACK BULLS // HEAVY EMBROIDERED VEST',
        slug: 'black-bulls-heavy-embroidered-vest',
        subtitle: '260 GSM Raw Armhole Vest / Demon Slayer Red Accent',
        description: 'Raw-cut dropped armhole streetwear vest crafted from 260 GSM dense cotton. Features high-contrast embroidery emblem on chest and oversized distressed back print.',
        category: catMap.get('vests'),
        basePrice: 1199,
        compareAtPrice: 2499,
        images: [
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['vest', 'black-clover', 'gym-streetwear', 'raw-hem'],
        specifications: {
          Fabric: '260 GSM Combed Ring-Spun Cotton',
          Cut: 'Deep Cut Raw Edge Armholes',
          Detail: 'Heavy Satin Stitched Front Patch',
        },
        careInstructions: ['Machine wash cold', 'Do not tumble dry'],
        isFeatured: false,
        isBestseller: true,
        isNewArrival: true,
        variants: [
          { sku: 'AA-VST-BULL-M', size: 'M', color: 'Pitch Black', stock: 18 },
          { sku: 'AA-VST-BULL-L', size: 'L', color: 'Pitch Black', stock: 22 },
        ],
      },
      {
        name: 'NEO TOKYO // COMPRESSION TRAINING TEE',
        slug: 'neo-tokyo-compression-training-tee',
        subtitle: '4-Way Stretch Lycra Blend / Ergonomic Flatlock Seams',
        description: 'Second-skin anatomical compression tee engineered with dry-performance synthetic blend. Features flatlock chafe-free seams and cyberpunk cyber-line artwork that contours muscular definition.',
        category: catMap.get('compression-wear'),
        basePrice: 1499,
        compareAtPrice: 2899,
        images: [
          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['compression', 'gym', 'training', 'cyberpunk'],
        specifications: {
          Material: '85% Polyamide, 15% Elastane',
          Technology: 'Quick-Dry Anti-Odor Silver Ions',
          Seams: '6-Thread Flatlock Ergonomic Construction',
        },
        careInstructions: ['Machine wash cold', 'Air dry only'],
        isFeatured: true,
        isBestseller: false,
        isNewArrival: true,
        variants: [
          { sku: 'AA-COMP-M', size: 'M', color: 'Cyber Slate', stock: 25 },
          { sku: 'AA-COMP-L', size: 'L', color: 'Cyber Slate', stock: 30 },
          { sku: 'AA-COMP-XL', size: 'XL', color: 'Cyber Slate', stock: 15 },
        ],
      },
      {
        name: 'SAND COFFIN // CROSSBODY SLING PACK',
        slug: 'sand-coffin-crossbody-sling-pack',
        subtitle: '1000D Cordura / Modular MOLLE Webbing',
        description: 'Rugged ballistic nylon crossbody chest rig designed for streetwear utility. Features quick-release tactical buckle, weatherproof zippers, and internal padded compartments.',
        category: catMap.get('backpacks'),
        basePrice: 1699,
        compareAtPrice: 2999,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['backpack', 'crossbody', 'bag', 'tactical', 'bestseller'],
        specifications: {
          Material: '1000D Ballistic Cordura Nylon',
          Buckle: 'Fidlock Quick-Release Magnetic Clasp',
          Dimensions: '32cm x 18cm x 10cm',
        },
        careInstructions: ['Wipe clean with damp cloth'],
        isFeatured: true,
        isBestseller: true,
        isNewArrival: false,
        variants: [
          { sku: 'AA-BAG-SLING-BLK', size: 'FREE_SIZE', color: 'Tactical Black', stock: 30 },
        ],
      },
      {
        name: 'CURSED SPIRIT // DISTRESSED DAD CAP',
        slug: 'cursed-spirit-distressed-dad-cap',
        subtitle: 'Vintage Washed Twill / High-Density 3D Front Embroidery',
        description: 'Vintage-washed low profile 6-panel unstructured dad cap. Hand-distressed brim edge with brass antique buckle slide adjuster and tonal anime eye embroidery.',
        category: catMap.get('caps'),
        basePrice: 899,
        compareAtPrice: 1899,
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['cap', 'hat', 'accessories', 'distressed'],
        specifications: {
          Material: '100% Washed Vintage Chino Cotton Twill',
          Closure: 'Embossed Metal Slider with Tuck-in Strap',
          Profile: 'Unstructured Low Crown 6-Panel',
        },
        careInstructions: ['Hand wash cold with soft brush'],
        isFeatured: false,
        isBestseller: true,
        isNewArrival: true,
        variants: [
          { sku: 'AA-CAP-CURSE-BLK', size: 'FREE_SIZE', color: 'Washed Charcoal', stock: 45 },
        ],
      },
      {
        name: 'CYBER SHINOBI // 900x400MM DESK MAT',
        slug: 'cyber-shinobi-900x400mm-desk-mat',
        subtitle: 'Stitched Anti-Fray Edges / Micro-Weave Speed Surface',
        description: 'Premium 4mm thick ultra-dense micro-weave desk mat with non-slip natural rubber base and anti-fray precision edge stitching. High-definition vibrant sublimation print of Tokyo nightfall.',
        category: catMap.get('accessories'),
        basePrice: 999,
        compareAtPrice: 1999,
        images: [
          'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
        ],
        tags: ['deskmat', 'accessories', 'cyberpunk', 'setup', 'bestseller'],
        specifications: {
          Dimensions: '900mm x 400mm x 4mm',
          Surface: 'Ultra-Smooth Micro-Weave Textile',
          Base: 'Textured Heavy Natural Grip Rubber',
        },
        careInstructions: ['Hand wash with mild detergent or machine wash gentle'],
        isFeatured: false,
        isBestseller: true,
        isNewArrival: true,
        variants: [
          { sku: 'AA-MAT-SHIN-XL', size: 'FREE_SIZE', color: 'Cyber Indigo', stock: 50 },
        ],
      },
    ];

    for (const p of productsData) {
      await Product.create(p);
    }
    console.log(`[Seed] ✅ ${productsData.length} anime streetwear products created across all categories!`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Database seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();
