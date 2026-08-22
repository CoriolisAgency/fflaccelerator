// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { copyFile, writeFile } from "node:fs/promises";
import {
  astroRedirects,
  isSitemapExcluded,
  toCloudflareRedirects,
} from "./src/lib/redirects.ts";

/**
 * Custom domain (default): https://fflaccelerator.com  → base /
 * GitHub project path only: ASTRO_BASE=/fflaccelerator/ ASTRO_SITE=https://coriolisagency.github.io
 */
const base = process.env.ASTRO_BASE || "/";
const site = process.env.ASTRO_SITE || "https://fflaccelerator.com";

/** @param {string} url */
function prettySitemapUrl(url) {
  if (url.endsWith("/") || /\/[^/]+\.[a-zA-Z0-9]+$/.test(url)) return url;
  return `${url}/`;
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

/**
 * GSC still requests the old WordPress /sitemap_index.xml.
 * GitHub Pages has no rewrite engine, so copy the Astro-generated index.
 * Same file as /sitemap-index.xml — not a second sitemap.
 */
function emitWpSitemapIndexAlias() {
  return {
    name: "emit-wp-sitemap-index-alias",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        await copyFile(
          new URL("sitemap-index.xml", dir),
          new URL("sitemap_index.xml", dir),
        );
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
        return { ...item, url: prettySitemapUrl(item.url) };
      },
    }),
    emitWpSitemapIndexAlias(),
    emitRedirectsFile(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
