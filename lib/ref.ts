/**
 * Affiliate (partner) referral helpers. Pure functions, shared by the proxy, the browser and the API.
 * Cookie value format: `CODE~<epoch ms of first click>`.
 */
export const REF_COOKIE = "cb_ref";
export const CONSENT_COOKIE = "cb_consent";
export const REF_STORAGE_KEY = "cb_ref";
export const REF_PENDING_KEY = "cb_ref_pending";
export const REF_RE = /^[A-Za-z0-9_-]{2,32}$/;
export const REF_MAX_AGE_S = 60 * 60 * 24 * 90; // 90 days
export const REF_REPLACE_AFTER_MS = 1000 * 60 * 60 * 24 * 30; // a newer click wins once the stored one is >30 days old

export type ConsentValue = "accepted" | "essential";

export function isValidRef(value: unknown): value is string {
  return typeof value === "string" && REF_RE.test(value);
}

export function refFromSearchParams(params: URLSearchParams): string | null {
  const raw = params.get("ref") ?? params.get("partner");
  const v = raw?.trim();
  return isValidRef(v) ? v : null;
}

export function encodeRef(code: string, ts: number) {
  return `${code}~${ts}`;
}

export function parseRef(value: string | undefined | null): { code: string; ts: number } | null {
  if (!value) return null;
  let raw = value;
  try {
    raw = decodeURIComponent(value);
  } catch {
    return null;
  }
  const [code, tsRaw] = raw.split("~");
  if (!isValidRef(code)) return null;
  const ts = Number(tsRaw);
  return { code, ts: Number.isFinite(ts) && ts > 0 ? ts : 0 };
}

/**
 * Returns the cookie value to store for an incoming ref, or null to keep the existing one.
 * First click wins, unless the stored click is older than 30 days.
 */
export function nextRefValue(
  existing: string | undefined | null,
  incoming: string,
  now: number,
): string | null {
  if (!isValidRef(incoming)) return null;
  const current = parseRef(existing);
  if (!current) return encodeRef(incoming, now);
  if (current.code === incoming) return null;
  if (now - current.ts > REF_REPLACE_AFTER_MS) return encodeRef(incoming, now);
  return null;
}
