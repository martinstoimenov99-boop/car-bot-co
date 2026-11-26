"use client";

import { createContext, useCallback, useContext, useId, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Modal } from "@/components/ui/Modal";
import { getRef } from "@/lib/ref-client";
import { isValidRef } from "@/lib/ref";
import { waLink } from "@/lib/site";
import { checkContact, type ContactError } from "@/lib/validation";
import { ContactFields, Honeypot, fieldIdForError, type ContactValues } from "./ContactFields";

export type LeadMode = "test" | "monthly" | "yearly";
type Step = "closed" | "details" | "done";
type FormError = ContactError | "code" | "network" | "rate" | null;

const LeadFlowContext = createContext<{ open: (mode: LeadMode, searches?: string[]) => void } | null>(null);

export function useLeadFlow() {
  const ctx = useContext(LeadFlowContext);
  if (!ctx) throw new Error("useLeadFlow must be used inside <LeadFlowProvider>");
  return ctx;
}

const EMPTY: ContactValues = { firstName: "", lastName: "", email: "", phone: "" };

export function LeadFlowProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("forms");
  const tc = useTranslations("common");
  const locale = useLocale();
  const uid = useId().replace(/:/g, "");
  const [step, setStep] = useState<Step>("closed");
  const [mode, setMode] = useState<LeadMode>("test");
  const [searches, setSearches] = useState<string[]>([]);
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [consent, setConsent] = useState(false);
  const [code, setCode] = useState("");
  const [ref, setRef] = useState<string | undefined>();
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<FormError>(null);
  const [sending, setSending] = useState(false);

  const open = useCallback((m: LeadMode, s: string[] = []) => {
    const stored = getRef();
    setMode(m);
    setSearches(s);
    setRef(stored);
    setCode((c) => c || stored || "");
    setError(null);
    setStep("details");
  }, []);

  const isTest = mode === "test";
  const trimmedCode = code.trim();

  const waMessage = useMemo(() => {
    const lines = [
      isTest
        ? t("lead.waIntroTest")
        : t("lead.waIntroPlan", {
            plan: mode === "yearly" ? t("lead.waPlanYearly") : t("lead.waPlanMonthly"),
          }),
      `${t("lead.waName")}: ${values.firstName} ${values.lastName}`,
      `${t("lead.waEmail")}: ${values.email}`,
      `${t("lead.waPhone")}: ${values.phone}`,
    ];
    if (isTest) lines.push(`${t("lead.waSearches")}:`, ...searches);
    if (trimmedCode || ref) lines.push(`${t("lead.waCode")}: ${trimmedCode || ref}`);
    return lines.join("\n");
  }, [isTest, mode, values, searches, trimmedCode, ref, t]);

  const focusField = (err: string) => {
    const id = fieldIdForError[err];
    if (id) requestAnimationFrame(() => document.getElementById(`${uid}-${id}`)?.focus());
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const contactError = checkContact({ ...values, consent });
    if (contactError) {
      setError(contactError);
      focusField(contactError);
      return;
    }
    if (!isTest && trimmedCode && !isValidRef(trimmedCode)) {
      setError("code");
      focusField("code");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: mode,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          searches: isTest ? searches : undefined,
          consent: true,
          locale,
          ref: ref || (isValidRef(trimmedCode) ? trimmedCode : undefined),
          code: !isTest && trimmedCode ? trimmedCode : undefined,
          website,
        }),
      });
      if (res.status === 429) throw new Error("rate");
      if (!res.ok) throw new Error("network");
      setStep("done");
    } catch (err) {
      setError(err instanceof Error && err.message === "rate" ? "rate" : "network");
    } finally {
      setSending(false);
    }
  };

  const titleId = `${uid}-title`;
  const subId = `${uid}-sub`;
  const errorText = error ? t(`errors.${error}`) : "";
  const showWa = error === "network" || error === "rate";

  return (
    <LeadFlowContext.Provider value={{ open }}>
      {children}

      <Modal
        open={step === "details"}
        onClose={() => setStep("closed")}
        labelledBy={titleId}
        describedBy={subId}
        testId="lead-modal"
      >
        <form noValidate onSubmit={submit} className="relative">
          <h2 id={titleId} className="font-display mt-0 mb-2 text-[28px] leading-tight font-extrabold">
            {isTest ? t("lead.testTitle") : t("lead.planTitle")}
          </h2>
          <p id={subId} className="text-cream-muted mt-0 mb-[18px]" data-testid="lead-modal-sub">
            {isTest
              ? t("lead.testSub")
              : mode === "yearly"
                ? t("lead.planSubYearly")
                : t("lead.planSubMonthly")}
          </p>
          <div className="flex flex-col gap-2.5">
            <ContactFields
              idPrefix={uid}
              values={values}
              onChange={(p) => setValues((v) => ({ ...v, ...p }))}
              error={error === "network" || error === "rate" ? null : error}
            />
            {!isTest && (
              <div>
                <label htmlFor={`${uid}-code`} className="text-cream-muted mb-1 block text-sm font-semibold">
                  {t("lead.codeLabel")}
                </label>
                <input
                  id={`${uid}-code`}
                  name="code"
                  className="field"
                  type="text"
                  autoComplete="off"
                  maxLength={32}
                  aria-invalid={error === "code" || undefined}
                  aria-describedby={trimmedCode ? `${uid}-discount` : undefined}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {trimmedCode && (
                  <p id={`${uid}-discount`} className="text-accent-dark mt-1.5 mb-0 text-sm font-semibold">
                    ✓ {t("lead.codeDiscount")}
                  </p>
                )}
              </div>
            )}
          </div>
          <Honeypot id={`${uid}-website`} value={website} onChange={setWebsite} />
          <label className="text-cream-muted mt-3.5 flex items-start gap-2.5 text-sm">
            <input
              id={`${uid}-consent`}
              type="checkbox"
              className="accent-accent-dark mt-[3px] size-4 shrink-0"
              checked={consent}
              aria-invalid={error === "consent" || undefined}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>{isTest ? t("lead.consentTest") : t("lead.consentPlan")}</span>
          </label>
          <div aria-live="polite" className="text-accent-dark mt-2.5 min-h-0 text-sm font-semibold">
            {errorText && (
              <p className="m-0" data-testid="lead-error">
                {errorText}
              </p>
            )}
            {showWa && (
              <a
                href={waLink(waMessage)}
                className="btn bg-wa text-on-wa hover:text-on-wa mt-3 px-5 py-3"
                data-testid="lead-wa-fallback"
              >
                {t("lead.waFallback")}
              </a>
            )}
          </div>
          <div className="mt-[18px] flex gap-2.5">
            <button
              type="button"
              onClick={() => setStep("closed")}
              className="btn border-cream-ink text-cream-ink hover:bg-cream-ink/5 border-2 bg-transparent px-5 py-[13px]"
            >
              {t("lead.back")}
            </button>
            <button
              type="submit"
              disabled={sending}
              aria-busy={sending || undefined}
              className="btn bg-accent text-on-accent hover:bg-accent-hover flex-1 px-5 py-3.5 text-base disabled:opacity-70"
            >
              {sending ? t("lead.sending") : isTest ? t("lead.submitTest") : t("lead.submitPlan")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={step === "done"}
        onClose={() => setStep("closed")}
        labelledBy={`${uid}-done`}
        testId="lead-done"
        className="p-8 text-center"
      >
        <div className="text-[44px]" aria-hidden="true">
          ✅
        </div>
        <h2 id={`${uid}-done`} className="font-display my-2 text-[28px] font-extrabold">
          {isTest ? t("lead.doneTitleTest") : t("lead.doneTitlePlan")}
        </h2>
        <p className="text-cream-muted mt-0 mb-5">{isTest ? t("lead.doneTest") : t("lead.donePlan")}</p>
        <div className="mb-2.5">
          <Link
            href={{ pathname: "/thanks", query: { type: mode } }}
            className="text-accent-dark font-bold"
            data-autofocus
          >
            {t("lead.continue")}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setStep("closed")}
          className="text-cream-muted cursor-pointer border-0 bg-transparent font-[inherit] text-[15px] underline"
        >
          {tc("close")}
        </button>
      </Modal>
    </LeadFlowContext.Provider>
  );
}
