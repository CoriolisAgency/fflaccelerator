# DNS cutover — fflaccelerator.com

GitHub Pages is live. Public DNS still points at WordPress (`141.193.213.10`). This flip replaces the WP site.

## Records

**Apex `fflaccelerator.com` A**

- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

**`www` CNAME** → `CoriolisAgency.github.io`

## WP 301s

GitHub Pages cannot express the old WP map. After the apex is on Pages, put Cloudflare in front (orange-cloud) and load `docs/redirect-map.md` as Cloudflare Redirect Rules.

Keep the WP host on a holding hostname for 30 days, then kill.
