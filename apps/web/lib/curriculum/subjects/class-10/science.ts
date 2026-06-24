import type { CurriculumSubject } from '../../types';
import {
  CLASS_10_CURRICULUM_SESSION,
  chapter,
  examProfile,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-science-086-2026-27';

export const science: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_CURRICULUM_SESSION,
  subjectCode: '086',
  slug: 'science',
  title: 'Science',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  examProfile: examProfile(SOURCE_ID, [
    {
      id: 'chemical-substances',
      title: 'Chemical Substances - Nature and Behaviour',
      marks: 25,
      allowedQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'numerical'],
    },
    {
      id: 'world-of-living',
      title: 'World of Living',
      marks: 25,
      allowedQuestionTypes: ['mcq', 'short-answer', 'long-answer', 'diagram'],
    },
    {
      id: 'natural-phenomena',
      title: 'Natural Phenomena',
      marks: 12,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical', 'diagram'],
    },
    {
      id: 'effects-of-current',
      title: 'Effects of Current',
      marks: 13,
      allowedQuestionTypes: ['mcq', 'short-answer', 'numerical', 'diagram'],
    },
    {
      id: 'natural-resources',
      title: 'Natural Resources',
      marks: 5,
      allowedQuestionTypes: ['mcq', 'short-answer', 'case-study'],
    },
  ]),
  books: [
    {
      id: 'ncert-science-class-10',
      title: 'Science Textbook for Class X',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('chemical-substances', 'Chemical Substances - Nature and Behaviour', 25, [
      chapter({
        id: 'chemical-reactions-and-equations',
        title: 'Chemical Reactions and Equations',
        platformChapterSlugs: ['chemical-reactions-and-equations'],
        questionTypes: ['mcq', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'acids-bases-and-salts',
        title: 'Acids, Bases and Salts',
        platformChapterSlugs: ['acids-bases-and-salts'],
        questionTypes: ['mcq', 'short-answer', 'case-study', 'numerical'],
      }),
      chapter({
        id: 'metals-and-non-metals',
        title: 'Metals and Non-metals',
        platformChapterSlugs: ['metals-and-non-metals'],
        questionTypes: ['mcq', 'short-answer', 'long-answer'],
      }),
      chapter({
        id: 'carbon-and-its-compounds',
        title: 'Carbon and its Compounds',
        platformChapterSlugs: ['carbon-and-its-compounds'],
        questionTypes: ['mcq', 'short-answer', 'long-answer'],
      }),
    ]),
    unit('world-of-living', 'World of Living', 25, [
      chapter({
        id: 'life-processes',
        title: 'Life Processes',
        platformChapterSlugs: ['life-processes'],
        questionTypes: ['mcq', 'short-answer', 'long-answer', 'diagram'],
      }),
      chapter({
        id: 'control-and-coordination',
        title: 'Control and Coordination',
        platformChapterSlugs: ['control-and-coordination'],
        questionTypes: ['mcq', 'short-answer', 'diagram'],
      }),
      chapter({
        id: 'how-do-organisms-reproduce',
        title: 'How do Organisms Reproduce?',
        platformChapterSlugs: ['how-do-organisms-reproduce'],
        questionTypes: ['mcq', 'short-answer', 'long-answer', 'diagram'],
      }),
      chapter({
        id: 'heredity',
        title: 'Heredity',
        platformChapterSlugs: ['heredity'],
        questionTypes: ['mcq', 'short-answer', 'case-study'],
      }),
    ]),
    unit('natural-phenomena', 'Natural Phenomena', 12, [
      chapter({
        id: 'light-reflection-and-refraction',
        title: 'Light - Reflection and Refraction',
        platformChapterSlugs: ['light-reflection-and-refraction'],
        questionTypes: ['mcq', 'short-answer', 'numerical', 'diagram'],
      }),
      chapter({
        id: 'the-human-eye-and-the-colourful-world',
        title: 'The Human Eye and the Colourful World',
        platformChapterSlugs: ['the-human-eye-and-the-colourful-world'],
        questionTypes: ['mcq', 'short-answer', 'numerical', 'diagram'],
      }),
    ]),
    unit('effects-of-current', 'Effects of Current', 13, [
      chapter({
        id: 'electricity',
        title: 'Electricity',
        platformChapterSlugs: ['electricity'],
        questionTypes: ['mcq', 'short-answer', 'long-answer', 'numerical'],
      }),
      chapter({
        id: 'magnetic-effects-of-electric-current',
        title: 'Magnetic Effects of Electric Current',
        platformChapterSlugs: ['magnetic-effects-of-electric-current'],
        questionTypes: ['mcq', 'short-answer', 'diagram'],
      }),
    ]),
    unit('natural-resources', 'Natural Resources', 5, [
      chapter({
        id: 'our-environment',
        title: 'Our Environment',
        platformChapterSlugs: ['our-environment'],
        questionTypes: ['mcq', 'short-answer', 'case-study'],
      }),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
