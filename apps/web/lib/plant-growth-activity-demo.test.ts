import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'PlantGrowthActivityDemo.tsx');
const dispatcherPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const lessonPath = path.join(
  repoRoot,
  'content',
  'control-and-coordination',
  'lessons',
  '04-coordination-in-plants.md',
);

test('activity 6.2 phototropism demo is source-faithful and live in lesson 6.2.2', () => {
  assert.ok(fs.existsSync(componentPath), 'Expected PlantGrowthActivityDemo.tsx');

  const component = fs.readFileSync(componentPath, 'utf8');
  const dispatcher = fs.readFileSync(dispatcherPath, 'utf8');
  const lesson = fs.readFileSync(lessonPath, 'utf8');
  const sectionIndex = lesson.indexOf('## 6.2.2 Movement Due to Growth');
  const markerIndex = lesson.indexOf('[[demo:activity-6-2-phototropism]]');
  const questionsIndex = lesson.indexOf('## Questions and answers');

  assert.ok(sectionIndex >= 0, 'Expected the 6.2.2 heading');
  assert.ok(markerIndex > sectionIndex, 'Expected Activity 6.2 demo after 6.2.2');
  assert.ok(markerIndex < questionsIndex, 'Expected Activity 6.2 demo before the Questions block');
  assert.match(dispatcher, /PlantGrowthActivityDemo/);
  assert.match(dispatcher, /hasPlantGrowthActivityDemo\(demoId\)/);
  assert.match(component, /activity-6-2-phototropism/);
  assert.match(component, /conical flask/i);
  assert.match(component, /water/i);
  assert.match(component, /wire mesh/i);
  assert.match(component, /germinated bean seeds/i);
  assert.match(component, /cardboard box/i);
  assert.match(component, /window/i);
  assert.match(component, /shoots bend towards light/i);
  assert.match(component, /roots.*away from light/i);
  assert.match(component, /old grown portions retain their direction/i);
  assert.match(component, /only the new.*growth.*changes direction/i);
  assert.doesNotMatch(component, /https?:\/\//);
  assert.doesNotMatch(component, /Figure 6\.6/);
});
