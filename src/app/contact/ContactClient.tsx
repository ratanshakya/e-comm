'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { SiteSettingsData, DEFAULT_SETTINGS } from '@/lib/settingsStore';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function ContactClient({ initialSettings }: { initialSettings: SiteSettingsData }) {
  const { t, language } = useLanguage();

  const isHindi = language === 'hi';

  const [settings, setSettings] = useState<SiteSettingsData>(initialSettings || DEFAULT_SETTINGS);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    deitySize: '1',
    inquiryType: isHindi ? 'पोशाक चयन एवं साइज' : 'Poshak & Sizing Advice',
    message: '',
  });

  const [isSent, setIsSent] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const sizeOptions = ['00 / 0', '1', '2', '3', '4', '5', '6', '7+'];

  const inquiryTypes = isHindi
    ? [
        'पोशाक चयन एवं साइज',
        'कस्टम ऑर्डर सेवा',
        'ऑर्डर ट्रैकिंग व डिलीवरी',
        'मंदिर एवं बड़ा विग्रह शृंगार',
        'सामान्य पूछताछ'
      ]
    : [
        'Poshak & Sizing Advice',
        'Custom Embroidery Order',
        'Track My Order & Delivery',
        'Temple & Large Idol Seva',
        'General Inquiry'
      ];

  const defaultFaqs = isHindi
    ? [
        {
          q: 'लड्डू गोपाल जी का सही साइज कैसे पता करें?',
          a: 'अपने ठाकुर जी को सिंहासन पर बैठाकर उनके मस्तक से लेकर चरण कमल तक इंच टेप से सीधी ऊंचाई मापें। उदाहरण: 2.5 से 3.2 इंच के विग्रह के लिए "1 नंबर" पोशाक सबसे उत्तम बैठती है। आप साइज चार्ट देख सकते हैं या व्हाट्सएप पर विग्रह का फोटो भेजकर हमसे तुरंत पूछ सकते हैं।'
        },
        {
          q: 'क्या भारत भर में कैश ऑन डिलीवरी (COD) उपलब्ध है?',
          a: 'हाँ, भारत के सभी पिन कोड्स पर 100% सुरक्षित कैश ऑन डिलीवरी (COD) सेवा उपलब्ध है। आप पार्सल प्राप्त करने के बाद नकद या UPI द्वारा भुगतान कर सकते हैं।'
        },
        {
          q: 'ऑर्डर कितने दिनों में डिलीवर होता है?',
          a: 'हम सभी पार्सल सीधे श्री धाम वृंदावन से ब्लू डार्ट / डीटीडीसी एक्सप्रेस एयर कूरियर द्वारा भेजते हैं। उत्तर भारत में 2-3 कार्यदिवस और बाकी भारत में 3-5 कार्यदिवसों के भीतर सुरक्षित डिलीवरी हो जाती है।'
        },
        {
          q: 'क्या यह पोशाकें धातु एवं पीतल के विग्रहों के लिए सुरक्षित हैं?',
          a: 'बिल्कुल! हमारी पोशाकों में प्राकृतिक रेशम, सूती अस्तर और अजॉ-फ्री प्राकृतिक रंगों का उपयोग किया जाता है। इससे पीतल, अष्टधातु या संगमरमर के विग्रह पर कोई खरोंच या कालापन नहीं आता।'
        },
        {
          q: 'क्या हम वृंदावन सेवा केंद्र में आकर व्यक्तिगत दर्शन कर सकते हैं?',
          a: 'हाँ, आपका श्री धाम वृंदावन में हार्दिक स्वागत है! हमारा केंद्र परिक्रमा मार्ग, रमण रेती (बांके बिहारी मंदिर के समीप) स्थित है। आने से पहले व्हाट्सएप पर अपॉइंटमेंट बुक कर सकते हैं।'
        }
      ]
    : [
        {
          q: 'How do I find the correct size for my Laddu Gopal Ji?',
          a: 'Place your Thakur Ji comfortably on an altar or throne and measure vertically from the crown (top of head) to the lotus feet with a measuring tape. For instance, an idol measuring 2.5 to 3.2 inches wears Size 1. You can also view our Size Guide or send an idol photo on WhatsApp for instant guidance.'
        },
        {
          q: 'Is Cash on Delivery (COD) available across India?',
          a: 'Yes, 100% secure Cash on Delivery (COD) is available across all serviceable Indian pincodes. You can pay via Cash or UPI upon receiving the sacred parcel.'
        },
        {
          q: 'How many days does express delivery take?',
          a: 'All orders are dispatched directly from Vrindavan Dham via Blue Dart or DTDC Express Air. North India delivery takes 2-3 business days, while the rest of India takes 3-5 business days.'
        },
        {
          q: 'Are these dresses safe and non-damaging for metal deities?',
          a: 'Absolutely! Our poshaks are made from pure mulberry silk with soft pure-cotton linings and certified azo-free color-fast dyes. They will never harm brass, ashtadhatu, or marble deities.'
        },
        {
          q: 'Can we visit your Vrindavan Seva Center in person?',
          a: 'Yes, you are warmly invited to visit us in Sri Dham Vrindavan! We are located on Parikrama Marg, Raman Reti (near Banke Bihari Temple). Feel free to message us on WhatsApp before visiting.'
        }
      ];

  const faqs = settings?.contactFaqs && settings.contactFaqs.length > 0 
    ? settings.contactFaqs.map(f => ({ q: f.question, a: f.answer })) 
    : defaultFaqs;

  const handleWhatsAppDirect = async (e: React.FormEvent) => {
    e.preventDefault();

    // Record inquiry into database for Admin Panel tracking
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || 'Devotee',
          phone: formData.phone || '',
          deitySize: formData.deitySize,
          inquiryType: formData.inquiryType,
          message: formData.message
        })
      });
    } catch (err) {
      console.warn('Could not record inquiry in DB:', err);
    }

    const text = isHindi
      ? `*राधे राधे! श्री कान्हा डिवाइन सेवा केंद्र* 🙏
-----------------------------------
*भक्त का नाम:* ${formData.name || 'ठाकुर जी का सेवक'}
*संपर्क नंबर:* ${formData.phone || 'उपलब्ध नहीं'}
*लड्डू गोपाल साइज:* No. ${formData.deitySize}
*पूछताछ विषय:* ${formData.inquiryType}
*संदेश:* ${formData.message || 'मुझे ठाकुर जी की पोशाक और सेवा के बारे में मार्गदर्शन चाहिए।'}`
      : `*Radhe Radhe! BroCART Vrindavan Seva* 🙏
-----------------------------------
*Devotee Name:* ${formData.name || 'Krishna Devotee'}
*Contact Number:* ${formData.phone || 'N/A'}
*Laddu Gopal Size:* No. ${formData.deitySize}
*Inquiry Subject:* ${formData.inquiryType}
*Message:* ${formData.message || 'I would like guidance regarding Thakur Ji poshak and seva.'}`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/919876543210?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
    setIsSent(true);
    setTimeout(() => setIsSent(false), 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />



      {/* Header Banner with Crocohill Soft Diffused Glow */}
      <section className="relative pt-14 pb-10 sm:pt-20 sm:pb-14 overflow-hidden bg-white text-center border-b border-neutral-100">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[650px] h-[180px] bg-gradient-to-r from-emerald-100/50 via-teal-100/40 to-pink-100/40 rounded-full blur-3xl opacity-80" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-300 text-xs font-bold text-black mb-4">
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>
              {isHindi
                ? 'श्री धाम वृंदावन सेवा केंद्र • 24x7 सहायता'
                : 'Vrindavan Seva Center • 24x7 Devotee Support'}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-medium tracking-tight text-black font-sans">
            {settings.contactTitle || (isHindi ? 'संपर्क करें' : 'Contact Us')}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 mt-3 font-medium max-w-xl mx-auto leading-relaxed whitespace-pre-wrap">
            {settings.contactDescription || (isHindi
              ? 'ठाकुर जी की सेवा, पोशाक नाप या कस्टम ऑर्डर से संबंधित किसी भी सहायता के लिए हमारे वृंदावन सेवा केंद्र से सीधे जुड़ें।'
              : 'Connect directly with our sacred Vrindavan Seva team for deity sizing, custom zardozi poshaks, or order inquiries.')}
          </p>

          <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 mt-4">
            <Link href="/" className="hover:text-black transition-colors">
              {isHindi ? 'होम' : 'Home'}
            </Link>
            <span>›</span>
            <span className="text-black font-semibold">
              {isHindi ? 'संपर्क करें' : 'Contact Us'}
            </span>
          </div>
        </div>
      </section>

      {/* 3 Contact Info Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: WhatsApp Helpline */}
          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 hover:border-[#25D366] transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <MessageCircle className="w-7 h-7 fill-white" />
              </div>
              <span className="text-xs font-bold text-[#25D366] uppercase tracking-wider block mb-1">
                {isHindi ? 'तुरंत उत्तर • Instant WhatsApp' : 'Instant Reply • WhatsApp Seva'}
              </span>
              <h3 className="text-xl font-bold text-black mb-2">
                {isHindi ? 'व्हाट्सएप सेवा केंद्र' : 'WhatsApp Seva Center'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {isHindi
                  ? 'ठाकुर जी के विग्रह का फोटो भेजें और साइज या पोशाक के बारे में तुरंत मार्गदर्शन पाएं।'
                  : 'Share your Laddu Gopal idol photo for accurate sizing and sacred shringar guidance.'}
              </p>
              <div className="text-base font-extrabold text-black font-mono">
                {settings.whatsappPhone}
              </div>
            </div>

            <a
              href={`https://wa.me/${settings.whatsappPhone.replace(/[^0-9]/g, '')}?text=Radhe%20Radhe!%20I%20would%20like%20to%20inquire%20about%20Thakur%20Ji%20poshak%20and%20seva.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>{isHindi ? 'WhatsApp पर बात करें' : 'Chat on WhatsApp'}</span>
            </a>
          </div>

          {/* Card 2: Phone & Calling */}
          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 hover:border-black transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                {isHindi ? 'कॉल सहायता • 9 AM - 9 PM IST' : 'Call Support • 9 AM - 9 PM IST'}
              </span>
              <h3 className="text-xl font-bold text-black mb-2">
                {isHindi ? 'फोन हेल्पलाइन' : 'Phone Helpline'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {isHindi
                  ? 'ऑर्डर स्थिति, थोक बुकिंग या मंदिर सेवा के लिए हमारे सेवा प्रतिनिधि से सीधे बात करें।'
                  : 'Speak directly with our seva representatives for order updates, bulk temple seva, or express dispatch.'}
              </p>
              <div className="text-base font-extrabold text-black font-mono">
                {settings.helplinePhone}
              </div>
            </div>

            <a
              href={`tel:${settings.helplinePhone.replace(/[^0-9+]/g, '')}`}
              className="mt-6 w-full py-3 px-4 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{isHindi ? 'कॉल करें' : 'Call Helpline'}</span>
            </a>
          </div>

          {/* Card 3: Physical Vrindavan Kendra */}
          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 hover:border-black transition-all group flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                {isHindi ? 'श्री धाम वृंदावन • Darshan Boutique' : 'Sri Dham Vrindavan • Seva Boutique'}
              </span>
              <h3 className="text-xl font-bold text-black mb-2">
                {isHindi ? 'वृंदावन सेवा केंद्र' : 'Vrindavan Seva Boutique'}
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                {settings.storeAddress}
              </p>
              <div className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {isHindi
                    ? 'प्रातः 8:00 AM से रात्रि 9:30 PM (सप्ताह के सातों दिन)'
                    : 'Open Daily: 8:00 AM – 9:30 PM'}
                </span>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Vrindavan+Mathura+Uttar+Pradesh"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full py-3 px-4 rounded-xl border border-neutral-300 hover:border-black text-black text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>{isHindi ? 'दिशा निर्देश देखें' : 'Get Directions'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Main Section: Interactive WhatsApp Form & Quick Inquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Left 7 Columns: Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-neutral-200 shadow-xl">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#25D366] flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                <span>
                  {isHindi
                    ? 'सीधे व्हाट्सएप संदेश भेजें'
                    : 'Direct 1-Click WhatsApp Seva'}
                </span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mt-1">
                {isHindi ? 'अपनी सेवा आवश्यकता हमें बताएं' : 'Share Your Sacred Seva Requirements'}
              </h2>
              <p className="text-xs text-neutral-500 mt-1">
                {isHindi
                  ? 'नीचे विवरण भरें और Send on WhatsApp पर क्लिक करें। आपका संदेश तुरंत वृंदावन सेवा टीम तक पहुंच जाएगा।'
                  : 'Fill in the details below to instantly connect with our Vrindavan Seva team via WhatsApp.'}
              </p>
            </div>

            <form onSubmit={handleWhatsAppDirect} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {isHindi ? 'आपका नाम *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isHindi ? 'उदा. राहुल शर्मा / राधा दासी' : 'e.g. Radhika Sharma'}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none transition-colors text-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {isHindi ? 'व्हाट्सएप नंबर *' : 'WhatsApp Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none transition-colors text-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {isHindi ? 'लड्डू गोपाल साइज' : 'Deity Size'}
                  </label>
                  <select
                    value={formData.deitySize}
                    onChange={(e) => setFormData({ ...formData, deitySize: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none bg-white cursor-pointer text-black"
                  >
                    {sizeOptions.map((s) => (
                      <option key={s} value={s}>
                        No. {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                    {isHindi ? 'विषय' : 'Inquiry Topic'}
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none bg-white cursor-pointer text-black"
                  >
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  {isHindi ? 'आपका संदेश या प्रश्न' : 'Your Message or Question'}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    isHindi
                      ? 'कृपया बताएं कि आप किस प्रकार की पोशाक, रंग, उत्सव या विग्रह माप के लिए सलाह चाहते हैं...'
                      : 'Tell us about your poshak preference, festive occasion, or size clarification...'
                  }
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm focus:border-black outline-none transition-colors text-black"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto flex-1 py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{isHindi ? 'WhatsApp पर भेजें' : 'Send on WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    alert(
                      isHindi
                        ? 'राधे राधे! आपका संदेश प्राप्त हो गया है। हमारी सेवा टीम जल्द आपसे संपर्क करेगी।'
                        : 'Radhe Radhe! Your callback request has been received. Our team will contact you shortly.'
                    );
                    setIsSent(true);
                  }}
                  className="w-full sm:w-auto py-4 px-6 rounded-xl border border-neutral-300 hover:border-black text-neutral-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {isHindi ? 'कॉल बैक का अनुरोध' : 'Request Callback'}
                </button>
              </div>

              {isSent && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isHindi
                      ? 'राधे राधे! आपका संदेश सफलतापूर्वक व्हाट्सएप पर प्रेषित कर दिया गया है।'
                      : 'Radhe Radhe! Your inquiry has been dispatched to WhatsApp.'}
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Right 5 Columns: Quick Support Highlights & Direct Timings */}
          <div className="lg:col-span-5 space-y-6">
            {/* Box 1: Why WhatsApp Seva */}
            <div className="p-7 rounded-3xl bg-neutral-50 border border-neutral-200">
              <h3 className="text-lg font-bold text-black flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-black" />
                <span>
                  {isHindi ? 'व्हाट्सएप सेवा के विशेष लाभ' : 'Benefits of Direct WhatsApp Seva'}
                </span>
              </h3>
              <ul className="space-y-3 text-xs text-neutral-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <span>
                    <strong>{isHindi ? 'विग्रह फोटो परामर्श:' : 'Deity Photo Sizing:'}</strong>{' '}
                    {isHindi
                      ? 'अपने लड्डू गोपाल जी का फोटो भेजकर सटीक साइज और मैचिंग श्रृंगार जानें।'
                      : 'Send your idol photo to confirm exact size and matching crown sets.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <span>
                    <strong>{isHindi ? 'रियल-टाइम वीडियो दर्शन:' : 'Live Video Darshan:'}</strong>{' '}
                    {isHindi
                      ? 'ऑर्डर भेजने से पहले पोशाक और मुकुट का क्लोज़-अप वीडियो देखें।'
                      : 'Request close-up video of the heavy zari work before parcel dispatch.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                  <span>
                    <strong>{isHindi ? 'कस्टम उत्सव पोशाक:' : 'Custom Festive Ensembles:'}</strong>{' '}
                    {isHindi
                      ? 'जन्माष्टमी, राधारमणी, होली या अन्नकूट के लिए विशेष कस्टमाइजेशन।'
                      : 'Tailored dress sets for Janmashtami, Radhashtami, Holi, or Annakut.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">4</span>
                  <span>
                    <strong>{isHindi ? 'एक्सप्रेस ट्रैकिंग अपडेट:' : 'Express Courier Tracking:'}</strong>{' '}
                    {isHindi
                      ? 'ब्लू डार्ट कूरियर का लाइव ट्रैकिंग लिंक सीधे चैट पर प्राप्त करें।'
                      : 'Direct live Blue Dart express tracking link delivered right to your chat.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Box 2: Temple Seva Hours */}
            <div className="p-7 rounded-3xl bg-black text-white">
              <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1">
                {isHindi ? 'मंदिर सेवा समय' : 'Temple Seva Schedule'}
              </span>
              <h4 className="text-lg font-bold mb-3">
                {isHindi ? 'श्री धाम वृंदावन सेवा समय सारणी' : 'Sri Dham Vrindavan Seva Timings'}
              </h4>
              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                  <span>{isHindi ? 'मंगला आरती से राजभोग:' : 'Mangala Arati to Rajbhog:'}</span>
                  <span className="font-bold text-white">08:00 AM – 01:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-neutral-800 pb-1.5">
                  <span>{isHindi ? 'उत्थापन से शयन आरती:' : 'Utthapan to Shayan Arati:'}</span>
                  <span className="font-bold text-white">04:30 PM – 09:30 PM</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span>{isHindi ? 'व्हाट्सएप ऑनलाइन सेवा:' : 'WhatsApp Seva Desk:'}</span>
                  <span className="font-bold text-emerald-400">
                    {isHindi ? 'उपलब्ध (24x7 संदेश)' : '24x7 Online Desk'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Frequently Asked Questions (FAQ) */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-xs font-bold text-neutral-800 mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isHindi ? 'भक्तों के सामान्य प्रश्न • FAQs' : 'Devotee FAQs'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-black tracking-tight">
              {isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-200 bg-white overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-bold text-black">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-black shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 bg-neutral-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Full-width Google Map */}
      <div className="w-full h-[400px] sm:h-[500px] relative mt-10">
        <iframe
          src={settings.contactMapIframe || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113426.06835252876!2d77.58788931168482!3d27.56846934204555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736e40938b81db%3A0x8979db7062dc2ed6!2sVrindavan%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714578502390!5m2!1sen!2sin"}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0"
        />
      </div>

      <Footer />
    </div>
  );
}
