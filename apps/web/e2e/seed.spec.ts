import { test, expect } from '@playwright/test';

test.describe('ChapterReady Platform Seed', () => {
  test('seed', async ({ page }) => {
    // Navigate to platform home page and ensure core layout is ready
    await page.goto('/');
    await expect(page.locator('main.home-page')).toBeVisible();
    await expect(page.locator('h1#hero-title')).toBeVisible();
  });
});

