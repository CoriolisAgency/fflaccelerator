# Redirect map (Cloudflare)

WordPress → this Astro site. Implement as **301** at Cloudflare (or origin) before DNS cutover. Trailing-slash variants should also 301 to the no-slash URL (`trailingSlash: never`).

| Old WordPress | New |
|---------------|-----|
| `/switch-n-save/` | `/switch` |
| `/firearm-and-accessory-sales-trends-in-q1-2025/` | `/trends/2025-q1` |
| `/firearm-and-accessory-sales-trends-in-q2-2025/` | `/trends/2025-q2` |
| `/best-software-for-managing-your-gun-store-and-ffl-records/` | `/guides/gun-store-software` |
| `/category/4473/` | `/guides/gun-store-software` |
| `/get-your-ffl-sot-with-orchids-ffl-university/` | `/` |
| `/author/devopscoriolisagency-com/` | `/about` |

## Suggested extra 301s (same intent, not in the required set)

| Old | New | Why |
|-----|-----|-----|
| `/` (WP home) | `/` | Same path; no rule needed |
| `/top-5-reasons-firearms-retailers-should-switch-to-electronic-4473-storage/` | `/guides/gun-store-software` | We do not rank 4473 automation |
| `/step-by-step-guide-to-obtaining-your-federal-firearms-license-ffl/` | `/` | Out of scope |
| `/top-5-common-mistakes-to-avoid-when-applying-for-your-ffl/` | `/` | Out of scope |
| `/understanding-the-different-types-of-ffls/` | `/` | Out of scope |
| `/how-to-start-a-gun-store-essential-tips-for-new-firearms-dealers/` | `/ffl-ecommerce` | Adjacent |
| `/category/*` leftover WP taxonomies | `/` or nearest pillar | After GSC export |

## Cloudflare Bulk Redirects (sketch)

```
fflaccelerator.com/switch-n-save/                          → https://fflaccelerator.com/switch
fflaccelerator.com/firearm-and-accessory-sales-trends-in-q1-2025/ → https://fflaccelerator.com/trends/2025-q1
fflaccelerator.com/firearm-and-accessory-sales-trends-in-q2-2025/ → https://fflaccelerator.com/trends/2025-q2
fflaccelerator.com/best-software-for-managing-your-gun-store-and-ffl-records/ → https://fflaccelerator.com/guides/gun-store-software
fflaccelerator.com/category/4473/                          → https://fflaccelerator.com/guides/gun-store-software
fflaccelerator.com/get-your-ffl-sot-with-orchids-ffl-university/ → https://fflaccelerator.com/
fflaccelerator.com/author/devopscoriolisagency-com/        → https://fflaccelerator.com/about
```

Also 301 `www.fflaccelerator.com/*` → apex `https://fflaccelerator.com/$1` (or the reverse — pick one canonical host). This repo’s `public/CNAME` is **fflaccelerator.com** (apex).

Expand from Search Console after cutover.
