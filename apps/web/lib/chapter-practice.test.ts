import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  createChapterPracticeRegistry,
  getPracticeMaxHalfMarks,
  getPracticeRemediation,
  getPracticeSkillLabel,
  getWrittenPracticeDefinition,
  PRACTICE_SKILL_LABELS,
} from './chapter-practice';
import { getChapter } from './course-content';

const chapterOnePracticeIds = [
  'cre-pyq-1',
  'cre-pyq-2',
  'cre-pyq-3',
  'cre-pyq-4',
  'cre-pyq-5',
  'cre-pyq-6',
  'cre-pyq-7',
  'cre-pyq-8',
  'cre-pyq-9',
  'cre-current-redox-balance',
  'cre-current-displacement-compare',
  'cre-current-electrolysis-diagnose',
  'cre-current-corrosion-evaluate',
  'cre-current-neutralisation-classify',
];

test('every Chapter 1 written-practice item has a valid integer half-mark rubric', () => {
  for (const id of chapterOnePracticeIds) {
    const definition = getWrittenPracticeDefinition(id);
    assert.ok(definition, `Missing written-practice definition: ${id}`);
    assert.ok(definition.minimumCharacters >= 40);
    assert.ok(getPracticeMaxHalfMarks(definition) > 0);

    const pointIds = definition.rubricPoints.map((point) => point.id);
    assert.equal(new Set(pointIds).size, pointIds.length, `${id} has duplicate rubric point ids`);
    for (const point of definition.rubricPoints) {
      assert.ok(Number.isInteger(point.halfMarks) && point.halfMarks > 0);
      assert.ok(PRACTICE_SKILL_LABELS[point.skillSlug]);
      assert.ok(
        getPracticeRemediation(definition.chapterSlug, point.skillSlug),
        `${id} has no remediation for ${point.skillSlug}`,
      );
    }
  }
});

test('unknown practice ids and other chapters do not receive Chapter 1 content', () => {
  assert.equal(getWrittenPracticeDefinition('unknown-item'), null);
  assert.equal(getPracticeRemediation('another-chapter', 'balancing'), null);
});

test('the other two pilot chapters expose the complete active-practice ladder', () => {
  for (const id of [
    'rn-exercise-1-1-hcf-lcm',
    'tsf-his-first-flight-text-questions',
  ]) {
    const definition = getWrittenPracticeDefinition(id);
    assert.ok(definition?.practiceFlow, `Missing active-practice flow for ${id}`);
    assert.ok(definition.practiceFlow.workedExample.solution.length > 20);
    assert.ok(definition.practiceFlow.guidedQuestion.hints.length >= 2);
    assert.ok(definition.practiceFlow.independentQuestion.length > 20);
    assert.ok(definition.practiceFlow.modelAnswer.length > 40);
  }
});

test('a second chapter can register practice without renderer or API changes', () => {
  const registry = createChapterPracticeRegistry([
    {
      chapterSlug: 'example-chapter',
      definitions: [
        {
          chapterSlug: 'example-chapter',
          id: 'example-written-item',
          lessonSlug: 'example-lesson',
          minimumCharacters: 40,
          rubricPoints: [
            {
              halfMarks: 2,
              id: 'complete-answer',
              label: 'Complete answer',
              skillSlug: 'answer-completeness',
            },
          ],
          title: 'Example item',
        },
      ],
      remediations: [
        {
          href: '/chapters/example-chapter/lessons/example-lesson#review',
          label: 'Review the example',
          skillSlug: 'answer-completeness',
        },
      ],
      skillLabels: {
        'answer-completeness': 'Complete answer',
      },
    },
  ]);

  assert.equal(registry.getDefinition('example-written-item')?.chapterSlug, 'example-chapter');
  assert.equal(
    registry.getRemediation('example-chapter', 'answer-completeness')?.label,
    'Review the example',
  );
  assert.equal(
    getPracticeSkillLabel(
      'chemical-reactions-and-equations',
      'answer-completeness',
    ),
    PRACTICE_SKILL_LABELS['answer-completeness'],
  );
});

test('every Chapter 1 weak skill resolves to a real rendered lesson anchor', () => {
  const chapterSlug = 'chemical-reactions-and-equations';
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);

  for (const skillSlug of Object.keys(PRACTICE_SKILL_LABELS)) {
    const remediation = getPracticeRemediation(chapterSlug, skillSlug);
    assert.ok(remediation, `Missing remediation for ${skillSlug}`);
    const match = remediation.href.match(
      /^\/chapters\/chemical-reactions-and-equations\/lessons\/([^#]+)#(.+)$/,
    );
    assert.ok(match, `Malformed remediation route for ${skillSlug}`);
    const [, lessonSlug, expectedAnchor] = match;
    const lesson = chapter.lessons.find((item) => item.slug === lessonSlug);
    assert.ok(lesson?.fileName, `Missing lesson file for ${skillSlug}`);
    const markdown = fs.readFileSync(
      path.join(
        process.cwd(),
        'content',
        chapterSlug,
        'lessons',
        lesson.fileName,
      ),
      'utf8',
    );
    const renderedAnchors = Array.from(
      markdown.matchAll(/^#{2,3}\s+(.+)$/gm),
      (heading) =>
        heading[1]
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, ''),
    );
    assert.ok(
      renderedAnchors.includes(expectedAnchor),
      `${skillSlug} points to missing anchor #${expectedAnchor}`,
    );
  }
});
