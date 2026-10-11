import { getToken } from 'firebase/app-check';
import { getFirebaseClient } from '@/shared/firebase/client';
import { observabilityMetrics } from '@/shared/observability/observability-types';
import type { ObservabilityPeriod, ObservabilityReport } from '@/shared/observability/observability-types';

export class ObservabilityRequestError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = `ObservabilityRequestError`;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === `object` && !Array.isArray(value);
const validDate = (value: unknown) => typeof value === `string` && Number.isFinite(Date.parse(value));
const validValues = (value: unknown) => {
  if (!isRecord(value)) return false;
  return observabilityMetrics.every((metric) => {
    const measurement = value[metric];
    return measurement === null || (typeof measurement === `number` && Number.isFinite(measurement) && measurement >= 0);
  });
};
const validRows = (value: unknown, field: `value` | `timestamp`) => Array.isArray(value) && value.length <= 1000 && value.every((row: unknown) => isRecord(row) && typeof row[field] === `string` && validValues(row.values));
const validReport = (value: unknown, period: ObservabilityPeriod): value is ObservabilityReport => {
  if (!isRecord(value) || value.period !== period || !validValues(value.totals)) return false;
  if (!validRows(value.trend, `timestamp`) || !validRows(value.routes, `value`) || !validRows(value.statuses, `value`) || !validRows(value.cache, `value`)) return false;
  if (!Array.isArray(value.warnings) || value.warnings.some((warning: unknown) => typeof warning !== `string`)) return false;
  if (![`start`, `end`, `fetchedAt`, `cacheExpiresAt`].every((field) => validDate(value[field]))) return false;
  return typeof value.bucketSeconds === `number` && Number.isSafeInteger(value.bucketSeconds) && value.bucketSeconds > 0;
};

export const getObservabilityReport = async (period: ObservabilityPeriod, expectedFirebaseUid: string, signal: AbortSignal): Promise<ObservabilityReport> => {
  const { auth, appCheck } = getFirebaseClient();
  const firebaseUser = auth.currentUser;
  if (!firebaseUser || firebaseUser.uid !== expectedFirebaseUid) throw new ObservabilityRequestError(`observability_session_changed`, `Sign In Again To View Observability`);
  const headers: Record<string, string> = { Accept: `application/json`, Authorization: `Bearer ${await firebaseUser.getIdToken()}` };
  if (appCheck) headers[`X-Firebase-AppCheck`] = (await getToken(appCheck)).token;
  if (signal.aborted) throw new DOMException(`Observability Request Cancelled`, `AbortError`);
  if (auth.currentUser?.uid !== expectedFirebaseUid) throw new ObservabilityRequestError(`observability_session_changed`, `Your Account Changed, Try Again`);
  const query = new URLSearchParams({ period: `${period}` });
  const response = await fetch(`/api/admin/observability?${query}`, { signal, headers, cache: `no-store`, redirect: `error` });
  const result: unknown = await response.json().catch(() => null);
  if (signal.aborted) throw new DOMException(`Observability Request Cancelled`, `AbortError`);
  if (auth.currentUser?.uid !== expectedFirebaseUid) throw new ObservabilityRequestError(`observability_session_changed`, `Your Account Changed, Try Again`);
  if (!response.ok) {
    const error = isRecord(result) && isRecord(result.error) ? result.error : null;
    throw new ObservabilityRequestError(typeof error?.code === `string` ? error.code : `observability_unavailable`, typeof error?.message === `string` ? error.message : `Observability Could Not Be Loaded`);
  }
  const report = isRecord(result) ? result.report : null;
  if (!validReport(report, period)) {
    throw new ObservabilityRequestError(`observability_invalid_response`, `Observability Returned An Unexpected Response`);
  }
  return report;
};
