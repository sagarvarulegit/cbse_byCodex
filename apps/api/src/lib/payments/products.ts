export type PaymentProduct = {
  key: string;
  title: string;
  description: string;
  pricePaise: number; // in INR paise (e.g. 19900 = ₹199)
  originalPricePaise: number;
  currency: string;
  scope: 'all_subjects' | 'single_subject';
  includedSubjects: string[];
  paperCount: number;
  badge?: string;
};

export const ALL_SUBJECTS_MOCK_PACK_KEY = 'cbse10-all-subjects-mock-pack';
export const SINGLE_SUBJECT_MOCK_PASS_PREFIX = 'cbse10-mock-pass';

export const CORE_BOARD_SUBJECTS = [
  'mathematics-standard',
  'mathematics-basic',
  'science',
  'social-science',
  'english-language-and-literature',
  'hindi-course-a',
  'hindi-course-b',
] as const;

export const ALL_SUBJECTS_MOCK_PACK: PaymentProduct = {
  key: ALL_SUBJECTS_MOCK_PACK_KEY,
  title: 'Class 10 All-Subjects Board Mock Pack',
  description:
    'Instant access to all 35 full-length 80-mark mock test papers (Papers 1..5) ' +
    'across Mathematics Standard (041), Mathematics Basic (241), Science (086), ' +
    'Social Science (087), English (184), Hindi Course A (002), and Hindi Course B (085). Includes CBT timed exam mode, marking ' +
    'scheme step-wise answers, and weak-chapter diagnostics.',
  pricePaise: 19900, // ₹199
  originalPricePaise: 49900, // ₹499 (60% discount)
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: [...CORE_BOARD_SUBJECTS],
  paperCount: 35,
  badge: 'Best Value · All Papers',
};

const SUBJECT_NAMES: Record<string, string> = {
  'mathematics-standard': 'Mathematics Standard (041)',
  'mathematics-basic': 'Mathematics Basic (241)',
  'science': 'Science (086)',
  'social-science': 'Social Science (087)',
  'english-language-and-literature': 'English Language & Lit (184)',
  'hindi-course-a': 'Hindi Course A (002)',
  'hindi-course-b': 'Hindi Course B (085)',
};

export function getSingleSubjectProductKey(subjectSlug: string): string {
  return `${SINGLE_SUBJECT_MOCK_PASS_PREFIX}-${subjectSlug}`;
}

export function buildSingleSubjectProduct(subjectSlug: string): PaymentProduct {
  const subjectName = SUBJECT_NAMES[subjectSlug] ?? subjectSlug;
  return {
    key: getSingleSubjectProductKey(subjectSlug),
    title: `${subjectName} — 5 Board Mock Papers`,
    description: `Full access to all 5 official board-format mock papers (80 marks, 3 hours) for ${subjectName}.`,
    pricePaise: 9900, // ₹99
    originalPricePaise: 19900, // ₹199
    currency: 'INR',
    scope: 'single_subject',
    includedSubjects: [subjectSlug],
    paperCount: 5,
  };
}

export const UNLIMITED_QUIZ_PASS_KEY = 'cbse10-unlimited-quizzes-all';

export const UNLIMITED_QUIZ_PASS: PaymentProduct = {
  key: UNLIMITED_QUIZ_PASS_KEY,
  title: 'Class 10 Unlimited CBSE Quiz Pass (All 4 Subjects)',
  description:
    'Unlimited daily quizzes and random challenges across all 48 CBSE Class 10 NCERT chapters. ' +
    'Covers Mathematics, Science, Social Science, and English with instant scoring, ' +
    'Spaced Repetition Mistake Vault access, and streak multipliers.',
  pricePaise: 19900, // ₹199
  originalPricePaise: 59900, // ₹599
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: [...CORE_BOARD_SUBJECTS],
  paperCount: 48,
  badge: 'Unlimited Practice',
};

export const NCERT_ACTIVITY_DIAGRAM_PACK_KEY = 'cbse10-activity-diagram-pack';

export const NCERT_ACTIVITY_DIAGRAM_PACK: PaymentProduct = {
  key: NCERT_ACTIVITY_DIAGRAM_PACK_KEY,
  title: 'NCERT Activity & Diagram Mastery Pack',
  description:
    'Complete breakdown of all Class 10 NCERT Science activities (Chemistry, Biology, Physics) ' +
    'with step-by-step apparatus setup, observations, balanced chemical reactions, diagram-labeling drills, ' +
    'and verified 3-mark & 5-mark board exam questions. Includes downloadable printable handbook.',
  pricePaise: 9900, // ₹99
  originalPricePaise: 24900, // ₹249 (60% discount)
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: ['science'],
  paperCount: 16,
  badge: 'NCERT Special · ₹99',
};

export const FORMULA_CHEATSHEET_PACK_KEY = 'cbse10-formula-cheatsheet-pack';

export const FORMULA_CHEATSHEET_PACK: PaymentProduct = {
  key: FORMULA_CHEATSHEET_PACK_KEY,
  title: 'Class 10 Formula & Reaction Cheatsheet Pack',
  description:
    'Ultra-dense 1-page printable summary sheets per chapter for Class 10 Mathematics & Science. ' +
    'Includes all Maths formulas, theorems, standard value tables, Science chemical reactions, ' +
    'color changes, Physics sign conventions, and interactive digital flashcards.',
  pricePaise: 4900, // ₹49
  originalPricePaise: 14900, // ₹149 (67% discount)
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: ['mathematics-standard', 'science'],
  paperCount: 28,
  badge: 'Quick Revision · ₹49',
};

export const ACTIVITY_FORMULA_COMBO_PACK_KEY = 'cbse10-activity-formula-combo';

export const ACTIVITY_FORMULA_COMBO_PACK: PaymentProduct = {
  key: ACTIVITY_FORMULA_COMBO_PACK_KEY,
  title: 'Class 10 Activity, Diagram & Formula Super Combo',
  description:
    'Both the NCERT Activity & Diagram Mastery Pack and the Formula & Reaction Cheatsheet Pack ' +
    'bundled together at an exclusive discount. Everything you need for rapid board exam revision.',
  pricePaise: 12900, // ₹129
  originalPricePaise: 39900, // ₹399 (67% discount)
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: ['mathematics-standard', 'science'],
  paperCount: 44,
  badge: 'Best Value Combo · ₹129',
};

export const SCIENCE_CH1_5_PACK_KEY = 'cbse10-science-ch1-5-pack';

export const SCIENCE_CH1_5_PACK: PaymentProduct = {
  key: SCIENCE_CH1_5_PACK_KEY,
  title: 'Class 10 Science (Ch 1–5) Board Blueprint & PYQ Pack',
  description:
    'Instant access to 10-year verified CBSE Previous Year Questions (PYQs) with step-wise marking scheme answers, ' +
    'all NCERT experimental activity breakdowns (color changes, precipitates, gas tests), and 1-page rapid revision cheatsheets ' +
    'for Chapters 1 to 5 (Chemical Reactions, Acids/Bases, Metals/Non-Metals, Carbon Compounds, and Life Processes).',
  pricePaise: 9900, // ₹99
  originalPricePaise: 29900, // ₹299 (67% discount)
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: ['science'],
  paperCount: 25,
  badge: 'Flagship Pack · ₹99',
};

export function getAllAvailableProducts(): PaymentProduct[] {
  const singleSubjectProducts = CORE_BOARD_SUBJECTS.map((slug) =>
    buildSingleSubjectProduct(slug),
  );
  return [
    SCIENCE_CH1_5_PACK,
    ALL_SUBJECTS_MOCK_PACK,
    UNLIMITED_QUIZ_PASS,
    NCERT_ACTIVITY_DIAGRAM_PACK,
    FORMULA_CHEATSHEET_PACK,
    ACTIVITY_FORMULA_COMBO_PACK,
    ...singleSubjectProducts,
  ];
}

export function findProductByKey(
  productKey: string,
  subjectSlug?: string | null,
): PaymentProduct | null {
  if (productKey === SCIENCE_CH1_5_PACK_KEY) {
    return SCIENCE_CH1_5_PACK;
  }
  if (productKey === ALL_SUBJECTS_MOCK_PACK_KEY) {
    return ALL_SUBJECTS_MOCK_PACK;
  }
  if (productKey === UNLIMITED_QUIZ_PASS_KEY) {
    return UNLIMITED_QUIZ_PASS;
  }
  if (productKey === NCERT_ACTIVITY_DIAGRAM_PACK_KEY) {
    return NCERT_ACTIVITY_DIAGRAM_PACK;
  }
  if (productKey === FORMULA_CHEATSHEET_PACK_KEY) {
    return FORMULA_CHEATSHEET_PACK;
  }
  if (productKey === ACTIVITY_FORMULA_COMBO_PACK_KEY) {
    return ACTIVITY_FORMULA_COMBO_PACK;
  }
  if (productKey.startsWith(SINGLE_SUBJECT_MOCK_PASS_PREFIX)) {
    const slug = subjectSlug || productKey.replace(`${SINGLE_SUBJECT_MOCK_PASS_PREFIX}-`, '');
    return buildSingleSubjectProduct(slug);
  }
  return null;
}

