"use client";

import { useTranslations } from "next-intl";
import type { ContactError } from "@/lib/validation";

export type ContactValues = { firstName: string; lastName: string; email: string; phone: string };

/** Name / surname / email / WhatsApp fields with visually hidden labels (the design shows placeholders). */
export function ContactFields({
  idPrefix,
  values,
  onChange,
  error,
}: {
  idPrefix: string;
  values: ContactValues;
  onChange: (patch: Partial<ContactValues>) => void;
  error: ContactError | "code" | "how" | null;
}) {
  const t = useTranslations("forms.fields");
  const invalidName = error === "name";
  return (
    <>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label htmlFor={`${idPrefix}-first`} className="sr-only">
            {t("first")}
          </label>
          <input
            id={`${idPrefix}-first`}
            name="firstName"
            className="field"
            type="text"
            autoComplete="given-name"
            maxLength={80}
            required
            placeholder={t("first")}
            aria-invalid={invalidName && !values.firstName.trim() ? true : undefined}
            value={values.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-last`} className="sr-only">
            {t("last")}
          </label>
          <input
            id={`${idPrefix}-last`}
            name="lastName"
            className="field"
            type="text"
            autoComplete="family-name"
            maxLength={80}
            required
            placeholder={t("last")}
            aria-invalid={invalidName && !values.lastName.trim() ? true : undefined}
            value={values.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </div>
      </div>
      <label htmlFor={`${idPrefix}-email`} className="sr-only">
        {t("email")}
      </label>
      <input
        id={`${idPrefix}-email`}
        name="email"
        className="field"
        type="email"
        autoComplete="email"
        inputMode="email"
        maxLength={254}
        required
        placeholder={t("email")}
        aria-invalid={error === "email" || undefined}
        value={values.email}
        onChange={(e) => onChange({ email: e.target.value })}
      />
      <label htmlFor={`${idPrefix}-phone`} className="sr-only">
        {t("phone")}
      </label>
      <input
        id={`${idPrefix}-phone`}
        name="phone"
        className="field"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        maxLength={20}
        required
        placeholder={t("phone")}
        aria-invalid={error === "phone" || undefined}
        value={values.phone}
        onChange={(e) => onChange({ phone: e.target.value })}
      />
    </>
  );
}

/** Off-screen field bots fill in and people never see. */
export function Honeypot({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id: string;
}) {
  const t = useTranslations("forms.fields");
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor={id}>{t("honeypot")}</label>
      <input
        id={id}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export const fieldIdForError: Record<string, string> = {
  name: "first",
  email: "email",
  phone: "phone",
  consent: "consent",
  code: "code",
  how: "how",
};
