# DNS

The live site is still GitHub Pages until the Vercel certificate is valid. Follow [vercel-cutover.md](vercel-cutover.md). Do not remove Pages A records before that document's post-cert step.

## After the certificate is valid

Apex `fflaccelerator.com` points at Vercel, DNS-only. www redirects to the apex in the Vercel domain settings (not a `vercel.json` rule).

Remove GitHub Pages A records only in that post-cert step:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Redirects: `src/lib/redirects.ts`, emitted to `dist/_redirects` and mirrored in `vercel.json`. Bulk Redirect import: [cloudflare-bulk-redirects.csv](cloudflare-bulk-redirects.csv). Every target stays on this host.

Do not 301 `/` or `/plan/`.
