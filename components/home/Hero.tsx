import { getTranslations } from "next-intl/server";
import { Photo } from "@/components/ui/Photo";

function Bubble({
  className,
  children,
  time,
  out,
}: {
  className: string;
  children: React.ReactNode;
  time?: string;
  out?: boolean;
}) {
  return (
    <div
      className={
        out
          ? `${className} bg-bubble-out max-w-[80%] self-end rounded-[14px_4px_14px_14px] px-3 py-2.5`
          : `${className} bg-bubble max-w-[88%] self-start rounded-[4px_14px_14px_14px] px-3 py-2.5`
      }
    >
      {children}
      {time && (
        <div className={`mt-1 text-right text-[11px] ${out ? "text-tick" : "text-slate"}`}>{time}</div>
      )}
    </div>
  );
}

function Typing({ className, label, alt }: { className: string; label: string; alt?: boolean }) {
  return (
    <div
      className={`${className} typing max-w-[88%] self-start rounded-[4px_14px_14px_14px] px-3.5 py-3 ${alt ? "bg-bubble-alt" : "bg-bubble"}`}
    >
      <span className="dots">
        <i />
        <i />
        <i />
      </span>{" "}
      <span className="text-slate text-xs">{label}</span>
    </div>
  );
}

export async function HeroPhone() {
  const t = await getTranslations("home.phone");
  return (
    <div className="float mx-auto w-full max-w-[330px] flex-[0_1_330px]">
      <div
        role="img"
        aria-label={t("label")}
        className="rounded-phone bg-phone p-3 shadow-[0_30px_80px_rgba(0,0,0,.55)]"
      >
        <div className="bg-chat flex min-h-[540px] flex-col gap-2.5 rounded-[34px] px-3.5 pt-[18px] pb-[22px] text-[13.5px]">
          <div className="flex items-center gap-2.5 border-b border-[#22303A] pb-2.5">
            <div className="bg-accent size-[34px] rounded-full" />
            <div>
              <div className="font-semibold">{t("name")}</div>
              <div className="text-slate text-[11px]">{t("status")}</div>
            </div>
          </div>
          <Bubble className="cb1" time="07:02">
            {t("b1")}
          </Bubble>
          <Typing className="ct1" label={t("t1")} />
          <Bubble className="cb2" time="07:03">
            {t("b2")}
          </Bubble>
          <Typing className="ct2" label={t("t2")} alt />
          <Bubble className="cb3" time="07:26">
            <b className="text-accent">{t("b3Label")}</b> <span lang="de">{t("b3Quote")}</span>
          </Bubble>
          <Bubble className="cb4">{t("b4")}</Bubble>
          <Bubble className="cb5" time="07:27 ✓✓" out>
            {t("b5")}
          </Bubble>
        </div>
      </div>
    </div>
  );
}

export async function Hero() {
  const t = await getTranslations("home.hero");
  const stats = t.raw("stats") as { value: string; label: string }[];
  return (
    <section className="relative overflow-hidden">
      <Photo
        cover
        preload
        name="hero-night-passat.jpg"
        alt={t("imageAlt")}
        sizes="100vw"
        objectPosition="60% 50%"
      />
      <div className="absolute inset-0 bg-[rgba(17,20,24,.86)] sm:bg-[linear-gradient(90deg,rgba(17,20,24,.92)_0%,rgba(17,20,24,.7)_50%,rgba(17,20,24,.35)_100%)]" />
      <div className="relative mx-auto flex max-w-[1200px] flex-wrap items-center gap-8 px-5 pt-9 pb-[52px] sm:gap-14 sm:px-6 sm:pt-[72px] sm:pb-24">
        <div className="min-w-0 flex-[1_1_520px]">
          <p className="eyebrow text-accent mb-4 sm:text-[15px]">{t("eyebrow")}</p>
          <h1 className="h1 mt-0 mb-6">{t("title")}</h1>
          <p className="lead text-soft mt-0 mb-6 max-w-[580px] sm:mb-8">{t("lead")}</p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#try"
              className="btn bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent flex-[1_1_100%] px-[26px] py-[17px] text-[17px] sm:flex-none"
            >
              {t("ctaPrimary")}
            </a>
            <a
              href="#how"
              className="btn border-ink text-ink hover:border-accent-hover flex-[1_1_100%] border-2 px-6 py-[15px] text-[17px] sm:flex-none"
            >
              {t("ctaSecondary")}
            </a>
          </div>
          {/* TODO(Martin): "20+ marketplaces" must stay true. Update here and in messages if the list shrinks. */}
          <dl className="mt-7 flex flex-wrap gap-5 sm:mt-11 sm:gap-9">
            {stats.map((s) => (
              <div key={s.value} className="flex flex-col-reverse">
                <dt className="text-muted text-sm">{s.label}</dt>
                <dd className="font-display m-0 text-[34px] font-extrabold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <HeroPhone />
      </div>
    </section>
  );
}
