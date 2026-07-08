import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'MetalsNonMetalsLabDemo.tsx');
const lessonDemoPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const contentRoot = path.join(repoRoot, 'content', 'metals-and-non-metals', 'lessons');

const expectedDemoIds = [
  'activity-3-properties-physical-tests',
  'activity-3-5-thermal-conductivity',
  'activity-3-8-3-9-combustion-oxides',
  'activity-3-10-3-12-reactivity-sandbox',
  'activity-3-13-ionic-properties',
  'activity-3-14-rusting-conditions',
];

test('Gemini metals non-metals activities render through the shared lab demo', () => {
  assert.ok(fs.existsSync(componentPath), 'MetalsNonMetalsLabDemo.tsx should exist');

  const componentSource = fs.readFileSync(componentPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');
  const lessonMarkdown = fs
    .readdirSync(contentRoot)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fs.readFileSync(path.join(contentRoot, fileName), 'utf8'))
    .join('\n');

  assert.match(lessonDemoSource, /MetalsNonMetalsLabDemo/);
  assert.match(lessonDemoSource, /hasMetalsNonMetalsLabDemo/);
  assert.match(componentSource, /requestAnimationFrame/);
  assert.match(componentSource, /<canvas/);

  for (const requiredLabel of [
    'Thermal conductivity',
    'MgO turns red litmus blue',
    'SO2 solution turns blue litmus red',
    'CuSO4 displacement',
    'NaCl(aq): mobile ions',
    'Bulb glows',
    'Rusting needs oxygen and moisture',
  ]) {
    assert.match(componentSource, new RegExp(requiredLabel.replace(/[()+]/g, '\\$&')), `${requiredLabel} should be drawn`);
  }

  assert.doesNotMatch(componentSource, /cdn\.tailwindcss\.com|fonts\.googleapis\.com|document\.getElementById|\sonclick=/);

  for (const demoId of expectedDemoIds) {
    assert.match(componentSource, new RegExp(`'${demoId}'`), `${demoId} should be registered`);
    assert.match(lessonMarkdown, new RegExp(`\\[\\[demo:${demoId}\\]\\]`), `${demoId} should be embedded`);
  }
});
