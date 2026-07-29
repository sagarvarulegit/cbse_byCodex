import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('timed diagnostic preserves clocks and records integrity separately from score', () => {
  const component = fs.readFileSync(
    path.join(process.cwd(), 'components', 'ExamPracticeCard.tsx'),
    'utf8',
  );
  const renderer = fs.readFileSync(
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

  assert.match(component, /writingEndsAt/);
  assert.match(component, /checkingEndsAt/);
  assert.match(component, /window\.localStorage/);
  assert.match(component, /practice\?\$\{params\.toString\(\)\}/);
  assert.match(component, /mergeAttemptHistories/);
  assert.match(component, /retentionEligible/);
  assert.match(component, /practice only/);
  assert.match(component, /role="timer"/);
  assert.doesNotMatch(component, /className="exam-practice-timer" aria-live/);
  assert.match(component, /className="button-link"/);
  assert.match(component, /className="ghost-link"/);
  assert.doesNotMatch(component, /primary-button|secondary-button/);
  assert.match(component, /First weak skill/);
  assert.match(component, /getExamSkillOptions/);
  assert.match(renderer, /function getExamPracticeId/);
  assert.match(renderer, /getExamPracticeDefinition\(examPracticeId\)/);
  assert.match(renderer, /<ExamPracticeCard/);
});
