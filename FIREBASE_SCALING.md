# Firebase Scaling And Cost

The latest baseline is `0ee2aa6` (`v0.0.1.3-BengaliBlushDashboards`). The changes in this working tree are prepared for review; they have not been tested, deployed, or committed.

## Read And Listener Behavior

- Admin record pages subscribe to their selected collection, with 50 visible records and one lookahead record. Order pages also subscribe to a small payment-method reference window for display names, with the saved method ID as fallback. Previous/Next uses the unique monotonic `number` as a cursor, without paid offsets. Leaving a page or changing accounts detaches its listeners.
- Dashboard and shop summaries use the most recent 50 records per collection. Their counts, statuses, activity, and subtotals describe this window. They are not lifetime totals. Open the individual record pages to browse older records; page search and filters apply to the displayed page.
- Admin mutations rely on the active realtime listeners instead of downloading the entire dashboard again. Unchanged catalog records, notifications, and order statuses skip writes. Unchanged slug reservations also skip writes, and the sample importer checks deterministic slug documents instead of scanning collections.
- Catalog collections subscribe only while a component requests them. Published notifications share one listener. Identical public subscriptions reuse the latest snapshot, and retain their listener for 30 seconds after the last consumer leaves to avoid route and React development remount reads. A healthy Refresh keeps its listener; a failed listener can be retried.
- Products/services retain their ascending display order; reviews/notifications retain descending order. Public status filters exclude archived and draft records. Complete eligible catalogs remain available; no public records are silently truncated.
- Concurrent account hydration requests share one promise. Once the account listener receives a server-confirmed snapshot, ordinary operations reuse it instead of rereading the UID mapping and profile. Lifecycle/password operations retain their explicit server reads. Rules remain the authority for role and ownership checks.

## Indexes And Rules

`firestore.indexes.json` disables automatic single-field indexing for each app collection and explicitly retains only queried fields: descending `number` for admin pages, ascending `status` for public lists, and ascending `firebase_uid` for bounded account deletion. The `users.email` index remains for the documented console role-setup lookup. Payload strings, URLs, arrays, maps, timestamps, and infrastructure records no longer have unused indexes. Existing direct document reads and rule lookups do not require field indexes.

Private list rules require a query limit: 51 for users/slug records and 100 for private submissions/orders and infrastructure lists. The 100-record allowance preserves account-deletion batches. Public catalog rules keep their existing visibility boundaries, evaluating public status before private role lookups. The app uses the default in-memory Firestore cache, avoiding persistent private dashboard data on shared devices.

Deploy the reviewed index overrides first and wait for index readiness. Then deploy the updated web app, so its private queries already include limits, before tightening list rules. This is a deployment dependency; no cloud state was changed here.

```bash
firebase deploy --only firestore:indexes --project bengaliblush-9ac28
```

After the indexes are ready and the updated web app is deployed:

```bash
firebase deploy --only firestore:rules --project bengaliblush-9ac28
```

## Production Setup Still Needed

1. Review this diff and verify public browsing, catalog edits, pagination beyond 50 records, role changes, sign-out, account reactivation/deletion, and reconnects. Run the project's TypeScript/lint/build checks and Firestore Emulator rule checks before production rollout.
2. Register the web app with Firebase App Check using reCAPTCHA Enterprise and add its public site key as `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY` in the deployment environment. The client initializes App Check only when this key is configured. Monitor valid/invalid request metrics before enabling Firestore enforcement; an unset key does not protect writes. Ensure allowed production/preview hostnames are configured. Keep debug tokens out of committed client configuration.
3. Public guest contact, appointment, and order requests still write directly to Firestore. App Check helps screen client authenticity, but does not enforce per-person rate limits. For substantial public traffic or abuse exposure, move these writes behind a trusted endpoint with App Check verification, server rate limits, input checks, and idempotency. Preserve guest browsing and submission support.
4. Configure billing alerts and inspect Firestore reads, writes, listener reconnects, and rules-dependent reads in the console. Budget alerts notify; they do not cap Firestore charges. Measure actual workload before choosing thresholds or claiming a percentage saving.

## Scale Boundaries

Exact global sequential numbering still updates one counter document per collection on each create, and the indexed `number` increases sequentially. The required numbered ID prefix is also sequential. These choices preserve existing records and the requested ID format but limit very high concurrent creation throughput; a UUID suffix alone does not remove counter contention. High-volume operation needs an agreed numbering/ID migration or a serialized trusted allocator with backpressure. Do not replace this with client-generated numbers or a sharded approximate counter while promising exact unique consecutive numbers.

Public catalogs and published notifications remain complete status-filtered snapshots. Lazy listeners remove unrelated reads and repeated refreshes, but initial read cost still grows with eligible catalog size and visitor count. For large catalogs, add category/search queries with cursor pages and direct detail lookups, or serve trusted public projections/bundles through a CDN with deliberate invalidation. A publication revision document by itself is not enough: repeatedly downloading the whole catalog after every revision recreates the original cost problem. Lifetime realtime analytics also need trusted aggregate documents rather than rebuilding totals from full collections in browsers.

## References

- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Firestore Billing And Listener Reads](https://firebase.google.com/docs/firestore/pricing)
- [Realtime Query Scaling](https://firebase.google.com/docs/firestore/real-time_queries_at_scale)
- [Query Cursors](https://firebase.google.com/docs/firestore/query-data/query-cursors)
- [App Check For Web](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)
- [Avoid Surprise Bills](https://firebase.google.com/docs/projects/billing/avoid-surprise-bills)
