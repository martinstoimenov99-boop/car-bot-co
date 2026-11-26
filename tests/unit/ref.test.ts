import { describe, expect, it } from "vitest";
import { REF_REPLACE_AFTER_MS, encodeRef, nextRefValue, parseRef, refFromSearchParams } from "@/lib/ref";

describe("ref helpers", () => {
  it("reads ?ref and ?partner, validates the code", () => {
    expect(refFromSearchParams(new URLSearchParams("ref=ABC"))).toBe("ABC");
    expect(refFromSearchParams(new URLSearchParams("partner=Ana_10"))).toBe("Ana_10");
    expect(refFromSearchParams(new URLSearchParams("ref=a"))).toBeNull();
    expect(refFromSearchParams(new URLSearchParams("ref=<script>"))).toBeNull();
    expect(refFromSearchParams(new URLSearchParams("ref=" + "x".repeat(33)))).toBeNull();
  });
  it("first click wins", () => {
    const now = Date.now();
    const first = nextRefValue(undefined, "AAA", now)!;
    expect(parseRef(first)?.code).toBe("AAA");
    expect(nextRefValue(first, "BBB", now + 1000)).toBeNull();
    expect(nextRefValue(first, "AAA", now + 1000)).toBeNull();
  });
  it("a newer click wins after 30 days", () => {
    const now = Date.now();
    const old = encodeRef("AAA", now - REF_REPLACE_AFTER_MS - 1);
    expect(parseRef(nextRefValue(old, "BBB", now))?.code).toBe("BBB");
  });
  it("ignores garbage cookies", () => {
    expect(parseRef("%%%")).toBeNull();
    expect(nextRefValue("bad value", "CCC", 1)).toBe(encodeRef("CCC", 1));
  });
});
