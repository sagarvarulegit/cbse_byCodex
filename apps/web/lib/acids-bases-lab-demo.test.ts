import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'AcidsBasesLabDemo.tsx');
const lessonDemoPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const contentRoot = path.join(repoRoot, 'content', 'acids-bases-and-salts', 'lessons');

const expectedDemoIds = [
  'activity-2-1-phenolphthalein-neutralisation',
  'activity-2-2-olfactory-indicators',
  'activity-2-3-metal-acid-hydrogen-pop',
  'activity-2-4-base-metal-heating',
  'activity-2-5-carbonate-acid-lime-water',
  'activity-2-6-reversible-neutralisation',
  'activity-2-7-metallic-oxide-acid',
  'activity-2-8-acid-electricity-conduction',
];

test('Gemini acids bases activities render through the shared lab demo', () => {
  assert.ok(fs.existsSync(componentPath), 'AcidsBasesLabDemo.tsx should exist');

  const componentSource = fs.readFileSync(componentPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');
  const lessonMarkdown = fs
    .readdirSync(contentRoot)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fs.readFileSync(path.join(contentRoot, fileName), 'utf8'))
    .join('\n');

  assert.match(lessonDemoSource, /AcidsBasesLabDemo/);
  assert.match(lessonDemoSource, /hasAcidsBasesLabDemo/);
  assert.match(componentSource, /requestAnimationFrame/);
  assert.match(componentSource, /<canvas/);

  for (const requiredLabel of [
    'Phenolphthalein',
    'Dilute HCl',
    'Dilute NaOH',
    'Soap bubbles',
    'Hydrogen pop test',
    'Na2CO3 + HCl',
    'Lime water turns milky',
    'Black CuO powder',
    'Blue-green CuCl2',
    'Graphite electrodes',
    'Bulb glows',
  ]) {
    assert.match(componentSource, new RegExp(requiredLabel.replace(/[()+]/g, '\\$&')), `${requiredLabel} should be drawn`);
  }

  assert.doesNotMatch(componentSource, /cdn\.tailwindcss\.com|cdnjs\.cloudflare\.com|FlutterChannel/i);

  for (const demoId of expectedDemoIds) {
    assert.match(componentSource, new RegExp(`'${demoId}'`), `${demoId} should be registered`);
    assert.match(lessonMarkdown, new RegExp(`\\[\\[demo:${demoId}\\]\\]`), `${demoId} should be embedded`);
  }
});
