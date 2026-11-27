/**
 * Details shown on the legal pages. The {{TOKENS}} in messages/*.json (legal.*) are replaced with
 * the values below, so changing a detail here updates English and Macedonian at once.
 * DRAFT: have a lawyer review the legal pages before launch.
 */
export const LEGAL_DETAILS: Record<string, string> = {
  LEGAL_ENTITY: "Smartin Labs",
  DPO_EMAIL: "info@getcarbot.co",
  CONTACT_EMAIL: "info@getcarbot.co",
};

export const LEGAL_UPDATED = "2026-11-27";

/** Splits text into plain strings and unresolved {{TOKEN}} parts (shown highlighted so a gap is obvious). */
export function fillLegal(text: string): Array<{ text: string; placeholder: boolean }> {
  const out: Array<{ text: string; placeholder: boolean }> = [];
  const re = /\{\{([A-Z_]+)\}\}/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), placeholder: false });
    const value = LEGAL_DETAILS[m[1]];
    out.push(value ? { text: value, placeholder: false } : { text: m[0], placeholder: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), placeholder: false });
  return out;
}
