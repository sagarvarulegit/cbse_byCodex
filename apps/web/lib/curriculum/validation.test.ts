import assert from 'node:assert/strict';
import test from 'node:test';

import {
  ACTIVE_CURRICULUM_SESSION,
  OFFICIAL_SOURCES,
  SOURCE_VERIFIED_ON,
  getOfficialSource,
} from './official-sources';

test('official sources register current and historical curriculum evidence', () => {
  assert.equal(ACTIVE_CURRICULUM_SESSION, '2026-27');
  assert.equal(SOURCE_VERIFIED_ON, '2026-06-24');

  assert.equal(
    getOfficialSource('cbse-curriculum-index-2026-27')?.academicSession,
    '2026-27',
  );
  assert.equal(getOfficialSource('cbse-sqp-index-2025-26')?.academicSession, '2025-26');
  assert.equal(getOfficialSource('cbse-board-papers-2026')?.sourceType, 'question-paper');
  assert.equal(getOfficialSource('cbse-hpe-2026-27')?.sourceType, 'curriculum');
});

test('every official source record has required provenance metadata', () => {
  const isoDate = /^\d{4}-\d{2}-\d{2}$/;

  for (const source of Object.values(OFFICIAL_SOURCES)) {
    assert.match(source.url, /^https:\/\//);
    assert.ok(source.publishedBy);
    assert.match(source.verifiedOn, isoDate);
  }
});
