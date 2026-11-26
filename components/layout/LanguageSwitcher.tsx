"use client";

import { useLocale, useTranslations } from "next-intl";
import { LOCALES, LOCALE_LABELS } from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common.lang");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label={t("label")} className={cn("flex items-center gap-1", className)}>
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true">/</span>}
          {l === locale ? (
            <span aria-current="true" lang={LOCALE_LABELS[l].htmlLang} className="text-ink font-bold">
              {LOCALE_LABELS[l].short}
            </span>
          ) : (
            <a
              href={`/${l}${pathname === "/" ? "" : pathname}`}
              lang={LOCALE_LABELS[l].htmlLang}
              hrefLang={LOCALE_LABELS[l].htmlLang}
              aria-label={t("switchTo", { language: LOCALE_LABELS[l].long })}
              className="hover:text-accent-hover text-inherit no-underline"
              onClick={(e) => {
                e.preventDefault();
                const query = Object.fromEntries(new URLSearchParams(window.location.search));
                router.replace({ pathname, query }, { locale: l, scroll: false });
              }}
            >
              {LOCALE_LABELS[l].short}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
