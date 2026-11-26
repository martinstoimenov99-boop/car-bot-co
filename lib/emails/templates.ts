import "server-only";
import { createTranslator } from "next-intl";
import { loadMessages } from "@/i18n/messages";
import type { Locale } from "@/i18n/config";
import { escapeHtml as e } from "../email";
import { WA_DISPLAY, waLink, SITE_HOST } from "../site";
import type { Lead, PartnerApplication } from "../validation";

const wrap = (
  inner: string,
) => `<!doctype html><html><body style="margin:0;background:#F3EEE6;padding:24px;font-family:Inter,Arial,sans-serif;color:#1D2026;line-height:1.55">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:18px;padding:28px">
<div style="font-weight:800;font-size:20px;margin-bottom:16px">🚗 Car Bot</div>
${inner}
</div></body></html>`;

const p = (s: string, style = "") => `<p style="margin:0 0 14px;${style}">${e(s)}</p>`;

// ---------- Internal notifications (English, for Martin) ----------

function table(rows: [string, string][]) {
  return `<table cellpadding="8" style="border-collapse:collapse;width:100%;font-size:14px">${rows
    .map(
      ([k, v]) =>
        `<tr><th align="left" style="border-bottom:1px solid #eee;color:#4F4A42;width:130px;vertical-align:top">${e(k)}</th><td style="border-bottom:1px solid #eee">${v}</td></tr>`,
    )
    .join("")}</table>`;
}

const link = (href: string, label = href) =>
  `<a href="${e(href)}" style="color:#A34E12;word-break:break-all">${e(label)}</a>`;

export function leadNotification(lead: Lead, meta: { ref?: string; at: string }) {
  const digits = lead.phone.replace(/\D/g, "");
  const rows: [string, string][] = [
    ["Type", e(lead.type)],
    ["Name", e(`${lead.firstName} ${lead.lastName}`)],
    ["Email", link(`mailto:${lead.email}`, lead.email)],
    ["WhatsApp", `${e(lead.phone)} · ${link(`https://wa.me/${digits}`, "open chat")}`],
  ];
  if (lead.searches?.length) rows.push(["Searches", lead.searches.map((s) => link(s)).join("<br>")]);
  rows.push(
    ["Partner ref", e(meta.ref ?? "none")],
    ["Discount code", e(lead.code ?? "none")],
    ["Locale", e(lead.locale)],
    ["Received", e(meta.at)],
  );
  const subject = `New Car Bot lead: ${lead.type} · ${lead.firstName} ${lead.lastName}`;
  const text = [
    subject,
    `Email: ${lead.email}`,
    `WhatsApp: ${lead.phone} (https://wa.me/${digits})`,
    ...(lead.searches?.length ? ["Searches:", ...lead.searches] : []),
    `Partner ref: ${meta.ref ?? "none"}`,
    `Discount code: ${lead.code ?? "none"}`,
    `Locale: ${lead.locale}`,
    `Received: ${meta.at}`,
  ].join("\n");
  return { subject, html: wrap(`<h2 style="margin:0 0 12px">${e(subject)}</h2>${table(rows)}`), text };
}

const HOW_LABEL: Record<PartnerApplication["how"], string> = {
  calls: "Calls and messages",
  social: "Social media or videos",
  community: "Community or group",
  network: "Business network",
  other: "Something else",
};

export function partnerNotification(app: PartnerApplication, meta: { at: string }) {
  const digits = app.phone.replace(/\D/g, "");
  const subject = `New Car Bot partner: ${app.firstName} ${app.lastName}`;
  const rows: [string, string][] = [
    ["Name", e(`${app.firstName} ${app.lastName}`)],
    ["Email", link(`mailto:${app.email}`, app.email)],
    ["WhatsApp", `${e(app.phone)} · ${link(`https://wa.me/${digits}`, "open chat")}`],
    ["Country", e(app.country || "not given")],
    ["Finds dealers via", e(HOW_LABEL[app.how])],
    ["Referred by", e(app.ref ?? "none")],
    ["Locale", e(app.locale)],
    ["Received", e(meta.at)],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v.replace(/<[^>]+>/g, "")}`).join("\n");
  return { subject, html: wrap(`<h2 style="margin:0 0 12px">${e(subject)}</h2>${table(rows)}`), text };
}

// ---------- Confirmations (localized, to the lead / partner) ----------

async function translator(locale: Locale) {
  const messages = await loadMessages(locale);
  return createTranslator({ locale, messages, namespace: "emails" });
}

export async function leadConfirmation(lead: Lead) {
  const t = await translator(lead.locale);
  const isTest = lead.type === "test";
  const lines = [
    t("lead.greeting", { name: lead.firstName }),
    isTest ? t("lead.bodyTest") : t("lead.bodyPlan"),
    ...(isTest ? [] : [lead.type === "yearly" ? t("lead.planYearly") : t("lead.planMonthly")]),
  ];
  const searches = isTest && lead.searches?.length ? lead.searches : [];
  const contact = t("lead.contact", { phone: WA_DISPLAY });
  const html = wrap(
    lines.map((l) => p(l)).join("") +
      (searches.length
        ? `<p style="margin:0 0 6px;font-weight:600">${e(t("lead.searches"))}</p><ul style="margin:0 0 14px;padding-left:18px">${searches
            .map((s) => `<li>${link(s)}</li>`)
            .join("")}</ul>`
        : "") +
      `<p style="margin:0 0 14px">${e(contact)} · <a href="${e(waLink())}" style="color:#A34E12">WhatsApp</a></p>` +
      p(t("lead.signoff"), "font-weight:600") +
      p(t("lead.footer"), "font-size:12px;color:#4F4A42;margin-top:20px"),
  );
  const text = [
    ...lines,
    ...(searches.length ? [t("lead.searches"), ...searches] : []),
    `${contact} (${waLink()})`,
    t("lead.signoff"),
    "",
    t("lead.footer"),
  ].join("\n\n");
  return { subject: isTest ? t("lead.subjectTest") : t("lead.subjectPlan"), html, text };
}

export async function partnerWelcome(app: PartnerApplication) {
  const t = await translator(app.locale);
  const lines = [t("partner.greeting", { name: app.firstName }), t("partner.body"), t("partner.honesty")];
  const contact = t("partner.contact", { phone: WA_DISPLAY });
  const html = wrap(
    lines.map((l) => p(l)).join("") +
      `<p style="margin:0 0 14px">${e(contact)} · <a href="${e(waLink())}" style="color:#A34E12">WhatsApp</a></p>` +
      p(t("partner.signoff"), "font-weight:600") +
      p(t("partner.footer"), "font-size:12px;color:#4F4A42;margin-top:20px"),
  );
  const text = [...lines, `${contact} (${waLink()})`, t("partner.signoff"), "", t("partner.footer")].join(
    "\n\n",
  );
  return { subject: t("partner.subject"), html, text, site: SITE_HOST };
}
