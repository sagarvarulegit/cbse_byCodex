import type {
  BoardQuestionType,
  CurriculumScope,
  CurriculumSubject,
} from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import {
  chapter,
  chapterPackTopic,
  examProfile,
  topic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-hindi-b-085-2026-27';

const literatureTexts = [
  ['bade-bhai-sahab', 'बड़े भाई साहब', 'board-exam', 'bade-bhai-sahab', 'prose'],
  ['diary-ka-ek-panna', 'डायरी का एक पन्ना', 'board-exam', 'diary-ka-ek-panna', 'prose'],
  ['tantara-vamiro-katha', 'तताँरा-वामीरो कथा', 'board-exam', 'tantara-vamiro-katha', 'prose'],
  [
    'teesri-kasam-ke-shilpkar-shailendra',
    'तीसरी कसम के शिल्पकार शैलेंद्र',
    'board-exam',
    'teesri-kasam-shailendra',
    'prose',
  ],
  [
    'ab-kahan-doosron-ke-dukh-se-dukhi-hone-wale',
    'अब कहाँ दूसरे के दुख से दुखी होने वाले',
    'board-exam',
    'ab-kahan-doosre-ke-dukh',
    'prose',
  ],
  [
    'patjhar-mein-tooti-pattiyan',
    'पतझर में टूटी पत्तियाँ',
    'board-exam',
    'patjhar-me-tooti-pattiya',
    'prose',
  ],
  ['kartoos', 'कारतूस', 'board-exam', 'kartoos', 'prose'],
  ['sakhiyaan', 'साखियाँ', 'board-exam', 'sakhi', 'poetry'],
  ['pad', 'पद', 'board-exam', 'pad', 'poetry'],
  ['manushyata', 'मनुष्यता', 'board-exam', 'manushyata', 'poetry'],
  ['parvat-pradesh-mein-pavas', 'पर्वत प्रदेश में पावस', 'board-exam', 'parvat-pradesh-mein-pavas', 'poetry'],
  ['tope', 'तोप', 'board-exam', 'tope', 'poetry'],
  ['kar-chale-hum-fida', 'कर चले हम फ़िदा', 'board-exam', 'kar-chale-hum-fida', 'poetry'],
  ['aatmatran', 'आत्मत्राण', 'board-exam', 'aatmatran', 'poetry'],
  ['harihar-kaka', 'हरिहर काका', 'board-exam', 'harihar-kaka', 'supplementary'],
  ['sapnon-ke-se-din', 'सपनों के-से दिन', 'board-exam', 'sapnon-ke-se-din', 'supplementary'],
  ['topi-shukla', 'टोपी शुक्ला', 'board-exam', 'topi-shukla', 'supplementary'],
  ['bihari-ke-dohe', 'बिहारी के दोहे', 'excluded', null, 'poetry'],
  ['madhur-madhur-mere-deepak-jal', 'मधुर-मधुर मेरे दीपक जल', 'excluded', null, 'poetry'],
  ['girgit', 'गिरगिट', 'excluded', null, 'prose'],
] as const satisfies readonly [
  string,
  string,
  CurriculumScope,
  string | null,
  'prose' | 'poetry' | 'supplementary',
][];

function boardTopic(
  id: string,
  title: string,
  questionTypes: BoardQuestionType[],
  platformSlug?: string,
) {
  return topic(
    id,
    title,
    'board-exam',
    questionTypes,
    platformSlug
      ? [
          {
            chapterSlug: platformSlug,
            kind: 'chapter-pack',
          },
        ]
      : [],
  );
}

export const hindiCourseB: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: '085',
  slug: 'hindi-course-b',
  title: 'Hindi Course B',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  readinessBlockers: [],
  examProfile: examProfile(
    SOURCE_ID,
    [
      {
        id: 'unseen-comprehension',
        title: 'अपठित बोध',
        marks: 14,
        allowedQuestionTypes: ['mcq', 'very-short-answer', 'short-answer'],
      },
      {
        id: 'grammar',
        title: 'व्यावहारिक व्याकरण',
        marks: 16,
        allowedQuestionTypes: ['grammar', 'mcq'],
      },
      {
        id: 'literature',
        title: 'पाठ्यपुस्तक एवं पूरक पाठ्यपुस्तक',
        marks: 28,
        allowedQuestionTypes: ['extract-based', 'short-answer', 'long-answer', 'mcq'],
      },
      {
        id: 'creative-writing',
        title: 'रचनात्मक लेखन',
        marks: 22,
        allowedQuestionTypes: ['creative-writing'],
      },
    ],
    {
      status: 'ready',
    },
  ),
  books: [
    {
      id: 'sparsh-part-2',
      title: 'स्पर्श, भाग-2',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'sanchayan-part-2',
      title: 'संचयन, भाग-2',
      publisher: 'NCERT',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('unseen-comprehension', 'अपठित बोध', 14, [
      chapter({
        id: 'unseen-prose-passages',
        title: 'अपठित गद्यांश',
        platformChapterSlugs: ['hindi-apatit-gadyansh'],
        topics: [
          boardTopic(
            'unseen-prose-comprehension-analysis',
            'दो अपठित गद्यांशों का बोध, चिंतन, विश्लेषण और सराहना',
            ['mcq', 'very-short-answer', 'short-answer'],
            'hindi-apatit-gadyansh',
          ),
        ],
      }),
    ]),
    unit('grammar', 'व्यावहारिक व्याकरण', 16, [
      chapter({
        id: 'padbandh',
        title: 'पदबंध',
        platformChapterSlugs: ['hindi-padbandh'],
        topics: [boardTopic('grammar-padbandh', 'पदबंध', ['grammar'], 'hindi-padbandh')],
      }),
      chapter({
        id: 'vakya-rupantaran',
        title: 'रचना के आधार पर वाक्य रूपांतरण',
        platformChapterSlugs: ['hindi-vakya-rupantaran'],
        topics: [
          boardTopic(
            'grammar-vakya-rupantaran',
            'रचना के आधार पर वाक्य रूपांतरण',
            ['grammar'],
            'hindi-vakya-rupantaran',
          ),
        ],
      }),
      chapter({
        id: 'samaas',
        title: 'समास',
        platformChapterSlugs: ['hindi-samaas'],
        topics: [boardTopic('grammar-samaas', 'समास', ['grammar'], 'hindi-samaas')],
      }),
      chapter({
        id: 'muhavare',
        title: 'मुहावरे',
        platformChapterSlugs: ['hindi-muhavare'],
        topics: [boardTopic('grammar-muhavare', 'मुहावरे', ['grammar'], 'hindi-muhavare')],
      }),
    ]),
    unit(
      'literature',
      'पाठ्यपुस्तक एवं पूरक पाठ्यपुस्तक',
      28,
      literatureTexts.map(([id, title, scope, platformSlug, section]) => {
        const questionTypes: BoardQuestionType[] =
          scope === 'board-exam'
            ? section === 'supplementary'
              ? ['short-answer', 'long-answer']
              : ['extract-based', 'short-answer', 'long-answer']
            : [];
        const topicId = `hindi-${id}-official-text`;

        return chapter({
          id,
          title,
          scope,
          platformChapterSlugs: platformSlug ? [platformSlug] : [],
          topics: [
            platformSlug
              ? chapterPackTopic(
                  platformSlug,
                  topicId,
                  title,
                  scope,
                  questionTypes,
                )
              : topic(topicId, title, scope, questionTypes),
          ],
        });
      }),
    ),
    unit('creative-writing', 'रचनात्मक लेखन', 22, [
      chapter({
        id: 'anucched-lekhan',
        title: 'अनुच्छेद लेखन',
        platformChapterSlugs: ['hindi-anucched-lekhan'],
        topics: [
          boardTopic(
            'creative-writing-anucched',
            'संकेत-बिंदुओं पर लगभग 120 शब्दों में अनुच्छेद',
            ['creative-writing'],
            'hindi-anucched-lekhan',
          ),
        ],
      }),
      chapter({
        id: 'patra-lekhan',
        title: 'पत्र लेखन',
        platformChapterSlugs: ['hindi-patra-lekhan'],
        topics: [
          boardTopic(
            'creative-writing-formal-letter',
            'लगभग 100 शब्दों में औपचारिक पत्र',
            ['creative-writing'],
            'hindi-patra-lekhan',
          ),
        ],
      }),
      chapter({
        id: 'soochna-lekhan',
        title: 'सूचना लेखन',
        platformChapterSlugs: ['hindi-soochna-lekhan'],
        topics: [
          boardTopic(
            'creative-writing-notice',
            'लगभग 60 शब्दों में सूचना लेखन',
            ['creative-writing'],
            'hindi-soochna-lekhan',
          ),
        ],
      }),
      chapter({
        id: 'vigyapan-lekhan',
        title: 'विज्ञापन लेखन',
        platformChapterSlugs: ['hindi-vigyapan-lekhan'],
        topics: [
          boardTopic(
            'creative-writing-advertisement',
            'लगभग 40 शब्दों में विज्ञापन लेखन',
            ['creative-writing'],
            'hindi-vigyapan-lekhan',
          ),
        ],
      }),
      chapter({
        id: 'email-or-laghukatha',
        title: 'ई-मेल अथवा लघुकथा लेखन',
        platformChapterSlugs: ['hindi-email-or-laghukatha'],
        topics: [
          boardTopic(
            'creative-writing-email',
            'लगभग 80 शब्दों में औपचारिक ई-मेल',
            ['creative-writing'],
            'hindi-email-or-laghukatha',
          ),
          boardTopic(
            'creative-writing-short-story',
            'लगभग 100 शब्दों में लघुकथा',
            ['creative-writing'],
            'hindi-email-or-laghukatha',
          ),
        ],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
