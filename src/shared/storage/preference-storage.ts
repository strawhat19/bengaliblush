import { useLocalStorage } from '@/shared/config/storefront';

const STORAGE_VERSION = 1;
const unreadableKeys = new Set<string>();

type PreferenceRecord = {
  value?: unknown;
  version?: unknown;
};

export const readPreference = <T>(key: string, isValid: (value: unknown) => value is T): {
  value: T | null;
  notice: string | null;
} => {
  if (typeof window === `undefined`) return { value: null, notice: null };
  if (!useLocalStorage) return { value: null, notice: `Preferences apply for this visit only.` };

  try {
    const rawValue = window.localStorage.getItem(key);
    if (!rawValue) {
      unreadableKeys.delete(key);
      return { value: null, notice: null };
    }
    const record = JSON.parse(rawValue) as PreferenceRecord | null;
    if (record?.version === STORAGE_VERSION && isValid(record.value)) {
      unreadableKeys.delete(key);
      return { value: record.value, notice: null };
    }
  } catch {
    // Preserve saved records if storage is unavailable or its contents cannot be read.
  }

  unreadableKeys.add(key);
  return { value: null, notice: `Saved preferences could not be read. Changes apply for this visit only.` };
};

export const writePreference = (key: string, value: unknown): string | null => {
  if (!useLocalStorage || typeof window === `undefined`) return `Preferences apply for this visit only.`;
  if (unreadableKeys.has(key)) return `Saved preferences could not be read. Changes apply for this visit only.`;

  try {
    window.localStorage.setItem(key, JSON.stringify({
      value,
      version: STORAGE_VERSION,
      updatedAt: new Date().toISOString(),
    }));
    return null;
  } catch {
    return `Your preferences apply for this visit. Browser storage could not be updated.`;
  }
};
