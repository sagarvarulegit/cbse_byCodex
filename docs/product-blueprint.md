---
type: ReferenceRegister
title: Product Blueprint
description: Platform specification for the CBSE learning portal, outlining catalog, engagement, and gamification milestones.
tags: ['product', 'blueprint', 'roadmap']
timestamp: 2026-07-08T12:00:00Z
---

# CBSE Class 10 Learning Portal Blueprint

## Product Scope

Build an online learning portal for CBSE Class 10 students with video-first lessons, text notes, quizzes, progress tracking, gamification, paid yearly subscriptions, free starter content, offline mobile downloads, and dark mode.

Primary subjects for the first release:

- Mathematics
- Science

## Recommended Tech Stack

### Client Apps

- Mobile: Flutter for Android and iOS.
- Web: Next.js.
- Admin CMS: Next.js admin dashboard.
- Shared design system: Flutter theme tokens mirrored with CSS variables for web.

### Backend

- API: NestJS or FastAPI.
- Database: PostgreSQL.
- Cache/session support: Redis.
- Background jobs: BullMQ if using NestJS, Celery/RQ if using FastAPI.
- Object storage: S3-compatible storage for notes, thumbnails, PDFs, and generated assets.
- Search: PostgreSQL full-text search initially; Typesense/Meilisearch later if needed.

### Video

Recommended MVP choice: Bunny Stream.

Use Bunny Stream for:

- Upload ingestion
- Free transcoding for processed lesson videos
- HLS playback through Bunny's video CDN
- Token-authenticated playback for premium lessons
- Low-cost bandwidth and storage while usage is early-stage

Keep Supabase/Postgres as metadata only. Store the Bunny library ID, video ID, playback URL, embed URL, thumbnail URL, processing status, and duration in the `videos` table.

Scale-up alternatives: Mux Video for stronger video analytics and developer tooling, or AWS S3/MediaConvert/CloudFront when the team can operate custom video infrastructure. Avoid DRM in the MVP unless content licensing requires it.

### Payments

- Web: Razorpay Subscriptions for India-first yearly plans.
- Android: Google Play Billing for subscriptions sold inside the Android app.
- iOS: Apple In-App Purchase subscriptions for subscriptions sold inside the iOS app.
- Backend source of truth: entitlement table synced from Razorpay, Apple, and Google webhooks.

## Platform Architecture

```text
Flutter App / Next.js Web
        |
        v
API Gateway / Backend API
        |
        +-- Auth and user accounts
        +-- Course catalog and lesson metadata
        +-- Subscription entitlement checks
        +-- Quiz and progress APIs
        +-- Offline download authorization
        |
        +-- PostgreSQL
        +-- Redis
        +-- Background workers
        +-- Object storage
        |
        +-- Bunny Stream
        +-- Razorpay / Apple IAP / Google Play Billing
```

## CBSE Content Model

Structure the product around the actual NCERT textbook hierarchy.

```text
Class
  Subject
    Chapter
      Topic
        Lesson
          Video
          Notes
          Examples
          Practice Questions
          Quiz
          Revision
```

### Example: Mathematics

```text
Class 10
  Mathematics
    Real Numbers
      Fundamental Theorem of Arithmetic
        Concept video
        Whiteboard proof/explanation
        Solved examples
        NCERT exercise support
        Topic quiz
```

Maths lessons should emphasize:

- Concept introduction
- Formula/theorem explanation
- Step-by-step solved examples
- Common mistakes
- NCERT exercise mapping
- Timed practice
- Board-style questions

### Example: Science

```text
Class 10
  Science
    Chemical Reactions and Equations
      Types of Chemical Reactions
        Animated explainer
        Experiment/activity explanation
        Key definitions
        Diagram or reaction summary
        Topic quiz
```

Science lessons should emphasize:

- Visual explanation
- Diagrams and animations
- Activities/experiments
- Definitions and key terms
- Short-answer practice
- Application-based questions

## Class 10 NCERT Chapter Outline

### Mathematics

- Real Numbers
- Polynomials
- Pair of Linear Equations in Two Variables
- Quadratic Equations
- Arithmetic Progressions
- Triangles
- Coordinate Geometry
- Introduction to Trigonometry
- Some Applications of Trigonometry
- Circles
- Areas Related to Circles
- Surface Areas and Volumes
- Statistics
- Probability

### Science

- Chemical Reactions and Equations
- Acids, Bases and Salts
- Metals and Non-metals
- Carbon and its Compounds
- Life Processes
- Control and Coordination
- How do Organisms Reproduce?
- Heredity
- Light - Reflection and Refraction
- The Human Eye and the Colourful World
- Electricity
- Magnetic Effects of Electric Current
- Our Environment

## Lesson Page Design

Each lesson should contain:

- Short intro and learning objective
- Main video
- Download button if offline access is allowed
- Text notes
- Key formulas/definitions
- Solved examples
- Practice block
- Quiz
- Related NCERT exercise links
- Next recommended lesson

## Notes Organization

Each note should be structured as:

- Concept summary
- Key terms
- Important formulas or reactions
- Diagrams where applicable
- Solved examples
- Common mistakes
- Quick revision bullets
- Board exam tips

Avoid long textbook-style notes. Keep notes scannable and tied to the video lesson.

## Quiz and Mastery Model

Track mastery at topic, chapter, subject, and full-course level.

Inputs:

- Video completion percentage
- Notes read
- Quiz score
- Practice accuracy
- Re-attempt improvement
- Time since last revision
- Board-style question performance

Example mastery formula:

```text
mastery =
  30% video completion +
  15% notes completion +
  30% quiz score +
  15% practice accuracy +
  10% revision freshness
```

Mastery labels:

- 0-39: Needs work
- 40-69: Improving
- 70-84: Good
- 85-100: Strong

## Student Dashboard

Dashboard widgets:

- Current study streak
- Weekly study time
- Subject progress
- Chapter mastery
- Weak topics
- Upcoming revision
- Quiz score trend
- Completed lessons
- Downloaded offline lessons
- Recommended next lesson

## Gamification

Core mechanics:

- Daily study streak
- XP for videos, quizzes, notes, and revisions
- Badges for chapter completion
- Weekly goals
- Recovery token for one missed day per month
- Streak freeze as a reward

Keep gamification academic. Rewards should encourage consistent study, not random engagement.

## Offline Access

Offline should be mobile-first.

Supported offline items:

- Premium videos with token-authenticated playback; DRM downloads can come later
- Notes
- Quiz questions
- Lesson metadata
- Progress events queued locally

Sync behavior:

- Store local progress events.
- Sync when internet returns.
- Resolve duplicate events idempotently.
- Expire downloaded videos when subscription ends or license expires.

## Dark Mode

Dark mode should be a first-class theme, not an afterthought.

Rules:

- Use high contrast for math formulas.
- Avoid pure black for large surfaces.
- Keep diagrams readable in both themes.
- Let users choose system, light, or dark mode.

## Admin CMS

Admin roles:

- Super admin
- Content manager
- Teacher/reviewer
- Support

Admin features:

- Manage subjects, chapters, topics, and lessons
- Upload and publish videos
- Add notes and formulas
- Add quizzes and solutions
- Mark content as free or premium
- Preview lesson page
- View video analytics
- Review student progress aggregates

## Suggested Database Entities

- users
- user_profiles
- subjects
- chapters
- topics
- lessons
- videos
- notes
- quizzes
- quiz_questions
- quiz_attempts
- practice_questions
- subscriptions
- entitlements
- payments
- progress_events
- lesson_progress
- topic_mastery
- streaks
- badges
- offline_downloads

## MVP Roadmap

### Phase 1: Foundation

- Auth
- Course catalog
- Subject/chapter/topic/lesson CMS
- Video upload and playback
- Free vs premium content gating
- Notes
- Basic quizzes

### Phase 2: Monetization

- Razorpay web subscription
- Apple and Google subscription support
- Webhook-based entitlement sync
- Subscription expiry and renewal handling

### Phase 3: Learning Intelligence

- Progress dashboard
- Mastery scoring
- Weak-topic recommendations
- Quiz analytics

### Phase 4: Engagement

- Daily streaks
- XP and badges
- Weekly study goals
- Notifications

### Phase 5: Offline

- Mobile lesson downloads
- Offline notes and quizzes
- Token-authenticated streaming first; DRM video download later if needed
- Progress sync after reconnect

## Live Product Capabilities & Milestones (2026)

- **10-Section Intent-First Landing Page**: Goal selector ("Learn a Chapter", "Practice Questions", "Prepare for Boards"), 5-step method, and interactive explore grid.
- **7-Subject Board Exam Mock Series (Milestone 2 & 3)**: Deterministic 5-paper assembly with official CBSE layouts for Maths Standard (041), Maths Basic (241), Science (086), Social Science (087), English (184), Hindi Course A (002), and Hindi Course B (085).
- **CBSE Step-Marking Rubrics (Milestone 2)**: Exact step-wise half-mark allocation breakdown and examiner deduction rules.
- **Exemplar HOTS Arena & PYQ Drill Ladders (Milestone 3)**: High-order thinking skills question bank from NCERT Exemplar and chapter-wise authentic previous year board questions tagged by year and set.
- **Grounded AI Snap & Grade Written Evaluator (Milestone 4)**: Multimodal/text answer grading against official CBSE marking schemes with formula matching and constructive feedback.
- **27-Chapter Formula & Reaction Cheatsheets**: Complete printable and interactive summary sheets for all Class 10 Maths and Science chapters.
- **Fun&Games Arcade**: 3-minute active recall power breaks featuring Formula Rush (60s Blitz, 3-Lives Survival, Topic Focus) with Web Audio sound effects.
- **Tara AI Coach**: Socratic RAG-powered tutor with pgvector retrieval and strict NCERT single-source grounding.
- **Knowledge Base Pipeline (`cbse_KB`)**: Clean extraction pipelines, PDF parsers, and automated dataset quality gates.

