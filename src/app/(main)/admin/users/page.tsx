import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import OwnerDashboard from '@/app/components/authentication/owner-dashboard/owner-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminUsers.title,
  description: siteRoutes.adminUsers.description,
};

const AdminRoute = () => <BengaliBlushLanding><OwnerDashboard section={`users`} /></BengaliBlushLanding>;

export default AdminRoute;

