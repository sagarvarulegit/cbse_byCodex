import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

test('chapter overview opens one continuous chapter-notes path', () => {
  const chapterPage = fs.readFileSync(
    fileURLToPath(new URL('../app/chapters/[slug]/page.tsx', import.meta.url)),
    'utf8',
  );
  const completeNotesPage = fs.readFileSync(
    fileURLToPath(
      new URL(
        '../app/chapters/[slug]/notes/CompleteChapterNotesPage.tsx',
        import.meta.url,
      ),
    ),
    'utf8',
  );
  const subjectPage = fs.readFileSync(
    fileURLToPath(new URL('../app/subjects/[slug]/page.tsx', import.meta.url)),
    'utf8',
  );

  assert.match(chapterPage, /href=\{`\/chapters\/\$\{slug\}\/notes`\}/);
  assert.match(chapterPage, /Study Standard Chapter Notes/);
  assert.match(chapterPage, /Download 1-Page Formula Sheet/);
  assert.match(chapterPage, /Take 10-Min Board Mock Test/);
  assert.match(completeNotesPage, /id="introduction"/);
  assert.match(completeNotesPage, /buildChapterOutline\(lessonContents\)/);
  assert.match(completeNotesPage, /LessonNotesContent/);
  assert.match(completeNotesPage, /Parent topics appear before their subsections/);
  assert.match(subjectPage, /href=\{`\/chapters\/\$\{chapterSlug\}\/notes`\}/);
});
