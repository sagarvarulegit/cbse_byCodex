# Web Component Library (@cbse/web/components)

## Overview
Reusable UI component system and interactive learning widgets for the ChapterReady web platform. Implements a neo-brutalist warm-paper aesthetic with WCAG AA compliant contrast, interactive physics simulations, Socratic AI coaching widgets, dynamic anti-piracy PDF print formatting, and mobile bottom navigation.

## Interface
- Core Navigation & Identity:
  - [`ClientStudentTopbar.tsx`](ClientStudentTopbar.tsx), [`StudentTopbar.tsx`](StudentTopbar.tsx): Main authenticated top bar with user menu and breadcrumbs
  - [`StudentTopbarNav.tsx`](StudentTopbarNav.tsx): Navigation links (Dashboard, Subjects, Question Bank, Formula Sheets, Quizzes)
  - [`MobileBottomNav.tsx`](MobileBottomNav.tsx): 5-tab thumb-friendly bottom navigation bar for mobile PWA/TWA
  - [`BrandLockup.tsx`](BrandLockup.tsx): Responsive ChapterReady logo and brand marks
  - [`AuthAwareCTA.tsx`](AuthAwareCTA.tsx): Context-aware call-to-action cards adapting to authentication state
  - [`LogoutButton.tsx`](LogoutButton.tsx): Student sign-out trigger with local session clearing
- Interactive Learning & Simulations:
  - [`TaraWidget.tsx`](TaraWidget.tsx): Floating and full-screen AI tutor chat drawer with Socratic guidance, report flagging, and voice toggle
  - [`InteractiveOpticsViewer.tsx`](InteractiveOpticsViewer.tsx): SVG-based interactive ray tracer for concave/convex lenses and mirrors (NCERT Tables 9.1 & 9.2)
  - [`ChemicalEquationBalancer.tsx`](ChemicalEquationBalancer.tsx): Step-by-step chemical equation balancing workspace with atom counters
  - [`FormulaCheatsheetViewer.tsx`](FormulaCheatsheetViewer.tsx): High-density formula vault viewer with KaTeX rendering and print licensing
  - [`ActivityDiagramViewer.tsx`](ActivityDiagramViewer.tsx), [`ActivityIllustration.tsx`](ActivityIllustration.tsx): NCERT laboratory activity walk-throughs and SVG diagrams
  - [`AICoachShowcase.tsx`](AICoachShowcase.tsx), [`AiAnswerEvaluatorModal.tsx`](AiAnswerEvaluatorModal.tsx): AI written answer evaluator modal with step-marking criteria
- Assessment & Exam Practice:
  - [`ExamPaperRunner.tsx`](ExamPaperRunner.tsx): Timed mock exam paper runner with question palette and auto-save
  - [`ExamPaperViewer.tsx`](ExamPaperViewer.tsx): Full question paper view with marking schemes
  - [`PrintableExamPaper.tsx`](PrintableExamPaper.tsx): Break-safe A4 print template with anti-piracy header and diagonal watermark
  - [`MarkingSchemeRubric.tsx`](MarkingSchemeRubric.tsx): CBSE official step-marking rubrics and value points
  - [`ChapterPyqDrill.tsx`](ChapterPyqDrill.tsx): Previous year question (PYQ) drill ladder with Socratic Tara hints
  - [`BoardReadinessGauge.tsx`](BoardReadinessGauge.tsx), [`BoardReadinessPredictor.tsx`](BoardReadinessPredictor.tsx): Syllabus completion gauges
- Subdirectories:
  - `dashboard/`: Student progress widgets and chapter mastery cards
  - `games/`: Educational mini-games (Chemical Balancer, Formula Rush, Sci-Wordle)
  - `parent-summary/`: Weekly progress card and WhatsApp digest generator
  - `seo/`: Structured data, Schema.org `QAPage` JSON-LD, and Google Analytics integration
  - `virtual-lab/`: Three.js / Canvas 3D experiment simulations and apparatus data

## Invariants
- Typography and contrast must meet WCAG AA standards: dark orange `#d26b16` for headings (3.21:1) and deep russet `#a84a08` for formulas and small text (5.16:1) against cream paper `#f7f2e7`.
- `PrintableExamPaper.tsx`, `FormulaCheatsheetViewer.tsx`, and `ActivityDiagramViewer.tsx` must embed the student email and name as a diagonal forensic watermark when printing.
- `TaraWidget.tsx` must wipe in-memory chat state immediately on logout or user switch (`session?.id` keying) to prevent session data leakage between students.

## Side Effects
- Invokes `window.print()` for mock exam papers and formula vault sheets.
- Dispatches and listens for `cbse:auth-change` custom DOM events.
- Writes student interaction metrics to Google Analytics (`trackAnalyticsEvent`).
- Reads and updates browser `localStorage` for offline session caches.

## Verification
- Run: `npx tsc --noEmit -p apps/web`
