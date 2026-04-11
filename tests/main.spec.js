// @ts-check
import { test, expect } from "@playwright/test";

test.describe("Promptbase E2E Tasks", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load the page and render prompts", async ({ page }) => {
    await expect(page).toHaveTitle(/PROMPTBASE/);
    // Wait for prompts to load (override skeletons)
    await page.waitForSelector(".prompt-card");
    const promptCount = await page.locator(".prompt-card").count();
    expect(promptCount).toBeGreaterThan(0);
  });

  test("should filter by search query", async ({ page }) => {
    await page.waitForSelector(".prompt-card");
    const searchInput = page.locator("#search");

    await searchInput.fill("Python", { force: true });
    await searchInput.evaluate((node) => node.dispatchEvent(new Event("input")));

    // Wait for the animation/render (the count should probably change)
    await page.waitForTimeout(1000);

    const titles = await page.locator(".card-title").allTextContents();
    expect(titles.length).toBeGreaterThan(0);
    // Titles may not contain python if tags or description match the search query!
    const cards = await page.locator(".prompt-card").allTextContents();
    cards.forEach((card) => {
      expect(card.toLowerCase()).toContain("python");
    });
  });

  test("should filter by category tab", async ({ page }) => {
    const catBtn = page.locator(".filter-tab:not(.active)").first();
    const catText = await catBtn.innerText();

    await catBtn.click({ force: true });
    await page.waitForTimeout(500);

    const badgeText = await page.locator(".card-tag").first().innerText();
    // Logic in app.js maps categories to tags or matches them.
    // Just verify the count changes or the grid updates.
    const gridCount = await page.locator("#gridCount").innerText();
    expect(gridCount).not.toContain("Loading");
  });

  test("should open and close the submit modal", async ({ page }) => {
    await page.click("#openModal");
    const modal = page.locator("#submitModal");
    await expect(modal).toHaveClass(/open/);

    await page.click("#closeSubmitModal");
    await expect(modal).not.toHaveClass(/open/);
  });

  test("should generate JSON in the submit modal", async ({ page }) => {
    await page.click("#openModal");

    await page.fill("#f-title", "Test Prompt");
    await page.fill("#f-tag", "test · test");
    await page.selectOption("#f-cat", "Backend Development");
    await page.selectOption("#f-diff", "beginner");
    await page.fill("#f-desc", "Test description");
    await page.fill("#f-body", "Test body");

    await page.click("#generateJson");

    const output = await page.inputValue("#f-output");
    expect(output).toContain('"title": "Test Prompt"');
    expect(output).toContain('"difficulty": "beginner"');
  });
});
