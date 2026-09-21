'use client';

import React from 'react';
import Image from 'next/image';
import { Sparkles, Heart, CheckCircle2, ShieldCheck, Sparkle, Layers, Gift } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ArtisanStory({ settings }: { settings?: any }) {
  const { t } = useLanguage();
  return (
    <section id="artisan-story" className="py-20 px-4 sm:px-8 border-y border-neutral-200 bg-neutral-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Top: Editorial Narrative & Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-14">
          {/* Left: Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-neutral-200 shadow-xl">
              <Image
                src="/images/poshak_royal_zardozi.jpg"
                alt="Handcrafted Vrindavan Poshak Detail"
                fill
                className="object-cover"
              />

              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-neutral-200 shadow-md">
                <div className="flex items-center gap-2 text-black text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{settings?.homeStoryBadge || t('story.badgeTag')}</span>
                </div>
                <p className="text-xs text-neutral-600">
                  {settings?.homeStoryStats?.[0] || 'Over 1,200 delicate hand-stitches on pure silk for the adornment of Thakur Ji.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 text-xs font-semibold text-black shadow-xs">
              <Heart className="w-3.5 h-3.5 fill-black text-black" />
              <span>{settings?.homeStoryBadge || t('story.badge')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal text-black tracking-tight leading-tight">
              {settings?.homeStoryTitle || (
                <>
                  Crafted with Devotion in the <br />
                  <span className="underline decoration-neutral-300 decoration-wavy underline-offset-8">Sacred Lanes of Vrindavan</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
              {settings?.homeStoryText1 || t('story.p1')}
            </p>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {settings?.homeStoryText2 || t('story.p2')}
            </p>
          </div>
        </div>

        {/* Bottom ("Niche"): Full-Width 4-Card Quality & Seva Grid */}
        <div className="pt-10 border-t border-neutral-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {/* Card 1 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black tracking-tight">
                  Non-Toxic & Safe for Idols
                </h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Will never discolor or harm your brass, ashtadhatu, or marble Laddu Gopal deities.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0">
                  <Layers className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black tracking-tight">
                  Precision Flare Architecture
                </h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Circular lehenga flares designed to spread symmetrically on singhasan and bed.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0">
                  <Sparkle className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black tracking-tight">
                  Pure 24K Gold Plating
                </h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Mukuts and bansuris feature long-lasting anti-tarnish micro lacquer.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-3xl bg-white border border-neutral-200 hover:border-black shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-black shrink-0">
                  <Gift className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-sm sm:text-base font-bold text-black tracking-tight">
                  Blessed Packaging
                </h4>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Each parcel is blessed with sacred Braj Raj and fragrant Tulsi prasad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
