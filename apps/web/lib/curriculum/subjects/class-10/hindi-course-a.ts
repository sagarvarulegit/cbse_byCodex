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

const SOURCE_ID = 'cbse-hindi-a-002-2026-27';

const literatureTexts = [
  ['netaji-ka-chashma', 'नेताजी का चश्मा', 'board-exam', 'netaji-ka-chashma', 'prose'],
  ['balgobin-bhagat', 'बालगोबिन भगत', 'board-exam', 'balgobin-bhagat', 'prose'],
  ['lakhnavi-andaz', 'लखनवी अंदाज़', 'board-exam', 'lakhnavi-andaz', 'prose'],
  ['ek-kahani-yeh-bhi', 'एक कहानी यह भी', 'board-exam', 'ek-kahani-yeh-bhi', 'prose'],
  ['naubatkhane-mein-ibadat', 'नौबतखाने में इबादत', 'board-exam', 'naubatkhane-mein-ibadat', 'prose'],
  ['sanskriti', 'संस्कृति', 'board-exam', 'sanskriti', 'prose'],
  ['pad-surdas', 'पद (सूरदास)', 'board-exam', 'pad-surdas', 'poetry'],
  ['ram-lakshman-parshuram-samvad', 'राम-लक्ष्मण-परशुराम संवाद', 'board-exam', 'ram-lakshman-parshuram-samvad', 'poetry'],
  ['aatmakathya', 'आत्मकथ्य', 'board-exam', 'aatmakathya', 'poetry'],
  ['utsah-at-nahi-rahi-hai', 'उत्साह / अट नहीं रही है', 'board-exam', 'utsah-at-nahi-rahi-hai', 'poetry'],
  ['yeh-danturit-muskan-fasal', 'यह दंतुरहित मुस्कान / फसल', 'board-exam', 'yeh-danturit-muskan-fasal', 'poetry'],
  ['sangatkaar', 'संगतकार', 'board-exam', 'sangatkaar', 'poetry'],
  ['mata-ka-aanchal', 'माता का आँचल', 'board-exam', 'mata-ka-aanchal', 'supplementary'],
  ['sana-sana-hath-jodi', 'साना-साना हाथ जोड़ि...', 'board-exam', 'sana-sana-hath-jodi', 'supplementary'],
  ['main-kyon-likhta-hoon', 'मैं क्यों लिखता हूँ?', 'board-exam', 'main-kyon-likhta-hoon', 'supplementary'],
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

export const hindiCourseA: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: '002',
  slug: 'hindi-course-a',
  title: 'Hindi Course A',
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
        allowedQuestionTypes: ['mcq', 'very-short-answer', 'short-answer', 'case-study'],
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
        marks: 30,
        allowedQuestionTypes: ['extract-based', 'short-answer', 'long-answer', 'mcq', 'case-study'],
      },
      {
        id: 'creative-writing',
        title: 'रचनात्मक लेखन',
        marks: 20,
        allowedQuestionTypes: ['creative-writing'],
      },
    ],
    {
      status: 'ready',
    },
  ),
  books: [
    {
      id: 'kshitij-part-2',
      title: 'क्षितिज, भाग-2',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'kritika-part-2',
      title: 'कृतिका, भाग-2',
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
        platformChapterSlugs: ['hindi-a-apatit-gadyansh'],
        topics: [
          boardTopic(
            'unseen-prose-passage-a',
            'अपठित गद्यांश (बोध, चिंतन, विश्लेषण)',
            ['mcq', 'very-short-answer', 'short-answer', 'case-study'],
            'hindi-a-apatit-gadyansh',
          ),
        ],
      }),
      chapter({
        id: 'unseen-poetry-passages',
        title: 'अपठित काव्यांश',
        platformChapterSlugs: ['hindi-a-apatit-kavyansh'],
        topics: [
          boardTopic(
            'unseen-poetry-passage-a',
            'अपठित काव्यांश (भाव-सौंदर्य व बोध)',
            ['mcq', 'very-short-answer', 'short-answer'],
            'hindi-a-apatit-kavyansh',
          ),
        ],
      }),
    ]),
    unit('grammar', 'व्यावहारिक व्याकरण', 16, [
      chapter({
        id: 'vakya-bhed',
        title: 'रचना के आधार पर वाक्य भेद',
        platformChapterSlugs: ['hindi-a-vakya-bhed'],
        topics: [
          boardTopic('grammar-vakya-bhed-a', 'रचना के आधार पर वाक्य भेद', ['grammar', 'mcq'], 'hindi-a-vakya-bhed'),
        ],
      }),
      chapter({
        id: 'vachya',
        title: 'वाच्य',
        platformChapterSlugs: ['hindi-a-vachya'],
        topics: [boardTopic('grammar-vachya-a', 'वाच्य (कर्तृ, कर्म, भाव)', ['grammar', 'mcq'], 'hindi-a-vachya')],
      }),
      chapter({
        id: 'pad-parichay',
        title: 'पद परिचय',
        platformChapterSlugs: ['hindi-a-pad-parichay'],
        topics: [boardTopic('grammar-pad-parichay-a', 'पद परिचय', ['grammar', 'mcq'], 'hindi-a-pad-parichay')],
      }),
      chapter({
        id: 'alankar',
        title: 'अलंकार',
        platformChapterSlugs: ['hindi-a-alankar'],
        topics: [boardTopic('grammar-alankar-a', 'अलंकार (श्लेष, उत्प्रेक्षा, अतिशयोक्ति, मानवीकरण)', ['grammar', 'mcq'], 'hindi-a-alankar')],
      }),
    ]),
    unit(
      'literature',
      'पाठ्यपुस्तक एवं पूरक पाठ्यपुस्तक',
      30,
      literatureTexts.map(([id, title, scope, platformSlug, section]) => {
        const questionTypes: BoardQuestionType[] =
          scope === 'board-exam'
            ? section === 'supplementary'
              ? ['short-answer', 'long-answer']
              : ['extract-based', 'short-answer', 'long-answer', 'case-study']
            : [];
        const topicId = `hindi-a-${id}-official-text`;

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
              : boardTopic(topicId, title, questionTypes),
          ],
        });
      }),
    ),
    unit('creative-writing', 'रचनात्मक लेखन', 20, [
      chapter({
        id: 'anuched-lekhan-a',
        title: 'अनुच्छेद लेखन',
        platformChapterSlugs: ['hindi-a-anuched-lekhan'],
        topics: [
          boardTopic(
            'creative-writing-anuched-a',
            'समसामयिक / व्यावहारिक विषयों पर अनुच्छेद',
            ['creative-writing'],
            'hindi-a-anuched-lekhan',
          ),
        ],
      }),
      chapter({
        id: 'patra-lekhan-a',
        title: 'पत्र लेखन',
        platformChapterSlugs: ['hindi-a-patra-lekhan'],
        topics: [
          boardTopic(
            'creative-writing-patra-a',
            'औपचारिक एवं अनौपचारिक पत्र लेखन',
            ['creative-writing'],
            'hindi-a-patra-lekhan',
          ),
        ],
      }),
      chapter({
        id: 'swavritt-email-lekhan-a',
        title: 'स्ववृत्त / ई-मेल लेखन',
        platformChapterSlugs: ['hindi-a-swavritt-email'],
        topics: [
          boardTopic(
            'creative-writing-swavritt-email-a',
            'स्ववृत्त लेखन अथवा ई-मेल लेखन',
            ['creative-writing'],
            'hindi-a-swavritt-email',
          ),
        ],
      }),
      chapter({
        id: 'vigyapan-sandesh-lekhan-a',
        title: 'विज्ञापन / संदेश लेखन',
        platformChapterSlugs: ['hindi-a-vigyapan-sandesh'],
        topics: [
          boardTopic(
            'creative-writing-vigyapan-sandesh-a',
            'विज्ञापन लेखन अथवा शुभकामना / बधाई संदेश',
            ['creative-writing'],
            'hindi-a-vigyapan-sandesh',
          ),
        ],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
