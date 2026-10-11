import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { adminLinks, accountLinks } from '@/shared/navigation/account-navigation';
import { useAccountNavigationState } from '@/shared/accountNavigationContext/useAccountNavigationState';

const staticBadgeRoutes = new Set<string>([siteRoutes.profile.href, siteRoutes.adminChats.href, siteRoutes.adminEvents.href]);

export const useAccountNavigation = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(``);
  const navigationState = useAccountNavigationState();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || `B`;
  const photoUrl = user?.photo_url && failedPhotoUrl !== user.photo_url ? user.photo_url : ``;
  const handlePhotoError = () => setFailedPhotoUrl(photoUrl);
  const isBadgeLoading = (key: string) => navigationState.badgeLoading && !staticBadgeRoutes.has(key);
  return { initial, isAdmin, pathname, photoUrl, adminLinks, accountLinks, isBadgeLoading, handlePhotoError, profileRoute: siteRoutes.profile, ...navigationState };
};
