import type {
  BoardQuestionType,
  CurriculumChapter,
  CurriculumScope,
  CurriculumTopic,
  CurriculumUnit,
  ExamProfile,
} from '../../types';

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
          platformContentRefs: platformChapterSlugs.map((chapterSlug) => ({
            chapterSlug,
            kind: 'chapter-pack' as const,
          })),
          requiredQuestionTypes: scope === 'board-exam' ? questionTypes : [],
          minimumReviewedQuestionCount: scope === 'board-exam' ? 3 : 0,
        },
      ],
  };
}

export function topic(
  id: string,
  title: string,
  scope: CurriculumScope,
  requiredQuestionTypes: BoardQuestionType[],
  platformContentRefs: CurriculumTopic['platformContentRefs'] = [],
  minimumReviewedQuestionCount = scope === 'board-exam' ? 3 : 0,
): CurriculumTopic {
  return {
    id,
    title,
    scope,
    platformContentRefs,
    requiredQuestionTypes,
    minimumReviewedQuestionCount,
  };
}

export function chapterPackTopic(
  chapterSlug: string,
  id: string,
  title: string,
  scope: CurriculumScope,
  requiredQuestionTypes: BoardQuestionType[],
): CurriculumTopic {
  return topic(id, title, scope, requiredQuestionTypes, [
    {
      chapterSlug,
      kind: 'chapter-pack',
    },
  ]);
}

export function lessonTopic(
  chapterSlug: string,
  lessonSlug: string,
  id: string,
  title: string,
  scope: CurriculumScope,
  requiredQuestionTypes: BoardQuestionType[],
): CurriculumTopic {
  return topic(id, title, scope, requiredQuestionTypes, [
    {
      chapterSlug,
      kind: 'lesson',
      lessonSlug,
    },
  ]);
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
  blueprint:
    | {
        status: 'ready';
      }
    | {
        status: 'blocked';
        blockers: string[];
      } = { status: 'ready' },
): ExamProfile {
  return {
    maximumMarks: 80,
    durationMinutes: 180,
    readingTimeMinutes: 15,
    sectionRules: sections,
    allowedMarkValues: [1, 2, 3, 4, 5, 6],
    blueprintStatus: blueprint.status,
    blueprintBlockers:
      blueprint.status === 'blocked' ? [...blueprint.blockers] : [],
    blueprintSourceIds: blueprint.status === 'ready' ? [sourceId] : [],
  };
}
