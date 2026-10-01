import { useState, useEffect } from 'react';

export interface CoverAssetSlot {
  key: string;
  id: string;
  title: string;
  label: string;
  subtitle?: string;
  recommendedAspect?: string;
  description?: string;
  defaultPath: string;
  defaultUrl: string;
}

export const DEFAULT_FAN_DECK_PHOTOS = [
  '/image_4.png',
  '/image_6.png',
  '/image_5.png',
  '/image_7.png',
  '/image_2.png',
];

export const COVER_ASSET_SLOTS: CoverAssetSlot[] = [
  {
    key: 'pulpit',
    id: 'pulpit',
    title: 'Pulpit Proclamation',
    label: 'Pulpit Proclamation',
    subtitle: 'Word & Preaching',
    recommendedAspect: '3:4 Portrait',
    description: 'Authentic Pulpit / Sanctuary Proclamation',
    defaultPath: '/image_4.png',
    defaultUrl: '/image_4.png'
  },
  {
    key: 'fellowship',
    id: 'fellowship',
    title: 'Sisterhood & Fellowship',
    label: 'Sisterhood & Fellowship',
    subtitle: 'Women Ignited',
    recommendedAspect: '3:4 Portrait',
    description: 'Sisterhood & Creative Fellowship',
    defaultPath: '/image_5.png',
    defaultUrl: '/image_5.png'
  },
  {
    key: 'men',
    id: 'men',
    title: 'Men On Fire Huddle',
    label: 'Men On Fire Huddle',
    subtitle: 'Brotherhood',
    recommendedAspect: '3:4 Portrait',
    description: 'Men On Fire Discipleship Huddle',
    defaultPath: '/image_6.png',
    defaultUrl: '/image_6.png'
  },
  {
    key: 'leaders',
    id: 'leaders',
    title: 'Trent & Whitney White',
    label: 'Trent & Whitney White',
    subtitle: 'Leadership Facilitators',
    recommendedAspect: '3:4 Portrait',
    description: 'Lead Facilitators Trent & Whitney White',
    defaultPath: '/image_7.png',
    defaultUrl: '/image_7.png'
  },
  {
    key: 'outreach',
    id: 'outreach',
    title: 'Sanctuary Outreach',
    label: 'Sanctuary Outreach',
    subtitle: 'City Mission',
    recommendedAspect: '3:4 Portrait',
    description: 'Sanctuary Community & Outreach',
    defaultPath: '/image_2.png',
    defaultUrl: '/image_2.png'
  }
];

export function getAllCoverOverrides(): Record<string, string> {
  try {
    const raw = localStorage.getItem('yf_cover_overrides');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setAppCoverOverride(slotId: string, url: string): void {
  const current = getAllCoverOverrides();
  current[slotId] = url;
  try {
    localStorage.setItem('yf_cover_overrides', JSON.stringify(current));
  } catch {}
}

export function resetAppCover(slotId: string): void {
  const current = getAllCoverOverrides();
  delete current[slotId];
  try {
    localStorage.setItem('yf_cover_overrides', JSON.stringify(current));
  } catch {}
}

export async function uploadCoverImage(arg1: any, arg2?: any): Promise<string> {
  const file: File = (arg1 instanceof File) ? arg1 : (arg2 instanceof File ? arg2 : arg1);
  return new Promise((resolve) => {
    if (file && typeof file === 'object' && 'size' in file) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      resolve(String(arg1));
    }
  });
}

export function useFanDeckPhotos(): [string[], (photos: string[]) => void] {
  const [photos, setPhotos] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem('yf_fan_deck_photos');
      return raw ? JSON.parse(raw) : DEFAULT_FAN_DECK_PHOTOS;
    } catch {
      return DEFAULT_FAN_DECK_PHOTOS;
    }
  });

  const updatePhotos = (newPhotos: string[]) => {
    setPhotos(newPhotos);
    try {
      localStorage.setItem('yf_fan_deck_photos', JSON.stringify(newPhotos));
    } catch {}
  };

  return [photos, updatePhotos];
}

export function saveFanDeckPhotos(photos: string[]): void {
  try {
    localStorage.setItem('yf_fan_deck_photos', JSON.stringify(photos));
  } catch {}
}
