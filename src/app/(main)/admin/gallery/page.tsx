import type { Metadata } from 'next';
import { siteGalleryImages } from '@/api/gallery';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminGallery from '@/app/components/authentication/admin-gallery/admin-gallery';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminGallery.title,
  description: siteRoutes.adminGallery.description,
};

const AdminGalleryRoute = () => <BengaliBlushLanding><AdminGallery images={siteGalleryImages} /></BengaliBlushLanding>;

export default AdminGalleryRoute;
