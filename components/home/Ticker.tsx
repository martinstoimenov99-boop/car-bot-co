import { getTranslations } from "next-intl/server";

/** Illustrative marquee. The "Example activity" label must always stay visible: this is never live data. */
export async function Ticker() {
  const t = await getTranslations("home.ticker");
  const items = t.raw("items") as string[];
  const row = (hidden: boolean) =>
    items.map((item, i) => (
      <li
        key={`${hidden ? "b" : "a"}${i}`}
        aria-hidden={hidden || undefined}
        className="text-soft inline-flex items-center gap-2 px-7 text-[15px] whitespace-nowrap"
      >
        <span className="bg-wa size-2 rounded-full" aria-hidden="true" />
        {item}
      </li>
    ));
  return (
    <section
      aria-label={t("label")}
      data-testid="ticker"
      className="bg-ticker relative overflow-hidden border-y border-[#20262E]"
    >
      <div className="bg-ticker text-accent absolute inset-y-0 left-0 z-[2] flex items-center px-4 text-xs font-bold tracking-[.08em] uppercase shadow-[12px_0_16px_#0B0D10]">
        {t("label")}
      </div>
      <p className="sr-only">{t("srNote")}</p>
      <ul className="marquee m-0 list-none py-4 pr-0 pl-[150px]">
        {row(false)}
        {row(true)}
      </ul>
    </section>
  );
}
