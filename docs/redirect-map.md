# Redirect map

Coriolis is the ranking host for the moved commercial pillars.  
The campaign door stays on this host: **`/` and `/plan/`** — do not 301 those.

Source of truth: `src/lib/redirects.ts` (wired into Astro `redirects` and emitted as `dist/_redirects`).

Query strings follow when the host honors `_redirects` (Cloudflare Pages) or when the Bulk Redirects CSV is imported with `preserve_query_string=TRUE`.

## Keep (do not 301)

| Path |
|------|
| `/` |
| `/plan/` |
| `/about/` |
| `/gunsearchagent-included/` |
| `/guides/gun-store-software/` |
| `/trends/*` |

## Permanent 301 to www Coriolis (slash and slashless)

| From | To |
|------|----|
| `/ffl-ecommerce` `/ffl-ecommerce/` | `https://www.coriolisagency.com/ecommerce` |
| `/ffl-dropshipping` `/ffl-dropshipping/` | `https://www.coriolisagency.com/firearms-dropshipping` |
| `/switch` `/switch/` | `https://www.coriolisagency.com/ammoready-alternative` |
| `/retailbi-and-axis` `/retailbi-and-axis/` | `https://www.coriolisagency.com/demand-intelligence` |
| `/pricing` `/pricing/` | `https://www.coriolisagency.com/ecommerce` |
| `/contact` `/contact/` | `https://www.coriolisagency.com/contact` |

## Leftover WordPress → real URL (301)

| Old WordPress | New |
|---------------|-----|
| `/switch-n-save/` | `https://www.coriolisagency.com/ammoready-alternative` |
| `/how-to-start-a-gun-store-essential-tips-for-new-firearms-dealers/` | `https://www.coriolisagency.com/ecommerce` |
| `/firearm-and-accessory-sales-trends-in-q1-2025/` | `/trends/2025-q1/` |
| `/firearm-and-accessory-sales-trends-in-q2-2025/` | `/trends/2025-q2/` |
| `/best-software-for-managing-your-gun-store-and-ffl-records/` | `/guides/gun-store-software/` |
| `/category/4473/` | `/guides/gun-store-software/` |
| `/top-5-reasons-firearms-retailers-should-switch-to-electronic-4473-storage/` | `/guides/gun-store-software/` |
| `/step-by-step-guide-to-obtaining-your-federal-firearms-license-ffl/` | `/` |
| `/top-5-common-mistakes-to-avoid-when-applying-for-your-ffl/` | `/` |
| `/understanding-the-different-types-of-ffls/` | `/` |
| `/author/devopscoriolisagency-com/` | `/about/` |

301 the software-list and 4473 leftovers to the guide only after that page’s copy no longer names a POS vendor.

## 410 Gone (no invented page)

Leftover slugs that named a POS vendor. Do not 301 these (especially not to `/`). Do not leave an Astro HTML refresh that 200s and prints the slug:

`/get-your-ffl-sot-with-orchids-ffl-university/`, `/orchid/`, `/orchid-advisors/`, `/orchid-estate/`, `/ebound/`, `/orchids-ffl-university/`, `/orchid-ffl-university/`, `/category/orchid/`, `/tag/orchid/`.

Also 410 leftover posts with no real destination: `/what-to-expect-during-an-atf-inspection-of-your-firearms-business/`, `/ffl-renewal-process-what-you-need-to-know-to-stay-compliant/`, `/ffl-news/`.

WordPress / Woo platform leftovers with no real Coriolis or FFL destination:

`/wp-admin`, `/wp-login.php`, `/wp-content/*`, `/wp-includes/*`, `/wp-json/*`, `/xmlrpc.php`, `/feed`, `/comments/feed`, `/blog`, `/category`, `/category/*` (except `/category/4473`), `/tag/*`, `/sample-page`, `/cart`, `/shop`, `/my-account`, `/checkout`.

GitHub Pages cannot emit HTTP 410. Those rules live in `dist/_redirects` (Cloudflare Pages) and in `src/lib/redirects.ts`. On the current GitHub Pages origin they 404 until a Cloudflare rule or Pages `_redirects` applies the 410.

## Cloudflare Bulk Redirects

Import [cloudflare-bulk-redirects.csv](cloudflare-bulk-redirects.csv) (301s plus vendor-slug 410s; query string preserved). Platform 410s (`/wp-admin`, `/cart`, …) still need `_redirects` or a Cloudflare custom rule.

Do not 301 `/` or `/plan/`. Do not unblock GPTBot or Google-Extended (Cloudflare managed robots already disallow them).

`www.fflaccelerator.com/*` already 301s to apex `https://fflaccelerator.com/`.
