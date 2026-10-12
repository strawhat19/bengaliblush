import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import FeatureAccess from '@/app/components/feature-access/feature-access';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import NotificationsIndex from '@/app/components/notifications/notifications-index/notifications-index';

export const metadata: Metadata = {
  title: siteRoutes.notifications.title,
  description: siteRoutes.notifications.description,
  alternates: { canonical: siteRoutes.notifications.href },
};

const NotificationsRoute = () => (
  <BengaliBlushLanding>
    <FeatureAccess feature={`notifications`}><NotificationsIndex /></FeatureAccess>
  </BengaliBlushLanding>
);

export default NotificationsRoute;
