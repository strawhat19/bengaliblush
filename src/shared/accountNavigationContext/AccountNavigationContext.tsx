'use client';

import { useAuth } from '@/shared/authContext/useAuth';
import { siteRoutes } from '@/shared/navigation/routes';
import type { RecordPaginationIndex } from '@/api/navigation';
import { useAccountNavigationCounts } from './useAccountNavigationCounts';
import { readPreference, writePreference } from '@/shared/storage/preference-storage';
import { getAllowedExpandableNavigationKeys } from '@/shared/navigation/account-navigation';
import { useMemo, useState, useEffect, useCallback, createContext, useSyncExternalStore, type ReactNode } from 'react';

type AccountNavigationContextValue = {
  badgeError: string;
  collapsed: boolean;
  badgeLoading: boolean;
  preferenceNotice: string;
  toggleCollapsed: () => void;
  expandedRoutes: readonly string[];
  toggleSubmenu: (href: string) => void;
  badgeCounts: Readonly<Record<string, number>>;
  tablePagination: Readonly<Record<string, RecordPaginationIndex>>;
};

type NavigationPreferences = {
  collapsed: boolean;
  expandedMobile: string[];
  expandedDesktop: string[];
};
type NavigationPreferenceState = {
  scope: string;
  notice: string;
  changed: boolean;
  preferences: NavigationPreferences;
};
const isNavigationPreferences = (value: unknown): value is NavigationPreferences => {
  const preferences = value as Partial<NavigationPreferences> | null;
  return typeof preferences?.collapsed === `boolean`
    && Array.isArray(preferences?.expandedMobile) && preferences.expandedMobile.every((key) => typeof key === `string`)
    && Array.isArray(preferences?.expandedDesktop) && preferences.expandedDesktop.every((key) => typeof key === `string`);
};
const normalizePreferences = (preferences: NavigationPreferences, allowedKeys: readonly string[]): NavigationPreferences => ({
  collapsed: preferences.collapsed,
  expandedMobile: [...new Set(preferences.expandedMobile.filter((key) => allowedKeys.includes(key)))],
  expandedDesktop: [...new Set(preferences.expandedDesktop.filter((key) => allowedKeys.includes(key)))],
});
const getDesktopLayout = () => window.matchMedia(`(min-width: 651px)`).matches;
const getServerDesktopLayout = () => false;
const subscribeToDesktopLayout = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(`(min-width: 651px)`);
  mediaQuery.addEventListener(`change`, onChange);
  return () => mediaQuery.removeEventListener(`change`, onChange);
};

export const AccountNavigationContext = createContext<AccountNavigationContextValue | undefined>(undefined);

export const AccountNavigationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const accountId = user?.id ?? ``;
  const scope = `${accountId}:${user?.role ?? ``}`;
  const preferenceKey = `bengali-blush-account-navigation-v1:${accountId}`;
  const { badgeError, badgeCounts, badgeLoading, tablePagination } = useAccountNavigationCounts();
  const desktopLayout = useSyncExternalStore(subscribeToDesktopLayout, getDesktopLayout, getServerDesktopLayout);
  const allowedKeys = useMemo(() => getAllowedExpandableNavigationKeys(user?.role), [user?.role]);
  const defaultPreferences = useMemo<NavigationPreferences>(() => ({
    collapsed: false,
    expandedMobile: allowedKeys.includes(siteRoutes.dashboard.href) ? [siteRoutes.dashboard.href] : [],
    expandedDesktop: allowedKeys.includes(siteRoutes.dashboard.href) ? [siteRoutes.dashboard.href] : [],
  }), [allowedKeys]);
  const [state, setState] = useState<NavigationPreferenceState | null>(null);
  const currentState = state?.scope === scope ? state : null;
  const preferences = currentState?.preferences ?? defaultPreferences;
  const preferenceNotice = currentState?.notice ?? ``;
  const collapsed = preferences.collapsed;
  const submenuLayout = desktopLayout ? `expandedDesktop` : `expandedMobile`;
  const expandedRoutes = preferences[submenuLayout];

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      const stored = accountId ? readPreference(preferenceKey, isNavigationPreferences) : { value: null, notice: null };
      const nextPreferences = normalizePreferences(stored.value ?? defaultPreferences, allowedKeys);
      setState((current) => current?.scope === scope ? current : { scope, changed: false, preferences: nextPreferences, notice: stored.notice ?? `` });
    });
    return () => { active = false; };
  }, [scope, accountId, allowedKeys, preferenceKey, defaultPreferences]);

  useEffect(() => {
    if (!accountId || !currentState?.changed) return;
    let active = true;
    const notice = writePreference(preferenceKey, preferences) ?? ``;
    void Promise.resolve().then(() => {
      if (active) setState((current) => current?.scope !== scope || current.notice === notice ? current : { ...current, notice });
    });
    return () => { active = false; };
  }, [scope, accountId, preferenceKey, preferences, currentState?.changed]);

  const toggleCollapsed = useCallback(() => setState((current) => {
    const previous = current?.scope === scope ? current : null;
    const preferences = previous?.preferences ?? defaultPreferences;
    return { scope, changed: true, notice: previous?.notice ?? ``, preferences: { ...preferences, collapsed: !preferences.collapsed } };
  }), [scope, defaultPreferences]);
  const toggleSubmenu = useCallback((href: string) => {
    if (!allowedKeys.includes(href)) return;
    setState((current) => {
      const previous = current?.scope === scope ? current : null;
      const preferences = previous?.preferences ?? defaultPreferences;
      const routes = preferences[submenuLayout];
      const expanded = routes.includes(href) ? routes.filter((route) => route !== href) : [...routes, href];
      return { scope, changed: true, notice: previous?.notice ?? ``, preferences: { ...preferences, [submenuLayout]: expanded } };
    });
  }, [scope, allowedKeys, submenuLayout, defaultPreferences]);
  const value = useMemo(() => ({ badgeError, collapsed, badgeCounts, badgeLoading, toggleCollapsed, expandedRoutes, toggleSubmenu, tablePagination, preferenceNotice }), [badgeError, collapsed, badgeCounts, badgeLoading, toggleCollapsed, expandedRoutes, toggleSubmenu, tablePagination, preferenceNotice]);

  return <AccountNavigationContext.Provider value={value}>{children}</AccountNavigationContext.Provider>;
};
