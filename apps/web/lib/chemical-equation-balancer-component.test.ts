import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

test('balancer is coefficient-only, keyboard operable, staged, and progress-aware', () => {
  const component = fs.readFileSync(
    path.join(process.cwd(), 'components', 'ChemicalEquationBalancer.tsx'),
    'utf8',
  );
  const lessonDemo = fs.readFileSync(
    path.join(process.cwd(), 'components', 'LessonDemo.tsx'),
    'utf8',
  );

  assert.match(component, /Coefficient for \$\{side\} \$\{compound\.name\}/);
  assert.match(component, /inputMode="numeric"/);
  assert.match(component, /Live atom count/);
  assert.match(component, /Show hint 1/);
  assert.match(component, /Reset/);
  assert.match(component, /Next equation/);
  assert.match(component, /smallest whole-number ratio/);
  assert.match(component, /hintedEquationIds\.includes\(equation\.id\)/);
  assert.match(component, /setHintedEquationIds/);
  assert.match(component, /practiceItemId: workbench\.practiceItemId/);
  assert.match(component, /mergeAttemptHistories/);
  assert.match(component, /clientAttemptId/);
  assert.match(component, /getPracticeRemediation/);
  assert.match(component, /First repair:/);
  assert.match(lessonDemo, /hasBalanceWorkbench\(demoId\)/);
  assert.match(lessonDemo, /<ChemicalEquationBalancer demoId=\{demoId\}/);
});
