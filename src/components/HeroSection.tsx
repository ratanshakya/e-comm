'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Truck, Award, RefreshCw, ArrowRight, Ruler } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { ImageStreamHero, StreamImage } from '@/components/ui/image-stream-hero';

const HERO_STREAM_IMAGES: StreamImage[] = [
  {
    src: '/images/hero_laddu_gopal_3d.jpg',
    alt: '3D Laddu Gopal on Swarna Singhasan',
  },
  {
    src: '/images/poshak_royal_zardozi.jpg',
    alt: 'Handcrafted Zardozi Poshak',
  },
  {
    src: '/images/shringar_mukut_bansuri.jpg',
    alt: 'Kundan Mor Mukut and Golden Bansuri',
  },
  {
    src: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    alt: 'Handcrafted Brass Singhasan & Jhula',
  },
  {
    src: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    alt: 'Sacred Lotus Flower Seva',
  },
  {
    src: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    alt: 'Imperial Velvet Quilted Poshaks',
  },
  {
    src: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    alt: 'Natural Vrindavan Chandan and Attar',
  },
  {
    src: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    alt: 'Vrindavan Yamuna Ghats',
  },
];

export default function HeroSection({ onExploreClick, settings }: { onExploreClick: () => void, settings?: any }) {
  const { setIsSizeGuideOpen } = useCart();
  const { t } = useLanguage();

  const heroImages = settings?.homeHeroImages?.length 
    ? settings.homeHeroImages.map((src: string, idx: number) => ({ src, alt: `Vrindavan Image ${idx}` }))
    : HERO_STREAM_IMAGES;

  return (
    <div className="w-full">
      {/* Full-Screen 3D Corridor Animation Hero */}
      <ImageStreamHero
        images={heroImages}
        cards={10}
        speed={18}
        axis={52}
        className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white border-b border-neutral-200"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[950px] h-[500px] bg-neutral-100/60 blur-[140px] rounded-full pointer-events-none -z-5" />

        {/* Center Headline Card over the Corridor */}
        <div className="relative z-10 max-w-2xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/90 backdrop-blur-xl border border-neutral-200/80 shadow-2xl rounded-3xl p-6 sm:p-9 space-y-5"
          >
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#87D215] animate-pulse" />
              <span className="text-xs font-semibold text-black tracking-wide uppercase">
                {settings?.homeHeroBadge || t('hero.badge')}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-bold font-serif-royal leading-[1.15] text-black tracking-tight">
              {settings?.homeHeroTitle1 || t('hero.titleLine1')} <br />
              <span className="underline decoration-neutral-300 decoration-wavy underline-offset-8">
                {settings?.homeHeroTitle2 || t('hero.titleLine2')}
              </span> <br />
              {settings?.homeHeroTitle3 || t('hero.titleLine3')}
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto font-normal leading-relaxed">
              {settings?.homeHeroSubtitle || t('hero.subheading')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                onClick={onExploreClick}
                className="luxury-black-btn px-7 py-3 rounded-full text-xs sm:text-sm font-black flex items-center gap-2 group shadow-md cursor-pointer"
              >
                <span>{t('hero.exploreBtn')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="luxury-outline-btn px-6 py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Ruler className="w-4 h-4 text-black" />
                <span>{t('hero.sizeGuideBtn')}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating Minimalist Stream Indicators */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-6 flex items-center justify-between text-xs text-neutral-500 pointer-events-none hidden md:flex">
          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 text-black font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#87D215]" />
            <span>{t('hero.liveStream')}</span>
          </div>

          <div className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200 text-neutral-800 font-bold shadow-sm">
            <span>{t('hero.darshan')}</span>
          </div>
        </div>
      </ImageStreamHero>

      {/* Luxury Elevated 4-Pillar Trust Highlights Strip - Localized */}
      <section className="w-full bg-neutral-50/90 border-b border-neutral-200 py-10 px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-[1850px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Pillar 1 */}
            <div className="group p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-[#87D215] group-hover:text-black transition-colors duration-300">
                  01 • HERITAGE
                </span>
                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-black tracking-tight mb-1 group-hover:text-neutral-800">
                  {settings?.homeHeroFeatures?.[0]?.title || t('hero.pillar1Title')}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {settings?.homeHeroFeatures?.[0]?.description || t('hero.pillar1Desc')}
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="group p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-[#87D215] group-hover:text-black transition-colors duration-300">
                  02 • DISPATCH
                </span>
                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                  <Truck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-black tracking-tight mb-1 group-hover:text-neutral-800">
                  {settings?.homeHeroFeatures?.[1]?.title || t('hero.pillar2Title')}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {settings?.homeHeroFeatures?.[1]?.description || t('hero.pillar2Desc')}
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="group p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-[#87D215] group-hover:text-black transition-colors duration-300">
                  03 • PURITY
                </span>
                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                  <RefreshCw className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-black tracking-tight mb-1 group-hover:text-neutral-800">
                  {settings?.homeHeroFeatures?.[2]?.title || t('hero.pillar3Title')}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {settings?.homeHeroFeatures?.[2]?.description || t('hero.pillar3Desc')}
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="group p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 group-hover:bg-[#87D215] group-hover:text-black transition-colors duration-300">
                  04 • PROMISE
                </span>
                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-black tracking-tight mb-1 group-hover:text-neutral-800">
                  {settings?.homeHeroFeatures?.[3]?.title || t('hero.pillar4Title')}
                </h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {settings?.homeHeroFeatures?.[3]?.description || t('hero.pillar4Desc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
