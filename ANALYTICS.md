# Website Analytics

The admin Analytics page reads the project's existing Vercel Web Analytics through an authenticated Next.js endpoint. The existing tracker continues to collect page views; this integration adds reporting without another tracker or a Firestore traffic collection.

## Connect Live Data

Create a [Vercel access token](https://vercel.com/account/settings/tokens) scoped to the Piratechs team, with access to BengaliBlush analytics. Add these server-only environment variables in the project's Vercel settings and local `.env.local` when using the local dashboard:

```dotenv
VERCEL_ANALYTICS_TOKEN=<your-token>
VERCEL_ANALYTICS_TEAM_ID=team_2hW8Z1s5cxdaS56fE1tnAMI9
VERCEL_ANALYTICS_PROJECT_ID=prj_lRyua3bLVkp76DiQ0XOMerm9ULBS
```

`VERCEL_ANALYTICS_TOKEN` is a normal Vercel access token, not a separate analytics key. An existing server-only `VERCEL_API_TOKEN` with access to this team/project also works; the analytics-specific variable takes precedence when both are present.

Keep the token out of `NEXT_PUBLIC_*`, Firestore, chat, and source control. Vercel environment changes apply to subsequent deployments; restart the local server after changing local environment variables. Existing Firebase configuration is also required. The server falls back to `VERCEL_PROJECT_ID` and `VERCEL_TEAM_ID` when available, but explicit analytics IDs work locally too.

Missing configuration and provider failures display connection/error states. There is no sample-data fallback. The browser never receives the Vercel token.

## Reports And Filters

- Animated visitors/pageviews trends, period comparisons, countries, referrers, top pages, and devices.
- 7, 30, or 90 days, or a custom inclusive UTC range of up to 90 days. The equal-length previous period must also fit within the last 365 days. Today can be incomplete.
- Country, referrer, exact page path, and device filters apply to the complete report and its comparison. Click breakdown rows or use the filter menus. `Others` is Vercel's combined remainder and cannot be selected as an individual segment.
- Studio activity uses the same date range and links to accounts, requests, appointments, and orders. It covers only the recent records already loaded by the admin dashboard (up to 50 per collection), and is independent of traffic segment filters.
- JSON export downloads the currently displayed traffic report, including its filters and retrieval timestamps.

Vercel visitors are anonymous measurements. Visitor identifiers reset daily, so multi-day visitor figures do not represent persistent unique people. Country is approximate; this report does not offer city-level data. Traffic cannot be joined to individual Firestore users, and the activity cards do not imply attributed conversions. Totals come from Vercel's count endpoint rather than adding visitors across pages, countries, or dates.

## Authenticated JSON Endpoint

`GET /api/admin/analytics?from=2026-10-01&to=2026-10-07&country=US&device=mobile`

Send the signed-in user's Firebase ID token in `Authorization: Bearer <token>`. If App Check is enabled, send `X-Firebase-AppCheck` too. Only active Admin/Owner accounts receive reports. The server validates the token with Firebase Auth and reads current account permissions through Firestore Security Rules on every request, including cache hits. Responses use `Cache-Control: private, no-store`.

Optional filters are `country`, `device`, `referrer`, and `path`. Empty strings select all values. `__direct__` selects direct/no-referrer traffic; `__unknown__` selects an unknown country. Responses contain `{ report }` on success or `{ error: { code, message } }` on failure.

## Usage

A fresh report makes seven Vercel reporting queries. A bounded five-minute cache and request deduplication reduce repeats within a server instance; cold starts and multiple instances have separate caches. Refresh requests may return the current cached report until it expires. Reports are not persisted in Firestore.

Authorization adds two Firestore document reads per report request, plus any dependent reads evaluated by Security Rules. Existing dashboard listeners continue to incur their normal usage. Firebase API-key restrictions must permit the server's Firebase Auth request; browser-referrer-only restrictions can prevent authorization.

No extra analytics service or paid add-on is provisioned. Existing Vercel analytics usage, function execution, and Firebase reads remain subject to your plans' normal billing. See [Vercel Web Analytics pricing](https://vercel.com/docs/analytics/limits-and-pricing) and [API documentation](https://vercel.com/docs/analytics/web-analytics-api).

## Runtime Health

The Dashboard includes a Runtime Health card, and Analytics has Website Traffic and Runtime Health views. Runtime reports use the same server-only Vercel token, team, and project configuration. No additional tracker or Firestore collection is created.

Runtime Health reads production metrics from Vercel Observability: active function CPU time, average CPU throttling, peak and provisioned memory, p95 function duration, p75 time to first byte, function invocations, requests, 5xx responses, and data transfer. CPU time measures active compute rather than host utilization. Missing measurements remain unavailable instead of appearing as zero. Percentiles and peak values come from Vercel's complete-window summary, rather than combining bucket percentiles.

Choose 24 hours, 7 days, or 30 days independently of traffic filters. Inspect animated trends, function routes, HTTP statuses, and cache results. Route rankings cover up to 20 groups. Export JSON downloads the current runtime report. Refresh can reuse the bounded five-minute server cache; there is no automatic polling.

`GET /api/admin/observability?period=24` returns `{ report }` with totals, time buckets, route/status/cache breakdowns, and optional breakdown warnings. `period` accepts `24`, `168`, or `720` hours. This endpoint uses the same active Admin/Owner authorization and private response headers as traffic reporting. Every uncached report makes one main metrics query and three breakdown queries. An unavailable breakdown does not discard the main report.

Runtime queries require the project's existing [Observability Plus access](https://vercel.com/docs/observability/observability-plus). Current pricing is $1.20 per million collected events with no monthly base fee and 30-day retention. This integration does not activate Plus or change billing settings. Existing team access successfully returned live metrics during API discovery. See the [metrics API/CLI documentation](https://vercel.com/docs/cli/metrics) for available measurements.
