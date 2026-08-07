import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const lessonPagePath = path.join(
  process.cwd(),
  'app',
  'chapters',
  '[slug]',
  'lessons',
  '[lessonSlug]',
  'page.tsx',
);
const globalCssPath = path.join(process.cwd(), 'app', 'globals.css');

test('lesson route exposes numbered-section and mobile previous-next navigation', () => {
  const lessonPage = fs.readFileSync(lessonPagePath, 'utf8');
  const globalCss = fs.readFileSync(globalCssPath, 'utf8');

  assert.match(lessonPage, /getNumberedLessonSections\(content\.blocks\)/);
  assert.match(lessonPage, /aria-label="Textbook sections in this lesson"/);
  assert.match(lessonPage, /aria-label="Previous and next lesson"/);
  assert.match(globalCss, /\.lesson-sidebar\s*\{[\s\S]*?position:\s*sticky/);
  assert.match(globalCss, /\.lesson-mobile-navigation\s*\{[\s\S]*?display:\s*none/);
  assert.match(
    globalCss,
    /@media \(max-width: 920px\)[\s\S]*\.lesson-mobile-navigation\s*\{[^}]*position:\s*fixed/,
  );
  assert.match(globalCss, /env\(safe-area-inset-bottom\)/);
});
