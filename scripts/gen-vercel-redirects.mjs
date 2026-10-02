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
  for (const prefix of GONE_PREFIXES) {
    const base = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
    rewrites.push({ source: `${base}/:path*`, destination: "/api/gone" });
  }
  rewrites.push({ source: "/category/:path*", destination: "/api/gone" });
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

if (check) {
  const bad = [];
  if (!same(vercelPath, nextVercel)) bad.push("vercel.json");
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
