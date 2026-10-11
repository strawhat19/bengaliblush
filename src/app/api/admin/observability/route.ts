import type { ObservabilityPeriod } from '@/shared/observability/observability-types';
import { requireAnalyticsAdmin, AnalyticsAuthError } from '@/shared/analytics/server/analytics-auth';
import { getVercelObservability, ObservabilityServiceError } from '@/shared/observability/server/vercel-observability';

export const dynamic = `force-dynamic`;
export const runtime = `nodejs`;

const headers = { Vary: `Authorization, X-Firebase-AppCheck`, 'Cache-Control': `private, no-store`, 'X-Content-Type-Options': `nosniff` };

export const GET = async (request: Request) => {
  try {
    await requireAnalyticsAdmin(request);
    const parameters = new URL(request.url).searchParams;
    const period = parameters.get(`period`) ?? `24`;
    if ([...parameters.keys()].some((key) => key !== `period`) || parameters.getAll(`period`).length > 1 || ![`24`, `168`, `720`].includes(period)) {
      throw new ObservabilityServiceError(400, `invalid_observability_period`, `Choose 24 Hours, 7 Days Or 30 Days`);
    }
    return Response.json({ report: await getVercelObservability(Number(period) as ObservabilityPeriod) }, { headers });
  } catch (failure) {
    const error = failure instanceof AnalyticsAuthError || failure instanceof ObservabilityServiceError
      ? failure
      : { status: 500, code: `observability_unavailable`, message: `Observability Could Not Be Loaded` };
    return Response.json({ error: { code: error.code, message: error.message } }, { headers, status: error.status });
  }
};
