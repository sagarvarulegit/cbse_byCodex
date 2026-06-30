import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import { getChapter } from './course-content';
import { PILOT_CHAPTER_SLUGS } from './pilot';
import { parseQuizContent, slugifyQuizTopic } from './quiz-content';

const expectedAnswerValues: Record<(typeof PILOT_CHAPTER_SLUGS)[number], number[]> = {
  'chemical-reactions-and-equations': [1, 1, 1, 1, 1],
  'real-numbers': [2, 1, 1, 3, 1],
  'two-stories-about-flying': [1, 1, 1, 1, 1],
};

function getValidTopicSlugs(chapterSlug: (typeof PILOT_CHAPTER_SLUGS)[number]) {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter, `Expected chapter metadata for ${chapterSlug}`);

  return chapter.lessons.length > 0
    ? chapter.lessons.map((lesson) => lesson.slug)
    : (chapter.topics ?? []).map((topic) => slugifyQuizTopic(topic)).filter(Boolean);
}

for (const chapterSlug of PILOT_CHAPTER_SLUGS) {
  test(`${chapterSlug} quiz is pilot-ready`, async () => {
    const markdownPath = path.join(process.cwd(), 'content', chapterSlug, 'lessons', 'quiz.md');
    const markdown = await readFile(markdownPath, 'utf8');
    const validTopicSlugs = getValidTopicSlugs(chapterSlug);
    const questions = parseQuizContent(markdown, validTopicSlugs, { strictMetadata: true });

    assert.equal(questions.length, 5);
    assert.deepEqual(
      questions.map((question) => question.options[question.correctOptionIndex]?.value),
      expectedAnswerValues[chapterSlug],
    );

    for (const question of questions) {
      assert.ok(question.explanation, `${chapterSlug}/${question.id} needs an explanation`);
      assert.ok(question.topicSlug, `${chapterSlug}/${question.id} needs a valid topic slug`);
      assert.ok(
        validTopicSlugs.includes(question.topicSlug),
        `${chapterSlug}/${question.id} has invalid topic slug ${question.topicSlug}`,
      );
    }
  });
}
