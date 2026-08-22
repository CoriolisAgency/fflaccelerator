# FFL Accelerator

Retailer firebase for **Coriolis’s FFL Accelerator** plan ($569/mo, GunSearchAgent Pro included).  
Conversion: [coriolisagency.com/plans](https://coriolisagency.com/plans).

This domain replaces the WordPress site. It is a Coriolis, LLC program — not a separate company.

Email popup posts CORS to Coriolis OS `POST /api/forms/subscribe` (source `popup_fflaccelerator`). Lead mints only after the confirm link. Localhost posts to `http://localhost:3000` (override with `PUBLIC_CORIOLIS_OS_URL`).

## Stack

- [Astro](https://astro.build) 7 (static) + Tailwind CSS v4
- Host: **GitHub Pages**
- Custom domain: `fflaccelerator.com` (`public/CNAME`)

## Local

```bash
npm install
npm run dev
npm run build
```

Node `>=22.12.0`.

## Deploy (GitHub Pages)

1. Create GitHub repo (e.g. `CoriolisAgency/fflaccelerator`), push `main`
2. Settings → Pages → Source: **GitHub Actions**
3. Confirm `.github/workflows/deploy.yml` sets `ASTRO_SITE=https://fflaccelerator.com`
4. After the first green deploy, GitHub will serve from Pages

## DNS / Cloudflare cutover

Do this **after** Pages is serving the custom domain (certificate issued).

1. **Cloudflare** zone `fflaccelerator.com`
   - Apex: either GitHub Pages A records, or CNAME-flatten to `<org>.github.io`
   - `www` CNAME → `<org>.github.io` (or 301 www → apex)
   - Proxy (orange cloud) is fine; set SSL/TLS to **Full (strict)** once GitHub has the cert
2. **GitHub repo** → Settings → Pages → Custom domain `fflaccelerator.com` (matches `public/CNAME`)
3. **301 map** — add Cloudflare Bulk Redirects from [docs/redirect-map.md](docs/redirect-map.md) *before* or at cutover so WP permalinks do not 404
4. Turn off or park the WordPress origin so it cannot answer the hostname
5. Search Console: add/verify the new property if needed; submit `https://fflaccelerator.com/sitemap-index.xml`

GitHub Pages A records (confirm current list at GitHub docs):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

AAAA (IPv6) also published by GitHub if you use them.

## Redirects

Astro `redirects` in `src/lib/redirects.ts` (slash and slashless). Build also emits `dist/_redirects` (301 + 410). Cloudflare Bulk Redirects CSV: [docs/cloudflare-bulk-redirects.csv](docs/cloudflare-bulk-redirects.csv).

Do not 301 `/` or `/plan/`. Coriolis is the ranking host for the moved pillars.

## Docs

- [SEO lattice](docs/seo-lattice.md)
- [Redirect map](docs/redirect-map.md)
- Frozen strings: `src/lib/frozen.ts` (from GSE entity-kit)

## Rules

- Plan CTAs → Coriolis. Do not clone checkout.
- Never H1 “RetailBI alternative.” Never “switch off RetailBI.” Never 4473 automation.
- Pricing: Accelerator **$569/mo**. Not the old WP $269.
