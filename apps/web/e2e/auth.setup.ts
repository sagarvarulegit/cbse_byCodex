import { test as setup, expect } from '@playwright/test';

const AUTH_FILE = './e2e/.auth/user.json';

// One-time login: saves the student session cookie for every spec.
// Needs E2E_EMAIL/E2E_PASSWORD (a throwaway student account) and the
// full local stack (Next on :3000 + API on :4000), since login and
// session checks hit the learning API.
setup('authenticate as student', async ({ page }) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;
  setup.skip(!email || !password, 'Set E2E_EMAIL and E2E_PASSWORD to run UI specs.');

  await page.goto('/login');
  await page.locator('form.auth-form input[name="email"]').fill(email!);
  await page.locator('form.auth-form input[name="password"]').fill(password!);
  await page.locator('form.auth-form button.auth-submit').click();

  // Login failures stay on /login with an .auth-error alert; surface its text.
  const error = page.locator('form.auth-form .auth-error');
  if (await error.isVisible({ timeout: 15_000 }).catch(() => false)) {
    throw new Error(`Student login failed: ${await error.textContent()}`);
  }
  await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30_000 });
  await expect(page.context().cookies()).resolves.toContainEqual(
    expect.objectContaining({ name: 'cbse_student_session' }),
  );
  await page.context().storageState({ path: AUTH_FILE });
});
