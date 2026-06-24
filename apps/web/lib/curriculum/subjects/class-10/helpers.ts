import type {
  BoardQuestionType,
  CurriculumChapter,
  CurriculumScope,
  CurriculumTopic,
  CurriculumUnit,
  ExamProfile,
} from '../../types';

export const CLASS_10_CURRICULUM_SESSION = '2026-27';

type ChapterDefinition = {
  id: string;
  title: string;
  platformChapterSlugs?: string[];
  scope?: CurriculumScope;
  questionTypes?: BoardQuestionType[];
  requiredSkills?: string[];
  requiredAssets?: string[];
  topics?: CurriculumTopic[];
};

export function chapter({
  id,
  title,
  platformChapterSlugs = [],
  scope = 'board-exam',
  questionTypes = ['mcq', 'short-answer'],
  requiredSkills,
  requiredAssets,
  topics,
}: ChapterDefinition): CurriculumChapter {
  return {
    id,
    title,
    scope,
    platformChapterSlugs,
    requiredSkills,
    requiredAssets,
    topics:
      topics ??
      [
        {
          id: `${id}-coverage`,
          title,
          scope,
          platformTopicSlugs: [],
          requiredQuestionTypes: scope === 'board-exam' ? questionTypes : [],
          minimumReviewedQuestionCount: 0,
        },
      ],
  };
}

export function topic(
  id: string,
  title: string,
  scope: CurriculumScope,
  requiredQuestionTypes: BoardQuestionType[],
): CurriculumTopic {
  return {
    id,
    title,
    scope,
    platformTopicSlugs: [],
    requiredQuestionTypes,
    minimumReviewedQuestionCount: 0,
  };
}

export function unit(
  id: string,
  title: string,
  marks: number | undefined,
  chapters: CurriculumChapter[],
): CurriculumUnit {
  return {
    id,
    title,
    marks,
    chapters,
  };
}

export function examProfile(
  sourceId: string,
  sections: Array<{
    id: string;
    title: string;
    marks: number;
    allowedQuestionTypes: BoardQuestionType[];
  }>,
): ExamProfile {
  return {
    maximumMarks: 80,
    durationMinutes: 180,
    readingTimeMinutes: 15,
    sectionRules: sections,
    allowedMarkValues: [1, 2, 3, 4, 5, 6],
    blueprintSourceIds: [sourceId],
  };
}
