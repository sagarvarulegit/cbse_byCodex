#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const appWebDir = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
process.env.E2E_BASE_URL = process.env.E2E_BASE_URL || 'https://www.chapterready.in';
console.log(`[playwright] Running tests against live production: ${process.env.E2E_BASE_URL}`);

const args = ['playwright', 'test', ...process.argv.slice(2)];
const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const result = spawnSync(cmd, args, {
  cwd: appWebDir,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.error) {
  console.error('[playwright] Error executing test:', result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
