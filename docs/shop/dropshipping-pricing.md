# Dropshipping Pricing and Budget

Researched October 13, 2026. Published amounts below are in USD with US merchant assumptions, before taxes. Arithmetic scenarios and budget allowances are estimates, not vendor quotes or guarantees. Promotional trials are excluded from steady-state budgets. Recheck provider prices, account eligibility, supported channels, and API access when implementing a store.

The reusable system should keep the app's storefront, admin tables, branding, category matching, and supplier adapter separate. That allows each project to keep its own look while choosing a supported supplier or commerce platform. Paid automation can reduce fulfillment work, but its subscription does not cover inventory, shipping, all automation credits, or every return exception.

## Supplier and Commerce Options

| Option | Published recurring price | What the estimate includes or excludes |
| --- | --- | --- |
| CJdropshipping | Free membership; optional Plus $15.99/month, Prime $19.99/month, Advanced $59.99/month, as displayed | Membership is separate from product, shipping, storage, packaging, and other service charges. Obtain current SKU, variant, destination, and shipping quotes. [CJ memberships](https://www.cjdropshipping.com/prime), [service fees](https://www.cjdropshipping.com/service-fee) |
| DSers | Basic free; Advanced $19.90/month; Pro $49.90/month; Enterprise $499.90/month | Account plans have different store/channel limits and automation features. Do not multiply the whole subscription by every connected store when the plan covers multiple stores. Product and shipping costs remain separate. [DSers pricing](https://www.dsers.com/pricing) |
| AutoDS for Shopify | Import 200 $26.90/month; Starter 500 $39.90/month; Advanced 1K $66.90/month | Starter includes price/stock monitoring; Import is a cheaper baseline with different capabilities. These are Shopify channel prices, not a custom Firebase API quote. [Official Shopify listing](https://apps.shopify.com/autods) |
| AutoDS order automation | Orders Processor/auto-ordering add-on $9.90/month | Auto-Order Credits and supplier funding are additional. [AutoDS add-on pricing](https://www.autods.com/pricing/), [credit requirements](https://help.autods.com/en/articles/12700458-auto-order-credits-for-order-automation-and-tracking-conversion) |
| AutoDS Product Finding Hub | Optional $14.97/month | Separate from order automation and keyword-volume APIs. The Shopify listing distinguishes free marketplace access from paid hand-picked products. [AutoDS pricing](https://www.autods.com/pricing/), [Shopify listing](https://apps.shopify.com/autods) |
| Shopify Basic | $39/month on monthly billing, or $29/month equivalent with yearly billing | Annual equivalent implies an annual commitment; it is not a $29 month-to-month plan. Payment processing and app subscriptions remain additional. [Shopify US pricing](https://www.shopify.com/pricing) |

DSers currently advertises an Open API and MCP integration, and AutoDS advertises MCP. Those announcements do not establish that a standard merchant subscription grants every catalog, ordering, returns, or custom-store API capability. Confirm authentication, scopes, supported channels, commercial access, rate limits, and unattended fulfillment before committing to an adapter. [DSers developer links](https://www.dsers.com/pricing), [DSers Open API](https://www.dsers.dev), [AutoDS listing](https://apps.shopify.com/autods)

The supported Shopify custom storefront flow uses Shopify as the commerce backend and Shopify Checkout. The bundles below therefore assume Shopify commerce and checkout; they do not price or establish a standalone native Stripe checkout that bypasses Shopify. A custom presentation can coexist with that architecture, but its checkout behavior must be an explicit product decision. [Shopify custom storefront guidance](https://help.shopify.com/en/manual/custom-storefronts)

| Example bundle | Computed recurring subtotal | Additional costs |
| --- | ---: | --- |
| Shopify Basic + DSers Advanced, monthly plans | $39 + $19.90 = **$58.90/month** | Processing, product/shipping, research enrichment, optional custom hosting, and operating costs |
| Shopify Basic annual equivalent + DSers Advanced monthly | $29 + $19.90 = **$48.90/month equivalent** | Annual Shopify commitment plus the same exclusions |
| Shopify Basic + AutoDS Starter + Orders Processor | $39 + $39.90 + $9.90 = **$88.80/month** | Auto-Order Credits, supplier balance/funding fees, research enrichment, product/shipping, and operating costs |
| Previous AutoDS bundle + Product Finding Hub | $88.80 + $14.97 = **$103.77/month** | Same exclusions; the Finding Hub is optional |
| Custom app + CJ free membership | **$0 supplier membership/month** | Custom infrastructure and research below, plus actual supplier/service quotes; custom API suitability must be confirmed |

AutoDS publishes a 100-credit package for $39.90. Its documentation describes one credit for a basic automated order without tracking conversion, with extra credits for some tracking/sourcing actions. Thus 100 basic automated orders would consume a $39.90 package in this example; it is separate from the $9.90 add-on and from product/shipping funds. Credits are account-shared and do not expire while the account remains active; credits for canceled/returned orders are not returned. [AutoDS credit pricing and consumption](https://help.autods.com/en/articles/12700458-auto-order-credits-for-order-automation-and-tracking-conversion)

Fulfilled by AutoDS also requires sufficient managed supplier balance. Its documentation lists balance funding fees of 5% for credit/debit card or PayPal and 3% for Payoneer. These affect operating cash and must be checked against the actual account before enabling automation. [AutoDS fulfillment and balance funding](https://help.autods.com/en/articles/12700443-automate-your-orders-with-fulfilled-by-autods-fba)

## Custom App Infrastructure and Research

| Service | Published rate or allowance | Scope and budgeting rule |
| --- | --- | --- |
| Vercel Pro | $20/month platform fee, including one deploying seat and $20 infrastructure credit; extra deploying seats $20/month | Commercial store hosting requires an eligible commercial plan; Hobby is restricted to personal, noncommercial use. If an existing Pro team has capacity, budget incremental usage instead of a second whole subscription. [Pro plan](https://vercel.com/docs/plans/pro-plan), [Hobby restrictions](https://vercel.com/docs/plans/hobby) |
| Firebase Authentication | Google/email methods have no-cost usage within applicable limits; with Identity Platform, first 50,000 MAUs included | Phone SMS is separate. Retain the existing auth configuration and assess actual plan/usage. [Firebase pricing](https://firebase.google.com/pricing) |
| Firestore Standard | 1 GiB storage; 50,000 reads/day; 20,000 writes/day; 20,000 deletes/day; 10 GiB egress/month included | Overage depends on database region and query behavior. These quotas do not prove the existing project has unused capacity. [Firebase pricing](https://firebase.google.com/pricing) |
| Cloud Functions for Firebase | Blaze/billing account required for production; Firebase lists monthly no-cost quotas of 2M invocations, 400K GB-seconds, 200K CPU-seconds, and 5 GB internet egress; invocation overage $0.40/M | Generation, region, deployment artifacts, builds, networking, secrets, and other workloads affect the actual bill. A quota is not a promise of a zero-cost deployment. [Firebase pricing](https://firebase.google.com/pricing), [Functions billing requirements](https://firebase.google.com/docs/functions/faq-and-troubleshooting) |
| Cloud Scheduler | First three jobs free per Google billing account; additional jobs $0.10/job/month | One job executing four times/day is still one scheduler job. The allowance is shared across projects; executions do not each cost $0.10. [Scheduler pricing](https://cloud.google.com/scheduler/pricing) |
| DataForSEO Google Ads keyword metrics | $0.06/task Standard; $0.09/task Live; up to 1,000 keywords/task | Standard averages 1–3 hours, Live about seven seconds. Batch candidates: the task price is the same for 1 or 1,000 keywords. [Current pricing](https://dataforseo.com/pricing/keywords-data/google-ads), [batch contract](https://docs.dataforseo.com/v3/keywords_data-google_ads-search_volume-live/) |
| DataForSEO Google Trends | $0.0027/task Standard; $0.011/task Live; up to five keywords/task | Standard targets up to 45 minutes; Live averages about 32 seconds. This provides relative popularity, not absolute monthly searches. [Trends pricing](https://dataforseo.com/pricing/keywords-data/google-trends) |
| DataForSEO funding | $50 minimum prepaid top-up; no subscription; unused balance never expires | This is an upfront cash requirement, not $50 every month. API requests consume the balance. [DataForSEO billing](https://dataforseo.com/pricing) |

Second-generation functions use Cloud Run infrastructure. The Cloud Run request-based table separately lists monthly no-cost allowances of 180,000 vCPU-seconds, 360,000 GiB-seconds, and 2M requests, based on us-central1 active rates. Use the actual deployed generation, billing model, and region in the implementation estimate rather than adding both sets of free compute allowances together. [Cloud Run pricing](https://cloud.google.com/run/pricing)

Realtime Firestore listeners charge reads as matching documents are added or updated, and reconnects can cause a fresh query charge. Limit and paginate admin/storefront subscriptions; avoid rewriting all candidate documents when values have not changed. Google Cloud budget alerts should accompany application limits on run count, batch size, provider retries, concurrency, and paid enrichment. A planning allowance or alert does not itself enforce a hard cap. [Firestore billing](https://firebase.google.com/docs/firestore/pricing), [Functions cost controls](https://firebase.google.com/docs/functions/faq-and-troubleshooting)

Search-volume columns must identify the keyword, locale, language, measurement period, provider, and last fetched date. Google Trends is a sampled, normalized **0–100 interest index**; it must appear under a separate trend label. Google Ads keyword metrics generally update around the middle of the month, so cache existing volume estimates and refresh when new monthly data or new candidate phrases are available. Intraday research can still discover products and update stock/prices. [Google Trends explanation](https://support.google.com/trends/answer/4365533?hl=en), [Google Ads update cycle](https://dataforseo.com/pricing/keywords-data/google-ads)

Reviews, competitor sale prices, and supplier stock are separate data sources. The keyword API budget below does not include a Merchant API, review-data license, unrestricted marketplace scraping, or paid supplier catalog access. Use supplier-provided evidence or separately price a licensed source; keep missing fields unavailable rather than inventing values.

## Optional AI Scoring

An example paid Gemini 3.1 Flash-Lite configuration costs $0.25 per million input tokens and $1.50 per million output tokens, including thinking output, for standard text/image/video processing. This is an optional service budget for scoring catalog evidence and preparing copy; it does not change the model or speed selected in the Codex UI. Other models, search grounding, cache storage, image generation, and retries require their own rates. [Google AI pricing](https://ai.google.dev/gemini-api/docs/pricing)

AI should rank evidence-backed candidates for category, appearance, margin, and delivery fit. Model output alone cannot certify that a real product exists, is dropshippable, is in stock, or has a stated review count. Supplier capabilities and observed metrics must establish those facts.

## Fifty-Candidate Monthly Scenarios

These are deliberately simple consumption examples for a maintained pool of 50 candidates over a 30-day month. A pool of 30 candidates needs six five-keyword Trends tasks/run instead of ten; other assumptions below are unchanged.

Assumptions:

- Two or four research runs/day, giving 60 or 120 runs/month.
- One candidate keyword each, in one target locale/language.
- One batched Google Ads task/run and ten five-keyword Trends tasks/run.
- Optional AI usage of 30,000 input and 5,000 output tokens/run.
- One Scheduler job; no always-on minimum compute instances.
- Supplier catalog access is included in the chosen provider agreement or priced separately.
- An illustrative Firebase allowance of $0–$10/month; this is not a provider quote, guaranteed bill, or enforced cap.

| Computed monthly component | Two runs/day | Four runs/day |
| --- | ---: | ---: |
| Research runs | 60 | 120 |
| Google Ads Standard: runs × $0.06 | $3.60 | $7.20 |
| Trends Standard: runs × 10 × $0.0027 | $1.62 | $3.24 |
| Optional AI input: runs × 30,000 / 1M × $0.25 | $0.45 | $0.90 |
| Optional AI output: runs × 5,000 / 1M × $1.50 | $0.45 | $0.90 |
| New Vercel Pro team | $20.00 | $20.00 |
| Standard subtotal before Firebase allowance | **$26.12** | **$32.24** |
| Standard subtotal plus illustrative Firebase allowance | **$26.12–$36.12** | **$32.24–$42.24** |
| Live Google Ads + Live Trends + optional AI + new Pro team | **$32.90** | **$45.80** |
| Live subtotal plus illustrative Firebase allowance | **$32.90–$42.90** | **$45.80–$55.80** |

The Live scenario uses $0.09 per Google Ads task and $0.011 per Trends task. All task and token rates are sourced in the preceding tables. This scenario intentionally refetches search volume more often than needed; monthly caching and enrichment of new candidates can reduce the Google Ads line. More keyword variants, locales, manual runs, retries, price/review enrichment, or image-heavy scoring increase consumption.

For a low-traffic pilot with a new Pro team, plan **$30–$60/month** for custom hosting, lightweight research, and AI, or **$30–$75 with contingency**, excluding the supplier/operating costs below. This is an engineering allowance. With an existing Pro subscription and available capacity, the same calculated Standard research/AI subtotal is **$6.12–$12.24/month**, plus incremental infrastructure and supplier costs. Do not treat the $20 Vercel credit as a second $20 refund or as a new credit per project.

The initial $50 DataForSEO deposit remains necessary even if the estimated first month's consumption is only a few dollars. Do not add $50 to every month's API consumption; track cash paid and balance consumed separately.

## Payments, Returns, and Working Capital

| Stripe US item | Published rate | Budget implication |
| --- | --- | --- |
| Domestic online cards | 2.9% + $0.30 per successful transaction; no setup/monthly Payments fee | A $50 order costs $1.75. Embedded Stripe Elements can be styled within the app's checkout. [US pricing](https://stripe.com/us/pricing) |
| International cards / FX | +1.5% for international cards; +1% if currency conversion required | Model the actual customer/payment mix. [US pricing](https://stripe.com/us/pricing) |
| Standard card refunds | No extra refund-issuance fee; original processing and FX fees are retained | A refunded $50 domestic order leaves $1.75 unrecovered; supplier refund/return fees are separate. [Refund fees](https://support.stripe.com/questions/understanding-fees-for-refunded-payments) |
| Disputes | $15 received-dispute fee; $15 manual-counter fee, with the counter fee returned on a win | Reserve for exceptions and separately assess Smart Disputes or other optional services. [US pricing](https://stripe.com/us/pricing) |

Example: 100 domestic $50 orders produce $5,000 gross customer charges and **$175 processing fees**. Five full refunds leave **$8.75 of those already-paid fees** unrecovered; that $8.75 is part of the $175 and must not be added twice. Customer refunds also reverse $250 of revenue. Whether supplier costs are recovered depends on each return's eligibility and supplier policy.

Subscriptions and hosting are recurring overhead. Supplier product/shipping payments, managed balances, automation credits, and refund reserves are working capital or usage expenses. Suppliers may need payment before the customer's payout becomes available, so automation needs sufficient supplier funds and should pause or flag an order when funding or the allowed margin is insufficient. Actual payout timing and supplier terms determine the required buffer; this document does not assume a specific account's payout schedule.

An illustrative buffer formula is:

`Peak daily supplier spend × expected funding gap in days + refund/exception reserve`

For example, five orders/day at an assumed $20 supplier cost and an assumed seven-day funding gap require $700, plus a chosen reserve. These are assumptions, not vendor prices or a promise about Stripe payout timing. A $200 reserve would give a $900 example buffer. Do not label this reserve as a monthly subscription expense.

Stripe setup does not need to precede disconnected mockups or market research. Connect secure payments and the supplier fulfillment flow before imported products become purchasable. Customer refunds and supplier returns need linked but separate statuses; a supplier refund to its own balance does not automatically mean the shopper has been refunded through Stripe.

## Costs Excluded From the Pilot Allowance

Product purchases, shipping, packaging/branding, supplier service/storage charges, supplier-balance funding fees, automation credits, returns and return labels, unrecoverable payment fees, disputes, taxes/compliance tooling, customer support, email/SMS, domains, samples, ads, additional data licenses, provider subscription upgrades, and development are excluded. Confirm landed cost per SKU and destination before publishing an imported product.

Development is a separate project cost. A reusable skill captures workflow, prompts, contracts, and adoption rules; it does not remove the work needed for adapters, hosted endpoints, checkout/webhooks, reliable fulfillment, returns, private credentials, and account-specific external setup. Estimate that work after the chosen provider's access and API contract are known.

This document records planning research only. It does not claim that provider accounts, Stripe, scheduled research, live supplier inventory, deployed Firebase rules, or unattended fulfillment are connected. The current authorized deliverable remains disconnected frontend mockups and a reusable implementation plan; runtime validation is deferred for user review.
