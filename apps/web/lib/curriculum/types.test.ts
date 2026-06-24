import assert from 'node:assert/strict';
import test from 'node:test';

import './types';
import type { CurriculumSubject } from './types';

test('CurriculumSubject supports a versioned active board subject', () => {
  const subject: CurriculumSubject = {
    activationBlockers: [],
    academicSession: '2026-27',
    assessmentMode: 'board',
    books: [],
    classLevel: 10,
    examProfile: {
      allowedMarkValues: [1, 2, 3, 5],
      blueprintSourceIds: ['cbse-mathematics-041-2026-27'],
      durationMinutes: 180,
      maximumMarks: 80,
      readingTimeMinutes: 15,
      sectionRules: [],
    },
    officialSourceIds: ['cbse-mathematics-041-2026-27'],
    slug: 'mathematics-standard',
    status: 'active',
    subjectCode: '041',
    title: 'Mathematics Standard',
    units: [],
  };

  assert.equal(subject.subjectCode, '041');
  assert.equal(subject.examProfile?.maximumMarks, 80);
  assert.deepEqual(subject.activationBlockers, []);
});
