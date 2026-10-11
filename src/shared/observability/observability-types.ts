export type ObservabilityPeriod = 24 | 168 | 720;

export const observabilityMetrics = [
  `cpuMs`, `errors`, `requests`, `ttfbP75Ms`, `invocations`, `transferBytes`,
  `peakMemoryMb`, `durationP95Ms`, `throttlePercent`, `provisionedMemoryMb`,
] as const;

export type ObservabilityMetric = typeof observabilityMetrics[number];
export type ObservabilityValues = Record<ObservabilityMetric, number | null>;
export type ObservabilityRow = { value: string; values: ObservabilityValues };
export type ObservabilityPoint = { timestamp: string; values: ObservabilityValues };
export type ObservabilityFailure = { code: string; message: string };

export type ObservabilityReport = {
  start: string;
  end: string;
  fetchedAt: string;
  warnings: string[];
  bucketSeconds: number;
  cacheExpiresAt: string;
  period: ObservabilityPeriod;
  totals: ObservabilityValues;
  routes: ObservabilityRow[];
  cache: ObservabilityRow[];
  statuses: ObservabilityRow[];
  trend: ObservabilityPoint[];
};
