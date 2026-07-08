---
type: ReferenceRegister
title: MVP Requirements
description: Minimum Viable Product requirements for catalog, video, notes, progress, and administrative pilot reviews.
tags: ['mvp', 'requirements', 'scope']
timestamp: 2026-07-08T12:00:00Z
---

# MVP Requirements

## Goal

Launch a focused CBSE Class 10 learning MVP for Mathematics and Science with video lessons, notes, quizzes, subscriptions, progress tracking, streaks, dark mode, and mobile-first offline access planning.

## MVP Subjects

- Mathematics
- Science

## Pilot Chapters

- Mathematics: Real Numbers
- Science: Chemical Reactions and Equations

## User Roles

### Student

- Sign up and log in.
- Browse free and premium lessons.
- Watch lesson videos.
- Read notes.
- Attempt quizzes.
- Track progress and mastery.
- Maintain daily study streaks.
- Download eligible lessons on mobile.
- Manage subscription status.

### Admin

- Manage subjects, chapters, topics, and lessons.
- Upload videos or attach Bunny Stream video IDs.
- Add notes, examples, formulas, and diagrams.
- Create quizzes and questions.
- Mark content as free or premium.
- View basic student engagement analytics.

### Teacher/Reviewer

- Review lesson notes.
- Review quiz questions.
- Check chapter completeness.
- Approve content for publishing.

## Student Screens

### Home

- Continue learning card.
- Recommended next lesson.
- Study streak.
- Subject progress.
- Free starter content.

### Subject Page

- Subject overview.
- Chapter list.
- Progress per chapter.
- Locked/unlocked state.

### Chapter Page

- Chapter overview.
- Topic list.
- Mastery percentage.
- Chapter test.
- Revision summary.

### Lesson Page

- Video player.
- Notes section.
- Key formulas or definitions.
- Solved examples.
- Practice questions.
- Quiz CTA.
- Download button for mobile users with permission.

### Quiz Page

- Question view.
- Timer optional for chapter tests.
- Instant feedback for practice quizzes.
- Result summary.
- Weak topic suggestions.

### Dashboard

- Overall progress.
- Subject progress.
- Chapter mastery.
- Quiz score trend.
- Weak topics.
- Study time.
- Streak status.
- Badges earned.

### Subscription Page

- Free vs premium comparison.
- Yearly plan.
- Payment status.
- Renewal/expiry date.
- Platform-specific payment handling.

### Downloads

- Downloaded lessons.
- Expiry state.
- Storage usage.
- Delete download option.
- Sync status.

### Settings

- Profile.
- Theme: system, light, dark.
- Notification preferences.
- Account and subscription status.

## Admin Screens

### Admin Dashboard

- Content counts.
- Draft lessons.
- Published lessons.
- Recent quiz attempts summary.
- Video processing status.

### Content Manager

- Subjects.
- Chapters.
- Topics.
- Lessons.
- Publishing status.

### Lesson Editor

- Title and description.
- Free/premium flag.
- Bunny Stream library/video reference.
- Notes editor.
- Key points.
- Examples.
- Practice questions.
- Quiz association.

### Quiz Editor

- Quiz metadata.
- Questions.
- Options.
- Correct answer.
- Explanation.
- Difficulty.
- Topic mapping.

## Content Requirements Per Pilot Chapter

Each pilot chapter should include:

- 5-8 topics.
- 1 video per topic.
- Notes per topic.
- 10-20 quiz questions per topic.
- 1 chapter test.
- NCERT exercise mapping.
- Revision summary.

## Free Content Rules

Free content should include:

- First lesson of each pilot chapter.
- Selected notes preview.
- Limited quiz attempts.
- Dashboard preview.

Premium content should include:

- Full videos.
- Full notes.
- All quizzes.
- Chapter tests.
- Offline downloads.
- Full mastery dashboard.

## Subscription Requirements

- One-year subscription plan.
- Web payments through Razorpay.
- Android subscriptions through Google Play Billing.
- iOS subscriptions through Apple In-App Purchase.
- Backend entitlement should be synced from payment webhooks.
- Access should end when entitlement expires.

## Progress Requirements

Track:

- Lesson started.
- Video progress percentage.
- Video completed.
- Notes viewed.
- Quiz attempted.
- Quiz score.
- Practice accuracy.
- Chapter test score.
- Revision completed.

## Mastery Requirements

Mastery should be calculated for:

- Topic.
- Chapter.
- Subject.
- Student overall course.

Initial mastery formula:

```text
30% video completion
15% notes completion
30% quiz score
15% practice accuracy
10% revision freshness
```

## Gamification Requirements

- Award XP for meaningful learning actions.
- Track daily study streaks.
- Award badges for chapter completion and strong quiz performance.
- Allow one streak recovery token per month.
- Avoid leaderboard in MVP unless later validated.

## Offline Requirements

Mobile MVP should prepare for offline access later; start with streaming and token-authenticated playback before adding DRM downloads.

Required planning support:

- Offline-downloadable lesson metadata.
- Download entitlement check.
- Local progress event queue.
- Sync after reconnect.
- Download expiry handling.

## Non-Functional Requirements

- Fast lesson page load.
- Adaptive video streaming.
- Secure premium content URLs.
- Dark mode support.
- Mobile-first UI.
- Accessible color contrast.
- Audit logs for admin publishing actions.
- Idempotent payment webhook handling.
