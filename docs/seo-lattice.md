# FFL Accelerator, SEO lattice

## Role

This host is the retailer door for the managed ecommerce website. Contact, the plan, and privacy stay here.

| Intent | Where |
|--------|--------|
| The website offer | `/` and `/plan/` |
| Contact | `/contact/` |
| Privacy | `/privacy/` |
| Store software is not one product | `/guides/gun-store-software/` |
| Plan ladder (all five tiers) | coriolisagency.com `/ecommerce`. Not targeted here; this site sells one plan |
| Trend notes | `/trends/*` — retired 2026-10 (410), S3 |

Legacy paths 301 to on-site URLs. See [redirect-map.md](redirect-map.md). `/ffl-dropshipping` goes to `/plan/#inventory-dropshipping`. `/switch` and `/retailbi-and-axis` go to `/`.

## Rules

1. Calls to action go to `/contact/` on this host. Do not 301 `/` or `/plan/`.
2. Document titles, `og:title`, `og:description`, `twitter:title`, and `twitter:description` do not include a price or a tier name. The brand name FFL Accelerator is fine. Prices and tier names stay in the page body.
3. FAQ JSON-LD on `/` and `/plan/`.
4. Organization `url` is `https://fflaccelerator.com`. There is no `sameAs`. The homepage carries one link to `https://www.coriolisagency.com/about` (Paul override 2026-10-07). No other page links to the agency. The build gate (`scripts/check-banned-links.mjs`) allows exactly that one href in `dist/index.html` and nothing else.
5. Never H1 "RetailBI alternative." Never "switch off RetailBI." Never 4473 automation.
6. Do not add an OEM or Demand Intelligence pitch on this domain.
7. Pricing in the body: $569/mo. Setup $500 or $2,500, on `/plan/#setup`.
8. Do not invent RetailBI Index numbers.
9. Canonicals use trailing slashes.
10. No trend or market-commentary pages on the offer site.

## Internal links

- Home cards link to the matching `/plan/` section id.
- Footer links include contact and privacy.
- Marketplace names stay in one component and are not rendered. The page shows "Integrations with 13 online marketplaces".
