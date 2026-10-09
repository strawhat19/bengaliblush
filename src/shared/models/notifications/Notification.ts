export type NotificationKind = `development` | `announcement`;
export type NotificationStatus = `draft` | `published`;

export type NotificationLink = {
  href: string;
  label: string;
};

export type Notification = {
  id: string;
  body: string;
  slug: string;
  title: string;
  number: number;
  isRead: boolean;
  suffix?: string;
  kind: NotificationKind;
  link?: NotificationLink;
};

export type NotificationRecord = Omit<Notification, `isRead`> & {
  created_at: string;
  updated_at: string;
  status: NotificationStatus;
};

export type NotificationInput = Omit<NotificationRecord, `id` | `number` | `created_at` | `updated_at`>;
