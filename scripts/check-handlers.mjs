/**
 * Local handler check against 127.0.0.1. Never calls production Ops.
 */
import { createServer } from "node:http";

const SECRET = "dummy-secret-not-production";

async function listen() {
  const hits = [];
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    hits.push({ url: req.url, raw, auth: req.headers.authorization || "" });
    const status = req.url?.includes("fail") ? 500 : 200;
    res.writeHead(status, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: status === 200, needs_activation: false }));
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  return {
    hits,
    base: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

async function post(handler, url, body, headers = {}) {
  const request = new Request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://fflaccelerator.com",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  const response = await handler(request);
  const text = await response.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { status: response.status, json };
}

const mock = await listen();
process.env.CORIOLIS_OS_URL = mock.base;
process.env.FORM_INTAKE_SECRET = SECRET;
process.env.LEAD_FORM_SITE = "fflaccelerator";
process.env.LEAD_FORM_HOST = "fflaccelerator.com";
delete process.env.MAILGUN_API_KEY;
delete process.env.MAILGUN_DOMAIN;
delete process.env.CONTACT_TO;

const { POST: subscribe } = await import("../api/subscribe.ts");

const subOk = await post(subscribe, "https://fflaccelerator.com/api/subscribe", {
  email: "reader@example.com",
  source: "popup_fflaccelerator",
});
if (subOk.status !== 200 || !subOk.json.ok) {
  console.error("subscribe success failed", subOk);
  process.exit(1);
}
if (!mock.hits[0]?.raw.includes("popup_fflaccelerator")) {
  console.error("subscribe did not forward source", mock.hits[0]);
  process.exit(1);
}
if (mock.hits[0].auth !== `Bearer ${SECRET}`) {
  console.error("subscribe auth header mismatch");
  process.exit(1);
}
const subBad = await post(subscribe, "https://fflaccelerator.com/api/subscribe", {
  email: "not-an-email",
});
if (subBad.status !== 400) {
  console.error("subscribe invalid email expected 400", subBad);
  process.exit(1);
}

let lead;
let leadModule;
try {
  leadModule = await import("@coriolis/lead-form/handler");
  lead = leadModule.POST;
} catch (err) {
  console.error("Could not import @coriolis/lead-form/handler", err);
  await mock.close();
  process.exit(1);
}

if (leadModule.LOCAL_STUB) {
  console.log(
    "subscribe checks passed against api/subscribe.ts and 127.0.0.1",
  );
  console.log(
    "LEAD HANDLER SKIPPED: installed @coriolis/lead-form is a local stand-in. The private repo was not readable from this environment, so the real handler was not executed.",
  );
  await mock.close();
  process.exit(0);
}

const before = mock.hits.length;
const started = Date.now() - 10_000;
const leadBody = {
  name: "Pat Example",
  company: "Example Guns",
  email: "pat@example.com",
  phone: "828-555-0100",
  website: "https://example.com",
  pillar: "Ecommerce",
  message: "Need a store.",
  page: "/contact/",
  landing: "/",
  utm_source: "social",
  utm_medium: "post",
  utm_campaign: "ship2",
  started_at: started,
};

const ok = await post(lead, "https://fflaccelerator.com/api/lead", leadBody);
const okHit = mock.hits[before];
if (ok.status !== 200) {
  console.error("lead success status", ok);
  await mock.close();
  process.exit(1);
}
if (!okHit) {
  console.error("lead success did not reach mock Ops");
  await mock.close();
  process.exit(1);
}
const forwarded = okHit.raw;
for (const bit of ["fflaccelerator", "/contact/", "social", "Ecommerce"]) {
  if (!forwarded.includes(bit)) {
    console.error(`lead forward missing ${bit}`, forwarded.slice(0, 800));
    await mock.close();
    process.exit(1);
  }
}

const honeypotBefore = mock.hits.length;
const honey = await post(lead, "https://fflaccelerator.com/api/lead", {
  ...leadBody,
  company_url: "https://spam.example",
  started_at: Date.now() - 10_000,
});
if (honey.status !== 200 || mock.hits.length !== honeypotBefore) {
  console.error("honeypot should be 200 with no Ops hit", honey.status, mock.hits.length, honeypotBefore);
  await mock.close();
  process.exit(1);
}

const fastBefore = mock.hits.length;
const fast = await post(lead, "https://fflaccelerator.com/api/lead", {
  ...leadBody,
  started_at: Date.now(),
});
if (fast.status !== 200 || mock.hits.length !== fastBefore) {
  console.error("fast fill should be 200 with no Ops hit", fast.status, mock.hits.length, fastBefore);
  await mock.close();
  process.exit(1);
}

process.env.CORIOLIS_OS_URL = `${mock.base}/fail`;
const retry = await post(lead, "https://fflaccelerator.com/api/lead", {
  ...leadBody,
  started_at: Date.now() - 10_000,
});
if (retry.status !== 502) {
  console.error("Ops 500 should surface as 502", retry);
  await mock.close();
  process.exit(1);
}

await mock.close();
console.log("handler checks passed (subscribe + lead against 127.0.0.1)");
console.log("lead forward sample:", forwarded.slice(0, 500));
