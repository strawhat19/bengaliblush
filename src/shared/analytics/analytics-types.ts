export type AnalyticsFilters = {
  to: string;
  from: string;
  path: string;
  device: string;
  country: string;
  referrer: string;
};

export type AnalyticsTotals = { visitors: number; pageviews: number };
export type AnalyticsTrendPoint = AnalyticsTotals & { date: string };
export type AnalyticsBreakdown = AnalyticsTotals & { value: string };

export type AnalyticsReport = {
  fetchedAt: string;
  cacheExpiresAt: string;
  filters: AnalyticsFilters;
  current: AnalyticsTotals;
  previous: AnalyticsTotals;
  trend: AnalyticsTrendPoint[];
  pages: AnalyticsBreakdown[];
  devices: AnalyticsBreakdown[];
  countries: AnalyticsBreakdown[];
  referrers: AnalyticsBreakdown[];
};

export type AnalyticsFailure = { code: string; message: string };
