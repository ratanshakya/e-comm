import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { PRODUCTS } from '@/data/products';

export async function POST() {
  const { isConnected } = await connectToDatabase();

  if (!isConnected) {
    return NextResponse.json({
      success: false,
      message: 'MongoDB is not connected. Please provide MONGODB_URI in your .env.local file.'
    }, { status: 503 });
  }

  try {
    for (const prod of PRODUCTS) {
      await ProductModel.findOneAndUpdate(
        { productId: prod.id },
        {
          productId: prod.id,
          name: prod.name,
          hindiName: prod.hindiName,
          category: prod.category,
          categoryLabel: prod.categoryLabel,
          price: prod.price,
          originalPrice: prod.originalPrice,
          sizes: prod.sizes,
          description: prod.description,
          fabric: prod.fabric,
          color: prod.color,
          inclusions: prod.inclusions,
          images: prod.images,
          badge: prod.badge,
          rating: prod.rating,
          reviewsCount: prod.reviewsCount,
          inStock: prod.inStock,
          occasion: prod.occasion,
          featured: prod.featured
        },
        { upsert: true, new: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${PRODUCTS.length} divine products into MongoDB.`
    });
  } catch (err) {
    console.error('Seeding error:', err);
    return NextResponse.json({
      success: false,
      error: String(err)
    }, { status: 500 });
  }
}
