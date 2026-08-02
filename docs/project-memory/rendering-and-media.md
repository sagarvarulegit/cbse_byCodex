---
type: ProjectMemoryTopic
title: Rendering and Media Memory
description: Durable lesson-rendering, illustration, accessibility, performance, and media-delivery learnings.
tags: ['memory', 'rendering', 'media', 'figures', 'accessibility', 'performance']
timestamp: 2026-08-01T00:00:00Z
---

# Rendering and Media Memory

Read this file for lesson rendering, activity and figure assets, accessible labels, client/server boundaries, media performance, and navigation performance.

## Lesson rendering contracts

- The student-facing visual system lives in `apps/web/app/platform-remix.css`, loaded after `globals.css` by the root layout. Keep route structure and dense lesson rendering rules in `globals.css`; use the theme layer for shared visual decisions so the complete journey stays consistent.
- The approved Study Remix palette is orange `#f3883b`, warm paper/white, and near-black ink. Shared screens use bold editorial type, tactile ink-bordered controls, asymmetric cards, subtle grid texture, and dark record-deck hero surfaces. The scoped Study Remix dashboard CSS mirrors those tokens instead of defining separate subject-brand palettes.
- Do not flatten educational meaning in pursuit of palette consistency: figure artwork, conventional science/mathematics markings, correct/incorrect feedback, warnings, and other semantic states may retain their necessary colours inside the orange/cream/ink platform frame.
- The canonical student hierarchy is Dashboard â†’ Subjects â†’ subject chapter list â†’ continuous chapter content. Subject cards and dashboard chapter shortcuts open `/chapters/<slug>/notes` directly; `/chapters/<slug>` is an optional detailed progress and rewards view, not a required learning step.
- Chapter-child routes resolve their parent with `getChapterSubjectNavigation()` and keep Dashboard, Subjects, the current subject's `<Subject> Chapters` list, and the chapter in their breadcrumbs. The content page treats the chapter as the current breadcrumb item; lesson and quiz routes link the chapter crumb back to continuous content. Breadcrumbs are the single hierarchy control and stay near the top of each learning page; the sticky top bar is reserved for branding and account actions. The logged-in CBSE Sprint brand returns to Dashboard.
- `StudentTopbar` is the shared server-rendered identity shell on Dashboard, Subjects, chapter, notes, lesson, and quiz routes. Keep account disclosure native, preserve 44px controls on mobile, and put learning hierarchy in the breadcrumb rather than duplicating it inside the account menu.
- `ReadingCompanion` is the only client boundary added for long-form reading chrome. Its student- and page-scoped `localStorage` record is a device-local convenience, not completion or mastery evidence. Initial render must not overwrite a saved place; only actual scrolling may update it. Focus mode may remove surrounding chrome but must leave notes, visible focus indicators, reduced-motion behavior, and the exit control available.
- Subject identity uses distinct CSS line motifs within the shared orange family. Shape and pattern carry the distinction so subject recognition never depends on color alone.
- Lesson-page comic recaps require exactly four unordered-list dialogue items after `## Comic recap`; plain recap paragraphs produce an empty comic grid.
- Lesson `## Answer check` sections render as native disclosure controls so practice answers are not visible before an attempt. Keep one Answer check section per supplement.
- Lesson and chapter-note pages share `apps/web/lib/lesson-inline-markup.ts` for backtick code, `**bold**`, and `*italic*`.
- Mathematics authored between single-dollar inline or double-dollar display delimiters renders through `apps/web/components/MathText.tsx` and KaTeX on lesson, continuous-notes, and quiz surfaces. Keep KaTeX's default HTML-plus-MathML accessibility output, `throwOnError: false`, root-layout stylesheet import, and horizontal overflow protection for display formulas.
- Every live Mathematics core lesson routes one grouped NCERT-matched concept schematic through `MathFigureDemo.tsx`. These are deterministic inline SVGs with numbered pins and HTML label keys; they are chapter-level simplified redraws, not textbook page crops and not a claim that every printed exercise diagram has an individual asset.
- Lesson question cards recognize the documented `**❓ QUESTIONS**` marker directly, including multipart bodies; authors do not need a synthetic `## Questions and answers` heading.
- Chapter-pack notes render through a section-aware path in `apps/web/app/chapters/[slug]/notes/page.tsx`, with helpers in `apps/web/lib/chapter-notes-rendering.ts`. Keep generated chapter-pack Markdown unchanged; normalized H2 titles route goals, flow, concept, example, formula, summary, mistakes, board tips, practice, mini quiz, and comic recap sections. Comic recap accepts `Panel N:` paragraphs or list items and degrades to readable cards when parsing is imperfect. Formula-like code lines render as dedicated cards.
- The shared lesson parser renders accessible Markdown tables and accepts both `[[demo:<id>]]` and `<ActivityIllustration demoId="<id>" />` markers. Every figure id must resolve in the illustration registry and HTML label-key registry before publication.
- Continuous chapter notes must keep `min-width: 0` on the article and nested lesson-grid boundaries. Large intrinsic illustration assets can otherwise widen the notes grid item beyond its assigned column and render underneath the sticky chapter-contents sidebar; illustration cards also remain capped at `100%` of that column.

## Static activity and figure media

- Science activity markers render through `apps/web/components/ActivityIllustration.tsx` as static NCERT-based redraws under `apps/web/public/activity-illustrations/`.
- Keep apparatus labels, activity numbering, captions, safety notes, and observations in accessible HTML instead of generated-image text. Audited figures use numbered pins on each object plus a matching legend; do not use leader-line arrows.
- Pins use percentage coordinates on an uncropped source-aspect frame so they remain attached at different viewport sizes. Unaudited figures show only an honest text legend.
- Do not show implementation-source credit in student-facing cards, and do not restore canvas lab animations for Chapters 1-4 or Activity 6.2.
- When a figure group crosses source pages, publish separate original redraw panels instead of squeezing incomplete cases into one image. A legend must never overlay or censor the diagram.
- Do not publish cropped NCERT textbook pages as student-facing figures. Chapters 9-12 use deterministic original SVG atlases for mirror/lens rays, vision defects, prism/rainbow paths, circuits/graphs, force/Fleming directions, and domestic wiring. Keep conventional symbols and geometry faithful and repeat every important label in accessible HTML.

## Code-generated lesson video

- The first lesson-video pilot is a HyperFrames `general-video` project at `videos/reaction-detectives-pilot/`. Its approved scope is Chapter 1 Activities 1.1–1.3, Figures 1.1–1.2, Section 1.1, and Section 1.1.1 through equations (1.1)–(1.2); balancing and equation (1.3) remain outside the pilot.
- Reuse Chapter 1 activity PNG masters only as contained evidence plates. Rebuild causal actions, labels, safety rails, equations, atom counts, prediction holds, and feedback as deterministic HTML/SVG so they remain readable and editable.
- The video visual system extends `apps/web/app/platform-remix.css`: warm paper, orange, near-black ink, bold system type, tactile bordered cards, and formula monospace. Do not restore the scaffold preset's cobalt, Newsreader, Hanken, or square two-colour constraints.
- HyperFrames removes the inner root's authored `data-composition-id` when mounting a sub-composition. Scene registration scripts must resolve the scoped inner root with `document.getElementById("root")` or `document.querySelector("#root")`; a combined `#root[data-composition-id="..."]` selector returns `null` and silently leaves an empty, static timeline. The pilot's `scripts/inline-frame-motion.mjs` normalizes this lookup whenever it regenerates scene motion.
- ElevenLabs is the selected narration provider. Long lesson narration must be synthesized as approved speech segments, joined with deterministic 4–6 second silence blocks, and accompanied by offset character/word timing data. Pronunciation text such as “M G” and “O two” must normalize to student-facing `Mg` and `O₂` in captions.
- Generate a short voice sample before the full paid narration request. Keep `ELEVENLABS_API_KEY` server-side and out of committed files and `NEXT_PUBLIC_` variables.

## Chapter-specific figure fidelity

- NCERT Chapter 2 Activity 2.10 and Figure 2.5 are separate visual anchors: the activity shows concentrated acid added slowly to water with stirring; Figure 2.5 is the corrosive-material warning sign.
- Figure 2.6 remains a directional `0-14` pH diagram with opposing `H+` and `OH-` concentration trends; a table alone is not a faithful substitute.
- Chapter 6 Figures 6.1-6.3 use generated platform redraws through matching markers. Figure 6.3 belongs under `6.1.2 Human Brain`, before `6.1.3 How are these tissues protected?`.
- Figure 6.4 uses the supplied sensitive-plant source and belongs under `6.2.1 Immediate Response to Stimulus`, before `6.2.2 Movement Due to Growth`.
- Activity 6.2 and Figures 6.5-6.6 remain static NCERT-based redraws. Figure 6.5 preserves the box, window, flask, water, wire mesh, bean seeds, shoots, and roots; Figure 6.6 preserves the horizontal pot, positively geotropic roots, and negatively geotropic shoot.
- The Chapter 10 `chapter-10-eye-colour-v2` illustration sheet is not an equal 2-by-2 grid. Its lower C/D divider is about 43.4% of source width and the horizontal divider about 51.9% of source height; retain those crop boundaries so panels C and D remain complete.

## Delivery assets and performance

- Chapter 1's eleven activity redraws use visually checked 1200px WebP delivery assets while retaining PNG review sources. The WebP set totals 284,702 bytes and every file is below 350 KiB. Keep the registry on WebP and retain the per-file and 4 MiB combined source-size contract; LCP and CLS still need built-server measurement.
- Chapter 1 WebP illustrations render as native `<img>` elements with 1200×675 intrinsic dimensions, asynchronous decoding, and lazy loading. Older multipanel sprite assets retain the CSS-background fallback.
- Active Science illustration atlases have WebP delivery copies while original PNGs remain review sources. The 35 active atlas files fell from 60,985,798 bytes to 4,872,566 bytes, about 92% smaller. Registry paths stay on WebP and off-screen panels stay native lazy-loaded images. Chapter 6 figure redraws follow the same source-PNG/delivery-WebP pattern.
- Static lesson media stays outside the client bundle. `LessonDemo.tsx` is the server dispatcher; `ActivityIllustration.tsx` and `StaticFigureDemo.tsx` render without hydration. Only `StepLessonDemo.tsx`, the equation workbench, and genuinely interactive demos are client islands.
- Glossary definitions use the browser's native popover behavior so long notes do not install per-term state and document listeners.
- `LessonVideoPlayer.tsx` imports `hls.js` only after confirming that the browser cannot play HLS natively. Do not restore a top-level import.
- Lesson pages still render notes and figures when the local API is offline; `apps/web/lib/lesson-video.ts` maps video-fetch failure to `not-configured`.
- Keep non-critical work out of the route shell: activities are static assets, video and quiz-history lookups stream behind `Suspense`, chapter mastery streams without blocking the overview, and `app/loading.tsx` gives immediate route-transition feedback.
- Bulk chapter grids, lesson sidebars, and dashboard chapter lists use `prefetch={false}` for whole-notes routes. Primary next/previous actions remain eligible for prefetch.
- Study Remix keeps its data read in the dashboard Server Component and passes a plain mix model into a client island. The root `StudyRemixProvider` owns only temporary timer state and renders its compact player outside `/dashboard`; on mobile it offsets above the existing lesson navigation instead of covering it.
- Study Remix album tracks and rewind cues deep-link to continuous-note lesson anchors or quizzes with `prefetch={false}`. A full refresh restores an active mix paused, while client-side chapter navigation keeps it running.

## Accessibility

- Lesson accessibility depends on the root `--accent` alias to `--primary`; without it, focus-outline and state declarations become invalid.
- Lesson routes include a visible-on-focus skip link and `aria-current="page"` on the active lesson.
- Timed diagnostics use `role="timer"` rather than an every-second live region.
- The Study Remix countdown also uses `role="timer"` without an every-second live region. Only playback state and track-title changes are announced, and record/equalizer motion respects `prefers-reduced-motion`.
