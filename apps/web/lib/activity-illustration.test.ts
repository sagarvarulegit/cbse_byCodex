import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(__dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'ActivityIllustration.tsx');
const dispatcherPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const publicRoot = path.join(repoRoot, 'public');
const contentRoot = path.join(repoRoot, 'content');

function markdownFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(entryPath);
    return entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

test('all science activity demos route to static NCERT illustration assets', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const dispatcher = fs.readFileSync(dispatcherPath, 'utf8');

  assert.match(dispatcher, /hasActivityIllustration\(demoId\)/);
  assert.doesNotMatch(dispatcher, /LabDemo|CanvasDemo|PlantGrowthActivityDemo|PlantGeotropismDemo/);
  assert.doesNotMatch(component, /Original ChatGPT-generated redraw/);
  assert.match(component, /className="activity-illustration-labels"/);
  assert.match(component, /className="activity-illustration-label-arrow"/);

  const lessonSource = markdownFiles(contentRoot).map((file) => fs.readFileSync(file, 'utf8')).join('\n');
  const activityDemoIds = [...lessonSource.matchAll(/\[\[demo:(activity-[^\]]+)\]\]/g)].map((match) => match[1]);
  const expectedDemoIds = new Set([
    'figure-1-1-magnesium-ribbon',
    'figure-6-6-geotropism',
    ...activityDemoIds,
  ]);

  assert.ok(expectedDemoIds.size >= 35, 'Expected the complete science activity marker set');
  const labelMetadata = component.slice(component.indexOf('const ILLUSTRATION_LABELS'));
  for (const demoId of expectedDemoIds) {
    assert.ok(component.includes(`'${demoId}'`), `Missing illustration metadata for ${demoId}`);
    assert.ok(labelMetadata.includes(`'${demoId}'`), `Missing illustration labels for ${demoId}`);
  }

  const imagePaths = [...component.matchAll(/image: '([^']+)'/g)].map((match) => match[1]);
  assert.ok(imagePaths.length >= 10, 'Expected the complete activity illustration asset set');
  for (const imagePath of new Set(imagePaths)) {
    assert.ok(fs.existsSync(path.join(publicRoot, imagePath)), `Missing public asset ${imagePath}`);
  }
});
