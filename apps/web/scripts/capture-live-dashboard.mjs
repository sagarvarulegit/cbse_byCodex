import { chromium } from 'playwright';
import path from 'node:path';

async function main() {
  const authStatePath = path.resolve('output/playwright/live-audit/auth-state.json');
  const outScreenshotPath = path.resolve('C:/Sagar/tmp/dashboard_live_prod.png');

  console.log('Launching browser with auth state...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    storageState: authStatePath,
    viewport: { width: 1440, height: 960 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('Navigating directly to https://www.chapterready.in/dashboard ...');
  await page.goto('https://www.chapterready.in/dashboard', { waitUntil: 'load', timeout: 45000 });

  console.log('Waiting for dashboard h1 heading to render...');
  await page.waitForSelector('h1', { timeout: 45000 });

  // Give a moment for all widgets, SVGs, and fonts to paint
  await page.waitForTimeout(3000);

  console.log('Current URL:', page.url());
  console.log('Capturing full page screenshot to:', outScreenshotPath);
  await page.screenshot({ path: outScreenshotPath, fullPage: true });

  console.log('Screenshot captured successfully!');
  await browser.close();
}

main().catch((err) => {
  console.error('Failed to capture dashboard:', err);
  process.exit(1);
});
