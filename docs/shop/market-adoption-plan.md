# Bengali Blush Store And Dropshipping Market Plan

Prepared October 13, 2026. This extends [the existing commerce roadmap](../concepts/BengaliBlushAutoDSAIPlan.md) with the requested Market, product settings and reusable skill. Its recommendation for hosted Stripe Checkout is superseded here by native Stripe Elements to preserve your internal checkout design. No paid service is activated by this plan.

## Recommendation And Costs

Own the frontend, Firestore models, research/operations orchestration and reusable [Shop skill](../../ai/skills/shop/SKILL.md). Buy supplier and market-data capabilities through replaceable adapters. Start by evaluating **CJ's direct API** for this existing Next.js store; its documented ordering, wallet payment, tracking and dispute operations fit a custom commerce backend. This is a technical fit recommendation, not confirmation that its catalog has suitable authentic apparel or verified beauty products. [CJ ordering](https://developers.cjdropshipping.com/en/api/api2/api/shopping.html), [CJ disputes](https://developers.cjdropshipping.com/en/api/api2/api/dispute.html)

Consider DSers if approved Channel-app API access meets the same requirements. AutoDS is viable through a supported backend such as WooCommerce, or separately confirmed private custom-store access. Its supported-channel app/MCP is not proof that a Next.js/Firestore store can submit its own paid orders. Shopify permits your custom storefront, but requires Shopify Checkout; that route changes your requested standalone Stripe checkout. [DSers approval](https://help.dsers.com/partner-account-registration-for-third-party-app-integrations-2/), [AutoDS channels](https://help.autods.com/en/articles/12699877-supported-selling-channels-stores-marketplaces-and-shops), [Shopify terms](https://www.shopify.com/legal/terms)

Detailed current subscriptions, add-ons, API costs, processing fees and worked examples are in [pricing](dropshipping-pricing.md). Budget roughly **$30–$60/month for a small custom system's core hosting/research/AI allowance**, with **$30–$75 including contingency**; these are estimates, excluding goods/freight, processing, returns, ads, domains, optional memberships and development. Existing Vercel/Firebase subscriptions may make incremental costs lower. DataForSEO needs a $50 prepaid starting balance. A supplier wallet requires separate working capital.

**Stripe doesn't need to come first for mockups or research.** Connect it alongside supplier validation and the trusted order pipeline, before enabling live paid orders. Use your merchant Stripe account and Payment Element within the store's layout, backed by the supported Checkout Sessions integration. Stripe controls sensitive payment inputs; Bengali Blush keeps the surrounding checkout. Some authentication/payment methods can require redirects. [Stripe Elements](https://stripe.com/payments/elements), [official Elements/Checkout example](https://github.com/stripe-samples/accept-a-payment/tree/main/elements-with-checkout-sessions)

## Current Source And This Deliverable

The app already contains Next.js/React/SCSS, Firebase auth/account roles, public catalog subscriptions, product admin, cart, internal checkout, order-request admin, payment-method admin, shared shell/modal/status/pagination components and PWA source. These are reuse points, not claims about deployed resources or enabled providers. Existing roles are Admin, Owner and Subscriber; no new Developer role is introduced here.

| Existing Boundary | Reuse / Required Later Change |
| --- | --- |
| `/products` -> AdminCommerce | Store remains default; Market is a disconnected preview |
| ProductStoreTable / CommerceRecordRow | Same Store table/rows in admin and same-category Swap preview; Store's existing handlers retain their behavior |
| ProductMarket | Shared admin/Replace Market UI; concept rows, unavailable metrics, disabled Import, simulated progress |
| Landing Shop and ProductCard | Admin/Owner settings gear; settings draft, Products Admin link, category-scoped Swap / Replace preview |
| CatalogProvider / commerce facade | Reuse public active products; later add bounded category/slug/placement queries without a second catalog cache |
| ProductRecord / Firebase serializer | Preserve IDs/prices/categories; coordinate new metadata with every normalizer/full-record writer |
| ShopProvider / cart storage | Reuse cart UI; later require authoritative quotes/exact variants rather than trusting browser prices |
| `/checkout` / OrderRecord | Currently unpaid requests; later add payment/fulfillment states without relabeling old requests Paid |
| `/orders` | Existing admin orders; customer order status needs a distinct scoped route, e.g. `/profile/orders` |
| `/payments` | Currently payment methods; future Methods / Transactions views retain old configuration and add real transaction/refund records |

The Market preview uses **40 unverified sourcing concepts**, ten for each code-seed category: Health, Apparel, Candles, Tools. It does not represent 40 actual supplier SKUs. Ratings, prices, volume, supplier cost and delivery show unavailable values; live supplier discovery must replace this preview before importing. Seed categories guide the mockup; actual cloud catalog/category contents have not been inspected. New preview data stays in memory and isn't written to Firestore or browser storage.

Product settings allow temporary editing, with Save disabled. Swap uses active catalog records from the original category, excludes the selected product, and keeps swapping disabled. Replace shares the Market preview filtered to the category and displays the originating section. Existing data has no section-slot model, so the preview conveys section context while production section enforcement is a future change. Research offers 1/3/5/10 concepts in admin and 1/3/5 inside Replace, showing explicitly simulated progress. Closing/switching away discards those temporary additions.

No new provider connection, Stripe operation, import/save/swap mutation, background cloud job, rules/index deployment or subscription purchase is part of this delivery. Existing real Store actions remain the app's existing functionality.

## Future Data Map

Use the existing Firestore/identity/service conventions. Proposed names below are project design choices for later implementation, not collections created now.

| Proposed Area | Content And Permission |
| --- | --- |
| Existing `products` | Public published projection and stable current identity; extend exact variants/fulfillment mode deliberately |
| `shop_slots` | Category/section/position/product reference/revision; make current automatic landing placements explicit in a compatible migration |
| `market_products` | Staff-private source IDs/URLs, observations, match evidence, variants, reviews/metrics, landed cost, readiness and exclusions |
| `supplier_bindings` | Private store/product/variant/provider mapping, cost/availability and manual field locks |
| `market_research_jobs` | Staff-private scope/count, durable stage/counters, costs, attempts and confirmed added/rejected results |
| Existing `orders` | Immutable customer/product/variant/quoted-money snapshots; separate paid, procurement, shipment and customer-resolution states |
| `payment_transactions` / `refunds` | Server-owned Stripe references, amounts/currency, verified status and line allocations; no card data |
| `fulfillment_jobs` / `shipments` / `returns` | Durable jobs, provider order/tracking/cases, line groups, evidence and exceptions |
| `commerce_events` / outbox | Durable event/operation deduplication, retries, audit, spending reservations and reconciliation |
| Private Connections | Account-scoped safe metadata; merchant/supplier/metrics secrets in bound server storage |

Use Type_Number_Name_Date_UUID IDs with atomic matching numbers. Keep CJ/Stripe/other IDs in named external fields. Credential and supplier-cost data must not ride in publicly readable product documents. New schema fields require a migration because existing normalization allowlists and complete-record saves could otherwise erase them. Preserve existing historical unpaid orders and customer identities.

Import produces a stable draft, not immediate publication. A later approved Replace imports, then changes the selected slot transactionally against its expected revision. Swap changes the slot's product reference to an eligible existing product; it doesn't overwrite the old product's identity. Original product/order history remains valid. Excluded/removed products aren't silently rediscovered and republished.

## Real Product Research

Build the target profile from actual saved categories, current product examples and section placements. Preserve Bengali Blush's blush/cream/burgundy palette, serif typography and calm product descriptions. Match physical category, use, material/options, price bracket, visual tone and delivery capability; broad keyword similarity alone is insufficient. Supplier/AI labels can't establish Jamdani/Banarasi origin, fabric authenticity, ingredients, ratings or safety claims. For the initial pilot, prefer goods with complete supplier documentation; unresolved cosmetics/electrical/apparel facts keep the candidate in review.

Find a target of **30–50 real sourceable products** through authorized supplier catalogs. Store product/variant references and source URLs; verify stock, US destination routes, freight, plausible margin and permitted media. There may be fewer suitable products in a category: report the shortage instead of inventing stock or lowering category constraints automatically.

| Market Column | Real Source / Meaning |
| --- | --- |
| Reviews | Authorized supplier/marketplace aggregate, rating/count/source/date; separate from Bengali Blush buyer reviews |
| Current Average Sale | Licensed observed competitor prices for comparable variants, sample count, currency/date, shipping/tax basis; not suggested retail price |
| Search Volume | Keyword metrics for selected US/language/month; identify keyword and source; cannot imply actual sales |
| Trend Interest | Relative 0–100 interest in a defined window; separate from absolute search volume |
| Cost / Margin | Exact variant + destination freight + estimated fees/return allowance; contribution estimate, not guaranteed net profit |
| Stock / Delivery | Actual observation/quote with warehouse/destination, freshness and uncertainty |
| Import Readiness | Complete evidence/options/media mapping and approval state, not simply an AI score |

Google Ads keyword metrics and Trends can be purchased through DataForSEO. Competitor averages and licensed review evidence require a separate supported source; they aren't promised by the keyword API or CJ. Show Unavailable until obtained. [Keyword pricing](https://dataforseo.com/pricing/keywords-data/google-ads), [Trends definitions](https://support.google.com/trends/answer/4365533?hl=en)

Use one durable research service for manual and scheduled jobs: authorize -> create job -> query suppliers -> normalize -> scope-match -> deduplicate/exclude -> enrich -> rank -> commit -> realtime UI result. Requested 1/3/5/10 is a target count of usable additions. Persist stages/processed totals; a spinner is honest when total work is unknown. Closing a modal won't cancel a real committed backend job. Persist failures and partial results for recovery.

Start with two–four discovery runs/day; separate stock/cost refresh (proposed 30–60 minutes, plus checkout/procurement rechecks), tracking callbacks/polling and daily reconciliation. Refresh monthly keyword demand only when changed and batch new phrases. CJ's documented base allowance is 50,000 points/day with lowest-tier one-request/second rate limits; budget and throttle by endpoint cost rather than assuming unlimited API calls. [CJ quota](https://developers.cjdropshipping.com/en/api/api2/standard/points.html), [rate limits](https://developers.cjdropshipping.com/en/api/api2/standard/limit.html)

## Paid Orders And Hands-Off Fulfillment

1. Native cart collects exact variants/quantity/destination. Server validates publication/current availability and quotes price, shipping/tax and total with expiry. Customer accepts changes before payment.
2. Create a retry-safe Stripe attempt with the order reference. Verified webhook/payment retrieval confirms financial state and commits an outbox. Neither success URL nor browser-supplied amount authorizes purchase. [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment?payment-ui=checkout-form), [webhooks](https://docs.stripe.com/webhooks)
3. Durable worker checks the paid order, source variant, destination quote, complete landed cost, Owner limits and funded supplier wallet. Commit spending reservation; create/pay the supplier order outside database transactions.
4. Reconcile uncertain supplier responses before retrying. Use stable order references and provider idempotency where supported; ambiguous purchases become exceptions, preventing blind double orders.
5. Verified callbacks and bounded polling sync acceptance, dispatch, tracking and actual delivery into line/group statuses. Show these in Orders with financial summaries linked to Transactions.
6. Automate eligible cancellation/dispute/evidence/return steps and customer refunds within your limits. Supplier approval/return terms and customer refund remain separate. Some cases need judgment; show an actionable exception inbox rather than promising zero involvement. [CJ dispute API](https://developers.cjdropshipping.com/en/api/api2/api/dispute.html), [return policy](https://www.cjdropshipping.com/dispute-policy.html), [Stripe refunds](https://docs.stripe.com/refunds)

Provide daily/order/provider spending limits, minimum margin, freshness thresholds, funding alerts and pause/replay controls. Stripe payout timing doesn't fund CJ automatically. Keep cash for procurement and customer resolutions; a supplier reimbursement can fail while your customer refund is still due. Routine statuses can be quiet; alert on meaningful failures or required decisions.

## Phased Implementation

The existing roadmap's roughly 8–12 week pilot is an engineering planning estimate, not a vendor quote. Skip rebuilding auth/Profile/cart/admin foundations that already exist here. Supplier access, product samples, owner decisions and external approvals can add elapsed time.

| Phase | Work | Required Outcome |
| --- | --- | --- |
| Now: Reviewable preview and reusable guidance | This frontend and generic Shop pack, current pricing | User reviews diff/design; no provider or financial changes |
| 1: Provider/catalog evidence | Confirm CJ or alternative API, destination, exact variants, terms and samples; source 30–50 candidates where possible | Real candidates with provenance, nullable metrics, costs and shortfalls |
| 2: Trusted foundations and research | Compatible schema/placements, private models, rules/indexes/server capabilities, durable research and realtime pages | Authorized candidate/job flows and bounded costs |
| 3: Import/Swap/Replace | Retry-safe drafts and approval, slot revision checks, locked fields/exclusions | Same-category/section actions commit without rewriting order history |
| 4: Native Stripe pilot | Authoritative quotes/variants/freight/tax, native Payment Element, signed events/refunds | Payment flow ready with safe test/live isolation before live sales |
| 5: Supplier and after-sale pilot | Funded/capped procurement, tracking, reconciliation, return cases/refunds and exceptions | A small approved physical catalog can fulfill and reconcile end to end |
| 6: Controlled expansion | Scheduled research, additional providers/categories, eligible automation, sourced metrics | Real delivery/margin/exception history supports increased limits |

Before live implementation, record your actual sales region/currency, supplier API entitlement, product evidence, customer policies, budgets, tax setup and exception recipient. These are future configuration requirements, not blockers for the current mockups. For the later complex payment/security work, your instructions recommend considering gpt-5.5 fast; keep the Codex model and speed you select.

When you request validation, cover permissions, tampered quotes, duplicate events/jobs, uncertain purchases, concurrent placements/stock, partially fulfilled/refunded orders, insufficient supplier funds, locked prices, category/section mismatch and outage recovery. Complete a capped supplier/payment pilot before enabling broad automated buying. Update shipping/return/privacy/policy pages for real sales and keep private order data out of public/offline caches.

## Reuse And Handoff

Copy the complete `ai/` pack and AGENTS.md into future projects and invoke [the Shop adoption prompt](../../ai/skills/shop/SKILL.md#adoption-prompt). It reuses each project's appearance and existing account/store system, adding missing foundations only within the requested scope. The skill is repository-portable; creating it here does not install a global `$shop` command automatically.

**Source:** requested preview and generic plan delivered; production integration remains planned. **Connection:** no new payment, supplier, metrics or scheduler connection; existing Firebase source connectivity wasn't exercised. **Validation:** user review pending; no tests, typechecks, builds, UI checks, cloud deployments, commits or live payment/supplier actions performed.
