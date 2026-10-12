'use client';

import { useAuth } from '@/shared/authContext/useAuth';
import { accountFeatureRole, effectiveFeatureFlags, unavailableFeatureFlags, planTiersNotice } from './values';
import { saveFeature as persistFeature, subscribeFeatureSettings } from '@/api/features';
import { useRef, useMemo, useState, useEffect, useCallback, useLayoutEffect, createContext, type ReactNode } from 'react';
import type { FeatureKey, FeatureInput, FeaturePlanTier, FeatureSettingsState, EffectiveFeatureFlags } from './types';

type FeatureFlagsContextValue = FeatureSettingsState & {
  accessError: string | null;
  tiersError: string | null;
  accessLoading: boolean;
  tiersLoading: boolean;
  canManageFeatures: boolean;
  tiers: FeaturePlanTier[];
  flags: EffectiveFeatureFlags;
  retry: () => void;
  saveFeature: (key: FeatureKey, input: FeatureInput) => Promise<void>;
};

export const FeatureFlagsContext = createContext<FeatureFlagsContextValue | undefined>(undefined);

export const FeatureFlagsProvider = ({ children }: { children: ReactNode }) => {
  const { user, isOwner, sessionError, loading: accountLoading, inactiveUser, deletionAccountId } = useAuth();
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<FeatureSettingsState>({ error: null, loading: true, settings: null });
  const accountScope = `${user?.id ?? ``}:${user?.firebase_uid ?? ``}:${user?.role ?? ``}:${user?.account_status ?? ``}:${inactiveUser?.id ?? ``}:${deletionAccountId}`;
  const currentScope = useRef(accountScope);
  const retry = useCallback(() => setRevision((value) => value + 1), []);
  useLayoutEffect(() => { currentScope.current = accountScope; }, [accountScope]);

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;
    void Promise.resolve().then(() => {
      if (!active) return;
      unsubscribe = subscribeFeatureSettings((nextState) => { if (active) setState(nextState); });
    }).catch((error: unknown) => {
      if (active) setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : `Feature Settings Are Unavailable` }));
    });
    return () => { active = false; unsubscribe?.(); };
  }, [revision]);

  const accessLoading = accountLoading;
  const accessError = sessionError || (inactiveUser || deletionAccountId ? `Active Owner Access Is Required` : null);
  const canManageFeatures = !accessLoading && !accessError && isOwner;
  const saveFeature = useCallback(async (key: FeatureKey, input: FeatureInput) => {
    const scope = accountScope;
    if (state.loading || state.error) throw new Error(`Wait For Confirmed Feature Settings`);
    if (!canManageFeatures || !user?.id) throw new Error(`Active Owner Access Is Required`);
    await persistFeature(key, input, user.id);
    if (currentScope.current !== scope) throw new Error(`Your Account Changed, Try Again`);
  }, [user, state.error, state.loading, accountScope, canManageFeatures]);
  const error = state.error ?? (sessionError || null);
  const loading = !error && (state.loading || accountLoading);
  const flags = useMemo(() => loading || error || inactiveUser || deletionAccountId
    ? unavailableFeatureFlags : effectiveFeatureFlags(state.settings, accountFeatureRole(user)), [user, error, loading, state.settings, inactiveUser, deletionAccountId]);
  const value = useMemo(() => ({ ...state, error, flags, retry, loading, saveFeature, accessError, accessLoading, canManageFeatures, tiers: [], tiersLoading: false, tiersError: planTiersNotice }), [state, error, flags, retry, loading, saveFeature, accessError, accessLoading, canManageFeatures]);
  return <FeatureFlagsContext.Provider value={value}>{children}</FeatureFlagsContext.Provider>;
};
