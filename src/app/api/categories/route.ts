import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import ProductModel from '@/models/Product';
import {
  getMemoryCategories,
  addMemoryCategory,
  DEFAULT_CATEGORIES,
  CategoryItem
} from '@/lib/categoriesStore';
import { getMemoryProducts } from '@/lib/productsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { isConnected } = await connectToDatabase();

  let categories: CategoryItem[] = getMemoryCategories();
  let products = getMemoryProducts();

  if (isConnected) {
    try {
      let dbCategories = await CategoryModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
      
      // Auto-seed default categories if MongoDB collection is empty
      if (!dbCategories || dbCategories.length === 0) {
        for (const defCat of DEFAULT_CATEGORIES) {
          await CategoryModel.create({
            categoryId: defCat.categoryId,
            label: defCat.label,
            hindiLabel: defCat.hindiLabel || '',
            icon: defCat.icon || 'Sparkles',
            order: defCat.order || 0,
            isActive: true
          });
        }
        dbCategories = await CategoryModel.find({}).sort({ order: 1, createdAt: 1 }).lean();
      }

      if (dbCategories && dbCategories.length > 0) {
        const dbProducts = await ProductModel.find({}).lean();
        categories = dbCategories.map((c) => ({
          id: c.categoryId,
          categoryId: c.categoryId,
          label: c.label,
          hindiLabel: c.hindiLabel || '',
          icon: c.icon || 'Sparkles',
          order: c.order || 0,
          count: c.categoryId === 'all'
            ? dbProducts.length
            : dbProducts.filter((p) => p.category === c.categoryId).length
        }));
        return NextResponse.json({ success: true, data: categories });
      }
    } catch (err) {
      console.warn('DB error fetching categories, using fallback:', err);
    }
  }

  // Fallback with counts calculated
  const result = categories.map((c) => ({
    ...c,
    count: c.id === 'all'
      ? products.length
      : products.filter((p) => p.category === c.id).length
  }));

  return NextResponse.json({ success: true, data: result });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { label, hindiLabel, categoryId, icon } = body;

    if (!label) {
      return NextResponse.json(
        { success: false, message: 'Category label is required' },
        { status: 400 }
      );
    }

    // Slugify id if not provided
    const slug = (categoryId || label)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newCategory: CategoryItem = {
      id: slug,
      categoryId: slug,
      label,
      hindiLabel: hindiLabel || label,
      icon: icon || 'Sparkles',
      order: 10
    };

    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      try {
        await CategoryModel.findOneAndUpdate(
          { categoryId: slug },
          {
            categoryId: slug,
            label: newCategory.label,
            hindiLabel: newCategory.hindiLabel,
            icon: newCategory.icon,
            order: newCategory.order,
            isActive: true
          },
          { upsert: true, new: true }
        );
      } catch (dbErr) {
        console.warn('Failed saving category to DB, saving in memory:', dbErr);
        addMemoryCategory(newCategory);
      }
    } else {
      addMemoryCategory(newCategory);
    }

    return NextResponse.json({
      success: true,
      message: 'Category created successfully!',
      data: newCategory
    });
  } catch (err) {
    console.error('Error creating category:', err);
    return NextResponse.json(
      { success: false, message: 'Could not create category' },
      { status: 500 }
    );
  }
}
