import type { CurriculumSubject } from '../../types';
import { CLASS_10_CURRICULUM_SESSION, chapter, unit } from './helpers';

const SOURCE_ID = 'cbse-hpe-2026-27';

export const healthAndPhysicalEducation: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: 'HPE',
  slug: 'health-and-physical-education',
  title: 'Health and Physical Education',
  assessmentMode: 'internal',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  examProfile: null,
  books: [],
  units: [
    unit('health-and-physical-education', 'Health and Physical Education', undefined, [
      chapter({
        id: 'health-and-diseases',
        title: 'Health and Diseases',
        platformChapterSlugs: ['health-and-diseases'],
        scope: 'internal-only',
      }),
      chapter({
        id: 'physical-fitness-and-wellness',
        title: 'Physical Fitness and Wellness',
        platformChapterSlugs: ['physical-fitness-and-wellness'],
        scope: 'internal-only',
      }),
      chapter({
        id: 'sports-and-games',
        title: 'Sports and Games',
        platformChapterSlugs: ['sports-and-games'],
        scope: 'internal-only',
      }),
      chapter({
        id: 'nutrition-and-diet',
        title: 'Nutrition and Diet',
        platformChapterSlugs: ['nutrition-and-diet'],
        scope: 'internal-only',
      }),
      chapter({
        id: 'first-aid-and-safety',
        title: 'Safety Education and First Aid',
        platformChapterSlugs: ['first-aid-and-safety'],
        scope: 'internal-only',
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
