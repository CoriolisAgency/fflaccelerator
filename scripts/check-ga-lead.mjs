// FFLA-LEAD-TRACKING (Paul 2026-11-03 4:26 PM ET): run the built /lp/ inline
// scripts and confirm a json.ok response from /api/lead puts generate_lead
// on the dataLayer. Fails the build if the hook cannot reach window.gtag.
import { readFileSync } from "node:fs";
import vm from "node:vm";

const html = readFileSync(new URL("../dist/lp/index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .filter((m) => !/\ssrc=/.test(m[1] || "") && /dataLayer|generate_lead/.test(m[2]))
  .map((m) => m[2]);
if (scripts.length < 2) {
  console.error("check-ga-lead: gtag bootstrap or lead hook missing from dist/lp/index.html");
  process.exit(1);
}
// G-W5CPQ32S57 has no standalone Google tag (gtag/js 404s), so the library
// loads from the Ads tag and configs both IDs. Never the Coriolis property.
if (!html.includes('src="https://www.googletagmanager.com/gtag/js?id=AW-11455995505"')) {
  console.error("check-ga-lead: gtag/js must load from AW-11455995505");
  process.exit(1);
}
if (html.includes("G-E7F2ZRVKTW")) {
  console.error("check-ga-lead: G-E7F2ZRVKTW must not appear on /lp/");
  process.exit(1);
}
const ctx = {
  document: { readyState: "complete", querySelectorAll: () => [] },
  fetch: async () => ({ clone: () => ({ json: async () => ({ ok: true }) }) }),
};
ctx.window = ctx;
vm.createContext(ctx);
for (const s of scripts) vm.runInContext(s, ctx);
if (typeof ctx.window.gtag !== "function") {
  console.error("check-ga-lead: window.gtag is not defined after the bootstrap");
  process.exit(1);
}
await ctx.window.fetch("/api/lead", { method: "POST" });
await new Promise((r) => setTimeout(r, 20));
const lead = (ctx.dataLayer || []).find((e) => e && e[0] === "event" && e[1] === "generate_lead");
if (!lead) {
  console.error("check-ga-lead: generate_lead not pushed after json.ok");
  process.exit(1);
}
console.log("check-ga-lead: generate_lead fires after json.ok on /lp/");
