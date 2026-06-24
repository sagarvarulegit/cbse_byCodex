import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getAvailableLessons,
  getChapter,
  getLessonContent,
  type MarkdownBlock,
} from './course-content';

const chapterSlug = 'chemical-reactions-and-equations';

function getH2Headings(blocks: MarkdownBlock[]) {
  return blocks.flatMap((block) => (block.type === 'h2' ? [block.text.toLowerCase()] : []));
}

function getAllText(blocks: MarkdownBlock[]) {
  return blocks
    .flatMap((block) => ('text' in block ? [block.text] : block.items))
    .join('\n');
}

function assertRequiredHeadings(blocks: MarkdownBlock[], expectedHeadings: string[]) {
  const headings = getH2Headings(blocks);

  for (const heading of expectedHeadings) {
    assert.ok(headings.includes(heading), `Missing required h2 section: ${heading}`);
  }
}

function assertFourPanelComic(blocks: MarkdownBlock[]) {
  const comicIndex = blocks.findIndex(
    (block) => block.type === 'h2' && block.text.toLowerCase() === 'comic recap',
  );
  assert.notEqual(comicIndex, -1, 'Expected a Comic recap h2 section');

  const comicList = blocks[comicIndex + 1];
  assert.equal(comicList?.type, 'unordered-list');

  if (comicList?.type === 'unordered-list') {
    assert.equal(comicList.items.length, 4);
    assert.ok(comicList.items.every((item) => /^[^:]+:\s*"[^"]+"$/.test(item)));
  }
}

test('chemical pilot catalog exposes exactly the first two available lessons', () => {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);

  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => lesson.slug),
    ['chemical-equations', 'balancing-equations'],
  );
  assert.equal(chapter.lessons[0]?.fileName, '01-chemical-equations.md');
  assert.equal(chapter.lessons[0]?.free, true);
  assert.equal(chapter.lessons[1]?.fileName, '02-balancing-equations.md');
  assert.equal(chapter.lessons[1]?.free, false);
});

test('chemical equations lesson loads with required structure and navigation', async () => {
  const content = await getLessonContent(chapterSlug, 'chemical-equations');
  assert.ok(content);

  assert.equal(content.previousLesson, null);
  assert.equal(content.nextLesson?.slug, 'balancing-equations');

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'what is a chemical reaction?',
    'signs of a chemical reaction',
    'from word equation to formula equation',
    'state symbols',
    'solved examples',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /Mg \+ O2 -> MgO/);
  assert.match(lessonText, /Zn \+ H2SO4 -> ZnSO4 \+ H2/);
  assert.match(lessonText, /Na2SO4\(aq\) \+ BaCl2\(aq\) -> BaSO4\(s\) \+ 2NaCl\(aq\)/);
  assertFourPanelComic(content.blocks);
});

test('balancing equations lesson loads with worked examples and no unpublished next link', async () => {
  const content = await getLessonContent(chapterSlug, 'balancing-equations');
  assert.ok(content);

  assert.equal(content.previousLesson?.slug, 'chemical-equations');
  assert.equal(content.nextLesson, null);

  assertRequiredHeadings(content.blocks, [
    'learning goals',
    'law of conservation of mass',
    'coefficients and subscripts are different',
    'repeatable balancing method',
    'worked example 1: hydrogen and oxygen',
    'worked example 2: iron and steam',
    'worked example 3: keep a polyatomic ion together',
    'worked example 4: aluminium oxide',
    'common mistakes',
    'board tips',
    'quick practice',
    'answer check',
    'one-minute revision',
    'comic recap',
  ]);

  const lessonText = getAllText(content.blocks);
  assert.match(lessonText, /2H2 \+ O2 -> 2H2O/);
  assert.match(lessonText, /3Fe \+ 4H2O -> Fe3O4 \+ 4H2/);
  assert.match(lessonText, /Na2SO4 \+ BaCl2 -> BaSO4 \+ 2NaCl/);
  assert.match(lessonText, /4Al \+ 3O2 -> 2Al2O3/);
  assertFourPanelComic(content.blocks);
});
