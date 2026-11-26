import { z } from "zod";
import { LOCALES } from "@/i18n/config";
import { isValidRef } from "./ref";

export const MOBILE_DE_RE = /^https?:\/\/([a-z0-9-]+\.)*mobile\.de\//i;
export const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
export const MAX_SEARCHES = 3;
export const LIMITS = { name: 80, email: 254, phone: 20, url: 2000, country: 80, code: 32 } as const;

export type SearchError = "empty" | "tooMany" | "notMobile";

/** Splits the textarea into non-empty trimmed rows and checks them against the free-test rules. */
export function parseSearches(text: string): { lines: string[]; error: SearchError | null } {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!lines.length) return { lines, error: "empty" };
  if (lines.length > MAX_SEARCHES) return { lines, error: "tooMany" };
  if (!lines.every((l) => MOBILE_DE_RE.test(l) && l.length <= LIMITS.url))
    return { lines, error: "notMobile" };
  return { lines, error: null };
}

export const phoneDigits = (v: string) => v.replace(/\D/g, "");

export type ContactError = "name" | "email" | "phone" | "consent";

/** Client-side check in the same order as the design; the server re-validates with zod. */
export function checkContact(v: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  consent: boolean;
}): ContactError | null {
  if (!v.firstName.trim() || !v.lastName.trim()) return "name";
  if (!EMAIL_RE.test(v.email.trim()) || v.email.trim().length > LIMITS.email) return "email";
  if (phoneDigits(v.phone).length < 7 || v.phone.trim().length > LIMITS.phone) return "phone";
  if (!v.consent) return "consent";
  return null;
}

const text = (max: number) =>
  z
    .string()
    .transform((s) => s.trim().replace(/\s+/g, " "))
    .pipe(z.string().min(1).max(max));

const optionalCode = z
  .string()
  .optional()
  .transform((s) => (s ? s.trim() : undefined))
  .refine((s) => s === undefined || s === "" || isValidRef(s), "invalid code")
  .transform((s) => (s ? s : undefined));

const contact = {
  firstName: text(LIMITS.name),
  lastName: text(LIMITS.name),
  email: z
    .string()
    .transform((s) => s.trim().toLowerCase())
    .pipe(z.string().max(LIMITS.email).regex(EMAIL_RE)),
  phone: z
    .string()
    .transform((s) => s.trim())
    .pipe(
      z
        .string()
        .max(LIMITS.phone)
        .regex(/^[+\d\s().-]+$/)
        .refine((s) => phoneDigits(s).length >= 7),
    ),
  consent: z.literal(true),
  locale: z.enum(LOCALES).catch("en"),
  website: z.string().max(200).optional(), // honeypot
};

export const leadSchema = z
  .object({
    type: z.enum(["test", "monthly", "yearly"]),
    ...contact,
    searches: z
      .array(
        z
          .string()
          .transform((s) => s.trim())
          .pipe(z.string().max(LIMITS.url).regex(MOBILE_DE_RE)),
      )
      .min(1)
      .max(MAX_SEARCHES)
      .optional(),
    ref: optionalCode,
    code: optionalCode,
  })
  .superRefine((v, ctx) => {
    if (v.type === "test" && !v.searches?.length) {
      ctx.addIssue({ code: "custom", path: ["searches"], message: "searches required for the free test" });
    }
  })
  .transform((v) => (v.type === "test" ? v : { ...v, searches: undefined }));

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export const PARTNER_HOW = ["calls", "social", "community", "network", "other"] as const;

export const partnerSchema = z.object({
  ...contact,
  country: z
    .string()
    .optional()
    .default("")
    .transform((s) => s.trim().replace(/\s+/g, " "))
    .pipe(z.string().max(LIMITS.country)),
  how: z.enum(PARTNER_HOW),
  ref: optionalCode,
});

export type PartnerInput = z.input<typeof partnerSchema>;
export type PartnerApplication = z.output<typeof partnerSchema>;
