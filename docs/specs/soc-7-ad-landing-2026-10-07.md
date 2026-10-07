# SOC-7 — clean ad landing page

Date: 2026-10-07. Repo: `CoriolisAgency/fflaccelerator`.

## Today

Ship 2 is live on `fflaccelerator.com`. Home and `/plan/` are in the nav and sitemap. `/contact/` is a separate page. Meta ads still have no dedicated landing that is out of the nav and sitemap.

Campaign pack `CAMPAIGN1_ECOMMERCE.md` (claims C1–C11) is not on this PC. This page uses Ship 2 locked copy only: `PLAN` + the nine `GROUPS` + “The site is yours.” That is eleven blocks. No Minute Man / Militia / Warlord ladder. No GSE links. No firearm imagery.

## Proposed

One page: `https://fflaccelerator.com/lp/`

- `noindex, nofollow`. Omitted from the sitemap.
- No header nav. Footer is identity + Privacy.
- Form on the page (`LeadForm site="fflaccelerator"`), same as `/contact/`.
- Price in the body (`$569/mo`, setup $500 / $2,500). Not in `<title>` or OG.
- No email popup.

## Slice

One PR. Acceptance:

1. `/lp/` 200. Title has no `$569`. H1 is FFL Accelerator.
2. View-source: `noindex`. Sitemap does not list `/lp/`.
3. No Plan / About / Start links in the header.
4. Form posts to `/api/lead`.
5. No `href` to coriolisagency.com, gunsearchengine.com, or gunsearchagent.com.
6. Ad-copy gate still passes (no gun / firearm / ammo in visible copy).

## Touches

`src/pages/lp/index.astro`, `src/components/SiteChrome.astro`, `src/layouts/BaseLayout.astro`, `src/lib/links.ts`, `src/lib/redirects.ts`, `src/components/AccelEmailCapture.astro`, `docs/redirect-map.md`. DB no. Env none.

## Out of scope

SOC-5 pixels, SOC-8 ads, GitHub Pages teardown, www→apex redirect, new claim copy.

## Open questions

1. Point Meta ads at `/lp/` or the apex? This PR ships `/lp/`.
2. If `CAMPAIGN1_ECOMMERCE.md` C1–C11 differ from the plan groups, swap copy in a follow-up.
