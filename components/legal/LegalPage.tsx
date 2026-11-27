// DRAFT: have a lawyer review before launch. Copy lives in messages/*.json → legal.*
import { getFormatter, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LEGAL_UPDATED, fillLegal } from "@/lib/legal";

function Filled({ text }: { text: string }) {
  return (
    <>
      {fillLegal(text).map((part, i) =>
        part.placeholder ? (
          <mark key={i} className="bg-accent/20 text-accent-hover rounded px-1">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export async function LegalPage({ doc }: { doc: "privacy" | "terms" | "cookies" }) {
  const t = await getTranslations("legal");
  const format = await getFormatter();
  const sections = t.raw(`${doc}.sections`) as { title: string; body: string[] }[];
  return (
    <>
      <Header variant="home" />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto max-w-[820px] px-5 py-14 outline-none sm:px-6 sm:py-20"
      >
        <h1 className="h2 mt-0 mb-3">{t(`${doc}.title`)}</h1>
        <p className="text-slate mt-0 mb-8 text-sm">
          {t("updated", { date: format.dateTime(new Date(LEGAL_UPDATED), { dateStyle: "long" }) })}
        </p>
        <p className="text-soft mt-0 mb-10 text-lg">
          <Filled text={t.raw(`${doc}.intro`) as string} />
        </p>
        {sections.map((s) => (
          <section key={s.title} className="mb-9">
            <h2 className="font-display mt-0 mb-3 text-2xl font-extrabold">{s.title}</h2>
            {s.body.map((para, i) => (
              <p key={i} className="text-soft mt-0 mb-3">
                <Filled text={para} />
              </p>
            ))}
          </section>
        ))}
      </main>
      <Footer variant="legal" />
    </>
  );
}
