import {
  getPracticeRemediation,
  getPracticeSkillLabel,
  type PracticeRemediation,
} from './chapter-practice';

export type ExamPracticeDefinition = {
  chapterSlug: string;
  checkingMinutes: number;
  conditionLabels: string[];
  id: string;
  lessonSlug: string;
  maxMarks: number;
  practiceItemId: string;
  title: string;
  weakSkillSlugs: string[];
  writingMinutes: number;
};

export type ExamPracticePack = {
  chapterSlug: string;
  definitions: ExamPracticeDefinition[];
};

const chapterOneExamDefinitions: ExamPracticeDefinition[] = [
  {
    chapterSlug: 'chemical-reactions-and-equations',
    checkingMinutes: 8,
    conditionLabels: [
      'I used only blank paper and a pen.',
      'Notes, lessons and answer checks stayed closed during writing time.',
      'I attempted every question before checking answers.',
    ],
    id: 'cre-diagnostic-a',
    lessonSlug: 'board-readiness-diagnostic',
    maxMarks: 30,
    practiceItemId: 'cre-diagnostic-a-exam',
    title: 'Diagnostic A exam attempt',
    weakSkillSlugs: [
      'balancing',
      'observation',
      'equation-writing',
      'reaction-classification',
      'reasoning',
      'redox-agent',
      'multi-part-completion',
    ],
    writingMinutes: 30,
  },
  {
    chapterSlug: 'chemical-reactions-and-equations',
    checkingMinutes: 5,
    conditionLabels: [
      'I used only blank paper and a pen.',
      'Lessons, revision sheets and answer checks stayed closed during writing time.',
      'I attempted the complete paper before checking answers.',
    ],
    id: 'cre-diagnostic-b',
    lessonSlug: 'board-readiness-diagnostic-b',
    maxMarks: 20,
    practiceItemId: 'cre-diagnostic-b-exam',
    title: 'Diagnostic B transfer attempt',
    weakSkillSlugs: [
      'electrolysis-conductivity',
      'electrode-labels',
      'volume-ratio',
      'mass-ratio',
      'observation',
      'balancing',
      'reaction-condition',
      'redox-agent',
    ],
    writingMinutes: 22,
  },
];

const examPracticePacks: ExamPracticePack[] = [
  {
    chapterSlug: 'chemical-reactions-and-equations',
    definitions: chapterOneExamDefinitions,
  },
];

export function createExamPracticeRegistry(
  packs: ExamPracticePack[],
  hasRemediation: (chapterSlug: string, skillSlug: string) => boolean = (
    chapterSlug,
    skillSlug,
  ) => Boolean(getPracticeRemediation(chapterSlug, skillSlug)),
) {
  const definitions = new Map<string, ExamPracticeDefinition>();

  for (const pack of packs) {
    for (const definition of pack.definitions) {
      if (definition.chapterSlug !== pack.chapterSlug) {
        throw new Error(`Exam practice ${definition.id} belongs to the wrong chapter pack.`);
      }
      if (definitions.has(definition.id)) {
        throw new Error(`Duplicate exam-practice id: ${definition.id}`);
      }
      if (
        definition.maxMarks < 1 ||
        definition.maxMarks > 40 ||
        definition.writingMinutes < 1 ||
        definition.checkingMinutes < 1
      ) {
        throw new Error(`Exam practice ${definition.id} has invalid limits.`);
      }
      for (const skillSlug of definition.weakSkillSlugs) {
        if (!hasRemediation(definition.chapterSlug, skillSlug)) {
          throw new Error(`Exam practice ${definition.id} has no remediation for ${skillSlug}.`);
        }
      }
      definitions.set(definition.id, definition);
    }
  }

  return {
    getDefinition(id: string) {
      return definitions.get(id) ?? null;
    },
  };
}

const examPracticeRegistry = createExamPracticeRegistry(examPracticePacks);

export function getExamPracticeDefinition(id: string) {
  return examPracticeRegistry.getDefinition(id);
}

export function getExamSkillOptions(definition: ExamPracticeDefinition) {
  return definition.weakSkillSlugs.map((skillSlug) => ({
    label: getPracticeSkillLabel(definition.chapterSlug, skillSlug),
    remediation: getPracticeRemediation(
      definition.chapterSlug,
      skillSlug,
    ) as PracticeRemediation,
    skillSlug,
  }));
}
