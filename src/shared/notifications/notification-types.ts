import type { Notification } from '@/shared/models/notifications/Notification';

export type { Notification, NotificationKind, NotificationLink } from '@/shared/models/notifications/Notification';

export type NotificationPreferences = {
  version: 1;
  readIds: string[];
};

export type NotificationSnapshot = {
  notice: string | null;
  notifications: Notification[];
};
