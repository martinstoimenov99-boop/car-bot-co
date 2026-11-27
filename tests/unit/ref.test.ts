import { describe, expect, it } from "vitest";
import { isValidRef, refFromSearchParams } from "@/lib/ref";

describe("partner code", () => {
  it("reads ?ref and ?partner", () => {
    expect(refFromSearchParams(new URLSearchParams("ref=ABC"))).toBe("ABC");
    expect(refFromSearchParams(new URLSearchParams("partner=Ana_10"))).toBe("Ana_10");
  });
  it("rejects anything that is not 2–32 letters, digits, - or _", () => {
    expect(refFromSearchParams(new URLSearchParams("ref=a"))).toBeNull();
    expect(refFromSearchParams(new URLSearchParams("ref=<script>"))).toBeNull();
    expect(refFromSearchParams(new URLSearchParams("ref=" + "x".repeat(33)))).toBeNull();
    expect(isValidRef("bad code")).toBe(false);
    expect(isValidRef("GOOD-code_1")).toBe(true);
  });
});
