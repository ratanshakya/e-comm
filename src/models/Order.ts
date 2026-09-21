import mongoose, { Schema, Document } from 'mongoose';
import { Order } from '@/types';

export interface IOrderDocument extends Omit<Order, 'id'>, Document {
  orderId: string;
}

const OrderItemSchema = new Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true }
});

const OrderCustomerSchema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  specialNote: { type: String }
});

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: false }, // Link to User._id
    customer: { type: OrderCustomerSchema, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'upi', 'card', 'online'], required: true },
    status: { type: String, enum: ['confirmed', 'processing', 'shipped'], default: 'confirmed' },
    razorpayPaymentId: { type: String, required: false },
    razorpayOrderId: { type: String, required: false },
    razorpaySignature: { type: String, required: false },
    upiTransactionId: { type: String, required: false }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrderDocument>('Order', OrderSchema);
