import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { alternates, localizedUrl, type RoutePath } from "@/lib/seo";

const ROUTES: { path: RoutePath; priority: number }[] = [
  { path: "/", priority: 1 },
  { path: "/partners", priority: 0.8 },
  { path: "/privacy", priority: 0.2 },
  { path: "/terms", priority: 0.2 },
  { path: "/cookies", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap(({ path, priority }) =>
    LOCALES.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency: "monthly" as const,
      priority,
      alternates: { languages: alternates(locale, path)!.languages as Record<string, string> },
    })),
  );
}
