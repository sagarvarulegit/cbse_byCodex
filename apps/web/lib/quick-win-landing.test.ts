import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import {
  DEFAULT_POST_AUTH_PATH,
  DEFAULT_POST_SIGNUP_PATH,
  getSafePostSignupPath,
} from './auth-redirect';
import { CHAPTER_CHEATSHEETS_DATA } from './content/cheatsheets-data';

test('Post-signup re-routing redirects new students to the Quick Win Chapter Hub', () => {
  // Empty or default post-auth path routes to /chapters/real-numbers
  assert.equal(getSafePostSignupPath(null), '/chapters/real-numbers');
  assert.equal(getSafePostSignupPath(''), '/chapters/real-numbers');
  assert.equal(getSafePostSignupPath(DEFAULT_POST_AUTH_PATH), '/chapters/real-numbers');

  // The legacy flow: Signup -> /chapters/real-numbers/notes re-routes to the chapter hub
  assert.equal(getSafePostSignupPath('/chapters/real-numbers/notes'), '/chapters/real-numbers');

  // Any other chapter notes link re-routes to its chapter hub
  assert.equal(
    getSafePostSignupPath('/chapters/chemical-reactions-and-equations/notes'),
    '/chapters/chemical-reactions-and-equations',
  );

  // Safe external checks
  assert.equal(getSafePostSignupPath('https://malicious.example'), DEFAULT_POST_SIGNUP_PATH);
});

test('Chapter hub contains the two high-contrast Quick Win hero cards and secondary notes option', () => {
  const chapterHub = fs.readFileSync(
    path.join(process.cwd(), 'app', 'chapters', '[slug]', 'page.tsx'),
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
    path.join(
      process.cwd(),
      'app',
      'chapters',
      '[slug]',
      'notes',
      'CompleteChapterNotesPage.tsx',
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
