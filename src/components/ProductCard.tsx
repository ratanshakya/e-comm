'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Star, Heart, Check, Plus, Minus } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, wishlist, toggleWishlist } = useCart();
  const { t, language } = useLanguage();
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '1');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const savingsAmount = product.originalPrice > product.price
    ? product.originalPrice - product.price
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };


  const isLiked = wishlist.includes(product.id);

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-neutral-200/90 hover:border-black shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      {/* Upper Area: Image + Details */}
      <div>
        {/* Product Image Frame: Square (1:1), crisp and perfectly balanced */}
        <div className="relative w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 mb-3 group/img border border-neutral-150">
          <Link href={`/products/${product.id}`} className="block w-full h-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
              className="object-cover object-center group-hover/img:scale-105 transition-transform duration-500 ease-out"
            />
          </Link>

          {/* Top Left: Authentic Badge */}
          {product.badge && (
            <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/85 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              {product.badge}
            </div>
          )}

          {/* Top Right: Discount Pill */}
          {discountPercent > 0 && (
            <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#D32F2F] text-white text-[11px] font-black tracking-wide shadow-xs">
              -{discountPercent}% {t('card.off')}
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            title="Wishlist"
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-800 flex items-center justify-center shadow-md transition-all hover:scale-110 active:scale-95"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-neutral-700'}`} />
          </button>
        </div>

        {/* Details Section */}
        <div>
          {/* Star Rating & Category */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                  />
                ))}
              </div>
              <span className="font-bold text-black text-xs ml-0.5">{product.rating}</span>
              <span className="text-neutral-400 text-[10px]">({product.reviewsCount})</span>
            </div>

            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded">
              {product.categoryLabel}
            </span>
          </div>

          {/* Title & Craftsmanship Snippet - Pure Language */}
          <Link href={`/products/${product.id}`} className="block group-hover:text-neutral-700 transition-colors">
            <h3 className="text-[13px] sm:text-base font-bold text-neutral-900 leading-tight sm:leading-snug line-clamp-1">
              {language === 'hi' && product.hindiName ? product.hindiName : product.name}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
              {product.fabric}
            </p>
          </Link>

          {/* Pricing & Savings */}
          <div className="flex items-baseline flex-wrap gap-1.5 sm:gap-2 mt-2">
            <span className="text-base sm:text-xl font-black text-[#D32F2F]">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {savingsAmount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {t('card.save')} ₹{savingsAmount.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Size Variant Chips (Compact) */}
          <div className="mt-2.5">
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>{t('card.size')}</span>
              <span className="text-black font-extrabold">{selectedSize === 'All Sizes' ? t('card.allSizesText') : `No. ${selectedSize}`}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    selectedSize === s
                      ? 'bg-[#87D215] text-black shadow-xs border border-[#79BE10] font-black'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200'
                  }`}
                >
                  {s === 'All Sizes' ? (language === 'hi' ? 'सभी' : 'All') : `No. ${s}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Quantity Stepper + Add to Cart + WhatsApp */}
      <div className="pt-3 mt-3 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
        {/* Quantity Stepper for Multi-Add */}
        <div className="flex items-center justify-between sm:justify-start bg-neutral-100 rounded-xl p-0.5 border border-neutral-200 shrink-0">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuantity((q) => Math.max(1, q - 1));
            }}
            className="w-8 h-8 sm:w-6 flex items-center justify-center text-neutral-600 hover:text-black rounded-lg hover:bg-white transition-all cursor-pointer"
            aria-label="Decrease quantity"
            title={t('card.decrease')}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="w-6 sm:w-5 text-center text-xs font-black text-black select-none">
            {quantity}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuantity((q) => q + 1);
            }}
            className="w-6 h-8 flex items-center justify-center text-neutral-600 hover:text-black rounded-lg hover:bg-white transition-all cursor-pointer"
            aria-label="Increase quantity"
            title={t('card.increase')}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAdd}
          className={`flex-1 h-9 sm:h-10 rounded-xl font-bold text-[11px] sm:text-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs ${
            isAdded
              ? 'bg-neutral-900 text-[#87D215] border border-neutral-800'
              : 'bg-[#87D215] hover:bg-[#79BE10] text-black font-extrabold active:scale-[0.98] shadow-sm hover:shadow-[0_4px_16px_rgba(135,210,21,0.35)]'
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>{t('card.added')}</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
              <span>{t('card.addToCart')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}



