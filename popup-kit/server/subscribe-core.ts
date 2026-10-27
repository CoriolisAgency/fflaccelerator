/**
 * popup-kit subscribe core. Zero framework imports. Node fetch + node:crypto only.
 * Env names are read by name. Never log env values, keys, or full email addresses.
 */

import { createHash } from "node:crypto";

export type PopupSite = "agency" | "gse" | "ffla" | "fflm";
export type PopupBackend = "mailchimp" | "legacy" | "none";

export type PopupEnv = Record<string, string | undefined>;

export type PopupSubscribeBody = {
  email?: unknown;
  fields?: unknown;
  website?: unknown;
  t?: unknown;
  page?: unknown;
  landing?: unknown;
  referrer?: unknown;
  utm?: unknown;
  gclid?: unknown;
};

export type PopupSubscribeMeta = {
  ip?: string;
};

export type PopupResult = {
  status: number;
  ok: boolean;
  error?: string;
  needs_activation?: boolean;
};

export type MailchimpTag = { name: string; status: "active" };

export type MailchimpPayload = {
  member: {
    email_address: string;
    status_if_new: "pending" | "subscribed";
    merge_fields: Record<string, string>;
  };
  tags: MailchimpTag[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX = 254;
const FIELD_MAX = 120;
const TIMEOUT_MS = 8000;
const FIELD_ALLOW = new Set(["company"]);
const LEGACY_SITES = new Set<PopupSite>(["agency", "ffla"]);
const LEGACY_SOURCE: Record<string, string> = {
  agency: "popup_coriolis",
  ffla: "popup_fflaccelerator",
};
const SITE_LANE: Record<PopupSite, string> = {
  agency: "agency-web",
  gse: "gse-consumer",
  ffla: "ffla-managed",
  fflm: "fflm-early-access",
};

function trimStr(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isValidEmail(email: string): boolean {
  return email.length > 0 && email.length <= EMAIL_MAX && EMAIL_RE.test(email);
}

function envSet(env: PopupEnv, name: string): boolean {
  const v = env[name];
  return typeof v === "string" && v.trim().length > 0;
}

function emailDomain(email: string): string {
  const i = email.lastIndexOf("@");
  return i >= 0 ? email.slice(i + 1) : "unknown";
}

function mailchimpDc(key: string): string | null {
  const m = /-([a-z]{2}\d+)$/i.exec(key.trim());
  return m ? m[1].toLowerCase() : null;
}

function asUtm(raw: unknown): {
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
} {
  const obj =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  return {
    source: trimStr(obj.source, FIELD_MAX),
    medium: trimStr(obj.medium, FIELD_MAX),
    campaign: trimStr(obj.campaign, FIELD_MAX),
    term: trimStr(obj.term, FIELD_MAX),
    content: trimStr(obj.content, FIELD_MAX),
  };
}

function asFields(raw: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  const obj = raw as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (!FIELD_ALLOW.has(key)) continue;
    const v = trimStr(obj[key], FIELD_MAX);
    if (v) out[key] = v;
  }
  return out;
}

function readT(body: PopupSubscribeBody): number {
  if (typeof body.t === "number") return body.t;
  if (typeof body.t === "string") {
    const n = Number(body.t);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function popupStatus(
  env: PopupEnv,
  site: PopupSite
): { enabled: boolean; backend: PopupBackend } {
  if (envSet(env, "MAILCHIMP_API_KEY") && envSet(env, "MAILCHIMP_AUDIENCE_ID")) {
    return { enabled: true, backend: "mailchimp" };
  }
  if (LEGACY_SITES.has(site) && envSet(env, "CORIOLIS_OS_URL") && envSet(env, "FORM_INTAKE_SECRET")) {
    return { enabled: true, backend: "legacy" };
  }
  return { enabled: false, backend: "none" };
}

export function buildMailchimpPayload(input: {
  site: PopupSite;
  email: string;
  fields: Record<string, string>;
  page: string;
  landing: string;
  utm: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
  };
  gclid: string;
  doubleOptIn: boolean;
}): MailchimpPayload {
  const lane = SITE_LANE[input.site];
  const merge_fields: Record<string, string> = {
    LANE: lane,
    SOURCE: "popup:" + input.site,
    SITE: input.site,
    PAGE: input.page,
    LANDING: input.landing,
    UTM_SRC: input.utm.source,
    UTM_CMP: input.utm.campaign,
    GCLID: input.gclid,
  };
  if (input.fields.company) merge_fields.COMPANY = input.fields.company;

  const tags: MailchimpTag[] = [
    { name: "lane:" + lane, status: "active" },
    { name: "src:popup", status: "active" },
    { name: "site:" + input.site, status: "active" },
  ];
  if (input.utm.source) {
    tags.push({ name: "utm:" + input.utm.source, status: "active" });
  }

  return {
    member: {
      email_address: input.email,
      status_if_new: input.doubleOptIn ? "pending" : "subscribed",
      merge_fields,
    },
    tags,
  };
}

function jsonAuth(key: string): string {
  return "Basic " + Buffer.from("anystring:" + key).toString("base64");
}

async function readMailchimp(res: Response): Promise<{ title: string; detail: string }> {
  const text = await res.text();
  try {
    const j = JSON.parse(text) as { title?: unknown; detail?: unknown };
    return {
      title: typeof j.title === "string" ? j.title : "",
      detail: typeof j.detail === "string" ? j.detail : text.slice(0, 240),
    };
  } catch {
    return { title: "", detail: "" };
  }
}

function userErrorFromMailchimp(status: number): string {
  if (status === 400) return "Enter a valid email address.";
  if (status === 429) return "Too many attempts. Try again later.";
  return "Could not sign you up. Try again.";
}

async function postLegacy(
  env: PopupEnv,
  site: PopupSite,
  email: string
): Promise<PopupResult> {
  const osUrl = String(env.CORIOLIS_OS_URL).trim().replace(/\/$/, "");
  const secret = String(env.FORM_INTAKE_SECRET).trim();
  const source = LEGACY_SOURCE[site] || "popup_coriolis";
  try {
    const res = await fetch(osUrl + "/api/forms/subscribe", {
      method: "POST",
      headers: {
        authorization: "Bearer " + secret,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, source }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        needs_activation?: boolean;
      };
      return { status: 200, ok: true, needs_activation: !!data.needs_activation };
    }
    const domain = emailDomain(email);
    console.error("popup: legacy", res.status, domain);
    if (res.status === 400) {
      return { status: 400, ok: false, error: "Enter a valid email address." };
    }
    if (res.status === 502) {
      return {
        status: 502,
        ok: false,
        error: "Could not send confirmation email. Try again.",
      };
    }
    return { status: 502, ok: false, error: "Could not sign you up. Try again." };
  } catch (err) {
    console.error("popup: legacy failed", emailDomain(email), (err as Error).name);
    return { status: 502, ok: false, error: "Could not sign you up. Try again." };
  }
}

async function putMailchimp(
  env: PopupEnv,
  site: PopupSite,
  email: string,
  fields: Record<string, string>,
  page: string,
  landing: string,
  utm: ReturnType<typeof asUtm>,
  gclid: string
): Promise<PopupResult> {
  const key = String(env.MAILCHIMP_API_KEY).trim();
  const audience = String(env.MAILCHIMP_AUDIENCE_ID).trim();
  const dc = mailchimpDc(key);
  if (!dc) {
    console.error("popup: mailchimp missing dc");
    return { status: 502, ok: false, error: "Could not sign you up. Try again." };
  }
  const doubleOptIn = env.MAILCHIMP_DOUBLE_OPT_IN !== "0";
  const payload = buildMailchimpPayload({
    site,
    email,
    fields,
    page,
    landing,
    utm,
    gclid,
    doubleOptIn,
  });
  const hash = createHash("md5").update(email.toLowerCase()).digest("hex");
  const memberUrl =
    "https://" + dc + ".api.mailchimp.com/3.0/lists/" + audience + "/members/" + hash;
  const headers = {
    authorization: jsonAuth(key),
    "content-type": "application/json",
  };
  const domain = emailDomain(email);

  async function putMember(body: Record<string, unknown>): Promise<Response> {
    return fetch(memberUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  }

  try {
    let memberBody: Record<string, unknown> = {
      email_address: payload.member.email_address,
      status_if_new: payload.member.status_if_new,
      merge_fields: payload.member.merge_fields,
    };
    let res = await putMember(memberBody);
    if (res.status === 400) {
      const read = await readMailchimp(res);
      if (/merge/i.test(read.detail) || /merge/i.test(read.title)) {
        memberBody = {
          email_address: payload.member.email_address,
          status_if_new: payload.member.status_if_new,
        };
        res = await putMember(memberBody);
      } else {
        console.error("popup: mailchimp", res.status, read.title, domain);
        return { status: 400, ok: false, error: userErrorFromMailchimp(400) };
      }
    }
    if (!res.ok) {
      const read = await readMailchimp(res);
      console.error("popup: mailchimp", res.status, read.title, domain);
      return {
        status: res.status === 429 ? 429 : 502,
        ok: false,
        error: userErrorFromMailchimp(res.status),
      };
    }

    try {
      const tagRes = await fetch(memberUrl + "/tags", {
        method: "POST",
        headers,
        body: JSON.stringify({ tags: payload.tags }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!tagRes.ok) {
        const read = await readMailchimp(tagRes);
        console.error("popup: mailchimp tags", tagRes.status, read.title, domain);
      }
    } catch (err) {
      console.error("popup: mailchimp tags failed", domain, (err as Error).name);
    }

    return {
      status: 200,
      ok: true,
      needs_activation: payload.member.status_if_new === "pending",
    };
  } catch (err) {
    console.error("popup: mailchimp failed", domain, (err as Error).name);
    return { status: 502, ok: false, error: "Could not sign you up. Try again." };
  }
}

export async function handlePopupSubscribe(
  env: PopupEnv,
  site: PopupSite,
  body: PopupSubscribeBody,
  _meta?: PopupSubscribeMeta
): Promise<PopupResult> {
  const website = typeof body.website === "string" ? body.website : "";
  const t = readT(body);
  if (website.trim() !== "" || t < 1500) {
    return { status: 200, ok: true };
  }

  const email = trimStr(body.email, EMAIL_MAX);
  if (!isValidEmail(email)) {
    return { status: 400, ok: false, error: "Enter a valid email address." };
  }

  const fields = asFields(body.fields);
  const page = trimStr(body.page, FIELD_MAX) || "/";
  const landing = trimStr(body.landing, FIELD_MAX) || page;
  const utm = asUtm(body.utm);
  const gclid = trimStr(body.gclid, FIELD_MAX);

  const status = popupStatus(env, site);
  if (status.backend === "none") {
    return { status: 503, ok: false, error: "Sign-up is not open yet." };
  }
  if (status.backend === "legacy") {
    return postLegacy(env, site, email);
  }
  return putMailchimp(env, site, email, fields, page, landing, utm, gclid);
}
