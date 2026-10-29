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

test.describe('Parent Progress Summary (/parent-summary)', () => {
  test('unauthenticated visitors are redirected to login', async ({ page }) => {
    await page.goto('/parent-summary');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fparent-summary/);
  });

  test('authenticated student parent summary renders calm high-trust metrics', async ({ page, context }) => {
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

    const response = await page.goto('/parent-summary');
    expect(response?.ok()).toBeTruthy();

    // Verify Heading
    await expect(page.locator('h1')).toContainText("Aarav Sharma's Weekly Progress");

    // Verify Status Banner
    const statusBanner = page.locator('section[aria-label="Consistency status"]');
    await expect(statusBanner).toBeVisible();

    // Verify Stats Grid
    const statsGrid = page.locator('section[aria-label="Progress at a glance"]');
    await expect(statsGrid).toBeVisible();
    await expect(statsGrid).toContainText('DAILY HABIT');
    await expect(statsGrid).toContainText('SYLLABUS STARTED');
    await expect(statsGrid).toContainText('BOARD READINESS');

    // Verify Subject Breakdown
    const subjectsSection = page.locator('section[aria-labelledby="subjects-progress-heading"]');
    await expect(subjectsSection).toBeVisible();
    await expect(subjectsSection).toContainText('Science');
    await expect(subjectsSection).toContainText('Mathematics');

    // Verify Practical Tips for Parents
    const guidanceSection = page.locator('section[aria-labelledby="guidance-heading"]');
    await expect(guidanceSection).toBeVisible();
    await expect(guidanceSection).toContainText('Practical Tips for Supporting Aarav');

    // Verify Action Buttons
    const whatsappBtn = page.locator('a[title*="WhatsApp"]');
    await expect(whatsappBtn).toBeVisible();
    await expect(whatsappBtn).toHaveAttribute('href', /api\.whatsapp\.com/);

    const printBtn = page.locator('button[title*="Print"]');
    await expect(printBtn).toBeVisible();

    // Verify Back link
    const backLink = page.locator('a[href="/dashboard"]');
    await expect(backLink.first()).toBeVisible();
  });
});
