export type NotificationKind = `development` | `announcement`;

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
