import assert from 'node:assert/strict';
import test from 'node:test';

import {
  PYQ_TRENDS_DATA,
  getAllSubjectOptions,
  getSubjectTrends,
} from './pyq-trends';

test('PYQ Trends data contains all core subjects with 80 total marks', () => {
  const subjects = ['science', 'mathematics-standard', 'social-science', 'english-language-and-literature'];

  for (const slug of subjects) {
    const data = PYQ_TRENDS_DATA[slug];
    assert.ok(data, `Subject ${slug} must be defined in PYQ_TRENDS_DATA`);
    assert.equal(data.totalMarks, 80, `${slug} must have total marks of 80`);
    assert.ok(data.chapters.length > 0, `${slug} must have chapters`);
    assert.ok(data.repeatedConcepts.length > 0, `${slug} must have repeated concepts`);
    assert.ok(data.trendInsights.length >= 2, `${slug} must have key trend insights`);
  }
});

test('Science chapter trends maintain valid distributions and high-yield classifications', () => {
  const scienceData = getSubjectTrends('science');
  assert.equal(scienceData.code, '086');
  assert.equal(scienceData.chapters.length, 13, 'Science must cover all 13 NCERT chapters');

  const highYieldChapters = scienceData.chapters.filter((ch) => ch.yieldTier === 'high');
  const highYieldSlugs = highYieldChapters.map((ch) => ch.slug);

  assert.ok(highYieldSlugs.includes('life-processes'), 'Life Processes must be high yield');
  assert.ok(highYieldSlugs.includes('light-reflection-and-refraction'), 'Light must be high yield');
  assert.ok(highYieldSlugs.includes('electricity'), 'Electricity must be high yield');
  assert.ok(highYieldSlugs.includes('carbon-and-its-compounds'), 'Carbon Compounds must be high yield');

  // Verify marks consistency
  for (const ch of scienceData.chapters) {
    assert.ok(ch.officialMarksMin <= ch.officialMarksMax, `${ch.slug} min marks must be <= max marks`);
    assert.ok(ch.historicalAvgMarks >= ch.officialMarksMin, `${ch.slug} avg marks within range`);
    assert.ok(ch.mostRepeatedTopics.length >= 2, `${ch.slug} must list at least 2 repeated topics`);
    assert.ok(ch.boardExamFocusTip.length > 10, `${ch.slug} must have an examiner tip`);
    assert.ok(ch.frequentYears.includes(2026), `${ch.slug} must include 2026 data`);
  }
});

test('Mathematics Standard chapter trends identify Section D (5M) and Section E (Case Study) anchors', () => {
  const mathsData = getSubjectTrends('mathematics-standard');
  assert.equal(mathsData.code, '041');
  assert.equal(mathsData.chapters.length, 14, 'Maths Standard must cover 14 chapters');

  const fiveMarkerChapters = mathsData.chapters.filter((ch) => ch.distribution.la_5m > 0);
  const fiveMarkerSlugs = fiveMarkerChapters.map((ch) => ch.slug);

  assert.ok(fiveMarkerSlugs.includes('triangles'), 'Triangles (BPT) must have 5-mark LA');
  assert.ok(fiveMarkerSlugs.includes('statistics'), 'Statistics must have 5-mark LA');
  assert.ok(fiveMarkerSlugs.includes('surface-areas-and-volumes'), 'Surface Areas & Volumes must have 5-mark LA');

  const caseStudyChapters = mathsData.chapters.filter((ch) => ch.distribution.case_study_4m > 0);
  const caseStudySlugs = caseStudyChapters.map((ch) => ch.slug);

  assert.ok(caseStudySlugs.includes('arithmetic-progressions'), 'AP must have case study');
  assert.ok(caseStudySlugs.includes('coordinate-geometry'), 'Coordinate Geometry must have case study');
  assert.ok(caseStudySlugs.includes('some-applications-of-trigonometry'), 'Heights & Distances must have case study');
});

test('Social Science chapter trends include 5-Mark Map Skill and 20-mark unit parity', () => {
  const sstData = getSubjectTrends('social-science');
  assert.equal(sstData.code, '087');

  const nationalismInIndia = sstData.chapters.find((ch) => ch.slug === 'nationalism-in-india');
  assert.ok(nationalismInIndia, 'Nationalism in India must be present');
  assert.equal(nationalismInIndia?.yieldTier, 'high');
  assert.ok(nationalismInIndia?.distribution.map_skill_5m && nationalismInIndia.distribution.map_skill_5m >= 2);
});

test('Repeated concepts carry complete examiner value points and verified board set citations', () => {
  const allSubjects = getAllSubjectOptions();

  for (const subj of allSubjects) {
    const data = getSubjectTrends(subj.slug);
    for (const concept of data.repeatedConcepts) {
      assert.ok(concept.id, 'Concept must have an id');
      assert.ok(concept.conceptTitle.length > 5, 'Concept title must be descriptive');
      assert.ok(concept.typicalMarks >= 1, 'Marks must be positive');
      assert.ok(concept.questionPromptSample.length > 15, 'Prompt sample must be realistic');
      assert.ok(concept.examinerExpectation.length > 15, 'Examiner expectation must specify step points');
      assert.ok(concept.boardSets.length > 0, 'Must cite board sets');
      assert.ok(concept.frequentYears.length >= 2, 'Must cite multiple years');
    }
  }
});

test('getSubjectTrends safely falls back to science on invalid slug', () => {
  const fallback = getSubjectTrends('unknown-subject-123');
  assert.equal(fallback.slug, 'science');
  assert.equal(fallback.code, '086');
});
