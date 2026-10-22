/**
 * Sitemap <lastmod> for every URL in sitemap-0.xml (SEO-U23).
 *
 * UPDATE THIS MAP IN ANY PR THAT CHANGES WHAT A PAGE RENDERS: the page file
 * or anything it imports (layout, components, src/lib/site.ts, plans.ts, ...).
 * Use that change's commit time (ET offset). The build fails if a sitemap URL
 * has no entry here.
 *
 * A committed map, not a build-time `git log`: Vercel builds run on a shallow
 * clone, so git dates at build time collapse to the newest commit.
 *
 * Values: latest commit on main touching the page file or its import tree.
 * /privacy/ is noindex, follow and out of the sitemap, so it has no entry.
 */
export const LASTMOD: Readonly<Record<string, string>> = {
  // 60313fd "drop Corestore from plans" (#37), via src/lib/plans.ts
  "/": "2026-10-21T22:13:06-04:00",
  "/plan/": "2026-10-21T22:13:06-04:00",
  // 0a72a84 SEO-U28 address removal, via src/lib/site.ts (contact: page file)
  "/about/": "2026-10-21T15:40:54-04:00",
  "/contact/": "2026-10-21T15:40:54-04:00",
  "/guides/gun-store-software/": "2026-10-21T15:40:54-04:00",
};