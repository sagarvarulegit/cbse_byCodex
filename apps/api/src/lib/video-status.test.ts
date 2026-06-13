import assert from 'node:assert/strict';
import test from 'node:test';

import { getVideoStatusSyncTtlSeconds, shouldRefreshVideoStatus } from './video-status.js';

test('shouldRefreshVideoStatus refreshes records that have never been synced', () => {
  assert.equal(
    shouldRefreshVideoStatus({
      processingStatus: 'ready',
      statusSyncedAt: null,
    }),
    true,
  );
});

test('shouldRefreshVideoStatus uses a short TTL for active processing records', () => {
  const now = new Date('2026-06-12T10:00:31.000Z');
  const statusSyncedAt = new Date('2026-06-12T10:00:00.000Z');

  assert.equal(getVideoStatusSyncTtlSeconds('processing'), 30);
  assert.equal(
    shouldRefreshVideoStatus({
      now,
      processingStatus: 'processing',
      statusSyncedAt,
    }),
    true,
  );
});

test('shouldRefreshVideoStatus keeps terminal records cached for longer', () => {
  const now = new Date('2026-06-12T11:00:00.000Z');
  const statusSyncedAt = new Date('2026-06-12T10:00:00.000Z');

  assert.equal(getVideoStatusSyncTtlSeconds('ready'), 21_600);
  assert.equal(
    shouldRefreshVideoStatus({
      now,
      processingStatus: 'ready',
      statusSyncedAt,
    }),
    false,
  );
});
