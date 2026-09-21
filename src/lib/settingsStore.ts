export interface SiteSettingsData {
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
  
  // Pages
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

  // Home Page
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
  homeVideoList: Array<{ videoUrl: string, linkedProductName: string, linkedProductPrice: number, linkedProductUrl: string, linkedProductImage?: string }>;

  filterColors: string[];
  filterSizes: string[];
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  storeName: 'BroCART',
  logoUrl: '/images/brocart_logo_cropped.png',
  headerLinks: [
    { label: 'Home', url: '/' },
    { label: 'About Us', url: '/about' },
    { label: 'Shop', url: '/shop' },
    { label: 'Contact Us', url: '/contact' }
  ],
  tagline: 'Vrindavan Handcrafted Poshak & Shringar Store',
  announcementText: 'Radhe Radhe! ✨ Free Sacred Yamuna Braj Raj & Tulsi Prasad with all orders above ₹999',
  isAnnouncementActive: true,
  heroBadge: 'Vrindavan Sacred Craft • 2026 Collection',
  heroTitle: 'Adorn Your Beloved Laddu Gopal Ji With Divine Elegance',
  heroSubheading: 'Experience the royal devotion of Braj with heirloom-quality Zardozi silk poshaks, pure 24K gold-polished mukuts, and brass singhasans.',
  helplinePhone: '+91 98765 43210',
  whatsappPhone: '919876543210',
  supportEmail: 'support@shreekanha.com',
  storeAddress: 'Parikrama Marg, Raman Reti, Near Prem Mandir, Vrindavan, UP 281121',
  couponCode: 'RADHE10',
  couponDiscountPercent: 10,
  isCouponActive: true,
  freeShippingThreshold: 999,
  flatShippingFee: 99,
  isSaleActive: false,
  isRazorpayEnabled: false,
  razorpayKeyId: '',
  razorpayKeySecret: '',
  manualUpiId: '',
  saleTitle: 'FESTIVE MAHA SALE',
  saleDescription: 'Get flat 20% OFF on all Winter Poshaks. Use code RADHE20 at checkout.',
  saleImageUrl: '',
  footerCollections: [
    { label: 'Festive Heavy Poshaks', url: '/#catalog-section' },
    { label: 'Crown & Jewelry Sets', url: '/#catalog-section' },
    { label: 'Royal Thrones & Swings', url: '/#catalog-section' },
    { label: 'Winter Velvet Collection', url: '/#catalog-section' },
    { label: 'Puja & Seva Essentials', url: '/#catalog-section' }
  ],
  footerSizes: [
    { label: 'Size 00 & 0 (Chhota Gopal)', url: '' },
    { label: 'Size 1 & 2 (Home Mandir)', url: '' },
    { label: 'Size 3 & 4 (Grand Shringar)', url: '' },
    { label: 'Size 5 & 6 (Haveli Vigraha)', url: '' },
    { label: 'Size 7+ (Bada Laddu Gopal)', url: '' }
  ],
  footerPromises: [
    '100% Untouched Pavitra Packing',
    'Complimentary Delivery above ₹999',
    '7-Day Hassle-Free Size Exchange'
  ],
  footerSocialLinks: [
    { platform: 'Twitter', iconUrl: 'https://cdn-icons-png.flaticon.com/128/5969/5969020.png', url: '#' },
    { platform: 'Facebook', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384053.png', url: '#' },
    { platform: 'Instagram', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384063.png', url: '#' },
    { platform: 'LinkedIn', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384014.png', url: '#' },
    { platform: 'YouTube', iconUrl: 'https://cdn-icons-png.flaticon.com/128/1384/1384060.png', url: '#' }
  ],
  footerPaymentMethods: [
    { name: 'Amazon Pay', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Amazon_Pay_logo.svg/1280px-Amazon_Pay_logo.svg.png' },
    { name: 'BHIM UPI', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg' },
    { name: 'Google Pay', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png' },
    { name: 'Mastercard', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png' },
    { name: 'RuPay', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/RuPay.svg/1280px-RuPay.svg.png' },
    { name: 'Visa', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png' }
  ],
  footerPartnerPlatforms: [
    { name: 'Amazon.in', iconUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png', url: '#' },
    { name: 'Flipkart', iconUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Flipkart_logo.svg/1200px-Flipkart_logo.svg.png', url: '#' }
  ],
  aboutTitle: 'About Us',
  aboutDescription: 'Crafting royal devotional apparel, 24K gold-plated shringar, and temple furniture with timeless Braj craftsmanship and pure seva bhav.',
  aboutStoryTitle: 'Rooted in the Sacred Soil of Vrindavan Dham',
  aboutStoryText: 'Founded in the sacred alleys of Vrindavan near Nidhivan and Banke Bihari Temple, Shree Kanha Divine was born from a simple devotion: to offer Thakur Ji the finest garments fit for a divine King and beloved child.',
  aboutImage: '/images/poshak_royal_zardozi.jpg',
  
  aboutMetrics: [
    { value: '50,000+', label: 'Devotees Blessed' },
    { value: '100%', label: 'Handcrafted Silks' },
    { value: '35+', label: 'Countries Served' }
  ],
  aboutPillarsTitle: 'Four Pillars of Our Craft',
  aboutPillars: [
    { title: 'IDOL-SAFE FABRICS', description: 'Vegetable dyes and soft pure cotton linings prevent discoloration or scratches on brass, marble, and ashtadhatu idols.' },
    { title: 'VEDIC PROPORTIONS', description: 'Lehenga flares and cholis engineered for sizes 00 through 7+ to rest flat without wrinkling or awkward puckering on singhasans.' },
    { title: '24K GOLD LACQUER', description: 'Solid brass jewelry sealed in 24 karat micron gold plating with anti-tarnish coating for years of radiant luster.' },
    { title: 'BLESSED DELIVERY', description: 'Carefully cushioned in velvet keepsake boxes, scented with pure Vrindavan chandan ittar and sanctified tulsi leaves.' }
  ],
  aboutEmpowerTitle: 'Empowering Over 60 Women & Master Craftsmen in Braj',
  aboutEmpowerText: 'Our workshop supports local Brijwasi families and traditional women artisans, providing fair ethical wages, dignified work environments, and keeping centuries-old zardozi needlework alive.\n\nWhen you welcome a Shree Kanha poshak into your home altar, you are directly supporting the families who have dedicated their lives to Lord Krishna\'s service in Vrindavan.',
  aboutEmpowerImage1: '/images/vrindavan_artisan.jpg',
  aboutEmpowerImage2: '/images/laddu_gopal_shringar.jpg',

  contactTitle: 'Contact Us',
  contactDescription: 'Connect directly with our sacred Vrindavan Seva team for deity sizing, custom zardozi poshaks, or order inquiries.',
  contactMapIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113426.06835252876!2d77.58788931168482!3d27.56846934204555!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39736e40938b81db%3A0x8979db7062dc2ed6!2sVrindavan%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1714578502390!5m2!1sen!2sin',
  contactFaqs: [
    { question: 'How do I find the correct size for my Laddu Gopal Ji?', answer: 'Place your Thakur Ji comfortably on an altar or throne and measure vertically from the crown (top of head) to the lotus feet with a measuring tape. For instance, an idol measuring 2.5 to 3.2 inches wears Size 1. You can also view our Size Guide or send an idol photo on WhatsApp for instant guidance.' },
    { question: 'Is Cash on Delivery (COD) available across India?', answer: 'Yes, we offer Cash on Delivery (COD) to over 15,000+ PIN codes across India. A nominal convenience fee may apply for COD orders. You can verify your PIN code at checkout.' },
    { question: 'How many days does express delivery take?', answer: 'Metro cities typically receive orders within 2-4 business days. Other regions in India take 4-7 days. International shipping via DHL/FedEx takes 7-12 business days depending on customs.' },
    { question: 'Are these dresses safe and non-damaging for metal deities?', answer: 'Absolutely. We only use pure cotton inner linings. We never use cheap polyesters or sharp metallic zari threads on the inside that could scratch brass or ashtadhatu vigrahas.' },
    { question: 'Can we visit your Vrindavan Seva Center in person?', answer: 'Yes! We would love to welcome you. Our boutique is located near Prem Mandir on Parikrama Marg, Vrindavan. You can directly bring your deities for custom fitting sessions.' }
  ],

  homeHeroBadge: 'Vrindavan Sacred Craft • 2026 Collection',
  homeHeroTitle1: 'Adorn Your Beloved',
  homeHeroTitle2: 'Laddu Gopal Ji',
  homeHeroTitle3: 'With Divine Elegance',
  homeHeroSubtitle: 'Experience the royal devotion of Braj with heirloom-quality Zardozi silk poshaks, pure 24K gold-polished mukuts, carved bansuris, and brass singhasans for sizes 00 to 7+.',
  homeHeroImages: [
    '/images/hero_laddu_gopal_3d.jpg',
    '/images/poshak_royal_zardozi.jpg',
    '/images/shringar_mukut_bansuri.jpg',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80'
  ],
  homeHeroFeatures: [
    { title: 'Vrindavan Handcrafted', description: 'Pure mulberry silks & certified zardozi zari stitched with seva bhav by Braj artisans.' },
    { title: 'Complimentary Express Delivery', description: 'Free insured delivery across all Indian pincodes on orders above ₹999.' },
    { title: '100% Sacred Pavitra Packing', description: 'Untouched sacred packing blessed with holy Yamuna Braj Raj and Tulsi prasad.' },
    { title: 'Deity Size Guarantee', description: '7-Day hassle-free replacement ensures a perfect royal fit for your Laddu Gopal.' }
  ],

  homeStoryBadge: 'THE VRINDAVAN SEVA TRADITION',
  homeStoryTitle: 'Every Thread Woven with Sacred Devotion',
  homeStoryText1: 'In the sacred lanes of Vrindavan, traditional master karigars dedicate their lives to adorning Thakur Ji. To us, every poshak is an offering of pure love and devotion.',
  homeStoryText2: 'Each dress is hand-stitched following strict sacred principles of purity. We handpick fine mulberry silks, hand-cut peacocks, and certified zari threads.',
  homeStoryStats: [
    '100% Pure Silks & Heavy Zardozi',
    '40+ Years of Braj Craft Heritage',
    '50,000+ Happy Krishna Devotees'
  ],

  homeVideosTitle: 'TRUSTED BY EXPERTS',
  homeVideosSubtitle: 'Quality • Ayurvedic • Products',
  homeVideoList: [
    {
      videoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186115-877669460_large.mp4',
      linkedProductName: 'Alvista Kesar Shilajit Gold Resin',
      linkedProductPrice: 1099,
      linkedProductUrl: '#'
    },
    {
      videoUrl: 'https://cdn.pixabay.com/video/2024/04/10/207481_large.mp4',
      linkedProductName: 'Testohulk Combo Pack',
      linkedProductPrice: 3499,
      linkedProductUrl: '#'
    }
  ],

  filterColors: ['Black', 'Blue', 'Brown', 'Gray', 'Tan', 'Red', 'Gold', 'Green', 'Yellow', 'White'],
  filterSizes: ['No. 0', 'No. 1', 'No. 2', 'No. 3']
};

declare global {
  // eslint-disable-next-line no-var
  var memorySiteSettings: SiteSettingsData | undefined;
}

if (!global.memorySiteSettings) {
  global.memorySiteSettings = { ...DEFAULT_SETTINGS };
}

export const getMemorySettings = (): SiteSettingsData => {
  if (!global.memorySiteSettings) {
    global.memorySiteSettings = { ...DEFAULT_SETTINGS };
  }
  return global.memorySiteSettings;
};

export const updateMemorySettings = (updates: Partial<SiteSettingsData>): SiteSettingsData => {
  const current = getMemorySettings();
  global.memorySiteSettings = { ...current, ...updates };
  return global.memorySiteSettings;
};
