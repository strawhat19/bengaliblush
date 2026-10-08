'use client';

import { useLocalStorage } from '@/shared/config/storefront';
import { readPreference, writePreference } from '@/shared/storage/preference-storage';
import { applyThemeMode, isThemeMode, THEME_STORAGE_KEY, type ThemeMode } from './theme';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

type ThemeContextValue = {
  mode: ThemeMode;
  notice?: string;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>(`light`);
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    const restorePreference = () => {
      const saved = readPreference(THEME_STORAGE_KEY, isThemeMode);
      const nextMode = saved.value ?? `light`;
      applyThemeMode(nextMode);
      setMode(nextMode);
      setNotice(saved.notice ?? undefined);
    };
    const handleStorage = (event: StorageEvent) => {
      if (!useLocalStorage) return;
      if (event.key === THEME_STORAGE_KEY || event.key === null) restorePreference();
    };

    restorePreference();
    window.addEventListener(`storage`, handleStorage);
    return () => window.removeEventListener(`storage`, handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextMode = mode === `light` ? `dark` : `light`;
    applyThemeMode(nextMode);
    setMode(nextMode);
    setNotice(writePreference(THEME_STORAGE_KEY, nextMode) ?? undefined);
  }, [mode]);

  const value = useMemo(() => ({ mode, notice, toggleTheme }), [mode, notice, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
