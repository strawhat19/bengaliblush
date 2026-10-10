'use client';

import { useMemo, useState, useCallback, createContext, type ReactNode } from 'react';

type AccountNavigationContextValue = {
  collapsed: boolean;
  toggleCollapsed: () => void;
  expandedRoutes: readonly string[];
  toggleSubmenu: (href: string) => void;
};

export const AccountNavigationContext = createContext<AccountNavigationContextValue | undefined>(undefined);

export const AccountNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedRoutes, setExpandedRoutes] = useState<readonly string[]>([]);
  const toggleCollapsed = useCallback(() => setCollapsed((current) => !current), []);
  const toggleSubmenu = useCallback((href: string) => setExpandedRoutes((current) => current.includes(href) ? current.filter((route) => route !== href) : [...current, href]), []);
  const value = useMemo(() => ({ collapsed, toggleCollapsed, expandedRoutes, toggleSubmenu }), [collapsed, toggleCollapsed, expandedRoutes, toggleSubmenu]);

  return <AccountNavigationContext.Provider value={value}>{children}</AccountNavigationContext.Provider>;
};
