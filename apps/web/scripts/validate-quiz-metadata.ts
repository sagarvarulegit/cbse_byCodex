import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { getChapter } from '../lib/course-content';
import { PILOT_CHAPTER_SLUGS } from '../lib/pilot';
import { slugifyQuizTopic } from '../lib/quiz-content';
import { validateQuizMetadata } from '../lib/quiz-content-validation';

function isPilotChapterSlug(slug: string): slug is (typeof PILOT_CHAPTER_SLUGS)[number] {
  return PILOT_CHAPTER_SLUGS.includes(slug as (typeof PILOT_CHAPTER_SLUGS)[number]);
}

function getValidTopicSlugs(chapterSlug: string) {
  const chapter = getChapter(chapterSlug);

  if (!chapter) {
    return [];
  }

  return chapter.lessons.length > 0
    ? chapter.lessons.map((lesson) => lesson.slug)
    : (chapter.topics ?? []).map((topic) => slugifyQuizTopic(topic)).filter(Boolean);
}

async function getQuizFiles(contentRoot: string) {
  const chapterDirectories = await readdir(contentRoot, { withFileTypes: true });
  const quizFiles: string[] = [];

  for (const chapterDirectory of chapterDirectories) {
    if (!chapterDirectory.isDirectory()) {
      continue;
    }

    quizFiles.push(path.join(contentRoot, chapterDirectory.name, 'lessons', 'quiz.md'));
  }

  return quizFiles;
}

async function main() {
  const scriptRoot = path.dirname(fileURLToPath(import.meta.url));
  const contentRoot = path.resolve(scriptRoot, '..', 'content');
  const quizFiles = await getQuizFiles(contentRoot);
  let errorCount = 0;
  let warningCount = 0;
  let checkedCount = 0;

  for (const quizFile of quizFiles) {
    let markdown = '';

    try {
      markdown = await readFile(quizFile, 'utf8');
    } catch {
      continue;
    }

    checkedCount += 1;

    const chapterSlug = path.basename(path.dirname(path.dirname(quizFile)));
    const isPilot = isPilotChapterSlug(chapterSlug);
    const result = validateQuizMetadata(markdown, {
      requireExplanation: isPilot,
      requireTopicSlugs: isPilot ? getValidTopicSlugs(chapterSlug) : [],
    });

    for (const issue of result.errors) {
      errorCount += 1;
      console.error(
        `[error] ${path.relative(process.cwd(), quizFile)} ${issue.code} ${issue.questionId}: ${issue.title}`,
      );
    }

    for (const issue of result.warnings) {
      warningCount += 1;
      console.warn(
        `[warning] ${path.relative(process.cwd(), quizFile)} ${issue.code} ${issue.questionId}: ${issue.title}`,
      );
    }
  }

  console.log(`Checked ${checkedCount} quiz files. Errors: ${errorCount}. Warnings: ${warningCount}.`);

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

void main();
