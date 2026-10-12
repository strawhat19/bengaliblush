import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminFeatures from '@/app/components/authentication/admin-features/admin-features';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminFeatures.title,
  description: siteRoutes.adminFeatures.description,
};

const FeaturesRoute = () => <BengaliBlushLanding><AdminFeatures /></BengaliBlushLanding>;

export default FeaturesRoute;
