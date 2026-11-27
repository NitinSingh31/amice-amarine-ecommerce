import Link from 'next/link';
import Image from 'next/image';
import { getPublicSettings, getCategories, getNewArrivals, getFeaturedProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Sparkles, Star, Instagram } from 'lucide-react';

export const revalidate = 60;

export default async function HomePage() {
  const [settingsData, categoriesData, newArrivalsData, featuredData] = await Promise.all([
    getPublicSettings(),
    getCategories(),
    getNewArrivals(),
    getFeaturedProducts(),
  ]);

  const settings = settingsData.settings;
  const categories = categoriesData.categories;
  const newArrivals = newArrivalsData.products;
  const featuredProducts = featuredData.products;

  const reviews = [
    {
      author: 'Arjun M.',
      city: 'Mumbai',
      rating: 5,
      review: 'The 280 GSM heavyweight cotton on the Void Domain tee is incredible. Drop shoulder cut fits with true luxury drape.',
      item: 'VOID DOMAIN // OVERSIZED TEE',
    },
    {
      author: 'Rohan S.',
      city: 'Delhi NCR',
      rating: 5,
      review: 'Best anime hoodie in India hands down. Fleece is thick, double hood holds its structure, and the hardware feels substantial.',
      item: 'SHADOW MONARCH // ZIP HOODIE',
    },
    {
      author: 'Nikhil K.',
      city: 'Bengaluru',
      rating: 5,
      review: 'The barrel cargo trackpants with the bungee ankles are pristine. Fast express delivery and packaging was unmatched.',
      item: 'BARREL CARGO // TRACKPANTS',
    },
  ];

  const lookbook = [
    { image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800', handle: '@amice.kenji' },
    { image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800', handle: '@tokyo_street' },
    { image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800', handle: '@bleach.espada' },
    { image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800', handle: '@urban_atelier' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Large Hero Campaign Banner */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-linen-100 via-linen-50 to-linen-50 border-b border-sage-200/80">
        {/* Ambient Blur Orbs */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-sage-200/40 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-24 w-80 h-80 rounded-full bg-terracotta-200/30 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-ochre-100/50 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sage-100/90 border border-sage-200/80 text-sage-800 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
            <span>DROP 01 // OVERSIZED LUXURY EDITION</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-sage-900 font-serif leading-tight">
            {(settings?.heroBanner?.headline || 'AMICE AMARINE')
              .replace(/\s*\/\/\s*ANIME\s*X\s*STREETWEAR/gi, '')
              .replace(/\s*\/\/\s*LUXURY\s*ANIME\s*ATELIER/gi, '')
              .trim() || 'AMICE AMARINE'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-sage-700 font-normal leading-relaxed">
            {settings?.heroBanner?.subheadline || 'Heavyweight 280–320 GSM French Terry. Tailored silhouettes. Refined Japanese editorial aesthetics.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link href={settings?.heroBanner?.ctaLink || '/collections/all-products'}>
              <Button variant="glow" size="lg" className="w-full sm:w-auto">
                {settings?.heroBanner?.ctaText || 'EXPLORE THE DROP'} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/collections/oversized-t-shirts">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                OVERSIZED TEES
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Featured Category Tiles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-sage-200/80 pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-terracotta-600 block">
              CURATED SILHOUETTES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-sage-900 font-serif">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            href="/collections/all-products"
            className="text-xs uppercase font-semibold text-sage-600 hover:text-terracotta-600 flex items-center gap-1 group transition-colors"
          >
            ALL CATEGORIES <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/collections/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-sage-200/80 bg-linen-100 flex flex-col justify-end p-4 transition-all hover:border-terracotta-300 hover:shadow-md"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-sage-950/80 via-sage-950/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white group-hover:text-terracotta-200 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] text-linen-200 tracking-wider uppercase">
                  DISCOVER →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Drop Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-sage-200/80 pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-600 block">
              FRESH FROM THE ATELIER
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-sage-900 font-serif">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/collections/all-products"
            className="text-xs uppercase font-semibold text-sage-600 hover:text-terracotta-600 flex items-center gap-1 group transition-colors"
          >
            VIEW ALL <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Promotional Editorial Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-sage-200/80 bg-gradient-to-br from-linen-100 via-white to-sage-50/50 p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-semibold tracking-widest uppercase text-terracotta-600">
              CRAFT & ARCHITECTURE
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-sage-900 tracking-tight font-serif leading-tight">
              HEAVYWEIGHT 280 GSM BIO-WASHED FRENCH TERRY
            </h3>
            <p className="text-xs sm:text-sm text-sage-600 leading-relaxed">
              Every Amice Amarine garment is engineered for longevity and effortless drop-shoulder drape.
              Custom milled fabric tested against 50+ wash cycles without fading or shrinkage.
            </p>
            <div className="pt-2">
              <Link href="/collections/all-products">
                <Button variant="primary" size="md">
                  SHOP ALL STYLES
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/3 aspect-[4/3] relative rounded-2xl border border-sage-200 overflow-hidden shadow-xs">
            <Image
              src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800"
              alt="Heavyweight Streetwear Fabric Detail"
              fill
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 5. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-sage-200/80 pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-ochre-600 block">
              MOST COVETED PIECES
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-sage-900 font-serif">
              BEST SELLERS
            </h2>
          </div>
          <Link
            href="/collections/all-products?sort=popular"
            className="text-xs uppercase font-semibold text-sage-600 hover:text-terracotta-600 flex items-center gap-1 group transition-colors"
          >
            VIEW ALL <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Customer Reviews & Community Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-terracotta-600">
            VERIFIED COMMUNITY REVIEWS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-sage-900 font-serif tracking-tight">
            WHAT OUR COMMUNITY SAYS
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 bg-white rounded-2xl border border-sage-200/80 space-y-4 shadow-xs">
              <div className="flex items-center gap-1 text-ochre-500">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-ochre-500" />
                ))}
              </div>
              <p className="text-xs text-sage-700 leading-relaxed">
                &ldquo;{r.review}&rdquo;
              </p>
              <div className="pt-2 border-t border-sage-100 flex items-center justify-between text-[11px]">
                <div>
                  <strong className="text-sage-900 uppercase block font-medium">{r.author}</strong>
                  <span className="text-sage-500">{r.city}</span>
                </div>
                <span className="text-terracotta-600 font-semibold uppercase truncate max-w-[120px]">
                  {r.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Community Lookbook */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-sage-200/80 pb-4">
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-sage-500 block">
              @AMICEAMARINE ON INSTAGRAM
            </span>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-sage-900 font-serif">
              COMMUNITY LOOKBOOK
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs uppercase font-semibold text-sage-600 hover:text-terracotta-600 flex items-center gap-1 transition-colors"
          >
            <Instagram className="w-4 h-4 text-terracotta-500" /> FOLLOW US
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lookbook.map((item, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-2xl bg-linen-100 border border-sage-200/80 shadow-xs">
              <Image
                src={item.image}
                alt="Amice Amarine lookbook style"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-sage-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="text-xs font-semibold text-white bg-sage-900/90 px-3.5 py-1.5 rounded-full border border-sage-700">
                  {item.handle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
