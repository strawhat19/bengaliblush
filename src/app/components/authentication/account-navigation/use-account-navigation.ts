import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { adminLinks, accountLinks } from '@/shared/navigation/account-navigation';
import { useAccountNavigationState } from '@/shared/accountNavigationContext/useAccountNavigationState';

export const useAccountNavigation = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(``);
  const navigationState = useAccountNavigationState();
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || `B`;
  const photoUrl = user?.photo_url && failedPhotoUrl !== user.photo_url ? user.photo_url : ``;
  const handlePhotoError = () => setFailedPhotoUrl(photoUrl);
  return { initial, isAdmin, pathname, photoUrl, adminLinks, accountLinks, handlePhotoError, profileRoute: siteRoutes.profile, ...navigationState };
};
