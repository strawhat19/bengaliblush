import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminCommerce from '@/app/components/authentication/admin-commerce/admin-commerce';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminPaymentMethods.title,
  description: siteRoutes.adminPaymentMethods.description,
};

const AdminCommerceRoute = () => <BengaliBlushLanding><AdminCommerce section={`paymentMethods`} /></BengaliBlushLanding>;

export default AdminCommerceRoute;
