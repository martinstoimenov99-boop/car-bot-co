/** Server-side zod schemas. Never import this from a client component (zod would ship to the browser). */
import "server-only";
import { z } from "zod";
import { LOCALES } from "@/i18n/config";
import { isValidRef } from "./ref";
import { EMAIL_RE, LIMITS, MAX_SEARCHES, MOBILE_DE_RE, PARTNER_HOW, phoneDigits } from "./validation";

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
