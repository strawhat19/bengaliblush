import { getToken } from 'firebase/app-check';
import { getFirebaseClient } from '@/shared/firebase/client';
import type { AnalyticsReport, AnalyticsFilters } from '@/shared/analytics/analytics-types';

export class AnalyticsRequestError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = `AnalyticsRequestError`;
  }
}

export const getTrafficReport = async (filters: AnalyticsFilters, expectedFirebaseUid: string, signal: AbortSignal): Promise<AnalyticsReport> => {
  const { auth, appCheck } = getFirebaseClient();
  const firebaseUser = auth.currentUser;
  if (!firebaseUser || firebaseUser.uid !== expectedFirebaseUid) throw new AnalyticsRequestError(`analytics_session_changed`, `Sign In Again To View Analytics`);
  const headers: Record<string, string> = { Accept: `application/json`, Authorization: `Bearer ${await firebaseUser.getIdToken()}` };
  if (appCheck) headers[`X-Firebase-AppCheck`] = (await getToken(appCheck)).token;
  if (auth.currentUser?.uid !== expectedFirebaseUid) throw new AnalyticsRequestError(`analytics_session_changed`, `Your Account Changed, Try Again`);
  const query = new URLSearchParams(filters);
  const response = await fetch(`/api/admin/analytics?${query}`, { signal, headers, cache: `no-store` });
  const result = await response.json().catch(() => null) as { report?: AnalyticsReport; error?: { code?: string; message?: string } } | null;
  if (signal.aborted) throw new DOMException(`Analytics Request Cancelled`, `AbortError`);
  if (auth.currentUser?.uid !== expectedFirebaseUid) throw new AnalyticsRequestError(`analytics_session_changed`, `Your Account Changed, Try Again`);
  if (!response.ok) throw new AnalyticsRequestError(result?.error?.code ?? `analytics_unavailable`, result?.error?.message ?? `Analytics Could Not Be Loaded`);
  if (!result?.report?.filters || !Array.isArray(result.report.trend)) throw new AnalyticsRequestError(`analytics_invalid_response`, `Analytics Returned An Unexpected Response`);
  return result.report;
};
