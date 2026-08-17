import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  buildEnglish184BlueprintSnapshot,
  buildMaths041BlueprintSnapshot,
  buildScience086BlueprintSnapshot,
  buildSocialScience087BlueprintSnapshot,
  renderEnglish184SnapshotModule,
  renderMaths041SnapshotModule,
  renderScience086SnapshotModule,
  renderSocialScience087SnapshotModule,
} from './exam-curriculum-snapshot';

const MATHS_GENERATED_PATH = new URL(
  '../../api/src/lib/exam-papers/maths-041-blueprint.generated.ts',
  import.meta.url,
);

const SCIENCE_GENERATED_PATH = new URL(
  '../../api/src/lib/exam-papers/science-086-blueprint.generated.ts',
  import.meta.url,
);

test('committed Maths 041 exam snapshot matches the curriculum registry', async () => {
  const committed = await readFile(MATHS_GENERATED_PATH, 'utf8');
  const fresh = renderMaths041SnapshotModule(buildMaths041BlueprintSnapshot());
  assert.equal(
    fresh,
    committed,
    'Run `npm run exam:snapshot` to regenerate the committed snapshot.',
  );
});

test('Maths 041 snapshot sums to 80 marks and marks the blueprint ready', () => {
  const snapshot = buildMaths041BlueprintSnapshot();
  const unitMarks = snapshot.units.map((unit) => unit.marks ?? 0);
  assert.equal(unitMarks.reduce((sum, marks) => sum + marks, 0), 80);
  assert.equal(snapshot.maximumMarks, 80);
  assert.equal(snapshot.durationMinutes, 180);
  assert.equal(snapshot.readingTimeMinutes, 15);
  assert.equal(snapshot.blueprintStatus, 'ready');
  assert.deepEqual(snapshot.allowedMarkValues, [1, 2, 3, 4, 5, 6]);
});

test('Maths 041 excluded topics are recorded so the generator can enforce them', () => {
  const snapshot = buildMaths041BlueprintSnapshot();
  const excludedTopicIds = snapshot.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.scope === 'excluded')
        .map((topic) => topic.id),
    ),
  );

  const expectedExcluded = [
    'real-numbers-euclid-division-algorithm',
    'real-numbers-decimal-expansions',
    'polynomials-division-algorithm',
    'linear-pairs-cross-multiplication',
    'quadratic-equations-completing-square',
    'coordinate-geometry-area-of-triangle',
    'surface-areas-and-volumes-frustum',
    'statistics-ogive',
  ];

  for (const topicId of expectedExcluded) {
    assert.ok(
      excludedTopicIds.includes(topicId),
      `expected excluded topic ${topicId} to be recorded in the snapshot`,
    );
  }
});

test('committed Science 086 exam snapshot matches the curriculum registry', async () => {
  const committed = await readFile(SCIENCE_GENERATED_PATH, 'utf8');
  const fresh = renderScience086SnapshotModule(buildScience086BlueprintSnapshot());
  assert.equal(
    fresh,
    committed,
    'Run `npm run exam:snapshot` to regenerate the committed snapshot.',
  );
});

test('Science 086 snapshot sums to 80 marks and marks the blueprint ready', () => {
  const snapshot = buildScience086BlueprintSnapshot();
  const unitMarks = snapshot.units.map((unit) => unit.marks ?? 0);
  assert.equal(unitMarks.reduce((sum, marks) => sum + marks, 0), 80);
  assert.equal(snapshot.maximumMarks, 80);
  assert.equal(snapshot.durationMinutes, 180);
  assert.equal(snapshot.readingTimeMinutes, 15);
  assert.equal(snapshot.blueprintStatus, 'ready');
  assert.deepEqual(snapshot.allowedMarkValues, [1, 2, 3, 4, 5, 6]);
});

test('Science 086 excluded topics are recorded so the generator can enforce them', () => {
  const snapshot = buildScience086BlueprintSnapshot();
  const excludedTopicIds = snapshot.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.scope === 'excluded')
        .map((topic) => topic.id),
    ),
  );

  const expectedExcluded = [
    'colour-of-sun-sunrise-sunset',
  ];

  for (const topicId of expectedExcluded) {
    assert.ok(
      excludedTopicIds.includes(topicId),
      `expected excluded topic ${topicId} to be recorded in the snapshot`,
    );
  }
});

test('committed Social Science 087 exam snapshot matches the curriculum registry', async () => {
  const committed = await readFile(
    new URL('../../api/src/lib/exam-papers/social-science-087-blueprint.generated.ts', import.meta.url),
    'utf8',
  );
  const fresh = renderSocialScience087SnapshotModule(buildSocialScience087BlueprintSnapshot());
  assert.equal(
    fresh,
    committed,
    'Run `npm run exam:snapshot` to regenerate the committed snapshot.',
  );
});

test('Social Science 087 snapshot sums to 80 marks and marks the blueprint ready', () => {
  const snapshot = buildSocialScience087BlueprintSnapshot();
  const unitMarks = snapshot.units.map((unit) => unit.marks ?? 0);
  assert.equal(unitMarks.reduce((sum, marks) => sum + marks, 0), 80);
  assert.equal(snapshot.maximumMarks, 80);
  assert.equal(snapshot.durationMinutes, 180);
  assert.equal(snapshot.readingTimeMinutes, 15);
  assert.equal(snapshot.blueprintStatus, 'ready');
  assert.deepEqual(snapshot.allowedMarkValues, [1, 2, 3, 4, 5, 6]);
});

test('committed English 184 exam snapshot matches the curriculum registry', async () => {
  const committed = await readFile(
    new URL('../../api/src/lib/exam-papers/english-184-blueprint.generated.ts', import.meta.url),
    'utf8',
  );
  const fresh = renderEnglish184SnapshotModule(buildEnglish184BlueprintSnapshot());
  assert.equal(
    fresh,
    committed,
    'Run `npm run exam:snapshot` to regenerate the committed snapshot.',
  );
});

test('English 184 snapshot sums to 80 marks and marks the blueprint ready', () => {
  const snapshot = buildEnglish184BlueprintSnapshot();
  const unitMarks = snapshot.units.map((unit) => unit.marks ?? 0);
  assert.equal(unitMarks.reduce((sum, marks) => sum + marks, 0), 80);
  assert.equal(snapshot.maximumMarks, 80);
  assert.equal(snapshot.durationMinutes, 180);
  assert.equal(snapshot.readingTimeMinutes, 15);
  assert.equal(snapshot.blueprintStatus, 'ready');
  assert.deepEqual(snapshot.allowedMarkValues, [1, 2, 3, 4, 5, 6]);
});

