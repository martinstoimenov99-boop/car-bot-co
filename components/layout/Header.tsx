import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { waLink } from "@/lib/site";
import { partnerPortalUrl } from "@/lib/env";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navLink = "hidden text-ink no-underline hover:text-accent-hover sm:inline";

export async function Header({ variant }: { variant: "home" | "partners" | "thanks" }) {
  const t = await getTranslations("common.nav");
  const portal = partnerPortalUrl();
  // On the partners page the anchors are local; on the thanks page they point to /partners.
  const p = variant === "thanks" ? "/partners" : "";

  return (
    <header className="mx-auto flex max-w-[1200px] flex-nowrap items-center justify-between gap-3 px-5 py-3.5 sm:flex-wrap sm:gap-4 sm:px-6 sm:py-5">
      <Logo />
      <nav
        aria-label={t("label")}
        className="flex items-center gap-2 text-[15px] font-semibold sm:flex-wrap sm:gap-[22px]"
      >
        {variant === "home" ? (
          <>
            <a href="#how" className={navLink}>
              {t("how")}
            </a>
            <a href="#try" className={navLink}>
              {t("test")}
            </a>
            <Link href="/partners" className={navLink}>
              {t("partners")}
            </Link>
            <a href="#pricing" className={navLink}>
              {t("pricing")}
            </a>
            <a href="#faq" className={navLink}>
              {t("faq")}
            </a>
          </>
        ) : (
          <>
            <Link href="/" className={navLink}>
              {t("forDealers")}
            </Link>
            {p ? (
              <Link href={{ pathname: "/partners", hash: "earn" }} className={navLink}>
                {t("earn")}
              </Link>
            ) : (
              <a href="#earn" className={navLink}>
                {t("earn")}
              </a>
            )}
            {p ? (
              <Link href={{ pathname: "/partners", hash: "calc" }} className={navLink}>
                {t("calculator")}
              </Link>
            ) : (
              <a href="#calc" className={navLink}>
                {t("calculator")}
              </a>
            )}
          </>
        )}
        {portal && (
          <a href={portal} className={navLink} rel="noopener">
            {t("partnerLogin")}
          </a>
        )}
        <LanguageSwitcher variant="pill" />
        {variant === "home" ? (
          <a
            href={waLink()}
            aria-label={t("whatsappAria")}
            className="ping btn bg-wa text-on-wa hover:text-on-wa px-3.5 py-3 hover:bg-[#4be083] max-[350px]:px-2.5 sm:px-[18px]"
          >
            {t("whatsapp")}
          </a>
        ) : variant === "partners" ? (
          <a
            href="#apply"
            className="btn bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent px-3.5 py-3 max-[350px]:px-2.5 sm:px-[18px]"
          >
            {t("becomePartner")}
          </a>
        ) : (
          <Link
            href={{ pathname: "/partners", hash: "apply" }}
            className="btn bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent px-3.5 py-3 max-[350px]:px-2.5 sm:px-[18px]"
          >
            {t("becomePartner")}
          </Link>
        )}
      </nav>
    </header>
  );
}
