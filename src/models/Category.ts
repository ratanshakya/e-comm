import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  categoryId: string;
  label: string;
  hindiLabel?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>(
  {
    categoryId: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    hindiLabel: { type: String, default: '' },
    icon: { type: String, default: 'Sparkles' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
