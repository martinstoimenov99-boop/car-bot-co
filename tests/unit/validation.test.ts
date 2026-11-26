import { describe, expect, it } from "vitest";
import { checkContact, parseSearches } from "@/lib/validation";
import { leadSchema, partnerSchema } from "@/lib/schemas";

const link = "https://suchen.mobile.de/fahrzeuge/search.html?ms=25200";

describe("parseSearches", () => {
  it("needs at least one link", () => {
    expect(parseSearches("  \n \n").error).toBe("empty");
  });
  it("allows up to 3", () => {
    expect(parseSearches([link, link, link].join("\n")).error).toBeNull();
    expect(parseSearches([link, link, link, link].join("\n")).error).toBe("tooMany");
  });
  it("only accepts mobile.de", () => {
    expect(parseSearches("https://www.autoscout24.de/lst").error).toBe("notMobile");
    expect(parseSearches("https://evilmobile.de/x").error).toBe("notMobile");
    expect(parseSearches("https://m.mobile.de/x").error).toBeNull();
    expect(parseSearches("https://mobile.de/x").error).toBeNull();
  });
  it("ignores blank rows and trims", () => {
    const r = parseSearches(`\n  ${link}  \n\n`);
    expect(r.lines).toEqual([link]);
  });
});

describe("checkContact", () => {
  const ok = { firstName: "Marko", lastName: "M", email: "m@x.mk", phone: "+389 70 123 456", consent: true };
  it("passes a good contact", () => expect(checkContact(ok)).toBeNull());
  it("flags in design order", () => {
    expect(checkContact({ ...ok, lastName: " " })).toBe("name");
    expect(checkContact({ ...ok, email: "nope" })).toBe("email");
    expect(checkContact({ ...ok, phone: "12 34" })).toBe("phone");
    expect(checkContact({ ...ok, consent: false })).toBe("consent");
  });
});

describe("leadSchema", () => {
  const base = {
    firstName: "  Marko ",
    lastName: "Markovski",
    email: "Marko@Example.com ",
    phone: "+389 70 123 456",
    consent: true as const,
    locale: "mk",
  };
  it("requires searches for the free test", () => {
    expect(leadSchema.safeParse({ ...base, type: "test" }).success).toBe(false);
    const r = leadSchema.safeParse({ ...base, type: "test", searches: [link] });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.firstName).toBe("Marko");
      expect(r.data.email).toBe("marko@example.com");
    }
  });
  it("drops searches for plans and validates the ref", () => {
    const r = leadSchema.safeParse({ ...base, type: "yearly", searches: [link], ref: "ABC" });
    expect(r.success && r.data.searches).toBe(undefined);
    expect(leadSchema.safeParse({ ...base, type: "yearly", ref: "bad ref!" }).success).toBe(false);
  });
  it("rejects missing consent and over-long names", () => {
    expect(leadSchema.safeParse({ ...base, type: "monthly", consent: false }).success).toBe(false);
    expect(leadSchema.safeParse({ ...base, type: "monthly", firstName: "x".repeat(81) }).success).toBe(false);
  });
  it("rejects non-mobile.de searches server-side", () => {
    expect(leadSchema.safeParse({ ...base, type: "test", searches: ["https://x.com/"] }).success).toBe(false);
  });
});

describe("partnerSchema", () => {
  it("validates how", () => {
    const base = { firstName: "A", lastName: "B", email: "a@b.co", phone: "+38970123456", consent: true };
    expect(partnerSchema.safeParse({ ...base, how: "calls", locale: "en" }).success).toBe(true);
    expect(partnerSchema.safeParse({ ...base, how: "spam", locale: "en" }).success).toBe(false);
  });
});
