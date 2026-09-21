'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { InteractiveCheckoutDemo } from '@/components/ui/demo';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InteractiveCheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Interactive Checkout Component
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Dynamic animated cart with quantity controls and real-time NumberFlow pricing.
            </p>
          </div>
        </div>

        <div className="bg-neutral-50/50 p-4 sm:p-8 rounded-2xl border border-neutral-200 shadow-xs">
          <InteractiveCheckoutDemo />
        </div>
      </main>

      <Footer />
    </div>
  );
}
