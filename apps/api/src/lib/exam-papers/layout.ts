import type { PaperSectionDefinition } from './types.js';

export type PaperLayout = {
  layoutVersion: string;
  designSource: string;
  totalMarks: number;
  durationMinutes: number;
  readingTimeMinutes: number;
  sections: PaperSectionDefinition[];
};

/**
 * Official CBSE Class X Mathematics (041) question-paper layout: 38 questions,
 * 80 marks, 3 hours, 15 minutes reading time. Section structure follows the
 * question-paper design in the current official curriculum source
 * (`cbse-mathematics-041-2026-27`, which is registry-marked blueprint-ready).
 */
export const MATHS_041_LAYOUT: PaperLayout = {
  layoutVersion: 'maths-041-2026-27-design-v1',
  designSource: 'cbse-mathematics-041-2026-27',
  totalMarks: 80,
  durationMinutes: 180,
  readingTimeMinutes: 15,
  sections: [
    {
      id: 'A',
      title: 'Section A',
      instructions:
        'This section has 20 multiple choice questions (Q1 to Q20). Each question carries 1 mark.',
      questionCount: 20,
      marksPerQuestion: 1,
      allowedBankTypes: ['mcq'],
    },
    {
      id: 'B',
      title: 'Section B',
      instructions:
        'This section has 5 very short answer questions (Q21 to Q25). Each question carries 2 marks.',
      questionCount: 5,
      marksPerQuestion: 2,
      allowedBankTypes: ['short-answer', 'numerical', 'proof'],
    },
    {
      id: 'C',
      title: 'Section C',
      instructions:
        'This section has 6 short answer questions (Q26 to Q31). Each question carries 3 marks.',
      questionCount: 6,
      marksPerQuestion: 3,
      allowedBankTypes: ['short-answer', 'numerical', 'proof', 'data-interpretation'],
    },
    {
      id: 'D',
      title: 'Section D',
      instructions:
        'This section has 4 long answer questions (Q32 to Q35). Each question carries 5 marks.',
      questionCount: 4,
      marksPerQuestion: 5,
      allowedBankTypes: ['long-answer', 'proof', 'numerical', 'construction'],
    },
    {
      id: 'E',
      title: 'Section E',
      instructions:
        'This section has 3 case-study questions (Q36 to Q38). Each question carries 4 marks and has sub-parts.',
      questionCount: 3,
      marksPerQuestion: 4,
      allowedBankTypes: ['case-study', 'data-interpretation'],
    },
  ],
};

/**
 * Official CBSE Class X Science (086) question-paper layout: 39 questions,
 * 80 marks, 3 hours, 15 minutes reading time. Section structure follows the
 * official CBSE Class 10 Science question-paper design.
 */
export const SCIENCE_086_LAYOUT: PaperLayout = {
  layoutVersion: 'science-086-2026-27-design-v1',
  designSource: 'cbse-science-086-2026-27',
  totalMarks: 80,
  durationMinutes: 180,
  readingTimeMinutes: 15,
  sections: [
    {
      id: 'A',
      title: 'Section A',
      instructions:
        'This section has 20 multiple choice questions (Q1 to Q20) carrying 1 mark each.',
      questionCount: 20,
      marksPerQuestion: 1,
      allowedBankTypes: ['mcq'],
    },
    {
      id: 'B',
      title: 'Section B',
      instructions:
        'This section has 6 very short answer questions (Q21 to Q26) carrying 2 marks each.',
      questionCount: 6,
      marksPerQuestion: 2,
      allowedBankTypes: ['short-answer', 'numerical', 'diagram'],
    },
    {
      id: 'C',
      title: 'Section C',
      instructions:
        'This section has 7 short answer questions (Q27 to Q33) carrying 3 marks each.',
      questionCount: 7,
      marksPerQuestion: 3,
      allowedBankTypes: ['short-answer', 'numerical', 'diagram', 'data-interpretation'],
    },
    {
      id: 'D',
      title: 'Section D',
      instructions:
        'This section has 3 long answer questions (Q34 to Q36) carrying 5 marks each.',
      questionCount: 3,
      marksPerQuestion: 5,
      allowedBankTypes: ['long-answer', 'numerical', 'diagram'],
    },
    {
      id: 'E',
      title: 'Section E',
      instructions:
        'This section has 3 case-based / data-interpretation questions (Q37 to Q39) carrying 4 marks each with sub-parts.',
      questionCount: 3,
      marksPerQuestion: 4,
      allowedBankTypes: ['case-study', 'data-interpretation'],
    },
  ],
};

/**
 * Official CBSE Class X Social Science (087) question-paper layout: 37 questions,
 * 80 marks, 3 hours, 15 minutes reading time. Section structure follows the
 * official CBSE Class 10 Social Science question-paper design across 6 sections (A to F).
 */
export const SOCIAL_SCIENCE_087_LAYOUT: PaperLayout = {
  layoutVersion: 'social-science-087-2026-27-design-v1',
  designSource: 'cbse-social-science-087-2026-27',
  totalMarks: 80,
  durationMinutes: 180,
  readingTimeMinutes: 15,
  sections: [
    {
      id: 'A',
      title: 'Section A',
      instructions:
        'This section has 20 multiple choice questions (Q1 to Q20) carrying 1 mark each.',
      questionCount: 20,
      marksPerQuestion: 1,
      allowedBankTypes: ['mcq'],
    },
    {
      id: 'B',
      title: 'Section B',
      instructions:
        'This section has 4 very short answer questions (Q21 to Q24) carrying 2 marks each. Answers should not exceed 40 words.',
      questionCount: 4,
      marksPerQuestion: 2,
      allowedBankTypes: ['short-answer'],
    },
    {
      id: 'C',
      title: 'Section C',
      instructions:
        'This section has 5 short answer questions (Q25 to Q29) carrying 3 marks each. Answers should not exceed 60 words.',
      questionCount: 5,
      marksPerQuestion: 3,
      allowedBankTypes: ['short-answer', 'source-based'],
    },
    {
      id: 'D',
      title: 'Section D',
      instructions:
        'This section has 4 long answer questions (Q30 to Q33) carrying 5 marks each. Answers should not exceed 120 words.',
      questionCount: 4,
      marksPerQuestion: 5,
      allowedBankTypes: ['long-answer'],
    },
    {
      id: 'E',
      title: 'Section E',
      instructions:
        'This section has 3 case-based / source-based questions (Q34 to Q36) carrying 4 marks each with sub-questions (1+1+2 marks).',
      questionCount: 3,
      marksPerQuestion: 4,
      allowedBankTypes: ['case-study', 'source-based', 'data-interpretation'],
    },
    {
      id: 'F',
      title: 'Section F',
      instructions:
        'This section has 1 map skill-based question (Q37) carrying 5 marks with two parts: 37a from History (2 marks) and 37b from Geography (3 marks).',
      questionCount: 1,
      marksPerQuestion: 5,
      allowedBankTypes: ['map-skill', 'case-study', 'short-answer'],
    },
  ],
};

/**
 * Official CBSE Class X English Language & Literature (184) question-paper layout:
 * 34 questions, 80 marks, 3 hours, 15 minutes reading time across Reading (20m),
 * Writing & Grammar (20m), and Language through Literature (40m).
 */
export const ENGLISH_184_LAYOUT: PaperLayout = {
  layoutVersion: 'english-184-2026-27-design-v1',
  designSource: 'cbse-english-184-2026-27',
  totalMarks: 80,
  durationMinutes: 180,
  readingTimeMinutes: 15,
  sections: [
    {
      id: 'A',
      title: 'Section A: Reading & Grammar (Objective)',
      instructions:
        'This section contains 20 objective type / multiple choice / gap-filling questions (Q1 to Q20) carrying 1 mark each covering Reading Comprehension and Grammar.',
      questionCount: 20,
      marksPerQuestion: 1,
      allowedBankTypes: ['mcq', 'grammar', 'short-answer'],
    },
    {
      id: 'B',
      title: 'Section B: Creative Writing Skills & Extracts',
      instructions:
        'This section contains 4 questions (Q21 to Q24) carrying 5 marks each: Formal Letter, Analytical Paragraph, Prose Extract, and Poetry Extract.',
      questionCount: 4,
      marksPerQuestion: 5,
      allowedBankTypes: ['creative-writing', 'extract-based', 'short-answer', 'data-interpretation'],
    },
    {
      id: 'C',
      title: 'Section C: Short Answer Questions (Literature)',
      instructions:
        'This section contains 6 short answer questions (Q25 to Q30) carrying 3 marks each from First Flight (Prose/Poetry) and Footprints Without Feet. Answers should be in 40-50 words.',
      questionCount: 6,
      marksPerQuestion: 3,
      allowedBankTypes: ['short-answer', 'extract-based'],
    },
    {
      id: 'D',
      title: 'Section D: Long Answer Questions (Literature Analysis)',
      instructions:
        'This section contains 2 long answer questions (Q31 to Q32) carrying 6 marks each from First Flight and Footprints Without Feet. Answers should be in 100-120 words.',
      questionCount: 2,
      marksPerQuestion: 6,
      allowedBankTypes: ['long-answer'],
    },
    {
      id: 'E',
      title: 'Section E: Reading Comprehension Passages',
      instructions:
        'This section contains 2 comprehension passages / case-study questions (Q33 to Q34) carrying 5 marks each with analytical sub-questions.',
      questionCount: 2,
      marksPerQuestion: 5,
      allowedBankTypes: ['case-study', 'source-based', 'data-interpretation'],
    },
  ],
};

export const MATHS_241_LAYOUT: PaperLayout = {
  ...MATHS_041_LAYOUT,
  layoutVersion: 'maths-241-2026-27-design-v1',
  designSource: 'cbse-mathematics-241-2026-27',
};

const LAYOUTS: Record<string, PaperLayout> = {
  'mathematics-standard': MATHS_041_LAYOUT,
  'mathematics-basic': MATHS_241_LAYOUT,
  'science': SCIENCE_086_LAYOUT,
  'social-science': SOCIAL_SCIENCE_087_LAYOUT,
  'english-language-and-literature': ENGLISH_184_LAYOUT,
};

export function getPaperLayout(subjectSlug: string = 'mathematics-standard'): PaperLayout {
  const layout = LAYOUTS[subjectSlug];
  if (!layout) {
    throw new Error(`No paper layout configured for subject "${subjectSlug}".`);
  }
  return layout;
}
