import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  GONE_EXACT,
  GONE_PREFIXES,
  PERMANENT_REDIRECTS,
  VERCEL_INSTALL_COMMAND,
  toBulkRedirectCsv,
  toCloudflareRedirects,
} from "../src/lib/redirects.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function vercelConfig() {
  const redirects = PERMANENT_REDIRECTS.map((rule) => ({
    source: rule.from,
    destination: rule.to,
    statusCode: 301,
  }));
  const rewrites = [];
  for (const path of GONE_EXACT) {
    rewrites.push({ source: path, destination: "/api/gone" });
  }
  // trailingSlash: true sends /x/y to /x/y/ first, and `/x/:path*` does not
  // match a trailing slash, so each prefix also gets a slashed source.
  // (Without it /category/shot-show/ and /tag/x/ answered 404, not 410.)
  for (const prefix of [...GONE_PREFIXES, "/category/"]) {
    const base = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    rewrites.push({ source: `${base}/:path*`, destination: "/api/gone" });
    rewrites.push({ source: `${base}/:path*/`, destination: "/api/gone" });
  }
  return {
    trailingSlash: true,
    installCommand: VERCEL_INSTALL_COMMAND,
    redirects,
    rewrites,
  };
}

const vercelPath = resolve(root, "vercel.json");
const redirectsPath = resolve(root, "public/_redirects");
const csvPath = resolve(root, "docs/cloudflare-bulk-redirects.csv");

const nextVercel = `${JSON.stringify(vercelConfig(), null, 2)}\n`;
const nextRedirects = toCloudflareRedirects();
const nextCsv = toBulkRedirectCsv();

if (VERCEL_INSTALL_COMMAND.length >= 256) {
  console.error(
    `installCommand is ${VERCEL_INSTALL_COMMAND.length} characters (max 255)`,
  );
  process.exit(1);
}

const check = process.argv.includes("--check");

function same(path, next) {
  try {
    return readFileSync(path, "utf8") === next;
  } catch {
    return false;
  }
}

/** Byte match, or the same routes after a host rewrites whitespace or extra keys. */
function vercelInSync(path, expected) {
  let raw;
  try {
    raw = readFileSync(path, "utf8").replace(/^\uFEFF/, "");
  } catch {
    return false;
  }
  const canonical = `${JSON.stringify(expected, null, 2)}\n`;
  if (raw === canonical || raw === canonical.replace(/\n$/, "")) return true;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return false;
  }
  let install = String(parsed.installCommand ?? "");
  const token = process.env.LEAD_FORM_READ_TOKEN;
  if (token && install.includes(token)) {
    install = install.split(token).join("$LEAD_FORM_READ_TOKEN");
  }
  if (parsed.trailingSlash !== expected.trailingSlash) return false;
  if (install !== expected.installCommand) return false;
  const routeKey = (rule) =>
    `${rule.source}\n${rule.destination}\n${rule.statusCode ?? (rule.permanent === true ? 301 : rule.permanent === false ? 307 : "")}`;
  const rewriteKey = (rule) => `${rule.source}\n${rule.destination}`;
  const sameList = (left, right, key) =>
    (left || []).map(key).join("\n") === (right || []).map(key).join("\n");
  return (
    sameList(parsed.redirects, expected.redirects, routeKey) &&
    sameList(parsed.rewrites, expected.rewrites, rewriteKey)
  );
}

if (check) {
  const bad = [];
  if (!vercelInSync(vercelPath, vercelConfig())) bad.push("vercel.json");
  if (!same(redirectsPath, nextRedirects)) bad.push("public/_redirects");
  if (!same(csvPath, nextCsv)) bad.push("docs/cloudflare-bulk-redirects.csv");
  if (bad.length) {
    console.error(
      `Out of sync with src/lib/redirects.ts: ${bad.join(", ")}. Run: npm run gen:vercel`,
    );
    process.exit(1);
  }
  console.log(
    `vercel.json in sync. installCommand length ${VERCEL_INSTALL_COMMAND.length}.`,
  );
} else {
  writeFileSync(vercelPath, nextVercel);
  writeFileSync(redirectsPath, nextRedirects);
  writeFileSync(csvPath, nextCsv);
  console.log(
    `Wrote vercel.json, public/_redirects, docs/cloudflare-bulk-redirects.csv. installCommand length ${VERCEL_INSTALL_COMMAND.length}.`,
  );
}
