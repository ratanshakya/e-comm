import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('firstName');

    if (user) {
      return NextResponse.json({ exists: true, firstName: user.firstName || '' });
    }
    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('check-email error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
