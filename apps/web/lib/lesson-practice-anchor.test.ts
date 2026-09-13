import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const lessonPageSource = readFileSync(
  fileURLToPath(new URL('../app/chapters/[slug]/lessons/[lessonSlug]/page.tsx', import.meta.url)),
  'utf8',
);

test('lesson practice links target the generated Quick practice heading', () => {
  const practiceLinks = lessonPageSource.match(/href="#quick-practice"/g) ?? [];

  assert.ok(practiceLinks.length >= 1);
  assert.ok(!lessonPageSource.includes('href="#practice-zone"'));
});
