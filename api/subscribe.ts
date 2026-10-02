const OS_TIMEOUT_MS = 8000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(
  status: number,
  payload: { ok: boolean; error?: string; needs_activation?: boolean },
) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

async function postOsSubscribe(email: string, source: string) {
  const osUrl = process.env.CORIOLIS_OS_URL?.trim().replace(/\/$/, "");
  const secret = process.env.FORM_INTAKE_SECRET?.trim();
  if (!osUrl || !secret) {
    console.error("subscribe: CORIOLIS_OS_URL / FORM_INTAKE_SECRET not set");
    return { ok: false, error: "Subscribe is not configured yet." };
  }
  try {
    const res = await fetch(`${osUrl}/api/forms/subscribe`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${secret}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, source }),
      signal: AbortSignal.timeout(OS_TIMEOUT_MS),
    });
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        needs_activation?: boolean;
      };
      return { ok: true, needs_activation: !!data.needs_activation };
    }
    const detail = await res.text();
    console.error("subscribe: OS rejected", res.status, detail.slice(0, 240));
    if (res.status === 400) return { ok: false, error: "Enter a valid email address." };
    if (res.status === 502)
      return { ok: false, error: "Could not send confirmation email. Try again." };
    return { ok: false, error: "Could not subscribe. Try again." };
  } catch (err) {
    console.error("subscribe: OS failed", err);
    return { ok: false, error: "Could not subscribe. Try again." };
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    let body: { email?: unknown; source?: unknown };
    try {
      body = (await request.json()) as { email?: unknown; source?: unknown };
    } catch {
      return json(400, { ok: false, error: "Invalid request." });
    }
    const email = String(body.email ?? "").trim();
    const source = String(body.source ?? "popup_fflaccelerator").trim().slice(0, 40);
    if (!email || !EMAIL_RE.test(email)) {
      return json(400, { ok: false, error: "Enter a valid email address." });
    }
    const result = await postOsSubscribe(email, source || "popup_fflaccelerator");
    return json(result.ok ? 200 : 502, result);
  } catch (err) {
    console.error("subscribe: unhandled", err);
    return json(500, { ok: false, error: "Could not subscribe. Try again." });
  }
}
