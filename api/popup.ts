import {
  handlePopupSubscribe,
  popupStatus,
  type PopupSubscribeBody,
} from "../popup-kit/server/subscribe-core.js";

const SITE = "ffla" as const;
const LANE = "ffla-managed";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 10;
const hits = new Map<string, number[]>();

function json(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function limited(ip: string): boolean {
  const now = Date.now();
  const prev = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (prev.length >= MAX_HITS) {
    hits.set(ip, prev);
    return true;
  }
  prev.push(now);
  hits.set(ip, prev);
  return false;
}

export async function GET(): Promise<Response> {
  const status = popupStatus(process.env, SITE);
  return json(200, {
    ok: true,
    enabled: status.enabled,
    backend: status.backend,
    lane: LANE,
    site: SITE,
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const ip = clientIp(request);
    if (limited(ip)) {
      return json(429, { ok: false, error: "Too many attempts. Try again later." });
    }

    let body: PopupSubscribeBody;
    try {
      body = (await request.json()) as PopupSubscribeBody;
    } catch {
      return json(400, { ok: false, error: "Invalid request." });
    }

    const result = await handlePopupSubscribe(process.env, SITE, body, { ip });
    const payload: Record<string, unknown> = { ok: result.ok };
    if (result.error) payload.error = result.error;
    if (result.needs_activation) payload.needs_activation = true;
    return json(result.status, payload);
  } catch (err) {
    console.error("popup: unhandled", (err as Error).name);
    return json(500, { ok: false, error: "Could not sign you up. Try again." });
  }
}
