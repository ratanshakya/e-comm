import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';
import { getMemorySettings, updateMemorySettings, DEFAULT_SETTINGS } from '@/lib/settingsStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  const { isConnected } = await connectToDatabase();

  if (isConnected) {
    try {
      let settings = await SiteSettingsModel.findOne({}).lean();
      if (!settings) {
        settings = await SiteSettingsModel.create(DEFAULT_SETTINGS);
      }
      // Merge with DEFAULT_SETTINGS so new fields always exist (backward compat)
      const merged = { ...DEFAULT_SETTINGS, ...settings };
      const response = NextResponse.json({ success: true, data: merged });
      response.headers.set('Cache-Control', 'no-store, max-age=0');
      return response;
    } catch (err) {
      console.warn('DB error fetching settings, using memory fallback:', err);
    }
  }

  const response = NextResponse.json({ success: true, data: { ...DEFAULT_SETTINGS, ...getMemorySettings() } });
  response.headers.set('Cache-Control', 'no-store, max-age=0');
  return response;
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { isConnected } = await connectToDatabase();

    let updated = null;

    if (isConnected) {
      try {
        const updateData = { ...body };
        delete updateData._id; // Remove immutable _id field
        
        updated = await SiteSettingsModel.findOneAndUpdate(
          {},
          { $set: updateData },
          { new: true, upsert: true }
        ).lean();
      } catch (err) {
        console.warn('DB error saving settings:', err);
      }
    }

    const memUpdated = updateMemorySettings(body);
    if (!updated) {
      updated = memUpdated;
    }

    // Revalidate critical paths so changes show up instantly without client-side bypasses
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');

    return NextResponse.json({
      success: true,
      message: 'Website settings updated successfully!',
      data: updated
    });
  } catch (err) {
    console.error('Error updating settings:', err);
    return NextResponse.json(
      { success: false, message: 'Could not update website settings' },
      { status: 500 }
    );
  }
}
