import type { CurriculumSubject } from '../../types';
import {
  CLASS_10_CURRICULUM_SESSION,
  chapter,
  examProfile,
  topic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-social-science-087-2026-27';
const socialQuestionTypes = ['mcq', 'short-answer', 'long-answer', 'source-based'] as const;

export const socialScience: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: '087',
  slug: 'social-science',
  title: 'Social Science',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  examProfile: examProfile(SOURCE_ID, [
    {
      id: 'history',
      title: 'History',
      marks: 20,
      allowedQuestionTypes: [...socialQuestionTypes, 'map-skill'],
    },
    {
      id: 'geography',
      title: 'Geography',
      marks: 20,
      allowedQuestionTypes: [...socialQuestionTypes, 'map-skill'],
    },
    {
      id: 'political-science',
      title: 'Political Science',
      marks: 20,
      allowedQuestionTypes: [...socialQuestionTypes, 'case-study'],
    },
    {
      id: 'economics',
      title: 'Economics',
      marks: 20,
      allowedQuestionTypes: [...socialQuestionTypes, 'case-study', 'data-interpretation'],
    },
  ]),
  books: [
    {
      id: 'ncert-india-and-contemporary-world-2',
      title: 'India and the Contemporary World - II',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-contemporary-india-2',
      title: 'Contemporary India - II',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-democratic-politics-2',
      title: 'Democratic Politics - II',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-understanding-economic-development',
      title: 'Understanding Economic Development',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('history', 'History', 20, [
      chapter({
        id: 'rise-of-nationalism-in-europe',
        title: 'The Rise of Nationalism in Europe',
        platformChapterSlugs: ['rise-of-nationalism-in-europe'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'nationalism-in-india',
        title: 'Nationalism in India',
        platformChapterSlugs: ['nationalism-in-india'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'making-of-a-global-world',
        title: 'The Making of a Global World',
        platformChapterSlugs: ['making-of-a-global-world'],
        topics: [
          topic(
            'making-of-a-global-world-board-exam',
            'Pre-modern World to Conquest, Disease and Trade',
            'board-exam',
            [...socialQuestionTypes],
          ),
          topic(
            'making-of-a-global-world-interdisciplinary-project',
            'The Nineteenth Century to Globalisation Interdisciplinary Project',
            'project-only',
            [],
          ),
        ],
      }),
      chapter({
        id: 'the-age-of-industrialisation',
        title: 'The Age of Industrialisation',
        platformChapterSlugs: ['the-age-of-industrialisation'],
        scope: 'periodic-only',
      }),
      chapter({
        id: 'print-culture',
        title: 'Print Culture and the Modern World',
        platformChapterSlugs: ['print-culture'],
        questionTypes: [...socialQuestionTypes],
      }),
    ]),
    unit('geography', 'Geography', 20, [
      chapter({
        id: 'resources-and-development',
        title: 'Resources and Development',
        platformChapterSlugs: ['resources-and-development'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'forest-and-wildlife-resources',
        title: 'Forest and Wildlife Resources',
        platformChapterSlugs: ['forest-and-wildlife-resources'],
        questionTypes: [...socialQuestionTypes],
      }),
      chapter({
        id: 'water-resources',
        title: 'Water Resources',
        platformChapterSlugs: ['water-resources'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'agriculture',
        title: 'Agriculture',
        platformChapterSlugs: ['agriculture'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'minerals-and-energy-resources',
        title: 'Minerals and Energy Resources',
        platformChapterSlugs: ['minerals-and-energy-resources'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'manufacturing-industries',
        title: 'Manufacturing Industries',
        platformChapterSlugs: ['manufacturing-industries'],
        questionTypes: [...socialQuestionTypes, 'map-skill'],
      }),
      chapter({
        id: 'lifelines-of-national-economy',
        title: 'Lifelines of National Economy',
        platformChapterSlugs: ['lifelines-of-national-economy'],
        topics: [
          topic(
            'lifelines-of-national-economy-map-skill',
            'Board Map Pointing',
            'board-exam',
            ['map-skill'],
          ),
          topic(
            'lifelines-of-national-economy-interdisciplinary-project',
            'Interdisciplinary Project',
            'project-only',
            [],
          ),
        ],
      }),
    ]),
    unit('political-science', 'Political Science', 20, [
      chapter({
        id: 'power-sharing',
        title: 'Power Sharing',
        platformChapterSlugs: ['power-sharing'],
        questionTypes: [...socialQuestionTypes, 'case-study'],
      }),
      chapter({
        id: 'federalism',
        title: 'Federalism',
        platformChapterSlugs: ['federalism'],
        questionTypes: [...socialQuestionTypes, 'case-study'],
      }),
      chapter({
        id: 'gender-religion-and-caste',
        title: 'Gender, Religion and Caste',
        platformChapterSlugs: ['gender-religion-and-caste'],
        questionTypes: [...socialQuestionTypes, 'case-study'],
      }),
      chapter({
        id: 'political-parties',
        title: 'Political Parties',
        platformChapterSlugs: ['political-parties'],
        questionTypes: [...socialQuestionTypes, 'case-study'],
      }),
      chapter({
        id: 'outcomes-of-democracy',
        title: 'Outcomes of Democracy',
        platformChapterSlugs: ['outcomes-of-democracy'],
        questionTypes: [...socialQuestionTypes, 'case-study'],
      }),
    ]),
    unit('economics', 'Economics', 20, [
      chapter({
        id: 'development',
        title: 'Development',
        platformChapterSlugs: ['development'],
        questionTypes: [...socialQuestionTypes, 'data-interpretation'],
      }),
      chapter({
        id: 'sectors-of-indian-economy',
        title: 'Sectors of the Indian Economy',
        platformChapterSlugs: ['sectors-of-indian-economy'],
        questionTypes: [...socialQuestionTypes, 'data-interpretation'],
      }),
      chapter({
        id: 'money-and-credit',
        title: 'Money and Credit',
        platformChapterSlugs: ['money-and-credit'],
        questionTypes: [...socialQuestionTypes, 'case-study'],
      }),
      chapter({
        id: 'globalisation',
        title: 'Globalisation and the Indian Economy',
        platformChapterSlugs: ['globalisation'],
        topics: [
          topic(
            'globalisation-board-exam',
            'What is Globalisation and Factors Enabling Globalisation',
            'board-exam',
            [...socialQuestionTypes, 'case-study'],
          ),
          topic(
            'globalisation-interdisciplinary-project',
            'Production, WTO, Chinese Toys, and Fair Globalisation Project',
            'project-only',
            [],
          ),
        ],
      }),
      chapter({
        id: 'consumer-rights',
        title: 'Consumer Rights',
        platformChapterSlugs: ['consumer-rights'],
        scope: 'project-only',
      }),
    ]),
    unit('excluded-platform-packs', 'Excluded Duplicate Platform Packs', undefined, [
      chapter({
        id: 'the-rise-of-nationalism-in-europe-pack',
        title: 'The Rise of Nationalism in Europe (duplicate pack)',
        platformChapterSlugs: ['the-rise-of-nationalism-in-europe'],
        scope: 'excluded',
      }),
      chapter({
        id: 'the-making-of-a-global-world-pack',
        title: 'The Making of a Global World (duplicate pack)',
        platformChapterSlugs: ['the-making-of-a-global-world'],
        scope: 'excluded',
      }),
      chapter({
        id: 'print-culture-and-the-modern-world-pack',
        title: 'Print Culture and the Modern World (duplicate pack)',
        platformChapterSlugs: ['print-culture-and-the-modern-world'],
        scope: 'excluded',
      }),
      chapter({
        id: 'sectors-of-the-indian-economy-pack',
        title: 'Sectors of the Indian Economy (duplicate pack)',
        platformChapterSlugs: ['sectors-of-the-indian-economy'],
        scope: 'excluded',
      }),
      chapter({
        id: 'globalisation-and-the-indian-economy-pack',
        title: 'Globalisation and the Indian Economy (duplicate pack)',
        platformChapterSlugs: ['globalisation-and-the-indian-economy'],
        scope: 'excluded',
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
