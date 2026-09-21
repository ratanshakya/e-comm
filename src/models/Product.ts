import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '@/types';

export interface IProductDocument extends Omit<Product, 'id'>, Document {
  productId: string;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    productId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    hindiName: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['poshak', 'shringar', 'singhasan-jhula', 'seva-samagri', 'winter-special']
    },
    categoryLabel: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    sizes: [{ type: String }],
    description: { type: String, required: true },
    fabric: { type: String, required: true },
    color: { type: String, required: true },
    inclusions: [{ type: String }],
    images: [{ type: String }],
    badge: { type: String },
    rating: { type: Number, default: 5.0 },
    reviewsCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    occasion: [{ type: String }],
    featured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProductDocument>('Product', ProductSchema);
