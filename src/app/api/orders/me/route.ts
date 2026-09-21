import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      // Find orders matching this user's ID or email
      const emailRegex = new RegExp(`^${payload.email}$`, 'i');
      
      // Auto-link any orders with this email that don't have userId yet
      try {
        await OrderModel.updateMany(
          { 
            $or: [{ userId: { $exists: false } }, { userId: null }, { userId: '' }],
            'customer.email': { $regex: emailRegex } 
          },
          { $set: { userId: payload.userId } }
        );
      } catch (linkErr) {
        console.warn('Auto-link orders warning:', linkErr);
      }

      const dbOrders = await OrderModel.find({
        $or: [
          { userId: payload.userId },
          { 'customer.email': { $regex: emailRegex } }
        ]
      }).sort({ createdAt: -1 }).lean();
      
      const formatted = dbOrders.map((o) => ({
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
      return NextResponse.json({ success: true, data: formatted });
      
    } catch (err) {
      console.warn('DB error fetching user orders:', err);
      return NextResponse.json({ success: false, message: 'Failed to fetch orders' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: false, data: [] });
}
