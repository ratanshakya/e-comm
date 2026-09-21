import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { firstName, lastName, phone, address, city, state, pincode, currentPassword, newPassword } = body;

    await connectToDatabase();
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Password change check
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to set a new password' }, { status: 400 });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password || '');
      if (!isMatch) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (pincode !== undefined) user.pincode = pincode;

    // Also update shipping and billing addresses
    user.shippingAddress = {
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.shippingAddress?.fullName || '',
      phone: user.phone || user.shippingAddress?.phone || '',
      address: user.address || user.shippingAddress?.address || '',
      city: user.city || user.shippingAddress?.city || '',
      state: user.state || user.shippingAddress?.state || '',
      pincode: user.pincode || user.shippingAddress?.pincode || '',
    };

    user.billingAddress = {
      ...user.shippingAddress
    };

    await user.save();

    return NextResponse.json({
      success: true,
      message: 'Profile and addresses updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
      }
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
