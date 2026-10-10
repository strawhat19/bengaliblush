import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import OwnerDashboard from '@/app/components/authentication/owner-dashboard/owner-dashboard';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminAnalytics.title,
  description: siteRoutes.adminAnalytics.description,
};

const AnalyticsRoute = () => <BengaliBlushLanding><OwnerDashboard view={`analytics`} /></BengaliBlushLanding>;

export default AnalyticsRoute;
