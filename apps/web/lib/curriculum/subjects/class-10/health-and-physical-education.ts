import type { CurriculumSubject } from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import {
  chapter,
  chapterPackTopic,
  topic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-hpe-2026-27';

export const healthAndPhysicalEducation: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: 'HPE',
  slug: 'health-and-physical-education',
  title: 'Health and Physical Education',
  assessmentMode: 'internal',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  readinessBlockers: [],
  examProfile: null,
  books: [],
  units: [
    unit('games-and-sports', 'Games / Sports', 50, [
      chapter({
        id: 'games-and-sports-participation',
        title: 'Games and Sports Participation',
        platformChapterSlugs: ['sports-and-games'],
        scope: 'internal-only',
        topics: [
          chapterPackTopic(
            'sports-and-games',
            'games-and-sports-skills-strategies-fitness',
            'Skills, strategies, tactics, fitness and performance improvement',
            'internal-only',
            [],
          ),
        ],
      }),
    ]),
    unit('health-and-fitness', 'Health and Fitness', 25, [
      chapter({
        id: 'health-and-fitness-assessment',
        title: 'Health and Fitness Assessment',
        platformChapterSlugs: [
          'physical-fitness-and-wellness',
          'health-and-diseases',
          'nutrition-and-diet',
          'first-aid-and-safety',
        ],
        scope: 'internal-only',
        topics: [
          chapterPackTopic(
            'physical-fitness-and-wellness',
            'health-and-fitness-tests',
            'Health, physical fitness and the prescribed fitness tests',
            'internal-only',
            [],
          ),
          chapterPackTopic(
            'health-and-diseases',
            'health-and-diseases-support',
            'Health and diseases platform resource',
            'supporting-resource',
            [],
          ),
          chapterPackTopic(
            'nutrition-and-diet',
            'nutrition-and-diet-support',
            'Nutrition and diet platform resource',
            'supporting-resource',
            [],
          ),
          chapterPackTopic(
            'first-aid-and-safety',
            'first-aid-and-safety-support',
            'Safety education and first aid platform resource',
            'supporting-resource',
            [],
          ),
        ],
      }),
    ]),
    unit('sewa', 'SEWA', 25, [
      chapter({
        id: 'sewa-project',
        title: 'Social Empowerment through Work Education and Action',
        scope: 'internal-only',
        topics: [
          topic(
            'sewa-project-planning-evidence-reflection',
            'Project planning, action, evidence, communication and reflection',
            'internal-only',
            [],
          ),
        ],
      }),
    ]),
    unit('health-and-activity-card', 'Health and Activity Card', 0, [
      chapter({
        id: 'health-and-activity-card-record',
        title: 'Health and Activity Card',
        scope: 'supporting-resource',
        topics: [
          topic(
            'health-and-activity-card-recording',
            'Recording health, fitness and activity observations',
            'supporting-resource',
            [],
          ),
        ],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
