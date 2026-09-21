'use client';

import React, { useState, use, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  Truck,
  RotateCcw,
  Maximize2,
  Share2,
  MessageCircle,
  Plus,
  Minus,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Lock,
  ArrowUpRight,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist, setIsSizeGuideOpen, setIsCartOpen } = useCart();
  const { t, language } = useLanguage();

  const initialProduct = PRODUCTS.find((p) => p.id === resolvedParams.id) || PRODUCTS[0];
  const [product, setProduct] = useState(initialProduct);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            setProduct(data.data);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch product from API:', err);
      }
    }
    fetchProduct();
  }, [resolvedParams.id]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || '1');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'additional' | 'reviews'>('description');
  const [isAdded, setIsAdded] = useState(false);

  const isLiked = wishlist.includes(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const currentImage = product.images[selectedImageIndex] || product.images[0];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity, true);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity, true);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Frequently Bought Together combo items
  const comboItems = useMemo(() => {
    if (product.id === 'thakurji-swarna-singhasan-3d') {
      return [
        product,
        PRODUCTS.find((p) => p.id === 'zardozi-royal-crimson-peacock') || PRODUCTS[0],
        PRODUCTS.find((p) => p.id === 'kundan-mor-mukut-shringar-set') || PRODUCTS[1],
      ];
    } else if (product.category === 'poshak') {
      return [
        product,
        PRODUCTS.find((p) => p.id === 'kundan-mor-mukut-shringar-set') || PRODUCTS[1],
        PRODUCTS.find((p) => p.id === 'thakurji-swarna-singhasan-3d') || PRODUCTS[2],
      ];
    } else {
      return [
        product,
        PRODUCTS.find((p) => p.id === 'zardozi-royal-crimson-peacock') || PRODUCTS[0],
        PRODUCTS.find((p) => p.id === 'thakurji-swarna-singhasan-3d') || PRODUCTS[2],
      ];
    }
  }, [product]);

  const [selectedComboIds, setSelectedComboIds] = useState<string[]>([
    product.id,
    comboItems[1]?.id || '',
    comboItems[2]?.id || ''
  ]);

  const [comboSizes, setComboSizes] = useState<Record<string, string>>({
    [product.id]: selectedSize,
    [comboItems[1]?.id || '']: comboItems[1]?.sizes[0] || '1',
    [comboItems[2]?.id || '']: comboItems[2]?.sizes[0] || '1',
  });

  const toggleComboItem = (id: string) => {
    if (selectedComboIds.includes(id)) {
      if (selectedComboIds.length > 1) {
        setSelectedComboIds((prev) => prev.filter((x) => x !== id));
      }
    } else {
      setSelectedComboIds((prev) => [...prev, id]);
    }
  };

  const comboTotal = comboItems
    .filter((item) => selectedComboIds.includes(item.id))
    .reduce((sum, item) => sum + item.price, 0);

  const comboOriginal = comboItems
    .filter((item) => selectedComboIds.includes(item.id))
    .reduce((sum, item) => sum + item.originalPrice, 0);

  const comboDiscount = selectedComboIds.length >= 2 ? Math.round(comboTotal * 0.1) : 0;
  const finalComboPrice = comboTotal - comboDiscount;

  const handleAddComboToCart = () => {
    comboItems.forEach((item) => {
      if (selectedComboIds.includes(item.id)) {
        const sizeToUse = item.id === product.id ? selectedSize : (comboSizes[item.id] || item.sizes[0] || '1');
        addToCart(item, sizeToUse, 1, false);
      }
    });
    setIsCartOpen(true);
  };

  const handleWhatsAppChat = () => {
    const message = encodeURIComponent(
      `Radhe Radhe! I am interested in purchasing "${product.name}" (Size ${selectedSize}) from Shree Kanha Divine.`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this beautiful dress for Laddu Gopal Ji: ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white text-neutral-900">
      <Navbar />

      <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-8 py-6 w-full">
        {/* Top Breadcrumb & Page Navigator (Crocohill Style) */}
        <div className="flex items-center justify-between text-xs text-neutral-500 py-3 border-b border-neutral-100 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-black font-medium">Home</Link>
            <span>›</span>
            <Link href="/#catalog-section" className="hover:text-black font-medium capitalize">
              {product.categoryLabel}
            </Link>
            <span>›</span>
            <span className="text-neutral-800 font-medium truncate max-w-xs">{product.name}</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-neutral-400">
            <Link href="/#catalog-section" title="Back to Catalog" className="hover:text-black">
              <LayoutGrid className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Section 1: Main Product Overview Grid (Crocohill Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16">
          {/* Left: Images Gallery (Vertical Thumbnails + Main View) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4 items-start">
            {/* Vertical Thumbnails List */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible w-full sm:w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-black' : 'border-neutral-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
              {/* Extra sample angles if single image */}
              {product.images.length === 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(0)}
                    className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 border-2 border-neutral-200 opacity-70 hover:opacity-100"
                  >
                    <Image src={product.images[0]} alt="" fill className="object-cover scale-110" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(0)}
                    className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 border-2 border-neutral-200 opacity-70 hover:opacity-100"
                  >
                    <Image src={product.images[0]} alt="" fill className="object-cover scale-125" />
                  </button>
                </>
              )}
            </div>

            {/* Main Featured Image with Zoom & Chevrons */}
            <div className="relative flex-1 w-full aspect-square rounded-2xl overflow-hidden bg-[#F7F7F7] border border-neutral-200 group">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                priority
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Fullscreen / Lightbox button */}
              <button
                onClick={() => window.open(currentImage, '_blank')}
                className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-neutral-700 hover:text-black shadow-xs transition-colors"
                title="Expand Image"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Navigation Chevrons */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-black shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-black shadow-sm"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right: Purchase & Options (Crocohill Style) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Category tag */}
            <div className="text-xs text-neutral-500">
              <span>{t('product.category')} </span>
              <span className="text-[#D32F2F] font-semibold">{product.categoryLabel}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight leading-snug">
              {language === 'hi' && product.hindiName ? product.hindiName : product.name}
            </h1>
            {language === 'hi' && product.name !== product.hindiName && (
              <p className="text-sm font-semibold text-neutral-600 mt-1">
                {product.hindiName}
              </p>
            )}

            {/* In stock badge */}
            <div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded">
                {t('product.inStock')}
              </span>
            </div>

            {/* Price Line with Red Sale Price & Discount Pill */}
            <div className="flex items-center gap-3 py-1">
              {product.originalPrice > product.price && (
                <span className="text-base sm:text-lg text-neutral-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}.00
                </span>
              )}
              <span className="text-2xl sm:text-3xl font-bold text-[#D32F2F]">
                ₹{product.price.toLocaleString('en-IN')}.00
              </span>
              {discountPercent > 0 && (
                <span className="bg-[#D32F2F] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {discountPercent}% {t('product.off')}
                </span>
              )}
            </div>

            {/* Color section */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-medium text-neutral-700">
                {t('product.color')} <strong className="text-black">{product.color}</strong>
              </span>
              <div className="flex gap-2">
                <button className="px-3.5 py-1.5 rounded-full bg-[#87D215] text-black text-xs font-black border border-[#79BE10] shadow-xs">
                  {product.color.split('&')[0]}
                </button>
              </div>
            </div>

            {/* Deity Size selection */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-700">
                  {t('product.size')} <strong className="text-black">{selectedSize === 'All Sizes' ? t('product.allSizes') : `No. ${selectedSize}`}</strong>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-neutral-600 underline font-semibold hover:text-black flex items-center gap-1"
                >
                  <span>{t('product.sizeGuide')}</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[42px] h-9 px-3 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'bg-[#87D215] text-black font-black border border-[#79BE10] shadow-sm'
                        : 'bg-white text-neutral-800 border border-neutral-300 hover:border-black'
                    }`}
                  >
                    {s === 'All Sizes' ? t('product.allSizes') : `No. ${s}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions Row */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-medium text-neutral-700 block">{t('product.quantity')}</span>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Green WhatsApp Chat With Us Button (Crocohill Style) */}
                <button
                  onClick={handleWhatsAppChat}
                  className="px-4 py-2.5 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>{t('product.chatWhatsApp')}</span>
                </button>

                {/* [- 1 +] Quantity Selector */}
                <div className="flex items-center border border-neutral-300 rounded-lg px-2 py-1 bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    title={t('card.decrease')}
                    className="p-1 text-neutral-500 hover:text-black"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    title={t('card.increase')}
                    className="p-1 text-neutral-500 hover:text-black"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart - Price Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                    isAdded
                      ? 'bg-neutral-900 text-[#87D215] border border-neutral-800'
                      : 'bg-[#87D215] hover:bg-[#79BE10] text-black shadow-sm hover:shadow-[0_6px_20px_rgba(135,210,21,0.35)] active:scale-[0.98]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{t('product.added')}</span>
                    </>
                  ) : (
                    <span>{t('product.addToCart')} — ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2.5 rounded-md border border-neutral-300 hover:border-black text-neutral-700 hover:text-black bg-white"
                  title="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                {/* Size guide trigger */}
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="p-2.5 rounded-md border border-neutral-300 hover:border-black text-neutral-700 hover:text-black bg-white"
                  title={t('product.sizeGuide')}
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Buy Now & Review in Bag Button */}
              <button
                onClick={handleBuyNow}
                className="w-full bg-[#87D215] hover:bg-[#78BD0E] text-black font-black py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_6px_20px_rgba(135,210,21,0.35)] transition-all cursor-pointer active:scale-[0.98]"
              >
                <span>⚡ {language === 'hi' ? 'तुरंत खरीदें (झोली में देखें)' : 'Buy Now & Review in Bag'}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Share link & Meta */}
            <div className="pt-2 space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-neutral-800 font-semibold hover:underline"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t('product.share')}</span>
              </button>
              <div>
                <span>{t('product.sku')} </span>
                <span className="text-black font-medium">VRN-1298</span>
              </div>
              <div>
                <span>{t('product.categories')} </span>
                <span className="text-black font-medium">{product.categoryLabel}, Vrindavan Silk Poshak</span>
              </div>
            </div>

            {/* Delivery & Return Promise Cards (Crocohill Style) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start gap-3">
                <Truck className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600 leading-snug">
                  {t('product.deliveryEstimate')}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-white flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
                <p className="text-xs text-neutral-600 leading-snug">
                  {t('product.returnPolicy')}
                </p>
              </div>
            </div>

            {/* Guarantee Safe Checkout */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex items-center gap-1.5 font-semibold text-black">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('product.safeCheckout')}</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-neutral-400 text-[10px]">
                <span className="border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-700">UPI / GPay / PhonePe</span>
                <span className="border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-700">RuPay</span>
                <span className="border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-700">Cards</span>
                <span className="border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-700">NetBanking</span>
                <span className="border border-neutral-300 px-1.5 py-0.5 rounded text-neutral-700 font-bold text-black">COD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together / Complete Darshan Combo (अक्सर साथ में चुने जाने वाले दिव्य उत्पाद) */}
        <section className="mb-16 p-6 sm:p-9 rounded-3xl bg-neutral-50/90 border border-neutral-200/90 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-[11px] font-bold text-black shadow-2xs mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#87D215]" />
                <span>{language === 'hi' ? 'संपूर्ण दर्शन सेवा कॉम्बो' : 'Frequently Bought Together'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif-royal text-black tracking-tight">
                {language === 'hi' ? 'अक्सर साथ में चुने जाने वाले दिव्य उत्पाद' : 'Frequently Selected Together for Thakur Ji'}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'hi'
                  ? 'ठाकुर जी के पूर्ण श्रृंगार व सेवा के लिए ये दिव्य वस्तुएं एक साथ ऑर्डर करें और 10% कॉम्बो छूट पाएं।'
                  : 'Select complementary sacred items to complete your home altar darshan with special combo savings.'}
              </p>
            </div>

            {selectedComboIds.length >= 2 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#87D215]/20 border border-[#87D215]/50 text-xs font-black text-black shrink-0 self-start sm:self-auto">
                <span>⚡ 10% Combo Seva Discount Applied</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 8 Cols: Product Cards Row with '+' separators */}
            <div className="lg:col-span-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              {comboItems.map((item, index) => {
                const isChecked = selectedComboIds.includes(item.id);
                const isCurrent = item.id === product.id;
                return (
                  <React.Fragment key={item.id}>
                    <div
                      onClick={() => toggleComboItem(item.id)}
                      className={`flex-1 w-full sm:w-auto p-4 rounded-2xl bg-white border transition-all cursor-pointer select-none relative ${
                        isChecked
                          ? 'border-black shadow-sm ring-1 ring-black/10'
                          : 'border-neutral-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* Top Checkbox & Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComboItem(item.id);
                            }}
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              isChecked
                                ? 'bg-[#87D215] border-[#79BE10] text-black font-black'
                                : 'bg-white border-neutral-300'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>
                          <span className="text-xs font-bold text-black">
                            {isCurrent ? (language === 'hi' ? 'यह उत्पाद' : 'This Item') : `Item 0${index + 1}`}
                          </span>
                        </div>
                        {isCurrent && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-800">
                            Current
                          </span>
                        )}
                      </div>

                      {/* Image Frame */}
                      <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-neutral-100 mb-3 border border-neutral-150">
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Name & Size */}
                      <h4 className="text-xs font-bold text-black line-clamp-1 mb-1" title={item.name}>
                        {language === 'hi' && item.hindiName ? item.hindiName : item.name}
                      </h4>

                      {/* Size Selector */}
                      <div
                        className="flex items-center justify-between text-[11px] mb-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-neutral-500 font-semibold">{t('card.size')}</span>
                        {item.sizes.length > 1 ? (
                          <select
                            value={isCurrent ? selectedSize : (comboSizes[item.id] || item.sizes[0])}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (isCurrent) {
                                setSelectedSize(val);
                              }
                              setComboSizes((prev) => ({ ...prev, [item.id]: val }));
                            }}
                            className="text-xs font-bold bg-neutral-100 border border-neutral-300 rounded px-2 py-0.5 outline-none text-black cursor-pointer"
                          >
                            {item.sizes.map((s) => (
                              <option key={s} value={s}>
                                {s === 'All Sizes' ? (language === 'hi' ? 'सभी' : 'All') : `No. ${s}`}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-bold text-black">{item.sizes[0]}</span>
                        )}
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-1.5 pt-1 border-t border-neutral-100">
                        <span className="text-sm font-black text-[#D32F2F]">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[11px] text-neutral-400 line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {index < comboItems.length - 1 && (
                      <div className="w-8 h-8 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-600 font-bold shrink-0 shadow-2xs">
                        <Plus className="w-4 h-4 text-black" />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Right 4 Cols: Bundle Pricing Card & Add to Cart Button */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
              <div className="text-xs text-neutral-500 font-bold uppercase tracking-wider">
                {language === 'hi' ? 'कॉम्बो विवरण' : 'Combo Summary'} ({selectedComboIds.length} Products Selected)
              </div>

              <div className="space-y-2 text-xs text-neutral-600 pb-3 border-b border-neutral-100">
                <div className="flex justify-between">
                  <span>Regular Total:</span>
                  <span className="line-through text-neutral-400 font-medium">₹{comboTotal.toLocaleString('en-IN')}</span>
                </div>
                {comboDiscount > 0 && (
                  <div className="flex justify-between text-[#87D215] font-black">
                    <span>10% Combo Savings:</span>
                    <span>-₹{comboDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-neutral-200">
                  <span className="text-sm font-bold text-black">{language === 'hi' ? 'कॉम्बो मूल्य:' : 'Bundle Price:'}</span>
                  <span className="text-xl font-black text-[#D32F2F]">
                    ₹{finalComboPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Add All to Cart Button */}
              <button
                type="button"
                onClick={handleAddComboToCart}
                className="w-full bg-[#87D215] hover:bg-[#78BD0E] text-black font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:shadow-[0_6px_20px_rgba(135,210,21,0.35)] transition-all cursor-pointer active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                <span>
                  {language === 'hi'
                    ? `चुने हुए (${selectedComboIds.length}) उत्पाद जोड़ें व देखें`
                    : `Add Selected (${selectedComboIds.length}) to Bag`}
                </span>
              </button>

              <div className="flex items-center gap-2 text-[11px] text-neutral-500 justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#87D215]" />
                <span>{language === 'hi' ? 'सभी उत्पाद एक साथ पवित्र तुलसी सहित पैक होंगे' : 'All items packed together with sacred Tulsi leaves'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Tabbed Description & Additional Info */}
        <section className="border border-neutral-200 rounded-2xl p-6 sm:p-10 mb-16 bg-white">
          {/* Tabs header */}
          <div className="flex items-center gap-6 sm:gap-8 border-b border-neutral-200 pb-4 mb-8 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-2 transition-all relative ${
                activeTab === 'description'
                  ? 'text-black font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-black'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              {t('product.tabDescription')}
            </button>

            <button
              onClick={() => setActiveTab('additional')}
              className={`pb-2 transition-all relative ${
                activeTab === 'additional'
                  ? 'text-black font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-black'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              {t('product.tabSpecs')}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition-all relative ${
                activeTab === 'reviews'
                  ? 'text-black font-bold after:absolute after:bottom-[-17px] after:left-0 after:right-0 after:h-0.5 after:bg-black'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              {t('product.tabReviews')} ({product.reviewsCount})
            </button>
          </div>

          {/* Tab 1: Description Content */}
          {activeTab === 'description' && (
            <div className="space-y-6 max-w-4xl text-neutral-800">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif-royal tracking-tight text-black">
                Embrace Sacred Splendor with Handcrafted {product.name}
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description} Hand-tailored in the sacred precincts of Braj Dham, each garment is stitched with deep devotion (seva bhav), ensuring flawless ghera flare, certified non-toxic embroidery, and heirloom elegance for your home altar.
              </p>

              <h3 className="text-xl font-bold font-serif-royal text-black pt-2">
                Vrindavan Craftsmanship: Royal, Sacred & Pristine
              </h3>

              <ul className="space-y-2.5 text-sm text-neutral-600 list-disc pl-5">
                <li><strong className="text-black">Pure Silk & Metallic Zari:</strong> Hand-spun fabric embellished with real metallic zardozi threads and lustrous borders.</li>
                <li><strong className="text-black">100% Idol Safe:</strong> Certified color-fast materials that will never harm or stain brass, ashtadhatu, or marble deities.</li>
                <li><strong className="text-black">Circular Flare (Ghera):</strong> Designed to spread evenly on thrones, singhasans, and miniature beds.</li>
                <li><strong className="text-black">Complete Shringar Set:</strong> Includes matching mor mukut crown, designer choli, and waist patka.</li>
                <li><strong className="text-black">Blessed Packing:</strong> Prepared with sacred Braj Raj and fragrant Yamuna Tulsi prasad.</li>
              </ul>

              <div className="pt-4 space-y-1.5 text-xs text-neutral-600 border-t border-neutral-100">
                <p><strong className="text-black">Color & Design Focus:</strong> {product.color} with intricate peacock and lotus motifs.</p>
                <p><strong className="text-black">Fabric Composition:</strong> {product.fabric}</p>
                <p><strong className="text-black">Target Deity:</strong> Laddu Gopal Ji (Bal Gopal, Thakur Ji, Kanha Ji)</p>
                <p><strong className="text-black">Benefits:</strong> Sacred seva purity, easy comfortable dressing, and radiant darshan.</p>
              </div>
            </div>
          )}

          {/* Tab 2: Additional information */}
          {activeTab === 'additional' && (
            <div className="max-w-2xl text-xs sm:text-sm">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 font-semibold text-neutral-500 w-44">Fabric & Material</td>
                    <td className="py-3 text-black font-medium">{product.fabric}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 font-semibold text-neutral-500">Color Palette</td>
                    <td className="py-3 text-black font-medium">{product.color}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 font-semibold text-neutral-500">Available Sizes</td>
                    <td className="py-3 text-black font-medium">Deity Sizes {product.sizes.join(', ')}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 font-semibold text-neutral-500">Occasion</td>
                    <td className="py-3 text-black font-medium">{product.occasion.join(', ')}</td>
                  </tr>
                  <tr className="border-b border-neutral-200">
                    <td className="py-3 font-semibold text-neutral-500">Origin</td>
                    <td className="py-3 text-black font-medium">Handcrafted in Vrindavan Dham, Uttar Pradesh</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold text-neutral-500">Care Instructions</td>
                    <td className="py-3 text-black font-medium">Gentle dry clean or soft cloth dusting. Do not bleach.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold text-black">{product.rating} out of 5</span>
                <span className="text-xs text-neutral-500">based on {product.reviewsCount} devotee reviews</span>
              </div>

              <div className="space-y-4 pt-4">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-black">Radhika Sharma (Verified Devotee)</strong>
                    <span className="text-neutral-400">3 days ago</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    The fabric is pure silk and the zari sparkle is so divine! The mukut fit our Size 4 Kanha Ji perfectly.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <strong className="text-black">Amitabh Sen (Verified Devotee)</strong>
                    <span className="text-neutral-400">1 week ago</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    Delivered within 3 days with Tulsi leaves in packing. Top boutique quality!
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Sacred Quality & Seva Assurances (4-Cards Grid) */}
        <section className="mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                <h4 className="text-sm font-bold text-black">Non-Toxic & Safe for Idols</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed pl-8">
                Will never discolor or harm your brass, ashtadhatu, or marble Laddu Gopal deities.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                <h4 className="text-sm font-bold text-black">Precision Flare Architecture</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed pl-8">
                Circular lehenga flares designed to spread symmetrically on singhasan and bed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                <h4 className="text-sm font-bold text-black">Pure 24K Gold Plating</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed pl-8">
                Mukuts and bansuris feature long-lasting anti-tarnish micro lacquer.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
                <h4 className="text-sm font-bold text-black">Blessed Packaging</h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed pl-8">
                Each parcel is blessed with sacred Braj Raj and fragrant Tulsi prasad.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Related Products (Crocohill Style - Screenshot 3) */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif-royal text-center text-black mb-10">
            {t('product.relatedTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
