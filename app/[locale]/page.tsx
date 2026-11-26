import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Ticker } from "@/components/home/Ticker";
import {
  Door,
  EveryDay,
  Faq,
  FinalCta,
  GettingStarted,
  Missing,
  Morning,
  NoTech,
  PayFor,
  Safety,
} from "@/components/home/Sections";
import { FreeTestSection, Pricing, RoiSection } from "@/components/home/Interactive";
import { LeadFlowProvider } from "@/components/forms/LeadFlow";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd, organizationJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return pageMetadata({ locale, path: "/", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tMeta = await getTranslations("home.meta");
  const tFaq = await getTranslations("faq.home");

  return (
    <LeadFlowProvider>
      <Header variant="home" />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Ticker />
        <Missing />
        <Morning />
        <FreeTestSection />
        <EveryDay />
        <Door />
        <GettingStarted />
        <NoTech />
        <PayFor />
        <RoiSection />
        <Pricing />
        <Safety />
        <Faq ns="faq.home" />
        <FinalCta />
      </main>
      <Footer variant="home" />
      <JsonLd data={organizationJsonLd(tMeta("description"))} />
      <JsonLd data={faqJsonLd(tFaq.raw("items"))} />
    </LeadFlowProvider>
  );
}
