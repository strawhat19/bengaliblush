import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import OwnerDashboard from '@/app/components/authentication/owner-dashboard/owner-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminReports.title,
  description: siteRoutes.adminReports.description,
};

const ReportsRoute = () => <BengaliBlushLanding><OwnerDashboard view={`reports`} /></BengaliBlushLanding>;

export default ReportsRoute;
