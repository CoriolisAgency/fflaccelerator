import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const APEX = ["coriolisagency", "gunsearchengine", "gunsearchagent"].map(
  (host) => `${host}.com`,
);
const CLIENT_HOSTS = [
  "store.therangeinmckinney.com",
  "robinsonarmament.com",
  "downrangechico.com",
  "reynoldsranchandfarm.com",
  "freedomfirstammo.com",
  "crownridgebarrelworks.com",
  "smokinggunstore.com",
  "frontlinefirearmsco.com",
  "firstlightguns.com",
  "usarparts.com",
  "eeandarms.com",
];
const MARKET_HOSTS = [
  "gunbroker.com",
  "ammoseek.com",
  "gun.deals",
  "wikiarms.com",
  "ammobuy.com",
  "armsagora.com",
  "gunammo.deals",
  "ammobrowser.com",
  "gunmade.com",
  "caliberking.com",
  "bulletscout.com",
  "guns.com",
  "bulletblaster.com",
];

const TEXT_EXT = new Set([".html", ".xml", ".txt", ".json", ".js", ".css"]);

function hostRe(host) {
  return new RegExp(
    `(^|[^a-z0-9-])${host.replace(/\./g, "\\.")}([^a-z0-9-]|$)`,
    "i",
  );
}

function isUrlContext(content, index) {
  const before = content.slice(Math.max(0, index - 160), index);
  if (/(?:href|src|action|formaction|poster)\s*=\s*["'][^"']*$/i.test(before)) {
    return true;
  }
  if (/https?:\/\/[^\s"'<>]*$/i.test(before)) return true;
  if (/(?:^|[\s"'=(])\/\/[^\s"'<>]*$/i.test(before)) return true;
  if (/url\(\s*['"]?[^\s"'()]*$/i.test(before)) return true;
  return false;
}

function attrValues(content) {
  const values = [];
  const re =
    /\b(?:href|src|action|formaction)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let match;
  while ((match = re.exec(content))) {
    values.push(match[1] ?? match[2] ?? match[3] ?? "");
  }
  return values;
}

export function scanText(name, content) {
  const hits = [];
  for (const host of APEX) {
    const re = new RegExp(host.replace(/\./g, "\\."), "gi");
    let match;
    while ((match = re.exec(content))) {
      const inUrl = isUrlContext(content, match.index);
      if (host === APEX[0] || host === APEX[2]) {
        hits.push(`${name}: ${host}${inUrl ? " in a URL" : ""}`);
        continue;
      }
      if (inUrl) hits.push(`${name}: ${host} in a URL`);
    }
  }
  for (const value of attrValues(content)) {
    for (const host of [...CLIENT_HOSTS, ...MARKET_HOSTS]) {
      if (hostRe(host).test(value)) {
        hits.push(`${name}: ${host} in href/src/action (${value.slice(0, 120)})`);
      }
    }
  }
  const emailRe =
    /[a-z0-9._%+-]+@([a-z0-9.-]+\.[a-z]{2,})/gi;
  const bannedDomains = [...APEX, ...CLIENT_HOSTS];
  let email;
  while ((email = emailRe.exec(content))) {
    const domain = email[1].toLowerCase();
    if (
      bannedDomains.some(
        (host) => domain === host || domain.endsWith(`.${host}`),
      )
    ) {
      hits.push(`${name}: email on a banned domain (${email[0]})`);
    }
  }
  return hits;
}

function selfTest() {
  const agency = APEX[0];
  const gse = APEX[1];
  const gsa = APEX[2];
  const mustFail = [
    `<a href="https://www.${agency}/ecommerce">x</a>`,
    `plain ${agency} in text`,
    `<a href="https://${MARKET_HOSTS[0]}/item">x</a>`,
    `<a href="https://${CLIENT_HOSTS[0]}/">x</a>`,
    `support@${agency}`,
    `<a href="https://${gsa}">x</a>`,
    `https://www.${gse}/betsy-live`,
    `/x https://www.${agency}/ecommerce 301`,
  ];
  const mustPass = [
    "GunSearchEngine.com Pro is included.",
    "analytics (Google Analytics, Google Search Console, GunSearchEngine.com, and email/SMS).",
    "Coriolis, LLC. Greenville, SC.",
    '<a href="/contact/">Start FFL Accelerator</a>',
    "828-290-9005",
    "GunBroker.com, AmmoSeek.com, Gun.Deals",
    '<a href="/plan/#inventory-dropshipping">Catalogs</a>',
  ];
  const errors = [];
  mustFail.forEach((sample, i) => {
    const hits = scanText(`fail-${i}`, sample);
    if (hits.length === 0) errors.push(`self-test expected failure: ${sample}`);
  });
  mustPass.forEach((sample, i) => {
    const hits = scanText(`pass-${i}`, sample);
    if (hits.length) errors.push(`self-test expected pass: ${sample} -> ${hits.join("; ")}`);
  });
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("banned-link self-test passed");
}

function walk(dir, out = []) {
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const path = join(dir, name);
    const st = statSync(path);
    if (st.isDirectory()) walk(path, out);
    else out.push(path);
  }
  return out;
}

function shouldScan(path) {
  if (path.endsWith("/_redirects") || path.endsWith("\\_redirects")) return true;
  const dot = path.lastIndexOf(".");
  if (dot === -1) return false;
  return TEXT_EXT.has(path.slice(dot).toLowerCase());
}

selfTest();

const dist = resolve(root, "dist");
let distEntries = [];
try {
  distEntries = walk(dist);
} catch {
  console.error("dist/ is missing. Run astro build first.");
  process.exit(1);
}
const files = distEntries.filter(shouldScan);
const vercel = resolve(root, "vercel.json");
const extra = [];
try {
  extra.push(vercel);
} catch {
  /* missing */
}

if (files.length === 0) {
  console.error("dist/ has no scannable files. Run astro build first.");
  process.exit(1);
}

const hits = [];
for (const file of [...files, ...extra]) {
  const text = readFileSync(file, "utf8");
  const rel = file.startsWith(root) ? file.slice(root.length + 1) : file;
  hits.push(...scanText(rel, text));
}

if (hits.length) {
  console.error(hits.join("\n"));
  process.exit(1);
}

console.log(`banned-link gate passed (${files.length} dist files + vercel.json)`);
