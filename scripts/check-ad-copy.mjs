/**
 * Fails the build when softened sale words show up in visible copy.
 * Scans titles, meta descriptions, alt text, and text on real pages.
 * Skips redirect stubs, because those print legacy URL slugs.
 * Word boundaries, so a product token such as GunSearchEngine.com is not a hit.
 * "ammo" also matches when it starts a brand token (AmmoReady).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const WORD =
  /\b(handguns?|shotguns?|guns?|firearms?|serialized)\b|(?:^|[^a-z])ammo/i;

function hits(text) {
  const found = [];
  const re =
    /\b(handguns?|shotguns?|guns?|firearms?|serialized)\b|(?:^|[^a-z])(ammo)/gi;
  let match;
  while ((match = re.exec(text))) {
    found.push(match[1] || match[2]);
  }
  return found;
}

function assert(cond, message) {
  if (!cond) {
    console.error(`ad-copy self-test failed: ${message}`);
    process.exit(1);
  }
}

assert(hits("Can I sell guns I do not stock?").length > 0, "guns");
assert(hits("A serialized firearm ships").length >= 2, "serialized firearm");
assert(hits("Rapid Gun Systems").some((w) => w.toLowerCase() === "gun"), "Rapid Gun");
assert(hits("AmmoReady for nine years").some((w) => w.toLowerCase() === "ammo"), "AmmoReady");
assert(hits("bulk ammo").length > 0, "ammo");
assert(hits("FFL Accelerator").length === 0, "FFL should pass");
assert(hits("GunSearchEngine.com Pro").length === 0, "product token should pass");
assert(hits("MAILGUN_API_KEY").length === 0, "mailgun should pass");
assert(hits("Integrations with 13 online marketplaces").length === 0, "count line");
assert(hits("and other registers").length === 0, "registers");
console.log("ad-copy self-test passed");

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

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, out);
    else if (name.endsWith(".html") || name.endsWith(".txt")) out.push(path);
  }
  return out;
}

function pageText(html) {
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? "";
  if (title.startsWith("Redirecting")) return null;
  const bits = [title];
  const metaRe =
    /<meta\b[^>]*>/gi;
  let tag;
  while ((tag = metaRe.exec(html))) {
    const el = tag[0];
    const key = el.match(/\b(?:name|property)="([^"]+)"/i)?.[1]?.toLowerCase();
    const content = el.match(/\bcontent="([^"]*)"/i)?.[1] ?? "";
    if (
      key === "description" ||
      key === "og:title" ||
      key === "og:description" ||
      key === "twitter:title" ||
      key === "twitter:description"
    ) {
      bits.push(content);
    }
  }
  const altRe = /\balt="([^"]*)"/gi;
  let alt;
  while ((alt = altRe.exec(html))) bits.push(alt[1]);
  const text = html
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  bits.push(text);
  return decode(bits.join("\n"));
}

const errors = [];
const dist = resolve(root, "dist");
for (const file of walk(dist)) {
  const raw = readFileSync(file, "utf8");
  const rel = file.slice(dist.length + 1);
  let text;
  if (file.endsWith(".txt")) {
    text = decode(raw.replace(/https?:\/\/\S+/g, " "));
  } else {
    text = pageText(raw);
    if (text == null) continue;
  }
  const found = hits(
    text.replace(/https?:\/\/\S+/g, " ").replace(/\/[A-Za-z0-9._~/-]+/g, " "),
  );
  if (found.length) {
    errors.push(`${rel}: ${[...new Set(found)].join(", ")}`);
  }
}

if (!WORD.test("gun")) {
  console.error("ad-copy pattern failed to compile a sample");
  process.exit(1);
}

if (errors.length) {
  console.error("ad-copy check failed:\n" + errors.join("\n"));
  process.exit(1);
}

console.log("ad-copy check passed (no softened sale words in visible copy)");
