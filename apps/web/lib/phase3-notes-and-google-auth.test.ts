import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

function readWebFile(relPath: string) {
  return fs.readFileSync(fileURLToPath(new URL(relPath, import.meta.url)), 'utf8');
}

test('Phase 3: Chapter notes mount BiteSizedNotesController with ?view=cards toggle and WhatsApp card sharing', () => {
  const notesPage = readWebFile('../app/chapters/[slug]/notes/CompleteChapterNotesPage.tsx');
  const controller = readWebFile('../components/notes/BiteSizedNotesController.tsx');
  const chapterHub = readWebFile('../app/chapters/[slug]/page.tsx');
  const remixCss = readWebFile('../app/platform-remix.css');

  assert.match(notesPage, /BiteSizedNotesController/);
  assert.match(controller, /Bite-Sized Cards/);
  assert.match(controller, /Full Textbook View/);
  assert.match(controller, /params\.get\('view'\) === 'cards'/);
  assert.match(controller, /openWhatsAppChallenge/);
  assert.match(controller, /Jump to NCERT section card/);

  // Chapter Hub links directly to ?view=cards while keeping standard notes contract
  assert.match(chapterHub, /\/chapters\/\$\{slug\}\/notes\?view=cards/);
  assert.match(chapterHub, /Bite-Sized Concept Cards/);

  // Print CSS ensures printing always outputs all hidden cards cleanly
  assert.match(remixCss, /@media print/);
  assert.match(remixCss, /data-bite-card="hidden"/);
});

test('Phase 3: Login and Register forms wire 1-Tap GoogleSignInButton, password toggle, and live validation pills', () => {
  const googleBtn = readWebFile('../components/GoogleSignInButton.tsx');
  const loginForm = readWebFile('../app/login/LoginForm.tsx');
  const registerForm = readWebFile('../app/register/RegisterForm.tsx');
  const authActions = readWebFile('../app/auth-actions.ts');
  const authLib = readWebFile('./auth.ts');

  assert.match(googleBtn, /NEXT_PUBLIC_GOOGLE_CLIENT_ID/);
  assert.match(googleBtn, /accounts\.google\.com\/gsi\/client/);
  assert.match(googleBtn, /googleAuthAction/);
  assert.match(googleBtn, /getSafePostSignupPath/);
  assert.match(googleBtn, /cbse:auth-change/);

  assert.match(loginForm, /<GoogleSignInButton mode="login" \/>/);
  assert.match(loginForm, /auth-password-toggle/);

  assert.match(registerForm, /<GoogleSignInButton mode="register" \/>/);
  assert.match(registerForm, /auth-password-toggle/);
  assert.match(registerForm, /auth-password-rules/);

  assert.match(authActions, /export async function googleAuthAction/);
  assert.match(authLib, /\/v1\/auth\/google/);
});

test('Phase 3: /exam-papers mounts interactive GuestMockSampler for zero-signup Section-A preview', () => {
  const examPapersPage = readWebFile('../app/exam-papers/page.tsx');
  const sampler = readWebFile('../components/GuestMockSampler.tsx');

  assert.match(examPapersPage, /<GuestMockSampler \/>/);
  assert.match(sampler, /Mathematics Standard \(041\)/);
  assert.match(sampler, /Science \(086\)/);
  assert.match(sampler, /22,338/);
  assert.match(sampler, /Nitrogen dioxide \(NO₂\)/);
  assert.match(sampler, /WhatsAppChallengeBar/);
});
