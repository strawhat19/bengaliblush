'use client';

import { Bell, CheckCheck, RotateCcw } from 'lucide-react';
import { useNotifications } from '@/shared/notifications/notifications-context';
import OrnamentalArch from '@/app/components/effects/ornamental-arch/ornamental-arch';
import NotificationCard from '@/app/components/navigation/notification-card/notification-card';
import './notifications-index.scss';

const NotificationsIndex = () => {
  const { error, notice, reload, loading, markRead, markAllRead, unreadCount, notifications } = useNotifications();
  const notificationCount = notifications.length;

  return (
    <div id={`bb-notifications-page`} className={`bb-notifications-index`}>
      <section id={`top`} className={`bb-notifications-page-hero`} aria-labelledby={`bb-notifications-page-heading`}>
        <div id={`bb-notifications-page-hero-container`} className={`bb-container bb-notifications-page-hero-grid`}>
          <div id={`bb-notifications-page-hero-copy`} className={`bb-notifications-page-hero-copy`}>
            <div id={`bb-notifications-page-marker`} className={`bb-section-marker`}>
              <span id={`bb-notifications-page-marker-icon`} className={`bb-section-marker-icon`}>
                <Bell size={14} aria-hidden={`true`} />
              </span>
              <span id={`bb-notifications-page-marker-label`} className={`bb-section-marker-name`}>Bengali Blush Notes</span>
              <span id={`bb-notifications-page-marker-line`} className={`bb-section-marker-line`} aria-hidden={`true`} />
              <span id={`bb-notifications-page-marker-number`} className={`bb-section-marker-index`} aria-hidden={`true`}>01</span>
            </div>
            <span id={`bb-notifications-page-eyebrow`} className={`bb-eyebrow`}>A Little Update</span>
            <h1 id={`bb-notifications-page-heading`} className={`bb-notifications-page-heading`}>Stay in<br /><em id={`bb-notifications-page-heading-accent`} className={`bb-notifications-page-heading-accent`}>the know.</em></h1>
            <p id={`bb-notifications-page-introduction`} className={`bb-notifications-page-introduction`}>The latest notifications and announcements from Bengali Blush, all in one place.</p>
          </div>
          <div id={`bb-notifications-page-emblem`} className={`bb-notifications-page-emblem`} aria-hidden={`true`}>
            <OrnamentalArch id={`bb-notifications-page-emblem-ornament`} />
            <Bell id={`bb-notifications-page-emblem-icon`} className={`bb-notifications-page-emblem-icon`} size={56} strokeWidth={.8} />
            <span id={`bb-notifications-page-emblem-label`} className={`bb-notifications-page-emblem-label`}>From the studio</span>
            <span id={`bb-notifications-page-emblem-signature`} className={`bb-notifications-page-emblem-signature`}>Bengali Blush</span>
          </div>
        </div>
      </section>
      <section id={`bb-notifications-page-updates`} className={`bb-notifications-page-updates`} aria-labelledby={`bb-notifications-page-list-heading`}>
        <div id={`bb-notifications-page-updates-container`} className={`bb-container bb-notifications-page-updates-container`}>
          <div id={`bb-notifications-page-toolbar`} className={`bb-notifications-page-toolbar`}>
            <div id={`bb-notifications-page-toolbar-copy`} className={`bb-notifications-page-toolbar-copy`}>
              <h2 id={`bb-notifications-page-list-heading`} className={`bb-notifications-page-list-heading`}>Notifications</h2>
              <p id={`bb-notifications-page-count`} className={`bb-notifications-page-count`} role={`status`}>
                {loading ? `Loading updates` : `${notificationCount} ${notificationCount === 1 ? `notification` : `notifications`} · ${unreadCount} unread`}
              </p>
            </div>
            {!loading && unreadCount > 0 && (
              <button
                type={`button`}
                id={`bb-notifications-page-read-all`}
                className={`bb-button bb-button-outline-dark bb-notifications-page-action`}
                onClick={() => { void markAllRead(); }}
              >
                <CheckCheck size={15} strokeWidth={1.6} aria-hidden={`true`} />
                Mark All Read
              </button>
            )}
          </div>
          <div id={`bb-notifications-page-list`} className={`bb-notifications-page-list`} aria-busy={loading}>
            {loading ? (
              <div id={`bb-notifications-page-loading`} className={`bb-notifications-page-loading`} role={`status`}>
                <span id={`bb-notifications-page-loading-label`} className={`bb-notifications-page-loading-label`}>Loading notifications</span>
                {[0, 1].map((index) => (
                  <div key={index} id={`bb-notifications-page-skeleton-${index}`} className={`bb-notifications-page-skeleton`} aria-hidden={`true`}>
                    <span id={`bb-notifications-page-skeleton-title-${index}`} className={`bb-notifications-page-skeleton-title`} />
                    <span id={`bb-notifications-page-skeleton-body-${index}`} className={`bb-notifications-page-skeleton-body`} />
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? notifications.map((notification) => (
              <NotificationCard
                onRead={markRead}
                key={notification.id}
                notification={notification}
                idPrefix={`bb-notifications-page`}
              />
            )) : !error && (
              <div id={`bb-notifications-page-empty`} className={`bb-notifications-page-empty`} role={`status`}>
                <Bell size={30} strokeWidth={1.2} aria-hidden={`true`} />
                <h3 id={`bb-notifications-page-empty-heading`} className={`bb-notifications-page-empty-heading`}>You’re all caught up</h3>
                <p id={`bb-notifications-page-empty-copy`} className={`bb-notifications-page-empty-copy`}>New updates will appear here.</p>
              </div>
            )}
          </div>
          {error && (
            <div id={`bb-notifications-page-error`} className={`bb-notifications-page-feedback is-error`} role={`alert`}>
              <p id={`bb-notifications-page-error-copy`} className={`bb-notifications-page-feedback-copy`}>{error}</p>
              <button
                type={`button`}
                id={`bb-notifications-page-retry`}
                className={`bb-button bb-button-outline-dark bb-notifications-page-action`}
                onClick={() => { void reload(); }}
              >
                <RotateCcw size={14} strokeWidth={1.6} aria-hidden={`true`} />
                Try Again
              </button>
            </div>
          )}
          {notice && <p id={`bb-notifications-page-notice`} className={`bb-notifications-page-feedback`} role={`status`}>{notice}</p>}
        </div>
      </section>
    </div>
  );
};

export default NotificationsIndex;
