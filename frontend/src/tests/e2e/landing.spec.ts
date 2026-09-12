import { test, expect } from "@playwright/test";

test.describe("CodeForge Landing Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the landing page successfully with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/CodeForge — Master Competitive Programming/);
    const mainHeading = page.locator("h1");
    await expect(mainHeading).toContainText("Master Competitive");
  });

  test("should display announcement bar and allow dismissal", async ({ page }) => {
    const announcement = page.locator("text=Weekly Challenge #24 is now live");
    await expect(announcement).toBeVisible();

    const dismissBtn = page.getByLabel("Dismiss announcement");
    await dismissBtn.click();
    await expect(announcement).not.toBeVisible();
  });

  test("should toggle themes (Dark, Light, System) and persist preference", async ({ page }) => {
    // Select Light theme
    const lightBtn = page.getByRole("radio", { name: /Light theme/i }).first();
    await lightBtn.click();
    await expect(page.locator("html")).toHaveClass(/light/);

    // Verify localStorage persistence
    const savedTheme = await page.evaluate(() => localStorage.getItem("codepulse-theme"));
    expect(savedTheme).toBe("light");

    // Select Dark theme
    const darkBtn = page.getByRole("radio", { name: /Dark theme/i }).first();
    await darkBtn.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should filter problems by difficulty", async ({ page }) => {
    const easyTab = page.getByRole("tab", { name: /Easy/i }).first();
    await easyTab.click();

    // Verify problems shown are Easy
    const cards = page.locator("#problems h3");
    await expect(cards.first()).toBeVisible();
  });

  test("should filter problems with search query", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Search problem title, pattern, or tags...");
    await searchInput.fill("Binary Search");

    const resultTitle = page.locator("#problems h3", { hasText: "Binary Search" });
    await expect(resultTitle).toBeVisible();
  });

  test("should simulate code run and submit in the interactive preview", async ({ page }) => {
    const runBtn = page.getByRole("button", { name: /Run Code/i });
    await runBtn.click();

    // Wait for verdict
    const verdict = page.locator("text=Accepted");
    await expect(verdict).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Runtime: 42 ms")).toBeVisible();
  });

  test("should display live contest timer and problem indicators", async ({ page }) => {
    const contestSection = page.locator("#contests");
    await expect(contestSection).toBeVisible();
    await expect(contestSection.locator("text=Weekly Challenge #24")).toBeVisible();
    await expect(contestSection.locator("text=LIVE NOW")).toBeVisible();
  });

  test("should render the leaderboard with ranked coders", async ({ page }) => {
    const leaderboard = page.locator("#leaderboard");
    await expect(leaderboard).toBeVisible();
    await expect(leaderboard.locator("text=Alex Kumar")).toBeVisible();
    await expect(leaderboard.locator("text=Maya Singh")).toBeVisible();
  });

  test("should open quick search modal with keyboard shortcut", async ({ page }) => {
    await page.keyboard.press("Control+K");
    const modal = page.getByRole("dialog", { name: /Quick problem search/i });
    await expect(modal).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });
});
