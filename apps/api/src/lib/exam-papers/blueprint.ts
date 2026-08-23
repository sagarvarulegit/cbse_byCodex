import { MATHS_041_BLUEPRINT } from './maths-041-blueprint.generated.js';
import { MATHS_241_BLUEPRINT } from './maths-241-blueprint.generated.js';
import { SCIENCE_086_BLUEPRINT } from './science-086-blueprint.generated.js';
import { SOCIAL_SCIENCE_087_BLUEPRINT } from './social-science-087-blueprint.generated.js';
import { ENGLISH_184_BLUEPRINT } from './english-184-blueprint.generated.js';
import { HINDI_002_BLUEPRINT } from './hindi-002-blueprint.generated.js';
import { HINDI_085_BLUEPRINT } from './hindi-085-blueprint.generated.js';

export type AnyBlueprint =
  | typeof MATHS_041_BLUEPRINT
  | typeof MATHS_241_BLUEPRINT
  | typeof SCIENCE_086_BLUEPRINT
  | typeof SOCIAL_SCIENCE_087_BLUEPRINT
  | typeof ENGLISH_184_BLUEPRINT
  | typeof HINDI_002_BLUEPRINT
  | typeof HINDI_085_BLUEPRINT;
export type SnapshotUnit = AnyBlueprint['units'][number];
export type SnapshotChapter = SnapshotUnit['chapters'][number];
export type SnapshotTopic = SnapshotChapter['topics'][number];

export const BLUEPRINTS: Record<string, AnyBlueprint> = {
  [MATHS_041_BLUEPRINT.slug]: MATHS_041_BLUEPRINT,
  [MATHS_241_BLUEPRINT.slug]: MATHS_241_BLUEPRINT,
  [SCIENCE_086_BLUEPRINT.slug]: SCIENCE_086_BLUEPRINT,
  [SOCIAL_SCIENCE_087_BLUEPRINT.slug]: SOCIAL_SCIENCE_087_BLUEPRINT,
  [ENGLISH_184_BLUEPRINT.slug]: ENGLISH_184_BLUEPRINT,
  [HINDI_002_BLUEPRINT.slug]: HINDI_002_BLUEPRINT,
  [HINDI_085_BLUEPRINT.slug]: HINDI_085_BLUEPRINT,
};

/**
 * Read-only helpers over the generated CBSE curriculum snapshots.
 * Snapshots are regenerated from the web registry (single source of truth)
 * via `npm run exam:snapshot`; drift guards live in
 * `apps/web/lib/exam-curriculum-snapshot.test.ts`.
 */
export const BLUEPRINT = MATHS_041_BLUEPRINT;

export function getBlueprint(subjectSlug: string = 'mathematics-standard'): AnyBlueprint | null {
  return BLUEPRINTS[subjectSlug] ?? null;
}

function resolveBlueprints(subjectSlug?: string): AnyBlueprint[] {
  if (subjectSlug) {
    const bp = getBlueprint(subjectSlug);
    return bp ? [bp] : [];
  }
  return Object.values(BLUEPRINTS);
}

export function getUnit(unitId: string, subjectSlug?: string): SnapshotUnit | null {
  for (const bp of resolveBlueprints(subjectSlug)) {
    const found = bp.units.find((unit) => unit.id === unitId);
    if (found) {
      return found;
    }
  }
  return null;
}

export function getTopic(topicId: string, subjectSlug?: string): SnapshotTopic | null {
  for (const bp of resolveBlueprints(subjectSlug)) {
    for (const unit of bp.units) {
      for (const chapter of unit.chapters) {
        const topic = chapter.topics.find((candidate) => candidate.id === topicId);
        if (topic) {
          return topic;
        }
      }
    }
  }

  return null;
}

export function getUnitForTopic(topicId: string, subjectSlug?: string): SnapshotUnit | null {
  for (const bp of resolveBlueprints(subjectSlug)) {
    for (const unit of bp.units) {
      for (const chapter of unit.chapters) {
        if (chapter.topics.some((topic) => topic.id === topicId)) {
          return unit;
        }
      }
    }
  }

  return null;
}

export function getChapterForTopic(topicId: string, subjectSlug?: string): SnapshotChapter | null {
  for (const bp of resolveBlueprints(subjectSlug)) {
    for (const unit of bp.units) {
      for (const chapter of unit.chapters) {
        if (chapter.topics.some((topic) => topic.id === topicId)) {
          return chapter;
        }
      }
    }
  }

  return null;
}

export function getUnitWeight(unitId: string, subjectSlug?: string): number {
  return getUnit(unitId, subjectSlug)?.marks ?? 0;
}

export function isExcludedTopic(topicId: string, subjectSlug?: string): boolean {
  return getTopic(topicId, subjectSlug)?.scope === 'excluded';
}

export function getExcludedTopicIds(subjectSlug: string = 'mathematics-standard'): string[] {
  const bp = getBlueprint(subjectSlug);
  if (!bp) {
    return [];
  }
  return bp.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.scope === 'excluded')
        .map((topic) => topic.id),
    ),
  );
}

export function getBoardTopicIds(subjectSlug: string = 'mathematics-standard'): string[] {
  const bp = getBlueprint(subjectSlug);
  if (!bp) {
    return [];
  }
  return bp.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.scope !== 'excluded')
        .map((topic) => topic.id),
    ),
  );
}

/** Ordered board units with their official weightage (sums to 80). */
export function getBoardUnits(
  subjectSlug: string = 'mathematics-standard',
): Array<{ id: string; title: string; marks: number }> {
  const bp = getBlueprint(subjectSlug);
  if (!bp) {
    return [];
  }
  return bp.units.flatMap((unit) => {
    const marks = unit.marks ?? 0;
    if (marks <= 0) {
      return [];
    }
    return [{ id: unit.id, title: unit.title, marks }];
  });
}
