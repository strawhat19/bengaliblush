import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminSectionSummary from '@/app/components/authentication/admin-section-summary/admin-section-summary';

export const metadata: Metadata = {
  title: siteRoutes.adminStudio.title,
  robots: { index: false, follow: false },
  description: siteRoutes.adminStudio.description,
};

const AdminStudioRoute = () => <BengaliBlushLanding><AdminSectionSummary section={`studio`} /></BengaliBlushLanding>;

export default AdminStudioRoute;
