const { test, expect } = require('@playwright/test');

test('XSS vulnerability prevention', async ({ page }) => {
  await page.route('**/data/manifest.json', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(['xss.json']),
    });
  });

  const xssPayload = '<img src=x onerror=window.xssDetected=true>';

  await page.route('**/data/prompts/xss.json', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'xss-test',
          title: xssPayload,
          category: xssPayload,
          tag: xssPayload,
          description: xssPayload,
          author: xssPayload,
          body: 'XSS body',
          usecase: [xssPayload],
          difficulty: 'beginner'
        }
      ]),
    });
  });

  await page.goto('/');

  // Wait for the prompt to be rendered in the grid
  await page.waitForSelector('.prompt-card');

  // Give it a moment to potentially execute scripts
  await page.waitForTimeout(500);

  // Check if XSS triggered
  const xssDetected = await page.evaluate(() => window.xssDetected);
  expect(xssDetected).toBeUndefined();

  // Open the full view modal
  await page.click('[id^="fullview-"]');
  await page.waitForSelector('.modal');

  await page.waitForTimeout(500);

  const xssDetectedModal = await page.evaluate(() => window.xssDetected);
  expect(xssDetectedModal).toBeUndefined();

  // Verify that the payload is actually rendered as text (escaped)
  const modalTitle = await page.locator('.modal-title').innerHTML();
  expect(modalTitle).toContain('&lt;img');
});
