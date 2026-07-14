import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import { getAvailableLessons, getChapter } from './course-content';

const chapterSlug = 'chemical-reactions-and-equations';
const lessonRoot = path.resolve(__dirname, '..', 'content', chapterSlug, 'lessons');

const expectedLessons = [
  ['01-chemical-equations.md', '1.1 Chemical Equations and 1.1.1 Writing a Chemical Equation'],
  ['02-balancing-equations.md', '1.1.2 Balanced Chemical Equations'],
  [
    '03-combination-and-decomposition-reactions.md',
    '1.2 Types of Chemical Reactions - Combination and Decomposition',
  ],
  [
    '04-displacement-and-double-displacement-reactions.md',
    '1.2.3 Displacement and 1.2.4 Double Displacement Reactions',
  ],
  [
    '05-oxidation-and-reduction.md',
    '1.2.5 Oxidation and Reduction; 1.3 Effects of Oxidation in Everyday Life',
  ],
  ['06-ncert-exercises-and-revision.md', 'NCERT Chapter Exercises and Revision'],
] as const;

function readLessonOrEmpty(fileName: string) {
  const filePath = path.join(lessonRoot, fileName);
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
}

function frontmatterTitle(markdown: string) {
  return markdown.match(/^---\r?\n[\s\S]*?^title:\s*(.+)$/m)?.[1]?.trim() ?? '';
}

function h1(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
}

function primaryHeadingIndex(markdown: string, heading: string) {
  return markdown.search(new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, 'mi'));
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertInOrder(markdown: string, labels: string[]) {
  let previousIndex = -1;
  for (const label of labels) {
    const index = markdown.indexOf(label);
    assert.ok(index >= 0, `Expected ${label}`);
    assert.ok(index > previousIndex, `Expected ${label} after ${labels[Math.max(0, labels.indexOf(label) - 1)]}`);
    previousIndex = index;
  }
}

test('chemical reactions lesson resources exist and catalog titles match frontmatter and H1', () => {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => [lesson.fileName, lesson.title]),
    expectedLessons,
  );

  for (const [fileName, expectedTitle] of expectedLessons) {
    const markdown = readLessonOrEmpty(fileName);
    assert.ok(markdown, `Expected ${fileName}`);
    assert.equal(frontmatterTitle(markdown), expectedTitle);
    assert.equal(h1(markdown), expectedTitle);
  }
});

test('chemical reactions numbered sections follow the exact NCERT parent-child order', () => {
  const lessons = expectedLessons.map(([fileName]) => readLessonOrEmpty(fileName)).join('\n');
  assertInOrder(lessons, [
    '## 1.1 Chemical Equations',
    '## 1.1.1 Writing a Chemical Equation',
    '## 1.1.2 Balanced Chemical Equations',
    '## 1.2 Types of Chemical Reactions',
    '## 1.2.1 Combination Reaction',
    '## 1.2.2 Decomposition Reaction',
    '## 1.2.3 Displacement Reaction',
    '## 1.2.4 Double Displacement Reaction',
    '## 1.2.5 Oxidation and Reduction',
    '## 1.3 Have You Observed the Effects of Oxidation Reactions in Everyday Life?',
    '## 1.3.1 Corrosion',
    '## 1.3.2 Rancidity',
  ]);
});

test('chemical reactions has one primary heading for Activities 1.1-1.11 and no invented activities', () => {
  const lessons = expectedLessons.map(([fileName]) => readLessonOrEmpty(fileName)).join('\n');

  for (let number = 1; number <= 11; number += 1) {
    const matches = lessons.match(new RegExp(`^### Activity 1\\.${number}(?:\\s|$)`, 'gmi')) ?? [];
    assert.equal(matches.length, 1, `Expected one primary Activity 1.${number} heading`);
  }

  assert.doesNotMatch(lessons, /^### Activity 1\.(?:12|13)(?:\s|$)/gmi);
  assert.doesNotMatch(lessons, /diffusion insufficient|criteria do we use to decide whether something is alive/i);
  assert.doesNotMatch(lessons, /animated activity below/i);
});

test('chemical reactions preserves Figures 1.1-1.10 and equation labels 1.1-1.32', () => {
  const lessons = expectedLessons.map(([fileName]) => readLessonOrEmpty(fileName)).join('\n');
  const figureLabels = Array.from({ length: 10 }, (_, index) => `Figure 1.${index + 1}`);
  const equationLabels = Array.from({ length: 32 }, (_, index) => `(${`1.${index + 1}`})`);

  assertInOrder(lessons, figureLabels);
  assertInOrder(lessons, equationLabels);
});

test('chemical reactions exact in-text Questions blocks are in their textbook positions', () => {
  const lesson2 = readLessonOrEmpty('02-balancing-equations.md');
  const lesson3 = readLessonOrEmpty('03-combination-and-decomposition-reactions.md');
  const lesson5 = readLessonOrEmpty('05-oxidation-and-reduction.md');

  assert.ok(lesson2.indexOf('**❓ QUESTIONS**') > primaryHeadingIndex(lesson2, '1.1.2 Balanced Chemical Equations'));
  assert.match(lesson2, /\*\*1\. Why should a magnesium ribbon be cleaned before burning in air\?\*\*/);
  assert.match(lesson2, /Solutions of barium chloride and sodium sulphate in water react/);

  assert.ok(lesson3.indexOf('**❓ QUESTIONS**') > primaryHeadingIndex(lesson3, '1.2.2 Decomposition Reaction'));
  assert.match(lesson3, /\*\*1\. A solution of a substance ‘X’ is used for whitewashing\.\*\*/);
  assert.match(lesson3, /Why is the amount of gas collected in one of the test tubes in Activity 1\.7 double/);

  const thirdQuestionsIndex = lesson5.indexOf('**❓ QUESTIONS**');
  const parentSectionIndex = primaryHeadingIndex(
    lesson5,
    '1.3 Have You Observed the Effects of Oxidation Reactions in Everyday Life?',
  );
  assert.ok(thirdQuestionsIndex > primaryHeadingIndex(lesson5, '1.2.5 Oxidation and Reduction'));
  assert.ok(parentSectionIndex > thirdQuestionsIndex);
  assert.match(lesson5, /Why does the colour of copper sulphate solution change when an iron nail is dipped in it\?/);
});

test('chemical reactions preserves source prompts, boxes, summary, exercises, and Group Activity', () => {
  const lesson3 = readLessonOrEmpty('03-combination-and-decomposition-reactions.md');
  const lesson4 = readLessonOrEmpty('04-displacement-and-double-displacement-reactions.md');
  const lesson5 = readLessonOrEmpty('05-oxidation-and-reduction.md');
  const lesson6 = readLessonOrEmpty('06-ncert-exercises-and-revision.md');

  assert.match(lesson3, /Identify the type of the reaction taking place in Activity 1\.1/);
  assert.match(lesson3, /A solution of slaked lime produced by the reaction \(1\.13\) is used for whitewashing walls/);
  assert.match(lesson3, /What form of energy is causing these decomposition reactions\?/);
  assert.match(lesson3, /Take about 2 g barium hydroxide in a test tube/);
  assert.match(lesson4, /Why does the iron nail become brownish in colour/);
  assert.match(lesson4, /Recall Activity 1\.2/);
  assert.match(lesson5, /Why has this black substance formed\?/);
  assert.match(lesson5, /Recall Activity 1\.1/);
  assert.match(lesson5, /## What you have learnt/i);

  for (let number = 1; number <= 20; number += 1) {
    assert.match(lesson6, new RegExp(`^\\*\\*${number}\\.\\s`, 'mi'), `Expected exact Exercise ${number}`);
  }
  assert.match(lesson6, /## Group Activity/);
});

test('chemical reactions student content does not expose internal source notes or paths', () => {
  const studentContent = expectedLessons.map(([fileName]) => readLessonOrEmpty(fileName)).join('\n');
  assert.doesNotMatch(studentContent, /textbooks\/|jesc101\.pdf|teacher note on textbook alignment/i);
});
