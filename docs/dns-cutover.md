# DNS cutover — fflaccelerator.com

GitHub Pages is live. Public DNS still points at WordPress (`141.193.213.10`). This flip replaces the WP site.

## Records

**Apex `fflaccelerator.com` A**

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**`www` CNAME** → `CoriolisAgency.github.io`

## Redirects

The origin map lives in `src/lib/redirects.ts` (Astro `redirects` + `dist/_redirects`). Import [cloudflare-bulk-redirects.csv](cloudflare-bulk-redirects.csv) for true 301s at the Cloudflare edge (query string preserved). 410s for leftover WP junk need `_redirects` or a Cloudflare custom rule — Bulk Redirects cannot express 410.

Do not 301 `/` or `/plan/`.
