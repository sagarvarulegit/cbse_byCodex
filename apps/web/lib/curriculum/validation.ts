import { getOfficialSource } from './official-sources';
import type {
  CurriculumChapter,
  CurriculumScope,
  CurriculumSubject,
  CurriculumTopic,
} from './types';

export type CurriculumValidationCode =
  | 'missing-source'
  | 'missing-exam-profile'
  | 'invalid-total-marks'
  | 'duplicate-unit-id'
  | 'duplicate-chapter-id'
  | 'duplicate-topic-id'
  | 'missing-required-question-types'
  | 'invalid-board-question-minimum'
  | 'unsupported-required-question-type'
  | 'missing-blueprint-source'
  | 'invalid-blueprint-source-type'
  | 'invalid-blueprint-source-session'
  | 'invalid-blueprint-source-role'
  | 'contradictory-platform-scope'
  | 'future-subject-visible'
  | 'invalid-basic-profile';

export type CurriculumValidationIssue = {
  code: CurriculumValidationCode;
  path: string;
  message: string;
};

export function validateCurriculumSubject(
  subject: CurriculumSubject,
): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];

  issues.push(...getMissingSourceIssues(subject));

  if (
    subject.assessmentMode === 'board' &&
    subject.status === 'active' &&
    subject.examProfile === null
  ) {
    issues.push({
      code: 'missing-exam-profile',
      message: 'Active board subjects require an exam profile.',
      path: 'examProfile',
    });
  }

  if (subject.examProfile !== null) {
    const totalMarks = subject.examProfile.sectionRules.reduce(
      (sum, sectionRule) => sum + sectionRule.marks,
      0,
    );

    if (totalMarks !== subject.examProfile.maximumMarks) {
      issues.push({
        code: 'invalid-total-marks',
        message: `Top-level section marks total ${totalMarks}, expected ${subject.examProfile.maximumMarks}.`,
        path: 'examProfile.sectionRules',
      });
    }
  }

  issues.push(...getDuplicateUnitIssues(subject));
  issues.push(...getDuplicateChapterIssues(subject));
  issues.push(...getDuplicateTopicIssues(subject));
  issues.push(...getMissingRequiredQuestionTypeIssues(subject));
  issues.push(...getInvalidBoardQuestionMinimumIssues(subject));
  issues.push(...getUnsupportedRequiredQuestionTypeIssues(subject));
  issues.push(...getContradictoryPlatformScopeIssues(subject));

  if (subject.status === 'future' && subject.visibleInCatalog === true) {
    issues.push({
      code: 'future-subject-visible',
      message: 'Future subjects cannot be visible in the catalog yet.',
      path: 'visibleInCatalog',
    });
  }

  if (isMathematicsBasic(subject)) {
    const hasInvalidBasicProfile =
      subject.subjectCode !== '241' || subject.slug === 'mathematics-standard';

    if (hasInvalidBasicProfile) {
      issues.push({
        code: 'invalid-basic-profile',
        message: 'Mathematics Basic must remain a distinct 241 profile, not Mathematics Standard.',
        path: 'subjectCode',
      });
    }
  }

  return issues;
}

function getMissingSourceIssues(subject: CurriculumSubject): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];

  if (
    subject.officialSourceIds.length === 0 &&
    !(
      subject.status === 'future' &&
      subject.activationBlockers.some((blocker) => blocker.trim().length > 0)
    )
  ) {
    issues.push({
      code: 'missing-source',
      message:
        'Subjects require an official source unless a future subject records an explicit activation blocker.',
      path: 'officialSourceIds',
    });
  }

  for (const [index, sourceId] of subject.officialSourceIds.entries()) {
    if (getOfficialSource(sourceId) === undefined) {
      issues.push({
        code: 'missing-source',
        message: `Unknown official source: ${sourceId}`,
        path: `officialSourceIds[${index}]`,
      });
    }
  }

  for (const [index, book] of subject.books.entries()) {
    if (getOfficialSource(book.sourceId) === undefined) {
      issues.push({
        code: 'missing-source',
        message: `Unknown official source: ${book.sourceId}`,
        path: `books[${index}].sourceId`,
      });
    }
  }

  if (subject.examProfile === null) {
    return issues;
  }

  for (const [index, sourceId] of subject.examProfile.blueprintSourceIds.entries()) {
    const source = getOfficialSource(sourceId);

    if (source === undefined) {
      issues.push({
        code: 'missing-source',
        message: `Unknown official source: ${sourceId}`,
        path: `examProfile.blueprintSourceIds[${index}]`,
      });
      continue;
    }

    const path = `examProfile.blueprintSourceIds[${index}]`;

    if (!['curriculum', 'sample-paper', 'marking-scheme'].includes(source.sourceType)) {
      issues.push({
        code: 'invalid-blueprint-source-type',
        message: `Source ${sourceId} has type ${source.sourceType}, which cannot drive a current blueprint.`,
        path,
      });
      continue;
    }

    if (source.academicSession !== subject.academicSession) {
      issues.push({
        code: 'invalid-blueprint-source-session',
        message: `Source ${sourceId} belongs to ${source.academicSession}, not ${subject.academicSession}.`,
        path,
      });
      continue;
    }

    if (
      source.mayDriveCurrentBlueprint !== true ||
      source.role !== 'current-curriculum-and-blueprint' ||
      !source.subjectCodes.some(
        (subjectCode) =>
          subjectCode === 'ALL' || subjectCode === subject.subjectCode,
      )
    ) {
      issues.push({
        code: 'invalid-blueprint-source-role',
        message: `Source ${sourceId} is not eligible to drive this subject's current blueprint.`,
        path,
      });
    }
  }

  const hasReadyBlueprint =
    subject.examProfile.blueprintStatus === 'ready' &&
    subject.examProfile.blueprintSourceIds.length > 0;
  const hasBlockedBlueprint =
    subject.examProfile.blueprintStatus === 'blocked' &&
    subject.examProfile.blueprintSourceIds.length === 0 &&
    subject.examProfile.blueprintBlockers.some(
      (blocker) => blocker.trim().length > 0,
    );

  if (!hasReadyBlueprint && !hasBlockedBlueprint) {
    issues.push({
      code: 'missing-blueprint-source',
      message:
        'Blueprint readiness must have eligible current source IDs or an explicit blocked-state reason.',
      path: 'examProfile.blueprintSourceIds',
    });
  }

  return issues;
}

function getDuplicateUnitIssues(subject: CurriculumSubject): CurriculumValidationIssue[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const issues: CurriculumValidationIssue[] = [];

  for (const [unitIndex, unit] of subject.units.entries()) {
    if (seen.has(unit.id) && !duplicates.has(unit.id)) {
      duplicates.add(unit.id);
      issues.push({
        code: 'duplicate-unit-id',
        message: `Duplicate unit id: ${unit.id}`,
        path: `units[${unitIndex}].id`,
      });
      continue;
    }

    seen.add(unit.id);
  }

  return issues;
}

function getDuplicateChapterIssues(subject: CurriculumSubject): CurriculumValidationIssue[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const issues: CurriculumValidationIssue[] = [];

  for (const [unitIndex, unit] of subject.units.entries()) {
    for (const [chapterIndex, chapter] of unit.chapters.entries()) {
      if (seen.has(chapter.id) && !duplicates.has(chapter.id)) {
        duplicates.add(chapter.id);
        issues.push({
          code: 'duplicate-chapter-id',
          message: `Duplicate chapter id: ${chapter.id}`,
          path: `units[${unitIndex}].chapters[${chapterIndex}].id`,
        });
        continue;
      }

      seen.add(chapter.id);
    }
  }

  return issues;
}

function getDuplicateTopicIssues(subject: CurriculumSubject): CurriculumValidationIssue[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  const issues: CurriculumValidationIssue[] = [];

  for (const [unitIndex, unit] of subject.units.entries()) {
    for (const [chapterIndex, chapter] of unit.chapters.entries()) {
      for (const [topicIndex, topic] of chapter.topics.entries()) {
        if (seen.has(topic.id) && !duplicates.has(topic.id)) {
          duplicates.add(topic.id);
          issues.push({
            code: 'duplicate-topic-id',
            message: `Duplicate topic id: ${topic.id}`,
            path: `units[${unitIndex}].chapters[${chapterIndex}].topics[${topicIndex}].id`,
          });
          continue;
        }

        seen.add(topic.id);
      }
    }
  }

  return issues;
}

function getMissingRequiredQuestionTypeIssues(
  subject: CurriculumSubject,
): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];

  for (const [unitIndex, unit] of subject.units.entries()) {
    for (const [chapterIndex, chapter] of unit.chapters.entries()) {
      for (const [topicIndex, topic] of chapter.topics.entries()) {
        if (topic.scope === 'board-exam' && topic.requiredQuestionTypes.length === 0) {
          issues.push({
            code: 'missing-required-question-types',
            message: 'Board-exam topics must declare at least one required question type.',
            path: `units[${unitIndex}].chapters[${chapterIndex}].topics[${topicIndex}].requiredQuestionTypes`,
          });
        }
      }
    }
  }

  return issues;
}

function getInvalidBoardQuestionMinimumIssues(
  subject: CurriculumSubject,
): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];

  for (const [unitIndex, unit] of subject.units.entries()) {
    for (const [chapterIndex, chapter] of unit.chapters.entries()) {
      for (const [topicIndex, topic] of chapter.topics.entries()) {
        if (
          topic.scope === 'board-exam' &&
          topic.minimumReviewedQuestionCount <= 0
        ) {
          issues.push({
            code: 'invalid-board-question-minimum',
            message:
              'Board-exam topics require a positive reviewed-question minimum.',
            path: `units[${unitIndex}].chapters[${chapterIndex}].topics[${topicIndex}].minimumReviewedQuestionCount`,
          });
        }
      }
    }
  }

  return issues;
}

function getUnsupportedRequiredQuestionTypeIssues(
  subject: CurriculumSubject,
): CurriculumValidationIssue[] {
  if (subject.examProfile === null) {
    return [];
  }

  const issues: CurriculumValidationIssue[] = [];

  for (const [unitIndex, unit] of subject.units.entries()) {
    for (const [chapterIndex, chapter] of unit.chapters.entries()) {
      for (const [topicIndex, topic] of chapter.topics.entries()) {
        if (topic.scope !== 'board-exam') {
          continue;
        }

        const applicableSections = subject.examProfile.sectionRules.filter(
          (sectionRule) =>
            sectionRule.id === unit.id ||
            sectionRule.curriculumRefs?.some(
              (curriculumRef) =>
                curriculumRef === unit.id ||
                curriculumRef === chapter.id ||
                curriculumRef === topic.id,
            ) === true,
        );
        const allowedQuestionTypes = new Set(
          applicableSections.flatMap(
            (sectionRule) => sectionRule.allowedQuestionTypes,
          ),
        );

        for (const [questionTypeIndex, questionType] of topic.requiredQuestionTypes.entries()) {
          if (allowedQuestionTypes.has(questionType)) {
            continue;
          }

          issues.push({
            code: 'unsupported-required-question-type',
            message: `Question type ${questionType} is not allowed by an applicable top-level exam section.`,
            path: `units[${unitIndex}].chapters[${chapterIndex}].topics[${topicIndex}].requiredQuestionTypes[${questionTypeIndex}]`,
          });
        }
      }
    }
  }

  return issues;
}

function getContradictoryPlatformScopeIssues(
  subject: CurriculumSubject,
): CurriculumValidationIssue[] {
  const issues: CurriculumValidationIssue[] = [];
  const chapterScopeBySlug = new Map<
    string,
    { path: string; scope: CurriculumScope }
  >();

  for (const [unitIndex, unit] of subject.units.entries()) {
    for (const [chapterIndex, chapter] of unit.chapters.entries()) {
      collectContradictoryChapterScopes(
        chapter,
        chapterIndex,
        chapterScopeBySlug,
        issues,
        unitIndex,
      );
    }
  }

  return issues;
}

function collectContradictoryChapterScopes(
  chapter: CurriculumChapter,
  chapterIndex: number,
  chapterScopeBySlug: Map<string, { path: string; scope: CurriculumScope }>,
  issues: CurriculumValidationIssue[],
  unitIndex: number,
): void {
  if (!isActiveScope(chapter.scope)) {
    return;
  }

  for (const [slugIndex, chapterSlug] of chapter.platformChapterSlugs.entries()) {
    const existing = chapterScopeBySlug.get(chapterSlug);
    const path = `units[${unitIndex}].chapters[${chapterIndex}].platformChapterSlugs[${slugIndex}]`;

    if (existing !== undefined && existing.scope !== chapter.scope) {
      issues.push({
        code: 'contradictory-platform-scope',
        message: `Platform chapter slug ${chapterSlug} maps to both ${existing.scope} and ${chapter.scope}.`,
        path,
      });
      continue;
    }

    chapterScopeBySlug.set(chapterSlug, {
      path,
      scope: chapter.scope,
    });
  }
}

function isActiveScope(scope: CurriculumScope): boolean {
  return scope !== 'excluded';
}

function isMathematicsBasic(subject: CurriculumSubject): boolean {
  const normalizedTitle = normalizeText(subject.title);

  return (
    normalizedTitle === 'mathematics basic' ||
    subject.slug === 'mathematics-basic' ||
    subject.subjectCode === '241'
  );
}

function normalizeText(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}
