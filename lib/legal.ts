/**
 * DRAFT: have a lawyer review before launch.
 * Legal placeholders. Fill these in (or set the env vars) before going live. Until then the
 * pages show the {{TOKEN}} so nobody mistakes the draft for final text.
 */
export const LEGAL_PLACEHOLDERS: Record<string, string | undefined> = {
  LEGAL_ENTITY: process.env.LEGAL_ENTITY,
  LEGAL_ADDRESS: process.env.LEGAL_ADDRESS,
  COMPANY_NUMBER: process.env.LEGAL_COMPANY_NUMBER,
  DPO_EMAIL: process.env.LEGAL_DPO_EMAIL,
  CONTACT_EMAIL: process.env.LEGAL_CONTACT_EMAIL,
  AFFILIATE_TOOL: process.env.LEGAL_AFFILIATE_TOOL,
  TAX_NOTE: process.env.LEGAL_TAX_NOTE,
};

export const LEGAL_UPDATED = "2026-11-26";

/** Splits text into plain strings and unresolved {{TOKEN}} parts for highlighting. */
export function fillLegal(text: string): Array<{ text: string; placeholder: boolean }> {
  const out: Array<{ text: string; placeholder: boolean }> = [];
  const re = /\{\{([A-Z_]+)\}\}/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), placeholder: false });
    const value = LEGAL_PLACEHOLDERS[m[1]];
    out.push(value ? { text: value, placeholder: false } : { text: m[0], placeholder: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), placeholder: false });
  return out;
}
