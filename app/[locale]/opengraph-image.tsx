import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import { OG_SIZE, renderOg } from "@/lib/og";

export const alt = "Car Bot";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return renderOg({ locale, title: t("ogTitle"), sub: t("ogSub") });
}
