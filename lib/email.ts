import "server-only";
import { Resend } from "resend";

export interface OutgoingEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

let client: Resend | null | undefined;
function resend() {
  if (client === undefined)
    client = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
  return client;
}

export const emailConfigured = () => !!process.env.RESEND_API_KEY;
const FROM = () => process.env.RESEND_FROM || "Car Bot <hello@getcarbot.co>";

/**
 * Sends through Resend. Without RESEND_API_KEY it runs in log-only mode (local development),
 * printing the subject and recipient instead of sending.
 */
export async function sendEmail(mail: OutgoingEmail): Promise<void> {
  const r = resend();
  if (!r) {
    console.info(`[email:log-only] to=${mail.to} subject="${mail.subject}"\n${mail.text}`);
    return;
  }
  const { error } = await r.emails.send({
    from: FROM(),
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: mail.replyTo,
  });
  if (error) throw new Error(`Resend send failed: ${error.name}: ${error.message}`);
}

/** Adds a contact to a Resend segment/audience. Custom properties are tried first, then dropped if rejected. */
export async function addContact(opts: {
  segmentId: string | undefined;
  email: string;
  firstName: string;
  lastName: string;
  properties?: Record<string, string>;
}) {
  const r = resend();
  if (!opts.segmentId) return;
  if (!r) {
    console.info(`[audience:log-only] ${opts.email} → ${opts.segmentId}`, opts.properties ?? {});
    return;
  }
  const base = {
    email: opts.email,
    firstName: opts.firstName,
    lastName: opts.lastName,
    unsubscribed: false,
    segments: [{ id: opts.segmentId }],
  };
  let { error } = await r.contacts.create(opts.properties ? { ...base, properties: opts.properties } : base);
  if (error && opts.properties) ({ error } = await r.contacts.create(base));
  if (error && !/already exists/i.test(error.message)) {
    throw new Error(`Resend contact failed: ${error.name}: ${error.message}`);
  }
}

export function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}
