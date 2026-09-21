import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import InquiryModel from '@/models/Inquiry';
import { getMemoryInquiries, addMemoryInquiry, InquiryData } from '@/lib/inquiriesStore';

export async function GET() {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const dbInquiries = await InquiryModel.find({}).sort({ createdAt: -1 }).lean();
      if (dbInquiries && dbInquiries.length > 0) {
        const formatted = dbInquiries.map((inq) => ({
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
        return NextResponse.json({ success: true, data: formatted });
      }
    } catch (err) {
      console.warn('DB error fetching inquiries:', err);
    }
  }

  return NextResponse.json({ success: true, data: getMemoryInquiries() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, deitySize, inquiryType, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const inqId = `INQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInquiry: InquiryData = {
      id: inqId,
      inquiryId: inqId,
      name,
      phone,
      deitySize: deitySize || '1',
      inquiryType: inquiryType || 'General Inquiry',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      try {
        await InquiryModel.create({
          inquiryId: inqId,
          name,
          phone,
          deitySize: deitySize || '1',
          inquiryType: inquiryType || 'General Inquiry',
          message: message || '',
          status: 'new'
        });
      } catch (dbErr) {
        console.warn('Failed saving inquiry to DB, caching in memory:', dbErr);
        addMemoryInquiry(newInquiry);
      }
    } else {
      addMemoryInquiry(newInquiry);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. Our seva team will reach out soon!',
      data: newInquiry
    });
  } catch (err) {
    console.error('Error creating inquiry:', err);
    return NextResponse.json(
      { success: false, message: 'Could not submit inquiry' },
      { status: 500 }
    );
  }
}
