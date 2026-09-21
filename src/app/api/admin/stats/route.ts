import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import OrderModel from '@/models/Order';
import InquiryModel from '@/models/Inquiry';
import { getMemoryProducts } from '@/lib/productsStore';
import { getMemoryOrders } from '@/lib/ordersStore';
import { getMemoryInquiries } from '@/lib/inquiriesStore';

export async function GET() {
  const { isConnected } = await connectToDatabase();

  let products = getMemoryProducts();
  let orders = getMemoryOrders();
  let inquiries = getMemoryInquiries();

  if (isConnected) {
    try {
      const dbProducts = await ProductModel.find({}).lean();
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map((p) => ({
          id: p.productId,
          name: p.name,
          hindiName: p.hindiName,
          category: p.category,
          categoryLabel: p.categoryLabel,
          price: p.price,
          originalPrice: p.originalPrice,
          sizes: p.sizes,
          description: p.description,
          fabric: p.fabric,
          color: p.color,
          inclusions: p.inclusions,
          images: p.images,
          badge: p.badge,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          inStock: p.inStock,
          occasion: p.occasion,
          featured: p.featured
        }));
      }

      const dbOrders = await OrderModel.find({}).sort({ createdAt: -1 }).lean();
      if (dbOrders && dbOrders.length > 0) {
        orders = dbOrders.map((o) => ({
          id: o.orderId,
          customer: o.customer,
          items: o.items,
          subtotal: o.subtotal,
          discount: o.discount,
          shipping: o.shipping,
          total: o.total,
          paymentMethod: o.paymentMethod,
          status: o.status,
          createdAt: o.createdAt || new Date().toISOString()
        }));
      }

      const dbInquiries = await InquiryModel.find({}).sort({ createdAt: -1 }).lean();
      if (dbInquiries && dbInquiries.length > 0) {
        inquiries = dbInquiries.map((inq) => ({
          id: inq.inquiryId,
          inquiryId: inq.inquiryId,
          name: inq.name,
          phone: inq.phone,
          deitySize: inq.deitySize,
          inquiryType: inq.inquiryType,
          message: inq.message,
          status: inq.status,
          createdAt: inq.createdAt ? inq.createdAt.toISOString() : new Date().toISOString()
        }));
      }
    } catch (err) {
      console.warn('DB stats aggregation error:', err);
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;
  const processingOrders = orders.filter((o) => o.status === 'processing').length;
  const shippedOrders = orders.filter((o) => o.status === 'shipped').length;

  const totalProducts = products.length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;
  const inStockCount = totalProducts - outOfStockCount;

  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;

  return NextResponse.json({
    success: true,
    data: {
      isMongoConnected: isConnected,
      totalRevenue,
      totalOrders,
      confirmedOrders,
      processingOrders,
      shippedOrders,
      totalProducts,
      inStockCount,
      outOfStockCount,
      totalInquiries,
      newInquiries,
      recentOrders: orders.slice(0, 5)
    }
  });
}
