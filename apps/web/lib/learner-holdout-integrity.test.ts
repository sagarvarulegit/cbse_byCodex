import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(process.cwd(), '..', '..');
const rubricPath = path.join(
  repoRoot,
  'docs',
  'content',
  'class-10',
  'science',
  'chemical-reactions-and-equations',
  'learner-task-smoke-rubric.md',
);
const chapterContentDirectory = path.join(
  repoRoot,
  'apps',
  'web',
  'content',
  'chemical-reactions-and-equations',
);

function normalize(value: string) {
  return value.replace(/\s+/g, ' ').trim();
}

function extractFixedHoldoutEquations(rubric: string) {
  const fixedTask = rubric.slice(
    rubric.indexOf('### Part A - Balance four equations'),
    rubric.indexOf('### Part C - Explain the ideas'),
  );
  return Array.from(fixedTask.matchAll(/^\d+\. `([^`]+)`$/gm), (match) =>
    normalize(match[1]),
  );
}

function readFilesRecursively(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? readFilesRecursively(entryPath)
      : entry.name.endsWith('.md')
        ? [fs.readFileSync(entryPath, 'utf8')]
        : [];
  });
}

test('fixed balancing and classification holdouts do not leak into Chapter 1 teaching', () => {
  const rubric = fs.readFileSync(rubricPath, 'utf8');
  const holdoutEquations = extractFixedHoldoutEquations(rubric);
  assert.equal(holdoutEquations.length, 12);

  const searchableTeaching = normalize(
    [
      ...readFilesRecursively(chapterContentDirectory),
      fs.readFileSync(
        path.join(
          repoRoot,
          'docs',
          'content',
          'class-10',
          'science',
          'chemical-reactions-and-equations',
          'chapter-pack.md',
        ),
        'utf8',
      ),
      fs.readFileSync(
        path.join(repoRoot, 'apps', 'web', 'lib', 'chemical-equation-balancing.ts'),
        'utf8',
      ),
    ].join('\n'),
  );

  for (const equation of holdoutEquations) {
    assert.equal(
      searchableTeaching.includes(equation),
      false,
      `Learner-task holdout leaked into Chapter 1 teaching: ${equation}`,
    );
  }
});
