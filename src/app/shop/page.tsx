'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { ShieldCheck, Sparkles, Flame, Gift } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.length) {
            setProducts(data.data);
          }
        }
      } catch (err) {
        console.warn('Using local catalog fallback:', err);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onSearch={(q) => setSearchQuery(q)} />

      {/* Exact Crocohill Reference "Shop" Header with Soft Ambient Radial Glow */}
      <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 overflow-hidden bg-white text-center">
        {/* Soft pastel diffused glow behind the title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[160px] bg-gradient-to-r from-pink-100/50 via-rose-100/40 to-amber-100/30 rounded-full blur-3xl opacity-80" />
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-black font-sans">
            Shop
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-widest mt-2 font-medium">
            Explore Handcrafted Divine Vrindavan Treasures
          </p>
        </div>
      </section>

      {/* Main Catalog */}
      <main className="flex-1">
        <ProductGrid products={products} searchQuery={searchQuery} />

        {/* 4 Bottom Quality Assurance Cards */}
        <section className="w-full bg-white border-t border-neutral-100 py-16 px-4 sm:px-8">
          <div className="max-w-[1850px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-black transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-black uppercase tracking-wider mb-2">
                Non-Toxic & Safe for Idols
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Vegetable dyes, azo-free pigments, and soft inner lining that shields your deity&apos;s sacred metal vigraha.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-black transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-black uppercase tracking-wider mb-2">
                Precision Flare & Fit
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Pre-shaped circular flare designed to sit flat without creasing on singhasan and lotus pedestals.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-black transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-black uppercase tracking-wider mb-2">
                Pure 24K Gold Plating
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Solid brass jewelry sealed in tarnish-proof 24 karat gold micron plating for lifelong lustre.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-neutral-50 border border-neutral-200/80 hover:border-black transition-all group">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-black uppercase tracking-wider mb-2">
                Blessed Vrindavan Packaging
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Delivered in velvet-lined keepsake cases with sanctified Vrindavan ittar and tulsi leaf.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
