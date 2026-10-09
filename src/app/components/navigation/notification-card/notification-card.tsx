'use client';

import { Heart, ArrowUpRight, Construction } from 'lucide-react';
import Link from '@/app/components/navigation/page-link/page-link';
import { getNotificationHref, getNotificationCopy } from '@/shared/notifications/notification-utils';
import type { Notification } from '@/shared/notifications/notification-types';
import './notification-card.scss';

type NotificationCardProps = {
  idPrefix?: string;
  onNavigate?: () => void;
  notification: Notification;
  onRead?: (id: string) => Promise<void>;
};

const notificationIcons = { announcement: Heart, development: Construction };

export default function NotificationCard({
  onRead,
  onNavigate,
  notification,
  idPrefix = `bb-notification`,
}: NotificationCardProps) {
  const Icon = notificationIcons[notification.kind];
  const cardId = `${idPrefix}-${notification.id}`;

  return (
    <Link
      id={cardId}
      href={getNotificationHref(notification.slug)}
      aria-labelledby={`${cardId}-title`}
      aria-describedby={`${cardId}-body`}
      className={`bb-notification-card${notification.isRead ? ` is-read` : ``}`}
      onClick={() => { void onRead?.(notification.id); onNavigate?.(); }}
    >
      <span id={`${cardId}-icon`} className={`bb-notification-icon`} aria-hidden={`true`}>
        <Icon size={18} strokeWidth={1.6} />
      </span>
      <div id={`${cardId}-copy`} className={`bb-notification-copy`}>
        <h3 id={`${cardId}-title`} className={`bb-notification-title`}>
          {notification.title}
          {!notification.isRead && (
            <span
              aria-label={`Unread`}
              className={`bb-notification-unread-dot`}
              id={`${cardId}-unread`}
            />
          )}
        </h3>
        <p id={`${cardId}-body`} className={`bb-notification-body`}>
          {getNotificationCopy(notification)}
        </p>
      </div>
      <ArrowUpRight size={15} className={`bb-notification-arrow`} aria-hidden={`true`} />
    </Link>
  );
}
