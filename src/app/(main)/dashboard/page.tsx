import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import OwnerDashboard from '@/app/components/authentication/owner-dashboard/owner-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.dashboard.title,
  description: siteRoutes.dashboard.description,
};

const DashboardRoute = () => <BengaliBlushLanding><OwnerDashboard /></BengaliBlushLanding>;

export default DashboardRoute;
