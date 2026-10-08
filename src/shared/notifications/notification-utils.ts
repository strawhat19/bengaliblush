import { siteRoutes } from '@/shared/navigation/routes';

export const getNotificationHref = (slug: string) =>
  `${siteRoutes.notifications.href}/${encodeURIComponent(slug)}`;
