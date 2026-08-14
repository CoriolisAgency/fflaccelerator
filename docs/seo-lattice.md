# FFL Accelerator — SEO lattice

## Role

**FFLAccelerator.com** is the retailer firebase → Coriolis FFL Accelerator plan ($569/mo, GunSearchAgent Pro included).

| Intent | Ranking owner |
|--------|----------------|
| FFL Accelerator / managed Woo for FFLs / $569 plan | **This site** `/` and `/plan` |
| Gearfire **website** alternative (retailer) | **This site** `/switch` |
| FFL ecommerce as a service | **This site** `/ffl-ecommerce` |
| FFL dropshipping (retailer funnel) | **This site** `/ffl-dropshipping` |
| Why GSA Pro is in the plan | **This site** `/gunsearchagent-included` |
| AXIS already feeds RetailBI; website still dark | **This site** `/retailbi-and-axis` |
| Gun store software / 4473 literacy (we are not that) | **This site** `/guides/gun-store-software` |
| Agency HQ / checkout / MSA | **Coriolis** `coriolisagency.com/plans` |
| GA for FFLs / free agent install | **GunSearchAgent** |
| GSA dealer + RetailBI self-serve | **GSA** `/retailbi-and-your-gun-store` |
| What is RetailBI / Index / NICS vs sales | **GunSearchEngine** `/betsy-vs-retailbi` etc. |
| Three numbers desk | **FFLIntel** |
| Betsy AI character | **2aBetsy** |

## Rules

1. Conversion is always `https://coriolisagency.com/plans`. Do not clone checkout.
2. First ~80 words of each commercial page answer the query.
3. FAQ JSON-LD on commercial pillars (`/`, `/plan`, `/switch`, `/ffl-ecommerce`, `/ffl-dropshipping`, `/gunsearchagent-included`, `/retailbi-and-axis`).
4. Organization `sameAs`: coriolisagency.com, gunsearchengine.com, gunsearchagent.com, 2abetsy.com, fflintel.com, fflaccelerator.com, x.com/2ABetsy, youtube.com/@BetsyAI.
5. Never H1 “RetailBI alternative.” Never “switch off RetailBI.” Never 4473 automation claims.
6. Frozen strings from `src/lib/frozen.ts` (entity-kit). Commercial pages include: *The site is yours. Betsy on it is included. That feed is what OEMs buy as Demand Intelligence.*
7. Pricing honesty: Accelerator **$569/mo**. Setup $500 / $2,500. Old WP $269 was Militia — do not reuse as Accelerator.
8. Do not invent RetailBI Index numbers. Trend closes separate NICS, RetailBI same-store, and search intent.

## Internal links

- Home → plan, switch, GSA-included, retailbi-and-axis
- Switch → retailbi-and-axis (keep RetailBI)
- Ecommerce ↔ dropshipping ↔ plan
- Trends → fflintel methodology + GSE betsy-vs-retailbi
- Guide → ecommerce + retailbi-and-axis (soft CTA only)
