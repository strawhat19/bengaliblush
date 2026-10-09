import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import ProfilePage from '@/app/components/authentication/profile-page/profile-page';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.profile.title,
  description: siteRoutes.profile.description,
};

const ProfileRoute = () => <BengaliBlushLanding><ProfilePage /></BengaliBlushLanding>;

export default ProfileRoute;
