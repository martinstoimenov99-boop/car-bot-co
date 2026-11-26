"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getRef } from "@/lib/ref-client";
import { waLink } from "@/lib/site";
import { PARTNER_HOW, checkContact, type ContactError } from "@/lib/validation";
import {
  ContactFields,
  Honeypot,
  fieldIdForError,
  type ContactValues,
} from "@/components/forms/ContactFields";

type FormError = ContactError | "how" | "network" | "rate" | null;

export function PartnerForm() {
  const t = useTranslations("partners.apply");
  const tf = useTranslations("forms");
  const locale = useLocale();
  const uid = useId().replace(/:/g, "");
  const [values, setValues] = useState<ContactValues>({ firstName: "", lastName: "", email: "", phone: "" });
  const [country, setCountry] = useState("");
  const [how, setHow] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [error, setError] = useState<FormError>(null);
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const focus = (err: string) =>
    requestAnimationFrame(() => document.getElementById(`${uid}-${fieldIdForError[err]}`)?.focus());

  const waMessage = [
    tf("partner.waIntro"),
    `${tf("lead.waName")}: ${values.firstName} ${values.lastName}`,
    `${tf("lead.waEmail")}: ${values.email}`,
    `${tf("lead.waPhone")}: ${values.phone}`,
    `${tf("partner.waCountry")}: ${country}`,
    `${tf("partner.waHow")}: ${how ? t(`how.${how as (typeof PARTNER_HOW)[number]}`) : ""}`,
  ].join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    // Same order as the design: name, email, phone, how, consent.
    const c = checkContact({ ...values, consent: true });
    const err: FormError = c ?? (!how ? "how" : !consent ? "consent" : null);
    if (err) {
      setError(err);
      focus(err);
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          country: country.trim(),
          how,
          consent: true,
          locale,
          ref: getRef(),
          website,
        }),
      });
      if (res.status === 429) throw new Error("rate");
      if (!res.ok) throw new Error("network");
      setDone(true);
    } catch (e2) {
      setError(e2 instanceof Error && e2.message === "rate" ? "rate" : "network");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-card bg-white p-8 text-center" data-testid="partner-done" role="status">
        <div className="text-[44px]" aria-hidden="true">
          🎉
        </div>
        <h3 className="font-display my-2 text-[28px] font-extrabold">{t("doneTitle")}</h3>
        <p className="text-cream-muted mt-0 mb-4">{t("doneText")}</p>
        <Link
          href={{ pathname: "/thanks", query: { type: "partner" } }}
          className="text-accent-dark font-bold"
        >
          {t("continue")}
        </Link>
      </div>
    );
  }

  const errorText = error ? tf(`errors.${error}`) : "";
  return (
    <form
      noValidate
      onSubmit={submit}
      className="rounded-card relative flex flex-col gap-2.5 bg-white p-[26px]"
      data-testid="partner-form"
    >
      <ContactFields
        idPrefix={uid}
        values={values}
        onChange={(p) => setValues((v) => ({ ...v, ...p }))}
        error={error === "network" || error === "rate" ? null : error}
      />
      <label htmlFor={`${uid}-country`} className="sr-only">
        {tf("fields.country")}
      </label>
      <input
        id={`${uid}-country`}
        name="country"
        className="field"
        type="text"
        autoComplete="country-name"
        maxLength={80}
        placeholder={tf("fields.country")}
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <label htmlFor={`${uid}-how`} className="sr-only">
        {t("howLabel")}
      </label>
      <select
        id={`${uid}-how`}
        name="how"
        className="field"
        value={how}
        aria-invalid={error === "how" || undefined}
        onChange={(e) => setHow(e.target.value)}
      >
        <option value="">{t("howLabel")}</option>
        {PARTNER_HOW.map((h) => (
          <option key={h} value={h}>
            {t(`how.${h}`)}
          </option>
        ))}
      </select>
      <Honeypot id={`${uid}-website`} value={website} onChange={setWebsite} />
      <label className="text-cream-muted flex items-start gap-2.5 text-sm">
        <input
          id={`${uid}-consent`}
          type="checkbox"
          className="accent-accent-dark mt-[3px] size-4 shrink-0"
          checked={consent}
          aria-invalid={error === "consent" || undefined}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>{t("consent")}</span>
      </label>
      <div aria-live="polite" className="text-accent-dark text-sm font-semibold">
        {errorText && (
          <p className="m-0" data-testid="partner-error">
            {errorText}
          </p>
        )}
        {(error === "network" || error === "rate") && (
          <a href={waLink(waMessage)} className="btn bg-wa text-on-wa hover:text-on-wa mt-3 px-5 py-3">
            {t("waFallback")}
          </a>
        )}
      </div>
      <button
        type="submit"
        disabled={sending}
        aria-busy={sending || undefined}
        className="btn bg-accent text-on-accent hover:bg-accent-hover px-5 py-4 text-[17px] disabled:opacity-70"
      >
        {sending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
