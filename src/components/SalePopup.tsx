'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { PRODUCTS } from '@/data/products';

export default function SalePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [saleSettings, setSaleSettings] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const { data } = await res.json();
          if (data?.isSaleActive) {
            setSaleSettings(data);
            setTimeout(() => setIsOpen(true), 1200);
          }
        }
      } catch {
        console.warn('Failed to load sale popup settings');
      }
    }
    fetchSettings();
  }, []);

  const handleClose = () => setIsOpen(false);

  const copyCode = () => {
    if (saleSettings?.couponCode) {
      navigator.clipboard.writeText(saleSettings.couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen || !saleSettings) return null;

  const bannerImg = saleSettings.saleImageUrl || '/images/diwali_sale_banner.jpg';
  const discount = saleSettings.couponDiscountPercent || 10;
  
  // We take the first 3 products for the recommended list
  const recommendedProducts = PRODUCTS.slice(0, 3);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        
        {/* Backdrop */}
        <motion.div
          key="bd"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Content */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 32, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 340, damping: 28 }}
          className="relative w-full max-w-4xl bg-white rounded-2xl md:rounded-3xl overflow-hidden z-10 flex flex-col md:flex-row shadow-2xl"
        >
          {/* Mobile close button (visible only on mobile if stack goes off screen) */}
          <button 
            onClick={handleClose}
            className="md:hidden absolute top-4 right-4 z-50 bg-white/90 text-black p-1.5 rounded-full shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── LEFT COLUMN (BANNER) ── */}
          <div className="relative w-full md:w-[50%] lg:w-[55%] min-h-[360px] md:min-h-[480px] flex flex-col justify-center items-center text-center p-8 overflow-hidden bg-neutral-900">
            <Image
              src={bannerImg}
              alt="Sale Banner"
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            <div className="relative z-10 w-full flex flex-col items-center">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: 'var(--font-outfit)' }}>
                {saleSettings.saleTitle || "Wait! before you leave..."}
              </h2>
              <p className="text-sm text-white/90 mb-8 font-medium">
                {saleSettings.saleDescription || `Get ${discount}% off for your first order`}
              </p>

              {saleSettings.isCouponActive && saleSettings.couponCode && (
                <button
                  onClick={copyCode}
                  className="bg-white hover:bg-neutral-100 text-black font-black text-lg px-8 py-3 rounded-lg shadow-lg mb-6 tracking-widest transition-all w-full max-w-[280px] flex items-center justify-center gap-2 cursor-pointer border-2 border-transparent hover:border-black"
                >
                  {copied ? (
                    <><Check className="w-5 h-5 text-emerald-600" /> COPIED!</>
                  ) : (
                    <>{saleSettings.couponCode}</>
                  )}
                </button>
              )}

              <p className="text-xs text-white/80 mb-6 font-medium max-w-[260px]">
                Use above code to get {discount}% OFF for your first order when checkout
              </p>

              <button 
                onClick={handleClose}
                className="bg-[#E41E31] hover:bg-[#C91829] text-white font-bold text-sm px-8 py-3.5 rounded-lg w-full max-w-[280px] shadow-lg transition-all cursor-pointer"
              >
                Grab the discount
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN (RECOMMENDED PRODUCTS) ── */}
          <div className="relative w-full md:w-[50%] lg:w-[45%] bg-white p-6 md:p-8 flex flex-col max-h-[60vh] md:max-h-none overflow-y-auto">
            {/* Desktop Close */}
            <button
              onClick={handleClose}
              className="hidden md:flex absolute top-5 right-5 text-neutral-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-xl font-bold text-black mb-6 mt-2 md:mt-0">Recommended Products</h3>

            <div className="flex flex-col gap-5">
              {recommendedProducts.map((product) => (
                <div key={product.id} className="flex gap-4 items-center group cursor-pointer">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 shrink-0 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-neutral-300 fill-neutral-300" />
                      ))}
                      <span className="text-[10px] text-neutral-400 ml-1">({product.reviewsCount || 0})</span>
                    </div>
                    
                    <h4 className="text-xs font-semibold text-black truncate mb-1" title={product.name}>
                      {product.name}
                    </h4>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-neutral-400 line-through">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
                      <span className="text-sm font-bold text-[#E41E31]">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {/* Size Swatches */}
                    <div className="flex gap-1.5 flex-wrap">
                      {product.sizes.slice(0, 3).map(size => (
                        <span key={size} className="text-[10px] border border-neutral-200 text-neutral-600 px-2 py-0.5 rounded flex items-center justify-center">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
