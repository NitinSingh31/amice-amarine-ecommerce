import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { FilterSidebar } from '@/components/product/FilterSidebar';
import { Suspense } from 'react';
import { Product } from '@/types';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 60;

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
      <div className="space-y-3 border-b border-sage-200/80 pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-sage-500 hover:text-sage-900 transition-colors uppercase font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> HOME / COLLECTIONS
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight text-sage-900 font-serif">
              {title}
            </h1>
            {currentCategory?.description && (
              <p className="text-xs sm:text-sm text-sage-600 mt-2 max-w-2xl">
                {currentCategory.description}
              </p>
            )}
          </div>
          <span className="text-xs text-sage-500 font-medium">
            SHOWING {products.length} PRODUCTS
          </span>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Link
          href="/collections/all-products"
          className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap rounded-full border transition-all ${
            slug === 'all-products'
              ? 'bg-sage-900 text-linen-50 border-sage-900 font-semibold shadow-xs'
              : 'bg-white text-sage-700 border-sage-200 hover:border-terracotta-400 font-medium shadow-2xs'
          }`}
        >
          ALL PRODUCTS
        </Link>
        {categories.map((c) => (
          <Link
            key={c._id}
            href={`/collections/${c.slug}`}
            className={`px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap rounded-full border transition-all ${
              slug === c.slug
                ? 'bg-sage-900 text-linen-50 border-sage-900 font-semibold shadow-xs'
                : 'bg-white text-sage-700 border-sage-200 hover:border-terracotta-400 font-medium shadow-2xs'
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Suspense fallback={<div className="w-64 text-xs text-sage-500">LOADING FILTERS...</div>}>
          <FilterSidebar categories={categories} currentCategorySlug={slug} />
        </Suspense>

        <div className="flex-1 w-full">
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-sage-200 p-8 space-y-4">
              <h3 className="text-sm uppercase font-bold text-sage-800 font-serif">
                NO PIECES MATCH YOUR CURRENT FILTERS
              </h3>
              <p className="text-xs text-sage-500 max-w-sm mx-auto">
                Try resetting your filters or selecting a different size to discover available garments.
              </p>
              <div className="pt-2">
                <Link
                  href={`/collections/${slug}`}
                  className="inline-block px-6 py-2.5 bg-sage-900 text-linen-50 text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-terracotta-600 transition-colors shadow-xs"
                >
                  RESET FILTERS
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
