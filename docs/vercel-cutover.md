# Vercel cutover for fflaccelerator.com

GitHub Pages stays up until the Vercel certificate is valid for the apex. Do not delete `.github/workflows/deploy.yml` or `public/CNAME` before that.

This build's contact form and email popup post to `/api/lead` and `/api/subscribe`. GitHub Pages cannot run those functions. `.github/workflows/deploy.yml` is `workflow_dispatch` only so a merge does not replace the live Pages site with a build whose API routes 404. The current Pages deployment stays as it is until you run that workflow by hand, or until you finish the step below.

## Before DNS

1. Import `CoriolisAgency/fflaccelerator` into Vercel (Production branch `main` after this pull request merges, or the preview branch before that).
2. Set project env (Production and Preview). Do not commit the values.
   - `FORM_INTAKE_SECRET`
   - `CORIOLIS_OS_URL` (Ops host, server-only)
   - `LEAD_FORM_SITE=fflaccelerator`
   - `LEAD_FORM_READ_TOKEN` (fine-grained PAT, Contents: Read on `CoriolisAgency/lead-form` only). Sensitive. Install only.
   - `PUBLIC_GA4_ID` (a new GA4 web stream for this host, not another site's id)
   - Optional: `LEAD_FORM_HOST=fflaccelerator.com` so preview deploys still tag `site=fflaccelerator.com`
   - Optional Mailgun, used only after Ops accepts a lead: `MAILGUN_API_KEY`, `MAILGUN_DOMAIN`, `CONTACT_TO`, `CONTACT_FROM`, `CONTACT_SUBJECT_PREFIX`
3. Add the same `LEAD_FORM_READ_TOKEN` as a GitHub Actions secret so pull request CI can `npm ci`.
4. Confirm the Vercel build is green. On a preview, the contact form posts to that preview's `/api/lead`.

`vercel.json` `installCommand` rewrites git HTTPS and `ssh://git@github.com/` through the token when it is set, then runs `npm install`. Length is under 256 characters.

Gone WordPress paths rewrite to `/api/gone`, which returns HTTP 410. www to apex is not a rule in `vercel.json`.

## DNS

- Apex `fflaccelerator.com`: point at Vercel, DNS-only (grey cloud). Use the A record Vercel shows for the project.
- www: redirect to the apex in the Vercel domain settings.

## Cloudflare Bulk Redirects

Remove or repoint any live rule whose target is off this host. The replacement map is [cloudflare-bulk-redirects.csv](cloudflare-bulk-redirects.csv). Every 301 target is on `fflaccelerator.com`.

## Firewall

Add a Vercel Firewall rate-limit rule on `POST /api/lead` and `POST /api/subscribe`, for example 10 requests per minute per IP. The form also has its own honeypot, fill-time check, and in-process limit. There is no Turnstile.

## AFTER Vercel cert is valid for fflaccelerator.com: disable/delete .github/workflows/deploy.yml and public/CNAME, remove GitHub Pages A records, disable Pages in repo settings

Do this only after `https://fflaccelerator.com` answers from Vercel and the certificate is valid.

1. Disable or delete `.github/workflows/deploy.yml`.
2. Delete `public/CNAME`.
3. Remove the GitHub Pages A records (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) and any Pages AAAA records.
4. Disable Pages in the GitHub repo settings.
5. Confirm www redirects to the apex in the Vercel domain settings.
