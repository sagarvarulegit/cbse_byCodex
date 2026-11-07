# CBSE Learning Portal Web Application (@cbse/web)

## Overview
Next.js 14/15 web portal (`chapterready.in`) serving CBSE Class 10 students, parents, and teachers. Implements an intent-first learning workflow ("Learn a Chapter", "Practice Questions", "Prepare for Boards"), programmatic SEO question engine (1,669+ questions), Chapter Hubs with high-contrast Quick Win cards, formula cheatsheet vaults, interactive Three.js/Canvas virtual labs, and the Tara AI Socratic tutor. Also acts as the Android Trusted Web Activity (`in.chapterready.app`) shell.

## Interface
- Core Application Routes:
  - `/`: [`app/page.tsx`](app/page.tsx) - Homepage explore grid, 5-step method, and interactive showcase
  - `/dashboard`: [`app/dashboard/page.tsx`](app/dashboard/page.tsx) - Student learning dashboard
  - `/chapters/[slug]`: [`app/chapters/[slug]/page.tsx`](app/chapters/[slug]/page.tsx) - Chapter Hub with Quick Win hero cards
  - `/chapters/[slug]/notes`: [`app/chapters/[slug]/notes/page.tsx`](app/chapters/[slug]/notes/page.tsx) - Complete chapter notes with top sticky navigation
  - `/chapters/[slug]/quiz`: [`app/chapters/[slug]/quiz/page.tsx`](app/chapters/[slug]/quiz/page.tsx) - Topic-wise timed mock tests
  - `/questions`, `/questions/[slug]`: [`app/questions/page.tsx`](app/questions/page.tsx), [`app/questions/[slug]/page.tsx`](app/questions/[slug]/page.tsx) - Programmatic SEO question bank with Schema.org `QAPage` metadata
  - `/exam-papers`, `/exam-papers/[id]`: [`app/exam-papers/page.tsx`](app/exam-papers/page.tsx) - Full 80-mark CBSE board exam papers
  - `/formula-cheatsheets`: [`app/formula-cheatsheets/page.tsx`](app/formula-cheatsheets/page.tsx) - High-density printable formula sheets
  - `/tools/trig-magic-hexagon`: [`app/tools/trig-magic-hexagon/page.tsx`](app/tools/trig-magic-hexagon/page.tsx) - Trigonometric Super Hexagon interactive mnemonic
  - `/parent-summary`: [`app/parent-summary/page.tsx`](app/parent-summary/page.tsx) - Parent weekly progress digest
  - `/store`: [`app/store/page.tsx`](app/store/page.tsx) - Micro-monetization store (< ₹200 packs)
- Next.js Route Handlers:
  - `/api/auth/session`: [`app/api/auth/session/route.ts`](app/api/auth/session/route.ts) - Backward-compatible session status endpoint
  - `/api/tutor/conversations`: [`app/api/tutor/conversations/route.ts`](app/api/tutor/conversations/route.ts) - Dynamic session-isolated Tara AI chat proxy
  - `/api/exam-papers`: [`app/api/exam-papers/route.ts`](app/api/exam-papers/route.ts) - Mock exam generation and paper attempts
  - `/api/progress`: [`app/api/progress/engagement/route.ts`](app/api/progress/engagement/route.ts), [`app/api/progress/mastery/route.ts`](app/api/progress/mastery/route.ts) - Student mastery synchronization
  - `/api/feedback`: [`app/api/feedback/route.ts`](app/api/feedback/route.ts) - Student feedback submissions
- Core Libraries:
  - [`lib/use-student-session.ts`](lib/use-student-session.ts): `useStudentSession()` hook for real-time client auth synchronization
  - [`lib/auth.ts`](lib/auth.ts): Session reading, token validation, and cookie helpers
  - [`lib/analytics.ts`](lib/analytics.ts): `trackAnalyticsEvent()`
  - [`lib/twa.ts`](lib/twa.ts): Android TWA detection and `NEXT_PUBLIC_TWA_PAYMENTS_MODE` switch
  - [`lib/curriculum/`](lib/curriculum/): Official CBSE syllabus models, chapter lists, and session structures
- Child Subsystems:
  - Component Library: [UI Components](./components/README.md) - Reusable components, widgets, and simulations

## Invariants
- All student-scoped API route handlers (specifically `/api/tutor/*` and `/api/progress/*`) must declare `export const dynamic = 'force-dynamic'`, specify `cache: 'no-store'`, and return `Cache-Control: no-store, max-age=0` to guarantee student isolation.
- The student session cookie `cbse_student_session` must remain accessible to client scripts (`httpOnly: false`) to keep top bar navigation and client CTA components synced across SPA transitions.
- All 20 Board Mock Test Papers (Papers 1..5 across all subjects) must remain 100% free for all students.

## Side Effects
- Registers offline service worker (`public/sw.js`) and PWA web app manifest (`app/manifest.ts`).
- Proxies API calls to the Express backend service (`cbse_byCodex/apps/api`).
- Emits analytics events to Google Analytics 4 (`G-XEXBW2SRJB`) and Google Tag Manager (`GTM-KCPF6X5X`).

## Verification
- Run: `cd apps/web && npx tsc --noEmit -p .`
