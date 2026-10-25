import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductDetailsClient } from '@/components/product/ProductDetailsClient';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  let data;
  try {
    data = await getProductBySlug(slug);
  } catch {
    notFound();
  }

  const { product, relatedProducts } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <div>
        <Link
          href="/collections/all-products"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-500 hover:text-white transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> BACK TO ALL PRODUCTS
        </Link>
      </div>

      {/* Main Interactive Product Section */}
      <ProductDetailsClient product={product} />

      {/* Related Products Rail */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-surface-border space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson block">
                COMPLETE THE LOOK
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                YOU MAY ALSO LIKE
              </h2>
            </div>
            <Link href="/collections/all-products" className="text-xs font-mono text-brand-crimson hover:underline">
              VIEW ALL →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
