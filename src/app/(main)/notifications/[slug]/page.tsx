import type { Metadata } from 'next';
import FeatureAccess from '@/app/components/feature-access/feature-access';
import { getNotificationHref } from '@/shared/notifications/notification-utils';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import CatalogNotificationDetails from '@/app/components/notifications/notification-details/catalog-notification-details';

type NotificationDetailsRouteProps = { params: Promise<{ slug: string }> };

export const generateMetadata = async ({ params }: NotificationDetailsRouteProps): Promise<Metadata> => {
  const { slug } = await params;
  return { title: `Notification | Bengali Blush`, alternates: { canonical: getNotificationHref(slug) } };
};

const NotificationDetailsRoute = async ({ params }: NotificationDetailsRouteProps) => {
  const { slug } = await params;
  return <BengaliBlushLanding><FeatureAccess feature={`notifications`}><CatalogNotificationDetails slug={slug} /></FeatureAccess></BengaliBlushLanding>;
};

export default NotificationDetailsRoute;
