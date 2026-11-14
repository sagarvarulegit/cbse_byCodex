import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { buildChallengeUrl, buildWhatsAppShareUrl } from './whatsapp-share';

test('buildWhatsAppShareUrl and buildChallengeUrl construct valid encoded URLs', () => {
  const challengeUrl = buildChallengeUrl('/chapters/introduction-to-trigonometry/quiz', {
    challengeBy: 'Shauryansh',
    beat: 80,
    empty: '',
  });
  assert.equal(
    challengeUrl,
    'https://www.chapterready.in/chapters/introduction-to-trigonometry/quiz?challengeBy=Shauryansh&beat=80',
  );

  const wa = buildWhatsAppShareUrl(`Beat my 80% score!\n${challengeUrl}`);
  assert.ok(wa.startsWith('https://api.whatsapp.com/send?text='));
  assert.ok(decodeURIComponent(wa.split('text=')[1]).includes(challengeUrl));
});

test('Homepage hero embeds interactive 60s Board Trap Challenge, countdown pill, and 1,669+ PYQs proof', () => {
  const homeSource = fs.readFileSync(
    fileURLToPath(new URL('../app/page.tsx', import.meta.url)),
    'utf8',
  );
  assert.match(homeSource, /HeroBoardTrapChallenge/);
  assert.match(homeSource, /BoardExamCountdownPill/);
  assert.match(homeSource, /1,669\+ PYQs/);
  assert.doesNotMatch(homeSource, /280\+ Qs/);
});

test('Dashboard embeds InteractivePlaygroundStrip and BoardExamCountdownPill', () => {
  const dashboardSource = fs.readFileSync(
    fileURLToPath(new URL('../app/dashboard/page.tsx', import.meta.url)),
    'utf8',
  );
  assert.match(dashboardSource, /InteractivePlaygroundStrip/);
  assert.match(dashboardSource, /BoardExamCountdownPill/);
});

test('QuizScoreForm defaults to 5-question instant sprint stepper, supports guest score view, and shares on WhatsApp', () => {
  const quizFormSource = fs.readFileSync(
    fileURLToPath(new URL('../components/QuizScoreForm.tsx', import.meta.url)),
    'utf8',
  );
  assert.match(quizFormSource, /const SPRINT_SIZE = 5/);
  assert.match(quizFormSource, /useState<'sprint' \| 'sheet'>\('sprint'\)/);
  assert.match(quizFormSource, /response\.status === 401/);
  assert.match(quizFormSource, /WhatsAppChallengeBar/);
  assert.match(quizFormSource, /challengeBy/);
});

test('Navigation removes upfront rupee tags and FormulaCheatsheetViewer enables free flashcards + Study Buddy WhatsApp unlock', () => {
  const topbarSource = fs.readFileSync(
    fileURLToPath(new URL('../components/StudentTopbar.tsx', import.meta.url)),
    'utf8',
  );
  assert.doesNotMatch(topbarSource, /Formula Cheatsheets \(₹49\)/);
  assert.doesNotMatch(topbarSource, /NCERT Activities \(₹99\)/);

  const cheatsheetViewer = fs.readFileSync(
    fileURLToPath(new URL('../components/FormulaCheatsheetViewer.tsx', import.meta.url)),
    'utf8',
  );
  assert.match(cheatsheetViewer, /viewMode === 'flashcards' \|\| isSheetAccessible/);
  assert.match(cheatsheetViewer, /cbse_buddy_unlocked_cheatsheets/);
  assert.match(cheatsheetViewer, /Share on WhatsApp to Unlock Free/);
});

test('All three Arcade games trigger openWhatsAppChallenge on end screen', () => {
  for (const gameFile of [
    '../components/games/SciWordleGame.tsx',
    '../components/games/ChemicalBalancerGame.tsx',
    '../components/games/FormulaRushGame.tsx',
  ]) {
    const src = fs.readFileSync(fileURLToPath(new URL(gameFile, import.meta.url)), 'utf8');
    assert.match(src, /openWhatsAppChallenge/, `${gameFile} must call openWhatsAppChallenge`);
  }
});
