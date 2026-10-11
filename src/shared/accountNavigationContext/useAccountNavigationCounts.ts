import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/shared/authContext/useAuth';
import { isProfileOrAdminPage } from '@/shared/navigation/routes';
import { getNavigationBadgeCounts, getNavigationTablePagination } from '@/shared/navigation/navigation-counts';
import { subscribeAdminNavigationCounts, type AdminNavigationCounts, type AdminNavigationPagination } from '@/api/navigation';

type NavigationCountsState = { error: string; source: object; counts: AdminNavigationCounts | null; pagination: AdminNavigationPagination | null };

export const useAccountNavigationCounts = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const accountId = user?.id;
  const hasProfile = Boolean(accountId);
  const enabled = hasProfile && isAdmin && isProfileOrAdminPage(pathname ?? ``);
  const source = useMemo(() => ({ enabled, accountId }), [enabled, accountId]);
  const [state, setState] = useState<NavigationCountsState | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    let unsubscribe: () => void = () => undefined;
    const receive = (counts: AdminNavigationCounts, pagination: AdminNavigationPagination) => { if (active) setState({ counts, source, pagination, error: `` }); };
    const fail = (error: Error) => { if (active) setState({ source, counts: null, pagination: null, error: error.message || `Unable To Load Menu Counts` }); };
    void subscribeAdminNavigationCounts(receive, fail).then((stop) => {
      if (active) unsubscribe = stop;
      else stop();
    }).catch(fail);
    return () => { active = false; unsubscribe(); };
  }, [enabled, source]);

  const counts = enabled && state?.source === source ? state.counts : null;
  const pagination = enabled && state?.source === source ? state.pagination : null;
  const badgeError = enabled && state?.source === source ? state.error : ``;
  const badgeCounts = useMemo(() => getNavigationBadgeCounts(counts, hasProfile), [counts, hasProfile]);
  const tablePagination = useMemo(() => getNavigationTablePagination(pagination), [pagination]);
  return { badgeError, badgeCounts, tablePagination };
};
