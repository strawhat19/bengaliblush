'use client';

import { siteRoutes } from '@/shared/navigation/routes';
import useNotificationDetails from './use-notification-details';
import Link from '@/app/components/navigation/page-link/page-link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { notificationIcons } from '@/shared/notifications/notification-icons';
import type { Notification } from '@/shared/notifications/notification-types';
import { getNotificationSpacing } from '@/shared/notifications/notification-utils';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import './notification-details.scss';

type NotificationDetailsProps = { notification: Notification };

const notificationLabels = { development: `Development`, announcement: `Announcement` };

const NotificationDetails = ({ notification }: NotificationDetailsProps) => {
  const { error, retry, notice, isRead, loading } = useNotificationDetails(notification);
  const Icon = notificationIcons[notification.kind];
  const noticeNumber = String(notification.number).padStart(2, `0`);
  const detailId = notification.id;

  return (
    <div id={`bb-notification-details-${detailId}`} className={`bb-notification-details`}>
      <section id={`top`} className={`bb-notification-details-section`} aria-labelledby={`bb-notification-details-heading-${detailId}`}>
        <div id={`bb-notification-details-container-${detailId}`} className={`bb-container bb-notification-details-container`}>
          <Link
            href={siteRoutes.notifications.href}
            className={`bb-notification-details-back`}
            id={`bb-notification-details-back-${detailId}`}
          >
            <ArrowLeft size={15} strokeWidth={1.6} aria-hidden={`true`} />
            All Notifications
          </Link>
          <article id={`bb-notification-details-article-${detailId}`} className={`bb-notification-details-article`}>
            <div id={`bb-notification-details-ornament-${detailId}`} className={`bb-notification-details-ornament`} aria-hidden={`true`}>
              <OrnamentalArch id={`bb-notification-details-emblem-frame-${detailId}`} />
              <Icon size={34} strokeWidth={1.05} />
            </div>
            <div id={`bb-notification-details-copy-${detailId}`} className={`bb-notification-details-copy`}>
              <span id={`bb-notification-details-eyebrow-${detailId}`} className={`bb-eyebrow`}>A Note From Bengali Blush</span>
              <h1 id={`bb-notification-details-heading-${detailId}`} className={`bb-notification-details-heading`}>{notification.title}</h1>
              <p id={`bb-notification-details-body-${detailId}`} className={`bb-notification-details-body`}>
                {notification.body}
                {getNotificationSpacing(notification.body, notification.link?.label)}
                {notification.link && (
                  <Link
                    href={notification.link.href}
                    className={`bb-notification-details-inline-link`}
                    id={`bb-notification-details-inline-link-${detailId}`}
                  >
                    {notification.link.label}
                  </Link>
                )}
                {getNotificationSpacing(notification.link?.label ?? notification.body, notification.suffix)}{notification.suffix}
              </p>
              <dl id={`bb-notification-details-meta-${detailId}`} className={`bb-notification-details-meta`}>
                <div id={`bb-notification-details-number-${detailId}`} className={`bb-notification-details-meta-item`}>
                  <dt id={`bb-notification-details-number-label-${detailId}`} className={`bb-notification-details-meta-label`}>Notification</dt>
                  <dd id={`bb-notification-details-number-value-${detailId}`} className={`bb-notification-details-meta-value`}>{noticeNumber}</dd>
                </div>
                <div id={`bb-notification-details-kind-${detailId}`} className={`bb-notification-details-meta-item`}>
                  <dt id={`bb-notification-details-kind-label-${detailId}`} className={`bb-notification-details-meta-label`}>Type</dt>
                  <dd id={`bb-notification-details-kind-value-${detailId}`} className={`bb-notification-details-meta-value`}>{notificationLabels[notification.kind]}</dd>
                </div>
                <div id={`bb-notification-details-status-${detailId}`} className={`bb-notification-details-meta-item`}>
                  <dt id={`bb-notification-details-status-label-${detailId}`} className={`bb-notification-details-meta-label`}>Read On This Browser</dt>
                  <dd id={`bb-notification-details-status-value-${detailId}`} className={`bb-notification-details-meta-value`} role={`status`}>
                    {loading ? `Loading` : error ? `Unavailable` : isRead ? `Read` : `Unread`}
                  </dd>
                </div>
              </dl>
              {error && (
                <div id={`bb-notification-details-error-${detailId}`} className={`bb-notification-details-feedback is-error`} role={`alert`}>
                  <p id={`bb-notification-details-error-copy-${detailId}`} className={`bb-notification-details-feedback-copy`}>{error}</p>
                  <button
                    type={`button`}
                    className={`bb-notification-details-retry`}
                    id={`bb-notification-details-retry-${detailId}`}
                    onClick={() => { void retry(); }}
                  >
                    <RotateCcw size={14} strokeWidth={1.6} aria-hidden={`true`} />
                    Try Again
                  </button>
                </div>
              )}
              {notice && <p id={`bb-notification-details-notice-${detailId}`} className={`bb-notification-details-feedback`} role={`status`}>{notice}</p>}
              <span id={`bb-notification-details-signature-${detailId}`} className={`bb-notification-details-signature`} aria-hidden={`true`}>Bengali Blush</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default NotificationDetails;
