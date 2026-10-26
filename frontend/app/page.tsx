import Link from 'next/link';
import Image from 'next/image';
import { getPublicSettings, getCategories, getNewArrivals, getFeaturedProducts } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Flame, Star, ShieldCheck, Sparkles, Instagram } from 'lucide-react';

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
      review: 'The 280 GSM heavyweight cotton on the Void Domain tee is crazy. Drop shoulder cut fits exactly like high-end Japanese streetwear.',
      item: 'VOID DOMAIN // OVERSIZED TEE',
    },
    {
      author: 'Rohan S.',
      city: 'Delhi NCR',
      rating: 5,
      review: 'Best anime hoodie in India hands down. Fleece is thick, double hood holds its structure, and the gunmetal zipper feels premium.',
      item: 'SHADOW MONARCH // ZIP HOODIE',
    },
    {
      author: 'Nikhil K.',
      city: 'Bengaluru',
      rating: 5,
      review: 'The barrel cargo trackpants with the bungee ankles are insane. Delivery to Bangalore was under 3 days.',
      item: 'BARREL CARGO // TRACKPANTS',
    },
  ];

  const lookbook = [
    { image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800', handle: '@amice.kenji' },
    { image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800', handle: '@tokyo_street' },
    { image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800', handle: '@bleach.espada' },
    { image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=800', handle: '@urban_dystopia' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Large Hero Campaign Banner */}
      <section className="relative h-[80vh] min-h-[580px] w-full flex items-center justify-center overflow-hidden border-b border-surface-border">
        <div className="absolute inset-0 z-0">
          <Image
            src={settings?.heroBanner?.backgroundImage || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1600'}
            alt="Amice Amarine Streetwear Campaign"
            fill
            priority
            className="object-cover object-center brightness-[0.38] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-subtle/80 backdrop-blur-md border border-brand-crimson/50 text-brand-crimson text-xs font-mono font-bold tracking-widest uppercase">
            <Flame className="w-3.5 h-3.5 animate-bounce" /> DROP 01 // OVERSIZED EDITION
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase text-white font-display">
            {settings?.heroBanner?.headline || 'AMICE AMARINE // ANIME X STREETWEAR'}
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-zinc-300 font-medium tracking-wide">
            {settings?.heroBanner?.subheadline || 'Heavyweight 280 GSM Cotton. Raw Tokyo Cyberpunk Aesthetics. Oversized Precision.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
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
        <div className="flex items-center justify-between mb-8 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson block">
              CURATED SILHOUETTES
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              SHOP BY CATEGORY
            </h2>
          </div>
          <Link
            href="/collections/all-products"
            className="text-xs font-mono uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 group"
          >
            ALL CATEGORIES <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/collections/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden border border-surface-border bg-zinc-900 flex flex-col justify-end p-4 transition-all hover:border-brand-crimson"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 20vw"
                  className="object-cover object-center brightness-75 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              <div className="relative z-10">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-brand-crimson transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
                  DISCOVER →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. New Arrivals Drop Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cyan block">
              FRESH FROM THE LAB
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              NEW ARRIVALS
            </h2>
          </div>
          <Link
            href="/collections/all-products"
            className="text-xs font-mono uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 group"
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
        <div className="relative overflow-hidden border border-surface-border bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-brand-crimson">
              STREETWEAR ARCHITECTURE
            </span>
            <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight font-display">
              HEAVYWEIGHT 280 GSM BIO-WASHED TERRY
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every Amice Amarine garment is engineered for extreme longevity and drop-shoulder drape.
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

          <div className="w-full md:w-1/3 aspect-[4/3] relative border border-surface-border overflow-hidden">
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
        <div className="flex items-center justify-between mb-8 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-amber block">
              MOST COVETED PIECES
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              BEST SELLERS
            </h2>
          </div>
          <Link
            href="/collections/all-products?sort=popular"
            className="text-xs font-mono uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 group"
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
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson">
            VERIFIED SYNDICATE FEEDBACK
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-display">
            WHAT THE STREETS ARE SAYING
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="p-6 bg-surface border border-surface-border space-y-4">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(r.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                &ldquo;{r.review}&rdquo;
              </p>
              <div className="pt-2 border-t border-surface-border/50 flex items-center justify-between font-mono text-[10px]">
                <div>
                  <strong className="text-white uppercase block">{r.author}</strong>
                  <span className="text-zinc-500">{r.city}</span>
                </div>
                <span className="text-brand-crimson font-bold uppercase truncate max-w-[120px]">
                  {r.item}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Community Lookbook */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 border-b border-surface-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 block">
              @AMICEAMARINE ON INSTAGRAM
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
              COMMUNITY LOOKBOOK
            </h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-mono uppercase font-bold text-zinc-400 hover:text-brand-crimson flex items-center gap-1"
          >
            <Instagram className="w-4 h-4" /> FOLLOW US
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {lookbook.map((item, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden bg-zinc-900 border border-surface-border">
              <Image
                src={item.image}
                alt="Amice Amarine lookbook style"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="text-xs font-mono font-bold text-white bg-black/80 px-3 py-1 border border-surface-border">
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
