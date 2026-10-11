# Profile, Admin, And Dashboard System

This is the reusable connected account and administration blueprint. Preserve an existing framework and map these boundaries to its folders. New full applications use Firebase Authentication, realtime Cloud Firestore, and a custom admin dashboard by default unless the user chooses another backend or a local demo. A small page change does not authorize adding the whole system.

## Shared Boundaries

Keep Firebase initialization under shared/firebase/, account state under shared/authContext/ or equivalent, role capabilities under shared/authentication/ or shared/authorization/, and navigation metadata in one shared registry. Separate shared/admin/, shared/analytics/, and shared/observability/ types and hooks where the feature needs them. Components own views and styles; services own subscriptions, persistence, serialization, and permission-sensitive operations.

Give Profile, AccountNavigation, AdminDashboard, AdminRecords, AnalyticsCharts, and ObservabilityPanel separate component folders when they exist. Share logic across web and native views; use SCSS on web and platform style objects on native. Extend existing API facades instead of introducing a second cache or routing system. A static web export needs a deployed server endpoint for privileged reporting; use the framework's supported server output or separate API functions without importing secrets into the client.

## Firebase Configuration And Accounts

Use one initialized Firebase app per runtime and environment. Commit a secret-free .env.example with the framework's public Firebase configuration names and separate server-only names. Firebase client configuration identifies the project; it does not replace restrictive Firestore rules. Server credentials, Firebase Admin SDK credentials, Vercel access tokens, and webhook secrets never use public environment prefixes or enter profile storage, localStorage, URLs, or logs. Preview and production should use the intended Firebase project and reporting scope.

Enable Google in Firebase Authentication and allow the actual local, preview, and custom-domain sign-in origins. Offer the supported Google sign-in flow on each platform and email/password sign-in and sign-up when requested. Use Firebase's account lifecycle, password reset, email verification, and persistence APIs instead of storing passwords yourself. Browser popup/redirect code belongs only in supported web views; native uses its supported Google credential flow. Handle cancellations, disabled providers, blocked popups, and account-linking conflicts with concise feedback. See [Firebase Google Authentication](https://firebase.google.com/docs/auth/web/google-signin).

After Firebase authenticates, create or load one app-owned User record through an idempotent operation. New accounts are Subscriber, active, and private; never promote the first signup automatically. Store the provider UID as firebase_uid and resolve it to the stable app-owned User ID. Keep a private immutable UID mapping such as accountAccess/{firebase_uid}, counters, and aggregate metadata separate from app content records; infrastructure keys follow their lookup purpose.

The auth provider waits for both the Firebase session and its app account before granting access. Listen to the account's authoritative status/role record, handle denied or missing accounts explicitly, and reset per-account state on sign-out, role loss, account change, or account deactivation. Guard async results with the originating UID or a revision so an old request cannot populate a new account. Sign out through Firebase and unsubscribe account listeners.

## Records And Realtime Firestore

Application records use Type_Number_Name_Date_UUID IDs, a positive auto-incrementing number matching the ID, and named external IDs such as firebase_uid or stripe_order_id. Preserve existing IDs during updates and imports. Create the next collection number, User mapping, and record together in a Firestore transaction or a trusted backend operation. Do not use collection length or client max+1 for shared data. See [Firestore Transactions](https://firebase.google.com/docs/firestore/manage-data/transactions).

Serialize class models at the service boundary. Keep one consistent timestamp representation in the app and convert Firestore Timestamp/serverTimestamp values through its adapter. Use server-owned created/updated times in the database where appropriate; do not mutate client state inside a retryable transaction. Include owner references and explicit visibility where the feature needs them.

Use onSnapshot for account records, active domain/feature queries, and summary documents that should update live. Return the unsubscribe function and dispose on unmount, account changes, changed query filters, and lost permissions. Keep bounded queries, cursor pagination, documented composite indexes, and useful pending/error/empty states. Surface cached or pending-write data accurately when it affects the UI. See [Firestore Realtime Listeners](https://firebase.google.com/docs/firestore/query-data/listen).

A loaded page count is not a whole-collection count. Prefer maintained summary documents for large dashboards; update them on trusted mutations or backend triggers and listen to those summaries. Deduplicate retried work. Avoid subscribing to every user's entire history just to draw a chart. Keep optional sample data disabled and visibly separate from production records. Never replace a denied or failed Firestore read with successful empty local data.

Keep public display projections separate from private account records: Firestore reads authorize whole documents, so hiding a field in a component does not protect it. Credentials, emails, roles, account status, and private feature records need their own appropriate read rules. Profile visibility must not publish private account fields. See [Firestore Field Access](https://firebase.google.com/docs/firestore/security/rules-fields).

## Roles And Authorization

Preserve persisted role values and map labels such as Administrator to Admin rather than rewriting old records without a migration. Use explicit capabilities for new permission checks; enum order alone cannot express a Developer's technical access separately from an Admin's operational access.

| Role | Default Capabilities |
| --- | --- |
| Subscriber | Edit own profile and settings; access own feature data |
| Developer | View dashboard, analytics, and technical observability; no implicit user administration or secrets |
| Admin | Manage app-specific operational records and eligible users; view dashboard and reports |
| Owner | Admin capabilities plus trusted role assignment, app configuration, and ownership management |
| Other Existing Roles | Keep current permissions; grant new capabilities deliberately |

Treat this as a starting policy and adapt explicit capabilities to the user's app. Share capability definitions between sidebar visibility, direct route guards, service operations, and server checks. Account identity and active status are prerequisites for protected access. Unknown or malformed roles fail closed.

Ordinary profile updates allow only editable name, avatar, bio, preferences, and privacy fields supported by the app. Clients cannot write their own role, permissions, number, ID, firebase_uid, ownership, account mapping, or server-managed fields. Restrict role assignment to a trusted Owner operation and record actor, target, previous role, new role, and timestamp in an audit record. Prevent an Admin from demoting/deleting an Owner or granting Owner/Developer/Admin privileges. Protect the last active Owner from removal and use an explicit owner-transfer operation where needed.

Choose a protected authoritative Firestore role record or verified Firebase custom claims and define which one drives access. Only trusted server/Admin SDK operations set privileged claims. If claims are used, handle token refresh and claim propagation after role changes; do not trust claims supplied separately by the browser. Bootstrap an initial Owner through a deliberate trusted setup operation, not a public form, guessed email domain, or first-user rule. See [Firebase Custom Claims](https://firebase.google.com/docs/auth/admin/custom-claims).

Write Firestore rules for each collection's reads, ownership, editable fields, creation defaults, and role/counter invariants. Apply matching constraints to queries because rules are not post-query filters. A browser role check only controls presentation. A privileged server must verify the Firebase ID token and load/check the trusted role and current account status before responding; the Admin SDK bypasses Firestore rules, so its routes must authorize themselves. See [Firebase ID Token Verification](https://firebase.google.com/docs/auth/admin/verify-id-tokens).

## Profile And Admin Navigation

Profile is an authenticated account page with an identity card, editable profile/preferences, and links to private account tools. Provider avatar falls back to a themed initial. Use one reusable sidebar for Profile and permitted Admin sections; show active routes, consistent icons, section labels, and accurate counts. Support a desktop collapsible sidebar and a keyboard-accessible mobile drawer or equivalent native navigation, with focus handling and persistent open/collapsed state where useful.

Group account tools separately from admin operations. Start the admin area with Dashboard, relevant feature records, Users when authorized, Analytics, and Observability. Add only modules used by the app: a domain tool can show domains, watched domains, registrar coverage, renewals, and portfolio value; another app chooses its own business records. Preserve useful canonical routes and aliases instead of renaming working URLs to match an example.

Use a shared skeleton for initial loads, honest zero/empty states, retry actions for failures, searchable/filterable records, and bounded pagination. Status cells follow actionsCell, rowStatus, statusDotWrap, statusDot, and statusText with green/gray/red states. Use descriptive element IDs including record IDs, the current theme tokens, concise Title Case feedback, and icons with accessible text or labels.

## Dashboard And Animated Charts

Dashboard cards combine the app's actual feature summaries, eligible user/account counts, recent activity, and reporting health. Keep business data, website traffic, and platform operations distinguishable by source and time window. Value/currency charts use the app's real valuations; account counts do not stand in for website visitors.

Chart series come from typed service results or trusted Firestore aggregates. Provide a date range, readable axes and units, legends, hover/tap details, current/previous period comparisons only when both ranges are available, and a textual/table alternative for assistive access. Use the installed chart stack, or lightweight SVG for simple charts, rather than adding several animation libraries. Animate entrances and value transitions smoothly, preserve stable keys, and respect prefers-reduced-motion or the native equivalent. An empty period renders its empty state; it does not trigger random data.

Separate loading, configured-but-empty, stale, unavailable, and error states. Include source, selected period/timezone, and fetched/updated time when useful. A live Firestore listener is realtime; a cached or periodically refreshed provider report must disclose its refresh behavior. Prevent stale request results after filters or accounts change.

## Vercel Analytics And Observability

Collection and reporting are separate integrations. Mount @vercel/analytics once in the web shell using its supported framework entrypoint and enable Web Analytics for the linked Vercel project. Add @vercel/speed-insights when performance collection is requested. Redact sensitive paths/event data and never send emails, tokens, connection secrets, or private account fields to analytics. See [Vercel Analytics SDK](https://vercel.com/docs/analytics/package).

As checked October 11, 2026, Vercel provides a public Web Analytics reporting API. Fetch it from a protected server using a server-only Vercel token, fixed project scope, and teamId/slug only for team projects. Use /v1/query/web-analytics/visits/aggregate for date-range/dimension reports. Exact production period totals can use by=environment with a production filter, yielding one group; use by=day for trends. /visits/count supports optional since/until and production totals according to its endpoint reference. Explicitly define UTC boundaries and previous periods, respect inclusive endpoints and reporting windows, and avoid treating an undated count as a selected period. Validate the current response schema and bound/encode filters. Preserve the provider's visitor definition rather than deriving unique period visitors by summing daily rows. See [Reporting Guide](https://vercel.com/docs/analytics/web-analytics-api), [Aggregate Reference](https://vercel.com/docs/rest-api/web-analytics/aggregates-page-views), and [Count Reference](https://vercel.com/docs/rest-api/web-analytics/counts-page-views).

Reporting routes verify the caller's Firebase token, active account, and analytics capability before loading provider data. Never accept arbitrary project IDs or provider endpoints from the client. Use bounded timeouts, request deduplication, short server caches, and honest configuration/access/rate-limit/provider errors. Return normalized typed reports; preserve missing values as unavailable instead of zero. Abort client requests and clear charts on account or permission changes.

For platform observability, discover supported metric names, dimensions, units, and aggregations from the official provider interface before implementing queries. Official vercel metrics schema and vercel metrics ... --format json support structured exports; platform metrics other than Web Analytics/Speed Insights require Observability Plus at the time of writing. A trusted scheduled export can normalize reports into private Firestore summaries that the authorized dashboard listens to. See [Vercel Metrics](https://vercel.com/docs/cli/metrics).

As checked October 11, 2026 at [Vercel commit c628be7835e03a965b93e9cf9e2bd5ac2acbf5eb](https://github.com/vercel/vercel/commit/c628be7835e03a965b93e9cf9e2bd5ac2acbf5eb), the official open-source CLI uses /metrics/v1 for catalog discovery and canonical queries. A server adapter may follow this provider implementation with fixed owner/project scope, capability discovery, response validation, and unsupported/plan states. This source-backed interface differs from a documented public REST endpoint; record the adapter's reviewed version/commit and recheck its contract when updating. Never assume a private dashboard endpoint is universally supported. See the pinned [schema API](https://github.com/vercel/vercel/blob/c628be7835e03a965b93e9cf9e2bd5ac2acbf5eb/packages/cli/src/commands/metrics/schema-api.ts), [query implementation](https://github.com/vercel/vercel/blob/c628be7835e03a965b93e9cf9e2bd5ac2acbf5eb/packages/cli/src/commands/metrics/query.ts), and [response types](https://github.com/vercel/vercel/blob/c628be7835e03a965b93e9cf9e2bd5ac2acbf5eb/packages/cli/src/commands/metrics/types.ts).

Drains are an alternative when the configured plan supports them. Verify delivery signatures on raw request bytes, limit payloads, validate project/environment, deduplicate retries, and aggregate accepted events server-side into private summaries. Apply retention and do not expose raw logs or traces to Subscriber accounts. Data arrives after ingestion and need not reproduce Vercel dashboard totals exactly when sampling differs. See [Vercel Drains](https://vercel.com/docs/drains) and [Drains Security](https://vercel.com/docs/drains/security).

Use Vercel Function custom metrics for meaningful application measurements when requested; keep metric names/attributes bounded and avoid personal data. Their emission and querying are separate concerns. See [Vercel Custom Metrics](https://vercel.com/docs/observability/custom-metrics). Show request volume, errors, latency, CPU, memory, transfer, or deployment information only where the source provides them. Do not fabricate host uptime, browser CPU, global memory use, billing totals, or percentages from unrelated values.

If configuration, project access, plan entitlement, historical data, or a supported reporting interface is absent, finish the component and typed integration boundary and show the actual unavailable/setup state. Copying this skill cannot supply credentials, enable Google, deploy rules/indexes, purchase provider features, or create a Vercel/Firebase project.

## Reviewable Completion

Deliver relevant account/admin routes, shared providers and services, role capabilities, Firestore rules/index definitions, private reporting endpoints, themed charts, secret-free environment examples, and project-specific setup notes for the requested system. Preserve existing uncommitted work. Record actual external setup still needed and distinguish implemented source from a connected live service. Respect AGENTS.md: leave builds, tests, UI verification, commits, and deployment to the user's requested scope.
