import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import AdminShop from '@/app/components/authentication/admin-shop/admin-shop';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminShop.title,
  description: siteRoutes.adminShop.description,
};

const AdminShopRoute = () => <BengaliBlushLanding><AdminShop /></BengaliBlushLanding>;

export default AdminShopRoute;
