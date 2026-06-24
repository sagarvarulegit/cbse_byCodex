import type { CurriculumSubject } from '../../types';
import { CLASS_10_CURRICULUM_SESSION } from './helpers';

export const artificialIntelligence: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: '417',
  slug: 'artificial-intelligence',
  title: 'Artificial Intelligence',
  assessmentMode: 'optional-skill',
  status: 'future',
  visibleInCatalog: false,
  activationBlockers: [
    'Verify and register the official 2026-27 Artificial Intelligence curriculum source.',
    'Review curriculum coverage, assessment profile, and platform content before activation.',
  ],
  examProfile: null,
  books: [],
  units: [],
  officialSourceIds: [],
};
