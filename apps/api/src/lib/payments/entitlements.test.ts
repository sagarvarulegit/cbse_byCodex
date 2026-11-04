import assert from 'node:assert/strict';
import { test } from 'node:test';

import { checkMockPaperAccess } from './entitlements.js';

test('checkMockPaperAccess allows all papers (1..5) as 100% free for everyone', async () => {
  // Paper 1 for unauthenticated guest
  const resultGuestP1 = await checkMockPaperAccess({
    userId: null,
    subjectSlug: 'mathematics-standard',
    paperNumber: 1,
  });
  assert.equal(resultGuestP1.isUnlocked, true);
  assert.equal(resultGuestP1.isFreeSample, true);

  // Paper 2 for unauthenticated guest
  const resultGuestP2 = await checkMockPaperAccess({
    userId: null,
    subjectSlug: 'mathematics-standard',
    paperNumber: 2,
  });
  assert.equal(resultGuestP2.isUnlocked, true);
  assert.equal(resultGuestP2.isFreeSample, true);

  // Papers 3..5 for new or existing user without any purchases
  for (const paperNumber of [3, 4, 5]) {
    const result = await checkMockPaperAccess({
      userId: 'student_new_user',
      subjectSlug: 'science',
      paperNumber,
    });
    assert.equal(result.isUnlocked, true);
    assert.equal(result.isFreeSample, true);
  }
});

test('checkMockPaperAccess allows Papers 1..5 across all subjects for all students', async () => {
  const subjects = [
    'mathematics-standard',
    'mathematics-basic',
    'science',
    'social-science',
    'english-language-and-literature',
    'hindi-course-a',
    'hindi-course-b',
  ];

  for (const subjectSlug of subjects) {
    const result = await checkMockPaperAccess({
      userId: 'old_student_user',
      subjectSlug,
      paperNumber: 4,
    });
    assert.equal(result.isUnlocked, true);
    assert.equal(result.isFreeSample, true);
  }
});
