import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import { updateMemoryCategory, deleteMemoryCategory } from '@/lib/categoriesStore';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { label, hindiLabel, icon, order } = body;

    const { isConnected } = await connectToDatabase();
    let updatedCategory = null;

    if (isConnected) {
      try {
        const dbUpdated = await CategoryModel.findOneAndUpdate(
          { categoryId: id },
          { $set: { label, hindiLabel, icon, order } },
          { new: true }
        ).lean();

        if (dbUpdated) {
          updatedCategory = {
            id: dbUpdated.categoryId,
            categoryId: dbUpdated.categoryId,
            label: dbUpdated.label,
            hindiLabel: dbUpdated.hindiLabel,
            icon: dbUpdated.icon,
            order: dbUpdated.order
          };
        }
      } catch (err) {
        console.warn('DB error updating category:', err);
      }
    }

    const memUpdated = updateMemoryCategory(id, body);
    if (!updatedCategory) {
      updatedCategory = memUpdated;
    }

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory
    });
  } catch (err) {
    console.error('Error updating category:', err);
    return NextResponse.json(
      { success: false, message: 'Could not update category' },
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
    if (id === 'all') {
      return NextResponse.json(
        { success: false, message: 'Cannot delete default "All Collections" category' },
        { status: 400 }
      );
    }

    const { isConnected } = await connectToDatabase();

    if (isConnected) {
      try {
        await CategoryModel.deleteOne({ categoryId: id });
      } catch (err) {
        console.warn('DB error deleting category:', err);
      }
    }

    deleteMemoryCategory(id);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting category:', err);
    return NextResponse.json(
      { success: false, message: 'Could not delete category' },
      { status: 500 }
    );
  }
}
