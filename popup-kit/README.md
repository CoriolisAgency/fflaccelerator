# popup-kit v1

Framework-free email capture module. Copy these files byte-identical into each site repo. Do not publish an npm package. The checksum test is the contract.

## Files

- `VERSION` : kit version (`1`)
- `client/coriolis-popup.js` : browser module (ES2019, no imports)
- `client/coriolis-popup.css` : styles, every selector prefixed `.cpop`
- `server/subscribe-core.ts` : `popupStatus`, `handlePopupSubscribe`, `buildMailchimpPayload`
- `SHA256SUMS` : sha256 of VERSION, the two client files, subscribe-core.ts, and this README

Serve the client files as static copies at `/popup/coriolis-popup.v1.js` and `/popup/coriolis-popup.v1.css`. A test must assert those served bytes match `client/`.

## Mount

Render this before the script, only on pages that should offer the pop-up:

```html
<script>window.CORIOLIS_POPUP={"site":"agency","lane":"agency-web","endpoint":"/api/popup","privacyUrl":"/privacy","copy":{},"fields":[],"denyPaths":[]}</script>
<script src="/popup/coriolis-popup.v1.js" defer></script>
```

Config fields:

- `site` : agency | gse | ffla | fflm
- `lane` : agency-web | gse-consumer | ffla-managed | fflm-early-access
- `endpoint` : same-origin GET/POST path (example `/api/popup`)
- `privacyUrl` : href for the Privacy policy words in `copy.consent`
- `copy` : `eyebrow`, `headline`, `body`, `button`, `consent`, `success.headline`, `success.body`
- `fields` : optional `[{name, label, type}]` (agency and ffla use `company`)
- `ctas` : optional `[{label, href, kind}]` (ffla)
- `denyPaths` : extra path prefixes. Always denied: `/privacy`, `/terms`, `/unsubscribe`, `/confirmed`, `/api`

The script waits for idle (or 2s), then arms triggers. Nothing is painted and CSS is not fetched until a trigger fires. A GET to `endpoint` must return `{ok:true, enabled:true}` or the dialog stays closed and no cap is written.

Preview: `?popup=1` forces open, ignores caps, does not write the seen cap.

## Env names (server)

Read by name only. Never log values.

- `MAILCHIMP_API_KEY` (ends with `-usNN`; data center is derived from the suffix)
- `MAILCHIMP_AUDIENCE_ID`
- `MAILCHIMP_DOUBLE_OPT_IN` optional, default `1` (pending / Mailchimp confirm). `0` means subscribed.

Legacy fallback, agency and ffla only, and only when the Mailchimp pair is unset:

- `CORIOLIS_OS_URL`
- `FORM_INTAKE_SECRET`

`popupStatus` returns `{enabled, backend}` where backend is mailchimp, legacy, or none. It never echoes env values. Backend none fails closed (`enabled: false`; POST 503).

Until Mailchimp vars are set, agency uses the legacy Ops path that works today.

## Events

On view, successful submit, close, and CTA click:

- `window.dataLayer.push({event, popup_site, popup_lane, popup_trigger})` when `dataLayer` exists
- `window.gtag("event", name, {...})` when `gtag` exists
- always `window.dispatchEvent(new CustomEvent("coriolis:popup", {detail:{name, site, lane, trigger}}))`

Event names: `popup_view`, `popup_submit`, `popup_close`, `popup_cta`. Never send the email address to analytics.

## Checksum rule

`SHA256SUMS` is the source of truth. Each consuming repo copies this folder as-is and asserts:

1. Hashes in `SHA256SUMS` match the files in this folder.
2. The served `/popup/coriolis-popup.v1.js` and `.css` copies are byte-identical to `client/`.

Do not edit a copy in one repo only. Change the canonical kit, update `SHA256SUMS`, then copy the folder.
