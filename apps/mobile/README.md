# Mobile App

## Overview
Flutter-based mobile client application specification for Android and iOS. Planned capabilities include student authentication, curriculum catalog browsing, video playback, notes and quizzes, offline downloads, progress synchronization, and dark mode. Production mobile distribution currently utilizes the Next.js PWA + Trusted Web Activity (TWA) shell under `in.chapterready.app`.

## Interface
- Specification Modules:
  - `StudentAuth`: Student login and session token preservation
  - `CourseCatalog`: Chapter and subject navigation
  - `VideoPlayer`: High-definition video streaming and playback control
  - `NotesAndQuizzes`: Interactive quiz taking and markdown notes rendering
  - `OfflineDownloads`: Local caching for encrypted educational assets
  - `ProgressSync`: Bidirectional sync with backend progress events
  - `ThemeManager`: High-contrast cream paper and dark mode themes

## Invariants
- Offline asset downloads must enforce student entitlement checks prior to local caching.
- Progress synchronization must be idempotent to prevent duplicate streak increments when recovering from offline sessions.

## Side Effects
- Uses device local storage for cached offline notes and video bundles.
- Dispatches periodic synchronization requests to ChapterReady backend API.

## Verification
- Run: `<placeholder / pending mobile app implementation>`
