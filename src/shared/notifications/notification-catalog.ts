import type { Notification } from '@/shared/notifications/notification-types';
import { getPublishedNotifications } from '@/api/notifications';

// Public content stays separate from locally stored read preferences.
export const getNotificationCatalog = async (): Promise<Notification[]> =>
  (await getPublishedNotifications()).map((notification) => ({ ...notification, isRead: false }));

export const getNotificationBySlug = async (slug: string): Promise<Notification | undefined> =>
  (await getNotificationCatalog()).find((notification) => notification.slug === slug);
