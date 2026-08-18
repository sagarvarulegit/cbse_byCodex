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
  'science',
  'social-science',
  'english-language-and-literature',
] as const;

export const ALL_SUBJECTS_MOCK_PACK: PaymentProduct = {
  key: ALL_SUBJECTS_MOCK_PACK_KEY,
  title: 'Class 10 All-Subjects Board Mock Pack',
  description:
    'Instant access to all 20 full-length 80-mark mock test papers (Papers 1..5) ' +
    'across Mathematics Standard (041), Science (086), Social Science (087), and ' +
    'English (184). Includes CBT timed exam mode, marking scheme step-wise answers, ' +
    'and weak-chapter diagnostics.',
  pricePaise: 19900, // ₹199
  originalPricePaise: 49900, // ₹499 (60% discount)
  currency: 'INR',
  scope: 'all_subjects',
  includedSubjects: [...CORE_BOARD_SUBJECTS],
  paperCount: 20,
  badge: 'Best Value · 20 Papers',
};

const SUBJECT_NAMES: Record<string, string> = {
  'mathematics-standard': 'Mathematics Standard (041)',
  'science': 'Science (086)',
  'social-science': 'Social Science (087)',
  'english-language-and-literature': 'English Language & Lit (184)',
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

export function getAllAvailableProducts(): PaymentProduct[] {
  const singleSubjectProducts = CORE_BOARD_SUBJECTS.map((slug) =>
    buildSingleSubjectProduct(slug),
  );
  return [ALL_SUBJECTS_MOCK_PACK, UNLIMITED_QUIZ_PASS, ...singleSubjectProducts];
}

export function findProductByKey(
  productKey: string,
  subjectSlug?: string | null,
): PaymentProduct | null {
  if (productKey === ALL_SUBJECTS_MOCK_PACK_KEY) {
    return ALL_SUBJECTS_MOCK_PACK;
  }
  if (productKey === UNLIMITED_QUIZ_PASS_KEY) {
    return UNLIMITED_QUIZ_PASS;
  }
  if (productKey.startsWith(SINGLE_SUBJECT_MOCK_PASS_PREFIX)) {
    const slug = subjectSlug || productKey.replace(`${SINGLE_SUBJECT_MOCK_PASS_PREFIX}-`, '');
    return buildSingleSubjectProduct(slug);
  }
  return null;
}
