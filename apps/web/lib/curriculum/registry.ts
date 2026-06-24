import { ACTIVE_CURRICULUM_SESSION } from './official-sources';
import { CLASS_10_CURRICULUM_SUBJECTS } from './subjects/class-10';
import type { CurriculumSubject } from './types';

export const CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  ...CLASS_10_CURRICULUM_SUBJECTS,
];

const subjectBySessionAndSlug = new Map(
  CURRICULUM_SUBJECTS.map((subject) => [
    `${subject.academicSession}:${subject.slug}`,
    subject,
  ]),
);

export function getActiveCurriculumSession(): string {
  return ACTIVE_CURRICULUM_SESSION;
}

export function getCurriculumSubject(
  slug: string,
  academicSession = ACTIVE_CURRICULUM_SESSION,
): CurriculumSubject | null {
  return subjectBySessionAndSlug.get(`${academicSession}:${slug}`) ?? null;
}

export function getVisibleCurriculumSubjects(
  academicSession = ACTIVE_CURRICULUM_SESSION,
): CurriculumSubject[] {
  return CURRICULUM_SUBJECTS.filter(
    (subject) =>
      subject.academicSession === academicSession &&
      subject.status === 'active' &&
      subject.visibleInCatalog === true,
  );
}
