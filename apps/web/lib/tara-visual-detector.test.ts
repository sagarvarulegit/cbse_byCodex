import test from 'node:test';
import assert from 'node:assert/strict';
import { detectOpticsCanvas } from './tara-visual-detector';

test('detectOpticsCanvas: Declarative JSON Block (Tier A tag)', () => {
  const result = detectOpticsCanvas(
    'optics',
    JSON.stringify({ type: 'concave-mirror', dObj: 35 }),
    'Here is the ray diagram:',
  );

  assert.equal(result.isOptics, true);
  assert.equal(result.type, 'concave-mirror');
  assert.equal(result.initialD, 35);
});

test('detectOpticsCanvas: Convex Lens with distance at 2F', () => {
  const result = detectOpticsCanvas(
    'optics',
    JSON.stringify({ type: 'convex-lens', dObj: 140 }),
    'Convex lens object at 2F1',
  );

  assert.equal(result.isOptics, true);
  assert.equal(result.type, 'convex-lens');
  assert.equal(result.initialD, 140);
});

test('detectOpticsCanvas: Natural Language & Raw SVG code for Concave Mirror between F and P', () => {
  const rawCode = `
    <svg viewBox="0 0 500 280">
      <line id="ray1-inc" x1="235" y1="105" x2="270" y2="105" />
    </svg>
    <input type="range" id="objSlider" min="15" max="65" value="35">
  `;
  const context = 'Explain concave mirror ray diagram when the object is between F and P with an interactive diagram.';

  const result = detectOpticsCanvas('', rawCode, context);

  assert.equal(result.isOptics, true);
  assert.equal(result.type, 'concave-mirror');
  assert.equal(result.initialD, 35);
});

test('detectOpticsCanvas: Concave Mirror at C', () => {
  const context = 'What happens when object is at C of a concave mirror?';
  const rawCode = '<div class="cr-card"><svg></svg></div>';

  const result = detectOpticsCanvas('', rawCode, context);

  assert.equal(result.isOptics, true);
  assert.equal(result.type, 'concave-mirror');
  assert.equal(result.initialD, 140);
});

test('detectOpticsCanvas: Convex Mirror rear-view question', () => {
  const context = 'Why is convex mirror used as rear-view mirror in vehicles?';
  const rawCode = '<svg><line id="ray"></line></svg>';

  const result = detectOpticsCanvas('', rawCode, context);

  assert.equal(result.isOptics, true);
  assert.equal(result.type, 'convex-mirror');
});

test('detectOpticsCanvas: Non-optics question (Ohm Law circuit) is NOT detected as optics', () => {
  const context = 'Explain Ohm’s law with an electric circuit diagram.';
  const rawCode = '<svg><rect id="resistor"></rect><circle id="ammeter"></circle></svg>';

  const result = detectOpticsCanvas('', rawCode, context);

  assert.equal(result.isOptics, false);
});

test('detectOpticsCanvas: Non-optics question (Balancing chemical equation) is NOT detected as optics', () => {
  const context = 'Balance the chemical equation Fe + H2O -> Fe3O4 + H2';
  const rawCode = '<div class="cr-card"><button>+1 Fe</button></div>';

  const result = detectOpticsCanvas('', rawCode, context);

  assert.equal(result.isOptics, false);
});

test('detectOpticsCanvas: Corrupted JSON gracefully falls back to keyword analysis without throwing', () => {
  const corruptedJson = '{ type: "concave-mirror", dObj: 35, invalid ';
  const context = 'Explain concave mirror ray diagram between F and P';

  const result = detectOpticsCanvas('', corruptedJson, context);

  assert.equal(result.isOptics, true);
  assert.equal(result.type, 'concave-mirror');
  assert.equal(result.initialD, 35);
});
