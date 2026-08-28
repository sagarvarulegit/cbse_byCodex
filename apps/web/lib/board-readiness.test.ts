import assert from 'node:assert/strict';
import test from 'node:test';

import {
  READINESS_SUBJECTS,
  calculateSubjectReadiness,
  getAllReadinessSubjects,
  getPerformanceTier,
  getSubjectBlueprint,
  simulateTargetGap,
  formatWhatsAppReport,
  type ChapterConfidence,
} from './board-readiness';

test('All 7 Class 10 subjects are defined with 80 total marks and full units', () => {
  const subjects = getAllReadinessSubjects();
  assert.equal(subjects.length, 7, 'Must support 7 subjects');

  const expectedCodes = ['086', '041', '241', '087', '184', '002', '085'];
  for (const expCode of expectedCodes) {
    assert.ok(subjects.some((s) => s.code === expCode), `Subject with code ${expCode} must exist`);
  }

  for (const s of subjects) {
    const bp = getSubjectBlueprint(s.slug);
    assert.equal(bp.totalMarks, 80, `${s.slug} must have totalMarks = 80`);
    assert.equal(bp.passingMarks, 26, `${s.slug} passingMarks must be 26 (33% of 80)`);
    assert.ok(bp.units.length >= 3, `${s.slug} must have at least 3 units`);

    // Verify unit sum equals 80 marks
    const unitMarksSum = bp.units.reduce((acc, u) => acc + u.officialMarks, 0);
    assert.equal(unitMarksSum, 80, `${s.slug} units must sum to 80 marks`);

    // Verify each chapter has key concepts and recommended tools
    for (const u of bp.units) {
      for (const ch of u.chapters) {
        assert.ok(ch.keyConcepts.length >= 2, `${ch.slug} must have at least 2 key concepts`);
        assert.ok(ch.recommendedToolPath.startsWith('/'), `${ch.slug} must have valid tool path`);
        assert.ok(ch.recommendedToolLabel.length > 3, `${ch.slug} must have tool label`);
        assert.ok(ch.weightageMarks > 0, `${ch.slug} weightage must be > 0`);
      }
    }
  }
});

test('calculateSubjectReadiness returns 100% and 80 marks when all chapters are mastered', () => {
  const bp = getSubjectBlueprint('science');
  const allMastered: Record<string, ChapterConfidence> = {};
  for (const u of bp.units) {
    for (const ch of u.chapters) {
      allMastered[ch.slug] = 'mastered';
    }
  }

  const result = calculateSubjectReadiness('science', allMastered);
  assert.ok(result.readinessScore >= 95, 'All mastered should have readiness >= 95%');
  assert.ok(result.predictedMarks >= 76, 'All mastered should predict 76-80 marks');
  assert.equal(result.performanceTier.badge, '🏆 Centum Track');
  assert.equal(result.topWeakSpots.length, 0, 'No weak spots when all mastered');
  assert.ok(result.topStrengths.length > 0, 'Strengths should be populated');
});

test('calculateSubjectReadiness returns critical tier when unstudied', () => {
  const result = calculateSubjectReadiness('mathematics-standard', {});
  assert.ok(result.readinessScore <= 20, 'Unstudied readiness must be low');
  assert.ok(result.predictedMarks <= 16, 'Predicted marks must be low');
  assert.equal(result.performanceTier.badge, '🚨 Critical Catch-up');
  assert.ok(result.topWeakSpots.length > 5, 'Should have multiple weak spots');
  assert.equal(result.topStrengths.length, 0, 'No strengths when unstudied');
});

test('Section projections maintain valid mark bounds and sections A through E', () => {
  const result = calculateSubjectReadiness('science', {
    'life-processes': 'mastered',
    'light-reflection-and-refraction': 'mastered',
    'electricity': 'comfortable',
    'chemical-reactions-and-equations': 'needs_revision',
  });

  assert.equal(result.sectionProjections.length, 5, 'Must have Sections A through E');
  for (const sec of result.sectionProjections) {
    assert.ok(sec.predictedMarks >= 0, `Section ${sec.section} predicted marks >= 0`);
    assert.ok(sec.predictedMarks <= sec.maxMarks, `Section ${sec.section} predicted marks <= maxMarks`);
    assert.ok(sec.percentage >= 0 && sec.percentage <= 100, `Section ${sec.section} percentage in range`);
    assert.ok(['safe', 'needs_work', 'vulnerable'].includes(sec.status));
    assert.ok(sec.riskNote.length > 5);
  }
});

test('14-day revision roadmap contains all 14 structured days with valid phase distribution', () => {
  const result = calculateSubjectReadiness('science', {
    'electricity': 'struggling',
    'life-processes': 'needs_revision',
    'light-reflection-and-refraction': 'struggling',
  });

  assert.equal(result.roadmap14Day.length, 14, 'Must have exactly 14 days');
  for (let i = 0; i < 14; i++) {
    const task = result.roadmap14Day[i];
    assert.equal(task.day, i + 1, `Day number must match sequence`);
    assert.ok(task.chapterTitle.length > 3, `Day ${i + 1} must have chapter title`);
    assert.ok(task.actionHref.startsWith('/'), `Day ${i + 1} must have actionHref`);
    assert.ok(task.estimatedMinutes >= 20, `Day ${i + 1} must have estimated study time`);
    assert.ok(task.potentialMarksGain > 0, `Day ${i + 1} must specify potential marks gain`);
    assert.ok(['High-Yield Anchors', 'Section D & Case Studies', 'Formula & Weak Spot Polish', 'Final Mock & Simulation'].includes(task.phase));
  }
});

test('simulateTargetGap calculates realistic upgrade path and daily hours', () => {
  const currentStates: Record<string, ChapterConfidence> = {
    'life-processes': 'comfortable',
    'chemical-reactions-and-equations': 'needs_revision',
    'light-reflection-and-refraction': 'struggling',
  };

  const simulation = simulateTargetGap('science', currentStates, 75);
  assert.equal(simulation.targetMarks, 75);
  assert.ok(simulation.marksGap > 0);
  assert.ok(simulation.requiredDailyStudyHours > 0);
  assert.ok(simulation.upgradesNeeded.length > 0);

  for (const up of simulation.upgradesNeeded) {
    assert.ok(up.chapterTitle.length > 3);
    assert.ok(up.marksGain > 0);
    assert.ok(['Low', 'Medium', 'High'].includes(up.effortLevel));
    assert.ok(up.actionTip.length > 10);
  }
});

test('formatWhatsAppReport outputs clean, complete text format with all key metrics', () => {
  const result = calculateSubjectReadiness('mathematics-standard', {
    'triangles': 'needs_revision',
    'statistics': 'mastered',
    'surface-areas-and-volumes': 'comfortable',
  });

  const reportText = formatWhatsAppReport(result);
  assert.ok(reportText.includes('CBSE Class 10 Board Exam Readiness Report'));
  assert.ok(reportText.includes('Mathematics Standard (041)'));
  assert.ok(reportText.includes(`${result.predictedMarks} / 80`));
  assert.ok(reportText.includes('https://www.chapterready.in/tools/readiness-predictor'));
});

test('getPerformanceTier correctly bounds marks across all ranges', () => {
  assert.equal(getPerformanceTier(78, 80).badge, '🏆 Centum Track');
  assert.equal(getPerformanceTier(70, 80).badge, '🌟 Distinction');
  assert.equal(getPerformanceTier(60, 80).badge, '📈 First Class');
  assert.equal(getPerformanceTier(45, 80).badge, '⚡ Foundation Stage');
  assert.equal(getPerformanceTier(25, 80).badge, '🚨 Critical Catch-up');
});
