import { useLocalStorage } from '@/shared/config/storefront';
import { readPreference, writePreference } from '@/shared/storage/preference-storage';
import { sampleNotifications, showSampleNotifications } from '@/shared/notifications/notification-content';
import type { NotificationPreferences, NotificationSnapshot } from '@/shared/notifications/notification-types';

const preferenceKey = `bengali-blush-notifications-v1`;
let storageNotice: string | null = null;
let canPersistPreferences = true;
let preferences: NotificationPreferences = { version: 1, readIds: [] };

const isNotificationPreferences = (value: unknown): value is NotificationPreferences => {
  if (!value || typeof value !== `object`) return false;
  const candidate = value as Partial<NotificationPreferences>;
  return candidate.version === 1 && Array.isArray(candidate.readIds)
    && candidate.readIds.every((id) => typeof id === `string`);
};

const getSnapshot = (): NotificationSnapshot => ({
  notice: storageNotice,
  notifications: showSampleNotifications ? sampleNotifications.map((notification) => ({
    ...notification,
    isRead: preferences.readIds.includes(notification.id),
  })) : [],
});

const saveReadIds = (ids: string[]): NotificationSnapshot => {
  preferences = { version: 1, readIds: Array.from(new Set([...preferences.readIds, ...ids])) };
  if (useLocalStorage && canPersistPreferences) {
    storageNotice = writePreference(preferenceKey, preferences);
    if (storageNotice) canPersistPreferences = false;
  }
  return getSnapshot();
};

// Replace this asynchronous boundary with account-scoped Firestore operations when connected.
export const getNotifications = async (): Promise<NotificationSnapshot> => {
  if (useLocalStorage) {
    const stored = readPreference<NotificationPreferences>(preferenceKey, isNotificationPreferences);
    storageNotice = stored.notice;
    canPersistPreferences = !stored.notice;
    if (stored.value) preferences = stored.value;
  }
  return getSnapshot();
};

export const markNotificationRead = async (id: string): Promise<NotificationSnapshot> =>
  saveReadIds([id]);

export const markAllNotificationsRead = async (): Promise<NotificationSnapshot> =>
  saveReadIds(getSnapshot().notifications.map(({ id }) => id));
