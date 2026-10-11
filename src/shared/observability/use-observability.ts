'use client';

import { useAuth } from '@/shared/authContext/useAuth';
import { useEffect, useState, useCallback } from 'react';
import { getObservabilityReport, ObservabilityRequestError } from '@/api/observability';
import type { ObservabilityPeriod, ObservabilityReport, ObservabilityFailure } from './observability-types';

type ObservabilityState = { requestKey: string; scopeKey: string; report: ObservabilityReport | null; error: ObservabilityFailure | null };

export const useObservability = () => {
  const { user, isAdmin } = useAuth();
  const [revision, setRevision] = useState(0);
  const [period, setPeriod] = useState<ObservabilityPeriod>(24);
  const [state, setState] = useState<ObservabilityState | null>(null);
  const accountId = user?.id ?? ``;
  const firebaseUid = user?.firebase_uid ?? ``;
  const scopeKey = JSON.stringify([accountId, firebaseUid, isAdmin, period]);
  const requestKey = JSON.stringify([scopeKey, revision]);
  const report = isAdmin && state?.scopeKey === scopeKey ? state.report : null;
  const error = isAdmin && state?.requestKey === requestKey ? state.error : null;
  const loading = Boolean(accountId && firebaseUid && isAdmin && state?.requestKey !== requestKey);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!accountId || !firebaseUid || !isAdmin) return;
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      void getObservabilityReport(period, firebaseUid, controller.signal).then((report) => {
        if (active) setState({ report, scopeKey, requestKey, error: null });
      }).catch((failure: unknown) => {
        if (!active || controller.signal.aborted) return;
        const error = failure instanceof ObservabilityRequestError
          ? { code: failure.code, message: failure.message }
          : { code: `observability_unavailable`, message: `Observability Could Not Be Loaded, Try Again` };
        setState({ error, scopeKey, requestKey, report: null });
      });
    }, 250);
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [period, isAdmin, scopeKey, accountId, requestKey, firebaseUid]);

  return { error, report, period, loading, refresh, setPeriod };
};
