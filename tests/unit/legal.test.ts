import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import mk from "@/messages/mk.json";
import { fillLegal } from "@/lib/legal";

function strings(o: unknown, out: string[] = []): string[] {
  if (typeof o === "string") out.push(o);
  else if (Array.isArray(o)) o.forEach((v) => strings(v, out));
  else if (o && typeof o === "object") Object.values(o).forEach((v) => strings(v, out));
  return out;
}

describe("legal pages", () => {
  for (const [name, messages] of [
    ["en", en],
    ["mk", mk],
  ] as const) {
    it(`${name}: every {{TOKEN}} has a value (no placeholders can reach the page)`, () => {
      const unresolved = strings(messages.legal).flatMap((s) => fillLegal(s).filter((p) => p.placeholder));
      expect(unresolved).toEqual([]);
    });
  }
  it("names the business and the contact address", () => {
    const text = strings(en.legal.privacy)
      .flatMap((s) => fillLegal(s).map((p) => p.text))
      .join(" ");
    expect(text).toContain("Smartin Labs");
    expect(text).toContain("info@getcarbot.co");
    expect(text).not.toMatch(/company number|registered/i);
  });
});
