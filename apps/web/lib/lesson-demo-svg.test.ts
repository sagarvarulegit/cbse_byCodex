import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const magnesiumSvg = fs.readFileSync(
  path.join(repoRoot, 'public', 'animations', 'figure-1-1-magnesium-ribbon.svg'),
  'utf8',
);

test('figure 1.1 standalone SVG carries the full textbook-style lab scene', () => {
  assert.match(magnesiumSvg, /viewBox="0 0 920 640"/);
  assert.match(magnesiumSvg, /id="white-glow"/);
  assert.match(magnesiumSvg, /class="star-rays"/);
  assert.match(magnesiumSvg, /id="mgo-particles"/);
  assert.match(magnesiumSvg, /id="tongs-and-ribbon" class="timeline-approach"/);
  assert.match(magnesiumSvg, /@keyframes tongs-approach-cycle/);
  assert.match(magnesiumSvg, /id="equation"/);
  assert.match(magnesiumSvg, /id="equation" class="equation-panel" transform="translate\(206 82\)"/);
  assert.match(magnesiumSvg, /id="caution"/);
  assert.match(magnesiumSvg, /class="label-text"/);
  assert.match(magnesiumSvg, /<text x="690" y="428" class="label-text">Magnesium oxide \(white ash\)<\/text>/);
  assert.match(magnesiumSvg, /Magnesium burns with dazzling/);
  assert.match(magnesiumSvg, /white flame to form white/);
  assert.match(magnesiumSvg, /CAUTION:/);
  assert.match(magnesiumSvg, /\.text-caution-title \{\s+fill: #1f2937;/);
  assert.match(magnesiumSvg, /\.text-caution-desc \{\s+fill: #374151;/);
  assert.match(magnesiumSvg, /<path d="M324 364 L430 230"/);
  assert.match(magnesiumSvg, /<ellipse cx="430" cy="230"[^>]+transform="rotate\(-70 430 230\)"/);
  assert.match(magnesiumSvg, /<circle cx="430" cy="230" r="98" fill="url\(#dazzleSparkGlow\)"/);
  assert.match(magnesiumSvg, /<path d="M430 250 L430 438"/);
  assert.match(magnesiumSvg, /transform: translate\(0, 176px\) scale\(1\.16\)/);
});
