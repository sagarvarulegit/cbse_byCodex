import assert from 'node:assert/strict';
import test from 'node:test';

import { resolveLessonVideoStatus } from './lesson-video';

test('resolveLessonVideoStatus keeps lesson pages renderable when video API is offline', async () => {
  const result = await resolveLessonVideoStatus(async () => {
    throw new TypeError('fetch failed');
  });

  assert.deepEqual(result, { status: 'not-configured', video: null });
});
