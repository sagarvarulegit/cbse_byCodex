import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('output/playwright/live-audit');
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[BROWSER ERROR] ${msg.text()}`);
  });
  page.on('pageerror', err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log('Navigating to login page...');
  await page.goto('https://www.chapterready.in/login', { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(outDir, '00-login-initial.png'), fullPage: true });

  console.log('Filling credentials...');
  const testEmail = process.env.E2E_EMAIL || process.env.TEST_USER_EMAIL || 'testuser@chapterready.in';
  const testPassword = process.env.E2E_PASSWORD || process.env.TEST_USER_PASSWORD;
  if (!testPassword) {
    throw new Error('E2E_PASSWORD or TEST_USER_PASSWORD environment variable is required to run test-login.mjs');
  }
  await page.fill('input[type="email"], input[name="email"]', testEmail);
  await page.fill('input[type="password"], input[name="password"]', testPassword);
  await page.screenshot({ path: path.join(outDir, '00-login-filled.png') });

  console.log('Submitting login form...');
  await Promise.all([
    page.waitForNavigation({ timeout: 15000 }).catch(e => console.log('Navigation wait timeout or done:', e.message)),
    page.click('button[type="submit"], form button')
  ]);

  console.log('Current URL after submit:', page.url());
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(outDir, '00-login-after-submit.png'), fullPage: true });

  const cookies = await context.cookies();
  console.log('Cookies received:', cookies.map(c => c.name));

  const authState = await context.storageState();
  fs.writeFileSync(path.join(outDir, 'auth-state.json'), JSON.stringify(authState, null, 2));
  console.log('Saved auth state.');

  await browser.close();
}

run().catch(console.error);
