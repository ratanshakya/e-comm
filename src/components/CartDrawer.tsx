'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function CartDrawer() {
  const { t } = useLanguage();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    couponCode,
    applyCoupon,
    removeCoupon,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponError, setCouponError] = useState('');
  const [settings, setSettings] = useState<any>(null);

  React.useEffect(() => {
    if (isCartOpen) {
      fetch('/api/settings', { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setSettings(data.data);
          }
        })
        .catch(console.error);
    }
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const FREE_SHIPPING_THRESHOLD = settings?.freeShippingThreshold ?? 999;
  const FLAT_SHIPPING_FEE = settings?.flatShippingFee ?? 99;

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingFee = subtotal > 0 && !isFreeShipping ? FLAT_SHIPPING_FEE : 0;
  const finalTotal = subtotal - discount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Invalid code. Try "RADHE10" or "KRISHNA20"');
    } else {
      setInputCoupon('');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        {/* Slide-over Drawer */}
        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col text-neutral-900"
          >
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-black" />
                <h2 className="text-lg font-bold font-serif-royal text-black">
                  {t('cart.title')}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-200 text-black font-bold">
                  {cart.length}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Meter */}
            <div className="bg-white px-5 py-3 border-b border-neutral-200">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-neutral-700 font-semibold">
                  {isFreeShipping
                    ? t('cart.freeShippingUnlocked')
                    : t('cart.addMoreForFreeShipping', { amount: amountNeededForFreeShipping })}
                </span>
                <span className="text-black font-extrabold">
                  {Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black">{t('cart.emptyTitle')}</h3>
                    <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                      {t('cart.emptyDesc')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      const el = document.getElementById('catalog-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="luxury-black-btn px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer"
                  >
                    {t('cart.exploreBtn')}
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedSize}`}
                    className="flex gap-3.5 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 relative group"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-black line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-neutral-400 hover:text-black p-1 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white text-black font-bold border border-neutral-300">
                            Size {item.selectedSize}
                          </span>
                          <span className="text-[11px] text-neutral-500 line-clamp-1">
                            {item.product.fabric.split('&')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-200">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-neutral-300 px-1.5 py-0.5 shadow-xs">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                            }
                            className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-black px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                            }
                            className="p-1 text-neutral-500 hover:text-black cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-sm font-bold text-black">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bottom Checkout Section */}
            {cart.length > 0 && (
              <div className="p-5 bg-neutral-50 border-t border-neutral-200 space-y-3.5">
                {/* Coupon Box */}
                <div>
                  {couponCode ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs text-black">
                      <div className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-black" />
                        <span>{t('cart.couponApplied', { code: couponCode, discount })}</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-neutral-600 hover:text-black underline cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder={t('cart.couponPlaceholder')}
                        className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-neutral-300 text-black placeholder-neutral-400 outline-none uppercase"
                      />
                      <button
                        type="submit"
                        className="luxury-black-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        {t('cart.apply')}
                      </button>
                    </form>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
                  )}
                </div>

                {/* Subtotals breakdown */}
                <div className="space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>{t('cart.subtotal')}</span>
                    <span className="font-semibold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-black font-semibold">
                      <span>{t('cart.discount')}</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{t('cart.shipping')}</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-700 font-bold">{t('cart.free')}</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-black pt-2 border-t border-neutral-200">
                    <span>{t('cart.total')}</span>
                    <span className="text-base font-extrabold text-black">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full luxury-black-btn py-3.5 rounded-full font-bold text-center flex items-center justify-center gap-2 group shadow-md text-xs uppercase tracking-wider cursor-pointer"
                >
                  <span>{t('cart.checkout')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Continue Shopping Button */}
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 rounded-full font-bold text-center text-xs text-neutral-700 hover:text-black hover:bg-neutral-200/80 transition-colors cursor-pointer border border-neutral-300"
                >
                  {t('cart.continueShopping')}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-black" />
                  <span>{t('cart.guarantee')}</span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
