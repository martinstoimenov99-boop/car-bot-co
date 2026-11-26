"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { parseSearches, type SearchError } from "@/lib/validation";
import { useLeadFlow } from "@/components/forms/LeadFlow";

export function FreeTestBox() {
  const t = useTranslations("home.freeTest");
  const { open } = useLeadFlow();
  const id = useId().replace(/:/g, "");
  const [links, setLinks] = useState("");
  const [error, setError] = useState<SearchError | null>(null);
  const { lines } = parseSearches(links);

  const start = () => {
    const r = parseSearches(links);
    if (r.error) {
      setError(r.error);
      document.getElementById(`${id}-links`)?.focus();
      return;
    }
    setError(null);
    open("test", r.lines);
  };

  return (
    <div className="border-line bg-page rounded-[26px] border p-[22px] shadow-[0_30px_80px_rgba(0,0,0,.45)]">
      <div className="mb-3.5 flex items-center gap-2.5">
        <div className="bg-accent size-8 rounded-full" aria-hidden="true" />
        <div className="font-semibold">{t("botName")}</div>
      </div>
      <p
        id={`${id}-prompt`}
        className="bg-bubble mt-0 mb-3.5 max-w-[560px] rounded-[4px_16px_16px_16px] px-3.5 py-3"
      >
        {t("prompt")}
      </p>
      <label htmlFor={`${id}-links`} className="sr-only">
        {t("inputLabel")}
      </label>
      <textarea
        id={`${id}-links`}
        data-testid="free-test-links"
        rows={4}
        placeholder={t("placeholder")}
        aria-describedby={`${id}-prompt ${id}-count${error ? ` ${id}-err` : ""}`}
        aria-invalid={error ? true : undefined}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        value={links}
        onChange={(e) => setLinks(e.target.value)}
        className="border-line bg-chat text-ink placeholder:text-slate focus:outline-accent box-border w-full resize-y rounded-2xl border p-3.5 font-[inherit] text-[15px] focus:outline-2"
      />
      <div aria-live="polite">
        {error && (
          <p id={`${id}-err`} data-testid="free-test-error" className="text-accent-hover mt-2.5 mb-0 text-sm">
            {t(`errors.${error}`)}
          </p>
        )}
      </div>
      <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3">
        <div id={`${id}-count`} className="text-slate text-sm" data-testid="free-test-count">
          {t("count", { count: lines.length })}
        </div>
        <button
          type="button"
          onClick={start}
          className="btn bg-accent text-on-accent hover:bg-accent-hover px-6 py-3.5 text-base max-sm:w-full"
        >
          {t("submit")}
        </button>
      </div>
    </div>
  );
}
