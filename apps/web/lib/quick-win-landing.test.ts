import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import {
  DEFAULT_POST_AUTH_PATH,
  DEFAULT_POST_SIGNUP_PATH,
  getSafePostSignupPath,
} from './auth-redirect';
import { CHAPTER_CHEATSHEETS_DATA } from './content/cheatsheets-data';

test('Post-signup re-routing redirects new students to the Dashboard Welcome Choice Modal (/dashboard?welcome=1)', () => {
  // Empty or default post-auth path routes to /dashboard?welcome=1
  assert.equal(getSafePostSignupPath(null), '/dashboard?welcome=1');
  assert.equal(getSafePostSignupPath(''), '/dashboard?welcome=1');
  assert.equal(getSafePostSignupPath(DEFAULT_POST_AUTH_PATH), '/dashboard?welcome=1');

  // The legacy flow: Signup -> /chapters/real-numbers or /chapters/real-numbers/notes re-routes to /dashboard?welcome=1
  assert.equal(getSafePostSignupPath('/chapters/real-numbers/notes'), '/dashboard?welcome=1');
  assert.equal(getSafePostSignupPath('/chapters/real-numbers'), '/dashboard?welcome=1');

  // Explicit tool paths remain intact
  assert.equal(getSafePostSignupPath('/tools'), '/tools');
  assert.equal(getSafePostSignupPath('/formula-cheatsheets'), '/formula-cheatsheets');
  assert.equal(getSafePostSignupPath('/pyq-trends'), '/pyq-trends');
  assert.equal(getSafePostSignupPath('/exam-papers'), '/exam-papers');

  // Any other chapter notes link re-routes to its chapter hub
  assert.equal(
    getSafePostSignupPath('/chapters/chemical-reactions-and-equations/notes'),
    '/chapters/chemical-reactions-and-equations',
  );

  // Safe external checks
  assert.equal(getSafePostSignupPath('https://malicious.example'), DEFAULT_POST_SIGNUP_PATH);
});

test('PostSignupWelcomeModal asks "What do you want to do first?" with Formula Sheets, 80-Mark Board Mock, and 5-Year PYQ Trends', () => {
  const modalSource = fs.readFileSync(
    fileURLToPath(
      new URL('../components/dashboard/PostSignupWelcomeModal.tsx', import.meta.url),
    ),
    'utf8',
  );

  assert.match(modalSource, /What do you want to do first\?/);
  assert.match(modalSource, /Download 1-Page Formula Sheets/);
  assert.match(modalSource, /\/formula-cheatsheets/);
  assert.match(modalSource, /Take an 80-Mark Board Mock/);
  assert.match(modalSource, /\/exam-papers/);
  assert.match(modalSource, /Check 5-Year PYQ Trends/);
  assert.match(modalSource, /\/pyq-trends/);
});

test('High-value pages include PilotEngagementTracker logging for ProgressEvent', () => {
  const trackedPages = [
    { file: '../app/formula-cheatsheets/page.tsx', eventType: 'resource_open', surface: 'formula_cheatsheets' },
    { file: '../app/tools/page.tsx', eventType: 'tool_view', surface: 'tools' },
    { file: '../app/pyq-trends/page.tsx', eventType: 'tool_view', surface: 'pyq_trends' },
    { file: '../app/games/formula-rush/page.tsx', eventType: 'tool_view', surface: 'games' },
    { file: '../app/exam-papers/page.tsx', eventType: 'tool_view', surface: 'exam_papers' },
    { file: '../app/exam-papers/[id]/take/page.tsx', eventType: 'exam_paper_start', surface: 'exam_papers' },
  ];

  for (const item of trackedPages) {
    const source = fs.readFileSync(
      fileURLToPath(new URL(item.file, import.meta.url)),
      'utf8',
    );
    assert.match(source, /PilotEngagementTracker/, `${item.file} should render PilotEngagementTracker`);
    assert.match(source, new RegExp(`eventType="${item.eventType}"`), `${item.file} should log ${item.eventType}`);
    assert.match(source, new RegExp(`surface="${item.surface}"`), `${item.file} should specify surface ${item.surface}`);
  }
});

test('Chapter hub contains the two high-contrast Quick Win hero cards and secondary notes option', () => {
  const chapterHub = fs.readFileSync(
    fileURLToPath(new URL('../app/chapters/[slug]/page.tsx', import.meta.url)),
    'utf8',
  );

  // Hero section badge and Quick Win Hub header
  assert.match(chapterHub, /quick-win-hero-header/);
  assert.match(chapterHub, /CLASS 10 QUICK WIN HUB/);

  // Card 1: Download 1-Page Formula Sheet
  assert.match(chapterHub, /Download 1-Page Formula Sheet \(Class 10 \{chapter\.title\}\)/);
  assert.match(chapterHub, /href=\{`\/formula-cheatsheets\?chapter=\$\{slug\}`\}/);

  // Card 2: Take 10-Min Board Mock Test
  assert.match(chapterHub, /Take 10-Min Board Mock Test/);
  assert.match(chapterHub, /href=\{`\/chapters\/\$\{slug\}\/quiz`\}/);

  // Secondary option below hero cards: standard notes
  assert.match(chapterHub, /quick-win-secondary-option/);
  assert.match(chapterHub, /secondary-notes-button/);
  assert.match(chapterHub, /Study Standard Chapter Notes \(\{chapter\.title\}\)/);
});

test('Notes view contains sticky floating pills, top CTA banner, and inline break banner after Section 1', () => {
  const notesPage = fs.readFileSync(
    fileURLToPath(
      new URL(
        '../app/chapters/[slug]/notes/CompleteChapterNotesPage.tsx',
        import.meta.url,
      ),
    ),
    'utf8',
  );

  // Sticky Floating Quick Action Pill Bar
  assert.match(notesPage, /notes-sticky-floating-bar/);
  assert.match(notesPage, /floating-pill-btn pill-formula/);
  assert.match(notesPage, /floating-pill-btn pill-mock/);

  // Top CTA Banner
  assert.match(notesPage, /notes-top-cta-banner/);
  assert.match(notesPage, /Need quick revision\? Switch to the Formula Cheat Sheet/);
  assert.match(notesPage, /Ready to test yourself\? Try CBSE Board Mock Questions/);

  // Inline break banner placed after section 1
  assert.match(notesPage, /index === 0 &&/);
  assert.match(notesPage, /notes-inline-break-card/);
  assert.match(notesPage, /SECTION 1 COMPLETED/);
  assert.match(notesPage, /Completed Section 1\? Choose your next high-impact step/);
});

test('Formula cheatsheets dataset includes Real Numbers free sample', () => {
  const realNumbersCheatsheet = CHAPTER_CHEATSHEETS_DATA.find(
    (ch) => ch.chapterSlug === 'real-numbers' || ch.id === 'math-ch1',
  );
  assert.ok(realNumbersCheatsheet, 'Real Numbers cheatsheet should exist');
  assert.equal(realNumbersCheatsheet.chapterTitle, 'Real Numbers');
  assert.equal(realNumbersCheatsheet.subject, 'maths');
  assert.equal(realNumbersCheatsheet.isFreeSample, true);
});
