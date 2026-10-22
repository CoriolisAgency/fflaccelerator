// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { writeFile } from "node:fs/promises";
import {
  astroRedirects,
  isSitemapExcluded,
  toCloudflareRedirects,
} from "./src/lib/redirects.ts";
import { LASTMOD } from "./src/lib/lastmod.ts";

/**
 * Custom domain (default): https://fflaccelerator.com  → base /
 * GitHub project path only: set ASTRO_BASE and ASTRO_SITE for that host.
 */
const base = process.env.ASTRO_BASE || "/";
const site = process.env.ASTRO_SITE || "https://fflaccelerator.com";

/** @param {string} url */
function prettySitemapUrl(url) {
  if (url.endsWith("/") || /\/[^/]+\.[a-zA-Z0-9]+$/.test(url)) return url;
  return `${url}/`;
}

/**
 * Sitemap <lastmod> from the committed map in src/lib/lastmod.ts.
 * Fails the build when a sitemap URL has no entry, so a new page can't ship
 * without one.
 * @param {string} url
 */
function sitemapLastmod(url) {
  const b = base.endsWith("/") ? base : `${base}/`;
  let path = new URL(url).pathname;
  if (path.startsWith(b)) path = `/${path.slice(b.length)}`;
  if (!path.endsWith("/")) path = `${path}/`;
  const lastmod = LASTMOD[path];
  if (!lastmod) {
    throw new Error(`No sitemap lastmod for ${path}. Add it to src/lib/lastmod.ts`);
  }
  return new Date(lastmod).toISOString();
}

/** Emit `_redirects` so Cloudflare Pages / Netlify can apply 301 + 410. */
function emitRedirectsFile() {
  return {
    name: "emit-ffl-redirects-file",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        await writeFile(new URL("_redirects", dir), toCloudflareRedirects());
      },
    },
  };
}

// @ts-check
export default defineConfig({
  site,
  base,
  trailingSlash: "always",
  redirects: astroRedirects(),
  integrations: [
    sitemap({
      filter: (page) => !isSitemapExcluded(page),
      serialize(item) {
        const url = prettySitemapUrl(item.url);
        return { ...item, url, lastmod: sitemapLastmod(url) };
      },
    }),
    emitRedirectsFile(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
