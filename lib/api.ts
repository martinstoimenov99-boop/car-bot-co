import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { clientIp, rateLimit } from "./rate-limit";

const MAX_BODY_BYTES = 16 * 1024;

export const json = (body: unknown, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

/**
 * Shared guard for form endpoints: body size, JSON parsing, honeypot, rate limit.
 * Returns either the parsed body or a response to send as-is.
 */
export async function guardForm(
  req: NextRequest,
  route: string,
): Promise<{ body: unknown } | { response: NextResponse }> {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) return { response: json({ ok: false, error: "too_large" }, 413) };
  let body: unknown;
  try {
    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) return { response: json({ ok: false, error: "too_large" }, 413) };
    body = JSON.parse(raw);
  } catch {
    return { response: json({ ok: false, error: "invalid" }, 400) };
  }
  // Honeypot: pretend everything went fine and drop it.
  const website = (body as { website?: unknown } | null)?.website;
  if (typeof website === "string" && website.trim()) return { response: json({ ok: true }) };

  const { ok } = await rateLimit(route, clientIp(req.headers));
  if (!ok) return { response: json({ ok: false, error: "rate_limited" }, 429) };
  return { body };
}
