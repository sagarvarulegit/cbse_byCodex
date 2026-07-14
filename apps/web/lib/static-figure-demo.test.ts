import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const figure61Path = path.join(
  repoRoot,
  'public',
  'figures',
  'figure-6-1-neuron-neuromuscular-junction-redraw.png',
);
const figure62Path = path.join(repoRoot, 'public', 'figures', 'figure-6-2-reflex-arc-redraw.png');
const figure63Path = path.join(repoRoot, 'public', 'figures', 'figure-6-3-human-brain-redraw.png');
const figure64Path = path.join(repoRoot, 'public', 'figures', 'figure-6-4-sensitive-plant-source.png');
const staticFigureDemoPath = path.join(repoRoot, 'components', 'StaticFigureDemo.tsx');
const lessonDemoPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');

test('chapter 6 figure 6.1 renders through the static figure demo', () => {
  assert.ok(fs.existsSync(figure61Path), 'Figure 6.1 image asset should exist');
  const figureStats = fs.statSync(figure61Path);
  assert.ok(figureStats.size > 1_000_000, 'Figure 6.1 should be a full generated redraw, not a tiny placeholder');

  const componentSource = fs.readFileSync(staticFigureDemoPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');

  assert.match(lessonDemoSource, /StaticFigureDemo/);
  assert.match(componentSource, /figure-6-1-neuron-neuromuscular-junction/);
  assert.match(componentSource, /figure-6-1-neuron-neuromuscular-junction-redraw\.png/);
  assert.match(componentSource, /Original platform redraw based on NCERT Figure 6\.1/);
  assert.match(componentSource, /structure of a neuron and a neuromuscular junction/);
});

test('chapter 6 figure 6.2 renders through the static figure demo', () => {
  assert.ok(fs.existsSync(figure62Path), 'Figure 6.2 image asset should exist');
  const figureStats = fs.statSync(figure62Path);
  assert.ok(figureStats.size > 1_000_000, 'Figure 6.2 should be a full generated redraw, not a tiny placeholder');

  const componentSource = fs.readFileSync(staticFigureDemoPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');

  assert.match(lessonDemoSource, /StaticFigureDemo/);
  assert.match(componentSource, /figure-6-2-reflex-arc/);
  assert.match(componentSource, /figure-6-2-reflex-arc-redraw\.png/);
  assert.match(componentSource, /Original platform redraw based on NCERT Figure 6\.2/);
  assert.match(componentSource, /receptors in skin to the spinal cord and back to an effector muscle/);
});

test('chapter 6 figure 6.3 renders through the static figure demo', () => {
  assert.ok(fs.existsSync(figure63Path), 'Figure 6.3 image asset should exist');
  const figureStats = fs.statSync(figure63Path);
  assert.ok(figureStats.size > 1_000_000, 'Figure 6.3 should be a full generated redraw, not a tiny placeholder');

  const componentSource = fs.readFileSync(staticFigureDemoPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');

  assert.match(lessonDemoSource, /StaticFigureDemo/);
  assert.match(componentSource, /figure-6-3-human-brain/);
  assert.match(componentSource, /figure-6-3-human-brain-redraw\.png/);
  assert.match(componentSource, /Original platform redraw based on NCERT Figure 6\.3/);
  assert.match(componentSource, /cerebrum, cranium, mid-brain, hypothalamus, pituitary gland, pons, medulla, cerebellum, and spinal cord/);
});

test('chapter 6 figure 6.4 renders through the static figure demo', () => {
  assert.ok(fs.existsSync(figure64Path), 'Figure 6.4 image asset should exist');
  const figureStats = fs.statSync(figure64Path);
  assert.ok(figureStats.size > 250_000, 'Figure 6.4 should be the provided source image, not a tiny placeholder');

  const componentSource = fs.readFileSync(staticFigureDemoPath, 'utf8');
  const lessonDemoSource = fs.readFileSync(lessonDemoPath, 'utf8');

  assert.match(lessonDemoSource, /StaticFigureDemo/);
  assert.match(componentSource, /figure-6-4-sensitive-plant/);
  assert.match(componentSource, /figure-6-4-sensitive-plant-source\.png/);
  assert.match(componentSource, /Figure 6\.4: The sensitive plant/);
  assert.match(componentSource, /before and after its leaves fold when touched/);
});
