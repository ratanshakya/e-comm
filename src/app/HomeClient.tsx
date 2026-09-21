'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import ArtisanStory from '@/components/ArtisanStory';
import InstagramReels from '@/components/InstagramReels';
import Footer from '@/components/Footer';
import SalePopup from '@/components/SalePopup';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';

export default function HomeClient({ initialProducts, initialSettings }: { initialProducts: Product[], initialSettings: any }) {
  const [products, setProducts] = useState<Product[]>(initialProducts || PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<any>(initialSettings);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <SalePopup />
      <Navbar onSearch={(q) => setSearchQuery(q)} />
      <main className="flex-1">
        <HeroSection onExploreClick={scrollToCatalog} settings={settings} />
        
        {settings?.isSaleActive && (
          <div 
            className="w-full bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 text-white py-12 px-4 sm:px-8 shadow-inner text-center border-b-4 border-rose-800 relative overflow-hidden"
            style={settings.saleImageUrl ? { backgroundImage: `url(${settings.saleImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
          >
            {settings.saleImageUrl && <div className="absolute inset-0 bg-black/60 z-0" />}
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-[0.15em] mb-3 drop-shadow-lg">
                {settings.saleTitle || 'MEGA SALE'}
              </h2>
              <p className="text-sm sm:text-base font-bold max-w-2xl mx-auto opacity-95 tracking-wide drop-shadow-lg">
                {settings.saleDescription || 'Special discounts applied automatically.'}
              </p>
            </div>
          </div>
        )}

        <ProductGrid products={products} searchQuery={searchQuery} settings={settings} />
        <ArtisanStory settings={settings} />
        <InstagramReels 
          title={settings?.homeVideosTitle}
          subtitle={settings?.homeVideosSubtitle}
          videos={settings?.homeVideoList}
        />
      </main>
      <Footer />
    </div>
  );
}
