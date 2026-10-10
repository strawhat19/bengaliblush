import type { NotificationInput } from '@/shared/models/notifications/Notification';

export const sampleNotifications: readonly NotificationInput[] = [
  {
    kind: `development`,
    status: `published`,
    slug: `in-development`,
    title: `In development`,
    body: `This application is in development, `,
    suffix: ` to let us know you are interested`,
    link: { label: `sign up`, href: `/signup` },
  },
  {
    status: `published`,
    kind: `announcement`,
    title: `A note about ads`,
    slug: `a-note-about-ads`,
    suffix: ` to support us!`,
    link: { label: `sign up`, href: `/signup` },
    body: `We are sorry to show ads, we are only doing this to support our small business, please `,
  },
];
