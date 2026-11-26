import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function NotFound() {
  const t = await getTranslations("common.notFound");
  return (
    <>
      <title>{t("metaTitle")}</title>
      <meta name="robots" content="noindex" />
      <Header variant="home" />
      <main id="main" className="mx-auto max-w-[720px] px-5 py-24 text-center sm:px-6">
        <p className="font-display text-accent text-[64px] font-extrabold">404</p>
        <h1 className="h2-sm mt-0 mb-4">{t("title")}</h1>
        <p className="text-soft mt-0 mb-8 text-lg">{t("text")}</p>
        <Link
          href="/"
          className="btn bg-accent text-on-accent hover:bg-accent-hover hover:text-on-accent px-6 py-4"
        >
          {t("home")}
        </Link>
      </main>
      <Footer variant="legal" />
    </>
  );
}
