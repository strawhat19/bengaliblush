import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminHealth from '@/app/components/authentication/admin-health/admin-health';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminHealth.title,
  description: siteRoutes.adminHealth.description,
};

const HealthRoute = () => <BengaliBlushLanding><AdminHealth /></BengaliBlushLanding>;

export default HealthRoute;
