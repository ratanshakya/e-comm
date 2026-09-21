import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { getMemoryOrders, addMemoryOrder } from '@/lib/ordersStore';
import { Order } from '@/types';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import crypto from 'crypto';
import SiteSettings from '@/models/SiteSettings';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { userId, customer, items, subtotal, discount, shipping, total, paymentMethod, razorpay_payment_id, razorpay_order_id, razorpay_signature, upiTransactionId } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid order payload' },
        { status: 400 }
      );
    }

    // If userId was not passed in body, try to extract from auth_token cookie
    if (!userId) {
      try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        if (token) {
          const payload = await verifyToken(token);
          if (payload?.userId) {
            userId = payload.userId;
          }
        }
      } catch (authErr) {
        console.warn('Could not extract user from token:', authErr);
      }
    }

    const orderId = `KANHA-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order & { userId?: string } = {
      id: orderId,
      userId: userId || undefined,
      customer,
      items,
      subtotal,
      discount: discount || 0,
      shipping: shipping || 0,
      total,
      paymentMethod,
      status: 'confirmed',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      upiTransactionId,
      createdAt: new Date().toISOString()
    };

    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      if (paymentMethod === 'online' && razorpay_payment_id && razorpay_order_id && razorpay_signature) {
        const settings = await SiteSettings.findOne();
        if (!settings || !settings.razorpayKeySecret) {
          return NextResponse.json({ success: false, message: 'Payment gateway configuration missing' }, { status: 500 });
        }
        const hmac = crypto.createHmac('sha256', settings.razorpayKeySecret);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generatedSignature = hmac.digest('hex');
        if (generatedSignature !== razorpay_signature) {
          return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
        }
      }

      try {
        await OrderModel.create({
          orderId,
          userId: userId || undefined,
          customer,
          items,
          subtotal,
          discount: discount || 0,
          shipping: shipping || 0,
          total,
          paymentMethod,
          status: 'confirmed',
          razorpayPaymentId: razorpay_payment_id || undefined,
          razorpayOrderId: razorpay_order_id || undefined,
          razorpaySignature: razorpay_signature || undefined,
          upiTransactionId: upiTransactionId || undefined
        });

        // Also update User profile address and phone
        if (userId) {
          try {
            const User = (await import('@/models/User')).default;
            await User.findByIdAndUpdate(userId, {
              $set: {
                phone: customer.phone,
                address: customer.address,
                city: customer.city,
                state: customer.state,
                pincode: customer.pincode,
                shippingAddress: {
                  fullName: customer.fullName,
                  phone: customer.phone,
                  address: customer.address,
                  city: customer.city,
                  state: customer.state,
                  pincode: customer.pincode,
                },
                billingAddress: {
                  fullName: customer.fullName,
                  phone: customer.phone,
                  address: customer.address,
                  city: customer.city,
                  state: customer.state,
                  pincode: customer.pincode,
                }
              }
            });
          } catch (userUpErr) {
            console.warn('Could not update user address from order:', userUpErr);
          }
        }
      } catch (dbErr) {
        console.warn('Failed saving order to MongoDB, caching in memory:', dbErr);
        addMemoryOrder(newOrder);
      }
    } else {
      addMemoryOrder(newOrder);
    }

    return NextResponse.json({
      success: true,
      message: 'Radhe Radhe! Your order has been placed with divine blessings.',
      data: newOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not process order' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const dbOrders = await OrderModel.find({}).sort({ createdAt: -1 }).limit(50).lean();
      if (dbOrders && dbOrders.length > 0) {
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
      }
    } catch (err) {
      console.warn('DB error fetching orders:', err);
    }
  }

  return NextResponse.json({ success: true, data: getMemoryOrders() });
}
