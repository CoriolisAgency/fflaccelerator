// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

/**
 * Custom domain (default): https://fflaccelerator.com  → base /
 * GitHub project path only: ASTRO_BASE=/fflaccelerator/ ASTRO_SITE=https://coriolisagency.github.io
 */
const base = process.env.ASTRO_BASE || "/";
const site = process.env.ASTRO_SITE || "https://fflaccelerator.com";

// @ts-check
export default defineConfig({
  site,
  base,
  trailingSlash: "never",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
