import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SITE_HOST } from "@/lib/site";
import { partnerPortalUrl } from "@/lib/env";
import { LanguageSwitcher } from "./LanguageSwitcher";

const fineLink = "text-fine underline-offset-2 hover:text-accent-hover";

export async function Footer({ variant }: { variant: "home" | "partners" | "thanks" | "legal" }) {
  const t = await getTranslations("common");
  const portal = partnerPortalUrl();
  return (
    <footer className="border-line-soft text-fine border-t px-6 py-6 text-center text-sm">
      <p className="m-0">
        {t("brand")} · {SITE_HOST} · {t("footer.city")}
        {variant === "home" && (
          <>
            {" · "}
            <Link href="/partners" className={fineLink}>
              {t("footer.becomePartner")}
            </Link>
            {" · "}
            {t("footer.notAffiliated")}
          </>
        )}
        {(variant === "partners" || variant === "legal") && (
          <>
            {" · "}
            <Link href="/" className={fineLink}>
              {t("footer.backHome")}
            </Link>
          </>
        )}
      </p>
      <nav
        aria-label={t("footer.legalNav")}
        className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2"
      >
        <Link href="/privacy" className={fineLink}>
          {t("footer.privacy")}
        </Link>
        <Link href="/terms" className={fineLink}>
          {t("footer.terms")}
        </Link>
        <Link href="/cookies" className={fineLink}>
          {t("footer.cookies")}
        </Link>
        {portal && (
          <a href={portal} className={fineLink} rel="noopener">
            {t("nav.partnerLogin")}
          </a>
        )}
        <LanguageSwitcher className="text-fine" />
      </nav>
    </footer>
  );
}
