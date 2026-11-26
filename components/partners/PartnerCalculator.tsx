"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { partnerEarnings } from "@/lib/calc";
import { formatEuro } from "@/lib/format";

export function PartnerCalculator() {
  const t = useTranslations("partners.calc");
  const locale = useLocale();
  const id = useId().replace(/:/g, "");
  const [clients, setClients] = useState(2);
  const r = partnerEarnings(clients);
  const label = t("clientsValue", { count: clients });
  const b = (chunks: React.ReactNode) => <b className="text-ink">{chunks}</b>;

  return (
    <div className="flex flex-wrap items-stretch gap-6" data-testid="partner-calc">
      <div className="bg-page flex min-w-0 flex-[1_1_420px] flex-col gap-[22px] rounded-3xl p-6 sm:p-8">
        <div>
          <div className="mb-2.5 flex justify-between gap-3">
            <label htmlFor={`${id}-clients`} className="font-bold">
              {t("clientsLabel")}
            </label>
            <span className="text-accent font-bold" aria-hidden="true">
              {label}
            </span>
          </div>
          <input
            id={`${id}-clients`}
            data-testid="partner-clients"
            type="range"
            min={1}
            max={6}
            step={1}
            value={clients}
            aria-valuetext={label}
            onChange={(e) => setClients(Number(e.target.value))}
          />
        </div>
        <p className="text-muted m-0" data-testid="partner-total-clients">
          {t.rich("total", { count: r.totalClients, b })}
        </p>
        <p className="bg-raised text-soft m-0 rounded-2xl p-4">
          {t.rich("perDealer", { b: (c) => <b className="text-accent">{c}</b> })}
        </p>
      </div>
      <div
        className="border-line bg-chat min-w-0 flex-[1_1_380px] rounded-3xl border p-6 sm:p-8"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="text-slate text-sm">{t("yearTotal")}</div>
        <div
          className="font-display text-wa text-[46px] leading-[1.1] font-extrabold sm:text-[58px]"
          data-testid="partner-year-total"
        >
          {formatEuro(r.yearTotal, locale)}
        </div>
        <div className="text-slate mt-[18px] text-sm">{t("monthlyAt12")}</div>
        <div className="font-display text-[34px] font-extrabold">
          <span data-testid="partner-monthly">{formatEuro(r.monthlyAt12, locale)}</span>
          <span className="text-muted text-base font-semibold">{t("perMonth")}</span>
        </div>
        <p className="text-slate mt-[18px] mb-0 text-[13px]">{t("disclaimer")}</p>
      </div>
    </div>
  );
}
