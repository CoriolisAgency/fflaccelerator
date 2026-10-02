# FFL Accelerator

Managed ecommerce website for a store. The offer, the contact form, and privacy stay on this host.

## Stack

- [Astro](https://astro.build) 7 (static) + Tailwind CSS v4
- Host today: GitHub Pages (`public/CNAME`, `.github/workflows/deploy.yml`)
- Host next: Vercel, so `/api/lead` and `/api/subscribe` can run on this origin
- Custom domain: `fflaccelerator.com`

Do not delete the Pages workflow or `public/CNAME` until the Vercel certificate is valid. See [docs/vercel-cutover.md](docs/vercel-cutover.md). Until then, Pages deploys only when someone runs the workflow by hand, so a merge does not replace the live site with a build whose API routes 404.

## Local

```bash
npm install
npm run dev
npm run build
```

Node `>=22.12.0`.

`@coriolis/lead-form` is a private git dependency (`git+https://github.com/CoriolisAgency/lead-form.git#v0.1.1`). There is no `.npmrc`. Local `npm install` needs read access to that repo. On Vercel and in GitHub Actions, `LEAD_FORM_READ_TOKEN` rewrites `https://github.com/` and `ssh://git@github.com/` before install. The token is a fine-grained PAT with Contents: Read on `CoriolisAgency/lead-form` only.

If the Actions secret is missing, CI fails with a clear message. It does not skip the install.

## Contact form

`/contact/` renders `<LeadForm site="fflaccelerator" defaultPillar="Ecommerce" />`. The browser posts to `/api/lead`. `api/lead.ts` re-exports the package handler. The handler forwards to Ops in the same request. Ops failure returns 502 and the visitor sees the retry message. A success is the only "Sent" path.

The email popup posts to `/api/subscribe` (source `popup_fflaccelerator`). Confirm still lands on `/confirmed/`.

Env on Vercel (never commit values):

```
LEAD_FORM_SITE=fflaccelerator
CORIOLIS_OS_URL=
FORM_INTAKE_SECRET=
LEAD_FORM_READ_TOKEN=
PUBLIC_GA4_ID=
```

Optional: `LEAD_FORM_HOST=fflaccelerator.com`.

Optional Mailgun, sent only after Ops accepts a lead: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `CONTACT_TO`, `CONTACT_FROM`, `CONTACT_SUBJECT_PREFIX`.

`PUBLIC_GA4_ID` is a new web stream for this host. gtag is omitted when it is unset. On a successful contact post the page fires `generate_lead` once. A successful popup fires `sign_up` when gtag is loaded.

Recommend a Vercel Firewall rate limit on `POST /api/lead` and `POST /api/subscribe` (for example 10 per minute per IP). No Turnstile.

## Scripts

- `npm run build` checks redirect sync, builds, then checks plan copy, social titles, and banned links.
- `npm run check:links` runs the banned-link gate (needs `dist/`).
- `npm run gen:vercel` rewrites `vercel.json`, `public/_redirects`, and `docs/cloudflare-bulk-redirects.csv`.
- `npm run test:handlers` posts to a local mock Ops on 127.0.0.1. It does not call production.

## Docs

- [Vercel cutover](docs/vercel-cutover.md)
- [Redirect map](docs/redirect-map.md)
- [DNS](docs/dns-cutover.md)
- [SEO lattice](docs/seo-lattice.md)

## Rules

- Plan and header calls to action go to `/contact/` on this site.
- No price and no tier name in `<title>`, `og:title`, `og:description`, `twitter:title`, or `twitter:description`. Prices stay in the page body.
- `/plan/` section ids: `#store-hosting`, `#inventory-dropshipping`, `#marketplaces`, `#support`, `#pos`, `#performance-monitoring`, `#email-marketing`, `#analytics`, `#sla`.
- Marketplace names stay in one component and are not rendered. The pages show "Integrations with 13 online marketplaces".
- Do not print an email address. Phone is 828-290-9005.
- Never H1 "RetailBI alternative." Never 4473 automation.
