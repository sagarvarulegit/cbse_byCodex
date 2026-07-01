-- Ensure the English pilot chapter exists in production for quiz saves and pilot review.

INSERT INTO "Subject" ("id", "classLevel", "name", "slug", "description", "sortOrder", "isPublished")
VALUES
  ('subject-class10-english', 10, 'English', 'english', 'CBSE Class 10 English', 3, true)
ON CONFLICT ("slug") DO UPDATE SET
  "classLevel" = EXCLUDED."classLevel",
  "description" = COALESCE("Subject"."description", EXCLUDED."description"),
  "isPublished" = true,
  "sortOrder" = LEAST("Subject"."sortOrder", EXCLUDED."sortOrder");

INSERT INTO "Chapter" ("id", "subjectId", "title", "slug", "ncertChapterNumber", "description", "sortOrder", "isPublished")
VALUES
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
  "sortOrder" = EXCLUDED."sortOrder",
  "subjectId" = EXCLUDED."subjectId",
  "title" = EXCLUDED."title";

WITH chapter AS (
  SELECT "id" FROM "Chapter" WHERE "slug" = 'two-stories-about-flying'
),
topic_rows("id", "title", "slug", "description", "sortOrder", "estimatedMinutes") AS (
  VALUES
    ('topic-flying-fear-and-hunger', 'His First Flight: fear and hunger', 'his-first-flight-fear-and-hunger', 'Track the young seagull''s fear, hunger, and first step toward flight.', 1, 7),
    ('topic-flying-courage-family-pressure', 'His First Flight: courage and family pressure', 'his-first-flight-courage-and-family-pressure', 'Understand how family pressure, hunger, and instinct help the young seagull fly.', 2, 7),
    ('topic-flying-storm-and-mystery', 'The Black Aeroplane: storm and mystery', 'the-black-aeroplane-storm-and-mystery', 'Retell the pilot''s danger inside the storm and the mystery of the black aeroplane.', 3, 7),
    ('topic-flying-unknown-helper', 'The Black Aeroplane: unknown helper', 'the-black-aeroplane-unknown-helper', 'Analyse the unknown helper and the story''s suspenseful ending.', 4, 7),
    ('topic-flying-poems-revision', 'Poems: Wild Animals and The Ball Poem', 'poems-wild-animals-and-the-ball-poem', 'Revise the companion poems through quick theme and inference practice.', 5, 7)
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

WITH free_lessons("id", "topicSlug", "title", "slug", "description", "learningObjective", "sortOrder", "estimatedMinutes") AS (
  VALUES
    ('lesson-flying-fear-and-hunger', 'his-first-flight-fear-and-hunger', 'His First Flight: fear and hunger', 'his-first-flight-fear-and-hunger', 'A free pilot note on the young seagull''s fear and hunger.', 'Explain how fear and hunger push the young seagull toward flight.', 1, 7),
    ('lesson-flying-courage-family-pressure', 'his-first-flight-courage-and-family-pressure', 'His First Flight: courage and family pressure', 'his-first-flight-courage-and-family-pressure', 'A free pilot note on family pressure and courage.', 'Explain how pressure and instinct help the young seagull act despite fear.', 2, 7),
    ('lesson-flying-storm-and-mystery', 'the-black-aeroplane-storm-and-mystery', 'The Black Aeroplane: storm and mystery', 'the-black-aeroplane-storm-and-mystery', 'A free pilot note on the storm and mystery in The Black Aeroplane.', 'Retell the pilot''s danger and identify the mystery clues.', 3, 7),
    ('lesson-flying-unknown-helper', 'the-black-aeroplane-unknown-helper', 'The Black Aeroplane: unknown helper', 'the-black-aeroplane-unknown-helper', 'A free pilot note on the unknown helper.', 'Analyse why the helper remains mysterious at the end.', 4, 7),
    ('lesson-flying-poems-revision', 'poems-wild-animals-and-the-ball-poem', 'Poems: Wild Animals and The Ball Poem', 'poems-wild-animals-and-the-ball-poem', 'A free pilot note connecting the companion poem revision.', 'Revise poem themes and inference points for quick exam practice.', 5, 7)
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
JOIN "Chapter" ON "Chapter"."slug" = 'two-stories-about-flying'
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
