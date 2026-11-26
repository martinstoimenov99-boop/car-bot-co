import { afterEach, describe, expect, it, vi } from "vitest";
import { recordSubmission, type LeadSink } from "@/lib/leads";
import { leadConfirmation, leadNotification } from "@/lib/emails/templates";
import type { Lead } from "@/lib/schemas";

const lead: Lead = {
  type: "test",
  firstName: "Marko <b>",
  lastName: "M",
  email: "m@x.mk",
  phone: "+389 70 123 456",
  consent: true,
  locale: "en",
  searches: ["https://suchen.mobile.de/x?a=1&b=2"],
  ref: "ABC",
  code: undefined,
  website: undefined,
};
const record = { kind: "lead" as const, data: lead, ref: "ABC", at: "2026-01-01T00:00:00Z" };
const sink = (name: string, critical: boolean, fail = false): LeadSink => ({
  name,
  critical,
  enabled: () => true,
  handle: fail ? () => Promise.reject(new Error("boom")) : () => Promise.resolve(),
});

afterEach(() => vi.restoreAllMocks());

describe("recordSubmission", () => {
  it("is delivered when one critical sink succeeds", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await recordSubmission(record, [sink("email", true, true), sink("webhook", true)]);
    expect(r.delivered).toBe(true);
  });
  it("fails when every critical sink fails, even if others succeed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const r = await recordSubmission(record, [sink("email", true, true), sink("audience", false)]);
    expect(r.delivered).toBe(false);
  });
});

describe("email templates", () => {
  it("escapes HTML and includes ref, searches and a wa.me link", () => {
    const m = leadNotification(lead, { ref: "ABC", at: record.at });
    expect(m.subject).toBe("New Car Bot lead: test · Marko <b> M");
    expect(m.html).toContain("Marko &lt;b&gt;");
    expect(m.html).not.toContain("Marko <b>");
    expect(m.html).toContain("https://wa.me/38970123456");
    expect(m.html).toContain("a=1&amp;b=2");
    expect(m.text).toContain("Partner ref: ABC");
  });
  it("localizes the confirmation", async () => {
    const en = await leadConfirmation(lead);
    expect(en.text).toContain("We got your searches");
    const mk = await leadConfirmation({ ...lead, locale: "mk" });
    expect(mk.subject.length).toBeGreaterThan(0);
  });
});
