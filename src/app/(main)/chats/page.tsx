import type { Metadata } from 'next';
import { siteRoutes } from '@/shared/navigation/routes';
import BengaliBlushLanding from '@/app/components/landing/bengali-blush-landing';
import AdminChats from '@/app/components/authentication/admin-chats/admin-chats';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: siteRoutes.adminChats.title,
  description: siteRoutes.adminChats.description,
};

const AdminChatsRoute = () => <BengaliBlushLanding><AdminChats /></BengaliBlushLanding>;

export default AdminChatsRoute;
