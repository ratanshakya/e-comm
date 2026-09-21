import type { Metadata } from 'next';
import { Cinzel, Outfit } from 'next/font/google';
import './globals.css';
import NextTopLoader from 'nextjs-toploader';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { LanguageProvider } from '@/context/LanguageContext';
import CartDrawer from '@/components/CartDrawer';
import SizeGuideModal from '@/components/SizeGuideModal';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://brocart.in'),
  title: 'BroCART | Premium Laddu Gopal Poshak, Mukut & Shringar Store',
  description:
    'BroCART - Handcrafted Vrindavan Laddu Gopal poshaks, royal zardozi silk dresses, 24K gold-polished mukuts, bansuri, carved brass singhasan & jhula. Pure sacred seva fabrics for sizes 00 to 7+.',
  keywords: [
    'BroCART',
    'Bro CART online',
    'Laddu Gopal dress',
    'Kanha Ji poshak',
    'Vrindavan poshak online',
    'Laddu Gopal mukut bansuri',
    'Thakurji singhasan',
    'Krishna clothes online',
    'Zardozi poshak size 0 to 6'
  ],
  openGraph: {
    title: 'BroCART | Vrindavan Handcrafted Poshak & Shringar',
    description: 'Adorn your beloved Laddu Gopal Ji with pure zardozi silk dresses, gold mukuts, and carved singhasans on BroCART.',
    images: ['/images/brocart_logo_cropped.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cinzel.variable} ${outfit.variable} scroll-smooth`}>
      <body suppressHydrationWarning className="antialiased min-h-screen flex flex-col bg-[#FFFFFF] text-[#0A0A0A] selection:bg-black selection:text-white">
        <NextTopLoader color="#E41E31" showSpinner={false} />
        <AuthProvider>
          <LanguageProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <SizeGuideModal />
              <FloatingWhatsApp />
            </CartProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
