// POPUP-PARK: the FFLA pop-up is parked (code kept, mount off, GET reports disabled).
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const read = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");

const { FFLA_POPUPS_ENABLED, FFLA_POPUP_CONFIG } = await import("../src/lib/popup-config.ts");
assert.equal(FFLA_POPUPS_ENABLED, false, "pop-up must stay parked");
assert.equal(FFLA_POPUP_CONFIG.site, "ffla", "config is kept");

const layout = read("src/layouts/BaseLayout.astro");
assert.match(layout, /const showPopup = FFLA_POPUPS_ENABLED && emailCapture;/);
assert.equal((layout.match(/showPopup \? \(/g) || []).length, 2, "both mounts gated");
assert.equal(/\n\s*emailCapture \? \(/.test(layout), false, "no ungated mount");

const api = read("api/popup.ts");
assert.match(api, /const POPUPS_ENABLED: boolean = false;/);
assert.match(api, /enabled: POPUPS_ENABLED && status\.enabled,/);

for (const f of ["public/popup/coriolis-popup.v1.js", "public/popup/coriolis-popup.v1.css", "popup-kit/client/coriolis-popup.js", "popup-kit/server/subscribe-core.ts", "popup-kit/PARKED.md"]) {
  assert.ok(existsSync(new URL("../" + f, import.meta.url)), f + " kept");
}
console.log("test-popup-park: ok");
