import { Order } from '@/types';

declare global {
  // eslint-disable-next-line no-var
  var memoryOrdersStore: Order[] | undefined;
}

if (!global.memoryOrdersStore) {
  // Prepopulate with a couple realistic sample devotional orders for immediate preview
  global.memoryOrdersStore = [
    {
      id: 'KANHA-948210',
      customer: {
        fullName: 'Radhika Sharma',
        email: 'radhika.seva@gmail.com',
        phone: '9876543210',
        address: 'B-402, Radhe Krishna Residency, Near Prem Mandir Road',
        city: 'Vrindavan / Mathura',
        state: 'Uttar Pradesh',
        pincode: '281121',
        specialNote: 'Please pack with fragrant Tulsi leaves and extra holy itra.'
      },
      items: [
        {
          productId: 'zardozi-royal-crimson-peacock',
          productName: 'Royal Zardozi Crimson & Emerald Peacock Poshak Set',
          size: '3',
          price: 1899,
          quantity: 1,
          image: '/images/poshak_royal_zardozi.jpg'
        },
        {
          productId: 'kundan-mor-mukut-shringar-set',
          productName: 'Shree Krishna Kundan Mor Mukut & Carved Bansuri Shringar Set',
          size: '3',
          price: 1249,
          quantity: 1,
          image: '/images/shringar_mukut_bansuri.jpg'
        }
      ],
      subtotal: 3148,
      discount: 315,
      shipping: 0,
      total: 2833,
      paymentMethod: 'upi',
      status: 'confirmed',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'KANHA-812304',
      customer: {
        fullName: 'Amitabh Verma',
        email: 'amitabh.verma@yahoo.com',
        phone: '9123456780',
        address: 'House 14, Shanti Nagar, Mansarovar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302020',
        specialNote: 'Dressing for Janmashtami temple darshan.'
      },
      items: [
        {
          productId: 'thakurji-swarna-singhasan-3d',
          productName: 'Devotional Swarna Mayur Singhasan (Royal Throne)',
          size: '4',
          price: 2899,
          quantity: 1,
          image: '/images/hero_laddu_gopal_3d.jpg'
        }
      ],
      subtotal: 2899,
      discount: 0,
      shipping: 0,
      total: 2899,
      paymentMethod: 'cod',
      status: 'processing',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ];
}

export const getMemoryOrders = (): Order[] => {
  if (!global.memoryOrdersStore) {
    global.memoryOrdersStore = [];
  }
  return global.memoryOrdersStore;
};

export const addMemoryOrder = (order: Order) => {
  const current = getMemoryOrders();
  global.memoryOrdersStore = [order, ...current];
  return order;
};

export const updateMemoryOrderStatus = (orderId: string, status: 'confirmed' | 'processing' | 'shipped') => {
  const current = getMemoryOrders();
  const order = current.find((o) => o.id === orderId);
  if (order) {
    order.status = status;
    global.memoryOrdersStore = [...current];
    return order;
  }
  return null;
};

export const deleteMemoryOrder = (orderId: string) => {
  const current = getMemoryOrders();
  global.memoryOrdersStore = current.filter((o) => o.id !== orderId);
  return true;
};
