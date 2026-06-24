import type { CurriculumSubject } from '../../types';
import {
  CLASS_10_CURRICULUM_SESSION,
  chapter,
  examProfile,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-hindi-b-085-2026-27';

export const hindiCourseB: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: '085',
  slug: 'hindi-course-b',
  title: 'Hindi Course B',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  examProfile: examProfile(SOURCE_ID, [
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
      allowedQuestionTypes: ['grammar'],
    },
    {
      id: 'literature',
      title: 'पाठ्यपुस्तक एवं पूरक पाठ्यपुस्तक',
      marks: 28,
      allowedQuestionTypes: ['extract-based', 'short-answer', 'long-answer'],
    },
    {
      id: 'creative-writing',
      title: 'रचनात्मक लेखन',
      marks: 22,
      allowedQuestionTypes: ['creative-writing'],
    },
  ]),
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
        questionTypes: ['mcq', 'very-short-answer', 'short-answer'],
      }),
    ]),
    unit('grammar', 'व्यावहारिक व्याकरण', 16, [
      chapter({
        id: 'padbandh',
        title: 'पदबंध',
        questionTypes: ['grammar'],
      }),
      chapter({
        id: 'vakya-rupantaran',
        title: 'रचना के आधार पर वाक्य रूपांतरण',
        questionTypes: ['grammar'],
      }),
      chapter({
        id: 'samaas',
        title: 'समास',
        questionTypes: ['grammar'],
      }),
      chapter({
        id: 'muhavare',
        title: 'मुहावरे',
        questionTypes: ['grammar'],
      }),
    ]),
    unit('literature', 'पाठ्यपुस्तक एवं पूरक पाठ्यपुस्तक', 28, [
      chapter({
        id: 'bade-bhai-sahab',
        title: 'बड़े भाई साहब',
        platformChapterSlugs: ['bade-bhai-sahab'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'diary-ka-ek-panna',
        title: 'डायरी का एक पन्ना',
        platformChapterSlugs: ['diary-ka-ek-panna'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'tantara-vamiro-katha',
        title: 'तताँरा-वामीरो कथा',
        platformChapterSlugs: ['tantara-vamiro-katha'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'teesri-kasam-ke-shilpkar-shailendra',
        title: 'तीसरी कसम के शिल्पकार शैलेंद्र',
        platformChapterSlugs: ['teesri-kasam-shailendra'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'ab-kahan-doosron-ke-dukh-se-dukhi-hone-wale',
        title: 'अब कहाँ दूसरे के दुख से दुखी होने वाले',
        platformChapterSlugs: ['ab-kahan-doosre-ke-dukh'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'patjhar-mein-tooti-pattiyan',
        title: 'पतझर में टूटी पत्तियाँ',
        platformChapterSlugs: ['patjhar-me-tooti-pattiya'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'kartoos',
        title: 'कारतूस',
        platformChapterSlugs: ['kartoos'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'sakhiyaan',
        title: 'साखियाँ',
        platformChapterSlugs: ['sakhi'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'pad',
        title: 'पद',
        platformChapterSlugs: ['pad'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'manushyata',
        title: 'मनुष्यता',
        platformChapterSlugs: ['manushyata'],
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'parvat-pradesh-mein-pavas',
        title: 'पर्वत प्रदेश में पावस',
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'tope',
        title: 'तोप',
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'kar-chale-hum-fida',
        title: 'कर चले हम फ़िदा',
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'aatmatran',
        title: 'आत्मत्राण',
        questionTypes: ['extract-based', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'harihar-kaka',
        title: 'हरिहर काका',
        questionTypes: ['short-answer', 'long-answer'],
      }),
      chapter({
        id: 'topi-shukla',
        title: 'टोपी शुक्ला',
        questionTypes: ['short-answer', 'long-answer'],
      }),
      chapter({
        id: 'sapnon-ke-se-din',
        title: 'सपनों के-से दिन',
        questionTypes: ['short-answer', 'long-answer'],
      }),
      chapter({
        id: 'bihari-ke-dohe',
        title: 'बिहारी के दोहे',
        scope: 'excluded',
      }),
      chapter({
        id: 'madhur-madhur-mere-deepak-jal',
        title: 'मधुर-मधुर मेरे दीपक जल',
        scope: 'excluded',
      }),
      chapter({
        id: 'girgit',
        title: 'गिरगिट',
        scope: 'excluded',
      }),
    ]),
    unit('creative-writing', 'रचनात्मक लेखन', 22, [
      chapter({
        id: 'anucched-lekhan',
        title: 'अनुच्छेद लेखन',
        questionTypes: ['creative-writing'],
      }),
      chapter({
        id: 'patra-lekhan',
        title: 'पत्र लेखन',
        questionTypes: ['creative-writing'],
      }),
      chapter({
        id: 'soochna-lekhan',
        title: 'सूचना लेखन',
        questionTypes: ['creative-writing'],
      }),
      chapter({
        id: 'vigyapan-lekhan',
        title: 'विज्ञापन लेखन',
        questionTypes: ['creative-writing'],
      }),
      chapter({
        id: 'email-or-laghukatha',
        title: 'ई-मेल अथवा लघुकथा लेखन',
        questionTypes: ['creative-writing'],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
