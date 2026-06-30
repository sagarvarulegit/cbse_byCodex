import assert from 'node:assert/strict';
import test from 'node:test';

import type { MarkdownBlock } from './course-content';
import {
  collectChapterSection,
  getChapterSectionVariant,
  getSectionTextLines,
  normalizeSectionTitle,
  isFormulaLikeText,
  parseComicPanel,
  toSectionId,
  type ChapterSection,
} from './chapter-notes-rendering';

test('collectChapterSection groups h2 content until the next h2', () => {
  const blocks: MarkdownBlock[] = [
    { type: 'h1', text: 'Chemical Reactions and Equations' },
    { type: 'h2', text: 'chapter goal' },
    { type: 'paragraph', text: 'By the end of this chapter, a student should be able to:' },
    { type: 'unordered-list', items: ['identify a chemical reaction', 'balance equations'] },
    { type: 'h3', text: 'easy method' },
    { type: 'ordered-list', items: ['Count atoms', 'Balance one element at a time'] },
    { type: 'h2', text: 'comic style recap' },
    { type: 'paragraph', text: 'Panel 1: Captain Atom says, "Balance both sides!"' },
  ];

  const result = collectChapterSection(blocks, 1);

  assert.equal(result.nextIndex, 6);
  assert.equal(result.section.heading.text, 'chapter goal');
  assert.equal(result.section.normalizedTitle, 'chapter goal');
  assert.deepEqual(result.section.blocks, blocks.slice(2, 6));
});

test('section helpers normalize titles and ids for anchors', () => {
  assert.equal(normalizeSectionTitle('Exam-Friendly Summary Notes'), 'exam friendly summary notes');
  assert.equal(toSectionId('Mini Quiz With Answers!'), 'mini-quiz-with-answers');
});

test('getSectionTextLines flattens recap-friendly text blocks', () => {
  const blocks: MarkdownBlock[] = [
    { type: 'paragraph', text: 'Panel 1: Seagull says, "The sea is too far below!"' },
    { type: 'unordered-list', items: ['Panel 2: Mother says, "Your wings will learn."'] },
    { type: 'ordered-list', items: ['Panel 3: Storm Pilot cries, "My compass is gone!"'] },
    { type: 'h3', text: 'Final memory' },
    { type: 'code', text: 'Panel 4: Formula Bot says, "Use the rule."' },
  ];

  assert.deepEqual(getSectionTextLines(blocks), [
    'Panel 1: Seagull says, "The sea is too far below!"',
    'Panel 2: Mother says, "Your wings will learn."',
    'Panel 3: Storm Pilot cries, "My compass is gone!"',
    'Final memory',
    'Panel 4: Formula Bot says, "Use the rule."',
  ]);
});

test('parseComicPanel extracts panel number, scene, and quoted dialogue', () => {
  assert.deepEqual(parseComicPanel('Panel 2: Combo Kid joins two reactants and shouts, "One big product coming up!"', 1), {
    dialogue: 'One big product coming up!',
    number: '02',
    raw: 'Panel 2: Combo Kid joins two reactants and shouts, "One big product coming up!"',
    scene: 'joins two reactants and shouts',
    speaker: 'Combo Kid',
    visualHint: 'action',
  });
});

test('getChapterSectionVariant maps generated h2 titles to product sections', () => {
  const section = (heading: string): ChapterSection => ({
    heading: { type: 'h2', text: heading },
    normalizedTitle: normalizeSectionTitle(heading),
    blocks: [],
  });

  assert.equal(getChapterSectionVariant(section('chapter goal')), 'goals');
  assert.equal(getChapterSectionVariant(section('chapter flow for the platform')), 'flow');
  assert.equal(getChapterSectionVariant(section('1) chemical reactions')), 'concept');
  assert.equal(getChapterSectionVariant(section('2) balanced chemical equations')), 'concept');
  assert.equal(getChapterSectionVariant(section('solved practice set')), 'example');
  assert.equal(getChapterSectionVariant(section('exam-friendly summary notes')), 'summary');
  assert.equal(getChapterSectionVariant(section('common mistakes students make')), 'mistakes');
  assert.equal(getChapterSectionVariant(section('board tips')), 'tips');
  assert.equal(getChapterSectionVariant(section('short answer practice')), 'practice');
  assert.equal(getChapterSectionVariant(section('mini quiz with answers')), 'quiz');
  assert.equal(getChapterSectionVariant(section('comic style recap')), 'comic');
  assert.equal(getChapterSectionVariant(section('teacher note on textbook alignment')), 'standard');
});

test('isFormulaLikeText detects equations, reactions, and formula-heavy lines without catching normal prose', () => {
  assert.equal(isFormulaLikeText('CaO + H2O -> Ca(OH)2'), true);
  assert.equal(isFormulaLikeText('2H2 + O2 -> 2H2O'), true);
  assert.equal(isFormulaLikeText('BaSO4 is a white precipitate.'), true);
  assert.equal(isFormulaLikeText('A chemical equation represents a reaction using symbols and formulae.'), false);
  assert.equal(isFormulaLikeText('Panel 1: Captain Atom says, "Balance both sides!"'), false);
});

test('parseComicPanel extracts speaker and visual hint for comic cards', () => {
  assert.deepEqual(parseComicPanel('Panel 2: Combo Kid joins two reactants and shouts, "One big product coming up!"', 1), {
    dialogue: 'One big product coming up!',
    number: '02',
    raw: 'Panel 2: Combo Kid joins two reactants and shouts, "One big product coming up!"',
    scene: 'joins two reactants and shouts',
    speaker: 'Combo Kid',
    visualHint: 'action',
  });
});

test('parseComicPanel handles colon and no-prefix fallbacks', () => {
  assert.deepEqual(parseComicPanel('Panel 4: Reactive Raja: More reactive metals get the seat.', 3), {
    dialogue: 'More reactive metals get the seat.',
    number: '04',
    raw: 'Panel 4: Reactive Raja: More reactive metals get the seat.',
    scene: 'Recap moment',
    speaker: 'Reactive Raja',
    visualHint: 'action',
  });

  assert.deepEqual(parseComicPanel('Valli sees the dead cow and becomes quiet.', 4), {
    dialogue: 'Valli sees the dead cow and becomes quiet.',
    number: '05',
    raw: 'Valli sees the dead cow and becomes quiet.',
    scene: 'Recap moment',
    speaker: 'Memory Guide',
    visualHint: 'memory',
  });
});
