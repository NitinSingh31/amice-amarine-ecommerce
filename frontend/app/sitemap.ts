import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amiceamarine.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/collections/all-products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/collections/oversized-t-shirts`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/hoodies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/jackets`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/bottoms`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/collections/accessories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/tracking`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${baseUrl}/account/login`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/account/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  try {
    const res = await fetch('http://localhost:5000/api/products?limit=50', { cache: 'no-store' });
    const data = await res.json();
    if (data.success && data.data?.products) {
      const productRoutes: MetadataRoute.Sitemap = data.data.products.map((p: any) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt || new Date()),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
      return [...staticRoutes, ...productRoutes];
    }
  } catch {
    const fallbackProducts = [
      'void-domain-oversized-graphic-tee',
      'shadow-monarch-heavyweight-zip-hoodie',
      'neo-tokyo-cyberpunk-oversized-tee',
      'titan-hunter-heavy-fleece-hoodie',
      'ronin-tactical-bomber-jacket',
      'shibuya-nightfall-acid-wash-tee',
      'berserk-eclipse-oversized-tee',
      'cyber-shinobi-cargo-trackpants',
      'akira-red-capsule-oversized-tee',
      'dominance-heavy-fleece-zip-hoodie',
    ].map((slug) => ({
      url: `${baseUrl}/products/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));
    return [...staticRoutes, ...fallbackProducts];
  }

  return staticRoutes;
}
