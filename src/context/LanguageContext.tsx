'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'gu';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', flag: '🕉️' },
];

export const TRANSLATIONS = {
  en: {
    // Navigation
    'nav.home': 'HOME',
    'nav.about': 'ABOUT US',
    'nav.shop': 'SHOP',
    'nav.contact': 'CONTACT US',
    'nav.searchPlaceholder': 'Search royal poshaks, mukut, bansuri, singhasan...',
    'nav.popular': 'Popular:',
    'nav.account': 'Devotee Account',
    'nav.wishlist': 'Wishlist',
    'nav.cart': 'Cart',
    'nav.selectLanguage': 'Select Language',
    'nav.search': 'Search',

    // Hero Section
    'hero.badge': 'Vrindavan Sacred Craft • 2026 Collection',
    'hero.titleLine1': 'Adorn Your Beloved',
    'hero.titleLine2': 'Laddu Gopal Ji',
    'hero.titleLine3': 'With Divine Elegance',
    'hero.subheading': 'Experience the royal devotion of Braj with heirloom-quality Zardozi silk poshaks, pure 24K gold-polished mukuts, carved bansuris, and brass singhasans for sizes 00 to 7+.',
    'hero.exploreBtn': 'Explore Royal Poshaks',
    'hero.sizeGuideBtn': 'Size Guide (0 to 7+)',
    'hero.liveStream': '3D Corridor • Live View',
    'hero.darshan': '🪶 Sacred Vrindavan Darshan',

    // Hero 4 Pillars
    'hero.pillar1Title': 'Vrindavan Handcrafted',
    'hero.pillar1Desc': 'Pure mulberry silks & certified zardozi zari stitched with seva bhav by Braj artisans.',
    'hero.pillar2Title': 'Complimentary Express Delivery',
    'hero.pillar2Desc': 'Free insured delivery across all Indian pincodes on orders above ₹999.',
    'hero.pillar3Title': '100% Sacred Pavitra Packing',
    'hero.pillar3Desc': 'Untouched sacred packing blessed with holy Yamuna Braj Raj and Tulsi prasad.',
    'hero.pillar4Title': 'Deity Size Guarantee',
    'hero.pillar4Desc': '7-Day hassle-free replacement ensures a perfect royal fit for your Laddu Gopal.',

    // Catalog & Filters
    'catalog.all': 'All Collections',
    'catalog.poshak': 'Festive Heavy Poshaks',
    'catalog.shringar': 'Crown & Jewelry Sets',
    'catalog.singhasan': 'Royal Thrones & Swings',
    'catalog.winter': 'Winter Velvet Collection',
    'catalog.seva': 'Puja & Seva Essentials',
    'catalog.sizeFilter': 'Deity Size:',
    'catalog.allSizes': 'All Sizes',
    'catalog.sort': 'Sort by:',
    'catalog.sortPopular': 'Most Loved',
    'catalog.sortPriceLow': 'Price: Low to High',
    'catalog.sortPriceHigh': 'Price: High to Low',
    'catalog.sortRating': 'Top Rated 5★',
    'catalog.noProductsTitle': 'No products found in this filter',
    'catalog.noProductsDesc': 'Please select a different size or reset filters to browse the complete Vrindavan collection.',
    'catalog.resetFilters': 'Reset Filters',

    // Product Card
    'card.off': 'OFF',
    'card.save': 'Save',
    'card.size': 'Size:',
    'card.allSizesText': 'All Sizes',
    'card.qty': 'Qty:',
    'card.addToCart': 'Add to Cart',
    'card.added': '✓ Added to Bag',
    'card.askWhatsApp': 'Ask on WhatsApp',
    'card.whatsAppQuery': 'Radhe Radhe! I would like to inquire about "{name}" (Size No. {size}). Is it available?',
    'card.decrease': 'Decrease quantity',
    'card.increase': 'Increase quantity',

    // Artisan Story Section
    'story.badge': 'THE VRINDAVAN SEVA TRADITION',
    'story.badgeTag': 'Vrindavan Sacred Craft',
    'story.title': 'Every Thread Woven with Sacred Devotion',
    'story.p1': 'In the sacred lanes of Vrindavan, traditional master karigars dedicate their lives to adorning Thakur Ji. To us, every poshak is an offering of pure love and devotion.',
    'story.p2': 'Each dress is hand-stitched following strict sacred principles of purity. We handpick fine mulberry silks, hand-cut peacocks, and certified zari threads.',
    'story.stat1': '100% Pure Silks & Heavy Zardozi',
    'story.stat2': '40+ Years of Braj Craft Heritage',
    'story.stat3': '50,000+ Happy Krishna Devotees',

    // Devotee Reviews
    'reviews.badge': 'DEVOTEE VOICES',
    'reviews.badgeFull': 'Devotee Experiences • 4.9/5 Rating (1,400+ Reviews)',
    'reviews.title': 'Blessed Words from Devotees',
    'reviews.subtitle': 'Heartfelt experiences shared by Krishna devotees across India and worldwide',

    // Footer
    'footer.mantra': '🌸 Hare Krishna Hare Krishna Krishna Krishna Hare Hare | Hare Rama Hare Rama Rama Rama Hare Hare 🌸',
    'footer.desc': 'BroCART — Dedicated to serving Lord Krishna and Laddu Gopal devotees worldwide with pure fabrics, authentic zardozi embroidery, and blessed temple accessories directly from Vrindavan Dham.',
    'footer.support': '+91 98765 43210 (Mon-Sat, 9 AM - 9 PM)',
    'footer.collectionsTitle': 'Collections',
    'footer.shopBySizeTitle': 'Shop By Size',
    'footer.promisesTitle': 'Seva Promises',
    'footer.sizeCalculator': 'Open Size Calculator ↗',
    'footer.promise1': '100% Untouched Pavitra Packing',
    'footer.promise2': 'Complimentary Delivery above ₹999',
    'footer.promise3': '7-Day Hassle-Free Size Exchange',
    'footer.copyright': '© 2026 BroCART Inc. Handcrafted with devotion in Vrindavan Dham.',

    // Cart Drawer
    'cart.title': 'Your Sacred Seva Bag',
    'cart.freeShippingUnlocked': '🎉 Congratulations! Free Express Delivery Unlocked!',
    'cart.addMoreForFreeShipping': 'Add ₹{amount} more for Free Delivery',
    'cart.couponPlaceholder': 'Coupon code (e.g. RADHE10)',
    'cart.apply': 'Apply',
    'cart.couponApplied': 'Coupon {code} applied (-₹{discount})',
    'cart.emptyTitle': 'Your cart is currently empty',
    'cart.emptyDesc': 'Select a beautiful poshak or shringar set for your Laddu Gopal Ji.',
    'cart.exploreBtn': 'Explore Collection',
    'cart.subtotal': 'Subtotal:',
    'cart.discount': 'Discount:',
    'cart.shipping': 'Shipping:',
    'cart.free': 'FREE',
    'cart.total': 'Total Amount:',
    'cart.checkout': 'Proceed to Checkout',
    'cart.guarantee': '100% Sacred Vrindavan Seva Guarantee',
    'cart.continueShopping': 'Continue Shopping',

    // Floating WhatsApp
    'whatsapp.online': 'Vrindavan Seva Center Online',
    'whatsapp.greeting': 'Radhe Radhe! 🙏 How may we assist your Laddu Gopal seva today?',
    'whatsapp.quick1': 'Help me find my Laddu Gopal size',
    'whatsapp.quick2': 'Will this be dispatched today?',
    'whatsapp.quick3': 'I want a custom poshak design',
    'whatsapp.tooltipTitle': 'Need Help?',
    'whatsapp.tooltipDesc': 'Chat with our Vrindavan Seva team directly on WhatsApp for sizing & orders.',
    'whatsapp.chatBtn': 'Chat on WhatsApp',
    'whatsapp.welcomeTitle': 'Radhe Radhe! 🙏',
    'whatsapp.welcomeDesc': 'We will gladly assist you in choosing the perfect poshak, crown, or size for your Laddu Gopal Ji.',
    'whatsapp.quickTitle': 'Quick Questions:',
    'whatsapp.placeholder': 'Type your message...',
    'whatsapp.prompt1': 'Radhe Radhe! I need help finding the right size for Laddu Gopal.',
    'whatsapp.prompt2': 'Radhe Radhe! Is Cash on Delivery (COD) available?',
    'whatsapp.prompt3': 'Radhe Radhe! I would like to check my order dispatch status.',

    // Product Detail Page
    'product.category': 'Category:',
    'product.inStock': '✓ In Stock',
    'product.off': 'OFF',
    'product.color': 'Color:',
    'product.size': 'Deity Size:',
    'product.sizeGuide': '📐 Size Guide',
    'product.allSizes': 'All Sizes',
    'product.quantity': 'Quantity:',
    'product.chatWhatsApp': 'Chat on WhatsApp',
    'product.addToCart': 'Add to Cart',
    'product.added': '✓ Added to Bag',
    'product.buyNow': 'Buy Now',
    'product.share': 'Share',
    'product.sku': 'SKU:',
    'product.categories': 'Categories:',
    'product.deliveryEstimate': 'Estimate delivery times: 3-5 days PAN India.',
    'product.returnPolicy': 'Return within 7 days of purchase. Free size exchange.',
    'product.safeCheckout': '100% Secure Checkout',
    'product.tabDescription': 'Description',
    'product.tabSpecs': 'Specifications',
    'product.tabReviews': 'Devotee Reviews',
    'product.relatedTitle': 'Related Products',

    // Size Guide Modal
    'sizeGuide.badge': 'Deity Sizing Guide',
    'sizeGuide.title': 'Laddu Gopal Ji Size Chart',
    'sizeGuide.height': 'Deity Height (Crown to Lotus Feet):',
    'sizeGuide.diameter': 'Dress Flare Diameter:',
  },

  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.shop': 'दुकान',
    'nav.contact': 'संपर्क करें',
    'nav.searchPlaceholder': 'शाही पोशाक, मुकुट, बांसुरी, सिंहासन खोजें...',
    'nav.popular': 'लोकप्रिय:',
    'nav.account': 'भक्त खाता',
    'nav.wishlist': 'इच्छा-सूची',
    'nav.cart': 'झोली',
    'nav.selectLanguage': 'भाषा चुनें',
    'nav.search': 'खोजें',

    // Hero Section
    'hero.badge': 'वृंदावन पावन हस्तशिल्प • 2026 संग्रह',
    'hero.titleLine1': 'श्री लाड़ले लाल',
    'hero.titleLine2': 'लड्डू गोपाल जी',
    'hero.titleLine3': 'का राजसी पावन श्रृंगार',
    'hero.subheading': 'वृंदावन के सिद्ध कारीगरों द्वारा शुद्ध रेशम, जरी एवं स्वर्ण कुंदन से हस्तनिर्मित पोशाकें, 24K गोल्ड-पॉलिश मुकुट, बांसुरी एवं सिंहासन (साइज 00 से 7+ तक)।',
    'hero.exploreBtn': 'राजसी संग्रह देखें',
    'hero.sizeGuideBtn': 'साइज गाइड (0 से 7+)',
    'hero.liveStream': '3D गलियारा • लाइव दर्शन',
    'hero.darshan': '🪶 पवित्र वृंदावन दर्शन',

    // Hero 4 Pillars
    'hero.pillar1Title': 'वृंदावन सिद्ध हस्तशिल्प',
    'hero.pillar1Desc': 'शुद्ध रेशम और जरदोजी जरी से ब्रज के कारीगरों द्वारा पूर्ण सेवा भाव से निर्मित।',
    'hero.pillar2Title': 'अखिल भारतीय निःशुल्क डिलीवरी',
    'hero.pillar2Desc': '₹999 से अधिक के ऑर्डर पर पूरे भारत में बीमा सहित निःशुल्क एक्सप्रेस डिलीवरी।',
    'hero.pillar3Title': '100% पवित्र सेवा पैकिंग',
    'hero.pillar3Desc': 'यमुना ब्रज रज और पावन तुलसी प्रसाद के साथ स्पर्श-मुक्त पवित्र सेवा पैकिंग।',
    'hero.pillar4Title': 'विग्रह साइज गारंटी',
    'hero.pillar4Desc': '7-दिवसीय आसान साइज एक्सचेंज, आपके लाड़ले लड्डू गोपाल के लिए सटीक माप सुनिश्चित।',

    // Catalog & Filters
    'catalog.all': 'सभी संग्रह',
    'catalog.poshak': 'शाही पोशाक संग्रह',
    'catalog.shringar': 'मुकुट व श्रृंगार',
    'catalog.singhasan': 'सिंहासन व झूला',
    'catalog.winter': 'सर्दियों की पोशाक',
    'catalog.seva': 'पूजा सामग्री व इत्र',
    'catalog.sizeFilter': 'लड्डू गोपाल साइज:',
    'catalog.allSizes': 'सभी साइज',
    'catalog.sort': 'क्रम:',
    'catalog.sortPopular': 'सबसे लोकप्रिय',
    'catalog.sortPriceLow': 'कीमत: कम से ज्यादा',
    'catalog.sortPriceHigh': 'कीमत: ज्यादा से कम',
    'catalog.sortRating': 'सर्वश्रेष्ठ रेटिंग 5★',
    'catalog.noProductsTitle': 'इस फ़िल्टर में कोई पोशाक नहीं मिली',
    'catalog.noProductsDesc': 'कृपया अन्य साइज चुनें या सभी वृंदावन संग्रह देखने के लिए फ़िल्टर हटाएं।',
    'catalog.resetFilters': 'फ़िल्टर रीसेट करें',

    // Product Card
    'card.off': 'छूट',
    'card.save': 'बचत',
    'card.size': 'साइज:',
    'card.allSizesText': 'सभी साइज',
    'card.qty': 'मात्रा:',
    'card.addToCart': 'झोली में जोड़ें',
    'card.added': '✓ झोली में जोड़ा गया',
    'card.askWhatsApp': 'WhatsApp पर पूछें',
    'card.whatsAppQuery': 'राधे राधे! मुझे "{name}" (No. {size}) के बारे में पूछना है। क्या यह उपलब्ध है?',
    'card.decrease': 'मात्रा कम करें',
    'card.increase': 'मात्रा बढ़ाएं',

    // Artisan Story Section
    'story.badge': 'वृंदावन सेवा परंपरा',
    'story.badgeTag': 'श्री धाम वृंदावन कारीगरी',
    'story.title': 'हर धागे में राधा नाम की पवित्र भक्ति',
    'story.p1': 'वृंदावन की पावन कुंज गलियों में पीढ़ियों से सिद्ध कारीगर प्रभु सेवा के भाव से वस्त्र तैयार कर रहे हैं। हमारे लिए यह केवल पोशाक नहीं, बल्कि ठाकुर जी के प्रति प्रेम और समर्पण का प्रतीक है।',
    'story.p2': 'प्रत्येक पोशाक को बनाने से पहले पवित्रता और स्वच्छता का विशेष ध्यान रखा जाता है। रेशम, ज़री और मोतियों का चयन केवल सर्वोत्तम गुणवत्ता का होता है।',
    'story.stat1': '100% शुद्ध रेशम व जरदोजी',
    'story.stat2': '40+ वर्ष की ब्रज हस्तशिल्प परंपरा',
    'story.stat3': '50,000+ संतुष्ट कृष्ण भक्त परिवार',

    // Devotee Reviews
    'reviews.badge': 'भक्तों का पावन प्रेम',
    'reviews.badgeFull': 'भक्तों के पावन अनुभव • 4.9/5 रेटिंग (1,400+ समीक्षाएं)',
    'reviews.title': 'भक्तों के पावन अनुभव',
    'reviews.subtitle': 'भारत और विश्वभर के कृष्ण भक्तों द्वारा साझा किए गए भावपूर्ण विचार',

    // Footer
    'footer.mantra': '🌸 हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे | हरे राम हरे राम राम राम हरे हरे 🌸',
    'footer.desc': 'BroCART — वृंदावन धाम से सीधे श्री कृष्ण एवं लड्डू गोपाल जी के भक्तों के लिए शुद्ध वस्त्र, जरदोजी पोशाक और पावन पूजा श्रृंगार का प्रामाणिक प्रतिष्ठान।',
    'footer.support': '+91 98765 43210 (सोम-शनि, सुबह 9 से रात 9)',
    'footer.collectionsTitle': 'संग्रह',
    'footer.shopBySizeTitle': 'साइज के अनुसार',
    'footer.promisesTitle': 'सेवा संकल्प',
    'footer.sizeCalculator': 'साइज कैलकुलेटर खोलें ↗',
    'footer.promise1': '100% स्पर्श-मुक्त पवित्र पैकिंग',
    'footer.promise2': '₹999 से ऊपर निःशुल्क डिलीवरी',
    'footer.promise3': '7-दिवसीय आसान साइज एक्सचेंज',
    'footer.copyright': '© 2026 BroCART Inc. वृंदावन धाम में प्रेमपूर्वक निर्मित।',

    // Cart Drawer
    'cart.title': 'आपकी पावन सेवा झोली',
    'cart.freeShippingUnlocked': '🎉 बधाई! मुफ्त एक्सप्रेस डिलीवरी अनलॉक हो गई!',
    'cart.addMoreForFreeShipping': 'मुफ्त डिलीवरी के लिए ₹{amount} का और सामान जोड़ें',
    'cart.couponPlaceholder': 'कूपन कोड (उदा. RADHE10)',
    'cart.apply': 'लागू करें',
    'cart.couponApplied': 'कूपन {code} लागू (-₹{discount})',
    'cart.emptyTitle': 'आपकी झोली अभी खाली है',
    'cart.emptyDesc': 'लड्डू गोपाल जी के लिए सुंदर पोशाक या श्रृंगार चुनें।',
    'cart.exploreBtn': 'पोशाक संग्रह देखें',
    'cart.subtotal': 'उप-योग:',
    'cart.discount': 'छूट:',
    'cart.shipping': 'डिलीवरी शुल्क:',
    'cart.free': 'मुफ्त',
    'cart.total': 'कुल देय राशि:',
    'cart.checkout': 'ऑर्डर पूरा करें',
    'cart.guarantee': '100% पवित्र वृंदावन सेवा गारंटी',
    'cart.continueShopping': 'और सामान जोड़ें',

    // Floating WhatsApp
    'whatsapp.online': 'वृंदावन सेवा केंद्र ऑनलाइन',
    'whatsapp.greeting': 'राधे राधे! 🙏 मैं आपकी क्या सेवा कर सकता हूँ?',
    'whatsapp.quick1': 'मुझे लड्डू गोपाल का साइज जानना है',
    'whatsapp.quick2': 'क्या आज ऑर्डर करने पर तुरंत डिस्पैच होगा?',
    'whatsapp.quick3': 'कस्टम पोशाक डिजाइन करवाना है',
    'whatsapp.tooltipTitle': 'राधे राधे! सहायता चाहिए?',
    'whatsapp.tooltipDesc': 'ठाकुर जी की पोशाक, नाप या ऑर्डर के लिए सीधे व्हाट्सएप पर बात करें।',
    'whatsapp.chatBtn': 'WhatsApp पर बात करें',
    'whatsapp.welcomeTitle': 'जय श्री कृष्णा! राधे राधे 🙏',
    'whatsapp.welcomeDesc': 'हम आपके लाडले गोपाल जी के लिए सही पोशाक, मुकुट या साइज चुनने में पूरी सहायता करेंगे।',
    'whatsapp.quickTitle': 'त्वरित प्रश्न:',
    'whatsapp.placeholder': 'अपना संदेश लिखें...',
    'whatsapp.prompt1': 'राधे राधे! मुझे लड्डू गोपाल जी की पोशाक का साइज पूछना है।',
    'whatsapp.prompt2': 'राधे राधे! क्या कैश ऑन डिलीवरी (COD) उपलब्ध है?',
    'whatsapp.prompt3': 'राधे राधे! मुझे अपने ऑर्डर का स्टेटस जानना है।',

    // Product Detail Page
    'product.category': 'श्रेणी:',
    'product.inStock': '✓ स्टॉक में उपलब्ध',
    'product.off': 'की छूट',
    'product.color': 'रंग:',
    'product.size': 'साइज़ / माप:',
    'product.sizeGuide': '📐 साइज चार्ट',
    'product.allSizes': 'सभी साइज',
    'product.quantity': 'मात्रा:',
    'product.chatWhatsApp': 'व्हाट्सएप सेवा',
    'product.addToCart': 'झोली में जोड़ें',
    'product.added': '✓ झोली में जोड़ा गया',
    'product.buyNow': 'अभी ऑर्डर करें',
    'product.share': 'शेयर करें',
    'product.sku': 'SKU:',
    'product.categories': 'श्रेणियां:',
    'product.deliveryEstimate': 'डिलीवरी अनुमान: पूरे भारत में 3-5 दिन।',
    'product.returnPolicy': 'खरीद के 7 दिनों के भीतर वापसी। मुफ्त साइज एक्सचेंज।',
    'product.safeCheckout': '100% सुरक्षित भुगतान',
    'product.tabDescription': 'उत्पाद विवरण',
    'product.tabSpecs': 'विशेषताएं',
    'product.tabReviews': 'भक्तों के अनुभव',
    'product.relatedTitle': 'संबंधित उत्पाद',

    // Size Guide Modal
    'sizeGuide.badge': 'ठाकुर जी माप निर्देशिका',
    'sizeGuide.title': 'लड्डू गोपाल जी साइज चार्ट',
    'sizeGuide.height': 'विग्रह ऊंचाई (मस्तक से चरण तक):',
    'sizeGuide.diameter': 'पोशाक घेरा व्यास:',
  },

  gu: {
    // Navigation
    'nav.home': 'હોમ',
    'nav.about': 'અમારા વિશે',
    'nav.shop': 'દુકાન',
    'nav.contact': 'સંપર્ક કરો',
    'nav.searchPlaceholder': 'શાહી પોશાક, મુકુટ, વાંસળી, સિંહાસન શોધો...',
    'nav.popular': 'લોકપ્રિય:',
    'nav.account': 'ભક્ત એકાઉન્ટ',
    'nav.wishlist': 'વિશલિસ્ટ',
    'nav.cart': 'ઝોળી',
    'nav.selectLanguage': 'ભાષા પસંદ કરો',
    'nav.search': 'શોધો',

    // Hero Section
    'hero.badge': 'વૃંદાવન પવિત્ર હસ્તકલા • 2026 સંગ્રહ',
    'hero.titleLine1': 'શ્રી લાડલા લાલ',
    'hero.titleLine2': 'લાડુ ગોપાલ જી',
    'hero.titleLine3': 'નો રાજસી દિવ્ય શૃંગાર',
    'hero.subheading': 'વૃંદાવનના સિદ્ધ કારીગરો દ્વારા શુદ્ધ રેશમ, ઝરી અને કુંદનથી નિર્મિત પોશાકો, 24K ગોલ્ડ-પોલિશ મુકુટ, વાંસળી અને સિંહાસન (સાઇઝ 00 થી 7+).',
    'hero.exploreBtn': 'રાજસી સંગ્રહ જુઓ',
    'hero.sizeGuideBtn': 'સાઇઝ ગાઇડ (0 થી 7+)',
    'hero.liveStream': '3D કોરિડોર • લાઇવ દર્શન',
    'hero.darshan': '🪶 પવિત્ર વૃંદાવન દર્શન',

    // Hero 4 Pillars
    'hero.pillar1Title': 'વૃંદાવન સિદ્ધ હસ્તકલા',
    'hero.pillar1Desc': 'શુદ્ધ રેશમ અને જરદોશી ઝરી સાથે બ્રજના કારીગરો દ્વારા સંપૂર્ણ સેવા ભાવથી નિર્મિત.',
    'hero.pillar2Title': 'સમગ્ર ભારતમાં ફ્રી ડિલિવરી',
    'hero.pillar2Desc': '₹999 થી વધુના ઓર્ડર પર ભારતભરમાં ઇન્સ્યોર્ડ એક્સપ્રેસ ડિલિવરી.',
    'hero.pillar3Title': '100% પવિત્ર સેવા પેકિંગ',
    'hero.pillar3Desc': 'યમુના બ્રજ રજ અને પવિત્ર તુલસી પ્રસાદ સાથે સ્પર્શ-મુક્ત પવિત્ર પેકિંગ.',
    'hero.pillar4Title': 'ઠાકોરજી સાઇઝ ગેરંટી',
    'hero.pillar4Desc': '7-દિવસનું સરળ સાઇઝ એક્સચેન્જ, આપના લાલા માટે યોગ્ય માપ.',

    // Catalog & Filters
    'catalog.all': 'બધા સંગ્રહ',
    'catalog.poshak': 'શાહી પોશાક સંગ્રહ',
    'catalog.shringar': 'મુકુટ અને શૃંગાર',
    'catalog.singhasan': 'સિંહાસન અને હિંડોળા',
    'catalog.winter': 'શિયાળુ મખમલ પોશાક',
    'catalog.seva': 'પૂજા સામગ્રી અને અત્તર',
    'catalog.sizeFilter': 'લાડુ ગોપાલ સાઇઝ:',
    'catalog.allSizes': 'બધી સાઇઝ',
    'catalog.sort': 'ક્રમ:',
    'catalog.sortPopular': 'સૌથી લોકપ્રિય',
    'catalog.sortPriceLow': 'કિંમત: ઓછી થી વધુ',
    'catalog.sortPriceHigh': 'કિંમત: વધુ થી ઓછી',
    'catalog.sortRating': 'શ્રેષ્ઠ રેટિંગ 5★',
    'catalog.noProductsTitle': 'આ ફિલ્ટરમાં કોઈ પોશાક મળ્યા નથી',
    'catalog.noProductsDesc': 'કૃપા કરીને અન્ય સાઇઝ પસંદ કરો અથવા બધા સંગ્રહ જોવા માટે ફિલ્ટર હટાવો.',
    'catalog.resetFilters': 'ફિલ્ટર રીસેટ કરો',

    // Product Card
    'card.off': 'છૂટ',
    'card.save': 'બચત',
    'card.size': 'સાઇઝ:',
    'card.allSizesText': 'બધી સાઇઝ',
    'card.qty': 'જથ્થો:',
    'card.addToCart': 'ઝોળીમાં ઉમેરો',
    'card.added': '✓ ઉમેરાઈ ગયું',
    'card.askWhatsApp': 'WhatsApp પર પૂછો',
    'card.whatsAppQuery': 'રાધે રાધે! મને "{name}" (No. {size}) વિશે માહિતી જોઈએ છે. શું આ ઉપલબ્ધ છે?',
    'card.decrease': 'જથ્થો ઘટાડો',
    'card.increase': 'જથ્થો વધારો',

    // Artisan Story Section
    'story.badge': 'વૃંદાવન સેવા પરંપરા',
    'story.badgeTag': 'શ્રી ધામ વૃંદાવન કારીગરી',
    'story.title': 'દરેક તાંતણામાં રાધા નામની પવિત્ર ભક્તિ',
    'story.p1': 'વૃંદાવનની પવિત્ર કુંજ ગલીઓમાં પેઢીઓથી કારીગરો ઠાકોરજીની સેવાના ભાવથી વસ્ત્રો તૈયાર કરી રહ્યા છે.',
    'story.p2': 'દરેક પોશાક બનાવતી વખતે પવિત્રતા અને શુદ્ધતાનું વિશેષ ધ્યાન રાખવામાં આવે છે.',
    'story.stat1': '100% શુદ્ધ રેશમ અને જરદોશી',
    'story.stat2': '40+ વર્ષની બ્રજ હસ્તકલા પરંપરા',
    'story.stat3': '50,000+ સંતુષ્ટ કૃષ્ણ ભક્ત પરિવારો',

    // Devotee Reviews
    'reviews.badge': 'ભક્તોનો પવિત્ર પ્રેમ',
    'reviews.badgeFull': 'ભક્તોના પાવન અનુભવ • 4.9/5 રેટિંગ',
    'reviews.title': 'ભક્તોના પાવન અનુભવો',
    'reviews.subtitle': 'ભારત અને વિશ્વભરના કૃષ્ણ ભક્તો દ્વારા વ્યક્ત કરાયેલા પ્રેમભાવ',

    // Footer
    'footer.mantra': '🌸 હરે કૃષ્ણ હરે કૃષ્ણ કૃષ્ણ કૃષ્ણ હરે હરે | હરે રામ હરે રામ રામ રામ હરે હરે 🌸',
    'footer.desc': 'BroCART — વૃંદાવન ધામથી સીધા શ્રી કૃષ્ણ અને લાડુ ગોપાલજીના ભક્તો માટે શુદ્ધ વસ્ત્રો અને પૂજા શૃંગારનું પવિત્ર સ્થાન.',
    'footer.support': '+91 98765 43210 (સોમ-શનિ, સવારે 9 થી રાત્રે 9)',
    'footer.collectionsTitle': 'સંગ્રહ',
    'footer.shopBySizeTitle': 'સાઇઝ મુજબ',
    'footer.promisesTitle': 'સેવા સંકલ્પ',
    'footer.sizeCalculator': 'સાઇઝ કેલ્ક્યુલેટર ખોલો ↗',
    'footer.promise1': '100% પવિત્ર અસ્પૃશ્ય પેકિંગ',
    'footer.promise2': '₹999 ઉપર મફત ડિલિવરી',
    'footer.promise3': '7-દિવસનું સરળ સાઇઝ એક્સચેન્જ',
    'footer.copyright': '© 2026 BroCART Inc. વૃંદાવન ધામમાં ભક્તિભાવપૂર્વક નિર્મિત.',

    // Cart Drawer
    'cart.title': 'આપની પવિત્ર સેવા ઝોળી',
    'cart.freeShippingUnlocked': '🎉 અભિનંદન! મફત એક્સપ્રેસ ડિલિવરી અનલોક થઈ ગઈ!',
    'cart.addMoreForFreeShipping': 'મફત ડિલિવરી માટે ₹{amount} વધુ ઉમેરો',
    'cart.couponPlaceholder': 'કૂપન કોડ (દા.ત. RADHE10)',
    'cart.apply': 'લાગુ કરો',
    'cart.couponApplied': 'કૂપન {code} લાગુ (-₹{discount})',
    'cart.emptyTitle': 'ઝોળી અત્યારે ખાલી છે',
    'cart.emptyDesc': 'લાડુ ગોપાલજી માટે સુંદર પોશાક અથવા શૃંગાર પસંદ કરો.',
    'cart.exploreBtn': 'પોશાક સંગ્રહ જુઓ',
    'cart.subtotal': 'પેટા-કુલ:',
    'cart.discount': 'ડિસ્કાઉન્ટ:',
    'cart.shipping': 'શિપિંગ ચાર્જ:',
    'cart.free': 'મફત',
    'cart.total': 'કુલ રકમ:',
    'cart.checkout': 'ઓર્ડર પૂર્ણ કરો',
    'cart.guarantee': '100% પવિત્ર વૃંદાવન સેવા ગેરંટી',
    'cart.continueShopping': 'વધુ ખરીદી કરો',

    // Floating WhatsApp
    'whatsapp.online': 'વૃંદાવન સેવા કેન્દ્ર ઓનલાઇન',
    'whatsapp.greeting': 'રાધે રાધે! 🙏 અમે તમારી શું સેવા કરી શકીએ?',
    'whatsapp.quick1': 'મને લાડુ ગોપાલની સાઇઝ જાણવી છે',
    'whatsapp.quick2': 'આજે ઓર્ડર કરીએ તો ડિસ્પેચ ક્યારે થશે?',
    'whatsapp.quick3': 'કસ્ટમ પોશાક ડિઝાઇન કરાવવી છે',
    'whatsapp.tooltipTitle': 'મદદ જોઈએ છે?',
    'whatsapp.tooltipDesc': 'ઠાકોરજીના પોશાક, સાઇઝ અથવા ઓર્ડર માટે સીધા WhatsApp પર વાત કરો.',
    'whatsapp.chatBtn': 'WhatsApp પર વાત કરો',
    'whatsapp.welcomeTitle': 'જય શ્રી કૃષ્ણ! રાધે રાધે 🙏',
    'whatsapp.welcomeDesc': 'અમે આપના લાલા માટે શ્રેષ્ઠ પોશાક, મુકુટ અથવા સાઇઝ પસંદ કરવામાં સંપૂર્ણ મદદ કરીશું.',
    'whatsapp.quickTitle': 'ઝડપી પ્રશ્નો:',
    'whatsapp.placeholder': 'તમારો સંદેશ લખો...',
    'whatsapp.prompt1': 'રાધે રાધે! મને લાડુ ગોપાલની સાઇઝ જાણવી છે.',
    'whatsapp.prompt2': 'રાધે રાધે! શું કેશ ઓન ડિલિવરી (COD) ઉપલબ્ધ છે?',
    'whatsapp.prompt3': 'રાધે રાધે! મને ઓર્ડર સ્ટેટસ જાણવું છે.',

    // Product Detail Page
    'product.category': 'શ્રેણી:',
    'product.inStock': '✓ સ્ટોકમાં ઉપલબ્ધ',
    'product.off': 'છૂટ',
    'product.color': 'રંગ:',
    'product.size': 'સાઇઝ / માપ:',
    'product.sizeGuide': '📐 સાઇઝ ગાઇડ',
    'product.allSizes': 'બધી સાઇઝ',
    'product.quantity': 'જથ્થો:',
    'product.chatWhatsApp': 'WhatsApp પર વાત કરો',
    'product.addToCart': 'ઝોળીમાં ઉમેરો',
    'product.added': '✓ ઉમેરાઈ ગયું',
    'product.buyNow': 'ઓર્ડર કરો',
    'product.share': 'શેર કરો',
    'product.sku': 'SKU:',
    'product.categories': 'શ્રેણીઓ:',
    'product.deliveryEstimate': 'અંદાજિત ડિલિવરી સમય: સમગ્ર ભારતમાં 3-5 દિવસ.',
    'product.returnPolicy': 'ખરીદીના 7 દિવસમાં પરત. મફત સાઇઝ એક્સચેન્જ.',
    'product.safeCheckout': '100% સુરક્ષિત ચુકવણી',
    'product.tabDescription': 'વિગતવાર વર્ણન',
    'product.tabSpecs': 'વિશેષતાઓ',
    'product.tabReviews': 'ભક્તોના અનુભવો',
    'product.relatedTitle': 'સંબંધિત ઉત્પાદનો',

    // Size Guide Modal
    'sizeGuide.badge': 'ઠાકોરજી સાઇઝ ગાઇડ',
    'sizeGuide.title': 'લાડુ ગોપાલજી સાઇઝ ચાર્ટ',
    'sizeGuide.height': 'વિગ્રહ ઊંચાઈ (મસ્તક થી ચરણ):',
    'sizeGuide.diameter': 'પોશાક ઘેર વ્યાસ:',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('brocart_language') as LanguageCode;
      if (saved && (saved === 'hi' || saved === 'en' || saved === 'gu')) {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = 'en';
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('brocart_language', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let translation = (langDict as Record<string, string>)[key] || (TRANSLATIONS.en as Record<string, string>)[key] || key;

    if (params) {
      Object.entries(params).forEach(([pKey, pVal]) => {
        translation = translation.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      });
    }

    return translation;
  };

  const currentLanguageOption =
    SUPPORTED_LANGUAGES.find((item) => item.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageOption,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
