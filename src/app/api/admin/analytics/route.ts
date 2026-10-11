import type { AnalyticsFilters } from '@/shared/analytics/analytics-types';
import { requireAnalyticsAdmin, AnalyticsAuthError } from '@/shared/analytics/server/analytics-auth';
import { getVercelAnalytics, AnalyticsServiceError } from '@/shared/analytics/server/vercel-analytics';

export const dynamic = `force-dynamic`;
export const runtime = `nodejs`;

const headers = { Vary: `Authorization, X-Firebase-AppCheck`, 'Cache-Control': `private, no-store`, 'X-Content-Type-Options': `nosniff` };
const filterFields = [`to`, `from`, `path`, `device`, `country`, `referrer`] as const;

export const GET = async (request: Request) => {
  try {
    await requireAnalyticsAdmin(request);
    const parameters = new URL(request.url).searchParams;
    if ([...parameters.keys()].some((key) => !filterFields.some((field) => field === key)) || filterFields.some((field) => parameters.getAll(field).length > 1)) {
      throw new AnalyticsServiceError(400, `invalid_analytics_filters`, `Choose Valid Analytics Filters`);
    }
    const filters = Object.fromEntries(filterFields.map((field) => [field, parameters.get(field) ?? ``])) as AnalyticsFilters;
    return Response.json({ report: await getVercelAnalytics(filters) }, { headers });
  } catch (failure) {
    const error = failure instanceof AnalyticsAuthError || failure instanceof AnalyticsServiceError
      ? failure
      : { status: 500, code: `analytics_unavailable`, message: `Analytics Could Not Be Loaded` };
    return Response.json({ error: { code: error.code, message: error.message } }, { headers, status: error.status });
  }
};
