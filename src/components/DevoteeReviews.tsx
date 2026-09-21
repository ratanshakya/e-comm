'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const REVIEWS = [
  {
    name: 'Radhika Sharma',
    city: 'Jaipur, Rajasthan',
    rating: 5,
    size: 'Size 4 (5.5" Idol)',
    comment: 'The Crimson Zardozi poshak arrived in sacred packaging with Tulsi leaves. The fit on our Thakur Ji is magnificent! The peacock embroidery has real metallic sheen. Jai Shri Radhe!',
    date: '3 days ago'
  },
  {
    name: 'Amitabh & Priya Sen',
    city: 'Kolkata, WB',
    rating: 5,
    size: 'Size 2 (4" Idol)',
    comment: 'The Kundan Mor Mukut and flute are truly royal. Usually online clothes have loose threads, but here the finish is of 5-star boutique quality. Highly recommend to every devotee.',
    date: '1 week ago'
  },
  {
    name: 'Meenakshi Iyer',
    city: 'Bengaluru, Karnataka',
    rating: 5,
    size: 'Size 1 (3" Idol)',
    comment: 'I was worried about size 1 fitting properly, but your size guide was 100% accurate. The malmal cotton poshak is so soft and gentle on the deity. Thank you for this pure seva.',
    date: '2 weeks ago'
  }
];

export default function DevoteeReviews({ settings }: { settings?: any }) {
  const { t } = useLanguage();
  
  const reviews = settings?.homeReviewsList?.length ? settings.homeReviewsList : REVIEWS;

  return (
    <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-semibold text-black mb-3">
          <Star className="w-3.5 h-3.5 fill-black text-black" />
          <span>{settings?.homeReviewsSubtitle || t('reviews.badgeFull')}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-serif-royal text-black tracking-tight">
          {settings?.homeReviewsTitle || 'Loved by Devotees Worldwide'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev: any, idx: number) => (
          <div
            key={idx}
            className="rounded-3xl p-6 bg-white border border-neutral-200 hover:border-black shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative group"
          >
            <Quote className="w-8 h-8 text-neutral-200 absolute top-5 right-5" />

            <div>
              <div className="flex items-center gap-1 text-black mb-4">
                {[...Array(rev.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-black text-black" />
                ))}
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed italic mb-6">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-black flex items-center gap-1.5">
                  <span>{rev.name}</span>
                  {(rev.verified !== false) && <CheckCircle className="w-3.5 h-3.5 text-neutral-800" />}
                </h4>
                <p className="text-[11px] text-neutral-500">{rev.location || rev.city}</p>
              </div>

              {(rev.date || rev.size) && (
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-neutral-100 text-black font-bold border border-neutral-200">
                  {rev.date || rev.size}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
