import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amiceamarine.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'AMICE AMARINE | Luxury Streetwear & Apparel',
    template: '%s | AMICE AMARINE',
  },
  icons: {
    icon: '/images/logo-emblem.png',
    shortcut: '/images/logo-emblem.png',
    apple: '/images/logo-emblem.png',
  },
  description:
    'Premium anime-inspired streetwear fashion brand. Luxury 280-320 GSM oversized T-shirts, heavy fleece hoodies, tactical bomber jackets, and accessories designed for raw underground street culture.',
  keywords: [
    'anime streetwear',
    'oversized anime tshirts',
    'cyberpunk fashion',
    'amice amarine',
    'heavyweight anime hoodies',
    'luxury anime clothing',
    'streetwear india',
  ],
  authors: [{ name: 'Amice Amarine Syndicate' }],
  creator: 'Amice Amarine',
  publisher: 'Amice Amarine Apparel Pvt Ltd',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'AMICE AMARINE',
    title: 'AMICE AMARINE | Luxury Streetwear & Apparel',
    description:
      'Engineered for the raw underground culture. Oversized anime silhouettes, luxury heavyweight fabrics, and limited cyber drops.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Amice Amarine Premium Anime Streetwear Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMICE AMARINE | Luxury Streetwear & Apparel',
    description: 'Luxury anime streetwear drops. 280 GSM oversized tees & heavy hoodies.',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1200&auto=format&fit=crop'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'Amice Amarine',
    url: siteUrl,
    logo: `${siteUrl}/images/logo-horizontal.png`,
    description: 'Premium anime-inspired streetwear fashion brand. Oversized T-Shirts, Heavyweight Hoodies & Tactical Jackets.',
    telephone: '+91 91234 56789',
    email: 'syndicate@amiceamarine.com',
    priceRange: '₹999 - ₹4999',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Credit Card, Debit Card, NetBanking, UPI, Cash on Delivery',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot 42, Neon Sector, Shibuya Tech District',
      addressLocality: 'Mumbai',
      addressRegion: 'Maharashtra',
      postalCode: '400001',
      addressCountry: 'IN',
    },
  };

  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-sage-900 font-sans selection:bg-terracotta-100 selection:text-terracotta-700">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
