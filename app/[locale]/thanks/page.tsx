import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NumberedCard } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";
import { waLink } from "@/lib/site";

type ThanksType = "test" | "monthly" | "yearly" | "partner";
const TYPES: ThanksType[] = ["test", "monthly", "yearly", "partner"];

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ type?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "thanks.meta" });
  return pageMetadata({
    locale,
    path: "/thanks",
    title: t("title"),
    description: t("description"),
    noindex: true,
  });
}

export default async function ThanksPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const raw = (await searchParams).type;
  const type = TYPES.find((x) => x === (Array.isArray(raw) ? raw[0] : raw));
  const t = await getTranslations("thanks");
  const tc = await getTranslations("common");
  const stepsKey = type === "monthly" || type === "yearly" ? "plan" : (type ?? "default");
  const steps = t.raw(`steps.${stepsKey}`) as { title: string; body: string }[];
  const isPartner = type === "partner";

  return (
    <>
      <Header variant="thanks" />
      <main id="main" tabIndex={-1} className="outline-none" data-thanks-type={type ?? "default"}>
        <section className="bg-[linear-gradient(135deg,#111418_0%,#1A2A1F_100%)]">
          <div className="mx-auto max-w-[860px] px-5 pt-[52px] pb-[52px] text-center sm:px-6 sm:pt-20 sm:pb-[72px]">
            <div className="text-[56px]" aria-hidden="true">
              ✅
            </div>
            <h1 className="h1-sm mt-2 mb-5 leading-[1.05]">{isPartner ? t("titlePartner") : t("title")}</h1>
            <p className="lead text-soft mx-auto mt-0 mb-7 max-w-[620px]" data-testid="thanks-lead">
              {t(`lead.${type ?? "default"}`)}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href={waLink(tc("whatsappHello"))}
                className="btn bg-wa text-on-wa hover:text-on-wa flex-[1_1_100%] px-[26px] py-[17px] text-[17px] sm:flex-none"
              >
                {t("whatsapp")}
              </a>
              <Link
                href={isPartner ? "/partners" : "/"}
                className="btn border-ink text-ink hover:border-accent-hover flex-[1_1_100%] border-2 px-6 py-[15px] text-[17px] sm:flex-none"
              >
                {isPartner ? t("partnerPage") : t("home")}
              </Link>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1100px] px-5 py-[52px] sm:px-6 sm:py-[72px]">
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
            {steps.map((s, i) => (
              <li key={s.title}>
                <NumberedCard n={i + 1} title={s.title} body={s.body} className="bg-raised h-full" />
              </li>
            ))}
          </ol>
          {!isPartner && (
            <div className="rounded-card bg-raised mt-9 flex flex-wrap items-center justify-between gap-4 p-7">
              <div className="flex-[1_1_360px]">
                <h2 className="mt-0 mb-1.5 text-xl font-semibold">{t("promo.title")}</h2>
                <p className="text-muted m-0">{t("promo.body")}</p>
              </div>
              <Link
                href="/partners"
                className="btn bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent px-6 py-[15px]"
              >
                {t("promo.button")}
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer variant="thanks" />
    </>
  );
}
