import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import { useFeatureFlags } from '@/shared/featureFlags/useFeatureFlags';
import { useAccountNavigationState } from '@/shared/accountNavigationContext/useAccountNavigationState';
import { adminLinks, accountLinks, getAllowedAccountNavigation } from '@/shared/navigation/account-navigation';

const staticBadgeRoutes = new Set<string>([siteRoutes.profile.href, siteRoutes.adminChats.href, siteRoutes.adminEvents.href, siteRoutes.adminHealth.href, siteRoutes.adminFeatures.href]);

export const useAccountNavigation = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const { canManageFeatures } = useFeatureFlags();
  const [failedPhotoUrl, setFailedPhotoUrl] = useState(``);
  const navigationState = useAccountNavigationState();
  const allowedAdminLinks = useMemo(() => getAllowedAccountNavigation(adminLinks, user?.role).map((item) => ({
    ...item,
    children: item.children?.filter(({ route }) => route.href !== siteRoutes.adminFeatures.href || canManageFeatures),
  })), [user?.role, canManageFeatures]);
  const allowedAccountLinks = useMemo(() => getAllowedAccountNavigation(accountLinks, user?.role), [user?.role]);
  const initial = user?.name?.trim()?.[0]?.toUpperCase() || `B`;
  const photoUrl = user?.photo_url && failedPhotoUrl !== user.photo_url ? user.photo_url : ``;
  const handlePhotoError = () => setFailedPhotoUrl(photoUrl);
  const isBadgeLoading = (key: string) => navigationState.badgeLoading && !staticBadgeRoutes.has(key);
  return { initial, isAdmin, pathname, photoUrl, isBadgeLoading, handlePhotoError, adminLinks: allowedAdminLinks, profileRoute: siteRoutes.profile, accountLinks: allowedAccountLinks, ...navigationState };
};
