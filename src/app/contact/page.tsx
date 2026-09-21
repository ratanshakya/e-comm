import React from 'react';
import ContactClient from './ContactClient';
import { connectToDatabase } from '@/lib/mongodb';
import SiteSettingsModel from '@/models/SiteSettings';
import { DEFAULT_SETTINGS, SiteSettingsData } from '@/lib/settingsStore';

export default async function ContactPage() {
  await connectToDatabase();

  let settings: SiteSettingsData = DEFAULT_SETTINGS;

  try {
    const dbSettings = await SiteSettingsModel.findOne({}).lean();
    if (dbSettings) {
      settings = { ...DEFAULT_SETTINGS, ...dbSettings } as SiteSettingsData;
    }
  } catch (err) {
    console.warn('DB error fetching settings:', err);
  }

  // Convert to plain objects to pass to Client Component safely
  const plainSettings = JSON.parse(JSON.stringify(settings));

  return <ContactClient initialSettings={plainSettings} />;
}
