import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('chapter overview opens one continuous chapter-notes path', () => {
  const chapterPage = fs.readFileSync(
    path.join(process.cwd(), 'app', 'chapters', '[slug]', 'page.tsx'),
    'utf8',
  );
  const completeNotesPage = fs.readFileSync(
    path.join(
      process.cwd(),
      'app',
      'chapters',
      '[slug]',
      'notes',
      'CompleteChapterNotesPage.tsx',
    ),
    'utf8',
  );
  const subjectPage = fs.readFileSync(
    path.join(process.cwd(), 'app', 'subjects', '[slug]', 'page.tsx'),
    'utf8',
  );

  assert.match(chapterPage, /href: `\/chapters\/\$\{slug\}\/notes`/);
  assert.match(chapterPage, /Open complete chapter notes/);
  assert.match(chapterPage, /One continuous reading path/);
  assert.match(completeNotesPage, /id="introduction"/);
  assert.match(completeNotesPage, /buildChapterOutline\(lessonContents\)/);
  assert.match(completeNotesPage, /LessonNotesContent/);
  assert.match(completeNotesPage, /Parent topics appear before their subsections/);
  assert.match(subjectPage, /href=\{`\/chapters\/\$\{chapterSlug\}\/notes`\}/);
});
