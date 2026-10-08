# Redirect map

Every destination stays on this host. Do not 301 `/` or `/plan/`.

Source of truth: `src/lib/redirects.ts`. The build checks that `vercel.json`, `public/_redirects`, and `docs/cloudflare-bulk-redirects.csv` match it.

`/contact/` is a real page. It is not a redirect.

www to apex is Vercel domain config, not a row in this map.

## Keep

| Path |
|------|
| `/` |
| `/plan/` |
| `/about/` |
| `/contact/` |
| `/privacy/` |
| `/guides/gun-store-software/` |
| `/confirmed/` |
| `/lp/` (SOC-7 ad landing; `noindex`, omitted from the sitemap) |

## Permanent 301 (slash and slashless)

| From | To |
|------|----|
| `/gunsearchagent-included` | `/` |
| `/ffl-ecommerce` | `/plan/` |
| `/pricing` | `/` (OPS-2, decision 2026-10-07-seo-ownership: old $299 SEO product page; was `/plan/`) |
| `/ffl-dropshipping` | `/plan/#inventory-dropshipping` |
| `/switch`, `/switch-n-save`, `/retailbi-and-axis` | `/` |
| `/how-to-start-a-gun-store-essential-tips-for-new-firearms-dealers` | `/guides/gun-store-software/` |
| `/best-software-for-managing-your-gun-store-and-ffl-records` | `/guides/gun-store-software/` |
| `/category/4473` | `/guides/gun-store-software/` |
| `/top-5-reasons-firearms-retailers-should-switch-to-electronic-4473-storage` | `/guides/gun-store-software/` |
| `/step-by-step-guide-to-obtaining-your-federal-firearms-license-ffl` | `/` |
| `/top-5-common-mistakes-to-avoid-when-applying-for-your-ffl` | `/` |
| `/understanding-the-different-types-of-ffls` | `/` |
| `/author/devopscoriolisagency-com` | `/about/` |

## 410 Gone

Leftover vendor slugs and WordPress or Woo paths with no replacement page. On Vercel they rewrite to `/api/gone` (HTTP 410). GitHub Pages cannot emit 410. Those paths 404 there until cutover.

`/wp-admin`, `/wp-login.php`, `/wp-content/*`, `/wp-includes/*`, `/wp-json/*`, `/xmlrpc.php`, `/feed`, `/comments/feed`, `/blog`, `/category`, `/category/*` (except `/category/4473`, which is a 301), `/tag/*`, `/sample-page`, `/cart`, `/shop`, `/my-account`, `/checkout`.

Retired in SEO S3 (Paul 2026-10-07), slash and slashless, 410 and not 301: `/firearm-and-accessory-sales-trends-in-q1-2025`, `/firearm-and-accessory-sales-trends-in-q2-2025` (were 301s to the trend notes), `/trends`, `/trends/*` (including `/trends/2025-q1/` and `/trends/2025-q2/`), and `/category/shot-show/` ("the SHOT note"; no SHOT page). Prefix rules also have a slashed Vercel source (`/x/:path*/`): with `trailingSlash: true` a request lands on the slashed form, which the slashless pattern does not match.

Vendor slugs: `/get-your-ffl-sot-with-orchids-ffl-university/`, `/orchid/`, `/orchid-advisors/`, `/orchid-estate/`, `/ebound/`, `/orchids-ffl-university/`, `/orchid-ffl-university/`, `/category/orchid/`, `/tag/orchid/`, `/what-to-expect-during-an-atf-inspection-of-your-firearms-business/`, `/ffl-renewal-process-what-you-need-to-know-to-stay-compliant/`, `/ffl-news/`.

## Plan anchors

`/plan/` section ids, one per feature group: `#store-hosting`, `#inventory-dropshipping`, `#marketplaces`, `#support`, `#pos`, `#performance-monitoring`, `#email-marketing`, `#analytics`, `#sla`.

Setup is `#setup`. Switching an existing site is `#switch-existing-site`. Those two are not feature-group ids.
