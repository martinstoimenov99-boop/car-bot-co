import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export function CarIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F08A3C"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.5h7.2a2 2 0 0 1 1.9 1.5L19 16" />
      <rect x="3" y="16" width="18" height="4" rx="1" />
      <circle cx="7" cy="20" r="1.5" />
      <circle cx="17" cy="20" r="1.5" />
    </svg>
  );
}

export async function Logo() {
  const t = await getTranslations("common");
  return (
    <Link
      href="/"
      aria-label={t("homeLink")}
      className="font-display text-ink hover:text-ink flex items-center gap-2.5 text-[22px] font-extrabold no-underline"
    >
      <CarIcon />
      {t("brand")}
    </Link>
  );
}
