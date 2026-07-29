import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('lesson route exposes keyboard bypass, current location and reduced-motion coverage', () => {
  const lessonPage = fs.readFileSync(
    path.join(
      process.cwd(),
      'app',
      'chapters',
      '[slug]',
      'lessons',
      '[lessonSlug]',
      'page.tsx',
    ),
    'utf8',
  );
  const styles = fs.readFileSync(
    path.join(process.cwd(), 'app', 'globals.css'),
    'utf8',
  );

  assert.match(lessonPage, /className="skip-link" href="#lesson-notes"/);
  assert.match(lessonPage, /aria-current=\{isActive \? 'page' : undefined\}/);
  assert.match(styles, /\.skip-link:focus/);
  assert.match(styles, /\.button-link:focus-visible/);
  assert.match(styles, /button:focus-visible/);
  assert.match(styles, /--accent: var\(--primary\)/);
  assert.match(styles, /--surface: var\(--card\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /\.exam-practice-card \*/);
  assert.match(styles, /\.written-practice-card \*/);
  assert.match(styles, /\.balancer-workbench \*/);
});
