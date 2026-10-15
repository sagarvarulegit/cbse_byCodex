import { strict as assert } from 'node:assert';
import { test } from 'node:test';

import { calculateMirrorOptics } from './optics-engine.js';

test('NCERT Case 6: Object between P and F (u < f) forms Virtual, Erect, Magnified image behind mirror', () => {
  const fMag = 80;
  const dObj = 40; // between P and F
  const result = calculateMirrorOptics({
    mirrorType: 'concave',
    focalLengthMag: fMag,
    objectDistanceMag: dObj,
    objectHeight: 35,
    poleX: 270,
    axisY: 140,
  });

  // NCERT Invariants:
  // 1. u = -40, f = -80
  assert.equal(result.u, -40);
  assert.equal(result.f, -80);

  // 2. Mirror formula: 1/v = 1/(-80) - 1/(-40) = -1/80 + 2/80 = +1/80 => v = +80 cm
  assert.equal(result.v, 80);

  // 3. Image is behind mirror (v > 0, x_I > poleX)
  assert.ok(result.isVirtual);
  assert.ok(result.imageBase !== null && result.imageBase.x > 270);

  // 4. Magnification: m = -v/u = -(80)/(-40) = +2.0 (Erect & Magnified)
  assert.equal(result.magnification, 2);
  assert.ok(result.isErect);
  assert.equal(result.sizeCategory, 'magnified');

  // 5. Image arrow points UP (imageTip.y < axisY)
  assert.ok(result.imageTip !== null && result.imageTip.y < 140);

  // 6. Ray 1 Virtual extension connects mirror to image tip
  assert.ok(result.ray1Virtual !== null);
  assert.equal(result.ray1Virtual.x1, 270);
  assert.equal(result.ray1Virtual.x2, result.imageTip!.x);
  assert.equal(result.ray1Virtual.y2, result.imageTip!.y);

  // 7. Ray 2 Virtual extension connects pole to image tip
  assert.ok(result.ray2Virtual !== null);
  assert.equal(result.ray2Virtual.x1, 270);
  assert.equal(result.ray2Virtual.y1, 140);
  assert.equal(result.ray2Virtual.x2, result.imageTip!.x);
  assert.equal(result.ray2Virtual.y2, result.imageTip!.y);
});

test('NCERT Case 3: Object at C (u = 2f) forms Real, Inverted, Same Size image at C', () => {
  const fMag = 60;
  const dObj = 120; // at C = 2f
  const result = calculateMirrorOptics({
    mirrorType: 'concave',
    focalLengthMag: fMag,
    objectDistanceMag: dObj,
    objectHeight: 30,
  });

  // 1. u = -120, f = -60
  assert.equal(result.u, -120);
  assert.equal(result.f, -60);

  // 2. v = (u*f)/(u-f) = (-120 * -60) / (-120 - (-60)) = 7200 / -60 = -120 cm (at C)
  assert.equal(result.v, -120);

  // 3. Real and Inverted
  assert.ok(!result.isVirtual);
  assert.ok(!result.isErect);

  // 4. Magnification m = -(-120)/(-120) = -1.0 (Same size)
  assert.equal(result.magnification, -1);
  assert.equal(result.sizeCategory, 'same-size');

  // 5. Image tip points DOWN (imageTip.y > axisY)
  assert.ok(result.imageTip !== null && result.imageTip.y > 140);
});

test('NCERT Case 4: Object between C and F (f < u < 2f) forms Real, Inverted, Magnified image beyond C', () => {
  const fMag = 60;
  const dObj = 90; // between C (120) and F (60)
  const result = calculateMirrorOptics({
    mirrorType: 'concave',
    focalLengthMag: fMag,
    objectDistanceMag: dObj,
    objectHeight: 30,
  });

  // v = (-90 * -60) / (-90 - (-60)) = 5400 / -30 = -180 cm (beyond C)
  assert.equal(result.v, -180);
  assert.ok(result.v! < -120); // beyond C
  assert.ok(!result.isVirtual);
  assert.ok(!result.isErect);
  assert.equal(result.magnification, -2);
  assert.equal(result.sizeCategory, 'magnified');
});

test('NCERT Case 2: Object beyond C (u > 2f) forms Real, Inverted, Diminished image between F and C', () => {
  const fMag = 60;
  const dObj = 180; // beyond C (120)
  const result = calculateMirrorOptics({
    mirrorType: 'concave',
    focalLengthMag: fMag,
    objectDistanceMag: dObj,
    objectHeight: 30,
  });

  // v = (-180 * -60) / (-180 - (-60)) = 10800 / -120 = -90 cm (between F(60) and C(120))
  assert.equal(result.v, -90);
  assert.ok(result.v! < -60 && result.v! > -120);
  assert.ok(!result.isVirtual);
  assert.ok(!result.isErect);
  assert.equal(result.magnification, -0.5);
  assert.equal(result.sizeCategory, 'diminished');
});

test('NCERT Case 5: Object at F (u = f) forms image at infinity with parallel reflected rays', () => {
  const fMag = 80;
  const dObj = 80; // at F
  const result = calculateMirrorOptics({
    mirrorType: 'concave',
    focalLengthMag: fMag,
    objectDistanceMag: dObj,
    objectHeight: 35,
  });

  assert.ok(result.isInfinity);
  assert.equal(result.v, null);
  assert.equal(result.imageBase, null);
  assert.ok(result.locationDescription.includes('infinity'));
});

test('Convex Mirror: Object in front of mirror always forms Virtual, Erect, Diminished image behind mirror', () => {
  const fMag = 60;
  const dObj = 90;
  const result = calculateMirrorOptics({
    mirrorType: 'convex',
    focalLengthMag: fMag,
    objectDistanceMag: dObj,
    objectHeight: 30,
  });

  // For convex mirror: f = +60, u = -90
  // v = (-90 * 60) / (-90 - 60) = -5400 / -150 = +36 cm (behind mirror between P and F)
  assert.equal(result.v, 36);
  assert.ok(result.isVirtual);
  assert.ok(result.isErect);
  assert.ok(result.magnification! > 0 && result.magnification! < 1);
  assert.equal(result.sizeCategory, 'diminished');
});
