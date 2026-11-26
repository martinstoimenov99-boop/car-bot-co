import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Eyebrow, NumberedCard } from "@/components/ui/Section";
import { Faq } from "@/components/home/Sections";
import { PartnerCalculator } from "@/components/partners/PartnerCalculator";
import { PartnerForm } from "@/components/partners/PartnerForm";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };
type TitleBody = { title: string; body: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partners.meta" });
  return pageMetadata({ locale, path: "/partners", title: t("title"), description: t("description") });
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("partners");
  const tFaq = await getTranslations("faq.partners");
  const stats = t.raw("hero.stats") as { value: string; label: string }[];
  const earnCards = t.raw("earn.cards") as (TitleBody & { value: string; suffix?: string })[];
  const steps = t.raw("how.steps") as TitleBody[];
  const kit = t.raw("kit.cards") as TitleBody[];

  return (
    <>
      <Header variant="partners" />
      <main id="main" tabIndex={-1} className="outline-none">
        <section className="bg-[linear-gradient(135deg,#111418_0%,#2A1708_100%)]">
          <div className="mx-auto max-w-[1000px] px-5 pt-[52px] pb-[52px] sm:px-6 sm:pt-[72px] sm:pb-[88px]">
            <p className="eyebrow text-accent mb-4 sm:text-[15px]">{t("hero.eyebrow")}</p>
            <h1 className="h1-sm mt-0 mb-6">{t("hero.title")}</h1>
            <p className="lead text-soft mt-0 mb-8 max-w-[700px]">{t("hero.lead")}</p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#apply"
                className="btn bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent flex-[1_1_100%] px-[26px] py-[17px] text-[17px] sm:flex-none"
              >
                {t("hero.ctaPrimary")}
              </a>
              <a
                href="#calc"
                className="btn border-ink text-ink hover:border-accent-hover flex-[1_1_100%] border-2 px-6 py-[15px] text-[17px] sm:flex-none"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
            <dl className="mt-10 flex flex-wrap gap-9">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="text-muted text-sm">{s.label}</dt>
                  <dd className="font-display m-0 text-[34px] font-extrabold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section id="earn" className="section-y-sm container-x">
          <Eyebrow>{t("earn.eyebrow")}</Eyebrow>
          <h2 className="h2-sm mt-0 mb-3.5 max-w-[820px]">{t("earn.title")}</h2>
          <p className="text-muted mt-0 mb-9 max-w-[760px] text-[19px]">{t("earn.lead")}</p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
            {earnCards.map((c, i) => {
              const hl = i === earnCards.length - 1;
              return (
                <li
                  key={c.title}
                  className={`lift rounded-card p-7 ${hl ? "bg-accent text-on-accent" : "bg-raised"}`}
                >
                  <div className={`font-display text-[44px] font-extrabold ${hl ? "" : "text-accent"}`}>
                    {c.value}
                    {c.suffix && <span className="text-lg">{c.suffix}</span>}
                  </div>
                  <h3 className="my-1.5 text-[19px] font-semibold">{c.title}</h3>
                  <p className={`m-0 ${hl ? "" : "text-muted"}`}>{c.body}</p>
                </li>
              );
            })}
          </ul>
          <p className="text-slate mt-5 mb-0 text-sm">{t("earn.note")}</p>
        </section>

        <section className="section-y-sm bg-cream text-cream-ink px-5 sm:px-6">
          <div className="mx-auto max-w-[1100px]">
            <h2 className="h2-sm mt-0 mb-3.5">{t("split.title")}</h2>
            <p className="text-cream-muted mt-0 mb-8 max-w-[740px] text-[19px]">{t("split.lead")}</p>
            <div className="flex flex-wrap gap-5">
              <div className="rounded-card flex-[1_1_380px] bg-white p-[30px]">
                <h3 className="font-display mt-0 mb-3 text-[26px] font-extrabold">{t("split.yourTitle")}</h3>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[17px]">
                  {(t.raw("split.yourItems") as string[]).map((it) => (
                    <li key={it}>
                      <span aria-hidden="true">✓ </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-card bg-page text-ink flex-[1_1_380px] p-[30px]">
                <h3 className="font-display text-accent mt-0 mb-3 text-[26px] font-extrabold">
                  {t("split.ourTitle")}
                </h3>
                <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[17px]">
                  {(t.raw("split.ourItems") as string[]).map((it) => (
                    <li key={it}>
                      <span aria-hidden="true">✓ </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section-y-sm container-x">
          <Eyebrow>{t("how.eyebrow")}</Eyebrow>
          <h2 className="h2-sm mt-0 mb-9 max-w-[820px]">{t("how.title")}</h2>
          <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
            {steps.map((s, i) => (
              <li key={s.title}>
                <NumberedCard n={i + 1} title={s.title} body={s.body} className="bg-raised h-full" />
              </li>
            ))}
          </ol>
        </section>

        <section id="calc" className="section-y-sm bg-raised px-5 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <Eyebrow>{t("calc.eyebrow")}</Eyebrow>
            <h2 className="h2-sm mt-0 mb-3.5 max-w-[820px]">{t("calc.title")}</h2>
            <p className="text-muted mt-0 mb-9 max-w-[740px] text-[19px]">{t("calc.lead")}</p>
            <PartnerCalculator />
          </div>
        </section>

        <section className="section-y-sm container-x">
          <h2 className="h2-sm mt-0 mb-3.5 max-w-[820px]">{t("kit.title")}</h2>
          <p className="text-muted mt-0 mb-8 max-w-[740px] text-[19px]">{t("kit.lead")}</p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-4 p-0">
            {kit.map((c) => (
              <li key={c.title} className="bg-raised rounded-[18px] p-[22px]">
                <h3 className="m-0 text-base font-bold">{c.title}</h3>
                <p className="text-muted mt-2 mb-0">{c.body}</p>
              </li>
            ))}
          </ul>
          <p className="text-fine mt-6 mb-0 max-w-[820px] text-[15px]">{t("kit.honesty")}</p>
        </section>

        <section id="apply" className="section-y-sm bg-cream text-cream-ink px-5 sm:px-6">
          <div className="mx-auto max-w-[640px]">
            <h2 className="h2-sm mt-0 mb-3">{t("apply.title")}</h2>
            <p className="text-cream-muted mt-0 mb-6 text-lg">{t("apply.lead")}</p>
            <PartnerForm />
          </div>
        </section>

        <Faq ns="faq.partners" />
      </main>
      <Footer variant="partners" />
      <JsonLd data={faqJsonLd(tFaq.raw("items"))} />
    </>
  );
}
