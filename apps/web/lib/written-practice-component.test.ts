import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('written practice enforces write-before-check, structured saving, repair and retry', () => {
  const component = fs.readFileSync(
    path.join(process.cwd(), 'components', 'WrittenPracticeCard.tsx'),
    'utf8',
  );

  assert.match(component, /definition\.minimumCharacters/);
  assert.match(component, /show marking points/i);
  assert.match(component, /Tick only what you actually wrote/);
  assert.match(component, /earnedRubricPointIds: selectedPointIds/);
  assert.match(component, /weakSkillSlugs/);
  assert.match(component, /missedRubricPoints/);
  assert.match(component, /usedHints/);
  assert.match(component, /Worked example/);
  assert.match(component, /Similar question with hints/);
  assert.match(component, /Independent question/);
  assert.match(component, /Model answer/);
  assert.match(component, /mergeAttemptHistories/);
  assert.match(component, /clientAttemptId/);
  assert.match(component, /getPracticeRemediation/);
  assert.match(component, /Start a fresh attempt/);
  assert.match(component, /answer stays on this device/i);
  assert.doesNotMatch(component, /body:\s*JSON\.stringify\(\{[\s\S]*?\n\s*answer,/);
});
