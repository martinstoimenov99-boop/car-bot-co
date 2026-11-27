"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALES, LOCALE_LABELS } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * "pill": a segmented switch for the header (visible on every screen size).
 * "text": plain "EN / МК" links for the footer.
 * With 4+ languages the pill gets crowded: switch it to a <select> then (see docs/LANGUAGES.md).
 */
export function LanguageSwitcher({
  className,
  variant = "text",
}: {
  className?: string;
  variant?: "pill" | "text";
}) {
  const t = useTranslations("common.lang");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const go = (e: React.MouseEvent, l: (typeof LOCALES)[number]) => {
    e.preventDefault();
    const query = Object.fromEntries(new URLSearchParams(window.location.search));
    router.replace({ pathname, query }, { locale: l, scroll: false });
  };

  const items = LOCALES.map((l, i) => {
    const active = l === locale;
    const label = LOCALE_LABELS[l];
    const common = { lang: label.htmlLang } as const;
    if (variant === "pill") {
      const base =
        "inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1.5 sm:min-w-9 sm:px-2.5 text-sm leading-none font-bold no-underline";
      return active ? (
        <span key={l} {...common} aria-current="true" className={cn(base, "bg-ink text-page")}>
          {label.short}
        </span>
      ) : (
        <a
          key={l}
          {...common}
          href={`/${l}${pathname === "/" ? "" : pathname}`}
          hrefLang={label.htmlLang}
          title={t("switchTo", { language: label.long })}
          onClick={(e) => go(e, l)}
          className={cn(base, "text-muted hover:text-ink")}
        >
          {label.short}
          <span className="sr-only"> ({label.long})</span>
        </a>
      );
    }
    return (
      <span key={l} className="flex items-center gap-1">
        {i > 0 && <span aria-hidden="true">/</span>}
        {active ? (
          <span {...common} aria-current="true" className="text-ink font-bold">
            {label.short}
          </span>
        ) : (
          <a
            {...common}
            href={`/${l}${pathname === "/" ? "" : pathname}`}
            hrefLang={label.htmlLang}
            title={t("switchTo", { language: label.long })}
            onClick={(e) => go(e, l)}
            className="hover:text-accent-hover text-inherit no-underline"
          >
            {label.short}
            <span className="sr-only"> ({label.long})</span>
          </a>
        )}
      </span>
    );
  });

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "flex items-center",
        variant === "pill" ? "gap-0.5 rounded-full border border-[#3A424D] p-0.5" : "gap-1",
        className,
      )}
    >
      {items}
    </div>
  );
}
