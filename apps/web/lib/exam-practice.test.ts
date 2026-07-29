import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createExamPracticeRegistry,
  getExamPracticeDefinition,
  getExamSkillOptions,
} from './exam-practice';

test('Chapter 1 diagnostics have valid timers, scoring limits and remediation', () => {
  for (const id of ['cre-diagnostic-a', 'cre-diagnostic-b']) {
    const definition = getExamPracticeDefinition(id);
    assert.ok(definition, `Missing exam definition: ${id}`);
    assert.ok(definition.writingMinutes > 0);
    assert.ok(definition.checkingMinutes > 0);
    assert.ok(definition.maxMarks > 0);
    assert.equal(
      getExamSkillOptions(definition).length,
      definition.weakSkillSlugs.length,
    );
    assert.ok(
      getExamSkillOptions(definition).every(
        (option) => option.remediation.href.includes('#'),
      ),
    );
  }
});

test('another chapter can register a timed diagnostic without Chapter 1 renderer code', () => {
  const registry = createExamPracticeRegistry([
    {
      chapterSlug: 'example-chapter',
      definitions: [
        {
          chapterSlug: 'example-chapter',
          checkingMinutes: 2,
          conditionLabels: ['I worked independently.'],
          id: 'example-diagnostic',
          lessonSlug: 'example-diagnostic-lesson',
          maxMarks: 5,
          practiceItemId: 'example-diagnostic-exam',
          title: 'Example diagnostic',
          weakSkillSlugs: ['example-skill'],
          writingMinutes: 5,
        },
      ],
    },
  ], (chapterSlug, skillSlug) =>
    chapterSlug === 'example-chapter' && skillSlug === 'example-skill',
  );

  assert.equal(registry.getDefinition('example-diagnostic')?.maxMarks, 5);
});
