import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'MagnesiumCombustionCanvasDemo.tsx');
const lessonDemoPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');

test('magnesium ribbon marker renders through the canvas combustion demo', () => {
  assert.ok(fs.existsSync(componentPath), 'MagnesiumCombustionCanvasDemo.tsx should exist');

  const componentSource = fs.readFileSync(componentPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');

  assert.match(lessonDemoSource, /MagnesiumCombustionCanvasDemo/);
  assert.match(lessonDemoSource, /demoId === 'figure-1-1-magnesium-ribbon'/);
  assert.match(componentSource, /<canvas/);
  assert.match(componentSource, /requestAnimationFrame/);
  assert.match(componentSource, /Start experiment/);
  assert.match(componentSource, /2Mg\(s\) \+ O2\(g\) -> 2MgO\(s\)/);
  assert.match(componentSource, /drawApparatusLabels/);
  assert.match(componentSource, /'Burner'/);
  assert.match(componentSource, /'Magnesium ribbon'/);
  assert.match(componentSource, /'Tongs'/);
  assert.match(componentSource, /'Watch glass'/);
  assert.match(componentSource, /'Magnesium oxide ash'/);
  assert.doesNotMatch(componentSource, /cdn\.tailwindcss\.com|cdnjs\.cloudflare\.com|font-awesome/i);
});
