import { test, expect } from '@playwright/test';

test.describe('board exam drill', () => {
  test.beforeEach(async ({ page }) => {
    const response = await page.goto('/chapters/life-processes/notes');
    expect(response?.ok()).toBeTruthy();
    await expect(page.locator('#board-exam-drill')).toBeVisible();
  });

  test('answer demand stays hidden until the student reveals it', async ({ page }) => {
    const first = page.locator('#board-exam-drill .pyq-card').first();
    await expect(first).toBeVisible();

    await expect(first.locator('.pyq-demand-box')).toBeHidden();
    await expect(first.locator('.pyq-topic-row')).toBeHidden();
    await expect(first.locator('.pyq-attempt-hint')).toBeVisible();

    await first.getByRole('button', { name: 'Reveal Answer Demand' }).click();
    await expect(first.locator('.pyq-topic-row')).toContainText('Aerobic Respiration');
    const demandItems = first.locator('.pyq-demand-box ul li');
    expect(await demandItems.count()).toBe(3);
    await expect(demandItems.first()).toContainText('Aerobic Respiration');
    await expect(first.locator('.pyq-find-row').first()).toContainText('Official source:');

    await first.getByRole('button', { name: 'Hide Answer Demand' }).click();
    await expect(first.locator('.pyq-demand-box')).toBeHidden();
    await expect(first.locator('.pyq-attempt-hint')).toBeVisible();
  });

  test('header shows per-set chapter weightage', async ({ page }) => {
    const strip = page.locator('#board-exam-drill .pyq-weightage-strip');
    await expect(strip).toBeVisible();
    await expect(strip).toContainText('Chapter weightage:');
    await expect(strip).toContainText('2026 Set 31/3/1: 9 marks (3 Qs)');
  });

  test('first card shows the verbatim board question', async ({ page }) => {
    const first = page.locator('#board-exam-drill .pyq-card').first();
    const row = first.locator('.pyq-question-row');
    await expect(row).toBeVisible();
    await expect(row).toContainText('What kind of respiration provides more energy and why?');
  });

  test('reveal toggles the marking rubric', async ({ page }) => {
    const first = page.locator('#board-exam-drill .pyq-card').first();
    await expect(first.getByRole('button', { name: 'Step Marking' })).toBeHidden();
    await first.getByRole('button', { name: 'Reveal Answer Demand' }).click();
    const toggle = first.getByRole('button', { name: 'Step Marking' });
    const rubric = first.locator('.cbse-rubric-card');

    await expect(rubric).toBeHidden();
    await toggle.click();
    await expect(rubric).toBeVisible();
    await expect(toggle).toContainText('Hide CBSE Marking Scheme');
    await toggle.click();
    await expect(rubric).toBeHidden();
  });
});
