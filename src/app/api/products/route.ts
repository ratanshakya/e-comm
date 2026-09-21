import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import ProductModel from '@/models/Product';
import { getMemoryProducts, addMemoryProduct } from '@/lib/productsStore';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const size = searchParams.get('size');
  const query = searchParams.get('q')?.toLowerCase();
  const sort = searchParams.get('sort');

  const { isConnected } = await connectToDatabase();

  let products = [...getMemoryProducts()];

  if (isConnected) {
    try {
      const dbProducts = await ProductModel.find({}).sort({ createdAt: -1 }).lean();
      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map((p) => ({
          id: p.productId,
          name: p.name,
          hindiName: p.hindiName,
          category: p.category,
          categoryLabel: p.categoryLabel,
          price: p.price,
          originalPrice: p.originalPrice,
          sizes: p.sizes,
          description: p.description,
          fabric: p.fabric,
          color: p.color,
          inclusions: p.inclusions,
          images: p.images,
          badge: p.badge,
          rating: p.rating,
          reviewsCount: p.reviewsCount,
          inStock: p.inStock,
          occasion: p.occasion,
          featured: p.featured
        }));
      }
    } catch (err) {
      console.warn('Failed to query DB products, using fallback:', err);
    }
  }

  // Filter category
  if (category && category !== 'all') {
    products = products.filter((p) => p.category === category);
  }

  // Filter size
  if (size && size !== 'all') {
    products = products.filter((p) => p.sizes.includes(size) || p.sizes.includes('All Sizes'));
  }

  // Filter search query
  if (query) {
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.hindiName.includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.categoryLabel.toLowerCase().includes(query)
    );
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    products.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  return NextResponse.json({
    success: true,
    count: products.length,
    data: products,
    dataSource: isConnected ? 'mongodb' : 'vrindavan-catalog-memory'
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      hindiName,
      category,
      categoryLabel,
      price,
      originalPrice,
      sizes,
      description,
      fabric,
      color,
      inclusions,
      images,
      badge,
      inStock,
      featured,
      occasion
    } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, message: 'Name, price, and category are required' },
        { status: 400 }
      );
    }

    const productId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newProduct: Product = {
      id: productId,
      name,
      hindiName: hindiName || name,
      category,
      categoryLabel: categoryLabel || category,
      price: Number(price),
      originalPrice: Number(originalPrice || price),
      sizes: Array.isArray(sizes) && sizes.length > 0 ? sizes : ['0', '1', '2', '3', '4', '5', '6'],
      description: description || 'Sacred handcrafted offering for Shree Laddu Gopal Ji.',
      fabric: fabric || 'Pure Silk & Hand Zari',
      color: color || 'Vrindavan Kesari & Gold',
      inclusions: Array.isArray(inclusions) && inclusions.length > 0 ? inclusions : ['Poshak', 'Mukut', 'Patka'],
      images: Array.isArray(images) && images.length > 0 ? images : ['/images/poshak_royal_zardozi.jpg'],
      badge: badge || 'New Vrindavan Creation',
      rating: 5.0,
      reviewsCount: 1,
      inStock: inStock !== undefined ? Boolean(inStock) : true,
      occasion: Array.isArray(occasion) && occasion.length > 0 ? occasion : ['Daily Seva', 'Festive Utsav'],
      featured: Boolean(featured)
    };

    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      try {
        await ProductModel.create({
          productId: newProduct.id,
          name: newProduct.name,
          hindiName: newProduct.hindiName,
          category: newProduct.category,
          categoryLabel: newProduct.categoryLabel,
          price: newProduct.price,
          originalPrice: newProduct.originalPrice,
          sizes: newProduct.sizes,
          description: newProduct.description,
          fabric: newProduct.fabric,
          color: newProduct.color,
          inclusions: newProduct.inclusions,
          images: newProduct.images,
          badge: newProduct.badge,
          rating: newProduct.rating,
          reviewsCount: newProduct.reviewsCount,
          inStock: newProduct.inStock,
          occasion: newProduct.occasion,
          featured: newProduct.featured
        });
      } catch (dbErr) {
        console.warn('Failed saving product to MongoDB, saving in memory:', dbErr);
        addMemoryProduct(newProduct);
      }
    } else {
      addMemoryProduct(newProduct);
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Could not create product' },
      { status: 500 }
    );
  }
}
