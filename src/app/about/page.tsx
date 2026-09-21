import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';
import { DEFAULT_SETTINGS, SiteSettingsData } from '@/lib/settingsStore';
import {
  Sparkles,
  Heart,
  ShieldCheck,
  Award,
  Users,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkle,
  Gift,
  MessageCircle,
  Clock,
  Feather
} from 'lucide-react';

// Removed dynamic caching constraints for better performance

async function getSettings(): Promise<SiteSettingsData> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    try {
      const settings = await SiteSettingsModel.findOne({}).lean();
      if (settings) {
        return { ...DEFAULT_SETTINGS, ...settings } as SiteSettingsData;
      }
    } catch (e) {
      console.warn('DB error fetching settings:', e);
    }
  }
  return DEFAULT_SETTINGS;
}

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Header Banner with Crocohill Style Soft Radial Glow */}
      <section className="relative pt-14 pb-10 sm:pt-20 sm:pb-14 overflow-hidden bg-white text-center border-b border-neutral-100">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[650px] h-[180px] bg-gradient-to-r from-pink-100/60 via-amber-100/40 to-rose-100/50 rounded-full blur-3xl opacity-80" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-black mb-4">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>श्री धाम वृंदावन • भक्ति एवं हस्तशिल्प</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-black font-sans">
            {settings.aboutTitle}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-3 font-medium max-w-xl mx-auto leading-relaxed whitespace-pre-wrap">
            {settings.aboutDescription}
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mt-4">
            <Link href="/" className="hover:text-black transition-colors">Home</Link>
            <span>›</span>
            <span className="text-black font-semibold">{settings.aboutTitle}</span>
          </div>
        </div>
      </section>

      {/* Section 1: Sacred Origin & Artisan Narrative */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Dual Image Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-4/3 rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xl">
              <Image
                src={settings.aboutImage || '/images/poshak_royal_zardozi.jpg'}
                alt="About Us Main Image"
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Overlapping Badge Card */}
            <div className="absolute -bottom-8 -right-4 sm:right-6 bg-white p-5 rounded-2xl border border-neutral-200 shadow-xl max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
                  <Heart className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black uppercase tracking-wider">100% शुद्ध भाव</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Continuous Radha-Krishna Naam Japa during stitching</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 text-xs font-bold text-black">
              <Feather className="w-3.5 h-3.5" />
              <span>हमारी परंपरा (Our Heritage)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-tight">
              {settings.aboutStoryTitle}
            </h2>

            <div className="text-sm sm:text-base text-neutral-600 leading-relaxed space-y-4 whitespace-pre-wrap">
              {settings.aboutStoryText}
            </div>

            {/* Key Metrics */}
            {settings.aboutMetrics && settings.aboutMetrics.length > 0 && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
                {settings.aboutMetrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="text-2xl sm:text-3xl font-extrabold text-black">{metric.value}</div>
                    <div className="text-xs text-neutral-500 font-medium mt-1">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section 2: Craftsmanship Pillars */}
      <section className="bg-neutral-50 py-20 px-4 sm:px-8 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h3 className="text-2xl sm:text-4xl font-bold text-black tracking-tight">
              {settings.aboutPillarsTitle || 'Four Pillars of Our Craft'}
            </h3>
            <p className="text-sm text-neutral-500 mt-2">
              Every detail is tailored to uphold temple sanctity, idol preservation, and breathtaking beauty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.aboutPillars && settings.aboutPillars.map((pillar, idx) => {
              // Cycle through 4 icons based on index
              const Icons = [CheckCircle2, Layers, Sparkle, Gift];
              const IconToRender = Icons[idx % Icons.length];
              return (
                <div key={idx} className="bg-white p-7 rounded-2xl border border-neutral-200 hover:border-black transition-all">
                  <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center mb-4">
                    <IconToRender className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-black uppercase tracking-wider mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: The Karigars of Vrindavan (Master Artisans) */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
              भक्त कारीगर • Karigar Collective
            </span>
            <h3 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-snug whitespace-pre-line">
              {settings.aboutEmpowerTitle || 'Empowering Artisans in Braj'}
            </h3>
            <div className="text-sm text-neutral-600 leading-relaxed whitespace-pre-wrap space-y-4">
              {settings.aboutEmpowerText}
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="luxury-black-btn px-6 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md"
              >
                <span>पोशाक संग्रह देखें (Explore Catalog)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-full border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Contact Vrindavan Seva</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <Image
                  src={settings.aboutEmpowerImage1 || '/images/vrindavan_artisan.jpg'}
                  alt="Artisan Crafting Poshak"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <h4 className="text-sm font-bold text-black mb-1">शुद्ध पक्काकारी काम</h4>
                <p className="text-[11px] text-neutral-500">100% zardozi handcraftsmanship</p>
              </div>
            </div>

            <div className="space-y-4 pt-12">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
                <Image
                  src={settings.aboutEmpowerImage2 || '/images/laddu_gopal_shringar.jpg'}
                  alt="Beautiful Laddu Gopal Shringar"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <h4 className="text-sm font-bold text-black mb-1">कुंदन व मीनाकारी</h4>
                <p className="text-[11px] text-neutral-500">Heritage filigree work</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Physical Presence & Temple Seva Details */}
      <section id="contact" className="bg-black text-white py-16 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-400 text-xs font-bold uppercase tracking-widest">
              <MapPin className="w-4 h-4 text-white" />
              <span>Vrindavan Dham Seva Kendra</span>
            </div>
            <h4 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Visiting Vrindavan Dham?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-md">
              Visit our boutique near Parikrama Marg for personalized deity darshan fittings and bespoke altar dressing consultations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#87D215] text-black text-xs font-black uppercase tracking-wider hover:bg-[#79BE10] transition-colors text-center shadow-md hover:shadow-[0_4px_16px_rgba(135,210,21,0.35)]"
            >
              Book an Appointment
            </a>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-7 py-3.5 rounded-full border border-neutral-700 hover:border-[#87D215] hover:text-[#87D215] text-white text-xs font-bold uppercase tracking-wider transition-colors text-center"
            >
              Explore Shop
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
