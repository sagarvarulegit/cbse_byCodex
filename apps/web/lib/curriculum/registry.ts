import { CLASS_10_2026_27_SESSION } from './sessions/2026-27';
import { CLASS_10_CURRICULUM_SUBJECTS } from './subjects/class-10';
import type { CurriculumSubject } from './types';

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  ...CLASS_10_CURRICULUM_SUBJECTS,
];

export function createCurriculumRegistry(
  subjects: CurriculumSubject[],
  activeSession: string,
) {
  const subjectBySessionAndSlug = new Map(
    subjects.map((subject) => [
      `${subject.academicSession}:${subject.slug}`,
      subject,
    ]),
  );

  return {
    getActiveSession(): string {
      return activeSession;
    },
    getSubject(slug: string, academicSession = activeSession): CurriculumSubject | null {
      return subjectBySessionAndSlug.get(`${academicSession}:${slug}`) ?? null;
    },
    getVisibleSubjects(academicSession = activeSession): CurriculumSubject[] {
      return subjects.filter(
        (subject) =>
          subject.academicSession === academicSession &&
          subject.status === 'active' &&
          subject.visibleInCatalog === true,
      );
    },
  };
}

const activeRegistry = createCurriculumRegistry(
  CURRICULUM_SUBJECTS,
  CLASS_10_2026_27_SESSION,
);

export function getActiveCurriculumSession(): string {
  return activeRegistry.getActiveSession();
}

export function getCurriculumSubject(
  slug: string,
  academicSession = activeRegistry.getActiveSession(),
): CurriculumSubject | null {
  return activeRegistry.getSubject(slug, academicSession);
}

export function getVisibleCurriculumSubjects(
  academicSession = activeRegistry.getActiveSession(),
): CurriculumSubject[] {
  return activeRegistry.getVisibleSubjects(academicSession);
}
