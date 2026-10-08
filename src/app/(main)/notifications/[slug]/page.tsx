import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getNotificationHref } from '@/shared/notifications/notification-utils';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import { getNotificationBySlug, getNotificationCatalog } from '@/shared/notifications/notification-catalog';
import NotificationDetails from '@/app/components/notifications/notification-details/notification-details';

type NotificationDetailsRouteProps = { params: Promise<{ slug: string }> };

export const generateStaticParams = async () =>
  (await getNotificationCatalog()).map(({ slug }) => ({ slug }));

export const generateMetadata = async ({ params }: NotificationDetailsRouteProps): Promise<Metadata> => {
  const { slug } = await params;
  const notification = await getNotificationBySlug(slug);
  if (!notification) notFound();

  return {
    title: `${notification.title} | Bengali Blush`,
    description: `${notification.body}${notification.link?.label ?? ``}${notification.suffix ?? ``}`,
    alternates: { canonical: getNotificationHref(notification.slug) },
  };
};

const NotificationDetailsRoute = async ({ params }: NotificationDetailsRouteProps) => {
  const { slug } = await params;
  const notification = await getNotificationBySlug(slug);
  if (!notification) notFound();

  return (
    <BengaliBlushLanding>
      <NotificationDetails key={notification.id} notification={notification} />
    </BengaliBlushLanding>
  );
};

export default NotificationDetailsRoute;
