import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminEvents from '@/app/components/authentication/admin-events/admin-events';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminEvents.title,
  description: siteRoutes.adminEvents.description,
};

const AdminEventsRoute = () => <BengaliBlushLanding><AdminEvents /></BengaliBlushLanding>;

export default AdminEventsRoute;
