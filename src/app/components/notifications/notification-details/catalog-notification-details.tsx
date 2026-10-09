'use client';

import { useEffect, useState } from 'react';
import NotificationDetails from './notification-details';
import { Bell, ArrowLeft, RotateCcw } from 'lucide-react';
import { siteRoutes } from '@/shared/navigation/routes';
import Link from '@/app/components/navigation/page-link/page-link';
import { useNotifications } from '@/shared/notifications/notifications-context';
import './notification-details.scss';

const CatalogNotificationDetails = ({ slug }: { slug: string }) => {
  const { error, reload, loading, notifications } = useNotifications();
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null);
  const notification = notifications.find((item) => item.slug === slug);
  const waiting = loading || resolvedSlug !== slug;
  useEffect(() => {
    let active = true;
    void reload().then(() => { if (active) setResolvedSlug(slug); });
    return () => { active = false; };
  }, [slug, reload]);
  if (!waiting && !error && notification) return <NotificationDetails key={notification.id} notification={notification} />;
  return (
    <div id={`bb-notification-${slug}-state`} className={`bb-notification-details`}>
      <section id={`top`} className={`bb-notification-details-section`} aria-labelledby={`bb-notification-${slug}-state-title`}>
        <div id={`bb-notification-${slug}-state-container`} className={`bb-container bb-notification-details-container`}>
          <Link href={siteRoutes.notifications.href} id={`bb-notification-${slug}-state-back`} className={`bb-notification-details-back`}><ArrowLeft size={15} aria-hidden={`true`} />All Notifications</Link>
          <div id={`bb-notification-${slug}-state-content`} className={`bb-notification-details-state`} role={!waiting && error ? `alert` : `status`} aria-busy={waiting}>
            <Bell size={34} aria-hidden={`true`} />
            <h1 id={`bb-notification-${slug}-state-title`} className={`bb-notification-details-heading`}>{waiting ? `Loading Notification…` : error ? `Unable To Load This Notification` : `Notification Unavailable`}</h1>
            <p id={`bb-notification-${slug}-state-copy`} className={`bb-notification-details-body`}>{waiting ? `Gathering the latest studio update.` : error || `This notification is not currently published. Explore the studio’s other updates.`}</p>
            {!waiting && error && <button type={`button`} id={`bb-notification-${slug}-state-retry`} className={`bb-notification-details-retry`} onClick={() => { void reload(); }}><RotateCcw size={14} aria-hidden={`true`} />Try Again</button>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CatalogNotificationDetails;
