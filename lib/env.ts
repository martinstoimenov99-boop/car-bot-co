import "server-only";

/** Server-side env helpers. Values live in Vercel env vars, never in the repo. */
export function partnerPortalUrl(): string | undefined {
  const v = process.env.PARTNER_PORTAL_URL?.trim();
  return v && /^https:\/\//.test(v) ? v : undefined;
}
