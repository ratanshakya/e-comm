import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  inquiryId: string;
  name: string;
  phone: string;
  deitySize: string;
  inquiryType: string;
  message: string;
  status: 'new' | 'replied' | 'closed';
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    inquiryId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    deitySize: { type: String, default: '1' },
    inquiryType: { type: String, default: 'General Inquiry' },
    message: { type: String, default: '' },
    status: { type: String, enum: ['new', 'replied', 'closed'], default: 'new' }
  },
  { timestamps: true }
);

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
