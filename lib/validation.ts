/** Client-safe validation helpers (no zod, so nothing heavy ships to the browser). */

export const MOBILE_DE_RE = /^https?:\/\/([a-z0-9-]+\.)*mobile\.de\//i;
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const MAX_SEARCHES = 3;
export const LIMITS = { name: 80, email: 254, phone: 20, url: 2000, country: 80, code: 32 } as const;

export type SearchError = "empty" | "tooMany" | "notMobile";

/** Splits the textarea into non-empty trimmed rows and checks them against the free-test rules. */
export function parseSearches(text: string): { lines: string[]; error: SearchError | null } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return { lines, error: "empty" };
  if (lines.length > MAX_SEARCHES) return { lines, error: "tooMany" };
  if (!lines.every((l) => MOBILE_DE_RE.test(l) && l.length <= LIMITS.url))
    return { lines, error: "notMobile" };
  return { lines, error: null };
}

export const phoneDigits = (v: string) => v.replace(/\D/g, "");

export type ContactError = "name" | "email" | "phone" | "consent";

/** Client-side check in the same order as the design; the server re-validates with zod. */
export function checkContact(v: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
}): ContactError | null {
  if (!v.firstName.trim() || !v.lastName.trim()) return "name";
  if (!EMAIL_RE.test(v.email.trim()) || v.email.trim().length > LIMITS.email) return "email";
  if (phoneDigits(v.phone).length < 7 || v.phone.trim().length > LIMITS.phone) return "phone";
  if (!v.consent) return "consent";
  return null;
}

export const PARTNER_HOW = ["calls", "social", "community", "network", "other"] as const;
