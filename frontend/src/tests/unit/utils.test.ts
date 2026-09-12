import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn utility", () => {
  it("merges standard class names", () => {
    const result = cn("px-4", "py-2", "text-sm");
    expect(result).toContain("px-4");
    expect(result).toContain("py-2");
    expect(result).toContain("text-sm");
  });

  it("resolves conflicting tailwind classes using tailwind-merge", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("handles conditional classes correctly", () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn("base-class", isTrue && "active-class", isFalse && "inactive-class");
    expect(result).toBe("base-class active-class");
  });

  it("handles null, undefined, and false values cleanly", () => {
    const result = cn("base", null, undefined, false, "extra");
    expect(result).toBe("base extra");
  });
});
