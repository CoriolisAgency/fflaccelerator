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
// Option 1 (Paul 7:38 PM ET): gtag/js loads from the standalone FFLA Google
// tag GT-TNSG4PSJ, only G-W5CPQ32S57 is configured, and nothing references
// the Ads ID (its tag is the Coriolis combined tag) or the Coriolis property.
if (!html.includes('src="https://www.googletagmanager.com/gtag/js?id=GT-TNSG4PSJ"')) {
  console.error("check-ga-lead: gtag/js must load from GT-TNSG4PSJ");
  process.exit(1);
}
if (html.includes("AW-11455995505")) {
  console.error("check-ga-lead: AW-11455995505 must not be configured on /lp/");
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
if (!lead[2] || lead[2].send_to !== "G-W5CPQ32S57") {
  console.error("check-ga-lead: generate_lead must send_to G-W5CPQ32S57");
  process.exit(1);
}
const configs = (ctx.dataLayer || []).filter((e) => e && e[0] === "config").map((e) => e[1]);
if (configs.length !== 1 || configs[0] !== "G-W5CPQ32S57") {
  console.error("check-ga-lead: only G-W5CPQ32S57 may be configured, got " + configs.join(","));
  process.exit(1);
}
console.log("check-ga-lead: generate_lead fires after json.ok on /lp/");
