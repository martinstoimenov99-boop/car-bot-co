// DRAFT: have a lawyer review before launch.
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { LegalPage } from "@/components/legal/LegalPage";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  return pageMetadata({ locale, path: "/terms", title: t("metaTitle"), description: t("metaDescription") });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage doc="terms" />;
}
