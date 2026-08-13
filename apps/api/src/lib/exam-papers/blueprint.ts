import { MATHS_041_BLUEPRINT } from './maths-041-blueprint.generated.js';

type SnapshotUnit = (typeof MATHS_041_BLUEPRINT.units)[number];
type SnapshotChapter = SnapshotUnit['chapters'][number];
type SnapshotTopic = SnapshotChapter['topics'][number];

/**
 * Read-only helpers over the generated Mathematics Standard (041) curriculum
 * snapshot. The snapshot is regenerated from the web registry (single source
 * of truth) via `npm run exam:snapshot`; the drift guard lives in
 * `apps/web/lib/exam-curriculum-snapshot.test.ts`.
 */
export const BLUEPRINT = MATHS_041_BLUEPRINT;

export function getUnit(unitId: string): SnapshotUnit | null {
  return BLUEPRINT.units.find((unit) => unit.id === unitId) ?? null;
}

export function getTopic(topicId: string): SnapshotTopic | null {
  for (const unit of BLUEPRINT.units) {
    for (const chapter of unit.chapters) {
      const topic = chapter.topics.find((candidate) => candidate.id === topicId);
      if (topic) {
        return topic;
      }
    }
  }

  return null;
}

export function getUnitForTopic(topicId: string): SnapshotUnit | null {
  for (const unit of BLUEPRINT.units) {
    for (const chapter of unit.chapters) {
      if (chapter.topics.some((topic) => topic.id === topicId)) {
        return unit;
      }
    }
  }

  return null;
}

export function getChapterForTopic(topicId: string): SnapshotChapter | null {
  for (const unit of BLUEPRINT.units) {
    for (const chapter of unit.chapters) {
      if (chapter.topics.some((topic) => topic.id === topicId)) {
        return chapter;
      }
    }
  }

  return null;
}

export function getUnitWeight(unitId: string): number {
  return getUnit(unitId)?.marks ?? 0;
}

export function isExcludedTopic(topicId: string): boolean {
  return getTopic(topicId)?.scope === 'excluded';
}

export function getExcludedTopicIds(): string[] {
  return BLUEPRINT.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.scope === 'excluded')
        .map((topic) => topic.id),
    ),
  );
}

export function getBoardTopicIds(): string[] {
  return BLUEPRINT.units.flatMap((unit) =>
    unit.chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.scope !== 'excluded')
        .map((topic) => topic.id),
    ),
  );
}

/** Ordered board units with their official weightage (sums to 80). */
export function getBoardUnits(): Array<{ id: string; title: string; marks: number }> {
  return BLUEPRINT.units.flatMap((unit) => {
    const marks = unit.marks ?? 0;
    if (marks <= 0) {
      return [];
    }
    return [{ id: unit.id, title: unit.title, marks }];
  });
}
