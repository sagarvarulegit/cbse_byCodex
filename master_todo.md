# Master Product TODO

Last updated: 2026-07-01

Role: Product Owner assessment

Purpose: This file is the organized product-readiness backlog for CBSE Sprint. It separates what is ready for a small student pilot from what is still missing for public beta, paid launch, and scale.

## Executive Assessment

The product is ready for a very small controlled free pilot with 2 to 5 known students, but it is not ready for public launch, paid launch, or a wider school/cohort rollout.

Current product readiness:

| Area | Readiness | PO verdict |
| --- | ---: | --- |
| Tiny free pilot with known students | 65% | Can run with guidance and feedback capture |
| Student web app for broader public beta | 35% | Needs content polish, UX polish, and quality gates |
| Core learning content quality | 30% | Coverage exists, but many chapters feel like drafts |
| Quiz and mastery loop | 55% | Good mechanics, weak quiz metadata/content quality |
| Admin review dashboard | 45% | Useful pilot review exists, but CMS is not real yet |
| Admin content management | 15% | Mostly placeholder buttons |
| Video-first learning promise | 20% | Video infrastructure exists, but most lessons are notes-only |
| Payments/subscriptions | 10% | Intentionally deferred until real usage and hardening |
| Mobile/offline | 5% | Placeholder only |
| QA/release confidence | 45% | Smoke checklist exists, CI/e2e automation still thin |

Product decision: Continue with the tiny free pilot first. Do not add payments, subscriptions, leaderboards, or wider access until real student feedback identifies and verifies the first learning-flow fixes.

## What Is Already Working

- [x] Student web app exists with home, register, login, dashboard, subjects, chapter, lesson, notes, and quiz routes.
- [x] Admin app exists with login and a pilot-review dashboard.
- [x] API exists with auth, catalog, video, progress, quiz attempts, mastery, revision missions, badges, streaks, and pilot feedback routes.
- [x] Production smoke evidence exists for API, student web, admin web, engagement events, feedback submission, and admin pilot review.
- [x] Free pilot is scoped to three chapters:
  - Real Numbers
  - Chemical Reactions and Equations
  - Two Stories about Flying
- [x] Real Numbers has 5 lesson-wise note files in the student app.
- [x] There are 76 generated chapter packs under `docs/content`.
- [x] There are 89 quiz markdown files in `apps/web/content`.
- [x] Quiz attempts are saved as immutable retries.
- [x] Quiz review locks after submit and supports retry as a new attempt.
- [x] Mastery, streak, badges, and revision mission concepts are implemented enough for pilot learning signals.
- [x] Admin pilot review shows events, active students, breakdowns, recent feedback, and highest-friction signals.
- [x] Product memory and smoke checklist now correctly defer payments until after real usage and platform hardening.
- [x] Two Stories about Flying has 5 lesson-wise note files in the student app.
- [x] Pilot chapter entry points now call out the best first action, and pilot chapter cards use lesson-level topic labels.

## Main Product Readiness Gaps

### 1. Chapter formatting is too basic

Current state:

- Chapter-pack note pages render headings, paragraphs, lists, and code blocks only.
- Most chapters feel like long markdown notes, not a polished learning product.
- Important sections such as examples, formulas, common mistakes, board tips, practice, memory boxes, and recap do not get differentiated enough.
- Students may perceive the product as "content dump with styling" rather than a modern learning experience.

Impact:

- This reduces perceived quality even when the content is useful.
- Weak students will struggle to scan and restart quickly.
- The product promise says visual, modern, clear learning, but many chapter pages still look basic.

### 2. Comic Style Recap is mostly text, not comic style

Current state:

- All 76 chapter packs include a `comic style recap` section.
- Chapter-pack notes render those recap lines as normal text.
- Only the Real Numbers lesson-wise pages have a specialized `comic recap` renderer, and only 5 app lesson files use that path.
- The current chapter-pack recap is written like:
  - `Panel 1: ...`
  - `Panel 2: ...`
  - This is not enough to feel like a comic strip.

Impact:

- The product claims "comic recap" but visually it does not deliver for most chapters.
- This is one of the most visible quality gaps and should be treated as a brand/product polish blocker before widening the pilot.

### 3. Pilot chapter completeness is uneven

Current state:

- Real Numbers is the strongest pilot chapter because it has lesson-wise notes.
- Chemical Reactions and Equations now has lesson-wise notes and a direct first-action path from the chapter page.
- Two Stories about Flying now has lesson-wise notes and consistent pilot entry guidance.
- The pilot path works technically, and the three pilot chapters now surface direct first actions and live lesson notes.

Impact:

- Students may have a good experience in Real Numbers and a weaker experience in Science or English.
- Feedback from the pilot may point to content completeness rather than product mechanics.

### 4. Quiz files look broad, but many are not assessment-ready

Current repo signal:

- 89 quiz files exist.
- They contain 445 parsed questions.
- 86 quiz files do not include explicit answer lines.
- 86 quiz files do not include explanations.
- Only 3 quiz files include topic metadata.
- The quiz parser falls back to option 1 when no answer is specified.

Impact:

- Many quizzes may score incorrectly.
- Missing explanations weakens the review/learning loop.
- Weak-topic and revision mission quality depends on topic mapping, which is sparse.
- Broad quiz coverage should not be treated as production-ready coverage yet.

### 5. Video-first promise is not fulfilled yet

Current state:

- Bunny Stream and video metadata infrastructure exist.
- Video upload/helper work exists.
- Most lesson surfaces still show notes-only or "video coming next".
- Real Numbers has useful text lesson notes, but video-first learning is not yet the visible experience.

Impact:

- The product positioning says video-first, but the pilot experience is mostly notes-first.
- This is acceptable for a tiny validation pilot only if expectations are set clearly.

### 6. Admin is not a real CMS yet

Current state:

- Admin login and pilot review exist.
- Admin page has module buttons for Subjects, Chapters, Topics, Lessons, Quizzes, and Publishing Review.
- Those buttons are not full content management workflows.

Impact:

- Content iteration still requires developer/file edits.
- The team cannot scale content production, review, or publishing through the product.

### 7. Payments and subscriptions are not launch-ready, and should stay deferred

Current state:

- Subscription model exists in Prisma.
- Access helper still uses a login-only MVP gate for premium lessons.
- Razorpay, entitlement expiry, webhook idempotency, subscription status UI, Google Play Billing, and Apple IAP are not implemented.

Product decision:

- This is not the next priority.
- Keep payments deferred until real students use the free pilot, feedback is reviewed, bugs are fixed, and the learning experience is hardened.

### 8. Mobile and offline are future work

Current state:

- `apps/mobile` is a placeholder and is not part of the active npm workspace.
- Offline downloads, local progress queue, expiry handling, and mobile playback are not implemented.

Impact:

- Do not market Android/iOS readiness yet.
- Web pilot should prove the learning loop first.

### 9. QA coverage is improving but not enough for scale

Current state:

- API has focused unit tests.
- Web has focused unit tests for quiz/mastery helpers.
- Root tests cover pilot chapter selection and registration navigation.
- Smoke checklists exist.
- There is no full Playwright or browser e2e suite for the student journey.
- CI is not clearly configured as a release gate.

Impact:

- Current confidence is enough for small manual pilot.
- It is not enough for public beta without repeated regressions.

## P0 - Before Widening Beyond Tiny Pilot

These are the highest priority items before inviting more than a handful of students.

### Content Experience Polish

- [x] Redesign chapter-pack note rendering so content does not look like plain markdown.
- [x] Add visual section treatments for:
  - learning goal
  - chapter flow
  - concept explanation
  - examples
  - formulas/reactions
  - common mistakes
  - board tips
  - short answer practice
  - mini quiz
  - comic recap
- [x] Create a proper comic recap component for chapter-pack notes.
- [x] Convert `Panel 1`, `Panel 2`, etc. into visual panels with:
  - panel number
  - scene caption
  - character/speaker label
  - speech bubble
  - simple visual treatment or illustration placeholder
  - mobile-safe layout
- [x] Apply the comic recap renderer to `/chapters/[slug]/notes`, not only lesson-wise Real Numbers pages.
- [x] Make sure comic recap does not remain just text.
- [x] Create a content style QA checklist for each chapter:
  - easy scanning
  - short sections
  - example after concept
  - memory trick
  - common mistake
  - board tip
  - practice prompt
  - recap

### Pilot Chapter Completeness

- [x] Upgrade Chemical Reactions and Equations from chapter-pack-only to lesson-wise pilot content.
- [x] Upgrade Two Stories about Flying from chapter-pack-only to lesson-wise pilot content.
- [x] Remove or fix "Science lesson notes are still being prepared" placeholders for pilot entry points.
- [x] Ensure each pilot chapter has:
  - chapter overview
  - 3 to 5 high-quality lesson notes
  - quiz with answer key
  - explanations
  - topic mapping
  - feedback form with correct chapter context
- [x] Add a "best first action" on every pilot chapter page so students know whether to read notes, open first lesson, or take quiz.

### Quiz Quality Fixes

- [ ] Add explicit `Answer:` metadata to every quiz question.
- [ ] Add `Explanation:` metadata to every quiz question.
- [ ] Add `Topic:` metadata for weak-topic tracking in pilot quizzes first.
- [ ] Add a validation script that fails when a quiz question has no answer.
- [ ] Add a validation script that warns when a quiz question has no explanation.
- [ ] Add tests to prove missing answer metadata cannot silently score option 1.
- [ ] Review all three pilot quizzes manually before the next student batch.
- [ ] Keep each retry immutable and locked after review.

Validation infra landed in the web app:

- `apps/web/lib/quiz-content-validation.ts` now exposes reusable metadata checks for tests and CLI use.
- `apps/web/scripts/validate-quiz-metadata.ts` now scans chapter quiz files and reports missing answer/explanation/topic metadata.
- `apps/web/lib/quiz-content.test.ts` now proves strict parsing rejects a missing answer instead of silently falling back to option 1.
- Pilot quizzes already pass strict metadata review; the remaining backlog is legacy non-pilot quiz migration and any manual content cleanup the validator surfaces.

### Tiny Pilot Operating Loop

- [ ] Invite only 2 to 5 real students.
- [ ] Ask them to use the deployed web app naturally for 20 to 30 minutes.
- [ ] Keep focus on the three pilot chapters only.
- [ ] Capture before/after admin pilot-review snapshots.
- [ ] Review the first 5 to 10 feedback messages before changing the roadmap.
- [ ] Pick exactly one evidence-backed fix after the pilot.
- [ ] Verify the fix locally and in production if deployed.
- [ ] Do not widen access until one real feedback-driven fix is completed.

### Trust And Polish

- [ ] Browser-check all math symbols, arrows, and special characters in lesson notes.
- [ ] Confirm mobile rendering for home, dashboard, chapter, notes, lesson, quiz, and feedback pages.
- [ ] Confirm no text overlaps in cards, buttons, quiz options, or feedback forms.
- [ ] Confirm all pilot links work for logged-out and logged-in students.
- [ ] Confirm every "premium" or "coming soon" state is honest and not confusing.
- [ ] Add friendly empty states when progress, badges, attempts, or feedback are missing.

## P1 - Before Public Beta

### Student Learning Product

- [ ] Make the first screen after login clearly study-oriented, not just account-oriented.
- [ ] Add a clear "continue where you left off" card.
- [ ] Add subject progress and chapter progress summaries.
- [ ] Add a weekly learning goal or simple study target.
- [ ] Add a "revision needed" list based on quiz attempts.
- [ ] Add weak topic links that take the student back to the right section or lesson.
- [ ] Add chapter completion logic based on notes, quiz, and video/progress events.
- [ ] Add chapter-level "Exam Ready" checklist.
- [ ] Add printable/downloadable revision notes later, after notes are polished.

### Content Depth

- [ ] Choose the first public-beta subject scope. Recommended: Mathematics + Science only.
- [ ] Complete Real Numbers to full pilot quality.
- [x] Complete Chemical Reactions and Equations to full pilot quality.
- [x] Decide whether Two Stories about Flying remains in pilot or waits for English beta.
- [ ] For each launch chapter, add:
  - lesson-wise split
  - examples
  - common mistakes
  - board tips
  - practice questions
  - quiz answers and explanations
  - topic metadata
  - recap component
- [ ] Add NCERT exercise mapping for pilot chapters.
- [ ] Add at least one board-style chapter test per launch chapter.
- [ ] Add an internal content review checklist before a chapter is marked live.

### Video Learning

- [ ] Decide the minimum video promise for public beta:
  - full video per lesson, or
  - selective video for hardest concepts only
- [ ] Attach Bunny video metadata to at least the first Real Numbers lesson.
- [ ] Add thumbnails/posters for video lessons.
- [ ] Add video completion tracking for ready videos.
- [ ] Add fallback copy that does not weaken the product when video is not attached.
- [ ] Add a repeatable video production template for intro, concept, worked example, recap, captions, and watermark.
- [ ] Keep master video files outside Git and track storage paths.

### Admin CMS

- [ ] Build a real subject/chapter/topic/lesson list view.
- [ ] Build lesson editor for title, description, access level, notes, examples, mistakes, board tips, and video ID.
- [ ] Build quiz editor for question, options, correct answer, explanation, difficulty, and topic.
- [ ] Add draft/review/publish/archive states to the admin UI.
- [ ] Add admin preview before publishing.
- [ ] Add content audit logs.
- [ ] Add basic content completeness indicators.

### Feedback And Analytics

- [ ] Show funnel health in admin:
  - dashboard views
  - chapter opens
  - lesson starts
  - lesson completions
  - quiz starts
  - quiz submissions
  - feedback submissions
- [ ] Add per-chapter drop-off hints.
- [ ] Add "latest feedback by path" view.
- [ ] Add a way to mark feedback as reviewed/fixed.
- [ ] Keep decision hints focused on learning fixes, not monetization.

### QA And Release

- [ ] Add Playwright e2e tests for:
  - register
  - login
  - dashboard
  - open pilot chapter
  - read notes
  - submit quiz
  - retry quiz
  - submit feedback
  - admin review sees feedback
- [ ] Add CI for lint, build, unit tests, and e2e smoke.
- [ ] Add content validation for:
  - missing quiz answers
  - missing quiz explanations
  - broken chapter slugs
  - missing pilot content
  - empty chapter-pack sections
- [ ] Make production smoke evidence part of each release checklist.

## P2 - Before Paid Launch

Do not start this phase until the free pilot has real usage, the first feedback-driven fixes are completed, and public beta learning quality is stable.

### Entitlements And Premium Access

- [ ] Replace login-only premium gate with real entitlement checks.
- [ ] Define free vs premium content rules from actual student usage.
- [ ] Add entitlement table as source of truth.
- [ ] Enforce expiry and renewal behavior.
- [ ] Add subscription status page for students.
- [ ] Add admin visibility into entitlement status.

### Razorpay Web Payments

- [ ] Define yearly plan and pricing.
- [ ] Implement Razorpay subscription checkout.
- [ ] Implement Razorpay webhook handling.
- [ ] Make webhook processing idempotent.
- [ ] Save provider subscription IDs and payment events.
- [ ] Add payment failure and retry states.
- [ ] Add cancellation and expiry handling.

### App Store Payments

- [ ] Plan Google Play Billing only when Android app becomes real.
- [ ] Plan Apple In-App Purchase only when iOS app becomes real.
- [ ] Keep backend entitlement source of truth across providers.

### Content Protection

- [ ] Add baked brand watermark to rendered videos.
- [ ] Add dynamic user watermark overlay for premium playback if needed.
- [ ] Keep Bunny/API secrets server-only.
- [ ] Avoid raw public MP4 links for premium lessons.
- [ ] Keep ownership evidence for scripts, source files, voice, music, SFX, fonts, and assets.

## P3 - Scale And Platform Maturity

### Mobile And Offline

- [ ] Turn `apps/mobile` into a real Flutter app.
- [ ] Mirror web theme tokens into Flutter.
- [ ] Implement mobile auth and catalog browsing.
- [ ] Implement mobile lesson playback.
- [ ] Add offline metadata model.
- [ ] Queue local progress events while offline.
- [ ] Sync progress after reconnect.
- [ ] Expire downloaded lessons when entitlement ends.
- [ ] Add mobile downloads only after web learning loop and entitlements are stable.

### Content Production Pipeline

- [ ] Create a repeatable chapter-pack to lesson-page conversion workflow.
- [ ] Create a reusable quiz quality template.
- [ ] Create a reusable comic recap template.
- [ ] Create a reusable HyperFrames video template.
- [ ] Add image/diagram generation standards for math, science, and English.
- [ ] Add reviewer checklist for subject accuracy and board relevance.
- [ ] Track content status per chapter:
  - draft
  - formatted
  - quiz-ready
  - reviewed
  - video-ready
  - pilot-ready
  - public-ready

### Architecture And Performance

- [ ] Add caching for high-traffic catalog and chapter reads.
- [ ] Add pagination/search for content as chapter count grows.
- [ ] Add stronger request validation conventions.
- [ ] Add centralized API error response shape.
- [ ] Add observability for API errors, DB latency, and video failures.
- [ ] Add rate limits for auth and feedback endpoints.
- [ ] Revisit Express vs NestJS only if feature modules become hard to maintain.

## Product No-Go List

Do not do these yet:

- [ ] Do not add payments before the free pilot produces real feedback and fixes.
- [ ] Do not widen access before one feedback-driven fix is completed.
- [ ] Do not build leaderboards, public ranks, coins, or vanity competition in V1.
- [ ] Do not market Android/iOS readiness while mobile is a placeholder.
- [ ] Do not claim video-first completeness while most lessons are notes-only.
- [ ] Do not treat broad quiz file count as quiz quality until answer/explanation validation exists.
- [ ] Do not rely on chapter-pack markdown alone as final learning UX.

## Recommended Next Sprint

Sprint goal: Make the three-chapter free pilot feel like a real product, not a technical smoke test.

1. Build proper chapter-pack formatting for `/chapters/[slug]/notes`.
2. Build a true comic recap renderer for chapter packs.
3. Fix pilot quizzes so all questions have answers, explanations, and topics.
4. Polish Chemical Reactions and Two Stories pilot pages so they do not feel weaker than Real Numbers.
5. Run the tiny real-student pilot.
6. Choose exactly one fix from real feedback.
7. Verify and deploy that fix before inviting more students.

## Definition Of Ready For Wider Pilot

- [ ] Three pilot chapters open cleanly on mobile and desktop.
- [ ] Chapter notes look intentionally formatted, not like raw markdown.
- [ ] Comic recap looks like a comic/revision strip, not text-only panels.
- [ ] All pilot quiz questions have correct answer metadata.
- [ ] All pilot quiz questions have explanations.
- [ ] Pilot feedback appears in admin with chapter, lesson, surface, path, rating, category, and timestamp.
- [ ] Admin decision hint points to a narrow fix or safe expansion.
- [ ] At least one real student feedback-driven fix has been shipped.
- [ ] No payment/subscription work blocks or distracts from the pilot.

## Definition Of Ready For Public Beta

- [ ] Public-beta chapter scope is explicitly chosen.
- [ ] Every public-beta chapter has polished notes, quizzes, answer keys, explanations, and topic mapping.
- [ ] At least one public-beta chapter has video attached and tracked.
- [ ] Admin can manage content without developer file edits for routine changes.
- [ ] Student dashboard shows meaningful progress and next actions.
- [ ] Core student flow passes automated e2e smoke.
- [ ] Production release checklist is repeatable.
- [ ] Feedback loop has real evidence from more than one student session.

## Definition Of Ready For Paid Launch

- [ ] Free/public beta shows repeated student value.
- [ ] Content quality is stable enough that students would pay.
- [ ] Entitlements are implemented.
- [ ] Payment provider is integrated and tested.
- [ ] Webhook handling is idempotent.
- [ ] Subscription status and expiry are visible.
- [ ] Premium access is enforced server-side.
- [ ] Refund/cancel/support workflow is defined.
- [ ] Mobile payment strategy is decided only if mobile app exists.
