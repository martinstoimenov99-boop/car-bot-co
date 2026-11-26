import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { LOCALE_LABELS } from "@/i18n/config";
import { pickMessages } from "@/i18n/messages";
import { SITE_URL } from "@/lib/site";
import { fontVariables } from "../fonts";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { RefCapture } from "@/components/layout/RefCapture";

/** Only these namespaces are shipped to the browser. */
const CLIENT_MESSAGES = [
  "common",
  "forms",
  "home.freeTest",
  "home.roi",
  "home.pricing",
  "partners.calc",
  "partners.apply",
];

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Car Bot",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111418",
  colorScheme: "dark",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("common");

  return (
    <html lang={LOCALE_LABELS[locale].htmlLang} className={fontVariables}>
      <body className="bg-page text-ink font-sans">
        <a
          href="#main"
          className="focus:bg-accent focus:text-on-accent sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-full focus:px-4 focus:py-2 focus:font-bold"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider messages={pickMessages(messages, CLIENT_MESSAGES)}>
          {children}
          <CookieBanner />
          <RefCapture />
        </NextIntlClientProvider>
        {/* Cookieless. The scripts are served by Vercel, so they are only mounted there. */}
        {process.env.VERCEL && <Analytics />}
        {process.env.VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}
