import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  billingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

const AddressSubSchema = new Schema(
  {
    fullName: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String }, // Optional because of Google Sign In or guest checkout
    firstName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    billingAddress: { type: AddressSubSchema },
    shippingAddress: { type: AddressSubSchema },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
