# Quiz Attempt Lifecycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development for the backend summary helper and superpowers:verification-before-completion before marking complete.

**Goal:** Make quiz practice understandable and fair by separating saved attempts from review mode, showing prior attempts, and making retry start a new blank attempt.

**Architecture:** Keep each submission as an immutable `QuizAttempt`. Add a read endpoint that returns recent attempts plus latest/best summary stats. The web quiz page loads that history server-side and updates it after saving a new attempt. The client form stays locked after submit, while a separate retry action clears local selections and starts a new attempt.

## Scope

- Add a backend quiz-attempt history summary helper and tests.
- Add `GET /v1/progress/quiz-attempts?chapterSlug=...`.
- Add a Next.js proxy and server helper for quiz-attempt history.
- Render attempt history, latest score, and best score on the quiz page.
- Add a clear retry button that resets answers and creates the next saved attempt.
- Update project memory and graphify after source changes.

## Steps

- [ ] Write failing tests for quiz attempt summary mapping.
- [ ] Implement the summary helper and use it from the progress route.
- [ ] Return enough attempt metadata from the quiz save response for immediate UI updates.
- [ ] Add the web API proxy and server helper.
- [ ] Update the quiz page and `QuizScoreForm` for history plus retry.
- [ ] Run API tests, lint, build, and `graphify update .`.
- [ ] Commit, push, and deploy to Vercel QA after verification.
