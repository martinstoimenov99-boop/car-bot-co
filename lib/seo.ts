import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LOCALES, LOCALE_LABELS, isLocale, type Locale } from "@/i18n/config";
import { SITE_URL } from "./site";

export type RoutePath = "/" | "/partners" | "/thanks" | "/privacy" | "/terms" | "/cookies";

export function localizedUrl(locale: Locale, path: RoutePath) {
  return `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
}

export function alternates(locale: Locale, path: RoutePath): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_LABELS[l].htmlLang] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl("en", path);
  return { canonical: localizedUrl(locale, path), languages };
}

export function pageMetadata(opts: {
  locale: Locale;
  path: RoutePath;
  title: string;
  description: string;
  noindex?: boolean;
}): Metadata {
  const { locale, path, title, description, noindex } = opts;
  // Requests like /favicon.ico or /ads.txt land in [locale]; answer 404, not a crash.
  if (!isLocale(locale)) notFound();
  return {
    title,
    description,
    alternates: alternates(locale, path),
    openGraph: {
      type: "website",
      siteName: "Car Bot",
      title,
      description,
      url: localizedUrl(locale, path),
      locale: LOCALE_LABELS[locale].og,
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => LOCALE_LABELS[l].og),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
