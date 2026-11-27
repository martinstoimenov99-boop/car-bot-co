"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * "menu": a button showing the current language code that opens a list of all languages (header).
 * "text": plain "EN / МК / SQ / SR" links (footer).
 * Both use real links, so every language page is reachable without JavaScript and by crawlers.
 */
export function LanguageSwitcher({
  className,
  variant = "text",
}: {
  className?: string;
  variant?: "menu" | "text";
}) {
  const t = useTranslations("common.lang");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open]);

  const hrefFor = (l: Locale) => `/${l}${pathname === "/" ? "" : pathname}`;
  const go = (e: React.MouseEvent, l: Locale) => {
    e.preventDefault();
    setOpen(false);
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: l, scroll: false });
  };

  if (variant === "text") {
    return (
      <div role="group" aria-label={t("label")} className={cn("flex items-center gap-1", className)}>
        {LOCALES.map((l, i) => (
          <span key={l} className="flex items-center gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {l === locale ? (
              <span lang={LOCALE_LABELS[l].htmlLang} aria-current="true" className="text-ink font-bold">
                {LOCALE_LABELS[l].short}
              </span>
            ) : (
              <a
                lang={LOCALE_LABELS[l].htmlLang}
                hrefLang={LOCALE_LABELS[l].htmlLang}
                href={hrefFor(l)}
                title={t("switchTo", { language: LOCALE_LABELS[l].long })}
                onClick={(e) => go(e, l)}
                className="hover:text-accent-hover text-inherit no-underline"
              >
                {LOCALE_LABELS[l].short}
                <span className="sr-only"> ({LOCALE_LABELS[l].long})</span>
              </a>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="text-ink hover:border-ink inline-flex cursor-pointer items-center gap-1 rounded-full border border-[#3A424D] bg-transparent px-3 py-2 text-sm leading-none font-bold transition-colors"
      >
        <span aria-hidden="true">{LOCALE_LABELS[locale].short}</span>
        <span className="sr-only">
          {t("label")}: {LOCALE_LABELS[locale].long}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          aria-hidden="true"
          className={cn("transition-transform", open && "rotate-180")}
        >
          <path
            d="M1 3l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          id={listId}
          className="border-line bg-raised absolute top-full right-0 z-30 m-0 mt-2 min-w-40 list-none rounded-2xl border p-1 shadow-[0_20px_50px_rgba(0,0,0,.5)]"
        >
          {LOCALES.map((l) => (
            <li key={l}>
              <a
                lang={LOCALE_LABELS[l].htmlLang}
                hrefLang={LOCALE_LABELS[l].htmlLang}
                href={hrefFor(l)}
                aria-current={l === locale ? "true" : undefined}
                onClick={(e) => go(e, l)}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-[15px] font-semibold no-underline",
                  l === locale ? "text-accent" : "text-ink hover:bg-page hover:text-ink",
                )}
              >
                <span>{LOCALE_LABELS[l].long}</span>
                <span aria-hidden="true" className="text-slate text-xs font-bold">
                  {LOCALE_LABELS[l].short}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
