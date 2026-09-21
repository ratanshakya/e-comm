import React from 'react';
import HomeClient from './HomeClient';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';
import ProductModel from '@/models/Product';
import { DEFAULT_SETTINGS, SiteSettingsData } from '@/lib/settingsStore';
import { Product } from '@/types';
import { PRODUCTS } from '@/data/products';

export default async function HomePage() {
  await connectToDatabase();

  let settings: SiteSettingsData = DEFAULT_SETTINGS;
  let products: Product[] = PRODUCTS;

  const fetchWithTimeout = async <T,>(promise: Promise<T>, ms: number = 800): Promise<T | null> => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<null>((resolve) => {
      timeoutId = setTimeout(() => resolve(null), ms);
    });
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  };

  try {
    const dbSettings = await fetchWithTimeout(SiteSettingsModel.findOne({}).lean());
    if (dbSettings) {
      settings = { ...DEFAULT_SETTINGS, ...dbSettings } as SiteSettingsData;
    }
  } catch (err) {
    console.warn('DB error fetching settings:', err);
  }

  try {
    const dbProducts = await fetchWithTimeout(ProductModel.find({}).sort({ createdAt: -1 }).lean(), 1000);
    if (dbProducts && Array.isArray(dbProducts) && dbProducts.length > 0) {
      products = dbProducts.map((p: any) => ({
        ...p,
        id: p._id.toString(),
        _id: p._id.toString(),
      })) as Product[];
    }
  } catch (err) {
    console.warn('DB error fetching products:', err);
  }

  // Convert to plain objects to pass to Client Component safely
  const plainSettings = JSON.parse(JSON.stringify(settings));
  const plainProducts = JSON.parse(JSON.stringify(products));

  return <HomeClient initialProducts={plainProducts} initialSettings={plainSettings} />;
}
