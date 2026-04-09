# Testing Strategy - Promptbase

## Overview
Promptbase uses an automated End-to-End (E2E) testing strategy to ensure UI reliability and data integrity. This document explains how to run, maintain, and expand the test suite.

## Tooling
- **Engine**: [Playwright](https://playwright.dev/)
- **Target**: Desktop Chrome (default)
- **Environment**: Local dev server (port 5500)

## Core Tests
Tests are located in [tests/main.spec.js](/g:/DEVELOPMENT/promptbase/tests/main.spec.js).

1. **Smoke Test**: Verifies the site loads and renders the initial batch of prompts.
2. **Category Filtering**: Checks that clicking tabs correctly subsets the visible grid.
3. **Search Logic**: Validates that the search bar correctly filters titles, tags, and bodies.
4. **Interactive Modals**: Verifies opening/closing the Submission and Full-view modals.
5. **JSON Generator**: Tests the form logic that produces the contribution JSON output.

## Execution

### Run all tests
```bash
npx playwright test
```

### Run in UI Mode (Debugging)
```bash
npx playwright test --ui
```

## Maintenance & Expansion

### Adding a Test
When adding a new feature (e.g., a new sort type), add a test case in `tests/main.spec.js`:
```javascript
test('should sort alphabetically', async ({ page }) => {
  await page.selectOption('#sortSelect', 'alpha');
  // verification logic here
});
```

### Visual Regression
For UI-sensitive changes, use Playwright's snapshot feature:
```javascript
await expect(page).toHaveScreenshot('landing-page.png');
```

## Troubleshooting

### Visibility Failures
Due to the "sticky" nature of the toolbar and hero animations, some elements might be reported as "hidden" during fast execution.
- **Solution**: Use `element.waitFor({ state: 'visible' })` or `element.scrollIntoViewIfNeeded()`.

---
Last updated: 2026-04-09
Maintainer: Jules Martins (@julesklord)
