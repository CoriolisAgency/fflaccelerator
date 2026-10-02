import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const LINES = [
  "Add Jet Fuel",
  "FFL Accelerator",
  "Webmaster Included",
  "$569/mo",
  "A single, all-in-one, managed ecommerce plan. It includes hosting, site design (Basic or Retail), VIP support, POS integration (any POS), email automation, and analytics (Google Analytics, Google Search Console, on-site search, and email/SMS).",
  "Everything in Minute Man, Militia, and Warlord, plus the FFL Accelerator features.",
  "Custom website design",
  "Your custom domain",
  "Unlimited hosting",
  "Unlimited storage",
  "Unlimited bandwidth",
  "Unlimited products",
  "Unlimited orders",
  "DNS & Email Administration",
  "SMTP Mail Server",
  "Advanced Search & Filter",
  "FFL Cockpit license",
  "FFL Checkout license",
  "21 distributor catalogs",
  "20-minute inventory updates",
  "Automated dropshipping",
  "Integrations with 13 online marketplaces",
  "VIP Support for:",
  "WordPress",
  "WooCommerce",
  "Custom Theme",
  "All Other Plugins",
  "Free Email & Chat Support — One Hour Response Time",
  "Concierge Onboarding",
  "API Based POS Integration:",
  "AIM Point of Sale",
  "MicroBiz POS",
  "Trident 1 POS",
  "Corestore POS",
  "and other registers",
  "Unlimited API Requests",
  "Unlimited Webhooks",
  "24×7 uptime monitoring",
  "Page speed optimization (EverCache)",
  "Shopping cart optimization (LiveCart)",
  "Advanced site monitoring (Uptime Robot)",
  "Cloudflare Web Rules (bot mitigation)",
  "On-site email capture optimization",
  "Automated email campaigns:",
  "Welcome",
  "Back In Stock",
  "Browse Abandonment",
  "Thank You for Purchase",
  "Abandoned Cart",
  "Google Analytics Admin",
  "On-site search",
  "SLA with 99.95% uptime guarantee",
];

const SECTION_IDS = [
  "store-hosting",
  "inventory-dropshipping",
  "marketplaces",
  "support",
  "pos",
  "performance-monitoring",
  "email-marketing",
  "analytics",
  "sla",
];

const FORBIDDEN = [
  "On-demand paid support ($125 per incident)",
  "Free email support (24-hour response)",
  "GunSearchAgent.com Pro",
  "GunSearchAgent",
  "GunSearchEngine",
  "Rapid Gun Systems",
  "Gun Runner",
  "Can I sell guns",
  "serialized firearm",
  "Unlimited hosting on WP Engine",
  "VIP support Monday through Friday",
  "On-site technical SEO",
  "Cloudflare DNS & CDN",
];

function decode(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

function load(rel) {
  return decode(readFileSync(resolve(root, rel), "utf8"));
}

const pages = ["dist/index.html", "dist/plan/index.html"];
const errors = [];

for (const rel of pages) {
  let html;
  try {
    html = load(rel);
  } catch {
    errors.push(`missing ${rel}`);
    continue;
  }
  for (const line of LINES) {
    if (!html.includes(line)) errors.push(`${rel} missing: ${line}`);
  }
  for (const line of FORBIDDEN) {
    if (html.includes(line)) errors.push(`${rel} still has dropped line: ${line}`);
  }
}

let plan = "";
try {
  plan = load("dist/plan/index.html");
} catch {
  plan = "";
}

for (const id of SECTION_IDS) {
  if (!plan.includes(`id="${id}"`)) {
    errors.push(`dist/plan/index.html missing section id="${id}"`);
  }
}

const inventory = plan.split('id="inventory-dropshipping"')[1]?.split("<section")[0] ?? "";
if (!inventory.includes("21 distributor catalogs")) {
  errors.push("inventory section missing 21 distributor catalogs");
}
if (/<ul[\s\S]*21 distributor catalogs[\s\S]*<ul/i.test(inventory)) {
  errors.push("21 distributor catalogs has a nested sub-list");
}

const doorPages = ["dist/index.html", "dist/plan/index.html"];
for (const rel of doorPages) {
  const raw = readFileSync(resolve(root, rel), "utf8");
  if (/href="[^"]*\/guides\//.test(raw) || /href="[^"]*\/trends\//.test(raw)) {
    errors.push(`${rel} links to /guides/ or /trends/`);
  }
}

const footer = "Coriolis, LLC · 109 Brennan Place, Greenville, SC 29609 · 828-290-9005";
const trademark =
  "Google Analytics and Google Search Console are trademarks of Google LLC.";
for (const rel of [
  "dist/index.html",
  "dist/plan/index.html",
  "dist/contact/index.html",
  "dist/about/index.html",
  "dist/privacy/index.html",
]) {
  const text = load(rel).replace(/<[^>]+>/g, "");
  if (!text.includes(footer)) errors.push(`${rel} missing exact footer identity`);
  if (!text.includes(trademark)) errors.push(`${rel} missing trademark line`);
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i.test(text)) {
    errors.push(`${rel} prints an email address`);
  }
}

const planRaw = readFileSync(resolve(root, "dist/plan/index.html"), "utf8");
const talk = planRaw.match(/Talk to us/g) || [];
if (talk.length < 9) {
  errors.push(`dist/plan/index.html has ${talk.length} "Talk to us" buttons, expected 9`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `plan copy check passed (${LINES.length} lines on / and /plan/, ${SECTION_IDS.length} section ids)`,
);
