import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { getMemoryProducts, updateMemoryProduct, deleteMemoryProduct } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      const dbProduct = await ProductModel.findOne({ productId: id }).lean();
      if (dbProduct) {
        return NextResponse.json({
          success: true,
          data: {
            id: dbProduct.productId,
            name: dbProduct.name,
            hindiName: dbProduct.hindiName,
            category: dbProduct.category,
            categoryLabel: dbProduct.categoryLabel,
            price: dbProduct.price,
            originalPrice: dbProduct.originalPrice,
            sizes: dbProduct.sizes,
            description: dbProduct.description,
            fabric: dbProduct.fabric,
            color: dbProduct.color,
            inclusions: dbProduct.inclusions,
            images: dbProduct.images,
            badge: dbProduct.badge,
            rating: dbProduct.rating,
            reviewsCount: dbProduct.reviewsCount,
            inStock: dbProduct.inStock,
            occasion: dbProduct.occasion,
            featured: dbProduct.featured
          }
        });
      }
    } catch (err) {
      console.warn('DB error fetching product by ID:', err);
    }
  }

  const memoryProd = getMemoryProducts().find((p) => p.id === id);
  if (memoryProd) {
    return NextResponse.json({ success: true, data: memoryProd });
  }

  return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { isConnected } = await connectToDatabase();
    let updatedProduct = null;

    if (isConnected) {
      try {
        const updateData: Record<string, any> = { ...body };
        delete updateData.id;
        delete updateData._id;

        const dbUpdated = await ProductModel.findOneAndUpdate(
          { productId: id },
          { $set: updateData },
          { new: true }
        ).lean();

        if (dbUpdated) {
          updatedProduct = {
            id: dbUpdated.productId,
            name: dbUpdated.name,
            hindiName: dbUpdated.hindiName,
            category: dbUpdated.category,
            categoryLabel: dbUpdated.categoryLabel,
            price: dbUpdated.price,
            originalPrice: dbUpdated.originalPrice,
            sizes: dbUpdated.sizes,
            description: dbUpdated.description,
            fabric: dbUpdated.fabric,
            color: dbUpdated.color,
            inclusions: dbUpdated.inclusions,
            images: dbUpdated.images,
            badge: dbUpdated.badge,
            rating: dbUpdated.rating,
            reviewsCount: dbUpdated.reviewsCount,
            inStock: dbUpdated.inStock,
            occasion: dbUpdated.occasion,
            featured: dbUpdated.featured
          };
        }
      } catch (err) {
        console.warn('DB error updating product:', err);
      }
    }

    const memUpdated = updateMemoryProduct(id, body);
    if (!updatedProduct) {
      updatedProduct = memUpdated;
    }

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return NextResponse.json(
      { success: false, message: 'Could not update product' },
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
        await ProductModel.deleteOne({ productId: id });
      } catch (err) {
        console.warn('DB error deleting product:', err);
      }
    }

    deleteMemoryProduct(id);

    return NextResponse.json({
      success: true,
      message: 'Product removed from catalog successfully'
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return NextResponse.json(
      { success: false, message: 'Could not delete product' },
      { status: 500 }
    );
  }
}
