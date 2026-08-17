import type { CurriculumSubject } from './curriculum/types';
import { mathematicsStandard } from './curriculum/subjects/class-10/mathematics-standard';
import { science } from './curriculum/subjects/class-10/science';
import { socialScience } from './curriculum/subjects/class-10/social-science';
import { englishLanguageAndLiterature } from './curriculum/subjects/class-10/english-language-and-literature';

/**
 * Machine-readable snapshot of a CBSE curriculum registry that the exam-paper
 * engine can consume without importing the web package. The registry stays the
 * single source of truth; this file is the generator, and
 * `apps/web/scripts/generate-exam-curriculum-snapshot.ts` writes the committed
 * artifacts used by `apps/api`.
 */
export type SubjectBlueprintSnapshot = {
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

export type Maths041BlueprintSnapshot = SubjectBlueprintSnapshot;
export type Science086BlueprintSnapshot = SubjectBlueprintSnapshot;
export type SocialScience087BlueprintSnapshot = SubjectBlueprintSnapshot;
export type English184BlueprintSnapshot = SubjectBlueprintSnapshot;

export function buildSubjectBlueprintSnapshot(
  subject: CurriculumSubject,
): SubjectBlueprintSnapshot {
  const profile = subject.examProfile;
  if (!profile) {
    throw new Error(`Subject "${subject.title}" is missing its exam profile.`);
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

export function buildMaths041BlueprintSnapshot(
  subject: CurriculumSubject = mathematicsStandard,
): Maths041BlueprintSnapshot {
  if (subject.subjectCode !== '041' || subject.slug !== 'mathematics-standard') {
    throw new Error('Expected Mathematics Standard (041).');
  }
  return buildSubjectBlueprintSnapshot(subject);
}

export function buildScience086BlueprintSnapshot(
  subject: CurriculumSubject = science,
): Science086BlueprintSnapshot {
  if (subject.subjectCode !== '086' || subject.slug !== 'science') {
    throw new Error('Expected Science (086).');
  }
  return buildSubjectBlueprintSnapshot(subject);
}

export function buildSocialScience087BlueprintSnapshot(
  subject: CurriculumSubject = socialScience,
): SocialScience087BlueprintSnapshot {
  if (subject.subjectCode !== '087' || subject.slug !== 'social-science') {
    throw new Error('Expected Social Science (087).');
  }
  return buildSubjectBlueprintSnapshot(subject);
}

export function buildEnglish184BlueprintSnapshot(
  subject: CurriculumSubject = englishLanguageAndLiterature,
): English184BlueprintSnapshot {
  if (subject.subjectCode !== '184' || subject.slug !== 'english-language-and-literature') {
    throw new Error('Expected English Language and Literature (184).');
  }
  return buildSubjectBlueprintSnapshot(subject);
}

export function renderSnapshotModule(
  blueprint: SubjectBlueprintSnapshot,
  constantName: string,
  typeName: string,
  sourcePath: string,
): string {
  return [
    '// GENERATED FILE — do not edit by hand.',
    `// Source of truth: ${sourcePath}`,
    '// Regenerate with: npm run exam:snapshot (repo root)',
    '',
    `export const ${constantName} = ` + JSON.stringify(blueprint, null, 2) + ';',
    '',
    `export type ${typeName} = typeof ${constantName};`,
    '',
  ].join('\n');
}

export function renderMaths041SnapshotModule(
  blueprint: SubjectBlueprintSnapshot,
): string {
  return renderSnapshotModule(
    blueprint,
    'MATHS_041_BLUEPRINT',
    'Maths041Blueprint',
    'apps/web/lib/curriculum/subjects/class-10/mathematics-standard.ts',
  );
}

export function renderScience086SnapshotModule(
  blueprint: SubjectBlueprintSnapshot,
): string {
  return renderSnapshotModule(
    blueprint,
    'SCIENCE_086_BLUEPRINT',
    'Science086Blueprint',
    'apps/web/lib/curriculum/subjects/class-10/science.ts',
  );
}

export function renderSocialScience087SnapshotModule(
  blueprint: SubjectBlueprintSnapshot,
): string {
  return renderSnapshotModule(
    blueprint,
    'SOCIAL_SCIENCE_087_BLUEPRINT',
    'SocialScience087Blueprint',
    'apps/web/lib/curriculum/subjects/class-10/social-science.ts',
  );
}

export function renderEnglish184SnapshotModule(
  blueprint: SubjectBlueprintSnapshot,
): string {
  return renderSnapshotModule(
    blueprint,
    'ENGLISH_184_BLUEPRINT',
    'English184Blueprint',
    'apps/web/lib/curriculum/subjects/class-10/english-language-and-literature.ts',
  );
}


