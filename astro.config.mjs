// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { copyFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  astroRedirects,
  isSitemapExcluded,
  toCloudflareRedirects,
} from "./src/lib/redirects.ts";

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

const repoRoot = fileURLToPath(new URL("./", import.meta.url));
const buildTime = new Date().toISOString();

/**
 * Map each static route ("/", "/about/", "/guides/x/") to its src/pages file.
 * Dynamic routes ([param]) are skipped and fall back to build time.
 */
function pageSourcesByRoute() {
  /** @type {Map<string, string>} */
  const map = new Map();
  /** @param {string} rel */
  const walk = (rel) => {
    const dir = new URL(`./src/pages/${rel}`, import.meta.url);
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      if (ent.isDirectory()) {
        walk(`${rel}${ent.name}/`);
        continue;
      }
      const m = ent.name.match(/^(.+)\.(astro|md|mdx|html)$/);
      if (!m || m[1].includes("[")) continue;
      const route = m[1] === "index" ? `/${rel}` : `/${rel}${m[1]}/`;
      map.set(route, `src/pages/${rel}${ent.name}`);
    }
  };
  walk("");
  return map;
}
const pageSources = pageSourcesByRoute();

/**
 * Sitemap <lastmod>: committer date of the last git commit that touched the
 * page's source file. Falls back to build time when git has no date for it.
 * @param {string} url
 */
function sitemapLastmod(url) {
  const b = base.endsWith("/") ? base : `${base}/`;
  let path = new URL(url).pathname;
  if (path.startsWith(b)) path = `/${path.slice(b.length)}`;
  if (!path.endsWith("/")) path = `${path}/`;
  const file = pageSources.get(path);
  if (!file) return buildTime;
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return out ? new Date(out).toISOString() : buildTime;
  } catch {
    return buildTime;
  }
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
        const url = prettySitemapUrl(item.url);
        return { ...item, url, lastmod: sitemapLastmod(url) };
      },
    }),
    emitWpSitemapIndexAlias(),
    emitRedirectsFile(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
