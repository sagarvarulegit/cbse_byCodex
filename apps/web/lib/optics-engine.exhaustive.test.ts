import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateMirrorOptics, calculateLensOptics } from './optics-engine';

test('EXHAUSTIVE TEST: Concave Mirror across all object distance ranges', async (t) => {
  const fMag = 70; // Focus at 70cm, C at 140cm

  await t.test('Case 6: u < f (Between P and F) -> Virtual, Erect, Magnified behind mirror', () => {
    // Sweep distances from 5cm to 65cm
    for (let d = 5; d <= 65; d += 5) {
      const res = calculateMirrorOptics({
        mirrorType: 'concave',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, true, `Expected virtual for d=${d}`);
      assert.equal(res.isErect, true, `Expected erect for d=${d}`);
      assert.ok(res.v! > 0, `Expected v > 0 (behind mirror) for d=${d}, got ${res.v}`);
      assert.ok(res.magnification! > 1.0, `Expected m > 1 (magnified) for d=${d}, got ${res.magnification}`);
      assert.equal(res.isInfinity, false);

      // Verify Mirror Formula: 1/v + 1/u = 1/f
      const invV = 1 / res.v!;
      const invU = 1 / res.u;
      const invF = 1 / res.f;
      assert.ok(Math.abs(invV + invU - invF) < 1e-9, `Mirror formula violated at d=${d}`);

      // Verify Ray coordinates are finite and non-NaN
      assert.ok(!Number.isNaN(res.ray1Incident.x1));
      assert.ok(!Number.isNaN(res.ray1Reflected.y2));
      assert.ok(res.ray1Virtual !== null, 'Virtual extension must exist');
      assert.ok(res.ray2Virtual !== null, 'Virtual extension must exist');
    }
  });

  await t.test('Case 5: u = f (At Focus F) -> Infinite limit, parallel reflected rays', () => {
    const res = calculateMirrorOptics({
      mirrorType: 'concave',
      focalLengthMag: fMag,
      objectDistanceMag: 70, // Exactly at focus
      objectHeight: 35,
    });

    assert.equal(res.isInfinity, true);
    assert.equal(res.v, null);
    assert.equal(res.magnification, null);
    assert.ok(res.ncertTableCase.includes('infinity'));
    assert.ok(!Number.isNaN(res.ray1Reflected.y2));
    assert.ok(!Number.isNaN(res.ray2Reflected.y2));
  });

  await t.test('Case 4: f < u < 2f (Between C and F) -> Real, Inverted, Magnified beyond C', () => {
    for (let d = 75; d <= 135; d += 10) {
      const res = calculateMirrorOptics({
        mirrorType: 'concave',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, false, `Expected real for d=${d}`);
      assert.equal(res.isErect, false, `Expected inverted for d=${d}`);
      assert.ok(res.v! < -140, `Expected image beyond C (|v| > 2f) for d=${d}, got ${res.v}`);
      assert.ok(res.magnification! < -1.0, `Expected m < -1 (magnified & inverted) for d=${d}`);
      assert.ok(
        res.sizeCategory === 'magnified' || res.sizeCategory === 'highly-magnified',
        `Expected magnified or highly-magnified, got ${res.sizeCategory} for d=${d}`,
      );
      assert.equal(res.ray1Virtual, null);
      assert.equal(res.ray2Virtual, null);

      // Verify Mirror Formula
      const invV = 1 / res.v!;
      const invU = 1 / res.u;
      const invF = 1 / res.f;
      assert.ok(Math.abs(invV + invU - invF) < 1e-9);
    }
  });

  await t.test('Case 3: u = 2f (At C) -> Real, Inverted, Same Size at C', () => {
    const res = calculateMirrorOptics({
      mirrorType: 'concave',
      focalLengthMag: fMag,
      objectDistanceMag: 140, // 2 * 70
      objectHeight: 35,
    });

    assert.equal(res.isVirtual, false);
    assert.equal(res.isErect, false);
    assert.ok(Math.abs(res.v! - (-140)) < 1e-6, `Image should be at v = -140, got ${res.v}`);
    assert.ok(Math.abs(res.magnification! - (-1.0)) < 1e-6, `Magnification should be -1.0, got ${res.magnification}`);
    assert.equal(res.sizeCategory, 'same-size');
  });

  await t.test('Case 2: u > 2f (Beyond C) -> Real, Inverted, Diminished between F and C', () => {
    for (let d = 150; d <= 280; d += 20) {
      const res = calculateMirrorOptics({
        mirrorType: 'concave',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, false);
      assert.equal(res.isErect, false);
      assert.ok(res.v! > -140 && res.v! < -70, `Image should be between F (-70) and C (-140), got ${res.v}`);
      assert.ok(res.magnification! > -1.0 && res.magnification! < 0, `Magnification between -1 and 0, got ${res.magnification}`);
      assert.ok(res.sizeCategory === 'diminished' || res.sizeCategory === 'highly-diminished');
    }
  });
});

test('EXHAUSTIVE TEST: Convex Mirror', async (t) => {
  const fMag = 70;

  await t.test('Always Virtual, Erect, and Diminished behind mirror', () => {
    for (let d = 10; d <= 300; d += 20) {
      const res = calculateMirrorOptics({
        mirrorType: 'convex',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, true);
      assert.equal(res.isErect, true);
      assert.ok(res.v! > 0 && res.v! < 70, `Image must form between P (0) and F (+70), got ${res.v}`);
      assert.ok(res.magnification! > 0 && res.magnification! < 1.0, `m must be between 0 and +1, got ${res.magnification}`);
      assert.ok(res.ray1Virtual !== null);
      assert.ok(res.ray2Virtual !== null);
    }
  });
});

test('EXHAUSTIVE TEST: Convex Lens across all object distance ranges', async (t) => {
  const fMag = 70;

  await t.test('Case 6: u < f (Between F1 and Optical Center O) -> Virtual, Erect, Magnified on same side', () => {
    for (let d = 10; d <= 60; d += 10) {
      const res = calculateLensOptics({
        lensType: 'convex',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, true, `Expected virtual for d=${d}`);
      assert.equal(res.isErect, true, `Expected erect for d=${d}`);
      assert.ok(res.v! < 0, `For lenses, virtual image on same side means v < 0, got ${res.v}`);
      assert.ok(res.magnification! > 1.0, `Expected m > 1 for d=${d}, got ${res.magnification}`);
      assert.ok(res.ray1Virtual !== null);
      assert.ok(res.ray2Virtual !== null);

      // Verify Lens Formula: 1/v - 1/u = 1/f
      const invV = 1 / res.v!;
      const invU = 1 / res.u;
      const invF = 1 / res.f;
      assert.ok(Math.abs(invV - invU - invF) < 1e-9, `Lens formula violated at d=${d}`);
    }
  });

  await t.test('Case 3: u = 2f (At 2F1) -> Real, Inverted, Same Size at 2F2', () => {
    const res = calculateLensOptics({
      lensType: 'convex',
      focalLengthMag: fMag,
      objectDistanceMag: 140,
      objectHeight: 35,
    });

    assert.equal(res.isVirtual, false);
    assert.equal(res.isErect, false);
    assert.ok(Math.abs(res.v! - 140) < 1e-6, `Image should be at +140, got ${res.v}`);
    assert.ok(Math.abs(res.magnification! - (-1.0)) < 1e-6, `Magnification should be -1.0, got ${res.magnification}`);
    assert.equal(res.sizeCategory, 'same-size');
  });

  await t.test('Case 4: f < u < 2f (Between F1 and 2F1) -> Real, Inverted, Magnified beyond 2F2', () => {
    for (let d = 80; d <= 130; d += 10) {
      const res = calculateLensOptics({
        lensType: 'convex',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, false);
      assert.equal(res.isErect, false);
      assert.ok(res.v! > 140, `Image should be beyond 2F2 (> +140), got ${res.v}`);
      assert.ok(res.magnification! < -1.0, `m should be < -1.0, got ${res.magnification}`);
    }
  });

  await t.test('Case 2: u > 2f (Beyond 2F1) -> Real, Inverted, Diminished between F2 and 2F2', () => {
    for (let d = 160; d <= 260; d += 20) {
      const res = calculateLensOptics({
        lensType: 'convex',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, false);
      assert.equal(res.isErect, false);
      assert.ok(res.v! > 70 && res.v! < 140, `Image between +70 and +140, got ${res.v}`);
      assert.ok(res.magnification! > -1.0 && res.magnification! < 0, `m between -1 and 0, got ${res.magnification}`);
    }
  });
});

test('EXHAUSTIVE TEST: Concave Lens', async (t) => {
  const fMag = 70;

  await t.test('Always Virtual, Erect, and Diminished between O and F1', () => {
    for (let d = 10; d <= 300; d += 25) {
      const res = calculateLensOptics({
        lensType: 'concave',
        focalLengthMag: fMag,
        objectDistanceMag: d,
        objectHeight: 35,
      });

      assert.equal(res.isVirtual, true);
      assert.equal(res.isErect, true);
      assert.ok(res.v! < 0 && res.v! > -70, `v must be between 0 and -70, got ${res.v}`);
      assert.ok(res.magnification! > 0 && res.magnification! < 1.0, `m must be between 0 and +1, got ${res.magnification}`);
      assert.ok(res.ray1Virtual !== null);
      assert.ok(res.ray2Virtual !== null);
    }
  });
});
