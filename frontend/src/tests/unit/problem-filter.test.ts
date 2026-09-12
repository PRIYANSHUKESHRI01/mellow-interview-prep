import { describe, it, expect } from "vitest";
import { filterProblems } from "@/lib/utils";
import { PROBLEMS_DATA } from "@/data/problems";

describe("filterProblems utility", () => {
  it("returns all problems when filter is All and search is empty", () => {
    const results = filterProblems(PROBLEMS_DATA, "", "All");
    expect(results.length).toBe(PROBLEMS_DATA.length);
  });

  it("filters problems by difficulty Easy", () => {
    const results = filterProblems(PROBLEMS_DATA, "", "Easy");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      expect(p.difficulty).toBe("Easy");
    });
  });

  it("filters problems by difficulty Medium", () => {
    const results = filterProblems(PROBLEMS_DATA, "", "Medium");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      expect(p.difficulty).toBe("Medium");
    });
  });

  it("filters problems by difficulty Hard", () => {
    const results = filterProblems(PROBLEMS_DATA, "", "Hard");
    expect(results.length).toBeGreaterThan(0);
    results.forEach((p) => {
      expect(p.difficulty).toBe("Hard");
    });
  });

  it("filters by search query matching title", () => {
    const results = filterProblems(PROBLEMS_DATA, "Two Sum", "All");
    expect(results.some((p) => p.title === "Two Sum")).toBe(true);
  });

  it("filters by search query matching tags", () => {
    const results = filterProblems(PROBLEMS_DATA, "Binary Search", "All");
    expect(results.length).toBeGreaterThan(0);
  });

  it("returns empty array for non-matching query", () => {
    const results = filterProblems(PROBLEMS_DATA, "NonExistentAlgorithmQueryXYZ", "All");
    expect(results.length).toBe(0);
  });

  it("supports combined difficulty and search query", () => {
    const results = filterProblems(PROBLEMS_DATA, "Array", "Easy");
    results.forEach((p) => {
      expect(p.difficulty).toBe("Easy");
      const match =
        p.title.toLowerCase().includes("array") ||
        p.tags.some((t) => t.toLowerCase().includes("array"));
      expect(match).toBe(true);
    });
  });
});
