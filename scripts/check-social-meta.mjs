import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name.endsWith(".html")) out.push(path);
  }
  return out;
}

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#36;|&dollar;/g, "$")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

const BANNED = [
  { re: /\$\s?\d/, label: "dollar figure" },
  { re: /Minute Man/i, label: "Minute Man" },
  { re: /\bMilitia\b/, label: "Militia" },
  { re: /Gun Runner/, label: "Gun Runner" },
  { re: /\bWarlord\b/, label: "Warlord" },
  { re: /FFL Accelerator plan/i, label: "FFL Accelerator plan" },
];

function metaMap(html) {
  const out = {};
  const title = html.match(/<title>([\s\S]*?)<\/title>/i);
  if (title) out.title = decode(title[1].trim());
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const key =
      /(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1] ?? "";
    const content = /content\s*=\s*["']([^"']*)["']/i.exec(tag)?.[1];
    if (!content) continue;
    if (
      key === "og:title" ||
      key === "og:description" ||
      key === "twitter:title" ||
      key === "twitter:description"
    ) {
      out[key] = decode(content);
    }
  }
  return out;
}

const SOCIAL = [
  "title",
  "og:title",
  "og:description",
  "twitter:title",
  "twitter:description",
];

const errors = [];
for (const file of walk(dist)) {
  const html = readFileSync(file, "utf8");
  const meta = metaMap(html);
  const rel = file.slice(root.length + 1);
  const isPage = Boolean(meta["og:title"]);
  const fields = isPage ? SOCIAL : ["title"];
  for (const field of fields) {
    if (isPage && meta[field] == null) {
      errors.push(`${rel} missing ${field}`);
      continue;
    }
    const value = meta[field] ?? "";
    for (const ban of BANNED) {
      if (ban.re.test(value)) {
        errors.push(`${rel} ${field} has ${ban.label}: ${value}`);
      }
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("social meta check passed (no price, no tier name in titles)");
