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
    const parts = notes.locator('details.complete-chapter-part');
    expect(await parts.count()).toBeGreaterThanOrEqual(2);
    expect(await notes.locator('details.complete-chapter-part[open]').count()).toEqual(1);

    const partLinks = page.locator('.complete-chapter-sidebar a.chapter-part-link');
    const secondHref = await partLinks.nth(1).getAttribute('href');
    expect(secondHref).toMatch(/^#lesson-/);
    await partLinks.nth(1).click();
    const targetPart = page.locator(secondHref!);
    await expect(targetPart).toHaveAttribute('open', '');
    await expect(targetPart).toBeInViewport();

    const drillLink = page.locator('.complete-chapter-sidebar a[href="#board-exam-drill"]');
    await expect(drillLink).toBeVisible();
    await drillLink.click();
    await expect(page.locator('#board-exam-drill')).toBeInViewport();
  });

  test('chapter notes deep link opens its part', async ({ page }) => {
    await page.goto('/chapters/life-processes/notes');
    const secondHref = await page
      .locator('.complete-chapter-sidebar a.chapter-part-link')
      .nth(1)
      .getAttribute('href');
    expect(secondHref).toMatch(/^#lesson-/);

    // Fresh load with a hash exercises the initial-load path of the focus
    // handler: the target part must open itself before scrolling.
    await page.goto('/');
    const response = await page.goto(`/chapters/life-processes/notes${secondHref}`);
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator(secondHref!)).toHaveAttribute('open', '');
  });
});
