# Bengali Blush AutoDS AI Production Roadmap

Prepared October 10, 2026. This is a plan for future implementation; it does not connect accounts, purchase products, enable automation, or change the deployed app.

## 1. Recommended Direction

Extend the existing Bengali Blush Next.js storefront and Firebase database into a production shop with a Shopify-style admin, checkout through your existing Stripe account, and a supplier automation layer. Keep your Vercel Pro and Firebase Blaze setup. Preserve the current branding, public browsing, PWA, accounts, products, and studio services.

Use an API-capable supplier for the first dropshipping pilot. **CJdropshipping is the recommended first candidate because it documents the catalog, inventory, freight, ordering, payment, and tracking capabilities needed by a custom storefront.** This is an integration recommendation, not confirmation that CJ carries suitable Bengali Blush products or has approved your account. Confirm those points with a small pilot. [CJ API overview](https://developers.cjdropshipping.com/en/api/api2/)

Keep AutoDS as a conditional connector. Its documented selling channels include platforms such as Shopify, WooCommerce, and Wix, but do not establish a native Next.js/Firebase integration. Before building around AutoDS, obtain confirmation of custom-store API access and the full ordering/tracking flow. Supplier coverage alone does not establish storefront compatibility. [AutoDS supported channels](https://help.autods.com/en/articles/12699877-supported-selling-channels-stores-marketplaces-and-shops)

The filename uses AutoDS AI to describe the desired operating model: discover relevant products, import them, apply your pricing, collect payments, fulfill orders, track delivery, and surface exceptions. A specific AutoDS subscription should follow confirmed integration access.

The target is **routine operations handled automatically, with you managing preferences and exceptional cases**. Supplier failures, insufficient funds, disputes, returns, tax decisions, and product quality issues still need a responsible business owner or delegated operator.

## 2. What Exists Right Now

This snapshot comes from the local repository. Vercel Pro and Firebase Blaze are owner-provided deployment assumptions. Live subscriptions, deployed rules/indexes, Stripe readiness, production database contents, and supplier accounts were not inspected. No build, test, UI check, seed import, or production mutation was performed.

| Area | Current Repository State | Next Production Step |
| --- | --- | --- |
| App | Next.js 16, React 19, TypeScript, Sass, Firebase client SDK, Vercel Analytics | Extend the existing architecture |
| Storefront | Shop, categories, product details, cart, checkout, services, and PWA | Add real variants, availability, delivery information, and paid checkout |
| Authentication | Firebase Google/email accounts, private profiles, Admin/Owner access | Add trusted server authentication and operation-level authorization |
| Catalog | Firestore products/services; active records feed public pages | Add drafts, supplier mappings, SKUs, variants, stock, and publication controls |
| Admin | Product/service edits, reviews, payment-method configuration, order status updates | Expand existing screens into a commerce control center |
| Checkout | Guest/account-linked requests; product price lookup and order snapshots | Create authoritative server quotes and Stripe Checkout Sessions |
| Payments | Orders are always unpaid; manual payment options and disabled card placeholders | Stripe payments, webhooks, refunds, and reconciliation |
| Suppliers | Studio sample importer; no supplier connector | Authorized supplier catalog and fulfillment adapters |
| Removal | Products/services can be archived; hard deletion is denied by current rules | Explicit removal, exclusion, replacement, and restricted permanent deletion |
| Reporting | Recent/page windows, generally 50 records, with current-page filters | Paid-sales aggregates and searchable order history |
| Scaling | Shared public listeners and paginated admin reads | Bounded public catalog queries and direct product lookups |

Repository anchors: [package.json](../../../package.json), [commerce models](../../../src/shared/models/commerce/Commerce.ts), [commerce facade](../../../src/api/commerce.ts), [Firestore commerce operations](../../../src/shared/firebase/commerce.ts), [checkout](../../../src/app/components/shop/checkout-page/checkout-page.tsx), [admin configuration](../../../src/app/components/authentication/admin-commerce/commerce-data.ts), [Firestore rules](../../../firestore.rules), and [scaling notes](../../../FIREBASE_SCALING.md).

Important distinctions:

- `src/api/commerce.ts` is an internal TypeScript facade, not a deployed HTTP API. No Next.js API route handlers were found in the current source.
- The catalog and order requests use Firestore. The cart remains browser storage; `useLocalStorage = true` does not mean the entire catalog is local.
- Current checkout allows up to five different products and quantities of 1–99. These are request-flow limits, not a complete inventory policy.
- Existing integer `price_minor` amounts, stable app-owned IDs, transactional numbering, and slug reservations are useful foundations to retain.
- Existing sample products are inspiration and seed data. They do not establish real supplier inventory, product specifications, licensed media, or fulfillment availability.

## 3. Product Direction Based On The Existing Catalog

The repository defines 20 sample products across four categories. Use those categories as the initial sourcing profile, then match actual supplier products by specifications, not just similar names. These prices are current sample retail values, not confirmed supplier costs or recommended final selling prices. [Sample catalog](../../../src/shared/shop/shop-content.ts)

| Existing Category | Sample Examples | Sample Retail Range | Sourcing Approach |
| --- | --- | --- | --- |
| Health | Lash Luxe Serum, Brow Bloom Serum, Rosewater Glow Serum | $29–$38 | Verified cosmetic suppliers with ingredients, labeling, safety records, and traceability |
| Apparel | Pakistani Lehenga, Bengali Jamdani Saree, Indian Banarasi Saree, Lawn Kurta Set | $95–$249 | Suppliers with actual fabric details, accurate size charts, variant stock, and agreed returns |
| Candles | Saffron Amber, Rose & Oud, Jasmine Evening, Chai Spice | $26–$32 | Verified fragrances, dimensions, packaging, shipping damage process, and safety labeling |
| Tools | Ceramic Straightener, Curling Wand, Heated Brush, Wave Iron | $49–$89 | Verified US-compatible electrical products with appropriate safety documentation and warranty terms |

Start with approximately 10–20 approved sellable variants from one supplier and one destination market. Choose products that pass the actual supplier and product review; do not force all four categories into the first launch. Non-electrical beauty accessories can be an adjacent pilot category if current sample categories lack suitable verified products.

The seven existing studio services include lashes, fills, lift/tint, hair styling, party makeup, bridal makeup, and consultation. Keep these owner-managed and separate from supplier fulfillment. Service prices currently include strings such as `$145+` and `Free`; future paid services need explicit numeric amounts and pricing modes. [Service catalog](../../../src/shared/services/service-content.ts)

For a US launch, product approval must address the actual categories being sold. Cosmetics need appropriate safety/labeling and MoCRA review; small-business exemptions have limits, including certain eye-contact products. Apparel needs accurate fiber/origin information and applicable care labels. Candles need category-specific safety review. Electrical tools need suitable product evidence before approval. Do not generate unsupported growth, treatment, authenticity, or certification claims. These checks belong in initial supplier onboarding and product records so routine sync can use the approved facts. [FDA MoCRA](https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra), [FTC textile guidance](https://www.ftc.gov/business-guidance/resources/threading-your-way-through-labeling-requirements-under-textile-wool-acts), [CPSC candle guidance](https://www.cpsc.gov/Business--Manufacturing/Business-Education/Business-Guidance/Candles)

## 4. Supplier And Platform Decisions

| Source / Tool | Role In This Plan | Required Before Enabling |
| --- | --- | --- |
| CJdropshipping | First custom-store API candidate | Account/API access, funding method, suitable SKUs, US shipping quotes, media permission, and pilot order |
| AutoDS | Optional automation provider | Confirmed custom integration, credentials, documented operations, fees, quotas, and a successful end-to-end pilot |
| DSers / AliExpress | Possible second integration | Developer/channel-app approval and confirmed unattended ordering/payment capabilities |
| Alibaba | Later negotiated sourcing or private-label route | Vendor agreement for individual orders, quantity minimums, packaging, shipping, returns, media rights, and a supported ordering channel |
| Amazon | Optional later procurement source | Permitted commercial ordering arrangement, applicable terms review, reliable cost/stock access, media rights, and returns process |
| Your own products | First-class catalog source | Your inventory or made-to-order policy, delivery terms, price, and fulfillment responsibility |

CJ documents account API keys, token handling, stock/product queries, and purchase operations. Implement quota-aware sync; access limits vary by account level. Documentation establishes technical feasibility, not a guarantee of stock, quality, or margin. [API access](https://developers.cjdropshipping.com/en/summary/course.html), [API limits](https://developers.cjdropshipping.com/en/api/start/limit.html), [Product APIs](https://developers.cjdropshipping.com/en/api/api2/api/product.html), [Order/payment APIs](https://developers.cjdropshipping.com/en/api/api2/api/shopping.html)

AutoDS lists Alibaba, AliExpress, and Amazon US within its fulfillment offering, subject to method and region support. Fulfilled by AutoDS requires an Orders Processor add-on, order credits, and a prepaid Managed Balance; its guide currently describes manual balance replenishment. It also does not grant permission to use imported images. Include funding alerts and licensed media in any AutoDS implementation. [AutoDS fulfillment requirements](https://help.autods.com/en/articles/12700443-automate-your-orders-with-fulfilled-by-autods-fba)

DSers now documents a developer program and Channel Apps, with registration and review gates. CSV import/export is a possible assisted fallback for unsupported stores, but does not satisfy the desired unattended operation. [Developer registration](https://help.dsers.com/partner-account-registration-for-third-party-app-integrations-2/), [App review](https://www.dsers.com/developers/api-overview/), [CSV fallback](https://help.dsers.com/dsers-doesnt-support-your-platform-use-csv-upload-to-connect-your-store/)

Alibaba and AliExpress are separate sourcing routes. Alibaba products may require negotiated quantities and vendor terms; a Ready to Ship listing does not establish one-unit dropshipping permission or automated procurement. [Alibaba minimum-order guidance](https://seller.alibaba.com/businessblogs/px6g2lut-what-is-minimum-order-quantity-moq)

Amazon affiliate APIs are not a shortcut for importing Amazon content into this shop and taking a marked-up Stripe payment. The US Associates policies restrict the purpose of that content and affiliate purchases for resale. Keep Prime-funded supplier ordering disabled unless a permitted commercial arrangement is confirmed; applicable US Prime terms still need review. The current US Prime terms were not successfully retrieved during research. [US Associates policies](https://affiliate-program.amazon.com/help/operating/policies), [US Prime terms to review](https://www.amazon.com/gp/help/customer/display.html?nodeId=13819201)

If AutoDS becomes a firm requirement and custom access is unavailable, evaluate a supported commerce backend behind the existing storefront as a separate architecture decision. That adds platform fees and requires revisiting payment ownership, service bookings, and the order source of truth. Confirm that route before building a bridge; do not maintain two competing checkout/order systems.

## 5. Production Architecture

Keep one application, one application database, and one durable job pipeline:

```text
Bengali Blush Storefront + Existing Admin On Vercel
                  |
        Next.js Server Route Handlers
          |                     |
    Firebase Admin          Stripe Checkout
          |                     |
       Firestore <--- Verified Stripe Webhook
          |
     Durable Job Outbox
          |
 Firebase Functions + Cloud Tasks ---> Supplier Adapter
          |                                  |
  One Scheduled Reconciler <--- Stock / Cost / Tracking
          |
 Customer Updates + Admin Exception Inbox
```

Recommended responsibilities:

- **Vercel:** existing UI, admin, public catalog rendering, short authenticated HTTP operations, checkout creation, and Stripe webhook receipt. Next.js Route Handlers fit this app. [Vercel Functions](https://vercel.com/docs/functions)
- **Firebase Authentication:** customer/staff identity. Verify tokens on the server and check active account status and permitted operations.
- **Firestore:** application-owned catalog, orders, reservations, supplier mappings, policies, job outbox, operation ledger, and audit history.
- **Firebase Functions v2 + Cloud Tasks:** bounded supplier imports, order purchasing, retries, tracking, and reconciliation. Configure authenticated workers, concurrency, retry limits, and failure records. Delivery can repeat, so every operation needs duplicate protection. [Task queue functions](https://firebase.google.com/docs/functions/task-functions), [Cloud Tasks limitations](https://docs.cloud.google.com/tasks/docs/common-pitfalls)
- **One Firebase scheduled function:** enqueue inventory/cost refresh, stale-job recovery, reservation release, and order reconciliation. Use leases because executions can overlap. Vercel Cron can be an alternative dispatcher, but failures are not automatically retried; avoid two independent schedulers doing the same work. [Firebase scheduling](https://firebase.google.com/docs/functions/schedule-functions), [Vercel Cron behavior](https://vercel.com/docs/cron-jobs/manage-cron-jobs)
- **Firebase Storage:** proposed home for your uploads and authorized supplier media. Add upload validation, access rules, file limits, and lifecycle policies; it is not connected today.
- **Transactional email provider:** receipts, dispatch/tracking notices, delay choices, and exception alerts. Provider selection, sending-domain setup, and charges are separate setup work.

Keep private supplier costs, tokens, funding settings, and internal notes out of public product documents. Active Firestore catalog documents are publicly readable under the current model; hiding a field in the UI does not make it private. Publish a customer-safe projection and keep procurement data in server-only collections.

Keep Stripe and supplier secrets in server environment variables or Secret Manager, never `NEXT_PUBLIC_*`, browser storage, public User records, source control, or logs. Account-scoped integration settings should reference server-managed secrets. Use least-privilege server credentials; Firebase Admin bypasses Firestore client rules, so server authorization must independently enforce access. [Firebase function secrets](https://firebase.google.com/docs/functions/config-env)

## 6. Data Model And Migration Plan

Preserve existing IDs, numbers, slugs, and historical order snapshots. Add `schema_version` and compatible readers before moving records to the new shape. Keep business IDs in `Type_Number_Name_Date_UUID` format, with atomic integer `number` allocation matching the ID. External identifiers remain named fields such as `supplier_product_id`, `supplier_order_id`, `stripe_checkout_session_id`, and `stripe_payment_intent_id`.

Existing deterministic infrastructure records such as counters and UID lookup indexes can remain deterministic. An event-deduplication lookup keyed by an external event ID should point to an app-owned event record; it does not replace the ID convention for business records. Exact per-collection numbering remains a concurrency constraint, so imports need bounded writes and backpressure.

| Record | Planned Information |
| --- | --- |
| Products | Source type, status, brand-safe content, category, publication settings, field locks, media, and fulfillment mode |
| Product variants | SKU, size/color/options, sell price in minor units, owned inventory or supplier mapping, availability freshness |
| Private supplier mappings | Provider, external product/variant IDs, source URL, cost/currency, warehouse, freight, restrictions, approval evidence |
| Supplier connections | Account-scoped secret references, token expiry, capabilities, quotas, and funding health |
| Import batches / candidates | Source snapshots, matching score, approvals, exclusions, and import outcomes |
| Price policies | Global/category/product rules, margin floor, manual override, price cap, change limits, and effective revision |
| Orders | Customer-safe purchased-item snapshots, quote revision, shipping, discounts, tax, totals, and separate lifecycle states |
| Payment records | Stripe references, verified status, refunds, disputes, and reconciliation timestamps |
| Fulfillments | Order lines, supplier/self-fulfillment ownership, procurement cost, purchase attempt, shipment(s), carrier, tracking |
| Reservations | Variant/slot quantities, ownership, expiry, release state, and checkout reference |
| Returns / refunds | Customer decision, supplier return/cancellation, refund operation, evidence, and independent statuses |
| Automation jobs / operations | Deduplication lookup, task state, attempts, lease, error, replay history, and outbox delivery |
| Exclusions / audit events | Blocked source IDs, deletion/replacement decisions, actor, changed fields, and timestamps |

Separate the lifecycle dimensions. Proposed examples:

- Product: `draft`, `active`, `paused`, `archived`, `removed`.
- Payment: `unpaid`, `processing`, `paid`, `failed`, `partially_refunded`, `refunded`; track disputes separately.
- Fulfillment: `unfulfilled`, `queued`, `purchasing`, `purchase_unknown`, `ordered`, `partially_shipped`, `shipped`, `delivered`, `exception`, `cancelled`.

These are design targets, not valid current schema values. Current readers and Firestore rules allowlist fields and only permit `payment_status = unpaid`. Update models, rules, indexes, server operations, and UI together. Preserve existing unpaid requests as legacy request records; do not automatically charge or purchase against them.

The current `saveRecord` operation writes a normalized full record. Extend it carefully so admin edits cannot discard newly added supplier/automation fields. Use explicit field ownership and compatible updates rather than allowing a sync and a form to overwrite each other's data. [Commerce normalization](../../../src/shared/firebase/commerce-records.ts), [Commerce writes](../../../src/shared/firebase/commerce.ts)

**Paid-order retention is a launch dependency:** account deletion currently deletes the account's orders. Replace that behavior for paid transactions with a reviewed retention/anonymization flow that preserves necessary accounting, refunds, disputes, and open fulfillment records while removing eligible personal data. Update the privacy policy and account-deletion explanation. [Current account deletion](../../../src/shared/firebase/account-actions.ts)

## 7. Shopify-Style Admin And Your Controls

Expand the existing `/admin/shop`, `/products`, `/orders`, and `/admin/services` pages. Add focused supplier/import/automation screens through the shared route registry. Preserve Admin/Owner roles, with Owner-only connection, spending-policy, and high-impact finance controls where appropriate.

| Admin Area | Owner Capabilities |
| --- | --- |
| Overview | Paid sales, refunds, contribution margin, jobs, low funds, stock issues, and orders needing attention |
| Products | Create custom products, draft/publish, edit variants/media, bulk prices, category assignment, archive/remove |
| Imports | Search approved feeds, paste permitted source links, preview matches, accept/reject, and bulk approve |
| Pricing | Global/category markup, margin targets, individual prices, locks, scheduled sales, and change history |
| Inventory | Owned stock, supplier availability, refresh timestamps, thresholds, and paused listings |
| Orders | Payment/fulfillment timeline, line-level shipments, refunds, returns, notes, and safe job replay |
| Suppliers | Credentials status, permitted capabilities, funding, quotas, warehouse/routes, and approved replacements |
| Automation | Per-product switches, auto-publish rules, procurement limits, schedules, and global pause |
| Services | Create/edit services, fixed/from/quote pricing, optional deposits, availability, and booking policy |
| Customers / Reports | Authorized order history, support context, exports, net sales, costs, fees, and margin |

Each imported product must offer:

- **Price Mode:** Automatic or Manual. A manual price survives future supplier sync.
- **Field Locks:** independent locks for title, description, images, category, and price.
- **Automation Switches:** sync cost/stock, update automatic prices, publish, and fulfill independently.
- **Preview Changes:** show source changes, proposed retail changes, and margin before accepting them.
- **Source Status:** provider, SKU mapping, last refresh, approval status, and reason for any pause.

Removal and replacement semantics:

1. **Archive / Unpublish:** immediately remove the listing from new sales, while retaining history and open-order processing.
2. **Remove From Shop:** also create a persistent source exclusion so discovery/import/sync cannot recreate it. Reimport requires your explicit Restore action.
3. **Permanent Delete:** permit through a restricted server operation only when no order/return/audit references require retention. Otherwise remove public visibility and retain the minimum historical record. Exclusion remains separate.
4. **Replace Supplier:** preserve the product ID/slug only if the goods and variants remain materially equivalent. Already purchased lines retain their original snapshot; substitutions require the appropriate customer decision.
5. **Replace Product:** create a new product for materially different goods, archive the old one, and use a deliberate redirect/alternative-product notice where appropriate.

Use the existing table status pattern (`actionsCell`, `rowStatus`, `statusDotWrap`, `statusDot`, `statusText`) and green/gray/red states. Preserve icons with labels, descriptive element IDs, smooth transitions, and reduced-motion behavior. Keep component logic/rendering/styles separated using the current architecture.

## 8. Pricing And Profit Rules

Do not simply increase every sample price by a fixed percentage. Compute prices from real source costs, shipping routes, fees, and your chosen return/marketing allowance. Store money in integer minor units and keep currencies explicit; supplier currency conversion needs a recorded rate and safety allowance.

Define landed operating cost as:

```text
Supplier Product Cost
+ Supplier Freight
+ Merchant-Paid Duties / Import Costs
+ Packaging / Fulfillment Charges
+ Per-Order Provider Fees
+ Expected Returns / Damage Allowance
+ Allocated Marketing Cost
= Landed Operating Cost
```

Support fixed markup, percentage markup, target contribution margin, and manual pricing. Distinguish markup from margin: buying for $10 and selling for $20 is 100% markup and 50% gross margin before other costs.

For a simplified shipping-included sale, with tax excluded from revenue:

```text
Minimum Pre-Tax Price = (Landed Operating Cost + Fixed Payment Fee)
                       / (1 - Percentage Payment Fee - Target Margin)
```

Example only: cost $16.00, assumed fixed fee $0.30, assumed percentage fee 2.9%, and target margin 40% produce about $28.55 before rounding. A $29.99 price leaves about $12.82 after those assumed costs and fees. These fee inputs are illustrative, not a quote for your Stripe account. The target plus percentage fee must be below 100%. For separately charged shipping, discounts, tax-related payment fees, bundles, and split orders, calculate against the complete quote using actual fee rules.

Owner policy should include a price floor/ceiling, target margin, rounding rule, maximum automatic increase, currency allowance, and optional maximum discount. A locked price stays locked. If source cost rises above the minimum acceptable margin, pause new checkout or request your decision instead of silently changing the locked price or selling at a loss.

Price changes affect future quotes. A paid order keeps its agreed price. Before supplier purchase, recheck landed cost against the approved purchase budget; never charge the customer an extra amount automatically. Mixed-supplier shipping must be included in the quote before payment.

## 9. Stripe Checkout And Order Flow

Use your existing Stripe account for a single-merchant store. Stripe Connect is unnecessary unless Bengali Blush later becomes a marketplace paying independent sellers. Start with hosted Stripe Checkout for the first production payment flow.

Proposed endpoints include `POST /api/checkout`, `POST /api/webhooks/stripe`, authorized customer order lookup, and restricted admin refund/cancel operations. Keep shared logic in server-only modules; thin route handlers call those services. Client facades can retain their existing interfaces while moving financial operations to trusted endpoints.

1. The customer chooses exact variants and quantities. Browsing remains public, with guest checkout supported.
2. The server validates input, destination, publication status, availability freshness, discounts, and authoritative prices. Treat browser cart prices and totals as display data.
3. Quote shipping/tax and persist an immutable order quote. Reserve owned stock or service capacity transactionally; supplier availability is an estimate unless the provider offers a real reservation.
4. Create the Checkout Session with the app order reference and a stable operation key. Repeated clicks reuse/recover the same attempt rather than creating duplicate purchases. Persist the Stripe reference.
5. Verify the Stripe webhook signature against the raw body. Durably record the verified event and job outbox before acknowledging it; failed persistence must remain retryable. Duplicate or reordered events must not produce repeated fulfillment. [Stripe webhooks](https://docs.stripe.com/webhooks), [Stripe idempotency](https://docs.stripe.com/api/idempotent_requests)
6. Resolve authoritative payment state and enqueue supplier/self-fulfillment only after successful payment. The browser success redirect alone never triggers buying. Include completed, expired, delayed-success, and delayed-failure paths; initially enable immediate methods until delayed-payment reservation handling is implemented. [Checkout fulfillment](https://docs.stripe.com/checkout/fulfillment?payment-ui=stripe-hosted)
7. Process each fulfillment group, record supplier acceptance, and send the actual order receipt and shipment updates.
8. Reconcile Stripe payments/refunds, Firestore orders, and supplier purchases so missed webhooks or ambiguous timeouts become recoverable exceptions.

An expired timestamp is the business authority for a reservation. Release it through a transaction/worker and reconcile abandonment. Firestore TTL is delayed cleanup and cannot be the stock-release mechanism. [Checkout inventory](https://docs.stripe.com/payments/checkout/managing-limited-inventory?payment-ui=stripe-hosted), [Firestore TTL](https://firebase.google.com/docs/firestore/ttl)

Customer refunds, supplier cancellations, supplier refunds, and returns are separate operations. A Stripe refund does not cancel a supplier order. Model partial refunds by line/amount, use operation keys, and track refund completion. Stripe refunds require available funds, and processing fees generally remain a cost. [Stripe refunds](https://docs.stripe.com/refunds)

Configure tax classifications, business location, destinations, registrations, and shipping treatment before activating automatic tax. Calculation/collection is separate from registration and filing/remittance; select the required services for your actual jurisdictions. [Stripe Tax setup](https://docs.stripe.com/tax/set-up), [Tax filing/remittance](https://docs.stripe.com/tax/filing)

Use separate test/live credentials, webhook secrets, and data environments. Preview/development must not buy real supplier products. Never store card numbers or security codes in Firestore.

## 10. Automated Fulfillment And Recovery

Build one capability-aware supplier interface for catalog search, details/variants, stock, freight quotes, purchase, purchase lookup, tracking, and supported cancellation/return operations. An adapter must report unsupported capabilities so the admin can route them to manual handling.

Normal workflow:

```text
Discover -> Normalize -> Match Category -> Review / Allowlisted Approval
-> Price -> Publish -> Refresh Cost / Stock -> Customer Pays
-> Check Spend / Availability -> Purchase -> Track -> Resolve Delivery
```

Reliability requirements:

- Commit payment/order state and an outbox job together. A dispatcher enqueues the job; a reconciler repairs the commit-to-enqueue gap.
- Use bounded batches, leases, retry backoff, provider quotas, and per-connection concurrency controls.
- Keep external Stripe/supplier calls outside Firestore transaction callbacks because transaction callbacks can rerun. [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions)
- Protect purchases using the provider's idempotency facility where available. After an ambiguous timeout, look up the external order/reference before retrying; if purchase status cannot be established, mark `purchase_unknown` and stop automatic rebuying.
- Split mixed carts into supplier and self-fulfilled groups, with line-level tracking and partial shipment/refund support.
- Treat tracking creation, carrier acceptance, transit, and delivery as different events. Do not label a created tracking number as a dispatched package.
- Record job attempts and final failures in the admin inbox. Safe replay must resume the failed operation without repeating successful payment or procurement.
- Pause new sales when availability is stale beyond the configured threshold, source costs exceed policy, a supplier route fails, or supplier funding is too low. Continue reconciliation and necessary customer resolutions during a procurement pause.
- Automatically use an alternative supplier only for a previously approved equivalent SKU/variant within cost and delivery limits. Otherwise request a decision; do not silently substitute goods.

Starting cadence, adjustable to provider quotas: refresh active stock/cost every 30–60 minutes, recheck at checkout and immediately before procurement, update tracking from supported webhooks with periodic fallback, and reconcile open operations daily. These are proposed operating targets, not supplier freshness guarantees.

Your customer promises must be based on real shipping capability. For US merchandise, handle delays through the required customer consent/cancellation/refund process. Build this into customer updates and the order timeline. [FTC shipping-delay guidance](https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule)

Supplier reimbursement can differ from your customer policy. Keep a loss allowance rather than requiring a supplier refund before resolving a valid customer issue. [CJ dispute/refund policy](https://www.cjdropshipping.com/dispute-policy.html), [AutoDS fulfillment terms](https://help.autods.com/en/articles/12699825-fulfilled-by-autods-fba-automation-terms-and-conditions)

## 11. AI That Helps Reduce Your Work

Use AI as an assistant inside approved business rules:

- Search authorized supplier feeds for products matching the existing categories, aesthetic, acceptable costs, shipping, and specifications.
- Rank candidates and explain the match; reject duplicates, blocked source IDs, unsupported claims, and incomplete required facts.
- Draft concise Bengali Blush descriptions, titles, tags, alt text, and category assignments using verified attributes.
- Summarize cost changes, margin movement, late shipments, and recurring supplier problems.
- Draft support replies from actual order/tracking facts and approved policies; route unusual claims/refunds to the exception inbox.

An AI model must not invent ingredients, origin, certifications, fabric authenticity, stock, reviews, shipping dates, or product equivalence. Supplier text is untrusted input and cannot change spend limits or instruct tools. AI output passes validation and field locks before publication.

Initially keep discovery and publication in review mode. Later permit automatic publication only for approved suppliers/categories with complete required facts and a per-run/day listing cap. AI never gets unrestricted purchase/refund authority; server policy validates every action. AI usage needs its own budget and provider setup beyond Vercel/Firebase.

## 12. Your Own Products And Services

Provide source/fulfillment modes such as `custom_physical`, `supplier_physical`, `made_to_order`, and `service`. Your custom items never enter supplier purchase jobs or have content/prices overwritten by imports.

For custom physical products, support your SKU, images, variants, stock, delivery terms, price, and manual dispatch/tracking entry. For made-to-order items, show preparation time and obtain the needed configuration before quoting. You can replace or remove these through the same publication/history controls.

For services, add explicit `fixed`, `from`, `quote`, and optional `deposit` pricing with numeric money fields. A `$145+` display string is not a charge amount. Keep appointment inquiries available. Only charge a service amount/deposit against a confirmed slot or approved quote with cancellation/refund terms. Automatic booking requires staff availability, duration, timezone, capacity, and transactional slot reservation.

Start with physical-product checkout and separately confirmed service payments. Combine service and shipped-product checkout only after tax, scheduling, cancellation, and split fulfillment semantics are designed. Digital goods/subscriptions can be later features if requested.

## 13. Phased Roadmap With Release Gates

These are deliverables and future review criteria, not checks performed for this document. Time ranges are planning estimates for focused development, excluding supplier approval, samples, owner decisions, and operational delays. A narrow production pilot is approximately 8–12 weeks; broad Shopify feature parity is a larger project.

| Phase | Approximate Effort | Deliverables | Gate Before Continuing |
| --- | --- | --- | --- |
| 0. Confirm Operating Model | 3–5 working days | US/USD pilot assumptions, supplier/API capability confirmation, real candidate SKUs, funding, sample order, shipping/return terms | Supplier access and product economics proven; owner chooses limits |
| 1. Trusted Commerce Foundation | 1–2 weeks | Server authentication, role checks, private procurement data, schema/readers/rules migration, environments, outbox, paid-order retention | Existing records/IDs preserved; financial fields server-controlled |
| 2. Paid Shop Pilot | 1–2 weeks | Variants, authoritative quotes, Stripe Checkout/webhooks, owned stock policy, shipping/tax, receipts, guest/account order access | Owner-authorized test payment/refund and failure scenarios meet criteria |
| 3. Supplier Import And Admin Controls | 1–2 weeks | One adapter, import preview, real media/specifications, price engine, locks, exclusions, bulk actions | Approved products import without overwriting owner edits or recreating removed items |
| 4. Automated Procurement And Tracking | 1–2 weeks | Funded purchase jobs, spend checks, idempotency/recovery, shipment sync, returns/cancellations, exception inbox | Small capped real fulfillment pilot reconciles correctly |
| 5. Production Release | About 1 week | Policies, support, monitoring, backup/recovery, catalog SEO, performance/cost controls, limited catalog launch | Owner reviews diff and authorizes verification/deployment; no unresolved payment/fulfillment blocker |
| 6. Controlled Hands-Off Operation | Following 2–4 weeks | Allowlisted auto-publish, AI drafts/scouting, tuned schedules, validated alternate sources, routine digest | Actual delivery, margin, exception, and support performance supports higher automation |

Phase 0 may overlap drafting/data design, but live purchasing cannot precede confirmed access and supplier terms. Your project guidance recommends considering gpt-5.5 fast for the later payment/security architecture and implementation; retain the model/speed you select in Codex.

First implementation slice: one approved provider, a small physical catalog, USD, a defined US shipping area, Stripe Checkout, manual import approval, and capped automated fulfillment. Preserve current custom products/services throughout. Add extra suppliers, unrestricted discovery, complex promotions, and advanced reporting after the pilot.

## 14. Future Acceptance Criteria

Before authorizing a live rollout, review and verify these behaviors:

- A changed/tampered browser price cannot change the charged amount; the server presents the authoritative total before payment.
- A repeated checkout click, webhook, queue delivery, or ambiguous supplier timeout cannot create an unintended duplicate purchase.
- Failed/expired payment releases reservations; delayed payment never triggers premature fulfillment.
- Owned stock cannot be oversold through concurrent checkouts. Supplier stock changes have a defined refund/exception resolution.
- Manual prices and locked fields survive sync. Cost changes pause unsafe sales without silently undoing your choices.
- Removing a product prevents new purchases and automatic reimport; open orders retain their original details.
- A custom product follows self-fulfillment; a service never enters dropship procurement.
- Wrong variants, partial shipments, refunds, returns, and supplier rejection remain visible and recoverable by line.
- Guest order links use secure, scoped access; customer records and supplier costs are never publicly exposed. Keep the existing `/orders` admin route and use a distinct customer route such as `/profile/orders`.
- Non-admins cannot change catalog/automation settings; permitted staff actions cannot bypass Owner financial limits.
- Paid-order history survives account deletion according to the reviewed retention policy.
- Development/preview cannot create live payments or real supplier purchases.
- A paused scheduler, expired credential, empty supplier balance, or missed webhook raises an actionable exception and can be reconciled.

Use appropriate TypeScript/lint/build checks, targeted webhook/queue/rule tests, and a controlled payment/fulfillment pilot when you authorize implementation verification. Follow the repository deployment ordering for indexes, compatible app versions, and rules. This roadmap task runs none of those checks.

## 15. Storefront, Operations, And Cost Controls

Preserve the existing About, Terms, Contact, Privacy, internal navigation/aliases, sticky header, scroll-to-top, and current-year Piratechs footer. Update the policies for real sales and add clear Shipping, Returns/Refunds, and order-support information before launch. Keep the existing PWA; private order/payment/admin data must not be exposed through offline caching.

Add product-specific server metadata, canonical URLs, accurate Product/Offer structured data, and catalog detail URLs in the sitemap. Replace full-catalog loading/detail scans as the imported catalog grows with direct slug lookups, category/search cursor pages, and deliberate public-cache invalidation. Preserve current admin pagination; global search needs a query/index strategy rather than loading every record into the browser.

Financial reporting must use paid transactions and trusted aggregates. Show gross sales, discounts, refunds, shipping/tax collected, supplier spending, processing/provider fees, and contribution margin separately. The current recent-50-record subtotal is not lifetime revenue or profit.

Configure:

- Operational alerts for payment-processing failures, purchase uncertainty, stale jobs, overdue dispatch, low funds, expired credentials, and recurring supplier failures.
- Owner procurement limits per order/day/provider, maximum outstanding purchase exposure, and a global buying pause. These limits apply transactionally across workers.
- A cash reserve for supplier payment before Stripe payout, refunds, disputes, damage, and other losses. Customer payment receipt does not mean funds are immediately available for procurement.
- Firestore backups/recovery and a retention policy for payments, audit events, job history, and personal data.
- API rate limiting, verified App Check where applicable, upload validation, bounded queues, and server input validation. App Check alone is not a per-customer rate limit.
- A quiet routine digest with alerts only for meaningful exceptions; choose email/in-app notification delivery during implementation.

Your current subscriptions provide infrastructure, not a complete commerce operating budget. Incremental costs can include Firestore reads/writes/storage, Firebase Functions/Tasks/Scheduler/Storage, Vercel usage, Stripe processing/tax services, supplier products/freight/credits/add-ons, transactional email, AI usage, product samples, and returns. Obtain current account-specific prices before enabling paid services; this plan does not promise a fixed monthly total.

Billing alerts do not cap Firestore spend. Firebase currently documents Preview spend caps for selected services, but they are delayed controls rather than hard limits and can pause fulfillment; Firestore is not listed among the eligible services. Keep application procurement budgets separate from cloud billing controls and plan how to handle service pauses. [Firebase spend caps](https://firebase.google.com/docs/projects/billing/spend-caps)

## 16. Decisions Needed Before Live Implementation

Use the following as the initial owner setup checklist, not a reason to delay drafting or foundation work:

| Decision | Proposed Starting Point |
| --- | --- |
| Selling region/currency | Defined US destination area, USD; confirm business and shipping details |
| Supplier | CJ API pilot; AutoDS only after custom-store compatibility is confirmed |
| Initial catalog | About 10–20 approved variants; exclude unresolved supplier/product evidence |
| Payment | Your existing Stripe account, immediate methods first, confirmed test/live setup |
| Margin/prices | Owner chooses target, floor/ceiling, return allowance, and manual locks |
| Procurement | Owner chooses funding mechanism, cash reserve, daily/order caps, and fallback handling |
| Publishing | Manual approval first; limited allowlisted auto-publish after successful operation |
| Customer policies | Confirm dispatch/delivery promises, returns, cancellation, support, and tax setup |
| Services | Preserve inquiries; add deposits/fixed payments after slot/quote confirmation |
| Exceptions | Owner or chosen operator receives actionable alerts and can pause/replay safely |

The intended finished result is a Bengali Blush shop you can run from its own admin: add your own products/services, approve and adjust imports, set or lock prices, remove unwanted goods permanently from automation, and let confirmed payments trigger controlled fulfillment and tracking. Expansion should follow measured reliability and margin from the first supplier pilot.
