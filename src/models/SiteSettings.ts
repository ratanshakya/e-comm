import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSettings extends Document {
  storeName: string;
  logoUrl: string;
  headerLinks: Array<{ label: string, url: string }>;
  tagline: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  heroBadge: string;
  heroTitle: string;
  heroSubheading: string;
  helplinePhone: string;
  whatsappPhone: string;
  supportEmail: string;
  storeAddress: string;
  couponCode: string;
  couponDiscountPercent: number;
  isCouponActive: boolean;
  freeShippingThreshold: number;
  flatShippingFee: number;
  isSaleActive: boolean;
  isRazorpayEnabled: boolean;
  razorpayKeyId: string;
  razorpayKeySecret: string;
  manualUpiId: string;
  saleTitle: string;
  saleDescription: string;
  saleImageUrl: string;
  footerCollections: Array<{ label: string, url: string }>;
  footerSizes: Array<{ label: string, url: string }>;
  footerPromises: string[];
  footerSocialLinks: Array<{ platform: string, iconUrl: string, url: string }>;
  footerPaymentMethods: Array<{ name: string, iconUrl: string }>;
  footerPartnerPlatforms: Array<{ name: string, iconUrl: string, url: string }>;
  
  aboutTitle: string;
  aboutDescription: string;
  aboutStoryTitle: string;
  aboutStoryText: string;
  aboutImage: string;
  aboutMetrics: Array<{ value: string, label: string }>;
  aboutPillarsTitle: string;
  aboutPillars: Array<{ title: string, description: string }>;
  aboutEmpowerTitle: string;
  aboutEmpowerText: string;
  aboutEmpowerImage1: string;
  aboutEmpowerImage2: string;

  contactTitle: string;
  contactDescription: string;
  contactMapIframe: string;
  contactFaqs: Array<{ question: string, answer: string }>;

  homeHeroBadge: string;
  homeHeroTitle1: string;
  homeHeroTitle2: string;
  homeHeroTitle3: string;
  homeHeroSubtitle: string;
  homeHeroImages: Array<string>;
  homeHeroFeatures: Array<{ title: string, description: string }>;

  homeStoryBadge: string;
  homeStoryTitle: string;
  homeStoryText1: string;
  homeStoryText2: string;
  homeStoryStats: Array<string>;

  homeVideosTitle: string;
  homeVideosSubtitle: string;
  homeVideoList: Array<{ videoUrl: string, linkedProductName: string, linkedProductPrice: number, linkedProductUrl: string, linkedProductImage: string }>;

  filterColors: string[];
  filterSizes: string[];
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    storeName: { type: String, default: 'BroCART' },
    logoUrl: { type: String, default: '/images/brocart_logo_cropped.png' },
    headerLinks: {
      type: [{ label: String, url: String }],
      default: [
        { label: 'Home', url: '/' },
        { label: 'About Us', url: '/about' },
        { label: 'Shop', url: '/shop' },
        { label: 'Contact Us', url: '/about#contact' }
      ]
    },
    tagline: { type: String, default: 'Vrindavan Handcrafted Poshak & Shringar' },
    announcementText: {
      type: String,
      default: 'Radhe Radhe! ✨ Free Sacred Yamuna Braj Raj & Tulsi Prasad with all orders above ₹999'
    },
    isAnnouncementActive: { type: Boolean, default: true },
    heroBadge: { type: String, default: 'Vrindavan Sacred Craft • 2026 Collection' },
    heroTitle: { type: String, default: 'Adorn Your Beloved Laddu Gopal Ji With Divine Elegance' },
    heroSubheading: {
      type: String,
      default: 'Experience the royal devotion of Braj with heirloom-quality Zardozi silk poshaks, pure 24K gold-polished mukuts, and brass singhasans.'
    },
    helplinePhone: { type: String, default: '+91 98765 43210' },
    whatsappPhone: { type: String, default: '919876543210' },
    supportEmail: { type: String, default: 'support@shreekanha.com' },
    storeAddress: { type: String, default: 'Parikrama Marg, Raman Reti, Near Prem Mandir, Vrindavan, UP 281121' },
    couponCode: { type: String, default: 'RADHE10' },
    couponDiscountPercent: { type: Number, default: 10 },
    isCouponActive: { type: Boolean, default: true },
    freeShippingThreshold: { type: Number, default: 999 },
    flatShippingFee: { type: Number, default: 99 },
    isSaleActive: { type: Boolean, default: false },
    isRazorpayEnabled: { type: Boolean, default: false },
    razorpayKeyId: { type: String, default: '' },
    razorpayKeySecret: { type: String, default: '' },
    manualUpiId: { type: String, default: '' },
    saleTitle: { type: String, default: 'FESTIVE MAHA SALE' },
    saleDescription: { type: String, default: 'Get flat 20% OFF on all Winter Poshaks. Use code RADHE20 at checkout.' },
    saleImageUrl: { type: String, default: '' },
    footerCollections: { 
      type: [{ label: String, url: String }], 
      default: [
        { label: 'Festive Heavy Poshaks', url: '/#catalog-section' },
        { label: 'Crown & Jewelry Sets', url: '/#catalog-section' },
        { label: 'Royal Thrones & Swings', url: '/#catalog-section' },
        { label: 'Winter Velvet Collection', url: '/#catalog-section' },
        { label: 'Puja & Seva Essentials', url: '/#catalog-section' }
      ]
    },
    footerSizes: { 
      type: [{ label: String, url: String }], 
      default: [
        { label: 'Size 00 & 0 (Chhota Gopal)', url: '' },
        { label: 'Size 1 & 2 (Home Mandir)', url: '' },
        { label: 'Size 3 & 4 (Grand Shringar)', url: '' },
        { label: 'Size 5 & 6 (Haveli Vigraha)', url: '' },
        { label: 'Size 7+ (Bada Laddu Gopal)', url: '' }
      ]
    },
    footerPromises: {
      type: [String],
      default: [
        '100% Untouched Pavitra Packing',
        'Complimentary Delivery above ₹999',
        '7-Day Hassle-Free Size Exchange'
      ]
    },
    footerSocialLinks: {
      type: [{ platform: String, iconUrl: String, url: String }],
      default: [
        { platform: 'Twitter', iconUrl: 'https://cdn-icons-png.flaticon.com/128/5969/5969020.png', url: '#' },
        { platform: 'Facebook', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384053.png', url: '#' },
        { platform: 'Instagram', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384063.png', url: '#' },
        { platform: 'LinkedIn', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384014.png', url: '#' },
        { platform: 'YouTube', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384060.png', url: '#' }
      ]
    },
    footerPaymentMethods: {
      type: [{ name: String, iconUrl: String }],
      default: [
        { name: 'Amazon Pay', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Amazon_Pay_logo.svg/1280px-Amazon_Pay_logo.svg.png' },
        { name: 'BHIM UPI', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg' },
        { name: 'Google Pay', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png' },
        { name: 'Mastercard', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' },
        { name: 'RuPay', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1280px-RuPay.svg.png' },
        { name: 'Visa', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png' }
      ]
    },
    footerPartnerPlatforms: {
      type: [{ name: String, iconUrl: String, url: String }],
      default: [
        { name: 'Amazon.in', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png', url: '#' },
        { name: 'Flipkart', iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Flipkart_logo.svg/1200px-Flipkart_logo.svg.png', url: '#' }
      ]
    },
    aboutTitle: { type: String, default: 'About Us' },
    aboutDescription: { type: String, default: 'Crafting royal devotional apparel, 24K gold-plated shringar, and temple furniture with timeless Braj craftsmanship and pure seva bhav.' },
    aboutStoryTitle: { type: String, default: 'Rooted in the Sacred Soil of Vrindavan Dham' },
    aboutStoryText: { type: String, default: 'Founded in the sacred alleys of Vrindavan near Nidhivan and Banke Bihari Temple, Shree Kanha Divine was born from a simple devotion: to offer Thakur Ji the finest garments fit for a divine King and beloved child.' },
    aboutImage: { type: String, default: '/images/poshak_royal_zardozi.jpg' },
    
    aboutMetrics: {
      type: [{ value: String, label: String }],
      default: [
        { value: '50,000+', label: 'Devotees Blessed' },
        { value: '100%', label: 'Handcrafted Silks' },
        { value: '35+', label: 'Countries Served' }
      ]
    },
    aboutPillarsTitle: { type: String, default: 'Four Pillars of Our Craft' },
    aboutPillars: {
      type: [{ title: String, description: String }],
      default: [
        { title: 'IDOL-SAFE FABRICS', description: 'Vegetable dyes and soft pure cotton linings prevent discoloration or scratches on brass, marble, and ashtadhatu idols.' },
        { title: 'VEDIC PROPORTIONS', description: 'Lehenga flares and cholis engineered for sizes 00 through 7+ to rest flat without wrinkling or awkward puckering on singhasans.' },
        { title: '24K GOLD LACQUER', description: 'Solid brass jewelry sealed in 24 karat micron gold plating with anti-tarnish coating for years of radiant luster.' },
        { title: 'BLESSED DELIVERY', description: 'Carefully cushioned in velvet keepsake boxes, scented with pure Vrindavan chandan ittar and sanctified tulsi leaves.' }
      ]
    },
    aboutEmpowerTitle: { type: String, default: 'Empowering Over 60 Women & Master Craftsmen in Braj' },
    aboutEmpowerText: { type: String, default: 'Our workshop supports local Brijwasi families and traditional women artisans, providing fair ethical wages, dignified work environments, and keeping centuries-old zardozi needlework alive.\n\nWhen you welcome a Shree Kanha poshak into your home altar, you are directly supporting the families who have dedicated their lives to Lord Krishna\'s service in Vrindavan.' },
    aboutEmpowerImage1: { type: String, default: '/images/vrindavan_artisan.jpg' },
    aboutEmpowerImage2: { type: String, default: '/images/laddu_gopal_shringar.jpg' },

    contactTitle: { type: String, default: 'Contact Us' },
    contactDescription: { type: String, default: 'Connect directly with our sacred Vrindavan Seva team for deity sizing, custom zardozi poshaks, or order inquiries.' },
    contactMapIframe: { type: String, default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113426.06835252876!2d77.58788931168482!3d27.56846934204555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736e40938b81db%3A0x8979db7062dc2ed6!2sVrindavan%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714578502390!5m2!1sen!2sin' },
    contactFaqs: {
      type: [{ question: String, answer: String }],
      default: [
        { question: 'How do I find the correct size for my Laddu Gopal Ji?', answer: 'Place your Thakur Ji comfortably on an altar or throne and measure vertically from the crown (top of head) to the lotus feet with a measuring tape. For instance, an idol measuring 2.5 to 3.2 inches wears Size 1. You can also view our Size Guide or send an idol photo on WhatsApp for instant guidance.' },
        { question: 'Is Cash on Delivery (COD) available across India?', answer: 'Yes, we offer Cash on Delivery (COD) to over 15,000+ PIN codes across India. A nominal convenience fee may apply for COD orders. You can verify your PIN code at checkout.' },
        { question: 'How many days does express delivery take?', answer: 'Metro cities typically receive orders within 2-4 business days. Other regions in India take 4-7 days. International shipping via DHL/FedEx takes 7-12 business days depending on customs.' },
        { question: 'Are these dresses safe and non-damaging for metal deities?', answer: 'Absolutely. We only use pure cotton inner linings. We never use cheap polyesters or sharp metallic zari threads on the inside that could scratch brass or ashtadhatu vigrahas.' },
        { question: 'Can we visit your Vrindavan Seva Center in person?', answer: 'Yes! We would love to welcome you. Our boutique is located near Prem Mandir on Parikrama Marg, Vrindavan. You can directly bring your deities for custom fitting sessions.' }
      ]
    },

    homeHeroBadge: { type: String, default: 'Vrindavan Sacred Craft • 2026 Collection' },
    homeHeroTitle1: { type: String, default: 'Adorn Your Beloved' },
    homeHeroTitle2: { type: String, default: 'Laddu Gopal Ji' },
    homeHeroTitle3: { type: String, default: 'With Divine Elegance' },
    homeHeroSubtitle: { type: String, default: 'Experience the royal devotion of Braj with heirloom-quality Zardozi silk poshaks, pure 24K gold-polished mukuts, carved bansuris, and brass singhasans for sizes 00 to 7+.' },
    homeHeroImages: {
      type: [String],
      default: [
        '/images/hero_laddu_gopal_3d.jpg',
        '/images/poshak_royal_zardozi.jpg',
        '/images/shringar_mukut_bansuri.jpg',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
      ]
    },
    homeHeroFeatures: {
      type: [{ title: String, description: String }],
      default: [
        { title: 'Vrindavan Handcrafted', description: 'Pure mulberry silks & certified zardozi zari stitched with seva bhav by Braj artisans.' },
        { title: 'Complimentary Express Delivery', description: 'Free insured delivery across all Indian pincodes on orders above ₹999.' },
        { title: '100% Sacred Pavitra Packing', description: 'Untouched sacred packing blessed with holy Yamuna Braj Raj and Tulsi prasad.' },
        { title: 'Deity Size Guarantee', description: '7-Day hassle-free replacement ensures a perfect royal fit for your Laddu Gopal.' }
      ]
    },

    homeStoryBadge: { type: String, default: 'THE VRINDAVAN SEVA TRADITION' },
    homeStoryTitle: { type: String, default: 'Every Thread Woven with Sacred Devotion' },
    homeStoryText1: { type: String, default: 'In the sacred lanes of Vrindavan, traditional master karigars dedicate their lives to adorning Thakur Ji. To us, every poshak is an offering of pure love and devotion.' },
    homeStoryText2: { type: String, default: 'Each dress is hand-stitched following strict sacred principles of purity. We handpick fine mulberry silks, hand-cut peacocks, and certified zari threads.' },
    homeStoryStats: {
      type: [String],
      default: [
        '100% Pure Silks & Heavy Zardozi',
        '40+ Years of Braj Craft Heritage',
        '50,000+ Happy Krishna Devotees'
      ]
    },

    homeVideosTitle: { type: String, default: 'TRUSTED BY EXPERTS' },
    homeVideosSubtitle: { type: String, default: 'Quality • Ayurvedic • Products' },
    homeVideoList: {
      type: [{ videoUrl: String, linkedProductName: String, linkedProductPrice: Number, linkedProductUrl: String, linkedProductImage: String }],
      default: [
        {
          videoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186115-877669460_large.mp4',
          linkedProductName: 'Alvista Kesar Shilajit Gold Resin',
          linkedProductPrice: 1099,
          linkedProductUrl: '#',
          linkedProductImage: ''
        },
        {
          videoUrl: 'https://cdn.pixabay.com/video/2024/04/10/207481_large.mp4',
          linkedProductName: 'Testohulk Combo Pack',
          linkedProductPrice: 3499,
          linkedProductUrl: '#',
          linkedProductImage: ''
        }
      ]
    },

    filterColors: {
      type: [String],
      default: ['Black', 'Blue', 'Brown', 'Gray', 'Tan', 'Red', 'Gold', 'Green', 'Yellow', 'White']
    },
    filterSizes: {
      type: [String],
      default: ['No. 0', 'No. 1', 'No. 2', 'No. 3']
    }
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);
