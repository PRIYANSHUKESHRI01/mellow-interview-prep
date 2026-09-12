import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCompactNumber,
  formatTimeRemaining,
  getDifficultyStyle,
} from "@/lib/formatters";

describe("formatters library", () => {
  describe("formatNumber", () => {
    it("formats thousands with commas", () => {
      expect(formatNumber(12482)).toBe("12,482");
      expect(formatNumber(1000000)).toBe("1,000,000");
      expect(formatNumber(0)).toBe("0");
    });
  });

  describe("formatCompactNumber", () => {
    it("converts thousands to K+ format", () => {
      expect(formatCompactNumber(25000)).toBe("25K+");
      expect(formatCompactNumber(100000)).toBe("100K+");
    });

    it("converts millions to M+ format", () => {
      expect(formatCompactNumber(1500000)).toBe("1.5M+");
    });

    it("leaves numbers under 1000 as is", () => {
      expect(formatCompactNumber(500)).toBe("500");
    });
  });

  describe("formatTimeRemaining", () => {
    it("correctly breaks seconds into hours, minutes, and seconds", () => {
      // 1 hour, 42 minutes, 18 seconds = 3600 + 2520 + 18 = 6138 seconds
      const res = formatTimeRemaining(6138);
      expect(res.hours).toBe("01");
      expect(res.minutes).toBe("42");
      expect(res.seconds).toBe("18");
      expect(res.formatted).toBe("01:42:18");
    });

    it("handles zero or negative seconds", () => {
      const res = formatTimeRemaining(0);
      expect(res.formatted).toBe("00:00:00");

      const neg = formatTimeRemaining(-50);
      expect(neg.formatted).toBe("00:00:00");
    });
  });

  describe("getDifficultyStyle", () => {
    it("returns emerald styling for Easy", () => {
      const style = getDifficultyStyle("Easy");
      expect(style.badgeClass).toContain("emerald");
    });

    it("returns amber styling for Medium", () => {
      const style = getDifficultyStyle("Medium");
      expect(style.badgeClass).toContain("amber");
    });

    it("returns rose styling for Hard", () => {
      const style = getDifficultyStyle("Hard");
      expect(style.badgeClass).toContain("rose");
    });
  });
});
