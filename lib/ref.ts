/**
 * Partner referral code. A partner link looks like https://getcarbot.co/en?ref=CODE (or ?partner=CODE).
 * The code is kept only in the visitor's browser tab (sessionStorage) so it can be attached to a form
 * they submit during that visit. No cookie is set.
 */
export const REF_RE = /^[A-Za-z0-9_-]{2,32}$/;
export const REF_STORAGE_KEY = "cb_ref";

export function isValidRef(value: unknown): value is string {
  return typeof value === "string" && REF_RE.test(value);
}

export function refFromSearchParams(params: URLSearchParams): string | null {
  const raw = params.get("ref") ?? params.get("partner");
  const v = raw?.trim();
  return isValidRef(v) ? v : null;
}
