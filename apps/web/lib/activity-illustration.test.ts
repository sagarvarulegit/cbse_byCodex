import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(__dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'ActivityIllustration.tsx');
const dispatcherPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const publicRoot = path.join(repoRoot, 'public');
const contentRoot = path.join(repoRoot, 'content');
const globalStylesPath = path.join(repoRoot, 'app', 'globals.css');

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
  assert.match(component, /const ILLUSTRATION_HOTSPOTS/);
  assert.match(component, /kind: 'figure', figure: '6\.6'/);
  assert.match(component, /className="activity-illustration-hotspots"/);
  assert.match(component, /className="activity-illustration-hotspot-key"/);
  assert.match(component, /className="activity-illustration-legend"/);
  assert.doesNotMatch(component, /activity-illustration-callout/);
  assert.doesNotMatch(component, /activity-illustration-label-arrow/);

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

test('Chapter 1 figures use individual assets, exact NCERT figure metadata, and direct-pin keys', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const hotspotsStart = component.indexOf('const ILLUSTRATION_HOTSPOTS');
  const chapterOneFigures: Record<string, { figure: string; image: string; labels: string[] }> = {
    'figure-1-1-magnesium-ribbon': {
      figure: '1.1',
      image: 'activity-1-1-burning-magnesium.webp',
      labels: ['Bunsen burner', 'Magnesium ribbon', 'Tongs', 'Watch glass', 'Magnesium oxide'],
    },
    'activity-1-3-zinc-sulphuric-acid': {
      figure: '1.2', image: 'activity-1-3-zinc-acid.webp',
      labels: ['Conical flask', 'Cork', 'Glass tube', 'Zinc granules', 'Dilute sulphuric acid', 'Hydrogen gas'],
    },
    'activity-1-4-quicklime-water': {
      figure: '1.3', image: 'activity-1-4-quicklime-water.webp',
      labels: ['Beaker', 'Hand checking temperature', 'Quicklime', 'Water', 'Slaked lime mixture'],
    },
    'activity-1-5-heating-ferrous-sulphate': {
      figure: '1.4', image: 'activity-1-5-ferrous-sulphate.webp',
      labels: ['Student', 'Boiling tube', 'Ferrous sulphate crystals', 'Test-tube holder', 'Bunsen burner', 'Wafted gases'],
    },
    'activity-1-6-heating-lead-nitrate': {
      figure: '1.5', image: 'activity-1-6-lead-nitrate.webp',
      labels: ['Hand', 'Tongs', 'Boiling tube', 'Lead nitrate', 'Bunsen burner', 'Nitrogen dioxide fumes'],
    },
    'activity-1-7-electrolysis-water': {
      figure: '1.6', image: 'activity-1-7-electrolysis-water.webp',
      labels: ['Plastic mug', 'Acidified water', 'Graphite electrodes', 'Rubber stoppers', 'Inverted test tubes', 'Switch', '6 V battery', 'Hydrogen', 'Oxygen'],
    },
    'activity-1-8-photochemical-decomposition': {
      figure: '1.7', image: 'activity-1-8-silver-chloride.webp',
      labels: ['China dish', 'Silver chloride', 'Sunlight', 'Silver'],
    },
    'activity-1-9-iron-copper-sulphate': {
      figure: '1.8(a)-(b)', image: 'activity-1-9-iron-copper-sulphate.webp',
      labels: ['Clean comparison nail', 'Blue copper sulphate control', 'Two immersed nails', 'Pale-green iron sulphate', 'Copper-coated nails'],
    },
    'activity-1-10-barium-sulphate-precipitate': {
      figure: '1.9', image: 'activity-1-10-barium-sulphate.webp',
      labels: ['Sodium sulphate solution', 'Barium chloride solution', 'Receiving test tube', 'Barium sulphate precipitate'],
    },
    'activity-1-11-heating-copper-powder': {
      figure: '1.10', image: 'activity-1-11-heating-copper.webp',
      labels: ['China dish', 'Copper powder', 'Copper oxide', 'Wire gauze', 'Tripod stand', 'Bunsen burner'],
    },
  };

  assert.doesNotMatch(component, /chapter-1-activities-1-7-to-1-10\.png/);
  assert.match(component, /'activity-1-2-lead-nitrate-potassium-iodide': \{[\s\S]*?number: '1\.2'/);
  const activity12Block = component.slice(
    component.indexOf("'activity-1-2-lead-nitrate-potassium-iodide': {"),
    component.indexOf("'activity-1-3-zinc-sulphuric-acid': {"),
  );
  assert.doesNotMatch(activity12Block, /figure:/);

  for (const [demoId, expected] of Object.entries(chapterOneFigures)) {
    const metadataStart = component.indexOf(`'${demoId}': {`);
    const metadataEnd = component.indexOf('\n  },', metadataStart);
    const metadataBlock = component.slice(metadataStart, metadataEnd);
    assert.match(metadataBlock, new RegExp(`figure: '${expected.figure.replace(/[()]/g, '\\$&')}'`));
    assert.match(metadataBlock, new RegExp(`image: '/activity-illustrations/${expected.image.replace('.', '\\.')}'`));

    const figureStart = component.indexOf(`'${demoId}': [`, hotspotsStart);
    const figureEnd = component.indexOf('  ],', figureStart);
    const hotspotBlock = component.slice(figureStart, figureEnd);
    assert.ok(figureStart >= hotspotsStart, `Missing hotspot block for ${demoId}`);
    for (const label of expected.labels) assert.match(hotspotBlock, new RegExp(`label: '${label}'`));

    const targets = [...hotspotBlock.matchAll(/x: (\d+), y: (\d+)/g)].map((match) => `${match[1]},${match[2]}`);
    assert.equal(targets.length, expected.labels.length, `${demoId} pin count must match its key`);
    assert.equal(new Set(targets).size, targets.length, `${demoId} pins must target distinct points`);
    assert.ok(fs.existsSync(path.join(publicRoot, 'activity-illustrations', expected.image)), expected.image);
  }
});

test('Chapter 1 delivered illustration sources stay within the mobile image budget', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const chapterOneImages = [
    'activity-1-1-burning-magnesium.webp',
    'activity-1-2-lead-iodide.webp',
    'activity-1-3-zinc-acid.webp',
    'activity-1-4-quicklime-water.webp',
    'activity-1-5-ferrous-sulphate.webp',
    'activity-1-6-lead-nitrate.webp',
    'activity-1-7-electrolysis-water.webp',
    'activity-1-8-silver-chloride.webp',
    'activity-1-9-iron-copper-sulphate.webp',
    'activity-1-10-barium-sulphate.webp',
    'activity-1-11-heating-copper.webp',
  ];

  let totalBytes = 0;
  for (const imageName of chapterOneImages) {
    const imagePath = path.join(publicRoot, 'activity-illustrations', imageName);
    const imageBytes = fs.statSync(imagePath).size;
    totalBytes += imageBytes;
    assert.ok(imageBytes <= 350 * 1024, `${imageName} exceeds 350 KiB`);
    assert.match(component, new RegExp(imageName.replace('.', '\\.')));
  }

  assert.ok(totalBytes <= 4 * 1024 * 1024, 'Chapter 1 illustration sources exceed 4 MiB');
  assert.doesNotMatch(component, /image: '\/activity-illustrations\/activity-1-[^']+\.png'/);
});

test('Chapter 1 full-frame images expose intrinsic size and native loading hints', () => {
  const component = fs.readFileSync(componentPath, 'utf8');
  const styles = fs.readFileSync(globalStylesPath, 'utf8');

  assert.match(component, /CHAPTER_ONE_IMAGE_DIMENSIONS/);
  assert.match(component, /imageHeight: 675/);
  assert.match(component, /imageWidth: 1200/);
  assert.match(component, /loading="lazy"/);
  assert.match(component, /decoding="async"/);
  assert.match(component, /height=\{illustration\.imageHeight\}/);
  assert.match(component, /width=\{illustration\.imageWidth\}/);
  assert.match(
    styles,
    /\.activity-illustration-image-native\s*\{[\s\S]*?object-fit: contain/,
  );
});

test('Chapter 10 composite panels use their real unequal boundaries', () => {
  const component = fs.readFileSync(componentPath, 'utf8');

  assert.match(
    component,
    /'figure-10-5-10-6-dispersion':[\s\S]*?crop: \{ x: 0, y: 51\.9, width: 43\.4, height: 48\.1 \}/,
  );
  assert.match(
    component,
    /'figure-10-9-10-10-atmospheric-refraction':[\s\S]*?crop: \{ x: 43\.4, y: 51\.9, width: 56\.6, height: 48\.1 \}/,
  );
});
