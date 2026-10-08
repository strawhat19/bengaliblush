import type { Notification } from '@/shared/notifications/notification-types';
import { sampleNotifications, showSampleNotifications } from '@/shared/notifications/notification-content';

// Public content stays separate from locally stored read preferences.
export const getNotificationCatalog = async (): Promise<Notification[]> =>
  showSampleNotifications ? sampleNotifications.map((notification) => ({ ...notification })) : [];

export const getNotificationBySlug = async (slug: string): Promise<Notification | undefined> =>
  (await getNotificationCatalog()).find((notification) => notification.slug === slug);
