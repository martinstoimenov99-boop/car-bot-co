"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { OPEN_COOKIE_SETTINGS_EVENT, getConsent, setConsent } from "@/lib/ref-client";

export function CookieBanner() {
  const t = useTranslations("common.cookies");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Reading a cookie is only possible after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!getConsent()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;

  const choose = (v: "accepted" | "essential") => {
    setConsent(v);
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label={t("label")}
      data-testid="cookie-banner"
      className="border-line text-soft fixed inset-x-0 bottom-0 z-40 border-t bg-[#16191E] p-4 text-sm shadow-[0_-10px_40px_rgba(0,0,0,.45)] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-sm sm:rounded-[18px] sm:border"
    >
      <p className="m-0">
        {t("text")}{" "}
        <Link href="/cookies" className="font-semibold underline">
          {t("more")}
        </Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="btn bg-accent text-on-accent hover:bg-accent-hover flex-1 px-4 py-2.5 text-[15px]"
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="btn text-ink hover:border-ink flex-1 border-2 border-[#3A424D] bg-transparent px-4 py-2 text-[15px]"
        >
          {t("essential")}
        </button>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ className, label }: { className?: string; label: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))}
    >
      {label}
    </button>
  );
}
