export interface Product {
  id: string;
  name: string;
  hindiName: string;
  category: 'poshak' | 'shringar' | 'singhasan-jhula' | 'seva-samagri' | 'winter-special';
  categoryLabel: string;
  price: number;
  originalPrice: number;
  sizes: string[]; // e.g. ["00", "0", "1", "2", "3", "4", "5", "6"]
  description: string;
  fabric: string;
  color: string;
  inclusions: string[]; // e.g. ["Poshak (Choli + Lehenga)", "Matching Mor Mukut", "Patka (Waist Stole)", "Bajuband"]
  images: string[];
  badge?: string; // e.g. "Best Seller", "Janmashtami Special", "Vrindavan Pure Silk"
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  occasion: string[]; // ["Daily Seva", "Janmashtami", "Radhashtami", "Diwali", "Holi"]
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  specialNote?: string;
}

export interface Order {
  id: string;
  userId?: string;
  customer: OrderCustomer;
  items: {
    productId: string;
    productName: string;
    size: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'upi' | 'card' | 'online';
  status: 'confirmed' | 'processing' | 'shipped';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  upiTransactionId?: string;
  createdAt: string;
}

export interface SizeChartInfo {
  size: string;
  deityHeightInches: string;
  dressDiameterInches: string;
  bestFor: string;
  description: string;
}
