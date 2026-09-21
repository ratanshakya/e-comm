import { Product, SizeChartInfo } from '@/types';

export const SIZE_CHART: SizeChartInfo[] = [
  {
    size: '00 / 0',
    deityHeightInches: '1.5" - 2.5"',
    dressDiameterInches: '4" - 5"',
    bestFor: 'Chhota Bal Gopal (Pocket size)',
    description: 'Perfect for tiny idols worshipped in miniature home altars and travelling mandirs.'
  },
  {
    size: '1',
    deityHeightInches: '2.5" - 3.2"',
    dressDiameterInches: '5" - 6"',
    bestFor: 'Standard Small Laddu Gopal',
    description: 'Very common size for personal home puja. Light and easy to dress daily.'
  },
  {
    size: '2',
    deityHeightInches: '3.2" - 4.0"',
    dressDiameterInches: '6" - 7"',
    bestFor: 'Classic Home Deity',
    description: 'Allows beautiful zari flares and pearl necklaces without feeling bulky.'
  },
  {
    size: '3',
    deityHeightInches: '4.0" - 4.8"',
    dressDiameterInches: '7" - 8"',
    bestFor: 'Medium Shrine Laddu Gopal',
    description: 'Ideal proportion for heavy zardozi embroideries and peacock feather crowns.'
  },
  {
    size: '4',
    deityHeightInches: '4.8" - 5.5"',
    dressDiameterInches: '8" - 10"',
    bestFor: 'Grand Temple Shrine',
    description: 'Lavish lehenga flares with intricate borders and designer waist patka.'
  },
  {
    size: '5',
    deityHeightInches: '5.5" - 6.5"',
    dressDiameterInches: '10" - 12"',
    bestFor: 'Large Laddu Gopal Ji',
    description: 'Magnificent festive presence, perfect for Janmashtami and Jhulan Utsav.'
  },
  {
    size: '6',
    deityHeightInches: '6.5" - 7.5"',
    dressDiameterInches: '12" - 14"',
    bestFor: 'Royal Haveli & Mandir Deity',
    description: 'Extravagant royal court dressing with double ghera, heavy kundan accents.'
  },
  {
    size: '7+',
    deityHeightInches: '7.5" - 9.0"+',
    dressDiameterInches: '14" - 16"+',
    bestFor: 'Bara Laddu Gopal / Ashram Vigraha',
    description: 'Masterpiece creations crafted by master karigars of Vrindavan.'
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'zardozi-royal-crimson-peacock',
    name: 'Royal Zardozi Crimson & Emerald Peacock Poshak Set',
    hindiName: 'राजसी जरदोजी मोर पोशाक सेट (मुकुट एवं पटका सहित)',
    category: 'poshak',
    categoryLabel: 'Festive Heavy Poshak',
    price: 1899,
    originalPrice: 2499,
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    description: 'Exquisite 3D handcrafted Laddu Gopal poshak made with pure mulberry raw silk, heavy golden zardozi threadwork, Swarovski crystals, and hand-cut peacock feather motifs. Hand-stitched by Vrindavan artisans with sacred pure seva bhav.',
    fabric: 'Pure Mulberry Silk & Heavy Metallic Zari with Velvet trims',
    color: 'Royal Crimson Red & Emerald Green',
    inclusions: [
      'Circular Pleated Lehenga Ghera',
      'Designer Choli with Golden Lace',
      'Matching Jeweled Mor Mukut (Crown)',
      'Brocade Waist Patka (Stole)',
      'Matching Bajuband (Armlets)'
    ],
    images: [
      '/images/poshak_royal_zardozi.jpg',
      '/images/hero_laddu_gopal_3d.jpg'
    ],
    badge: '★ Best Seller | Vrindavan Craft',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    occasion: ['Janmashtami', 'Radhashtami', 'Diwali', 'Festive Seva'],
    featured: true
  },
  {
    id: 'kundan-mor-mukut-shringar-set',
    name: 'Shree Krishna Kundan Mor Mukut & Carved Bansuri Shringar Set',
    hindiName: 'श्री कुंदन मोर मुकुट, स्वर्ण नक्काशी बांसुरी एवं कंठी हार',
    category: 'shringar',
    categoryLabel: 'Mukut & Shringar',
    price: 1249,
    originalPrice: 1699,
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    description: 'Lavish royal jewelry set for Thakur Ji. Features a 24k gold-polished carved flute (bansuri) with natural pearl hangings, a multi-tier kundan and ruby gemstone mor mukut with genuine peacock quill, multi-string pearl kanti haar, and delicate payal anklets.',
    fabric: '24K Micron Gold Plated Brass & Freshwater Pearl Accents',
    color: 'Gold, Ruby Red & Pearl White',
    inclusions: [
      'Carved Golden Bansuri with Pearl Tassels',
      'Imperial Mor Mukut with Feather',
      '3-Layer Pearl & Ruby Kanti Haar',
      'Pair of Golden Bajuband',
      'Pair of Ghungroo Payal'
    ],
    images: [
      '/images/shringar_mukut_bansuri.jpg'
    ],
    badge: 'Pure 24K Gold Polish',
    rating: 5.0,
    reviewsCount: 98,
    inStock: true,
    occasion: ['Daily Seva', 'Janmashtami', 'Special Darshan'],
    featured: true
  },
  {
    id: 'thakurji-swarna-singhasan-3d',
    name: 'Devotional Swarna Mayur Singhasan (Royal Throne)',
    hindiName: 'श्री ठाकुर जी स्वर्ण मयूर सिंहासन',
    category: 'singhasan-jhula',
    categoryLabel: 'Singhasan & Jhula',
    price: 2899,
    originalPrice: 3800,
    sizes: ['1', '2', '3', '4', '5', '6'],
    description: 'Majestic royal throne for Laddu Gopal Ji with ornate dancing peacock backrest, royal lion-carved armrests, and deep sapphire-blue velvet cushioned seating with matching bolster pillows.',
    fabric: 'Solid Cast Brass with Antique Gold Lacquer & Velvet Cushions',
    color: 'Antique Temple Gold & Royal Sapphire Blue',
    inclusions: [
      'Solid Brass Carved Singhasan',
      'Plush Velvet Gaddi (Cushion)',
      'Two Miniature Cylindrical Bolsters (Takiye)',
      'Matching Footstool (Charan Chauki)'
    ],
    images: [
      '/images/hero_laddu_gopal_3d.jpg'
    ],
    badge: 'Sacred Temple Grade',
    rating: 4.8,
    reviewsCount: 76,
    inStock: true,
    occasion: ['Daily Seva', 'Jhulan Utsav', 'Diwali'],
    featured: true
  },
  {
    id: 'vrindavan-kesari-phool-banglow-poshak',
    name: 'Vrindavan Kesari Phool Banglow Summer Cotton Poshak',
    hindiName: 'वृंदावन केसरी फूल बंगला ग्रीष्मकालीन सूती पोशाक',
    category: 'poshak',
    categoryLabel: 'Summer & Daily Seva',
    price: 699,
    originalPrice: 950,
    sizes: ['0', '1', '2', '3', '4', '5'],
    description: 'Feather-light organic malmal cotton dress with vibrant saffron flower prints, gota patti borders, and cooling hand-spun textures tailored specially for hot summer days and Phool Banglow seva.',
    fabric: '100% Breathable Malmal Cotton with Pure Gota Border',
    color: 'Sacred Saffron Kesari & Marigold Yellow',
    inclusions: [
      'Pleated Cotton Ghera',
      'Tie-up Choli for easy gentle dressing',
      'Matching Cotton Pagdi Cap',
      'Lightweight Cotton Patka'
    ],
    images: [
      '/images/poshak_royal_zardozi.jpg',
      '/images/hero_laddu_gopal_3d.jpg'
    ],
    badge: '100% Breathable Cotton',
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    occasion: ['Daily Seva', 'Summer Utsav', 'Chandan Yatra'],
    featured: false
  },
  {
    id: 'antique-carved-brass-jhula',
    name: 'Handcrafted Vrindavan Brass Swing (Jhula) with Velvet Bedding',
    hindiName: 'हस्तनिर्मित पीतल मयूर झूला (मखमली गद्दे सहित)',
    category: 'singhasan-jhula',
    categoryLabel: 'Singhasan & Jhula',
    price: 3499,
    originalPrice: 4500,
    sizes: ['0', '1', '2', '3', '4', '5'],
    description: 'Traditional solid brass hanging swing adorned with double peacocks on top, floral chain links, and smooth swinging mechanism. Complete with golden yellow raw silk bed set.',
    fabric: 'Pure Heavy Gauge Brass with Silk Cushioning',
    color: 'Antique Gold & Turmeric Yellow',
    inclusions: [
      'Heavy Brass Swing Frame & Platter',
      'Solid Brass Hanging Chains',
      'Silk Velvet Gaddi & 2 Pillow Bolsters',
      'Brass Pulling Cord (Jhula Dori)'
    ],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Jhulan Utsav Special',
    rating: 5.0,
    reviewsCount: 64,
    inStock: true,
    occasion: ['Jhulan Utsav', 'Janmashtami', 'Shravan Maas'],
    featured: true
  },
  {
    id: 'winter-warm-velvet-embroidered-poshak',
    name: 'Imperial Winter Deep Blue Velvet Quilted Poshak Set',
    hindiName: 'शाही शीतकालीन नीली मखमली गर्म पोशाक सेट',
    category: 'winter-special',
    categoryLabel: 'Winter Velvet Collection',
    price: 1599,
    originalPrice: 2199,
    sizes: ['1', '2', '3', '4', '5', '6'],
    description: 'Keep your beloved Laddu Gopal warm in winter with this ultra-soft quilted velvet dress featuring golden thread leaves, faux fur lining, and padded matching woolen pagdi cap.',
    fabric: 'Ultra-Soft Micro Velvet with Warm Thermal Quilted Interlining',
    color: 'Midnight Royal Blue & Antique Gold',
    inclusions: [
      'Warm Quilted Velvet Ghera',
      'Full Sleeve Velvet Choli',
      'Warm Ear-Covering Velvet Pagdi',
      'Velvet Shawl (Rajai/Stole)'
    ],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'
    ],
    badge: 'Winter Cozy Seva',
    rating: 4.8,
    reviewsCount: 52,
    inStock: true,
    occasion: ['Winter Seva', 'Kartik Maas', 'Makar Sankranti'],
    featured: false
  },
  {
    id: 'ashta-gandha-shree-chandan-attar-box',
    name: 'Vrindavan Divine Seva Samagri & Organic Itra Box',
    hindiName: 'वृंदावन दिव्य सेवा सामग्री एवं शुद्ध इत्र संग्रह',
    category: 'seva-samagri',
    categoryLabel: 'Puja & Seva Essentials',
    price: 899,
    originalPrice: 1200,
    sizes: ['All Sizes'],
    description: 'Authentic Braj fragrance collection including 100% natural pure Mitti & Gulab Itra (non-alcoholic perfume), genuine Mysore Sandalwood Paste (Shree Chandan), Radha Rani Kajal, and Tulsi Kanthi Mala.',
    fabric: 'Natural Botanical Extracts & Sacred Herbs',
    color: 'Golden Amber & Sandalwood Yellow',
    inclusions: [
      'Pure Rose & Khas Itra (12ml Glass Vial)',
      'Natural Mysore Chandan Tablet & Rubbing Stone',
      'Ayurvedic Herbal Kajal for Shringar',
      'Original Sacred Tulsi Kanthi Mala'
    ],
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    badge: '100% Alcohol-Free & Natural',
    rating: 4.9,
    reviewsCount: 115,
    inStock: true,
    occasion: ['Daily Seva', 'Mangla Aarti', 'Shringar Aarti'],
    featured: false
  },
  {
    id: 'peacock-blue-zari-lehenga-poshak',
    name: 'Sri Krishna Shahi Mor Pankhi Velvet & Zari Poshak',
    hindiName: 'श्री कृष्ण शाही मोर पंखी मखमली जरी पोशाक',
    category: 'poshak',
    categoryLabel: 'Festive Heavy Poshak',
    price: 1750,
    originalPrice: 2300,
    sizes: ['1', '2', '3', '4', '5'],
    description: 'Inspired by the majestic peacock gardens of Nidhivan, this dress combines rich teal blue velvet with real zari thread peacocks, sequin reflections, and high-quality lace trim.',
    fabric: 'Royal Teal Blue Micro Velvet & Golden Zari',
    color: 'Teal Blue & Sunlit Gold',
    inclusions: [
      'Heavy Embroidery Lehenga',
      'Fitted Choli with Back Ties',
      'Designer Mor Pagdi Crown',
      'Matching Side Patka'
    ],
    images: [
      '/images/poshak_royal_zardozi.jpg'
    ],
    badge: 'Janmashtami Special Edition',
    rating: 4.9,
    reviewsCount: 83,
    inStock: true,
    occasion: ['Janmashtami', 'Holi Utsav', 'Special Puja'],
    featured: true
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'All Collections', icon: 'Sparkles', count: 8 },
  { id: 'poshak', label: 'Festive Heavy Poshaks', icon: 'Shirt', count: 3 },
  { id: 'shringar', label: 'Crown & Jewelry Sets', icon: 'Crown', count: 1 },
  { id: 'singhasan-jhula', label: 'Royal Thrones & Swings', icon: 'Armchair', count: 2 },
  { id: 'winter-special', label: 'Winter Velvet Collection', icon: 'Snowflake', count: 1 },
  { id: 'seva-samagri', label: 'Puja & Seva Essentials', icon: 'Flame', count: 1 },
];
