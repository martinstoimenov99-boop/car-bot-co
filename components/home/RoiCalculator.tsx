"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { roi, type Plan } from "@/lib/calc";
import { formatEuro } from "@/lib/format";
import { cn } from "@/lib/cn";

export function RoiCalculator() {
  const t = useTranslations("home.roi");
  const locale = useLocale();
  const id = useId().replace(/:/g, "");
  const [extra, setExtra] = useState(1);
  const [margin, setMargin] = useState(1500);
  const [plan, setPlan] = useState<Plan>("yearly");
  const r = roi({ extra, margin, plan });
  const eur = (n: number) => formatEuro(n, locale);
  const extraLabel = t("extraValue", { count: extra });

  const toggle = (active: boolean) =>
    cn(
      "btn border-2 px-4 py-3 text-[15px]",
      active
        ? "border-accent bg-accent text-on-accent"
        : "border-[#3A424D] bg-transparent text-ink hover:border-ink",
    );

  return (
    <div className="flex flex-wrap items-stretch gap-6" data-testid="roi">
      <div className="bg-raised flex min-w-0 flex-[1_1_440px] flex-col gap-7 rounded-3xl p-6 sm:p-8">
        <div>
          <div className="mb-2.5 flex justify-between gap-3">
            <label htmlFor={`${id}-extra`} className="font-bold">
              {t("extraLabel")}
            </label>
            <span className="text-accent font-bold" aria-hidden="true">
              {extraLabel}
            </span>
          </div>
          <input
            id={`${id}-extra`}
            data-testid="roi-extra"
            type="range"
            min={0}
            max={6}
            step={1}
            value={extra}
            aria-valuetext={extraLabel}
            aria-describedby={`${id}-extra-hint`}
            onChange={(e) => setExtra(Number(e.target.value))}
          />
          <p id={`${id}-extra-hint`} className="text-slate mt-2 mb-0 text-sm">
            {t("extraHint")}
          </p>
        </div>
        <div>
          <div className="mb-2.5 flex justify-between gap-3">
            <label htmlFor={`${id}-margin`} className="font-bold">
              {t("marginLabel")}
            </label>
            <span className="text-accent font-bold" aria-hidden="true">
              {eur(margin)}
            </span>
          </div>
          <input
            id={`${id}-margin`}
            data-testid="roi-margin"
            type="range"
            min={1000}
            max={2500}
            step={100}
            value={margin}
            aria-valuetext={eur(margin)}
            aria-describedby={`${id}-margin-hint`}
            onChange={(e) => setMargin(Number(e.target.value))}
          />
          <p id={`${id}-margin-hint`} className="text-slate mt-2 mb-0 text-sm">
            {t("marginHint")}
          </p>
        </div>
        <fieldset className="m-0 border-0 p-0">
          <legend className="mb-2.5 p-0 font-bold">{t("planLabel")}</legend>
          <div className="flex flex-wrap gap-2.5">
            <button
              type="button"
              aria-pressed={plan === "yearly"}
              onClick={() => setPlan("yearly")}
              className={toggle(plan === "yearly")}
              data-testid="roi-yearly"
            >
              {t("planYearly")}
            </button>
            <button
              type="button"
              aria-pressed={plan === "monthly"}
              onClick={() => setPlan("monthly")}
              className={toggle(plan === "monthly")}
              data-testid="roi-monthly"
            >
              {t("planMonthly")}
            </button>
          </div>
        </fieldset>
      </div>

      <div
        className="border-line bg-chat min-w-0 flex-[1_1_380px] rounded-3xl border p-6 sm:p-8"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="text-slate text-sm">{t("gain")}</div>
        <div className="font-display mb-2 text-[40px] font-extrabold" data-testid="roi-gain">
          {eur(r.gain)}
        </div>
        <div
          className="bg-wa h-3 rounded-lg transition-[width] duration-300"
          style={{ width: `${r.gainBar}%` }}
        />
        <div className="text-slate mt-[18px] text-sm">{t("cost")}</div>
        <div className="font-display mb-2 text-[40px] font-extrabold" data-testid="roi-cost">
          {eur(r.cost)}
        </div>
        <div
          className="bg-accent h-3 rounded-lg transition-[width] duration-300"
          style={{ width: `${r.costBar}%` }}
        />
        <div className="text-slate mt-[22px] text-sm">{t("net")}</div>
        <div
          data-testid="roi-net"
          className={cn(
            "font-display text-[44px] leading-[1.1] font-extrabold sm:text-[56px]",
            r.net < 0 ? "text-accent" : "text-wa",
          )}
        >
          {formatEuro(r.net, locale, { sign: true })}
        </div>
        <p className="mt-2.5 mb-0 font-semibold" data-testid="roi-payback">
          {t("payback", { cars: r.cars, margin: eur(margin) })}
        </p>
        <p className="text-muted mt-1.5 mb-0" data-testid="roi-months">
          {t("months", { months: r.monthsCovered })}
        </p>
        <p className="text-slate mt-[18px] mb-0 text-[13px]">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
