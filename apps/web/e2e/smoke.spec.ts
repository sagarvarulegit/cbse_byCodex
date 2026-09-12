import { test, expect } from '@playwright/test';

test.describe('student smoke', () => {
  test('homepage loads with hero', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('main.home-page')).toBeVisible();
    await expect(page.locator('h1#hero-title')).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
  });

  test('chapter notes render with sidebar drill link', async ({ page }) => {
    const response = await page.goto('/chapters/life-processes/notes');
    expect(response?.ok()).toBeTruthy();

    const notes = page.locator('#chapter-notes');
    await expect(notes).toBeVisible();
    expect(await notes.locator('section[id^="lesson-"]').count()).toBeGreaterThanOrEqual(2);

    const drillLink = page.locator('.complete-chapter-sidebar a[href="#board-exam-drill"]');
    await expect(drillLink).toBeVisible();
    await drillLink.click();
    await expect(page.locator('#board-exam-drill')).toBeInViewport();
  });
});
