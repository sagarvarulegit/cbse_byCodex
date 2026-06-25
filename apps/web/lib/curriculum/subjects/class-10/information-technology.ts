import type { CurriculumSubject } from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import { chapter, unit } from './helpers';

const SOURCE_ID = 'cbse-it-402-2026-27';

export const informationTechnology: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  readinessBlockers: [],
  subjectCode: '402',
  slug: 'information-technology',
  title: 'Information Technology',
  assessmentMode: 'optional-skill',
  status: 'future',
  visibleInCatalog: false,
  activationBlockers: [
    'Review curriculum coverage, assessment profile, and platform content before activation.',
  ],
  examProfile: null,
  books: [],
  units: [
    unit('employability-skills', 'Employability Skills', undefined, [
      chapter({
        id: 'communication-skills',
        title: 'Communication Skills',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'self-management-skills',
        title: 'Self-management Skills',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'ict-skills',
        title: 'ICT Skills',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'entrepreneurial-skills',
        title: 'Entrepreneurial Skills',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'green-skills',
        title: 'Green Skills',
        scope: 'supporting-resource',
      }),
    ]),
    unit('subject-specific-skills', 'Subject Specific Skills', undefined, [
      chapter({
        id: 'digital-documentation-advanced',
        title: 'Digital Documentation (Advanced)',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'electronic-spreadsheet-advanced',
        title: 'Electronic Spreadsheet (Advanced)',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'database-management-system',
        title: 'Database Management System',
        scope: 'supporting-resource',
      }),
      chapter({
        id: 'maintain-healthy-safe-and-secure-working-environment',
        title: 'Maintain Healthy, Safe and Secure Working Environment',
        scope: 'supporting-resource',
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
