# Gamification Mastery Ladder Design

Date: 2026-06-13
Status: Approved for implementation planning

## Goal

Build a V1 gamification system that helps Class 10 students enjoy learning while improving chapter mastery and board exam readiness. The system should reward real learning behavior, guide students after weak quiz performance, and avoid public competition in the first release.

## Product Direction

The V1 feature is a Chapter Mastery Ladder. Each chapter gets a visible Mastery Score and a learning level:

- Learner
- Skilled
- Exam Ready
- Topper Track

The primary student-facing score is the Chapter Mastery Score. It should be shown as a percentage on chapter cards and chapter pages, for example: `Real Numbers: 69% mastered`.

The feature is personal, not competitive. V1 does not include leaderboards, rank lists, or public comparison between students.

## Learning Loop

The core loop is:

1. Student watches a lesson video.
2. Student takes a chapter or topic quiz.
3. Strong quiz performance increases the Chapter Mastery Score.
4. Weak quiz performance creates a Revision Mission.
5. The student revises the weak area, retries focused questions, and can improve mastery.
6. Reaching new levels unlocks practical revision tools.

The system should make weak performance feel recoverable. A low score should lead to a clear next action, not a dead end.

## Scoring Model

V1 mastery should use video completion and quiz performance:

- Video completion contributes up to 30 percent of chapter mastery.
- Quiz performance contributes up to 70 percent of chapter mastery.

Example:

- Video completion: 90 percent
- Best quiz score: 60 percent
- Video component: 27
- Quiz component: 42
- Chapter Mastery Score: 69 percent

Suggested thresholds:

- Learner: 0 to 39 percent
- Skilled: 40 to 69 percent
- Exam Ready: 70 to 89 percent
- Topper Track: 90 to 100 percent

Mastery must not increase meaningfully from video watching alone. Video completion can show effort and unlock quiz readiness, but quiz performance is the main proof of understanding.

## Revision Missions

A Revision Mission is created when quiz performance is weak.

V1 rule:

- If a quiz score is below 60 percent, create an active Revision Mission for that chapter or weak topic area.

Mission content should include:

- Rewatch the relevant lesson or section.
- Revise notes, formula sheet, or common mistakes.
- Retry a focused question set.

Completing a mission should not directly inflate mastery. Mastery should improve after the student retries questions and shows stronger performance.

## Rewards

Rewards should help learning rather than act as decoration only.

Suggested unlocks:

- Skilled: quick revision notes
- Exam Ready: board-style practice set
- Topper Track: challenge questions and topper tips

Small celebration moments are useful when a student reaches a new level, but the main reward should be extra learning utility.

## Backend Design

The repo already has `ProgressEvent`, and gamification should be built through event aggregation rather than ad hoc counters inside request handlers.

Core backend concepts:

- `ProgressEvent`: raw learning events such as `video_checkpoint`, `quiz_attempt`, and `revision_mission_completed`.
- `QuizAttempt`: score, total questions, correct answers, weak topic tags, and attempt number.
- `ChapterMastery`: one row per student and chapter with `masteryScore`, `level`, `videoCompletionPercent`, `bestQuizScore`, and `lastActivityAt`.
- `RevisionMission`: one row per active or completed mission with chapter/topic scope, reason, status, and recommended actions.

The aggregation service should calculate mastery from raw events and quiz attempts. This keeps the scoring model adjustable later without losing history.

## API And Data Flow

V1 backend flow:

1. Existing video progress endpoint records video events.
2. New quiz attempt endpoint records quiz score and weak topic metadata.
3. Mastery aggregation updates `ChapterMastery`.
4. If quiz score is below the threshold, the service creates or refreshes a `RevisionMission`.
5. Student dashboard reads `ChapterMastery` and active missions.
6. Chapter page shows mastery details and the next recommended action.

High-traffic reads should use cached or aggregated records instead of recalculating from raw progress events every time.

## Student Experience

Dashboard chapter card should show:

```text
Real Numbers
Mastery Score: 69%
Level: Skilled
Next Target: Exam Ready at 70%

Video: 90% complete
Best Quiz: 60%
Action: Take 5-question retry mission
```

Student-facing surfaces:

- Dashboard summary with chapter mastery and active missions.
- Chapter page with mastery score, level, video completion, best quiz score, and next action.
- Quiz result screen with either level progress or a generated Revision Mission.
- Unlock area for revision notes, board practice, and challenge sets.

The tone should be encouraging and exam-focused. The student should understand what to do next within a few seconds.

## Out Of Scope For V1

- Public leaderboards
- Class rank
- Coins, shops, avatars, or cosmetic rewards
- Predicted board marks
- Full topic-level mastery dashboard
- Parent dashboard gamification analytics

These may be added later after the chapter mastery loop proves useful.

## Safeguards

- Do not let passive watching alone produce high mastery.
- Do not let repeated low-effort retries inflate mastery.
- Keep scoring recalculable from raw events.
- Keep the V1 experience personal and non-comparative.
- Make every failure state point to a useful revision action.

## Verification Plan

Implementation should include:

- Unit tests for mastery score and level calculation.
- API tests for quiz attempt submission.
- API tests for Revision Mission creation after low quiz scores.
- UI checks for dashboard states: no activity, Learner, Skilled, Exam Ready, active mission.
- Manual learning flow: watch video, submit quiz, update mastery, create mission if needed, retry, unlock revision tool.

## Open Implementation Notes

- The first implementation plan should confirm whether chapter quizzes are stored in Prisma, markdown, or both.
- The first implementation plan should decide whether `ChapterMastery` updates synchronously after quiz submission or through a small service function that can later move to a background job.
- The first implementation plan should map existing chapter progress UI to the new mastery model without breaking current static chapter progress values.
