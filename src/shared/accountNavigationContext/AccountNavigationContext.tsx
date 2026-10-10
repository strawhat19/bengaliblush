'use client';

import { useAccountNavigationCounts } from './useAccountNavigationCounts';
import { expandableNavigationKeys } from '@/shared/navigation/account-navigation';
import { useMemo, useState, useCallback, createContext, useSyncExternalStore, type ReactNode } from 'react';

type AccountNavigationContextValue = {
  badgeError: string;
  collapsed: boolean;
  toggleCollapsed: () => void;
  expandedRoutes: readonly string[];
  toggleSubmenu: (href: string) => void;
  badgeCounts: Readonly<Record<string, number>>;
};

const maxExpandedSubmenus = Math.ceil(expandableNavigationKeys.length / 2);
const getDesktopLayout = () => window.matchMedia(`(min-width: 651px)`).matches;
const getServerDesktopLayout = () => false;
const subscribeToDesktopLayout = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(`(min-width: 651px)`);
  mediaQuery.addEventListener(`change`, onChange);
  return () => mediaQuery.removeEventListener(`change`, onChange);
};

export const AccountNavigationContext = createContext<AccountNavigationContextValue | undefined>(undefined);

export const AccountNavigationProvider = ({ children }: { children: ReactNode }) => {
  const { badgeError, badgeCounts } = useAccountNavigationCounts();
  const [collapsed, setCollapsed] = useState(false);
  const desktopLayout = useSyncExternalStore(subscribeToDesktopLayout, getDesktopLayout, getServerDesktopLayout);
  const [expandedMenus, setExpandedMenus] = useState(() => ({
    twoColumn: expandableNavigationKeys,
    singleColumn: expandableNavigationKeys.slice(0, 2),
  }));
  const submenuLayout = desktopLayout ? `twoColumn` : `singleColumn`;
  const expandedRoutes = expandedMenus[submenuLayout];
  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);
  const toggleSubmenu = useCallback((href: string) => setExpandedMenus((current) => {
    const routes = current[submenuLayout];
    const expanded = routes.includes(href) ? routes.filter((route) => route !== href) : [...routes, href];
    return { ...current, [submenuLayout]: submenuLayout === `singleColumn` ? expanded.slice(-maxExpandedSubmenus) : expanded };
  }), [submenuLayout]);
  const value = useMemo(() => ({ badgeError, collapsed, badgeCounts, toggleCollapsed, expandedRoutes, toggleSubmenu }), [badgeError, collapsed, badgeCounts, toggleCollapsed, expandedRoutes, toggleSubmenu]);

  return <AccountNavigationContext.Provider value={value}>{children}</AccountNavigationContext.Provider>;
};
