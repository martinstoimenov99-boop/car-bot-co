import type { Locale } from "@/i18n/config";

/**
 * Euro amounts. English: "€3,000". Macedonian: "3.000 €" (dot thousands separator, symbol after),
 * used consistently across every Macedonian string. Negative numbers use a real minus sign.
 */
export function formatEuro(amount: number, locale: Locale | string = "en", opts: { sign?: boolean } = {}) {
  const n = Math.round(Math.abs(amount));
  const sep = locale === "mk" ? "." : ",";
  const digits = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  const body = locale === "mk" ? `${digits} €` : `€${digits}`;
  if (amount < 0) return `−${body}`;
  if (opts.sign) return `+${body}`;
  return body;
}
