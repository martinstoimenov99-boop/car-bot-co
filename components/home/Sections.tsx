import { getTranslations } from "next-intl/server";
import { Photo } from "@/components/ui/Photo";
import { Eyebrow, NumberedCard } from "@/components/ui/Section";
import { waLink } from "@/lib/site";

type TitleBody = { title: string; body: string };

const photoSizes = "(min-width: 1200px) 560px, (min-width: 641px) 50vw, 100vw";
const sidePhoto = "h-[250px] w-full min-w-0 flex-[1_1_420px] rounded-[20px] sm:h-[440px]";

export async function Missing() {
  const t = await getTranslations("home.missing");
  return (
    <section className="section-y bg-cream text-cream-ink px-5 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14">
        <Photo name="busy-dealer.jpg" alt={t("imageAlt")} sizes={photoSizes} className={sidePhoto} />
        <div className="min-w-0 flex-[1_1_480px]">
          <Eyebrow tone="cream">{t("eyebrow")}</Eyebrow>
          <h2 className="h2 mt-0 mb-[22px]">{t("title")}</h2>
          <p className="mt-0 mb-4 text-[19px]">{t("p1")}</p>
          <p className="mt-0 mb-4 text-[19px]">{t("p2")}</p>
          <p className="m-0 text-[19px] font-semibold">{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}

type MorningCard = { time: string; title: string; body: string; quote?: string; quoteLang?: string };

export async function Morning() {
  const t = await getTranslations("home.morning");
  const cards = t.raw("cards") as MorningCard[];
  return (
    <section id="how" className="section-y container-x">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="h2 mt-0 mb-3.5 max-w-[820px]">{t("title")}</h2>
      <p className="text-muted mt-0 mb-11 max-w-[720px] text-[19px]">{t("lead")}</p>
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5 p-0">
        {cards.map((c, i) => {
          const last = i === cards.length - 1;
          return (
            <li
              key={c.time}
              className={`rounded-card flex flex-col gap-3.5 p-7 ${last ? "bg-accent text-on-accent" : "bg-raised"}`}
            >
              <div className={`font-display text-4xl font-extrabold ${last ? "" : "text-accent"}`}>
                <time>{c.time}</time>
              </div>
              <h3 className="m-0 text-xl font-semibold">{c.title}</h3>
              {c.quote && (
                <div lang={c.quoteLang} className="bg-chat text-soft rounded-[14px] p-3 text-[13.5px]">
                  {c.quote}
                </div>
              )}
              <p className={`m-0 ${last ? "" : "text-muted"}`}>{c.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

const everyDayIcons = [
  <g key="search">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </g>,
  <path key="chat" d="M4 4h16v12H8l-4 4z" />,
  <g key="bell">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </g>,
  <path key="check" d="M3 12l6 6L21 6" />,
  <path key="euro" d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
];

export async function EveryDay() {
  const t = await getTranslations("home.everyDay");
  const items = t.raw("items") as TitleBody[];
  return (
    <section className="section-y bg-raised px-5 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-14">
        <div className="min-w-0 flex-[1_1_480px]">
          {/* TODO(Martin): keep the marketplace list and "20+" true. */}
          <h2 className="h2 mt-0 mb-7">{t("title")}</h2>
          <ul className="m-0 flex list-none flex-col gap-[22px] p-0 text-lg">
            {items.map((it, i) => (
              <li key={it.title} className="flex gap-4">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#F08A3C"
                  strokeWidth="2"
                  aria-hidden="true"
                  className="shrink-0"
                >
                  {everyDayIcons[i % everyDayIcons.length]}
                </svg>
                <div>
                  <b>{it.title}</b> {it.body}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <Photo
          name="nightstand-phone.jpg"
          alt={t("imageAlt")}
          sizes={photoSizes}
          className="h-[250px] w-full min-w-0 flex-[1_1_400px] rounded-[20px] sm:h-[480px]"
        />
      </div>
    </section>
  );
}

export async function Door() {
  const t = await getTranslations("home.door");
  const tasks = t.raw("tasks") as string[];
  return (
    <section className="section-y bg-cream text-cream-ink px-5 sm:px-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap-reverse items-center gap-14">
        <Photo
          name="handshake.jpg"
          alt={t("imageAlt")}
          sizes={photoSizes}
          objectPosition="50% 35%"
          className={sidePhoto}
        />
        <div className="min-w-0 flex-[1_1_480px]">
          <h2 className="h2 mt-0 mb-[22px]">{t("title")}</h2>
          <p className="mt-0 mb-5 text-[19px]">{t("lead")}</p>
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 text-[17px] font-semibold">
            {tasks.map((task) => (
              <li key={task} className="rounded-[14px] bg-white p-4">
                {task}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export async function GettingStarted() {
  const t = await getTranslations("home.start");
  const steps = t.raw("steps") as TitleBody[];
  return (
    <section className="section-y bg-raised px-5 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="h2 mt-0 mb-3.5 max-w-[820px]">{t("title")}</h2>
        <p className="text-muted mt-0 mb-10 max-w-[760px] text-[19px]">{t("lead")}</p>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5 p-0">
          {steps.map((s, i) => (
            <li key={s.title}>
              <NumberedCard n={i + 1} title={s.title} body={s.body} className="bg-page h-full" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export async function NoTech() {
  const t = await getTranslations("home.noTech");
  const items = t.raw("items") as string[];
  return (
    <section className="section-y container-x flex flex-wrap items-center gap-14">
      <div className="min-w-0 flex-[1_1_480px]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="h2 mt-0 mb-[22px]">{t("title")}</h2>
        <ul className="text-soft m-0 flex list-none flex-col gap-3.5 p-0 text-lg">
          {items.map((it) => (
            <li key={it}>
              <span aria-hidden="true">✓ </span>
              {it}
            </li>
          ))}
        </ul>
      </div>
      <Photo
        name="dealer-on-call.jpg"
        alt={t("imageAlt")}
        sizes={photoSizes}
        objectPosition="30% 40%"
        className={sidePhoto}
      />
    </section>
  );
}

export async function PayFor() {
  const t = await getTranslations("home.payFor");
  const cards = t.raw("cards") as TitleBody[];
  return (
    <section className="section-y bg-raised px-5 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="h2 mt-0 mb-3.5 max-w-[820px]">{t("title")}</h2>
        <p className="text-muted mt-0 mb-10 max-w-[760px] text-[19px]">{t("lead")}</p>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-5 p-0">
          {cards.map((c) => (
            <li key={c.title} className="lift rounded-card bg-page p-[26px]">
              <h3 className="mt-0 mb-2 text-[19px] font-semibold">{c.title}</h3>
              <p className="text-muted m-0">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Safety() {
  const t = await getTranslations("home.safety");
  const cards = t.raw("cards") as TitleBody[];
  return (
    <section className="section-y bg-raised px-5 sm:px-6">
      <div className="mx-auto max-w-[1000px]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="h2 mt-0 mb-5">{t("title")}</h2>
        <p className="text-soft mt-0 mb-7 text-[19px]">{t("lead")}</p>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))] gap-4 p-0">
          {cards.map((c) => (
            <li key={c.title} className="bg-page rounded-[18px] p-[22px]">
              <h3 className="m-0 text-base font-bold">{c.title}</h3>
              <p className="text-muted mt-2 mb-0">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export async function Faq({ ns, id = "faq" }: { ns: "faq.home" | "faq.partners"; id?: string }) {
  const t = await getTranslations(ns);
  const items = t.raw("items") as { q: string; a: string }[];
  return (
    <section id={id} className="section-y mx-auto flex max-w-[820px] flex-col gap-3 px-5 sm:px-6">
      <h2 className={`${ns === "faq.home" ? "h2" : "h2-sm"} mt-0 mb-4`}>{t("title")}</h2>
      {items.map((it) => (
        <details key={it.q} className="group bg-raised rounded-[14px] px-5 py-[18px]">
          <summary className="flex items-start justify-between gap-4 text-lg font-semibold">
            <span>{it.q}</span>
            <span
              aria-hidden="true"
              className="text-accent mt-0.5 shrink-0 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="text-soft mt-2.5 mb-0">{it.a}</p>
        </details>
      ))}
    </section>
  );
}

export async function FinalCta() {
  const t = await getTranslations("home.finalCta");
  return (
    <section className="relative overflow-hidden">
      <Photo cover name="transporter-dawn.jpg" alt={t("imageAlt")} sizes="100vw" />
      <div className="absolute inset-0 bg-[rgba(17,20,24,.66)]" />
      <div className="relative mx-auto max-w-[820px] px-5 py-[72px] text-center sm:px-6 sm:py-[120px]">
        <h2 className="h2 mt-0 mb-[18px]">{t("title")}</h2>
        <p className="text-soft mt-0 mb-8 text-[19px]">{t("lead")}</p>
        <a
          href={waLink(t("waText"))}
          className="btn bg-wa text-on-wa hover:text-on-wa px-8 py-[19px] text-[19px] hover:bg-[#4be083]"
        >
          {t("button")}
        </a>
      </div>
    </section>
  );
}
