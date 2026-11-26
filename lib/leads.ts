import "server-only";
import { addContact, emailConfigured, sendEmail } from "./email";
import { leadConfirmation, leadNotification, partnerNotification, partnerWelcome } from "./emails/templates";
import { getAffiliateProvider } from "./affiliate";
import type { Lead, PartnerApplication } from "./schemas";

/**
 * Where submissions go. v1 has no database: email + Resend audience + optional webhook.
 * To add Supabase later, write a sink that inserts the record and add it to the list below
 * (mark it `critical` so a failed insert fails the request when email is also down).
 */
export type LeadRecord =
  | { kind: "lead"; data: Lead; ref?: string; at: string }
  | { kind: "partner"; data: PartnerApplication; at: string };

export interface LeadSink {
  name: string;
  /** A submission counts as delivered when at least one critical sink succeeds. */
  critical: boolean;
  enabled(record: LeadRecord): boolean;
  handle(record: LeadRecord): Promise<void>;
}

const notifyTo = (record: LeadRecord) =>
  record.kind === "partner"
    ? process.env.PARTNER_NOTIFY_EMAIL || process.env.LEAD_NOTIFY_EMAIL
    : process.env.LEAD_NOTIFY_EMAIL;

const notifySink: LeadSink = {
  name: "notify-email",
  critical: true,
  enabled: (r) => !!notifyTo(r) || !emailConfigured(),
  async handle(r) {
    const mail =
      r.kind === "lead" ? leadNotification(r.data, { ref: r.ref, at: r.at }) : partnerNotification(r.data, r);
    await sendEmail({ to: notifyTo(r) ?? "log-only@localhost", replyTo: r.data.email, ...mail });
  },
};

const confirmationSink: LeadSink = {
  name: "confirmation-email",
  critical: false,
  enabled: () => true,
  async handle(r) {
    const mail = r.kind === "lead" ? await leadConfirmation(r.data) : await partnerWelcome(r.data);
    await sendEmail({
      to: r.data.email,
      replyTo: process.env.LEAD_NOTIFY_EMAIL || undefined,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
  },
};

const audienceSink: LeadSink = {
  name: "audience",
  critical: false,
  enabled: (r) =>
    !!(r.kind === "lead" ? process.env.RESEND_AUDIENCE_ID : process.env.RESEND_PARTNER_AUDIENCE_ID),
  async handle(r) {
    const properties: Record<string, string> = { locale: r.data.locale, source: r.kind };
    if (r.kind === "lead") {
      properties.lead_type = r.data.type;
      if (r.ref) properties.ref = r.ref;
      if (r.data.code) properties.discount_code = r.data.code;
    } else if (r.data.ref) properties.ref = r.data.ref;
    await addContact({
      segmentId: r.kind === "lead" ? process.env.RESEND_AUDIENCE_ID : process.env.RESEND_PARTNER_AUDIENCE_ID,
      email: r.data.email,
      firstName: r.data.firstName,
      lastName: r.data.lastName,
      properties,
    });
  },
};

const webhookUrl = (r: LeadRecord) =>
  r.kind === "lead" ? process.env.LEAD_WEBHOOK_URL : process.env.PARTNER_WEBHOOK_URL;

const webhookSink: LeadSink = {
  name: "webhook",
  critical: true,
  enabled: (r) => !!webhookUrl(r),
  async handle(r) {
    const payload =
      r.kind === "lead"
        ? { kind: "lead", ...r.data, website: undefined, ref: r.ref ?? null, receivedAt: r.at }
        : { kind: "partner", ...r.data, website: undefined, receivedAt: r.at };
    const res = await fetch(webhookUrl(r)!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-webhook-secret": process.env.LEAD_WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  },
};

const affiliateSink: LeadSink = {
  name: "affiliate",
  critical: false,
  enabled: () => true,
  async handle(r) {
    await getAffiliateProvider().trackLead({
      kind: r.kind,
      type: r.kind === "lead" ? r.data.type : undefined,
      email: r.data.email,
      firstName: r.data.firstName,
      lastName: r.data.lastName,
      ref: r.kind === "lead" ? r.ref : r.data.ref,
      code: r.kind === "lead" ? r.data.code : undefined,
      locale: r.data.locale,
      at: r.at,
    });
  },
};

export const SINKS: LeadSink[] = [notifySink, webhookSink, confirmationSink, audienceSink, affiliateSink];

export async function recordSubmission(record: LeadRecord, sinks: LeadSink[] = SINKS) {
  const active = sinks.filter((s) => s.enabled(record));
  const results = await Promise.allSettled(active.map((s) => s.handle(record)));
  let delivered = false;
  results.forEach((res, i) => {
    const sink = active[i];
    if (res.status === "fulfilled") {
      if (sink.critical) delivered = true;
    } else {
      // Log details server-side only; never echo them to the client.
      console.error(`[leads] sink "${sink.name}" failed for ${record.kind}:`, res.reason);
    }
  });
  if (!active.some((s) => s.critical)) {
    console.error("[leads] no critical sink configured (set LEAD_NOTIFY_EMAIL or a webhook)");
  }
  return { delivered };
}
