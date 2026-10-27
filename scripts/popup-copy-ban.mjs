#!/usr/bin/env node
// Popup copy-ban check. The banned terms are never stored in this repo.
// They load at runtime from POPUP_BANNED_TERMS (comma separated), set in CI
// from the repo secret of the same name. Missing or empty: skip with a CI
// warning. Present: any hit fails. Output names files and counts only.
// Usage: node popup-copy-ban.mjs <file-or-dir> [...]
import fs from "node:fs";
import path from "node:path";

const VAR = "POPUP_BANNED_TERMS";
const raw = process.env[VAR] || "";
const terms = raw
  .split(",")
  .map((t) => t.trim().toLowerCase())
  .filter(Boolean);

if (terms.length === 0) {
  console.log(`::warning::${VAR} is not set; popup copy-ban check skipped.`);
  process.exit(0);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
const patterns = terms.map((t) => new RegExp(`(?<![a-z0-9])${esc(t)}(?:'?s)?(?![a-z0-9])`, "gi"));

function walk(p, out) {
  if (!fs.existsSync(p)) return out;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const name of fs.readdirSync(p)) {
      if (name === "node_modules" || name === ".git") continue;
      walk(path.join(p, name), out);
    }
  } else if (st.isFile() && path.basename(p) !== "SHA256SUMS") {
    out.push(p);
  }
  return out;
}

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error("popup-copy-ban: no paths given");
  process.exit(2);
}
const files = targets.flatMap((t) => walk(t, []));
let total = 0;
for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  let n = 0;
  for (const re of patterns) n += (text.match(re) || []).length;
  if (n > 0) {
    total += n;
    console.error(`popup-copy-ban: ${n} banned term hit(s) in ${file}`);
  }
}
console.log(`popup-copy-ban: ${files.length} files checked, ${terms.length} terms, ${total} hits`);
process.exit(total > 0 ? 1 : 0);
