import type { CurriculumSubject } from './curriculum/types';
import { mathematicsStandard } from './curriculum/subjects/class-10/mathematics-standard';

/**
 * Machine-readable snapshot of the Mathematics Standard (041) curriculum
 * registry that the exam-paper engine can consume without importing the web
 * package. The registry stays the single source of truth; this file is the
 * generator, and `apps/web/scripts/generate-exam-curriculum-snapshot.ts` writes
 * the committed artifact used by `apps/api`.
 */
export type Maths041BlueprintSnapshot = {
  subjectCode: string;
  slug: string;
  title: string;
  academicSession: string;
  maximumMarks: number;
  durationMinutes: number;
  readingTimeMinutes: number;
  allowedMarkValues: number[];
  blueprintStatus: string;
  blueprintSourceIds: string[];
  units: Array<{
    id: string;
    title: string;
    marks: number | null;
    chapters: Array<{
      id: string;
      title: string;
      topics: Array<{
        id: string;
        title: string;
        scope: string;
        requiredQuestionTypes: string[];
      }>;
    }>;
  }>;
};

export function buildMaths041BlueprintSnapshot(
  subject: CurriculumSubject = mathematicsStandard,
): Maths041BlueprintSnapshot {
  const profile = subject.examProfile;
  if (!profile) {
    throw new Error('Mathematics Standard is missing its exam profile.');
  }
  if (subject.subjectCode !== '041' || subject.slug !== 'mathematics-standard') {
    throw new Error('The exam-paper snapshot currently supports Mathematics Standard (041) only.');
  }

  return {
    subjectCode: subject.subjectCode,
    slug: subject.slug,
    title: subject.title,
    academicSession: subject.academicSession,
    maximumMarks: profile.maximumMarks,
    durationMinutes: profile.durationMinutes,
    readingTimeMinutes: profile.readingTimeMinutes,
    allowedMarkValues: [...profile.allowedMarkValues],
    blueprintStatus: profile.blueprintStatus,
    blueprintSourceIds: [...profile.blueprintSourceIds],
    units: subject.units.map((unit) => ({
      id: unit.id,
      title: unit.title,
      marks: unit.marks ?? null,
      chapters: unit.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        topics: chapter.topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          scope: topic.scope,
          requiredQuestionTypes: [...topic.requiredQuestionTypes],
        })),
      })),
    })),
  };
}

export function renderMaths041SnapshotModule(
  blueprint: Maths041BlueprintSnapshot,
): string {
  return [
    '// GENERATED FILE — do not edit by hand.',
    '// Source of truth: apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts',
    '// Regenerate with: npm run exam:snapshot (repo root)',
    '',
    'export const MATHS_041_BLUEPRINT = ' + JSON.stringify(blueprint, null, 2) + ';',
    '',
    'export type Maths041Blueprint = typeof MATHS_041_BLUEPRINT;',
    '',
  ].join('\n');
}
