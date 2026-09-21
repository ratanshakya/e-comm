'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { SiteSettingsData } from '@/lib/settingsStore';

export default function Footer() {
  const { setIsSizeGuideOpen } = useCart();
  const { t } = useLanguage();
  const [settings, setSettings] = useState<SiteSettingsData | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data?.data) {
            setSettings(data.data);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch settings:', err);
      }
    }
    fetchSettings();
  }, []);

  return (
    <footer className="bg-black text-white border-t border-neutral-800 pt-16 pb-10">
      {/* Devotional Mahamantra Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-14">
        <div className="rounded-2xl p-4 text-center border border-neutral-800 bg-neutral-950">
          <p className="text-xs sm:text-sm font-medium tracking-widest text-neutral-300">
            {t('footer.mantra')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-neutral-800">
        {/* Brand */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded-xl flex items-center justify-center">
              <Image
                src={settings?.logoUrl || "/images/brocart_logo_cropped.png"}
                alt={settings?.storeName || "BroCART"}
                width={120}
                height={52}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <div className="text-lg font-bold tracking-wider text-white">
                {settings?.storeName || "BroCART"}
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
                Devotional & Heritage Store
              </p>
            </div>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
            {t('footer.desc')}
          </p>

          <div className="flex flex-col gap-1.5 text-xs text-neutral-300 pt-2">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#87D215]" />
              <span>{settings?.helplinePhone || t('footer.support')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#87D215]" />
              <span>{settings?.supportEmail || 'support@brocart.in / seva@brocart.in'}</span>
            </div>
            {settings?.storeAddress && (
              <div className="flex items-start gap-2 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#87D215] shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.storeAddress}</span>
              </div>
            )}
          </div>

          {/* Moved Social Links to bottom section */}
        </div>

        {/* Collections */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            {t('footer.collectionsTitle')}
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            {(settings?.footerCollections?.length ? settings.footerCollections : [
              { label: t('catalog.poshak'), url: '/#catalog-section' },
              { label: t('catalog.shringar'), url: '/#catalog-section' },
              { label: t('catalog.singhasan'), url: '/#catalog-section' },
              { label: t('catalog.winter'), url: '/#catalog-section' },
              { label: t('catalog.seva'), url: '/#catalog-section' },
            ]).map((item, idx) => (
              <li key={idx}>
                <Link href={item.url || '/'} className="hover:text-white transition-colors">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop By Size */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            {t('footer.shopBySizeTitle')}
          </h4>
          <ul className="space-y-2.5 text-xs text-neutral-400">
            {(settings?.footerSizes?.length ? settings.footerSizes : [
              { label: 'Size 00 & 0 (Chhota Gopal)', url: '' },
              { label: 'Size 1 & 2 (Home Mandir)', url: '' },
              { label: 'Size 3 & 4 (Grand Shringar)', url: '' },
              { label: 'Size 5 & 6 (Haveli Vigraha)', url: '' },
              { label: 'Size 7+ (Bada Laddu Gopal)', url: '' }
            ]).map((item, idx) => (
              <li key={idx}>
                {item.url ? (
                  <Link href={item.url} className="hover:text-white transition-colors">{item.label}</Link>
                ) : (
                  <button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white text-left transition-colors cursor-pointer">{item.label}</button>
                )}
              </li>
            ))}
            <li>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-white font-semibold underline underline-offset-4 mt-1 block cursor-pointer"
              >
                {t('footer.sizeCalculator')}
              </button>
            </li>
          </ul>
        </div>

        {/* Seva Promises */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
            {t('footer.promisesTitle')}
          </h4>
          <div className="space-y-3.5 text-xs text-neutral-400">
            {(settings?.footerPromises?.length ? settings.footerPromises : [
              t('footer.promise1'),
              t('footer.promise2'),
              t('footer.promise3')
            ]).map((promise, idx) => {
              let Icon = ShieldCheck;
              if (idx === 1) Icon = Truck;
              if (idx === 2) Icon = RefreshCw;
              return (
                <div key={idx} className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-white shrink-0" />
                  <span>{promise}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Social, Payment & Partners Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 border-b border-neutral-800 flex flex-col md:flex-row md:items-start justify-between gap-8">
        {/* Social Links */}
        {settings?.footerSocialLinks && settings.footerSocialLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Follow us on</h4>
            <div className="flex flex-wrap items-center gap-3">
              {settings.footerSocialLinks.map((social, idx) => (
                <a key={idx} href={social.url} target="_blank" rel="noreferrer" className="w-8 h-8 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center p-1.5 transition-colors cursor-pointer shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={social.iconUrl} alt={social.platform} className="w-full h-full object-contain filter invert" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Payment Methods */}
        {settings?.footerPaymentMethods && settings.footerPaymentMethods.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-white mb-3">We Accept:</h4>
            <div className="flex flex-wrap items-center gap-2">
              {settings.footerPaymentMethods.map((payment, idx) => (
                <div key={idx} className="w-12 h-8 bg-white rounded-md flex items-center justify-center p-1.5 shadow-sm shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={payment.iconUrl} alt={payment.name} className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Partner Platforms */}
        {settings?.footerPartnerPlatforms && settings.footerPartnerPlatforms.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Also available on:</h4>
            <div className="flex flex-wrap items-center gap-2">
              {settings.footerPartnerPlatforms.map((partner, idx) => (
                <a key={idx} href={partner.url} target="_blank" rel="noreferrer" className="w-16 h-8 bg-white rounded-md flex items-center justify-center p-1.5 shadow-sm hover:scale-105 transition-transform cursor-pointer shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={partner.iconUrl} alt={partner.name} className="w-full h-full object-contain" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
        <p>{t('footer.copyright')}</p>
        <div className="flex items-center gap-3 text-neutral-400">
          <span>UPI / GPay / PhonePe</span>
          <span>•</span>
          <span>Cash on Delivery</span>
          <span>•</span>
          <Link href="/admin" className="text-neutral-500 hover:text-[#87D215] transition-colors font-bold inline-flex items-center gap-1">
            <span>Admin Portal</span>
            <span>🔒</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

