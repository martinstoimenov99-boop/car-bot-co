import { getTranslations } from "next-intl/server";
import { Eyebrow } from "@/components/ui/Section";
import { FreeTestBox } from "./FreeTest";
import { PlanButton } from "./PlanButton";
import { RoiCalculator } from "./RoiCalculator";

export async function FreeTestSection() {
  const t = await getTranslations("home.freeTest");
  return (
    <section id="try" className="section-y bg-warm px-5 sm:px-6">
      <div className="mx-auto max-w-[920px]">
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h2 className="h2 mt-0 mb-4">{t("title")}</h2>
        <p className="text-soft mt-0 mb-8 max-w-[760px] text-[19px]">{t("lead")}</p>
        <FreeTestBox />
        <p className="text-fine mt-[18px] mb-0 max-w-[760px] text-sm">{t("smallPrint")}</p>
      </div>
    </section>
  );
}

export async function RoiSection() {
  const t = await getTranslations("home.roi");
  return (
    <section id="calc" className="section-y container-x">
      <Eyebrow>{t("eyebrow")}</Eyebrow>
      <h2 className="h2 mt-0 mb-3.5 max-w-[860px]">{t("title")}</h2>
      <p className="text-muted mt-0 mb-10 max-w-[760px] text-[19px]">{t("lead")}</p>
      <RoiCalculator />
    </section>
  );
}

const darkBtn = "btn bg-page px-[26px] py-[17px] text-[17px] text-ink hover:bg-[#262b33] max-sm:w-full";

export async function Pricing() {
  const t = await getTranslations("home.pricing");
  return (
    <section id="pricing" className="section-y bg-cream text-cream-ink px-5 sm:px-6">
      <div className="mx-auto max-w-[1000px]">
        <h2 className="h2 mt-0 mb-3 text-center">{t("title")}</h2>
        <p className="text-cream-muted mt-0 mb-10 text-center text-lg">{t("lead")}</p>
        <div className="flex flex-wrap gap-5">
          <div className="rounded-card flex-[1_1_300px] bg-white p-7 sm:p-9">
            <div className="text-accent-dark font-semibold">{t("setupLabel")}</div>
            <div className="font-display text-[52px] font-extrabold sm:text-[60px]">{t("setupPrice")}</div>
            <p className="m-0">{t("setupBody")}</p>
          </div>
          <div className="rounded-card bg-page text-ink flex-[1_1_300px] p-7 sm:p-9">
            <div className="text-accent font-semibold">{t("monthlyLabel")}</div>
            <div className="font-display text-[52px] font-extrabold sm:text-[60px]">
              {t("monthlyPrice")}
              <span className="text-xl font-semibold">{t("perMonth")}</span>
            </div>
            <p className="text-soft m-0">{t("monthlyBody")}</p>
          </div>
        </div>
        <div className="mt-5 text-center">
          <PlanButton plan="monthly" className={darkBtn}>
            {t("chooseMonthly")}
          </PlanButton>
        </div>
        <div className="rounded-card bg-accent text-on-accent mt-5 flex flex-wrap items-center justify-between gap-6 p-7 sm:p-9">
          <div className="flex-[1_1_380px]">
            <div className="font-bold">{t("yearlyLabel")}</div>
            <div className="font-display text-[52px] font-extrabold sm:text-[60px]">
              {t("yearlyPrice")}
              <span className="text-xl font-semibold">{t("perYear")}</span>
            </div>
            <p className="m-0">{t("yearlyBody")}</p>
          </div>
          <PlanButton plan="yearly" className={darkBtn}>
            {t("chooseYearly")}
          </PlanButton>
        </div>
        <p className="text-cream-muted mt-6 mb-0 text-center text-[15px]">{t("note")}</p>
      </div>
    </section>
  );
}
