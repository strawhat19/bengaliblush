import { siteRoutes } from '@/shared/navigation/routes';
import type { Notification } from '@/shared/notifications/notification-types';

export const showSampleNotifications = true;

// Public notices from https://directory-directory.vercel.app/.
export const sampleNotifications: readonly Notification[] = [
  {
    number: 1,
    isRead: false,
    kind: `development`,
    slug: `in-development`,
    title: `In development`,
    body: `This application is in development, `,
    suffix: ` to let us know you are interested`,
    link: { label: `sign up`, href: siteRoutes.signup.href },
    id: `Notification_1_InDevelopment_20261008_42cc649c-2523-4ff1-a3be-91bc2c5c918d`,
  },
  {
    number: 2,
    isRead: false,
    kind: `announcement`,
    title: `A note about ads`,
    slug: `a-note-about-ads`,
    suffix: ` to support us!`,
    link: { label: `sign up`, href: siteRoutes.signup.href },
    body: `We are sorry to show ads, we are only doing this to support our small business, please `,
    id: `Notification_2_Ads_20261008_79cbf49c-fd99-4d28-918a-6f4cc92692ab`,
  },
];
