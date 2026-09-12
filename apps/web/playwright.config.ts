import fs from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

const AUTH_FILE = './e2e/.auth/user.json';
// Guest-reachable specs (homepage) run without login; the setup project
// creates AUTH_FILE when E2E_EMAIL/E2E_PASSWORD are set.
// Point at production with E2E_BASE_URL=https://www.chapterready.in —
// webServer only boots for local runs.
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:3000';
const IS_LOCAL = !process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    storageState: fs.existsSync('e2e/.auth/user.json') ? AUTH_FILE : undefined,
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
  ],
  webServer: IS_LOCAL
    ? {
        command: 'npm run dev',
        url: 'http://127.0.0.1:3000',
        reuseExistingServer: true,
        timeout: 120_000,
      }
    : undefined,
});
