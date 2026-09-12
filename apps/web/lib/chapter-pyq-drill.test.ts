import assert from 'node:assert/strict';
import test from 'node:test';

import { drillDemandLines, drillPaperRef, drillTopic, drillWeightage, getPyqsForChapter } from '../components/ChapterPyqDrill';
import chapterPyqData from './chapter-pyqs.generated.json';

const ALL_PYQS = chapterPyqData as Record<string, { id: string; year: number; paperSet: string; sets: string[]; qNo: number; section: string; marks: number; questionType: string; mainAnswer: string; valuePoints: string[]; examinerNotes: string[]; officialBoardRef: string }[]>;

test('Every drill card has the fields the reframe depends on', () => {
  const seenIds = new Set<string>();

  for (const [chapterSlug, items] of Object.entries(ALL_PYQS)) {
    assert.ok(items.length > 0, `${chapterSlug} must have at least one drill item`);

    for (const item of items) {
      assert.ok(item.id, `${chapterSlug} item must have an id`);
      assert.ok(!seenIds.has(item.id), `Drill item ${item.id} is filed under two chapters`);
      seenIds.add(item.id);

      assert.ok(item.mainAnswer.trim().length > 0, `${item.id} needs a model answer`);
      assert.ok(item.valuePoints.length > 0, `${item.id} needs value points`);
      assert.ok(item.officialBoardRef.includes(`Q${item.qNo}`), `${item.id} citation must name its question number`);
      assert.ok(item.sets.length > 0, `${item.id} must list its board sets`);
      assert.ok(drillTopic(item.mainAnswer).length > 0, `${item.id} must derive a topic label`);
    }
  }

  assert.equal(getPyqsForChapter('life-processes').length, ALL_PYQS['life-processes'].length);
});

test('Drill topic strips answer formatting instead of quoting it', () => {
  assert.equal(drillTopic('• Aerobic Respiration\n• rest'), 'Aerobic Respiration');
  assert.equal(drillTopic('(a) (i) Opening of stomata\n(ii) Stomata'), 'Opening of stomata');
  assert.equal(
    drillPaperRef({ year: 2026, paperSet: '31/3/1', qNo: 11 } as never),
    '2026 Set 31/3/1, Q11',
  );
});

test('Drill demand lines expose the question demand on the card', () => {
  assert.deepEqual(
    drillDemandLines('• Aerobic Respiration\n• Complete breakdown of glucose takes place in presence of oxygen\nreleasing more energy.'),
    [
      'Aerobic Respiration',
      'Complete breakdown of glucose takes place in presence of oxygen',
      'releasing more energy.',
    ],
  );
  assert.deepEqual(drillDemandLines('(a)\n• Adrenal gland\n(any two responses)'), ['Adrenal gland']);
  const emptyDemand: string[] = [];
  for (const items of Object.values(ALL_PYQS)) {
    for (const item of items) {
      if (drillDemandLines(item.mainAnswer).length === 0) {
        emptyDemand.push(item.id);
      }
    }
  }
  // Exact-match pin: the only item whose marking key carries no text is
  // chemical-reactions Q25 (bare "(i)/(ii)" labels upstream). A new entry
  // here means the export regressed; a fixed export must remove its id.
  assert.deepEqual(emptyDemand, ['cbse-2026-s31-3-1-q25']);
});

test('Drill weightage totals each paper set honestly', () => {
  assert.deepEqual(
    drillWeightage([
      { sets: ['2026 Set 31/3/1', '2026 Set 31/3/2'], marks: 2 },
      { sets: ['2026 Set 31/3/1'], marks: 3 },
    ] as never),
    [
      { set: '2026 Set 31/3/1', questions: 2, marks: 5 },
      { set: '2026 Set 31/3/2', questions: 1, marks: 2 },
    ],
  );
  const life = drillWeightage(getPyqsForChapter('life-processes'));
  assert.deepEqual(
    life.find((w) => w.set === '2026 Set 31/3/1'),
    { set: '2026 Set 31/3/1', questions: 3, marks: 9 },
  );
});
