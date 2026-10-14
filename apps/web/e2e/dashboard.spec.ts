import { test, expect } from '@playwright/test';
import { createHmac } from 'node:crypto';

function createMockStudentToken(): string {
  const secret = process.env.AUTH_TOKEN_SECRET ?? 'local-dev-auth-secret';
  const payload = {
    userId: 'test-student-e2e',
    role: 'student',
    fullName: 'Aarav Sharma',
    classLevel: 10,
    email: 'aarav@example.com',
    exp: Math.floor(Date.now() / 1000) + 7200,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encodedPayload).digest('base64url');
  return `${encodedPayload}.${signature}`;
}

test.describe('Dashboard 3-Zone Command Center', () => {
  test.beforeEach(async ({ context }) => {
    const token = createMockStudentToken();
    await context.addCookies([
      {
        name: 'cbse_student_session',
        value: token,
        domain: '127.0.0.1',
        path: '/',
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
  });

  test('dashboard renders Zone 0, Zone 1, Zone 2, and Zone 3 cleanly', async ({ page }) => {
    const response = await page.goto('/dashboard');
    expect(response?.ok()).toBeTruthy();

    // Wait for route loading shell to finish
    await page.waitForSelector('main:not([aria-busy="true"])', { timeout: 15_000 });

    // Zone 0: Header greeting & Board Readiness badge
    await expect(page.locator('header h1')).toContainText('Hey Aarav!');
    const readinessBadge = page.locator('a[href="/readiness"]');
    await expect(readinessBadge).toBeVisible();
    await expect(readinessBadge).toContainText('Board Readiness:');

    // Zone 1: Bento Grid (2fr 1fr)
    // Left column: NextStep Hero card with exactly 1 solid primary CTA
    const heroCard = page.locator('section[aria-label*="Starter Mission"], section[aria-label*="Active Chapter"], section[aria-label*="Targeted Revision"]').first();
    await expect(heroCard).toBeVisible();
    await expect(heroCard).toContainText("Today's Mission:");

    // Right column: Daily Recall Dock
    const recallDock = page.locator('aside[aria-label="Daily Recall Dock"]');
    await expect(recallDock).toBeVisible();
    await expect(recallDock.locator('h3')).toContainText('Daily Recall');
    await expect(recallDock).toContainText('MISTAKE VAULT');
    await expect(recallDock.locator('a[href="/my-mistakes"]')).toBeVisible();

    // Zone 2: My Subjects with horizontal filter pill bar
    const subjectsSection = page.locator('section[aria-label="My Subjects"]');
    await expect(subjectsSection).toBeVisible();
    await expect(subjectsSection.locator('h2')).toContainText('My Subjects');
    await expect(subjectsSection.getByRole('tab', { name: 'All', exact: true })).toBeVisible();
    await expect(subjectsSection.getByRole('tab', { name: 'Science', exact: true })).toBeVisible();
    await expect(subjectsSection.getByRole('tab', { name: 'Mathematics', exact: true })).toBeVisible();
    await expect(subjectsSection.getByRole('tab', { name: 'Social Science', exact: true })).toBeVisible();
    await expect(subjectsSection.getByRole('tab', { name: 'English', exact: true })).toBeVisible();
    await expect(subjectsSection.getByRole('tab', { name: 'Hindi', exact: true })).toBeVisible();

    // Zone 3: Quick Tools Dock
    const quickToolsSection = page.locator('section[aria-label="Quick Tools Dock"]');
    await expect(quickToolsSection).toBeVisible();
    await expect(quickToolsSection.locator('h2')).toContainText('Quick Tools');
    await expect(quickToolsSection.locator('a[href="/virtual-lab"]')).toBeVisible();
    await expect(quickToolsSection.locator('a[href="/formula-cheatsheets"]')).toBeVisible();
    await expect(quickToolsSection.locator('a[href="/pyq-trends"]')).toBeVisible();
    await expect(quickToolsSection.locator('a[href="/exam-papers"]')).toBeVisible();

    // Verify eviction of redundant hubs
    await expect(page.locator('section[aria-label="Practice Hub"]')).toHaveCount(0);
    await expect(page.locator('aside[aria-label="Sidebar HUD"]')).toHaveCount(0);
  });
});
