import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  try {
    const { isConnected } = await connectToDatabase();
    if (!isConnected) {
      return NextResponse.json({ success: false, message: 'Database not connected' }, { status: 500 });
    }

    const users = await User.find({}).sort({ createdAt: -1 }).select('-password').lean();
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }
}
