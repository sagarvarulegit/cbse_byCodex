import type {
  BoardQuestionType,
  CurriculumScope,
  CurriculumSubject,
  CurriculumTopic,
} from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import {
  chapter,
  chapterPackTopic,
  examProfile,
  topic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-social-science-087-2026-27';
const socialQuestionTypes: BoardQuestionType[] = [
  'mcq',
  'short-answer',
  'long-answer',
  'source-based',
];

function socialTopic(
  chapterSlug: string,
  id: string,
  title: string,
  scope: CurriculumScope = 'board-exam',
  questionTypes: BoardQuestionType[] = socialQuestionTypes,
): CurriculumTopic {
  return chapterPackTopic(chapterSlug, id, title, scope, questionTypes);
}

function socialChapter(
  id: string,
  title: string,
  platformChapterSlug: string,
  topics: CurriculumTopic[],
  scope: CurriculumScope = 'board-exam',
) {
  return chapter({
    id,
    title,
    platformChapterSlugs: [platformChapterSlug],
    scope,
    topics,
  });
}

export const socialScience: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: '087',
  slug: 'social-science',
  title: 'Social Science',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  readinessBlockers: [],
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
      allowedQuestionTypes: [
        ...socialQuestionTypes,
        'case-study',
        'data-interpretation',
      ],
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
      socialChapter(
        'rise-of-nationalism-in-europe',
        'The Rise of Nationalism in Europe',
        'rise-of-nationalism-in-europe',
        [
          socialTopic(
            'rise-of-nationalism-in-europe',
            'rise-nationalism-french-revolution-nation-state',
            'The French Revolution and the idea of the nation-state',
          ),
          socialTopic(
            'rise-of-nationalism-in-europe',
            'rise-nationalism-european-nationalism-imperialism',
            'Nationalism, nation states and imperialism in Europe',
          ),
        ],
      ),
      socialChapter('nationalism-in-india', 'Nationalism in India', 'nationalism-in-india', [
        socialTopic(
          'nationalism-in-india',
          'nationalism-india-first-world-war-khilafat-non-cooperation',
          'First World War, Khilafat and Non-Cooperation',
        ),
        socialTopic(
          'nationalism-in-india',
          'nationalism-india-civil-disobedience-collective-belonging',
          'Civil Disobedience and the sense of collective belonging',
        ),
        socialTopic(
          'nationalism-in-india',
          'nationalism-india-map-skill',
          'Prescribed Nationalism in India map locations',
          'board-exam',
          ['map-skill'],
        ),
      ]),
      socialChapter(
        'making-of-a-global-world',
        'The Making of a Global World',
        'making-of-a-global-world',
        [
          socialTopic(
            'making-of-a-global-world',
            'making-of-a-global-world-pre-modern-world',
            'The pre-modern world',
          ),
          socialTopic(
            'making-of-a-global-world',
            'making-of-a-global-world-conquest-disease-trade',
            'Conquest, disease and trade',
          ),
          socialTopic(
            'making-of-a-global-world',
            'making-of-a-global-world-interdisciplinary-project',
            'The nineteenth century to globalisation interdisciplinary project',
            'project-only',
            [],
          ),
        ],
      ),
      socialChapter(
        'the-age-of-industrialisation',
        'The Age of Industrialisation',
        'the-age-of-industrialisation',
        [
          socialTopic(
            'the-age-of-industrialisation',
            'age-of-industrialisation-periodic-assessment',
            'Industrialisation and industrial change',
            'periodic-only',
            [],
          ),
        ],
        'periodic-only',
      ),
      socialChapter('print-culture', 'Print Culture and the Modern World', 'print-culture', [
        socialTopic(
          'print-culture',
          'print-culture-print-revolution',
          'The print revolution and its impact',
        ),
        socialTopic(
          'print-culture',
          'print-culture-religion-reform-public-debate',
          'Religion, reform and public debate',
        ),
        socialTopic(
          'print-culture',
          'print-culture-india-nationalism',
          'Print culture in India and nationalism',
        ),
      ]),
    ]),
    unit('geography', 'Geography', 20, [
      socialChapter(
        'resources-and-development',
        'Resources and Development',
        'resources-and-development',
        [
          socialTopic(
            'resources-and-development',
            'resources-classification-planning-development',
            'Resource classification, planning and development',
          ),
          socialTopic(
            'resources-and-development',
            'land-resources-soil-conservation',
            'Land resources, soils and conservation',
          ),
          socialTopic(
            'resources-and-development',
            'resources-and-development-map-skill',
            'Prescribed resource and soil map work',
            'board-exam',
            ['map-skill'],
          ),
        ],
      ),
      socialChapter(
        'forest-and-wildlife-resources',
        'Forest and Wildlife Resources',
        'forest-and-wildlife-resources',
        [
          socialTopic(
            'forest-and-wildlife-resources',
            'forest-wildlife-biodiversity-conservation',
            'Biodiversity and conservation',
          ),
          socialTopic(
            'forest-and-wildlife-resources',
            'forest-wildlife-community-conservation',
            'Community participation and conservation',
          ),
        ],
      ),
      socialChapter('water-resources', 'Water Resources', 'water-resources', [
        socialTopic(
          'water-resources',
          'water-scarcity-conservation',
          'Water scarcity and conservation',
        ),
        socialTopic(
          'water-resources',
          'multipurpose-projects-rainwater-harvesting',
          'Multipurpose projects and rainwater harvesting',
        ),
        socialTopic(
          'water-resources',
          'water-resources-map-skill',
          'Prescribed dams and water-resource map work',
          'board-exam',
          ['map-skill'],
        ),
      ]),
      socialChapter('agriculture', 'Agriculture', 'agriculture', [
        socialTopic(
          'agriculture',
          'agriculture-farming-types-cropping-pattern',
          'Types of farming and cropping patterns',
        ),
        socialTopic(
          'agriculture',
          'agriculture-major-crops-reforms',
          'Major crops, technological and institutional reforms',
        ),
        socialTopic(
          'agriculture',
          'agriculture-map-skill',
          'Prescribed crop map work',
          'board-exam',
          ['map-skill'],
        ),
      ]),
      socialChapter(
        'minerals-and-energy-resources',
        'Minerals and Energy Resources',
        'minerals-and-energy-resources',
        [
          socialTopic(
            'minerals-and-energy-resources',
            'minerals-occurrence-distribution-conservation',
            'Occurrence, distribution and conservation of minerals',
          ),
          socialTopic(
            'minerals-and-energy-resources',
            'energy-resources-conventional-nonconventional',
            'Conventional and non-conventional energy resources',
          ),
          socialTopic(
            'minerals-and-energy-resources',
            'minerals-energy-map-skill',
            'Prescribed mineral and energy map work',
            'board-exam',
            ['map-skill'],
          ),
        ],
      ),
      socialChapter(
        'manufacturing-industries',
        'Manufacturing Industries',
        'manufacturing-industries',
        [
          socialTopic(
            'manufacturing-industries',
            'manufacturing-importance-classification-location',
            'Importance, classification and location of manufacturing industries',
          ),
          socialTopic(
            'manufacturing-industries',
            'manufacturing-pollution-sustainable-development',
            'Industrial pollution and sustainable development',
          ),
          socialTopic(
            'manufacturing-industries',
            'manufacturing-industries-map-skill',
            'Prescribed manufacturing map work',
            'board-exam',
            ['map-skill'],
          ),
        ],
      ),
      socialChapter(
        'lifelines-of-national-economy',
        'Lifelines of National Economy',
        'lifelines-of-national-economy',
        [
          socialTopic(
            'lifelines-of-national-economy',
            'lifelines-of-national-economy-map-skill',
            'Board map pointing',
            'board-exam',
            ['map-skill'],
          ),
          socialTopic(
            'lifelines-of-national-economy',
            'lifelines-of-national-economy-interdisciplinary-project',
            'Interdisciplinary project',
            'project-only',
            [],
          ),
        ],
      ),
    ]),
    unit('political-science', 'Political Science', 20, [
      socialChapter('power-sharing', 'Power Sharing', 'power-sharing', [
        socialTopic(
          'power-sharing',
          'power-sharing-belgium-sri-lanka',
          'Belgium, Sri Lanka and the need for power sharing',
        ),
        socialTopic(
          'power-sharing',
          'power-sharing-forms',
          'Forms of power sharing',
          'board-exam',
          [...socialQuestionTypes, 'case-study'],
        ),
      ]),
      socialChapter('federalism', 'Federalism', 'federalism', [
        socialTopic('federalism', 'federalism-features-levels', 'Features and levels of federalism'),
        socialTopic(
          'federalism',
          'federalism-india-decentralisation',
          'Federalism in India and decentralisation',
          'board-exam',
          [...socialQuestionTypes, 'case-study'],
        ),
      ]),
      socialChapter(
        'gender-religion-and-caste',
        'Gender, Religion and Caste',
        'gender-religion-and-caste',
        [
          socialTopic(
            'gender-religion-and-caste',
            'gender-politics',
            'Gender division and politics',
            'board-exam',
            [...socialQuestionTypes, 'case-study'],
          ),
          socialTopic(
            'gender-religion-and-caste',
            'religion-caste-politics',
            'Religion, caste and politics',
            'board-exam',
            [...socialQuestionTypes, 'case-study'],
          ),
        ],
      ),
      socialChapter('political-parties', 'Political Parties', 'political-parties', [
        socialTopic(
          'political-parties',
          'political-parties-functions-necessity',
          'Functions and necessity of political parties',
        ),
        socialTopic(
          'political-parties',
          'political-parties-challenges-reforms',
          'Challenges and reforms',
          'board-exam',
          [...socialQuestionTypes, 'case-study'],
        ),
      ]),
      socialChapter(
        'outcomes-of-democracy',
        'Outcomes of Democracy',
        'outcomes-of-democracy',
        [
          socialTopic(
            'outcomes-of-democracy',
            'democracy-accountable-responsive-legitimate',
            'Accountable, responsive and legitimate government',
          ),
          socialTopic(
            'outcomes-of-democracy',
            'democracy-economic-social-dignity-outcomes',
            'Economic outcomes, inequality, social diversity, freedom and dignity',
            'board-exam',
            [...socialQuestionTypes, 'case-study'],
          ),
        ],
      ),
    ]),
    unit('economics', 'Economics', 20, [
      socialChapter('development', 'Development', 'development', [
        socialTopic(
          'development',
          'development-goals-income-criteria',
          'Development goals, income and comparison criteria',
          'board-exam',
          [...socialQuestionTypes, 'data-interpretation'],
        ),
        socialTopic(
          'development',
          'development-public-facilities-sustainability',
          'Public facilities and sustainable development',
          'board-exam',
          [...socialQuestionTypes, 'data-interpretation'],
        ),
      ]),
      socialChapter(
        'sectors-of-indian-economy',
        'Sectors of the Indian Economy',
        'sectors-of-indian-economy',
        [
          socialTopic(
            'sectors-of-indian-economy',
            'economic-sectors-primary-secondary-tertiary',
            'Primary, secondary and tertiary sectors',
            'board-exam',
            [...socialQuestionTypes, 'data-interpretation'],
          ),
          socialTopic(
            'sectors-of-indian-economy',
            'organised-unorganised-public-private',
            'Organised, unorganised, public and private sectors',
            'board-exam',
            [...socialQuestionTypes, 'data-interpretation'],
          ),
        ],
      ),
      socialChapter('money-and-credit', 'Money and Credit', 'money-and-credit', [
        socialTopic(
          'money-and-credit',
          'money-medium-exchange-modern-forms',
          'Money as a medium of exchange and modern forms of money',
        ),
        socialTopic(
          'money-and-credit',
          'credit-formal-informal-self-help-groups',
          'Formal and informal credit and self-help groups',
          'board-exam',
          [...socialQuestionTypes, 'case-study'],
        ),
      ]),
      socialChapter(
        'globalisation',
        'Globalisation and the Indian Economy',
        'globalisation',
        [
          socialTopic(
            'globalisation',
            'globalisation-board-exam',
            'What is globalisation and factors enabling globalisation',
            'board-exam',
            [...socialQuestionTypes, 'case-study'],
          ),
          socialTopic(
            'globalisation',
            'globalisation-interdisciplinary-project',
            'Production across countries, WTO and the struggle for fair globalisation',
            'project-only',
            [],
          ),
        ],
      ),
      socialChapter(
        'consumer-rights',
        'Consumer Rights',
        'consumer-rights',
        [
          socialTopic(
            'consumer-rights',
            'consumer-rights-project',
            'Consumer Rights project work',
            'project-only',
            [],
          ),
        ],
        'project-only',
      ),
    ]),
    unit('excluded-platform-packs', 'Excluded Duplicate Platform Packs', undefined, [
      chapter({
        id: 'the-rise-of-nationalism-in-europe-pack',
        title: 'The Rise of Nationalism in Europe (duplicate pack)',
        platformChapterSlugs: ['the-rise-of-nationalism-in-europe'],
        scope: 'excluded',
        topics: [
          topic(
            'the-rise-of-nationalism-in-europe-pack-duplicate',
            'Duplicate platform pack mapping',
            'excluded',
            [],
          ),
        ],
      }),
      chapter({
        id: 'the-making-of-a-global-world-pack',
        title: 'The Making of a Global World (duplicate pack)',
        platformChapterSlugs: ['the-making-of-a-global-world'],
        scope: 'excluded',
        topics: [
          topic(
            'the-making-of-a-global-world-pack-duplicate',
            'Duplicate platform pack mapping',
            'excluded',
            [],
          ),
        ],
      }),
      chapter({
        id: 'print-culture-and-the-modern-world-pack',
        title: 'Print Culture and the Modern World (duplicate pack)',
        platformChapterSlugs: ['print-culture-and-the-modern-world'],
        scope: 'excluded',
        topics: [
          topic(
            'print-culture-and-the-modern-world-pack-duplicate',
            'Duplicate platform pack mapping',
            'excluded',
            [],
          ),
        ],
      }),
      chapter({
        id: 'sectors-of-the-indian-economy-pack',
        title: 'Sectors of the Indian Economy (duplicate pack)',
        platformChapterSlugs: ['sectors-of-the-indian-economy'],
        scope: 'excluded',
        topics: [
          topic(
            'sectors-of-the-indian-economy-pack-duplicate',
            'Duplicate platform pack mapping',
            'excluded',
            [],
          ),
        ],
      }),
      chapter({
        id: 'globalisation-and-the-indian-economy-pack',
        title: 'Globalisation and the Indian Economy (duplicate pack)',
        platformChapterSlugs: ['globalisation-and-the-indian-economy'],
        scope: 'excluded',
        topics: [
          topic(
            'globalisation-and-the-indian-economy-pack-duplicate',
            'Duplicate platform pack mapping',
            'excluded',
            [],
          ),
        ],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
