'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ruler, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { SIZE_CHART } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useCart();
  const { t } = useLanguage();
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(2); // default size 2

  if (!isSizeGuideOpen) return null;

  const currentSize = SIZE_CHART[selectedSizeIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 border border-neutral-300 shadow-2xl text-neutral-900"
        >
          {/* Close button */}
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-black hover:text-white text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-semibold mb-2">
              <Ruler className="w-3.5 h-3.5 text-black" />
              {t('sizeGuide.badge')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-royal text-black">
              {t('sizeGuide.title')}
            </h2>
            <p className="text-neutral-600 text-sm mt-1 max-w-lg mx-auto">
              How to pick the perfect poshak for your Kanha Ji. Measure your idol from crown to feet or check existing dress diameter.
            </p>
          </div>

          {/* Size Pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {SIZE_CHART.map((item, idx) => {
              const isSelected = selectedSizeIndex === idx;
              return (
                <button
                  key={item.size}
                  onClick={() => setSelectedSizeIndex(idx)}
                  className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isSelected
                      ? 'bg-black text-white shadow-sm scale-105'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  Size {item.size}
                </button>
              );
            })}
          </div>

          {/* Selected Size Detail Card */}
          <div className="bg-neutral-50 rounded-2xl p-5 sm:p-6 border border-neutral-200 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Selected Size</span>
                  <span className="text-xl font-extrabold text-black">Size {currentSize.size}</span>
                </div>
                <h3 className="text-base font-bold text-neutral-900 mb-1">{currentSize.bestFor}</h3>
                <p className="text-neutral-600 text-xs sm:text-sm mb-4 leading-relaxed">{currentSize.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200">
                    <span className="text-xs text-neutral-600">{t('sizeGuide.height')}</span>
                    <span className="text-sm font-bold text-black">{currentSize.deityHeightInches}</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-neutral-200">
                    <span className="text-xs text-neutral-600">{t('sizeGuide.diameter')}</span>
                    <span className="text-sm font-bold text-black">{currentSize.dressDiameterInches}</span>
                  </div>
                </div>
              </div>

              {/* Visual Circular Representation */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white border border-neutral-200">
                <div className="relative w-36 h-36 rounded-full border-2 border-dashed border-neutral-400 flex items-center justify-center shadow-inner">
                  <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-300 flex flex-col items-center justify-center text-center p-2">
                    <Sparkles className="w-5 h-5 text-black mb-0.5" />
                    <span className="text-sm font-bold text-black">Size {currentSize.size}</span>
                    <span className="text-[10px] text-neutral-600">{currentSize.dressDiameterInches}</span>
                  </div>
                  <div className="absolute -top-2.5 bg-black text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                    Flare
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-3 text-center">
                  Circular flare diameter ensures majestic peacock spread.
                </p>
              </div>
            </div>
          </div>

          {/* Quick measurement tips */}
          <div className="border-t border-neutral-200 pt-4 mb-5">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-black" />
              Easy Measuring Steps:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-600">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block mb-0.5">Step 1: Height</span>
                Use a measuring tape from the crown of Laddu Gopal to the lotus feet.
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block mb-0.5">Step 2: Existing Poshak</span>
                Spread a well-fitting poshak flat and measure edge-to-edge diameter.
              </div>
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-black block mb-0.5">Step 3: Mukut Fit</span>
                Our crowns come with soft inner lining and flexible ties for effortless darshan.
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="px-5 py-2.5 rounded-full text-xs font-bold border border-neutral-300 text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="luxury-black-btn px-6 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              Continue Shopping <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
