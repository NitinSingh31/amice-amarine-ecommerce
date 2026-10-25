import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { Suspense } from 'react';
import { Product } from '@/types';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface CollectionPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    sort?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    discount?: string;
  };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = params;

  const [productsData, categoriesData] = await Promise.all([
    getProducts({
      category: slug,
      ...searchParams,
    }),
    getCategories(),
  ]);

  const products: Product[] = productsData.products || [];
  const categories = categoriesData.categories || [];
  const currentCategory = categories.find((c) => c.slug === slug);
  const title = currentCategory ? currentCategory.name : slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-3 border-b border-surface-border pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> HOME / COLLECTIONS
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white font-display">
              {title}
            </h1>
            {currentCategory?.description && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-2xl">
                {currentCategory.description}
              </p>
            )}
          </div>
          <span className="text-xs font-mono text-zinc-500">
            SHOWING {products.length} PRODUCTS
          </span>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/collections/all-products"
          className={`px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap border transition-colors ${
            slug === 'all-products'
              ? 'bg-white text-black border-white font-bold'
              : 'bg-surface-subtle text-zinc-400 border-surface-border hover:text-white'
          }`}
        >
          ALL PRODUCTS
        </Link>
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/collections/${c.slug}`}
            className={`px-4 py-2 text-xs font-mono uppercase tracking-wider whitespace-nowrap border transition-colors ${
              slug === c.slug
                ? 'bg-white text-black border-white font-bold'
                : 'bg-surface-subtle text-zinc-400 border-surface-border hover:text-white'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Suspense fallback={<div className="w-64 font-mono text-xs text-zinc-500">LOADING FILTERS...</div>}><FilterSidebar categories={categories} currentCategorySlug={slug} /></Suspense>

        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-surface-border p-8 space-y-4">
              <h3 className="text-sm uppercase font-mono font-bold text-zinc-300">
                NO PRODUCTS MATCH THE CHOSEN FILTERS
              </h3>
              <p className="text-xs text-zinc-500">
                Try widening your price range, deselecting size pills, or viewing all products.
              </p>
              <div>
                <Link
                  href={`/collections/${slug}`}
                  className="inline-block px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  CLEAR FILTERS
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
