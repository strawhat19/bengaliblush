import { useLocalStorage } from '@/shared/config/storefront';
import { getPublishedNotifications, subscribePublishedNotifications } from '@/api/notifications';
import { readPreference, writePreference } from '@/shared/storage/preference-storage';
import type { NotificationPreferences, NotificationSnapshot } from './notification-types';

const preferenceKey = `bengali-blush-notifications-v1`;
let storageNotice: string | null = null;
let canPersistPreferences = true;
let preferencesLoaded = false;
let preferences: NotificationPreferences = { version: 1, readIds: [] };

export type NotificationReadSnapshot = NotificationPreferences & { notice: string | null };

const isNotificationPreferences = (value: unknown): value is NotificationPreferences => {
  if (!value || typeof value !== `object`) return false;
  const candidate = value as Partial<NotificationPreferences>;
  return candidate.version === 1 && Array.isArray(candidate.readIds)
    && candidate.readIds.every((id) => typeof id === `string`);
};

const loadReadPreferences = () => {
  if (preferencesLoaded) return;
  preferencesLoaded = true;
  if (!useLocalStorage) { storageNotice = `Read Preferences Apply For This Visit Only`; canPersistPreferences = false; return; }
  const stored = readPreference<NotificationPreferences>(preferenceKey, isNotificationPreferences);
  storageNotice = stored.notice;
  canPersistPreferences = !stored.notice;
  if (stored.value) preferences = stored.value;
};

const saveReadIds = (ids: string[]): NotificationReadSnapshot => {
  loadReadPreferences();
  preferences = { version: 1, readIds: Array.from(new Set([...preferences.readIds, ...ids])) };
  if (useLocalStorage && canPersistPreferences) {
    storageNotice = writePreference(preferenceKey, preferences);
    if (storageNotice) canPersistPreferences = false;
  }
  return { ...preferences, notice: storageNotice };
};

export const getNotifications = async (): Promise<NotificationSnapshot> => {
  loadReadPreferences();
  const records = await getPublishedNotifications();
  return {
    notice: storageNotice,
    notifications: records.map((notification) => ({ ...notification, isRead: preferences.readIds.includes(notification.id) })),
  };
};

export const subscribeNotifications = (onSnapshot: (snapshot: NotificationSnapshot) => void, onError: (error: Error) => void) => {
  loadReadPreferences();
  return subscribePublishedNotifications((records) => {
    const readIds = new Set(preferences.readIds);
    onSnapshot({
      notice: storageNotice,
      notifications: records.map((notification) => ({ ...notification, isRead: readIds.has(notification.id) })),
    });
  }, onError);
};

export const markNotificationRead = async (id: string): Promise<NotificationReadSnapshot> => saveReadIds([id]);
export const markAllNotificationsRead = async (ids: string[]): Promise<NotificationReadSnapshot> => saveReadIds(ids);
