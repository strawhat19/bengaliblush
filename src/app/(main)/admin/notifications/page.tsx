import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminNotifications from '@/app/components/authentication/admin-notifications/admin-notifications';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminNotifications.title,
  description: siteRoutes.adminNotifications.description,
};

const AdminNotificationsRoute = () => <BengaliBlushLanding><AdminNotifications /></BengaliBlushLanding>;

export default AdminNotificationsRoute;
