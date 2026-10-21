# FFL Accelerator, SEO lattice

> **Governed by `CoriolisAgency/coriolis` `docs/seo/`** (ARCHITECTURE.md, PAGE-MAP.md, LINK-PLAN.md). This file is FFLA's own page table. When this file and `docs/seo/` disagree, `docs/seo/` wins. Pointer header added Wed Oct 21, 2026 (Sprint 0, DC-4); no content change.

## Role

This host is the retailer door for the managed ecommerce website. Contact, the plan, and privacy stay here.

| Intent | Where |
|--------|--------|
| The website offer | `/` and `/plan/` |
| Contact | `/contact/` |
| Privacy | `/privacy/` |
| FFL software is not one product | `/guides/gun-store-software/` |
| Plan ladder (all five tiers) | coriolisagency.com `/ecommerce`. Not targeted here; this site sells one plan |
| Trend notes | `/trends/*` — retired 2026-10 (410), S3 |

Legacy paths 301 to on-site URLs. See [redirect-map.md](redirect-map.md). `/ffl-dropshipping` goes to `/plan/#inventory-dropshipping`. `/switch` and `/retailbi-and-axis` go to `/`.

## Rules

1. Calls to action go to `/contact/` on this host. Do not 301 `/` or `/plan/`.
2. Document titles, `og:title`, `og:description`, `twitter:title`, and `twitter:description` do not include a price or a tier name. The brand name FFL Accelerator is fine. Prices and tier names stay in the page body.
3. FAQ JSON-LD on `/` and `/plan/`.
4. Organization `url` is `https://fflaccelerator.com`. There is no `sameAs`. No page links to the agency. The homepage proof line links to on-site `/about/` (Paul 2026-10-20 2:37 PM ET: pull the agency link; same fix as FFLA-L6 / #28, replaces the 2026-10-07 agency /about link and supersedes the #29 revert for this link). Every page may load `https://www.gunsearchengine.com/embed.js` as a script src (observe mode). The build gate (`scripts/check-banned-links.mjs`) allows no agency href anywhere and only that one GSE script src; GSE hrefs stay banned.
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

## Keyword targets (FFLA-L1, locked by Paul 2026-10-16)

Approved as written from the 10/7 lattice review, section 5 (decision `2026-10-16-ffla-lattice-l1-l4`, coriolis repo). These are SEO targets (titles, H1s, page intent). Ads keep all launch keywords on `/lp/`, which is noindex, so bidding there does not compete with agency rankings. GSC figures are impressions, not search volume.

Split principle:
- FFLA takes the single-offer, done-for-you intents no agency page owns: the brand name; "FFL software" as store software; managed or done-for-you FFL website; generic website migration; managed hosting, maintenance and webmaster. Every FFLA term carries an "FFL" or "managed" modifier.
- The agency keeps plans, pricing, builder, "best", platform comparisons, dropshipping, register integrations, email and WooCommerce explainers.
- Gun-word SEO = agency only. The ad-copy gate bans those words in visible copy here, so this site never rank-targets them.

### Existing pages

| Page | Primary | Secondary | Use |
|------|---------|-----------|-----|
| `/` | ffl accelerator (brand; "fflaccelerator") | managed ffl website; done-for-you ffl website; ffl website you own | SEO (brand) |
| `/plan/` | what's included in a managed ffl website | ffl website with webmaster; ffl website setup (setup prices in the body only) | SEO |
| `/guides/gun-store-software/` (URL kept; 301 target) | ffl software | ffl order management software; ffl dealer software; best ffl software; small business ffl software; software for ffl dealers; how to choose ffl software | SEO. Says the website is the job; records and 4473 software is not |
| `/lp/` (noindex) | All 7 ad-group themes: software, switch, catalog, checkout, email, own, uptime | | Ads only |
| `/contact/`, `/about/`, `/privacy/` | none (utility) | | SEO incidental |
| `/confirmed/` | none; noindex | | |

Not targeted anywhere here: record-keeping, compliance, "ATF approved" or background-check software terms. They are not sold, and they stay Ads negatives. Copy handles them as "not us".

### Proposed new pages (later sprints)

| Page | Primary | Secondary | Sprint |
|------|---------|-----------|--------|
| `/ffl-website-migration/` | ffl website migration | switch ffl website; ffl website redesign; new ffl website; move ffl website without losing rankings | L6 |
| `/managed-ffl-website-hosting/` | ffl website maintenance | ffl webmaster; ffl website support; ffl wordpress support; managed hosting for ffl | L7 |
| `/ffl-software-home-based-business/` | ffl software for home based business | small business ffl software | L7, Paul call |

### Collisions with agency ownership

| Terms | Owner |
|-------|-------|
| ffl website pricing / plans | Agency SEO. Never targeted here |
| ffl ecommerce, ffl online store, ecommerce for ffl dealers | Agency SEO; FFLA Ads only |
| ffl website, ffl website design, ffl dealer website, ffl website builder | Split: agency keeps head terms, "builder" and "best"; FFLA takes "managed / done-for-you ffl website" on `/`. Ads on both |
| ffl dropshipping | Agency SEO; FFLA Ads only |
| register integrations (AIM, MicroBiz, Trident 1, Corestore) | Agency SEO; FFLA Ads only |
| ffl email marketing | Agency SEO; FFLA Ads only |
| woocommerce for ffl | Agency SEO; FFLA Ads only |
| ffl website hosting | Split: agency keeps "hosting" head terms and plans; FFLA takes maintenance / webmaster / support / "managed hosting" |
| ffl cockpit | Agency only; not an Ads keyword |
| ffl software cluster | FFLA SEO owner |
| generic ffl website migration / redesign | FFLA SEO owner; agency keeps competitor-named alternatives |
| home-based / small-business ffl software | Paul call; lean FFLA |
| gun-word terms | Agency SEO only; Ads held |
| competitor names | Agency only; never targeted here |
| brand "ffl accelerator" | FFLA. No change |

### Guardrails for every target and page

No gun, firearm or ammo words in visible copy (build gate). No ATF, compliance or 4473 automation claims. No price or tier in titles or OG tags. No competitor names in titles or H1s. No links to gun sellers. No Demand Intelligence or OEM pitch (rule 6). The offer is an ecommerce website service for FFL dealers.
