import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import InquiryModel from '@/models/Inquiry';
import { updateMemoryInquiryStatus, deleteMemoryInquiry } from '@/lib/inquiriesStore';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['new', 'replied', 'closed'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Valid status is required (new, replied, closed)' },
        { status: 400 }
      );
    }

    const { isConnected } = await connectToDatabase();
    let updatedInquiry = null;

    if (isConnected) {
      try {
        const dbUpdated = await InquiryModel.findOneAndUpdate(
          { inquiryId: id },
          { $set: { status } },
          { new: true }
        ).lean();

        if (dbUpdated) {
          updatedInquiry = {
            id: dbUpdated.inquiryId,
            inquiryId: dbUpdated.inquiryId,
            name: dbUpdated.name,
            phone: dbUpdated.phone,
            deitySize: dbUpdated.deitySize,
            inquiryType: dbUpdated.inquiryType,
            message: dbUpdated.message,
            status: dbUpdated.status,
            createdAt: dbUpdated.createdAt
          };
        }
      } catch (err) {
        console.warn('DB error updating inquiry status:', err);
      }
    }

    const memUpdated = updateMemoryInquiryStatus(id, status);
    if (!updatedInquiry) {
      updatedInquiry = memUpdated;
    }

    return NextResponse.json({
      success: true,
      message: `Inquiry status updated to ${status}`,
      data: updatedInquiry
    });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    return NextResponse.json(
      { success: false, message: 'Could not update inquiry status' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      try {
        await InquiryModel.deleteOne({ inquiryId: id });
      } catch (err) {
        console.warn('DB error deleting inquiry:', err);
      }
    }

    deleteMemoryInquiry(id);

    return NextResponse.json({
      success: true,
      message: 'Inquiry deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting inquiry:', err);
    return NextResponse.json(
      { success: false, message: 'Could not delete inquiry' },
      { status: 500 }
    );
  }
}
