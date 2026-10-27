import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPopupHandler } from "./load-popup-handler.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const kit = path.join(root, "popup-kit");
const DASH = /[\u2013\u2014]/;
const ENV_KEYS = [
  "MAILCHIMP_API_KEY",
  "MAILCHIMP_AUDIENCE_ID",
  "MAILCHIMP_DOUBLE_OPT_IN",
  "CORIOLIS_OS_URL",
  "FORM_INTAKE_SECRET",
];

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel));
}

function walkFiles(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

function snapshotEnv() {
  const snap = {};
  for (const k of ENV_KEYS) snap[k] = process.env[k];
  return snap;
}

function restoreEnv(snap) {
  for (const k of ENV_KEYS) {
    if (snap[k] === undefined) delete process.env[k];
    else process.env[k] = snap[k];
  }
}

function clearPopupEnv() {
  for (const k of ENV_KEYS) delete process.env[k];
}

const sums = fs.readFileSync(path.join(kit, "SHA256SUMS"), "utf8").trim().split(/\r?\n/);
assert.ok(sums.length >= 4, "SHA256SUMS missing hashes");
const seen = new Set();
for (const line of sums) {
  const m = line.match(/^([0-9a-f]{64})  (.+)$/);
  assert.ok(m, `bad SHA256SUMS line: ${line}`);
  const [, hash, rel] = m;
  assert.equal(rel === "SHA256SUMS", false, "SHA256SUMS must not hash itself");
  const buf = fs.readFileSync(path.join(kit, rel));
  assert.equal(sha256(buf), hash, `hash mismatch ${rel}`);
  seen.add(rel);
}
for (const rel of [
  "VERSION",
  "client/coriolis-popup.js",
  "client/coriolis-popup.css",
  "server/subscribe-core.ts",
]) {
  assert.ok(seen.has(rel), `SHA256SUMS missing ${rel}`);
}

const jsKit = read("popup-kit/client/coriolis-popup.js");
const cssKit = read("popup-kit/client/coriolis-popup.css");
assert.ok(jsKit.length < 12 * 1024, `client JS ${jsKit.length} >= 12KB`);
assert.deepEqual(read("public/popup/coriolis-popup.v1.js"), jsKit);
assert.deepEqual(read("public/popup/coriolis-popup.v1.css"), cssKit);
assert.equal(fs.readFileSync(path.join(kit, "VERSION"), "utf8").trim(), "1");

const copyTargets = [
  path.join(root, "src/lib/popup-config.ts"),
  ...walkFiles(kit).filter((f) => path.basename(f) !== "SHA256SUMS"),
];
for (const file of copyTargets) {
  const text = fs.readFileSync(file, "utf8");
  assert.doesNotMatch(text, DASH, `em/en dash in ${path.relative(root, file)}`);
}

const { FFLA_POPUP_CONFIG } = await import("../src/lib/popup-config.ts");
assert.equal(FFLA_POPUP_CONFIG.site, "ffla");
assert.equal(FFLA_POPUP_CONFIG.lane, "ffla-managed");
assert.equal(FFLA_POPUP_CONFIG.endpoint, "/api/popup");
assert.equal(FFLA_POPUP_CONFIG.privacyUrl, "/privacy/");
assert.deepEqual(FFLA_POPUP_CONFIG.denyPaths, ["/contact"]);
assert.equal(FFLA_POPUP_CONFIG.copy.headline, "Your store, fully managed.");
assert.equal(FFLA_POPUP_CONFIG.copy.button, "Send the setup steps");
assert.equal(FFLA_POPUP_CONFIG.fields[0].name, "company");
assert.equal(FFLA_POPUP_CONFIG.ctas[0].href, "/plan/#setup");
assert.equal(FFLA_POPUP_CONFIG.ctas[1].href, "/plan/#setup");
assert.equal(FFLA_POPUP_CONFIG.ctas[2].href, "/contact/");
assert.equal(FFLA_POPUP_CONFIG.ctas[3].href, "tel:+12792586771");
const dumped = JSON.stringify(FFLA_POPUP_CONFIG);
assert.equal(/coriolisagency\.com/i.test(dumped), false);
assert.equal(/gunsearchengine\.com/i.test(dumped), false);

const core = await import("../popup-kit/server/subscribe-core.ts");
const { popupStatus, handlePopupSubscribe, buildMailchimpPayload } = core;

function payloadFor(site, extra = {}) {
  return buildMailchimpPayload({
    site,
    email: "owner@example.com",
    fields: extra.fields || {},
    page: extra.page || "/plan/",
    landing: extra.landing || "/lp/",
    utm: extra.utm || {
      source: extra.utmSource || "",
      medium: "",
      campaign: extra.utmCampaign || "",
      term: "",
      content: "",
    },
    gclid: extra.gclid || "",
    doubleOptIn: extra.doubleOptIn !== false,
  });
}

const lanes = {
  agency: "agency-web",
  gse: "gse-consumer",
  ffla: "ffla-managed",
  fflm: "fflm-early-access",
};
for (const [site, lane] of Object.entries(lanes)) {
  const p = payloadFor(site, {
    fields: { company: "Acme Guns", skip_me: "nope" },
    utmSource: "google",
    utmCampaign: "brand",
    gclid: "Cj0TEST",
  });
  assert.equal(p.member.email_address, "owner@example.com");
  assert.equal(p.member.status_if_new, "pending");
  assert.equal(p.member.merge_fields.LANE, lane);
  assert.equal(p.member.merge_fields.SOURCE, `popup:${site}`);
  assert.equal(p.member.merge_fields.SITE, site);
  assert.equal(p.member.merge_fields.PAGE, "/plan/");
  assert.equal(p.member.merge_fields.LANDING, "/lp/");
  assert.equal(p.member.merge_fields.UTM_SRC, "google");
  assert.equal(p.member.merge_fields.UTM_CMP, "brand");
  assert.equal(p.member.merge_fields.GCLID, "Cj0TEST");
  assert.equal(p.member.merge_fields.COMPANY, "Acme Guns");
  assert.equal("skip_me" in p.member.merge_fields, false);
  const names = p.tags.map((t) => t.name).sort();
  assert.deepEqual(
    names,
    [`lane:${lane}`, "src:popup", `site:${site}`, "utm:google"].sort(),
  );
  for (const tag of p.tags) assert.equal(tag.status, "active");
}

const sub = payloadFor("ffla", { doubleOptIn: false });
assert.equal(sub.member.status_if_new, "subscribed");

const secretEnv = {
  MAILCHIMP_API_KEY: "test-key-us6",
  MAILCHIMP_AUDIENCE_ID: "aud-123",
  CORIOLIS_OS_URL: "https://ops.example.invalid",
  FORM_INTAKE_SECRET: "form-secret",
};

function assertNoLeak(obj, env) {
  const dumpedObj = JSON.stringify(obj);
  for (const v of Object.values(env)) {
    if (v) assert.equal(dumpedObj.includes(v), false, "status leaked env value");
  }
}

const mc = popupStatus(secretEnv, "ffla");
assert.equal(mc.backend, "mailchimp");
assert.equal(mc.enabled, true);
assertNoLeak(mc, secretEnv);

const legacyOnly = {
  CORIOLIS_OS_URL: "https://ops.example.invalid",
  FORM_INTAKE_SECRET: "form-secret",
};
const lgFfla = popupStatus(legacyOnly, "ffla");
assert.equal(lgFfla.backend, "legacy");
assert.equal(lgFfla.enabled, true);
assertNoLeak(lgFfla, legacyOnly);

const lgAgency = popupStatus(legacyOnly, "agency");
assert.equal(lgAgency.backend, "legacy");

const lgGse = popupStatus(legacyOnly, "gse");
assert.equal(lgGse.backend, "none");
assert.equal(lgGse.enabled, false);

const lgFflm = popupStatus(legacyOnly, "fflm");
assert.equal(lgFflm.backend, "none");

const none = popupStatus({}, "ffla");
assert.equal(none.backend, "none");
assert.equal(none.enabled, false);

const both = popupStatus(secretEnv, "ffla");
assert.equal(both.backend, "mailchimp");

const origFetch = globalThis.fetch;
let fetchCalls = [];
globalThis.fetch = async (url, init) => {
  fetchCalls.push({ url: String(url), init });
  throw new Error("fetch should not run");
};

const honey = await handlePopupSubscribe(legacyOnly, "ffla", {
  email: "a@b.com",
  website: "http://spam",
  t: 5000,
});
assert.equal(honey.status, 200);
assert.equal(honey.ok, true);
assert.equal(fetchCalls.length, 0);

const tooFast = await handlePopupSubscribe(legacyOnly, "ffla", {
  email: "a@b.com",
  website: "",
  t: 1499,
});
assert.equal(tooFast.status, 200);
assert.equal(tooFast.ok, true);
assert.equal(fetchCalls.length, 0);

const badEmail = await handlePopupSubscribe(legacyOnly, "ffla", {
  email: "not-an-email",
  t: 2000,
});
assert.equal(badEmail.status, 400);
assert.equal(badEmail.ok, false);
assert.equal(fetchCalls.length, 0);

const closed = await handlePopupSubscribe({}, "ffla", {
  email: "a@b.com",
  t: 2000,
});
assert.equal(closed.status, 503);
assert.equal(closed.ok, false);
assert.equal(closed.error, "Sign-up is not open yet.");
assert.equal(fetchCalls.length, 0);

globalThis.fetch = async (url, init) => {
  fetchCalls.push({ url: String(url), init });
  return new Response(JSON.stringify({ needs_activation: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
fetchCalls = [];
const legacyPost = await handlePopupSubscribe(legacyOnly, "ffla", {
  email: "dealer@shop.example",
  t: 2000,
  fields: { company: "Shop" },
});
assert.equal(legacyPost.ok, true);
assert.equal(legacyPost.needs_activation, true);
assert.equal(fetchCalls.length, 1);
assert.match(fetchCalls[0].url, /\/api\/forms\/subscribe$/);
const legacyBody = JSON.parse(fetchCalls[0].init.body);
assert.equal(legacyBody.email, "dealer@shop.example");
assert.equal(legacyBody.source, "popup_fflaccelerator");
assert.equal(String(fetchCalls[0].init.headers.authorization).startsWith("Bearer "), true);

fetchCalls = [];
globalThis.fetch = async (url, init) => {
  fetchCalls.push({ url: String(url), method: init.method, body: init.body });
  if (String(url).endsWith("/tags")) {
    return new Response("{}", { status: 200, headers: { "content-type": "application/json" } });
  }
  const body = JSON.parse(init.body);
  if (body.merge_fields) {
    return new Response(JSON.stringify({ title: "Invalid Resource", detail: "merge fields invalid" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  return new Response("{}", { status: 200 });
};

const mcEnv = {
  MAILCHIMP_API_KEY: "test-key-us6",
  MAILCHIMP_AUDIENCE_ID: "aud-123",
};
const mcPost = await handlePopupSubscribe(mcEnv, "ffla", {
  email: "Owner@Example.com",
  t: 2500,
  page: "/plan/",
  landing: "/lp/",
  utm: { source: "google", campaign: "notes" },
  fields: { company: "Acme" },
});
assert.equal(mcPost.ok, true);
assert.equal(mcPost.needs_activation, true);
assert.equal(fetchCalls.length, 3);
assert.match(fetchCalls[0].url, /us6\.api\.mailchimp\.com\/3\.0\/lists\/aud-123\/members\/[a-f0-9]{32}$/);
assert.equal(fetchCalls[0].method, "PUT");
assert.equal("merge_fields" in JSON.parse(fetchCalls[0].body), true);
assert.equal("merge_fields" in JSON.parse(fetchCalls[1].body), false);
assert.equal(fetchCalls[2].method, "POST");
assert.match(fetchCalls[2].url, /\/tags$/);

fetchCalls = [];
const bothEnv = {
  MAILCHIMP_API_KEY: "test-key-us6",
  MAILCHIMP_AUDIENCE_ID: "aud-fresh",
  CORIOLIS_OS_URL: "https://ops.example.invalid",
  FORM_INTAKE_SECRET: "form-secret",
};
globalThis.fetch = async (url, init) => {
  fetchCalls.push(String(url));
  if (String(url).includes("ops.example.invalid")) {
    throw new Error("legacy Ops must not be called when Mailchimp vars are set");
  }
  if (String(url).endsWith("/tags")) {
    return new Response("{}", { status: 200 });
  }
  return new Response("{}", { status: 200 });
};
const bothPost = await handlePopupSubscribe(bothEnv, "ffla", {
  email: "dealer@shop.example",
  t: 2000,
});
assert.equal(bothPost.ok, true);
assert.ok(fetchCalls.length > 0);
for (const url of fetchCalls) {
  assert.match(url, /api\.mailchimp\.com/);
  assert.equal(url.includes("ops.example.invalid"), false);
}

globalThis.fetch = origFetch;

const handler = await loadPopupHandler();
try {
  const boot = await handler.GET();
  assert.equal(boot.status, 200);
  const bootJson = await boot.json();
  assert.equal(bootJson.ok, true);
  assert.equal(typeof bootJson.enabled, "boolean");
  assert.equal(bootJson.site, "ffla");
  assert.equal(bootJson.lane, "ffla-managed");
  assert.equal("MAILCHIMP_API_KEY" in bootJson, false);
  assert.equal("MAILCHIMP_AUDIENCE_ID" in bootJson, false);
  assert.equal("CORIOLIS_OS_URL" in bootJson, false);
  assert.equal("FORM_INTAKE_SECRET" in bootJson, false);
  console.log("popup GET() (compiled, no env mutation):", JSON.stringify(bootJson));

  const snap = snapshotEnv();
  try {
    clearPopupEnv();
    const off = await handler.GET();
    assert.equal(off.status, 200);
    const offJson = await off.json();
    assert.equal(offJson.ok, true);
    assert.equal(offJson.enabled, false);
    assert.equal(offJson.backend, "none");
    assertNoLeak(offJson, snap);

    const nonePost = await handler.POST(
      new Request("https://fflaccelerator.com/api/popup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "dealer@shop.example", t: 2000, website: "" }),
      }),
    );
    assert.equal(nonePost.status, 503);
    const noneJson = await nonePost.json();
    assert.equal(noneJson.ok, false);
    assert.equal(noneJson.error, "Sign-up is not open yet.");

    process.env.MAILCHIMP_API_KEY = "test-key-us6";
    process.env.MAILCHIMP_AUDIENCE_ID = "aud-fresh";
    process.env.CORIOLIS_OS_URL = "https://ops.example.invalid";
    process.env.FORM_INTAKE_SECRET = "form-secret";

    const handlerCalls = [];
    globalThis.fetch = async (url, init) => {
      handlerCalls.push(String(url));
      if (String(url).includes("ops.example.invalid")) {
        throw new Error("legacy Ops must not be called when Mailchimp vars are set");
      }
      if (String(url).endsWith("/tags")) return new Response("{}", { status: 200 });
      return new Response("{}", { status: 200 });
    };
    const mcHandler = await handler.POST(
      new Request("https://fflaccelerator.com/api/popup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: "dealer@shop.example", t: 2000, website: "" }),
      }),
    );
    assert.equal(mcHandler.status, 200);
    const mcJson = await mcHandler.json();
    assert.equal(mcJson.ok, true);
    assert.ok(handlerCalls.length > 0);
    for (const url of handlerCalls) {
      assert.match(url, /api\.mailchimp\.com/);
      assert.equal(url.includes("ops.example.invalid"), false);
    }
  } finally {
    globalThis.fetch = origFetch;
    restoreEnv(snap);
  }
} finally {
  await handler.cleanup();
}

console.log("test-popup: ok");
