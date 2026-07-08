import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'ChemicalReactionLabDemo.tsx');
const lessonDemoPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const contentRoot = path.join(repoRoot, 'content', 'chemical-reactions-and-equations', 'lessons');

const expectedDemoIds = [
  'activity-1-2-lead-nitrate-potassium-iodide',
  'activity-1-3-zinc-sulphuric-acid',
  'activity-1-4-quicklime-water',
  'activity-1-5-heating-ferrous-sulphate',
  'activity-1-6-heating-lead-nitrate',
  'activity-1-7-electrolysis-water',
  'activity-1-8-photochemical-decomposition',
  'activity-1-9-iron-copper-sulphate',
  'activity-1-10-barium-sulphate-precipitate',
  'activity-1-11-heating-copper-powder',
];

test('Gemini chemistry activities render through the shared lab demo', () => {
  assert.ok(fs.existsSync(componentPath), 'ChemicalReactionLabDemo.tsx should exist');

  const componentSource = fs.readFileSync(componentPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');
  const lessonMarkdown = fs
    .readdirSync(contentRoot)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => fs.readFileSync(path.join(contentRoot, fileName), 'utf8'))
    .join('\n');

  assert.match(lessonDemoSource, /ChemicalReactionLabDemo/);
  assert.match(lessonDemoSource, /hasChemicalReactionLabDemo/);
  assert.match(componentSource, /requestAnimationFrame/);
  assert.match(componentSource, /<canvas/);
  for (const requiredLabel of [
    'Potassium iodide',
    'Zinc granules',
    'Thermometer',
    'Quick lime (CaO)',
    'Bunsen burner',
    'Boiling tube',
    'FeSO4 crystals',
    'Lead nitrate',
    'Cathode (-)',
    'Anode (+)',
    'China dish',
    'AgCl powder',
    'Iron nail',
    'Barium chloride',
    'Wire mesh and tripod',
  ]) {
    assert.match(componentSource, new RegExp(requiredLabel.replace(/[()+]/g, '\\$&')), `${requiredLabel} should be drawn`);
  }
  assert.doesNotMatch(componentSource, /cdn\.tailwindcss\.com|cdnjs\.cloudflare\.com|FlutterChannel/i);

  for (const demoId of expectedDemoIds) {
    assert.match(componentSource, new RegExp(`'${demoId}'`), `${demoId} should be registered`);
    assert.match(lessonMarkdown, new RegExp(`\\[\\[demo:${demoId}\\]\\]`), `${demoId} should be embedded`);
  }
});
