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

test.describe('Dashboard: one screen, one question', () => {
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

  test('new student sees a greeting, one plan with one button, and subject tiles', async ({ page }) => {
    const response = await page.goto('/dashboard');
    expect(response?.ok()).toBeTruthy();

    // Wait for route loading shell to finish
    await page.waitForSelector('main:not([aria-busy="true"])', { timeout: 15_000 });

    // Greeting
    await expect(page.locator('header h1')).toContainText('Hi Aarav');

    // Readiness stays hidden until the student has enough quiz / paper data
    await expect(page.locator('a[href="/readiness"]')).toHaveCount(0);

    // Today's plan: three steps and exactly one primary button
    const plan = page.locator('section[aria-label="Today\'s plan"]');
    await expect(plan).toBeVisible();
    await expect(plan.locator('ol li')).toHaveCount(3);
    await expect(plan.getByRole('link', { name: /Start lesson|Continue lesson|Take the quiz|Fix my mistakes|Start revision|Keep going/ })).toHaveCount(1);
    await expect(plan.getByRole('link', { name: 'Choose another chapter' })).toBeVisible();

    // Subject tiles: five core subjects, no filter tabs
    const subjects = page.locator('section[aria-labelledby="my-subjects-heading"]');
    await expect(subjects.locator('h2')).toHaveText('My subjects');
    await expect(subjects.locator('li')).toHaveCount(5);
    await expect(subjects.getByRole('tab')).toHaveCount(0);

    // Old clutter is gone
    await expect(page.locator('aside[aria-label="Daily Recall Dock"]')).toHaveCount(0);
    await expect(page.locator('section[aria-label="Quick Tools Dock"]')).toHaveCount(0);
    await expect(page.getByText('MISTAKE VAULT')).toHaveCount(0);

    // Tools are one quiet link away
    await expect(page.locator('main a[href="/tools"]')).toBeVisible();
  });
});
