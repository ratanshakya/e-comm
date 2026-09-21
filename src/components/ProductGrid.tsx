'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Check,
} from 'lucide-react';
import { Product } from '@/types';
import { CATEGORIES } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { useLanguage } from '@/context/LanguageContext';

interface ProductGridProps {
  products: Product[];
  searchQuery?: string;
  settings?: any;
}

// Fixed bounds for the slider
const MIN_PRICE = 0;
const MAX_PRICE = 10000;

// Color options from user screenshot + essential devotional colors (Now managed via Admin Panel)

// Helper to match colors flexibly against product color/description/name
function matchProductColor(product: Product, colorName: string): boolean {
  const c = colorName.toLowerCase();
  const prodColor = (product.color || '').toLowerCase();
  const prodDesc = (product.description || '').toLowerCase();
  const prodName = (product.name || '').toLowerCase();

  if (c === 'black') return prodColor.includes('black') || prodDesc.includes('black') || prodName.includes('black');
  if (c === 'blue') return prodColor.includes('blue') || prodColor.includes('sapphire') || prodColor.includes('teal');
  if (c === 'brown') return prodColor.includes('brown') || prodDesc.includes('brown');
  if (c === 'gray') return prodColor.includes('gray') || prodColor.includes('grey');
  if (c === 'tan') return prodColor.includes('tan') || prodColor.includes('beige');
  if (c === 'red') return prodColor.includes('red') || prodColor.includes('crimson') || prodColor.includes('ruby');
  if (c === 'gold') return prodColor.includes('gold') || prodColor.includes('zari') || prodDesc.includes('gold');
  if (c === 'green') return prodColor.includes('green') || prodColor.includes('emerald');
  if (c === 'yellow') return prodColor.includes('yellow') || prodColor.includes('kesari') || prodColor.includes('saffron') || prodColor.includes('amber') || prodColor.includes('turmeric');
  if (c === 'white') return prodColor.includes('white') || prodColor.includes('pearl');
  return prodColor.includes(c);
}

// 1. List View Icon
function ListViewIcon({ active }: { active: boolean }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" className={active ? 'text-black' : 'text-neutral-300 hover:text-neutral-500'}>
      <circle cx="2" cy="2.5" r="1.5" fill="currentColor" />
      <rect x="6" y="1.5" width="12" height="2" rx="1" fill="currentColor" />
      <circle cx="2" cy="7" r="1.5" fill="currentColor" />
      <rect x="6" y="6" width="12" height="2" rx="1" fill="currentColor" />
      <circle cx="2" cy="11.5" r="1.5" fill="currentColor" />
      <rect x="6" y="10.5" width="12" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}

// 2. Two Columns (2x2 dots)
function TwoColIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={active ? 'text-black' : 'text-neutral-300 hover:text-neutral-500'}>
      <circle cx="3.5" cy="3.5" r="1.8" fill="currentColor" />
      <circle cx="10.5" cy="3.5" r="1.8" fill="currentColor" />
      <circle cx="3.5" cy="10.5" r="1.8" fill="currentColor" />
      <circle cx="10.5" cy="10.5" r="1.8" fill="currentColor" />
    </svg>
  );
}

// 3. Three Columns (3x2 dots)
function ThreeColIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none" className={active ? 'text-black' : 'text-neutral-300 hover:text-neutral-500'}>
      <circle cx="3" cy="3.5" r="1.6" fill="currentColor" />
      <circle cx="10" cy="3.5" r="1.6" fill="currentColor" />
      <circle cx="17" cy="3.5" r="1.6" fill="currentColor" />
      <circle cx="3" cy="10.5" r="1.6" fill="currentColor" />
      <circle cx="10" cy="10.5" r="1.6" fill="currentColor" />
      <circle cx="17" cy="10.5" r="1.6" fill="currentColor" />
    </svg>
  );
}

// 4. Four Columns (4x2 dots - exactly as in user screenshot)
function FourColIcon({ active }: { active: boolean }) {
  return (
    <svg width="26" height="14" viewBox="0 0 26 14" fill="none" className={active ? 'text-black' : 'text-neutral-300 hover:text-neutral-500'}>
      <circle cx="3" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="9.5" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="16" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="22.5" cy="3.5" r="1.5" fill="currentColor" />
      <circle cx="3" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="9.5" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="16" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="22.5" cy="10.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

// 5. Five Columns (5x2 dots)
function FiveColIcon({ active }: { active: boolean }) {
  return (
    <svg width="32" height="14" viewBox="0 0 32 14" fill="none" className={active ? 'text-black' : 'text-neutral-300 hover:text-neutral-500'}>
      <circle cx="3" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="9" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="15" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="21" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="27" cy="3.5" r="1.4" fill="currentColor" />
      <circle cx="3" cy="10.5" r="1.4" fill="currentColor" />
      <circle cx="9" cy="10.5" r="1.4" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1.4" fill="currentColor" />
      <circle cx="21" cy="10.5" r="1.4" fill="currentColor" />
      <circle cx="27" cy="10.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function ProductGrid({ products, searchQuery = '', settings }: ProductGridProps) {
  const { t, language } = useLanguage();

  // Dynamic filter options
  const colorOptions = settings?.filterColors?.length > 0 ? settings.filterColors : ['Black', 'Blue', 'Brown', 'Gray', 'Tan', 'Red', 'Gold', 'Green', 'Yellow', 'White'];
  const sizeOptions = ['all', ...(settings?.filterSizes?.map((s: string) => s.replace('No. ', '')) || ['0', '1', '2', '3', '4', '5', '6'])];

  // Filter & Layout states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [gridCols, setGridCols] = useState<1 | 2 | 3 | 4 | 5>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('default');

  // Accordion open/close states inside filter panel
  const [openSections, setOpenSections] = useState({
    price: true,
    color: true,
    size: true,
    category: true,
  });

  const toggleSection = (section: 'price' | 'color' | 'size' | 'category') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [categoryList, setCategoryList] = useState<
    Array<{ id: string; label: string; icon?: string; count?: number; hindiLabel?: string }>
  >(CATEGORIES);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          if (data?.data?.length > 0) {
            setCategoryList(data.data);
          }
        }
      } catch (e) {
        console.warn('Using default categories fallback:', e);
      }
    }
    loadCategories();
  }, []);

  // Lock body scroll when filter drawer is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFilterOpen]);

  // Dual range slider percentage
  const getPercent = (value: number) =>
    Math.round(((value - MIN_PRICE) / (MAX_PRICE - MIN_PRICE)) * 100);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), priceRange[1] - 50);
    setPriceRange([val, priceRange[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), priceRange[0] + 50);
    setPriceRange([priceRange[0], val]);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setPriceRange([MIN_PRICE, MAX_PRICE]);
    setSelectedColors([]);
    setSortBy('default');
  };

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE) count += 1;
    if (selectedColors.length > 0) count += selectedColors.length;
    if (selectedSize !== 'all') count += 1;
    if (selectedCategory !== 'all') count += 1;
    return count;
  }, [priceRange, selectedColors, selectedSize, selectedCategory]);

  const getCategoryLabel = (id: string, defaultLabel: string, hindiLabel?: string) => {
    if (language === 'hi' && hindiLabel) return hindiLabel;
    switch (id) {
      case 'all': return t('catalog.all');
      case 'poshak': return t('catalog.poshak');
      case 'shringar': return t('catalog.shringar');
      case 'singhasan-jhula': return t('catalog.singhasan');
      case 'winter-special': return t('catalog.winter');
      case 'seva-samagri': return t('catalog.seva');
      default: return defaultLabel;
    }
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.hindiName.includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Deity Size
    if (selectedSize !== 'all') {
      list = list.filter((p) => p.sizes.includes(selectedSize) || p.sizes.includes('All Sizes'));
    }

    // Price Range
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Colors
    if (selectedColors.length > 0) {
      list = list.filter((p) => selectedColors.some((c) => matchProductColor(p, c)));
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (sortBy === 'latest') {
      list.reverse();
    }

    return list;
  }, [products, searchQuery, selectedCategory, selectedSize, priceRange, selectedColors, sortBy]);

  // Responsive Grid Class
  const getGridClass = () => {
    switch (gridCols) {
      case 1:
        return 'grid grid-cols-1 gap-6 max-w-3xl mx-auto';
      case 2:
        return 'grid grid-cols-2 sm:grid-cols-2 gap-4 sm:gap-6';
      case 3:
        return 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6';
      case 4:
        return 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5';
      case 5:
        return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4';
      default:
        return 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5';
    }
  };

  return (
    <section id="catalog-section" className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 w-full">

      {/* Category Tabs (Minimalist Luxury) */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {categoryList.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className="relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className="absolute inset-0 bg-[#87D215] rounded-full shadow-sm"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? 'text-black font-black' : 'text-neutral-600 hover:text-black font-bold'}`}>
                {getCategoryLabel(cat.id, cat.label, cat.hindiLabel)}
              </span>
            </button>
          );
        })}
      </div>

      {/* EXACT USER SCREENSHOT TOOLBAR (Image 2) */}
      <div className="bg-white rounded-lg p-2 sm:p-2.5 mb-5 border border-neutral-200/90 flex items-center justify-between gap-4 shadow-2xs">
        {/* Left: FILTER button with 3-lines icon */}
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 border border-neutral-200 hover:border-black rounded-md bg-white text-xs font-bold uppercase tracking-wider text-black transition-all cursor-pointer shadow-2xs group"
        >
          {/* 3 Horizontal Lines of decreasing width */}
          <svg width="15" height="11" viewBox="0 0 15 11" fill="none" className="text-black group-hover:scale-105 transition-transform">
            <rect x="0" y="0.5" width="15" height="1.8" rx="0.9" fill="currentColor" />
            <rect x="2.5" y="4.6" width="10" height="1.8" rx="0.9" fill="currentColor" />
            <rect x="5" y="8.7" width="5" height="1.8" rx="0.9" fill="currentColor" />
          </svg>
          <span>FILTER</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#87D215] text-black text-[10px] font-black flex items-center justify-center shadow-xs">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Center: Grid Column Switchers (List, 2, 3, 4, 5) */}
        <div className="hidden sm:flex items-center gap-2.5 text-neutral-400">
          <button
            type="button"
            onClick={() => setGridCols(1)}
            title="1 Column / List View"
            className="p-1 hover:text-black transition-colors cursor-pointer"
          >
            <ListViewIcon active={gridCols === 1} />
          </button>
          <button
            type="button"
            onClick={() => setGridCols(2)}
            title="2 Columns"
            className="p-1 hover:text-black transition-colors cursor-pointer"
          >
            <TwoColIcon active={gridCols === 2} />
          </button>
          <button
            type="button"
            onClick={() => setGridCols(3)}
            title="3 Columns"
            className="p-1 hover:text-black transition-colors cursor-pointer"
          >
            <ThreeColIcon active={gridCols === 3} />
          </button>
          <button
            type="button"
            onClick={() => setGridCols(4)}
            title="4 Columns"
            className="p-1 hover:text-black transition-colors cursor-pointer"
          >
            <FourColIcon active={gridCols === 4} />
          </button>
          <button
            type="button"
            onClick={() => setGridCols(5)}
            title="5 Columns"
            className="p-1 hover:text-black transition-colors cursor-pointer"
          >
            <FiveColIcon active={gridCols === 5} />
          </button>
        </div>

        {/* Right: Sort By Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-800 text-xs font-medium rounded-md pl-3 pr-8 py-2 focus:border-black outline-none cursor-pointer transition-colors shadow-2xs"
          >
            <option value="default">Default sorting</option>
            <option value="popular">Sort by popularity</option>
            <option value="rating">Sort by average rating</option>
            <option value="latest">Sort by latest</option>
            <option value="price-low">Sort by price: low to high</option>
            <option value="price-high">Sort by price: high to low</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Active Filter Badges (if any active) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-neutral-500 font-bold uppercase tracking-wider text-[11px] mr-1">Active Filters:</span>

          {/* Price badge */}
          {(priceRange[0] > MIN_PRICE || priceRange[1] < MAX_PRICE) && (
            <button
              onClick={() => setPriceRange([MIN_PRICE, MAX_PRICE])}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-black rounded-full font-bold transition-colors cursor-pointer"
            >
              <span>Price: ₹{priceRange[0].toLocaleString('en-IN')} — ₹{priceRange[1].toLocaleString('en-IN')}</span>
              <X className="w-3 h-3 text-neutral-600 hover:text-black" />
            </button>
          )}

          {/* Color badges */}
          {selectedColors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-black rounded-full font-bold transition-colors cursor-pointer"
            >
              <span>Color: {color}</span>
              <X className="w-3 h-3 text-neutral-600 hover:text-black" />
            </button>
          ))}

          {/* Size badge */}
          {selectedSize !== 'all' && (
            <button
              onClick={() => setSelectedSize('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-black rounded-full font-bold transition-colors cursor-pointer"
            >
              <span>Deity Size: No. {selectedSize}</span>
              <X className="w-3 h-3 text-neutral-600 hover:text-black" />
            </button>
          )}

          {/* Category badge */}
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-black rounded-full font-bold transition-colors cursor-pointer"
            >
              <span>Collection: {categoryList.find((c) => c.id === selectedCategory)?.label || selectedCategory}</span>
              <X className="w-3 h-3 text-neutral-600 hover:text-black" />
            </button>
          )}

          {/* Clear All */}
          <button
            onClick={resetAllFilters}
            className="text-neutral-500 hover:text-[#D32F2F] underline font-bold ml-2 cursor-pointer text-xs"
          >
            Clear All
          </button>
        </div>
      )}

      {/* PRODUCTS GRID */}
      {filteredProducts.length > 0 ? (
        <motion.div layout className={getGridClass()}>
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25 }}
              >
                <ProductCard product={product} priority={index < 4} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-16 bg-neutral-50 rounded-3xl p-8 border border-neutral-200 max-w-lg mx-auto my-6">
          <Sparkles className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-black mb-1">{t('catalog.noProductsTitle')}</h3>
          <p className="text-neutral-500 text-xs sm:text-sm max-w-sm mx-auto mb-5">
            {t('catalog.noProductsDesc')}
          </p>
          <button
            onClick={resetAllFilters}
            className="luxury-brand-btn px-6 py-2.5 rounded-full text-xs font-black cursor-pointer shadow-sm"
          >
            {t('catalog.resetFilters')}
          </button>
        </div>
      )}

      {/* EXACT USER SCREENSHOT FILTER DRAWER (Image 3 & 4) */}
      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer"
            />

            {/* Slide-out Drawer Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 w-full max-w-[340px] sm:max-w-[380px] bg-white shadow-2xl flex flex-col z-50"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black uppercase tracking-wider text-black">Filters</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-bold">
                    {filteredProducts.length} items
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 hover:text-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filter Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* 1. PRICE ACCORDION (Exact replica of Image 3 & 4) */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('price')}
                    className="w-full flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="text-base font-bold text-neutral-900">Price</span>
                    {openSections.price ? (
                      <ChevronUp className="w-4 h-4 text-neutral-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-700" />
                    )}
                  </button>

                  {openSections.price && (
                    <div className="mt-5">
                      {/* Dual Range Track with Red active line & white/red circular handles */}
                      <div className="dual-range-container w-full">
                        {/* Gray background bar */}
                        <div className="absolute w-full h-[2.5px] bg-neutral-200 rounded-full" />

                        {/* Red active slider segment */}
                        <div
                          className="absolute h-[2.5px] bg-[#E53935] rounded-full z-10"
                          style={{
                            left: `${getPercent(priceRange[0])}%`,
                            width: `${Math.max(0, getPercent(priceRange[1]) - getPercent(priceRange[0]))}%`,
                          }}
                        />

                        {/* Min thumb input */}
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step={25}
                          value={priceRange[0]}
                          onChange={handleMinPriceChange}
                          className="dual-range-input"
                          aria-label="Min price"
                        />

                        {/* Max thumb input */}
                        <input
                          type="range"
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          step={25}
                          value={priceRange[1]}
                          onChange={handleMaxPriceChange}
                          className="dual-range-input"
                          aria-label="Max price"
                        />
                      </div>

                      {/* Price text below slider (Matches exact font & format: Price: ₹315 — ₹1,499) */}
                      <div className="mt-3 text-xs text-neutral-600 font-medium">
                        Price:{' '}
                        <span className="font-bold text-neutral-900">
                          ₹{priceRange[0].toLocaleString('en-IN')}
                        </span>{' '}
                        &mdash;{' '}
                        <span className="font-bold text-neutral-900">
                          ₹{priceRange[1].toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Horizontal Divider */}
                  <div className="w-full h-px bg-neutral-200 mt-6" />
                </div>

                {/* 2. COLOR ACCORDION (Exact replica of Image 3 & 4) */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('color')}
                    className="w-full flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="text-base font-bold text-neutral-900">Color</span>
                    {openSections.color ? (
                      <ChevronUp className="w-4 h-4 text-neutral-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-700" />
                    )}
                  </button>

                  {openSections.color && (
                    <div className="mt-5">
                      {/* Color Boxes Grid (Black, Blue, Brown, Gray, Tan, Red, Gold...) */}
                      <div className="grid grid-cols-4 gap-2">
                        {colorOptions.map((col: string) => {
                          const isSelected = selectedColors.includes(col);
                          return (
                            <button
                              key={col}
                              type="button"
                              onClick={() => toggleColor(col)}
                              className={`py-2 px-1 text-center text-xs font-medium rounded-sm border transition-all cursor-pointer select-none ${
                                isSelected
                                  ? 'border-black bg-black text-white font-bold shadow-xs'
                                  : 'border-neutral-200 text-neutral-700 bg-white hover:border-neutral-400'
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Horizontal Divider */}
                  <div className="w-full h-px bg-neutral-200 mt-6" />
                </div>

                {/* 3. DEITY SIZE ACCORDION */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('size')}
                    className="w-full flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="text-base font-bold text-neutral-900">
                      Deity Size (साइज)
                    </span>
                    {openSections.size ? (
                      <ChevronUp className="w-4 h-4 text-neutral-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-700" />
                    )}
                  </button>

                  {openSections.size && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {sizeOptions.map((s) => {
                        const isSelected = selectedSize === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#87D215] border-[#79BE10] text-black font-black shadow-xs'
                                : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-400'
                            }`}
                          >
                            {s === 'all' ? 'All Sizes' : `No. ${s}`}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Horizontal Divider */}
                  <div className="w-full h-px bg-neutral-200 mt-6" />
                </div>

                {/* 4. COLLECTIONS / CATEGORY ACCORDION */}
                <div>
                  <button
                    type="button"
                    onClick={() => toggleSection('category')}
                    className="w-full flex items-center justify-between text-left group cursor-pointer"
                  >
                    <span className="text-base font-bold text-neutral-900">
                      Collections (श्रेणी)
                    </span>
                    {openSections.category ? (
                      <ChevronUp className="w-4 h-4 text-neutral-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-700" />
                    )}
                  </button>

                  {openSections.category && (
                    <div className="mt-4 space-y-1.5">
                      {categoryList.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                              isSelected
                                ? 'bg-[#87D215]/20 text-black border border-[#87D215]/60'
                                : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                            }`}
                          >
                            <span>{getCategoryLabel(cat.id, cat.label, cat.hindiLabel)}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>

              {/* Drawer Sticky Bottom Actions */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center gap-3">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="flex-1 py-3 px-3 rounded-xl border border-neutral-300 hover:border-black bg-white text-xs font-bold text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 px-3 rounded-xl bg-[#87D215] hover:bg-[#78BD0E] text-black font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-sm text-center"
                >
                  Show ({filteredProducts.length})
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
