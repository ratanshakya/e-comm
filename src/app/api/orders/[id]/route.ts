import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import OrderModel from '@/models/Order';
import { getMemoryOrders, updateMemoryOrderStatus, deleteMemoryOrder } from '@/lib/ordersStore';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !['confirmed', 'processing', 'shipped'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Valid status is required (confirmed, processing, shipped)' },
        { status: 400 }
      );
    }

    const { isConnected } = await connectToDatabase();
    let updatedOrder = null;

    if (isConnected) {
      try {
        const dbUpdated = await OrderModel.findOneAndUpdate(
          { orderId: id },
          { $set: { status } },
          { new: true }
        ).lean();

        if (dbUpdated) {
          updatedOrder = {
            id: dbUpdated.orderId,
            customer: dbUpdated.customer,
            items: dbUpdated.items,
            subtotal: dbUpdated.subtotal,
            discount: dbUpdated.discount,
            shipping: dbUpdated.shipping,
            total: dbUpdated.total,
            paymentMethod: dbUpdated.paymentMethod,
            status: dbUpdated.status,
            createdAt: dbUpdated.createdAt
          };
        }
      } catch (err) {
        console.warn('DB error updating order status:', err);
      }
    }

    const memUpdated = updateMemoryOrderStatus(id, status);
    if (!updatedOrder) {
      updatedOrder = memUpdated;
    }

    if (!updatedOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: updatedOrder
    });
  } catch (err) {
    console.error('Error updating order:', err);
    return NextResponse.json(
      { success: false, message: 'Could not update order status' },
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
        await OrderModel.deleteOne({ orderId: id });
      } catch (err) {
        console.warn('DB error deleting order:', err);
      }
    }

    deleteMemoryOrder(id);

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting order:', err);
    return NextResponse.json(
      { success: false, message: 'Could not delete order' },
      { status: 500 }
    );
  }
}
