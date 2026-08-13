import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import {
  buildMaths041BlueprintSnapshot,
  renderMaths041SnapshotModule,
} from './exam-curriculum-snapshot';

const GENERATED_PATH = new URL(
  '../../api/src/lib/exam-papers/maths-041-blueprint.generated.ts',
  import.meta.url,
);

test('committed Maths 041 exam snapshot matches the curriculum registry', async () => {
  const committed = await readFile(GENERATED_PATH, 'utf8');
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

test('excluded topics are recorded so the generator can enforce them', () => {
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
