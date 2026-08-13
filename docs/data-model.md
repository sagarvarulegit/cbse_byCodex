---
type: DataSpecification
title: Database Schema and Data Models
description: Prisma schemas, entities (Subject, Chapter, Lesson, ProgressEvent, Quiz), and relationships.
tags: ['database', 'schema', 'prisma']
timestamp: 2026-07-08T12:00:00Z
---

# Data Model

## Overview

The data model is organized around CBSE content, subscription entitlements, learning progress, quizzes, mastery, and gamification.

## Core Entities

### users

Represents the login account.

Fields:

- id
- email
- phone
- password_hash or external_auth_id
- role
- status
- created_at
- updated_at

Roles:

- student
- admin
- teacher_reviewer
- support

### user_profiles

Student profile details.

Fields:

- id
- user_id
- full_name
- class_level
- school_name
- target_exam_year
- preferred_language
- theme_preference
- created_at
- updated_at

### subjects

Fields:

- id
- class_level
- name
- slug
- description
- sort_order
- is_published

Example rows:

- Class 10, Mathematics
- Class 10, Science

### chapters

Fields:

- id
- subject_id
- title
- slug
- ncert_chapter_number
- description
- sort_order
- is_published

### topics

Fields:

- id
- chapter_id
- title
- slug
- description
- sort_order
- estimated_minutes
- is_published

### lessons

Fields:

- id
- topic_id
- title
- slug
- description
- learning_objective
- access_level
- sort_order
- estimated_minutes
- publish_status
- published_at
- created_by
- updated_by
- created_at
- updated_at

Access levels:

- free
- premium

Publish statuses:

- draft
- review
- published
- archived

### videos

Fields:

- id
- lesson_id
- provider
- provider_library_id
- provider_video_id
- playback_url
- embed_url
- duration_seconds
- thumbnail_url
- drm_required
  - default false for MVP; revisit only if paid offline downloads need DRM later
- offline_allowed
- processing_status
- created_at
- updated_at

Providers:

- bunny
- mux
- aws
- manual

### notes

Fields:

- id
- lesson_id
- title
- body_markdown
- summary_markdown
- formula_markdown
- common_mistakes_markdown
- board_tips_markdown
- created_at
- updated_at

### examples

Fields:

- id
- lesson_id
- title
- problem_markdown
- solution_markdown
- difficulty
- sort_order

### practice_questions

Fields:

- id
- lesson_id
- topic_id
- question_markdown
- answer_markdown
- explanation_markdown
- difficulty
- source_type
- sort_order

Source types:

- ncert_example
- ncert_exercise
- board_style
- custom

## Quiz Entities

### quizzes

Fields:

- id
- chapter_id
- topic_id
- lesson_id
- title
- quiz_type
- access_level
- time_limit_seconds
- passing_score_percent
- is_published
- created_at
- updated_at

Quiz types:

- topic_practice
- lesson_quiz
- chapter_test
- revision

### quiz_questions

Fields:

- id
- quiz_id
- question_markdown
- question_type
- difficulty
- explanation_markdown
- sort_order

Question types:

- single_choice
- multiple_choice
- numeric
- short_answer

### quiz_options

Fields:

- id
- quiz_question_id
- option_markdown
- is_correct
- sort_order

### quiz_attempts

Fields:

- id
- user_id
- quiz_id
- started_at
- completed_at
- score_percent
- correct_count
- total_count
- time_taken_seconds

### quiz_attempt_answers

Fields:

- id
- quiz_attempt_id
- quiz_question_id
- selected_option_ids
- typed_answer
- is_correct
- created_at

## Sample Test Paper Entities

### question_bank_questions

Curated, verifiable pool for the sample-test-paper generator (Maths 041 pilot).

Fields:

- id
- subject_slug
- bank_key (stable unique identity within subject, e.g. `maths-041-rn-hcf-lcm-mcq-1`)
- chapter_slug / unit_id / topic_id (must resolve against the Maths 041 curriculum snapshot)
- question_type (one of the `BoardQuestionType` values)
- marks (1-6, must be an allowed mark value)
- difficulty (easy | medium | hard)
- source_kind (ncert_exercise | verified_pyq | board_style)
- provenance_json (year/paperCode/questionNo/page — REQUIRED for verified_pyq)
- variants_json (array of `{variantKey, params, statement, answerKey}`; the seed's numeric variants give papers variety)
- verification_status (unverified | review | verified | rejected) — only `verified` rows can enter papers
- review_notes / verified_at

### exam_papers

A generated, immutable paper snapshot.

Fields:

- id
- user_id (generator/owner)
- subject_slug
- title / total_marks / duration_minutes / reading_time_minutes
- seed (deterministic — same seed + bank = same paper)
- layout_version (points at the sourced section layout)
- sections_json (section metadata, not the questions)
- verification_status (unverified | review | verified | rejected)
- verification_json (Gemini verdicts: per-question + paper-level)
- publish_status (draft | published | rejected) — set to published only by admin approve

### exam_paper_questions

Question-level snapshots of one generated paper.

Fields:

- id
- exam_paper_id (cascade delete)
- question_bank_id (nullable FK to the source bank row)
- section_id / question_number / question_type / marks
- statement_json / answer_key_json (snapshots so the paper survives bank changes)
- source_kind / provenance_json
- verification_status / verification_json

## Subscription and Payment Entities

### subscriptions

Fields:

- id
- user_id
- provider
- provider_customer_id
- provider_subscription_id
- plan_code
- status
- current_period_start
- current_period_end
- cancel_at_period_end
- created_at
- updated_at

Providers:

- razorpay
- apple
- google

Statuses:

- active
- trialing
- past_due
- cancelled
- expired

### entitlements

Fields:

- id
- user_id
- entitlement_type
- starts_at
- ends_at
- source_provider
- source_subscription_id
- status
- created_at
- updated_at

Entitlement types:

- class_10_full_access
- subject_access
- chapter_access

### payments

Fields:

- id
- user_id
- provider
- provider_payment_id
- amount
- currency
- status
- paid_at
- raw_event_id
- created_at

### payment_webhook_events

Fields:

- id
- provider
- event_id
- event_type
- payload_json
- processed_at
- processing_status
- created_at

Purpose:

- Make webhook processing idempotent.
- Preserve audit trail.

## Progress Entities

### progress_events

Append-only event log for learning activity.

Fields:

- id
- user_id
- event_type
- subject_id
- chapter_id
- topic_id
- lesson_id
- quiz_id
- metadata_json
- occurred_at
- received_at

Event types:

- lesson_started
- video_progressed
- video_completed
- notes_viewed
- quiz_started
- quiz_completed
- practice_completed
- revision_completed
- download_created

### lesson_progress

Materialized progress per user and lesson.

Fields:

- id
- user_id
- lesson_id
- video_progress_percent
- video_completed_at
- notes_viewed_at
- quiz_best_score_percent
- completed_at
- updated_at

### topic_mastery

Fields:

- id
- user_id
- topic_id
- mastery_percent
- video_component
- notes_component
- quiz_component
- practice_component
- revision_component
- label
- calculated_at

Labels:

- needs_work
- improving
- good
- strong

### chapter_mastery

Fields:

- id
- user_id
- chapter_id
- mastery_percent
- completed_topics_count
- total_topics_count
- best_chapter_test_score
- calculated_at

## Gamification Entities

### streaks

Fields:

- id
- user_id
- current_streak_days
- longest_streak_days
- last_activity_date
- recovery_tokens_available
- updated_at

### xp_transactions

Fields:

- id
- user_id
- source_type
- source_id
- xp_amount
- reason
- created_at

### badges

Fields:

- id
- code
- name
- description
- icon_name
- criteria_json
- is_active

### user_badges

Fields:

- id
- user_id
- badge_id
- awarded_at

## Offline Entities

### offline_downloads

Fields:

- id
- user_id
- lesson_id
- video_id
- device_id
- provider_license_id
- status
- expires_at
- downloaded_at
- last_verified_at

Statuses:

- requested
- ready
- downloaded
- expired
- revoked
- deleted

### devices

Fields:

- id
- user_id
- platform
- device_fingerprint
- app_version
- last_seen_at
- created_at

## Admin and Audit Entities

### content_audit_logs

Fields:

- id
- actor_user_id
- entity_type
- entity_id
- action
- before_json
- after_json
- created_at

Actions:

- create
- update
- submit_for_review
- approve
- publish
- archive

## Relationships Summary

- subject has many chapters.
- chapter has many topics.
- topic has many lessons.
- lesson has one or more videos, notes, examples, practice questions, and quizzes.
- user has one profile.
- user has many quiz attempts and progress events.
- user has subscription records from payment providers.
- user gets access through entitlements.
- mastery records are derived from progress events and quiz attempts.
