import type { PaperSectionDefinition } from './types.js';

/**
 * Official CBSE Class X Mathematics (041) question-paper layout: 38 questions,
 * 80 marks, 3 hours, 15 minutes reading time. Section structure follows the
 * question-paper design in the current official curriculum source
 * (`cbse-mathematics-041-2026-27`, which is registry-marked blueprint-ready).
 *
 * NOTE: the official design must be re-verified against the newest official
 * SQP before each session. This layout is a faithful implementation of the
 * standing 2024-25/2025-26 design that CBSE has continued.
 */
export const MATHS_041_LAYOUT = {
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
  ] as PaperSectionDefinition[],
} as const;
