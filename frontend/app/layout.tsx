import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartDrawer } from '@/components/cart/CartDrawer';

export const metadata: Metadata = {
  title: 'AMICE AMARINE // ANIME X STREETWEAR',
  description: 'Premium anime-inspired streetwear fashion brand. Oversized T-Shirts, Heavyweight Hoodies, Tactical Denim Jackets & Accessories. Crafted for raw urban culture.',
  keywords: ['anime streetwear', 'oversized anime tshirts', 'cyberpunk fashion', 'amice amarine', 'heavyweight hoodies'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-brand-white">
        <AuthProvider>
          <CartProvider>
            <AnnouncementBar />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
