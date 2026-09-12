import { describe, it, expect } from "vitest";
import { PROBLEMS_DATA } from "@/data/problems";
import { CONTESTS_DATA } from "@/data/contests";
import { LEADERBOARD_DATA } from "@/data/leaderboard";
import { PLATFORM_STATS, DEMO_USER_STATS } from "@/data/stats";
import { LANGUAGES_DATA } from "@/data/languages";

describe("centralized dummy data integrity", () => {
  it("validates problems dataset structure", () => {
    expect(PROBLEMS_DATA.length).toBeGreaterThanOrEqual(10);
    PROBLEMS_DATA.forEach((p) => {
      expect(p.id).toBeDefined();
      expect(p.title.length).toBeGreaterThan(0);
      expect(["Easy", "Medium", "Hard"]).toContain(p.difficulty);
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.acceptanceRate).toBeGreaterThan(0);
      expect(p.acceptanceRate).toBeLessThanOrEqual(100);
    });
  });

  it("validates contests dataset structure", () => {
    expect(CONTESTS_DATA.length).toBeGreaterThanOrEqual(2);
    const liveContest = CONTESTS_DATA.find((c) => c.status === "LIVE");
    expect(liveContest).toBeDefined();
    expect(liveContest?.problems.length).toBeGreaterThanOrEqual(3);
    liveContest?.problems.forEach((p) => {
      expect(p.code).toBeDefined();
      expect(p.points).toBeGreaterThan(0);
    });
  });

  it("validates leaderboard dataset rankings", () => {
    expect(LEADERBOARD_DATA.length).toBeGreaterThanOrEqual(5);
    // Validate ranks are sequential from 1
    LEADERBOARD_DATA.forEach((u, i) => {
      expect(u.rank).toBe(i + 1);
      expect(u.rating).toBeGreaterThan(2000);
      expect(u.handle).toBeDefined();
    });
  });

  it("validates supported languages and default snippets", () => {
    expect(LANGUAGES_DATA.length).toBeGreaterThanOrEqual(4);
    LANGUAGES_DATA.forEach((lang) => {
      expect(lang.id).toBeDefined();
      expect(lang.defaultSnippet.length).toBeGreaterThan(20);
      expect(lang.compiler.length).toBeGreaterThan(0);
    });
  });

  it("validates user profile statistics", () => {
    expect(DEMO_USER_STATS.rating).toBe(1842);
    expect(DEMO_USER_STATS.solved).toBe(327);
    expect(DEMO_USER_STATS.currentStreak).toBe(21);
    expect(DEMO_USER_STATS.easyCount + DEMO_USER_STATS.mediumCount + DEMO_USER_STATS.hardCount).toBe(
      DEMO_USER_STATS.solved
    );
  });
});
