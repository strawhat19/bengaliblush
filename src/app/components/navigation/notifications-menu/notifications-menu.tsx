'use client';

import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import { X, Bell, CheckCheck, RotateCcw, ArrowUpRight } from 'lucide-react';
import { useNotifications } from '@/shared/notifications/notifications-context';
import LiquidPanelEdge from '@/app/components/effects/liquid-panel-edge';
import NotificationCard from '@/app/components/navigation/notification-card/notification-card';
import { useNotificationsMenu, type NotificationsMenuProps } from '@/app/components/navigation/notifications-menu/use-notifications-menu';
import './notifications-menu.scss';

export default function NotificationsMenu(props: NotificationsMenuProps) {
  const { error, notice, reload, loading, markRead, markAllRead, unreadCount, notifications } = useNotifications();
  const { open, close, toggle, panelRef, buttonRef, closeButtonRef } = useNotificationsMenu({ ...props, onOpen: () => { void reload(); props.onOpen?.(); } });
  const updatesLabel = `${unreadCount} ${unreadCount === 1 ? `update` : `updates`}`;

  return (
    <div id={`bb-notifications-control`} className={`bb-notifications-control`}>
      <button
        ref={buttonRef}
        type={`button`}
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup={`dialog`}
        id={`bb-notifications-button`}
        aria-controls={`bb-notifications-panel`}
        className={`bb-bag-button bb-notifications-button${open ? ` is-active` : ``}`}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ``}`}
      >
        <Bell size={19} strokeWidth={1.9} aria-hidden={`true`} />
      </button>
      {unreadCount > 0 && (
        <span id={`bb-notifications-count`} className={`bb-notifications-count`} aria-hidden={`true`}>
          {unreadCount}
        </span>
      )}
      <section
        ref={panelRef}
        role={`dialog`}
        inert={!open}
        aria-modal={false}
        aria-hidden={!open}
        id={`bb-notifications-panel`}
        aria-labelledby={`bb-notifications-title`}
        className={`bb-notifications-panel${open ? ` is-open` : ``}`}
      >
        <LiquidPanelEdge expanded={open} id={`bb-notifications-liquid-edge`} edge={`bottom`} />
        <div id={`bb-notifications-content`} className={`bb-notifications-content`}>
          <div id={`bb-notifications-heading`} className={`bb-notifications-heading`}>
            <div id={`bb-notifications-heading-copy`} className={`bb-notifications-heading-copy`}>
              <span id={`bb-notifications-eyebrow`} className={`bb-notifications-eyebrow`}>A little update</span>
              <h2 id={`bb-notifications-title`} className={`bb-notifications-title`}>Notifications</h2>
            </div>
            <button
              type={`button`}
              ref={closeButtonRef}
              onClick={() => close()}
              aria-label={`Close notifications`}
              id={`bb-notifications-close`}
              className={`bb-close bb-notifications-close`}
            >
              <X size={17} strokeWidth={1.7} aria-hidden={`true`} />
            </button>
          </div>
          <div id={`bb-notifications-meta`} className={`bb-notifications-meta`}>
            <span id={`bb-notifications-update-label`} className={`bb-notifications-update-label`}>
              {loading ? `Loading updates` : updatesLabel}
            </span>
            {!loading && unreadCount > 0 && (
              <button
                type={`button`}
                id={`bb-notifications-read-all`}
                className={`bb-notifications-read-all`}
                onClick={() => { void markAllRead(); }}
              >
                <CheckCheck size={14} strokeWidth={1.7} aria-hidden={`true`} />Mark all read
              </button>
            )}
          </div>
          <div id={`bb-notifications-list`} className={`bb-notifications-list`} aria-busy={loading}>
            {loading ? (
              <div id={`bb-notifications-loading`} className={`bb-notifications-loading`} role={`status`}>
                <span>Loading notifications</span>
                {[0, 1].map((index) => (
                  <div key={index} id={`bb-notifications-skeleton-${index}`} className={`bb-notifications-skeleton`} aria-hidden={`true`}>
                    <span /><span /><span />
                  </div>
                ))}
              </div>
            ) : notifications.length > 0 ? notifications.map((notification) => (
              <NotificationCard
                onRead={markRead}
                key={notification.id}
                notification={notification}
                idPrefix={`bb-notifications-menu`}
                onNavigate={() => close(false)}
              />
            )) : !error && (
              <div id={`bb-notifications-empty`} className={`bb-notifications-empty`} role={`status`}>
                <Bell size={23} strokeWidth={1.3} aria-hidden={`true`} />
                <strong>You’re all caught up</strong>
                <p>New updates will appear here.</p>
              </div>
            )}
          </div>
          {error && (
            <div id={`bb-notifications-error`} className={`bb-notifications-feedback`} role={`alert`}>
              <p>{error}</p>
              <button
                type={`button`}
                id={`bb-notifications-retry`}
                className={`bb-notifications-read-all`}
                onClick={() => { void reload(); }}
              >
                <RotateCcw size={14} strokeWidth={1.7} aria-hidden={`true`} />Try again
              </button>
            </div>
          )}
          {notice && <p id={`bb-notifications-notice`} className={`bb-notifications-feedback`} role={`status`}>{notice}</p>}
          <Link
            href={siteRoutes.notifications.href}
            onClick={() => close(false)}
            id={`bb-notifications-view-all`}
            className={`bb-notifications-view-all`}
          >
            View all notifications
            <ArrowUpRight size={15} strokeWidth={1.6} aria-hidden={`true`} />
          </Link>
        </div>
      </section>
    </div>
  );
}
