-- Keep the free student pilot DB-backed so quiz attempts and feedback can be saved end to end.

INSERT INTO "Subject" ("id", "classLevel", "name", "slug", "description", "sortOrder", "isPublished")
VALUES
  ('subject-class10-mathematics', 10, 'Mathematics', 'mathematics', 'CBSE Class 10 Mathematics', 1, true),
  ('subject-class10-science', 10, 'Science', 'science', 'CBSE Class 10 Science', 2, true),
  ('subject-class10-english', 10, 'English', 'english', 'CBSE Class 10 English', 3, true)
ON CONFLICT ("slug") DO UPDATE SET
  "classLevel" = EXCLUDED."classLevel",
  "description" = COALESCE("Subject"."description", EXCLUDED."description"),
  "isPublished" = true,
  "sortOrder" = LEAST("Subject"."sortOrder", EXCLUDED."sortOrder");

INSERT INTO "Chapter" ("id", "subjectId", "title", "slug", "ncertChapterNumber", "description", "sortOrder", "isPublished")
VALUES
  (
    'chapter-real-numbers',
    (SELECT "id" FROM "Subject" WHERE "slug" = 'mathematics'),
    'Real Numbers',
    'real-numbers',
    1,
    'Explore Euclid division lemma, prime factorisation, HCF, LCM, irrational numbers, and rational decimal expansions.',
    1,
    true
  ),
  (
    'chapter-chemical-reactions-and-equations',
    (SELECT "id" FROM "Subject" WHERE "slug" = 'science'),
    'Chemical Reactions and Equations',
    'chemical-reactions-and-equations',
    1,
    'Understand chemical equations, balancing, reaction types, oxidation, and reduction.',
    1,
    true
  ),
  (
    'chapter-two-stories-about-flying',
    (SELECT "id" FROM "Subject" WHERE "slug" = 'english'),
    'Two Stories about Flying',
    'two-stories-about-flying',
    3,
    'Revise courage, fear, mystery, and inference skills through the Class 10 First Flight flying stories.',
    3,
    true
  )
ON CONFLICT ("slug") DO UPDATE SET
  "description" = COALESCE("Chapter"."description", EXCLUDED."description"),
  "isPublished" = true,
  "sortOrder" = LEAST("Chapter"."sortOrder", EXCLUDED."sortOrder"),
  "subjectId" = EXCLUDED."subjectId",
  "title" = EXCLUDED."title";

WITH chapter AS (
  SELECT "id" FROM "Chapter" WHERE "slug" = 'chemical-reactions-and-equations'
),
topic_rows("id", "title", "slug", "description", "sortOrder", "estimatedMinutes") AS (
  VALUES
    ('topic-chemical-balancing-equations', 'Balancing equations', 'balancing-equations', 'Balance chemical equations step by step.', 1, 20),
    ('topic-chemical-reaction-types', 'Reaction types', 'reaction-types', 'Identify combination, decomposition, displacement, and double-displacement reactions.', 2, 20),
    ('topic-chemical-oxidation-reduction', 'Oxidation and reduction', 'oxidation-and-reduction', 'Understand oxidation, reduction, corrosion, and rancidity.', 3, 20)
)
INSERT INTO "Topic" ("id", "chapterId", "title", "slug", "description", "sortOrder", "estimatedMinutes", "isPublished")
SELECT topic_rows."id", chapter."id", topic_rows."title", topic_rows."slug", topic_rows."description", topic_rows."sortOrder", topic_rows."estimatedMinutes", true
FROM topic_rows
CROSS JOIN chapter
ON CONFLICT ("chapterId", "slug") DO UPDATE SET
  "description" = COALESCE("Topic"."description", EXCLUDED."description"),
  "estimatedMinutes" = EXCLUDED."estimatedMinutes",
  "isPublished" = true,
  "sortOrder" = EXCLUDED."sortOrder",
  "title" = EXCLUDED."title";

WITH chapter AS (
  SELECT "id" FROM "Chapter" WHERE "slug" = 'two-stories-about-flying'
),
topic_rows("id", "title", "slug", "description", "sortOrder", "estimatedMinutes") AS (
  VALUES
    ('topic-flying-young-seagulls-courage', 'Young seagull''s courage', 'young-seagulls-courage', 'Track the young seagull''s fear and first flight.', 1, 12),
    ('topic-flying-mysterious-pilot-helper', 'The mysterious pilot helper', 'the-mysterious-pilot-helper', 'Understand suspense and uncertainty in The Black Aeroplane.', 2, 12),
    ('topic-flying-overcoming-fear', 'Overcoming fear', 'overcoming-fear', 'Compare courage, action, and confidence across the stories.', 3, 11)
)
INSERT INTO "Topic" ("id", "chapterId", "title", "slug", "description", "sortOrder", "estimatedMinutes", "isPublished")
SELECT topic_rows."id", chapter."id", topic_rows."title", topic_rows."slug", topic_rows."description", topic_rows."sortOrder", topic_rows."estimatedMinutes", true
FROM topic_rows
CROSS JOIN chapter
ON CONFLICT ("chapterId", "slug") DO UPDATE SET
  "description" = COALESCE("Topic"."description", EXCLUDED."description"),
  "estimatedMinutes" = EXCLUDED."estimatedMinutes",
  "isPublished" = true,
  "sortOrder" = EXCLUDED."sortOrder",
  "title" = EXCLUDED."title";

WITH free_lessons("id", "chapterSlug", "topicSlug", "title", "slug", "description", "learningObjective", "sortOrder", "estimatedMinutes") AS (
  VALUES
    (
      'lesson-chemical-balancing-equations-free',
      'chemical-reactions-and-equations',
      'balancing-equations',
      'Balancing equations pilot note',
      'balancing-equations-pilot-note',
      'A free pilot note for balancing chemical equations.',
      'Balance a simple chemical equation and explain why atoms must be conserved.',
      1,
      20
    ),
    (
      'lesson-flying-courage-free',
      'two-stories-about-flying',
      'young-seagulls-courage',
      'Courage and first flight pilot note',
      'courage-and-first-flight-pilot-note',
      'A free pilot note for courage and first-flight inference questions.',
      'Explain how fear turns into action in the first flying story.',
      1,
      12
    )
)
INSERT INTO "Lesson" (
  "id",
  "topicId",
  "title",
  "slug",
  "description",
  "learningObjective",
  "accessLevel",
  "sortOrder",
  "estimatedMinutes",
  "publishStatus",
  "publishedAt",
  "updatedAt"
)
SELECT
  free_lessons."id",
  "Topic"."id",
  free_lessons."title",
  free_lessons."slug",
  free_lessons."description",
  free_lessons."learningObjective",
  'free',
  free_lessons."sortOrder",
  free_lessons."estimatedMinutes",
  'published',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM free_lessons
JOIN "Chapter" ON "Chapter"."slug" = free_lessons."chapterSlug"
JOIN "Topic" ON "Topic"."chapterId" = "Chapter"."id" AND "Topic"."slug" = free_lessons."topicSlug"
ON CONFLICT ("topicId", "slug") DO UPDATE SET
  "accessLevel" = 'free',
  "description" = COALESCE("Lesson"."description", EXCLUDED."description"),
  "estimatedMinutes" = EXCLUDED."estimatedMinutes",
  "learningObjective" = COALESCE("Lesson"."learningObjective", EXCLUDED."learningObjective"),
  "publishStatus" = 'published',
  "publishedAt" = COALESCE("Lesson"."publishedAt", EXCLUDED."publishedAt"),
  "sortOrder" = EXCLUDED."sortOrder",
  "title" = EXCLUDED."title",
  "updatedAt" = CURRENT_TIMESTAMP;
