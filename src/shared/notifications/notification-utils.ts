import { siteRoutes } from '@/shared/navigation/routes';
import type { Notification } from './notification-types';

export const getNotificationHref = (slug: string) =>
  `${siteRoutes.notifications.href}/${encodeURIComponent(slug)}`;

export const getNotificationSpacing = (previous?: string, next?: string) =>
  previous && next && !/\s$/.test(previous) && !/^[\s,.;:!?)]/.test(next) ? ` ` : ``;

export const getNotificationCopy = (notification: Notification) => {
  const label = notification.link?.label;
  return `${notification.body}${getNotificationSpacing(notification.body, label)}${label ?? ``}${getNotificationSpacing(label ?? notification.body, notification.suffix)}${notification.suffix ?? ``}`;
};
