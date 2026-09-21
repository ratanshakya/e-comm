import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import SiteSettings from '@/models/SiteSettings';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR' } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    await connectToDatabase();
    const settings = await SiteSettings.findOne();

    if (!settings || !settings.isRazorpayEnabled || !settings.razorpayKeyId || !settings.razorpayKeySecret) {
      return NextResponse.json({ error: 'Razorpay payment gateway is not configured or disabled' }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: settings.razorpayKeyId,
      key_secret: settings.razorpayKeySecret,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
      currency,
      receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: settings.razorpayKeyId, // Sending key to frontend for initialization
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: error.message || 'Failed to create payment order' }, { status: 500 });
  }
}
