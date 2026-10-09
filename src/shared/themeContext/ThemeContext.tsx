'use client';

import { useAuth } from '@/shared/authContext/useAuth';
import { useLocalStorage } from '@/shared/config/storefront';
import { readPreference, writePreference } from '@/shared/storage/preference-storage';
import { createContext, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { applyThemeMode, isThemeMode, THEME_STORAGE_KEY, GUEST_THEME_STORAGE_KEY, type ThemeMode } from './theme';

type ThemeContextValue = {
  mode: ThemeMode;
  notice?: string;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
};

type AccountTheme = {
  saving: boolean;
  accountId: string;
  desiredMode?: ThemeMode;
  queuedMode?: ThemeMode;
  observedMode?: ThemeMode;
  observedRevision: string;
  desiredRevision: string;
  save: (mode: ThemeMode) => Promise<void>;
};

const readGuestTheme = (visitMode?: ThemeMode): { mode: ThemeMode; notice: string | null } => {
  const guest = readPreference(GUEST_THEME_STORAGE_KEY, isThemeMode);
  if (guest.value || guest.notice) return { mode: guest.value ?? visitMode ?? `light`, notice: guest.notice };
  const previous = visitMode === undefined ? readPreference(THEME_STORAGE_KEY, isThemeMode) : null;
  const mode = visitMode ?? previous?.value ?? `light`;
  const notice = writePreference(GUEST_THEME_STORAGE_KEY, mode) ?? previous?.notice ?? null;
  return { mode, notice };
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const guestActiveRef = useRef(false);
  const modeRef = useRef<ThemeMode>(`light`);
  const guestModeRef = useRef<ThemeMode>(`light`);
  const accountRef = useRef<AccountTheme | null>(null);
  const { user, loading, updateTheme } = useAuth();
  const [mode, setMode] = useState<ThemeMode>(`light`);
  const [notice, setNotice] = useState<string>();

  const displayMode = useCallback((nextMode: ThemeMode) => {
    modeRef.current = nextMode;
    applyThemeMode(nextMode);
    setMode(nextMode);
  }, []);

  const saveTheme = useCallback((account: AccountTheme, nextMode: ThemeMode) => {
    account.desiredMode = nextMode;
    account.queuedMode = nextMode;
    account.desiredRevision = account.observedRevision;
    setNotice(undefined);
    if (account.saving) return;
    account.saving = true;
    void (async () => {
      try {
        while (accountRef.current === account && account.queuedMode) {
          const queuedMode = account.queuedMode;
          account.queuedMode = undefined;
          account.desiredRevision = account.observedRevision;
          try {
            await account.save(queuedMode);
            if (accountRef.current === account) setNotice(undefined);
          } catch {
            if (accountRef.current === account && !account.queuedMode) setNotice(`Theme Could Not Be Saved. Your Choice Applies For This Visit`);
          }
        }
      } finally {
        account.saving = false;
        if (accountRef.current === account && account.observedMode === account.desiredMode && account.observedRevision !== account.desiredRevision) {
          account.desiredMode = undefined;
          setNotice(undefined);
        }
      }
    })();
  }, []);

  const restoreGuest = useCallback((cache = false) => {
    const saved = readGuestTheme(guestModeRef.current);
    guestModeRef.current = saved.mode;
    displayMode(saved.mode);
    const cacheNotice = cache ? writePreference(THEME_STORAGE_KEY, saved.mode) : undefined;
    setNotice(saved.notice ?? cacheNotice ?? undefined);
  }, [displayMode]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!useLocalStorage || !guestActiveRef.current || accountRef.current) return;
      if (event.key === THEME_STORAGE_KEY || event.key === GUEST_THEME_STORAGE_KEY || event.key === null) restoreGuest();
    };
    const guest = readGuestTheme();
    const cached = readPreference(THEME_STORAGE_KEY, isThemeMode);
    guestActiveRef.current = false;
    guestModeRef.current = guest.mode;
    displayMode(cached.value ?? guest.mode);
    setNotice(cached.notice ?? guest.notice ?? undefined);
    window.addEventListener(`storage`, handleStorage);
    return () => {
      accountRef.current = null;
      window.removeEventListener(`storage`, handleStorage);
    };
  }, [displayMode, restoreGuest]);

  useEffect(() => {
    if (loading) return;
    const previous = accountRef.current;
    if (!user) {
      accountRef.current = null;
      if (!guestActiveRef.current) { restoreGuest(true); guestActiveRef.current = true; }
      return;
    }
    guestActiveRef.current = false;
    const savedMode = isThemeMode(user.theme_mode) ? user.theme_mode : undefined;
    if (previous?.accountId !== user.id) {
      accountRef.current = null;
      const account: AccountTheme = {
        accountId: user.id,
        saving: false,
        save: updateTheme,
        observedMode: savedMode,
        desiredRevision: user.updated_at,
        observedRevision: user.updated_at,
      };
      accountRef.current = account;
      setNotice(undefined);
      const nextMode = savedMode ?? guestModeRef.current;
      displayMode(nextMode);
      writePreference(THEME_STORAGE_KEY, nextMode);
      if (!savedMode) saveTheme(account, nextMode);
      return;
    }
    previous.observedMode = savedMode;
    previous.observedRevision = user.updated_at;
    if (previous.desiredMode) {
      if (previous.saving || previous.queuedMode || savedMode !== previous.desiredMode || user.updated_at === previous.desiredRevision) return;
      previous.desiredMode = undefined;
      setNotice(undefined);
    }
    if (savedMode && modeRef.current !== savedMode) {
      displayMode(savedMode);
      writePreference(THEME_STORAGE_KEY, savedMode);
    }
  }, [user, loading, updateTheme, saveTheme, displayMode, restoreGuest]);

  const setTheme = useCallback((nextMode: ThemeMode) => {
    if (nextMode === modeRef.current && !notice) return;
    displayMode(nextMode);
    const cacheNotice = writePreference(THEME_STORAGE_KEY, nextMode);
    if (user) {
      const account = accountRef.current;
      if (account?.accountId === user.id) saveTheme(account, nextMode);
      return;
    }
    guestModeRef.current = nextMode;
    setNotice(writePreference(GUEST_THEME_STORAGE_KEY, nextMode) ?? cacheNotice ?? undefined);
  }, [user, notice, saveTheme, displayMode]);

  const toggleTheme = useCallback(() => setTheme(modeRef.current === `light` ? `dark` : `light`), [setTheme]);
  const value = useMemo(() => ({ mode, notice, setTheme, toggleTheme }), [mode, notice, setTheme, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
