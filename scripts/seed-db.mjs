import mongoose from 'mongoose';

const URI = 'mongodb://ratanshakya:9LMdjupbtZ23w2eE@ac-w4rjxek-shard-00-00.4hfa9cj.mongodb.net:27017,ac-w4rjxek-shard-00-01.4hfa9cj.mongodb.net:27017,ac-w4rjxek-shard-00-02.4hfa9cj.mongodb.net:27017/brocart?ssl=true&replicaSet=atlas-14fetw-shard-0&authSource=admin&retryWrites=true&w=majority';

const PRODUCTS = [
  {
    productId: 'zardozi-royal-crimson-peacock',
    name: 'Royal Zardozi Crimson & Emerald Peacock Poshak Set',
    hindiName: 'राजसी जरदोजी मोर पोशाक सेट (मुकुट एवं पटका सहित)',
    category: 'poshak',
    categoryLabel: 'Festive Heavy Poshak',
    price: 1899,
    originalPrice: 2499,
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    description: 'Exquisite 3D handcrafted Laddu Gopal poshak made with pure mulberry raw silk, heavy golden zardozi threadwork, Swarovski crystals, and hand-cut peacock feather motifs.',
    fabric: 'Pure Mulberry Silk & Heavy Metallic Zari with Velvet trims',
    color: 'Royal Crimson Red & Emerald Green',
    inclusions: ['Circular Pleated Lehenga Ghera', 'Designer Choli with Golden Lace', 'Matching Jeweled Mor Mukut (Crown)', 'Brocade Waist Patka (Stole)', 'Matching Bajuband (Armlets)'],
    images: ['/images/poshak_royal_zardozi.jpg', '/images/hero_laddu_gopal_3d.jpg'],
    badge: '★ Best Seller | Vrindavan Craft',
    rating: 4.9,
    reviewsCount: 142,
    inStock: true,
    occasion: ['Janmashtami', 'Radhashtami', 'Diwali', 'Festive Seva'],
    featured: true
  },
  {
    productId: 'kundan-mor-mukut-shringar-set',
    name: 'Shree Krishna Kundan Mor Mukut & Carved Bansuri Shringar Set',
    hindiName: 'श्री कुंदन मोर मुकुट, स्वर्ण नक्काशी बांसुरी एवं कंठी हार',
    category: 'shringar',
    categoryLabel: 'Mukut & Shringar',
    price: 1249,
    originalPrice: 1699,
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    description: 'Lavish royal jewelry set for Thakur Ji with 24k gold-polished carved flute, kundan and ruby gemstone mor mukut, and multi-string pearl kanti haar.',
    fabric: '24K Micron Gold Plated Brass & Freshwater Pearl Accents',
    color: 'Gold, Ruby Red & Pearl White',
    inclusions: ['Carved Golden Bansuri with Pearl Tassels', 'Imperial Mor Mukut with Feather', '3-Layer Pearl & Ruby Kanti Haar', 'Pair of Golden Bajuband', 'Pair of Ghungroo Payal'],
    images: ['/images/shringar_mukut_bansuri.jpg'],
    badge: 'Pure 24K Gold Polish',
    rating: 5.0,
    reviewsCount: 98,
    inStock: true,
    occasion: ['Daily Seva', 'Janmashtami', 'Special Darshan'],
    featured: true
  },
  {
    productId: 'thakurji-swarna-singhasan-3d',
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
    inclusions: ['Solid Brass Carved Singhasan', 'Plush Velvet Gaddi (Cushion)', 'Two Miniature Cylindrical Bolsters (Takiye)', 'Matching Footstool (Charan Chauki)'],
    images: ['/images/hero_laddu_gopal_3d.jpg'],
    badge: 'Sacred Temple Grade',
    rating: 4.8,
    reviewsCount: 76,
    inStock: true,
    occasion: ['Daily Seva', 'Jhulan Utsav', 'Diwali'],
    featured: true
  },
  {
    productId: 'vrindavan-kesari-phool-banglow-poshak',
    name: 'Vrindavan Kesari Phool Banglow Summer Cotton Poshak',
    hindiName: 'वृंदावन केसरी फूल बंगला ग्रीष्मकालीन सूती पोशाक',
    category: 'poshak',
    categoryLabel: 'Summer & Daily Seva',
    price: 699,
    originalPrice: 950,
    sizes: ['0', '1', '2', '3', '4', '5'],
    description: 'Feather-light organic malmal cotton dress with vibrant saffron flower prints, gota patti borders, and cooling hand-spun textures tailored specially for hot summer days.',
    fabric: '100% Breathable Malmal Cotton with Pure Gota Border',
    color: 'Sacred Saffron Kesari & Marigold Yellow',
    inclusions: ['Pleated Cotton Ghera', 'Tie-up Choli for easy gentle dressing', 'Matching Cotton Pagdi Cap', 'Lightweight Cotton Patka'],
    images: ['/images/poshak_royal_zardozi.jpg', '/images/hero_laddu_gopal_3d.jpg'],
    badge: '100% Breathable Cotton',
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    occasion: ['Daily Seva', 'Summer Utsav', 'Chandan Yatra'],
    featured: false
  },
  {
    productId: 'antique-carved-brass-jhula',
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
    inclusions: ['Heavy Brass Swing Frame & Platter', 'Solid Brass Hanging Chains', 'Silk Velvet Gaddi & 2 Pillow Bolsters', 'Brass Pulling Cord (Jhula Dori)'],
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'],
    badge: 'Jhulan Utsav Special',
    rating: 5.0,
    reviewsCount: 64,
    inStock: true,
    occasion: ['Jhulan Utsav', 'Janmashtami', 'Shravan Maas'],
    featured: true
  },
  {
    productId: 'winter-warm-velvet-embroidered-poshak',
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
    inclusions: ['Warm Quilted Velvet Ghera', 'Full Sleeve Velvet Choli', 'Warm Ear-Covering Velvet Pagdi', 'Velvet Shawl (Rajai/Stole)'],
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'],
    badge: 'Winter Cozy Seva',
    rating: 4.8,
    reviewsCount: 52,
    inStock: true,
    occasion: ['Winter Seva', 'Kartik Maas', 'Makar Sankranti'],
    featured: false
  },
  {
    productId: 'ashta-gandha-shree-chandan-attar-box',
    name: 'Vrindavan Divine Seva Samagri & Organic Itra Box',
    hindiName: 'वृंदावन दिव्य सेवा सामग्री एवं शुद्ध इत्र संग्रह',
    category: 'seva-samagri',
    categoryLabel: 'Puja & Seva Essentials',
    price: 899,
    originalPrice: 1200,
    sizes: ['All Sizes'],
    description: 'Authentic Braj fragrance collection including 100% natural pure Mitti & Gulab Itra, genuine Mysore Sandalwood Paste, Radha Rani Kajal, and Tulsi Kanthi Mala.',
    fabric: 'Natural Botanical Extracts & Sacred Herbs',
    color: 'Golden Amber & Sandalwood Yellow',
    inclusions: ['Pure Rose & Khas Itra (12ml Glass Vial)', 'Natural Mysore Chandan Tablet & Rubbing Stone', 'Ayurvedic Herbal Kajal for Shringar', 'Original Sacred Tulsi Kanthi Mala'],
    images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'],
    badge: '100% Alcohol-Free & Natural',
    rating: 4.9,
    reviewsCount: 115,
    inStock: true,
    occasion: ['Daily Seva', 'Mangla Aarti', 'Shringar Aarti'],
    featured: false
  },
  {
    productId: 'peacock-blue-zari-lehenga-poshak',
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
    inclusions: ['Heavy Embroidery Lehenga', 'Fitted Choli with Back Ties', 'Designer Mor Pagdi Crown', 'Matching Side Patka'],
    images: ['/images/poshak_royal_zardozi.jpg'],
    badge: 'Janmashtami Special Edition',
    rating: 4.9,
    reviewsCount: 83,
    inStock: true,
    occasion: ['Janmashtami', 'Holi Utsav', 'Special Puja'],
    featured: true
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB database: brocart...');
    await mongoose.connect(URI);
    console.log('Connected successfully! Target database:', mongoose.connection.name);

    const ProductSchema = new mongoose.Schema({
      productId: { type: String, required: true, unique: true },
      name: { type: String, required: true },
      hindiName: { type: String, required: true },
      category: { type: String, required: true },
      categoryLabel: { type: String, required: true },
      price: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      sizes: [{ type: String }],
      description: { type: String, required: true },
      fabric: { type: String, required: true },
      color: { type: String, required: true },
      inclusions: [{ type: String }],
      images: [{ type: String }],
      badge: { type: String },
      rating: { type: Number, default: 5.0 },
      reviewsCount: { type: Number, default: 0 },
      inStock: { type: Boolean, default: true },
      occasion: [{ type: String }],
      featured: { type: Boolean, default: false }
    }, { timestamps: true });

    const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

    for (const p of PRODUCTS) {
      await Product.findOneAndUpdate(
        { productId: p.productId },
        { ...p },
        { upsert: true, new: true }
      );
      console.log(`  ✓ Product seeded: ${p.name}`);
    }

    // Orders schema
    const OrderItemSchema = new mongoose.Schema({
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true }
    });

    const OrderSchema = new mongoose.Schema({
      orderId: { type: String, required: true, unique: true },
      customer: {
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        specialNote: { type: String }
      },
      items: [OrderItemSchema],
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      total: { type: Number, required: true },
      paymentMethod: { type: String, enum: ['cod', 'upi', 'card'], required: true },
      status: { type: String, enum: ['confirmed', 'processing', 'shipped'], default: 'confirmed' }
    }, { timestamps: true });

    const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

    await Order.findOneAndUpdate(
      { orderId: 'KANHA-948210' },
      {
        orderId: 'KANHA-948210',
        customer: {
          fullName: 'Radhika Sharma',
          email: 'radhika.seva@gmail.com',
          phone: '9876543210',
          address: 'B-402, Radhe Krishna Residency, Near Prem Mandir Road',
          city: 'Vrindavan',
          state: 'Uttar Pradesh',
          pincode: '281121',
          specialNote: 'Please pack with fragrant Tulsi leaves and holy itra.'
        },
        items: [
          {
            productId: 'zardozi-royal-crimson-peacock',
            productName: 'Royal Zardozi Crimson & Emerald Peacock Poshak Set',
            size: '3',
            price: 1899,
            quantity: 1,
            image: '/images/poshak_royal_zardozi.jpg'
          }
        ],
        subtotal: 1899,
        discount: 0,
        shipping: 0,
        total: 1899,
        paymentMethod: 'upi',
        status: 'confirmed'
      },
      { upsert: true, new: true }
    );
    console.log('  ✓ Initial devotee order seeded: KANHA-948210');

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections currently in "brocart" database:', collections.map(c => c.name));

    await mongoose.disconnect();
    console.log('\n🎉 SUCCESS: "brocart" database is created, seeded, and live on MongoDB Atlas!');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
