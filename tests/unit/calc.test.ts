import { describe, expect, it } from "vitest";
import { partnerEarnings, roi } from "@/lib/calc";
import { formatEuro } from "@/lib/format";

describe("partnerEarnings", () => {
  it("one dealership per month is worth €6,050 over 12 months", () => {
    expect(partnerEarnings(1).perCohort).toBe(6050);
  });
  it("2 clients/month → €12,100 year total and €1,200/month at month 12", () => {
    const r = partnerEarnings(2);
    expect(r.yearTotal).toBe(12100);
    expect(r.monthlyAt12).toBe(1200);
    expect(r.totalClients).toBe(24);
  });
  it("per dealership year one is €800", () => {
    expect(partnerEarnings(1).perDealershipYearOne).toBe(800);
  });
  it("scales linearly up to 6 clients", () => {
    expect(partnerEarnings(6).yearTotal).toBe(36300);
    expect(partnerEarnings(6).monthlyAt12).toBe(3600);
  });
});

describe("roi", () => {
  it("defaults: 1 car × €1,500, yearly", () => {
    const r = roi({ extra: 1, margin: 1500, plan: "yearly" });
    expect(r.gain).toBe(18000);
    expect(r.cost).toBe(3000);
    expect(r.net).toBe(15000);
    expect(r.cars).toBe(2);
    expect(r.monthsCovered).toBe(6);
    expect(r.gainBar).toBe(100);
    expect(r.costBar).toBeCloseTo(16.67, 1);
  });
  it("monthly plan costs €3,500 in year one", () => {
    const r = roi({ extra: 1, margin: 1500, plan: "monthly" });
    expect(r.cost).toBe(3500);
    expect(r.cars).toBe(3);
  });
  it("zero extra cars gives a negative net", () => {
    const r = roi({ extra: 0, margin: 1000, plan: "monthly" });
    expect(r.net).toBe(-3500);
    expect(r.costBar).toBe(100);
    expect(r.gainBar).toBe(0);
    expect(r.monthsCovered).toBe(4);
  });
});

describe("formatEuro", () => {
  it("formats English and Macedonian consistently", () => {
    expect(formatEuro(12100, "en")).toBe("€12,100");
    expect(formatEuro(12100, "mk")).toBe("12.100 €");
    expect(formatEuro(-3500, "en")).toBe("−€3,500");
    expect(formatEuro(15000, "en", { sign: true })).toBe("+€15,000");
    expect(formatEuro(800, "mk")).toBe("800 €");
  });
});
