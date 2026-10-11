'use client';

import { useAuth } from '@/shared/authContext/useAuth';
import { useEffect, useState, useCallback } from 'react';
import { getTrafficReport, AnalyticsRequestError } from '@/api/analytics';
import type { AnalyticsReport, AnalyticsFilters, AnalyticsFailure } from './analytics-types';

export const getAnalyticsDateRange = (days: number) => {
  const end = new Date();
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - days + 1);
  return { to: end.toISOString().slice(0, 10), from: start.toISOString().slice(0, 10) };
};

type TrafficState = { requestKey: string; scopeKey: string; report: AnalyticsReport | null; error: AnalyticsFailure | null };

export const useTrafficAnalytics = () => {
  const { user, isAdmin } = useAuth();
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<TrafficState | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>(() => ({ path: ``, device: ``, country: ``, referrer: ``, ...getAnalyticsDateRange(7) }));
  const accountId = user?.id ?? ``;
  const firebaseUid = user?.firebase_uid ?? ``;
  const filterKey = JSON.stringify(filters);
  const scopeKey = JSON.stringify([accountId, firebaseUid, isAdmin, filterKey]);
  const requestKey = JSON.stringify([scopeKey, revision]);
  const report = isAdmin && state?.scopeKey === scopeKey ? state.report : null;
  const error = isAdmin && state?.requestKey === requestKey ? state.error : null;
  const loading = Boolean(accountId && isAdmin && state?.requestKey !== requestKey);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    if (!accountId || !firebaseUid || !isAdmin) return;
    let active = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      void getTrafficReport(JSON.parse(filterKey) as AnalyticsFilters, firebaseUid, controller.signal).then((report) => {
        if (active) setState({ report, scopeKey, requestKey, error: null });
      }).catch((failure: unknown) => {
        if (!active || controller.signal.aborted) return;
        const error = failure instanceof AnalyticsRequestError
          ? { code: failure.code, message: failure.message }
          : { code: `analytics_unavailable`, message: `Analytics Could Not Be Loaded, Try Again` };
        setState({ error, scopeKey, requestKey, report: null });
      });
    }, 250);
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [isAdmin, filterKey, scopeKey, accountId, requestKey, firebaseUid]);

  return { error, report, filters, loading, refresh, setFilters };
};
