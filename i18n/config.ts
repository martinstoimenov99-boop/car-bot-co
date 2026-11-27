/**
 * Locale list. To add a language (e.g. Serbian or Albanian):
 *   1. copy messages/en.json to messages/sr.json and translate it,
 *   2. add the code here and a label in LOCALE_LABELS,
 *   3. run `pnpm i18n:check`.
 */
export const LOCALES = ["en", "mk", "sq", "sr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, { short: string; long: string; htmlLang: string; og: string }> = {
  en: { short: "EN", long: "English", htmlLang: "en", og: "en_US" },
  mk: { short: "МК", long: "Македонски", htmlLang: "mk", og: "mk_MK" },
  sq: { short: "SQ", long: "Shqip", htmlLang: "sq", og: "sq_AL" },
  // Serbian in Latin script (ekavian). Cyrillic would be a separate locale later (see docs/LANGUAGES.md).
  sr: { short: "SR", long: "Srpski", htmlLang: "sr-Latn", og: "sr_RS" },
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
