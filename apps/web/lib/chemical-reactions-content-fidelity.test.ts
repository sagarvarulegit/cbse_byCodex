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
    '1.2 Types of Chemical Reactions - 1.2.1 Combination and 1.2.2 Decomposition',
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
  ['07-board-exam-practice.md', 'Board Exam Practice - Verified Previous-Year Questions'],
  ['08-board-readiness-diagnostic.md', 'Board Readiness Diagnostic - 30 Marks'],
  ['09-board-readiness-diagnostic-b.md', 'Board Readiness Diagnostic B - Transfer Check - 20 Marks'],
] as const;

const ncertLessons = expectedLessons.slice(0, 6);

function readLesson(fileName: string) {
  return fs.readFileSync(path.join(lessonRoot, fileName), 'utf8');
}

function frontmatterTitle(markdown: string) {
  return markdown.match(/^---\r?\n[\s\S]*?^title:\s*(.+)$/m)?.[1]?.trim() ?? '';
}

function h1(markdown: string) {
  return markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? '';
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function headingIndex(markdown: string, heading: string) {
  return markdown.search(new RegExp(`^##\\s+${escapeRegExp(heading)}\\s*$`, 'mi'));
}

function assertInOrder(markdown: string, labels: string[]) {
  let previousIndex = -1;
  for (const label of labels) {
    const index = markdown.indexOf(label);
    assert.ok(index >= 0, `Expected ${label}`);
    assert.ok(index > previousIndex, `Expected ${label} in NCERT order`);
    previousIndex = index;
  }
}

test('Chapter 1 resources match six NCERT lessons and three board supplements', () => {
  const chapter = getChapter(chapterSlug);
  assert.ok(chapter);
  assert.deepEqual(
    getAvailableLessons(chapter).map((lesson) => [lesson.fileName, lesson.title]),
    expectedLessons,
  );

  for (const [fileName, expectedTitle] of expectedLessons) {
    const markdown = readLesson(fileName);
    assert.equal(frontmatterTitle(markdown), expectedTitle);
    assert.equal(h1(markdown), expectedTitle);
  }
});

test('numbered sections preserve exact NCERT parent-child order', () => {
  const lessons = ncertLessons.map(([fileName]) => readLesson(fileName)).join('\n');
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

test('every NCERT equation number maps to the correct equation, state, and condition', () => {
  const lesson1 = readLesson('01-chemical-equations.md');
  const lesson2 = readLesson('02-balancing-equations.md');
  const lesson3 = readLesson('03-combination-and-decomposition-reactions.md');
  const lesson4 = readLesson('04-displacement-and-double-displacement-reactions.md');
  const lesson5 = readLesson('05-oxidation-and-reduction.md');

  const exactMappings: Array<[string, string]> = [
    [lesson1, '`Magnesium + Oxygen → Magnesium oxide` **(1.1)**'],
    [lesson1, '`Mg + O₂ → MgO` **(1.2)**'],
    [lesson2, '`Zn + H₂SO₄ → ZnSO₄ + H₂` **(1.3)**'],
    [lesson2, '`Fe + H₂O → Fe₃O₄ + H₂` **(1.4)**'],
    [lesson2, '`Fe + H₂O → Fe₃O₄ + H₂` **(1.5)**'],
    [lesson2, '`Fe + 4H₂O → Fe₃O₄ + H₂` **(1.6)**'],
    [lesson2, '`Fe + 4H₂O → Fe₃O₄ + 4H₂` **(1.7)**'],
    [lesson2, '`3Fe + 4H₂O → Fe₃O₄ + 4H₂` **(1.8)**'],
    [lesson2, '`3Fe + 4H₂O → Fe₃O₄ + 4H₂` **(1.9)**'],
    [lesson2, '`3Fe(s) + 4H₂O(g) → Fe₃O₄(s) + 4H₂(g)` **(1.10)**'],
    [lesson2, '`CO(g) + 2H₂(g) →[340 atm] CH₃OH(l)` **(1.11)**'],
    [lesson2, '`6CO₂(aq) + 12H₂O(l) →[Sunlight, chlorophyll] C₆H₁₂O₆(aq) + 6O₂(aq) + 6H₂O(l)` **(1.12)**'],
    [lesson3, '`CaO(s) + H₂O(l) → Ca(OH)₂(aq) + Heat` **(1.13)**'],
    [lesson3, '`Ca(OH)₂(aq) + CO₂(g) → CaCO₃(s) + H₂O(l)` **(1.14)**'],
    [lesson3, '`C(s) + O₂(g) → CO₂(g)` **(1.15)**'],
    [lesson3, '`2H₂(g) + O₂(g) → 2H₂O(l)` **(1.16)**'],
    [lesson3, '`CH₄(g) + 2O₂(g) → CO₂(g) + 2H₂O(g)` **(1.17)**'],
    [lesson3, '`C₆H₁₂O₆(aq) + 6O₂(aq) → 6CO₂(aq) + 6H₂O(l) + Energy` **(1.18)**'],
    [lesson3, '`2FeSO₄(s) →[Heat] Fe₂O₃(s) + SO₂(g) + SO₃(g)` **(1.19)**'],
    [lesson3, '`CaCO₃(s) →[Heat] CaO(s) + CO₂(g)` **(1.20)**'],
    [lesson3, '`2Pb(NO₃)₂(s) →[Heat] 2PbO(s) + 4NO₂(g) + O₂(g)` **(1.21)**'],
    [lesson3, '`2AgCl(s) →[Sunlight] 2Ag(s) + Cl₂(g)` **(1.22)**'],
    [lesson3, '`2AgBr(s) →[Sunlight] 2Ag(s) + Br₂(g)` **(1.23)**'],
    [lesson4, '`Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)` **(1.24)**'],
    [lesson4, '`Zn(s) + CuSO₄(aq) → ZnSO₄(aq) + Cu(s)` **(1.25)**'],
    [lesson4, '`Pb(s) + CuCl₂(aq) → PbCl₂(aq) + Cu(s)` **(1.26)**'],
    [lesson4, '`Na₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s) + 2NaCl(aq)` **(1.27)**'],
    [lesson5, '`2Cu + O₂ →[Heat] 2CuO` **(1.28)**'],
    [lesson5, '`CuO + H₂ →[Heat] Cu + H₂O` **(1.29)**'],
    [lesson5, '`CuO + H₂ →[Heat] Cu + H₂O` **(1.30)**'],
    [lesson5, '`ZnO + C → Zn + CO` **(1.31)**'],
    [lesson5, '`MnO₂ + 4HCl → MnCl₂ + 2H₂O + Cl₂` **(1.32)**'],
  ];

  for (const [markdown, mapping] of exactMappings) assert.ok(markdown.includes(mapping), mapping);
  assert.match(
    lesson3,
    /`2H₂O\(l\) →\[Electricity\] 2H₂\(g\) \+ O₂\(g\)`\r?\n\r?\nNCERT leaves this activity equation unnumbered/,
  );
  assert.doesNotMatch(lesson5, /H₂S\(g\).*\*\*\(1\.32\)\*\*/);
});

test('Activities 1.1-1.11 preserve source apparatus, safety, and observations', () => {
  const lessons = ncertLessons.map(([fileName]) => readLesson(fileName)).join('\n');
  for (let number = 1; number <= 11; number += 1) {
    assert.equal((lessons.match(new RegExp(`^### Activity 1\\.${number}(?:\\s|$)`, 'gmi')) ?? []).length, 1);
  }

  for (const cue of [
    "teacher's assistance", 'suitable eyeglasses', 'Handle the acid with care',
    'FeSO₄·7H₂O', 'waft the gas', 'about 2 g lead nitrate', 'rubber stoppers',
    '6 V battery', 'test tubes with water', 'black-and-white photography',
    'three iron nails', 'test tubes A and B', 'about 10 mL', 'about 3 mL',
    'about 1 g copper powder',
  ]) assert.ok(lessons.includes(cue), `Expected source cue: ${cue}`);
});

test('Figure 1.2 belongs to Activity 1.3 and all NCERT figures remain ordered', () => {
  const lesson1 = readLesson('01-chemical-equations.md');
  const lessons = ncertLessons.map(([fileName]) => readLesson(fileName)).join('\n');
  const activity12 = lesson1.indexOf('### Activity 1.2');
  const activity13 = lesson1.indexOf('### Activity 1.3');
  const figure12 = lesson1.indexOf('**Figure 1.2**');
  assert.ok(activity12 >= 0 && activity13 > activity12 && figure12 > activity13);
  assert.equal((lesson1.match(/\*\*Figure 1\.2\*\*/g) ?? []).length, 1);
  assert.doesNotMatch(lesson1.slice(activity12, activity13), /\*\*Figure 1\.2\*\*/);
  assertInOrder(lessons, Array.from({ length: 10 }, (_, index) => `Figure 1.${index + 1}`));
});

test('in-text Questions blocks stay in their exact textbook positions', () => {
  const lesson2 = readLesson('02-balancing-equations.md');
  const lesson3 = readLesson('03-combination-and-decomposition-reactions.md');
  const lesson5 = readLesson('05-oxidation-and-reduction.md');

  assert.ok(lesson2.indexOf('**❓ QUESTIONS**') > headingIndex(lesson2, '1.1.2 Balanced Chemical Equations'));
  assert.ok(lesson3.indexOf('**❓ QUESTIONS**') > headingIndex(lesson3, '1.2.2 Decomposition Reaction'));
  assert.ok(lesson5.indexOf('**❓ QUESTIONS**') > headingIndex(lesson5, '1.2.5 Oxidation and Reduction'));
  assert.ok(headingIndex(lesson5, '1.3 Have You Observed the Effects of Oxidation Reactions in Everyday Life?') > lesson5.indexOf('**❓ QUESTIONS**'));

  assert.match(lesson2, /Why should a magnesium ribbon be cleaned before burning in air\?/);
  assert.match(lesson3, /Why is the amount of gas collected in one of the test tubes in Activity 1\.7 double/);
  assert.match(lesson5, /Identify the substances that are oxidised and the substances that are reduced/);
});

test('recall prompts, Group Activity, twenty exercises, and scoring details are complete', () => {
  const lesson3 = readLesson('03-combination-and-decomposition-reactions.md');
  const lesson4 = readLesson('04-displacement-and-double-displacement-reactions.md');
  const lesson6 = readLesson('06-ncert-exercises-and-revision.md');

  assert.match(lesson3, /### Carry out the following activity/);
  assert.match(lesson3, /mix with a glass rod/);
  assert.match(lesson4, /### Recall Activity 1\.2/);
  assert.match(lesson4, /What was the colour of the precipitate\? Name it\./);
  assert.match(lesson4, /Is this also a double displacement reaction\?/);
  assert.match(lesson6, /## Group Activity/);
  assert.match(lesson6, /two spatulas of potassium sulphate/);

  for (let number = 1; number <= 20; number += 1) {
    assert.match(lesson6, new RegExp(`^\\*\\*${number}\\.\\s`, 'mi'), `Expected Exercise ${number}`);
  }
  assert.match(lesson6, /\*\*Example 1:\*\*[\s\S]*\*\*Example 2:\*\*/);
  assert.match(lesson6, /\*\*Heat:\*\*.*→\[Heat\]/);
  assert.match(lesson6, /Oxidation is gain of oxygen[\s\S]*1\..*2\./);
  assert.ok(
    lesson6.indexOf('**20. Explain the following terms') < lesson6.indexOf('## Group Activity'),
    'NCERT places the Group Activity after Exercise 20',
  );
});

test('every lesson supplies full-marks study support without exposing internal paths', () => {
  for (const [fileName] of expectedLessons) {
    const lesson = readLesson(fileName);
    for (const section of ['## Common mistakes', '## Board tips', '## One-minute revision']) {
      assert.ok(lesson.includes(section), `${fileName} needs ${section}`);
    }
    assert.doesNotMatch(lesson, /textbooks\/|jesc101\.pdf|teacher note on textbook alignment/i);
  }
});

test('textbook prompts remain visible before their explanations', () => {
  const lesson2 = readLesson('02-balancing-equations.md');
  const lesson3 = readLesson('03-combination-and-decomposition-reactions.md');
  const lesson5 = readLesson('05-oxidation-and-reduction.md');

  assert.match(lesson2, /Using these steps, can you balance Eq\. \(1\.2\) given in the text earlier\?/);
  assert.match(lesson3, /What form of energy is causing these decomposition reactions\?/);
  assert.match(lesson5, /What do you observe\? Why has this black substance formed\?/);
});

test('lesson callouts and comic recaps use formats supported by the web renderer', () => {
  for (const [fileName] of expectedLessons) {
    const lesson = readLesson(fileName);
    const comicStart = lesson.indexOf('## Comic recap');
    const comicBody = comicStart >= 0 ? lesson.slice(comicStart) : '';

    assert.ok(comicStart >= 0, `${fileName} needs a comic recap`);
    assert.equal((comicBody.match(/^- .+$/gm) ?? []).length, 4, `${fileName} needs four comic panels`);
    assert.equal(
      (comicBody.match(/^- (?:Priya|Rahul):/gm) ?? []).length,
      4,
      `${fileName} comic panels must use Priya and Rahul`,
    );
    assert.doesNotMatch(lesson, /^>\s/m, `${fileName} contains an unsupported blockquote marker`);
  }
});

test('practice answer checks render as try-first disclosure controls', () => {
  const lessonNotesSource = fs.readFileSync(
    path.resolve(__dirname, '..', 'components', 'LessonNotesContent.tsx'),
    'utf8',
  );

  assert.match(
    lessonNotesSource,
    /function renderPracticeAnswerCheck[\s\S]*?<details>[\s\S]*?Try first, then reveal the answer[\s\S]*?<\/details>/,
  );
});

test('Chapter 1 additions stay source-bounded and learner holdout tasks stay unseen', () => {
  const lesson5 = readLesson('05-oxidation-and-reduction.md');
  const lesson6 = readLesson('06-ncert-exercises-and-revision.md');
  const rubric = fs.readFileSync(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'docs',
      'content',
      'class-10',
      'science',
      'chemical-reactions-and-equations',
      'learner-task-smoke-rubric.md',
    ),
    'utf8',
  );
  const chapterPack = fs.readFileSync(
    path.resolve(
      __dirname,
      '..',
      '..',
      '..',
      'docs',
      'content',
      'class-10',
      'science',
      'chemical-reactions-and-equations',
      'chapter-pack.md',
    ),
    'utf8',
  );
  const balancingWorkbench = fs.readFileSync(
    path.resolve(__dirname, 'chemical-equation-balancing.ts'),
    'utf8',
  );
  const teachingContent = [
    ...expectedLessons.map(([fileName]) => readLesson(fileName)),
    readLesson('quiz.md'),
    chapterPack,
    balancingWorkbench,
  ].join('\n');
  const taskSection = rubric.slice(rubric.indexOf('### Part A'), rubric.indexOf('### Part C'));
  const holdoutEquations = [...taskSection.matchAll(/^\d+\.\s+`([^`]+)`$/gm)].map((match) => match[1]);

  assert.doesNotMatch(lesson5, /\b(?:oiling|greasing|galvanising)\b|keeping food cool/i);
  assert.doesNotMatch(chapterPack, /\bcooling\b/i);
  assert.doesNotMatch(lesson6, /displaces oxygen from the packet/i);
  assert.equal(holdoutEquations.length, 12);

  for (const equation of holdoutEquations) {
    assert.ok(!teachingContent.includes(equation), `Holdout equation leaked into teaching content: ${equation}`);
  }
});

test('board supplements stay separate, traceable, and marks-based', () => {
  const lesson3 = readLesson('03-combination-and-decomposition-reactions.md');
  const lesson4 = readLesson('04-displacement-and-double-displacement-reactions.md');
  const lesson5 = readLesson('05-oxidation-and-reduction.md');
  const boardPractice = readLesson('07-board-exam-practice.md');
  const diagnostic = readLesson('08-board-readiness-diagnostic.md');
  const transferDiagnostic = readLesson('09-board-readiness-diagnostic-b.md');

  assert.match(boardPractice, /separate exam-practice supplement/i);
  assert.match(boardPractice, /does not add or renumber any textbook topic/i);
  assert.match(boardPractice, /not official CBSE marking schemes themselves/i);
  assert.match(boardPractice, /checked against CBSE's published marking-scheme value points for 2023-2026/i);
  assert.match(boardPractice, /CBSE Science 2023, paper `31\/2\/1`, Question 21\(a\), printed page 13/);
  assert.match(boardPractice, /CBSE Science 2024, paper `31\/4\/1`, Question 34\(b\), printed page 19/);
  assert.match(boardPractice, /CBSE Science 2025, paper `31\/4\/1`, Question 27\(A\), printed page 15/);
  assert.match(boardPractice, /CBSE Science 2026, paper `31\/1\/3`, Question 26, printed page 15/);
  assert.match(boardPractice, /CBSE Science 2023, paper `31\/1\/1`, Question 27, printed page 21/);
  assert.match(boardPractice, /CBSE Science 2023, paper `31\/4\/2`, Question 33, printed page 17/);
  assert.match(boardPractice, /CBSE Science 2024, paper `31\/1\/3`, Question 33, printed page 17/);
  assert.match(boardPractice, /An \*\*oxidising agent\*\* causes another substance to be oxidised/);
  assert.match(boardPractice, /A \*\*reducing agent\*\* causes another substance to be reduced/);
  assert.match(boardPractice, /Cathode:anode mass ratio `H₂:O₂ = 4:32 = 1:8`/);
  assert.match(boardPractice, /endothermic decomposition/);
  assert.match(boardPractice, /exothermic combination/);
  assert.match(boardPractice, /turns \*\*milky white\*\*/);
  assert.match(boardPractice, /## Latest official SQP-pattern challenges/);
  assert.match(boardPractice, /newest published main-subject Class X SQP is the 2025-26 paper/);
  assert.match(boardPractice, /original platform questions built on those patterns/i);
  assert.match(lesson3, /Silver chloride is kept in a dark-coloured container/);
  assert.match(lesson4, /### Board extension: Non-metal displacement/);
  assert.match(lesson4, /Cl₂\(g\) \+ 2KI\(aq\) → 2KCl\(aq\) \+ I₂\(s\)/);
  assert.match(lesson4, /### Board extension: Double displacement without a precipitate/);
  assert.match(lesson5, /### Board extension: Copper corrosion and material choice/);
  assert.match(lesson5, /basic copper carbonate/);
  for (const practiceId of [
    'cre-pyq-1',
    'cre-pyq-2',
    'cre-pyq-3',
    'cre-pyq-4',
    'cre-pyq-5',
    'cre-pyq-6',
    'cre-pyq-7',
    'cre-pyq-8',
    'cre-pyq-9',
    'cre-current-redox-balance',
    'cre-current-displacement-compare',
    'cre-current-electrolysis-diagnose',
    'cre-current-corrosion-evaluate',
    'cre-current-neutralisation-classify',
  ]) {
    assert.match(boardPractice, new RegExp(`\\[\\[written-practice:${practiceId}\\]\\]`));
  }

  assert.match(diagnostic, /Maximum marks: \*\*30\*\*/);
  assert.match(diagnostic, /The questions are original board-style practice/);
  assert.match(diagnostic, /### Section A - Objective questions - 9 marks/);
  assert.match(diagnostic, /### Section E - Case-based question - 4 marks/);
  assert.match(diagnostic, /## Score profile/);
  assert.match(diagnostic, /first failed skill/i);
  assert.match(diagnostic, /\[\[exam-practice:cre-diagnostic-a\]\]/);

  assert.match(transferDiagnostic, /Maximum marks: \*\*20\*\*/);
  assert.match(transferDiagnostic, /Attempt this only after Diagnostic A/);
  assert.match(transferDiagnostic, /cathode:anode volume ratio of `2:1`/);
  assert.match(transferDiagnostic, /cathode:anode mass is `4:32 = 1:8`/);
  assert.match(transferDiagnostic, /Passing Diagnostic A does not cancel a failure here/);
  assert.match(transferDiagnostic, /\[\[exam-practice:cre-diagnostic-b\]\]/);
});

test('the equation workbench follows the manual method and stays outside the holdout set', () => {
  const balancingLesson = readLesson('02-balancing-equations.md');
  const methodEnd = balancingLesson.indexOf('`3Fe + 4H₂O → Fe₃O₄ + 4H₂` **(1.9)**');
  const workbenchMarker = balancingLesson.indexOf('[[demo:chemical-equation-balancer]]');
  const statesStep = balancingLesson.indexOf('**Step VII: Writing symbols of physical states**');

  assert.ok(methodEnd >= 0);
  assert.ok(workbenchMarker > methodEnd);
  assert.ok(workbenchMarker < statesStep);
});
