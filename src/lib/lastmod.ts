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
  // SEO-U23 part 3 commit (homepage guide link, guide/about/contact copy,
  // plans.ts WPE uptime SLA line). / and /plan/ via plans.ts + IncludedIndex.
  // SEO-U6 commit (home H1, Hero proof bar on / and /plan/, FAQ_HOME question).
  "/": "2026-10-22T09:32:29-04:00",
  "/plan/": "2026-10-22T09:32:29-04:00",
  "/about/": "2026-10-22T09:03:50-04:00",
  "/contact/": "2026-10-22T09:03:50-04:00",
  "/guides/gun-store-software/": "2026-10-22T09:03:50-04:00",
};
