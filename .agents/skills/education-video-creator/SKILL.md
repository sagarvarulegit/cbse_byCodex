---
name: education-video-creator
description: Create source-faithful educational video concepts, scripts, storyboards, narration, shot lists, animation briefs, reviews, and production plans for YouTube Shorts and longer lessons. Use when turning a textbook topic, difficult concept, activity, figure, worked example, or existing notes into an easy-to-understand educational video; studying or improving an educational video's pedagogy; or preparing a HyperFrames, faceless-explainer, Remotion, Gemini HTML, or editor-ready handoff. For CBSE/NCERT work, preserve textbook scope, numbering, examples, figures, activities, questions, and mechanisms.
---

# Education Video Creator

Create intuition-first educational videos without trading away source accuracy. Make the learner see the causal mechanism before naming it formally, then connect the mental model back to the exact source.

## Non-negotiable rules

- Treat the current textbook or supplied primary source as authoritative.
- Teach one core idea per Short and one coherent concept chain per longer segment.
- Preserve the source's topic numbering, order, figures, activities, examples, units, safety notes, and intended meaning.
- Distinguish three layers explicitly: `source fact`, `teaching model`, and `creative decoration`.
- State where an analogy stops matching reality. Never let a visual metaphor become a false scientific claim.
- Show mechanisms, not only outcomes. Do not use animation to hide a missing causal step.
- Keep country-, board-, session-, and version-specific values tied to their source.
- Use characters, humour, suspense, gamification, and failed attempts only when they clarify the concept.
- End with retrieval: ask the learner to predict, explain, label, compare, or solve something before showing the answer.

## Load project evidence first

For CBSE work in this repository, read these sources before authoring:

1. `../../../NOTES_GUIDELINES_STANDARDS.md`.
2. The chapter's current NCERT textbook PDF and source-fidelity tracker.
3. The exact lesson markdown, activity/figure markers, and catalog entry being adapted.
4. `../../../docs/project-memory/rendering-and-media.md` for current video, figure, accessibility, and delivery decisions.

Do not claim textbook alignment when the primary source or exact page evidence has not been checked. Keep platform additions visibly separate from textbook content.

When implementation is requested, also load the matching production skill. Use `hyperframes` first for HyperFrames work, then the smallest applicable `faceless-explainer`, `general-video`, animation, CLI, and media skills. This skill owns pedagogy and source fidelity; production skills own their runtime and tooling contracts.

## Choose the task mode

Use the smallest mode that satisfies the request:

- **Analyze**: inspect an existing video's frames, captions, narration structure, visual grammar, pacing, and causal chain. Separate observation from inference. Use [review-rubric.md](references/review-rubric.md).
- **Concept**: produce the learning contract, source map, mental model, and story approach without a full script.
- **Script**: produce narration, on-screen text, and a timed beat sheet.
- **Storyboard**: add shot composition, motion, transitions, source anchors, accessibility, and accuracy notes.
- **Produce**: implement the approved storyboard with the relevant video stack, verify representative frames and timing, and integrate only within the user's requested scope.
- **Revise**: diagnose the exact learning or production weakness, preserve working material, and change only the beats that fail.

## Core workflow

### 1. Build the source-fidelity map

Record:

- Exact source, edition/session, chapter, section number, page, figure/activity/example number, and equation where available.
- Facts and mechanisms the learner must leave with.
- Details that may be compressed but not contradicted.
- Misconceptions the video must prevent.
- Prerequisite ideas and the intended follow-up question or assessment.
- Values or wording that are context-specific.

If any essential evidence is missing, label it `unverified` and avoid presenting it as textbook-aligned.

### 2. Define the learning contract

Write one sentence in this form:

> After watching, the learner can explain **[mechanism or relationship]** using **[observable evidence or representation]**, and can answer **[one retrieval task]**.

Then write:

- **Core transformation:** `Before -> cause -> after`.
- **Sticky sentence:** the shortest accurate line worth remembering.
- **Misconception boundary:** what the learner must not infer.

### 3. Choose a truthful mental model

Prefer a model that maps visible motion, scale, colour, shape, position, or quantity to the real relationship. Define the mapping before scripting.

Example:

```text
Visual pulse direction -> alternating field direction
Tighter wave spacing -> higher frequency
Pan glow -> heat generated in the cookware
```

Use [story-patterns.md](references/story-patterns.md) to select a narrative pattern. Do not force a failed prototype, character, or microscopic zoom when the concept does not support it.

### 4. Construct the causal beat chain

Use only the beats the concept needs:

1. Concrete surprise or relatable problem.
2. Learner prediction.
3. Visible action at human scale.
4. Zoom or transformation that reveals the invisible cause.
5. A plausible incomplete model or failed solution.
6. The missing insight.
7. Formal textbook term, notation, diagram, or equation.
8. Limitation, exception, or safety boundary.
9. Return to the opening situation.
10. Retrieval prompt and concise payoff.

Make each beat answer the question raised by the previous beat. Remove any beat that exists only to create motion.

### 5. Write visuals and narration together

- Give each shot one learning job and one primary visual change.
- Make the visual carry the new information; use narration to explain the relationship.
- Keep on-screen text to short phrases, labels, values, or equations. Do not display narration as a paragraph.
- Introduce labels at the moment their objects become relevant.
- Reuse a stable visual grammar across the whole video.
- Keep spatial orientation and object identity continuous across cuts.
- Show a wrong or incomplete model long enough to understand why it fails, then visibly replace it.
- Normalize spoken formulas and technical terms separately from student-facing caption text.

Use the storyboard and ledger structures in [production-templates.md](references/production-templates.md).

### 6. Run the accuracy pass

For every scientific, mathematical, historical, geographic, or literary claim:

1. Link it to the source anchor.
2. Mark whether it is literal, simplified, analogous, inferred, or decorative.
3. Check that narration, captions, motion, colour, and timing communicate the same claim.
4. Record how the model could be misunderstood.
5. Add the smallest correction that preserves clarity.

Never use words such as `exactly`, `always`, `only`, `proves`, or `because` unless the source supports that strength.

### 7. Run the learner and accessibility pass

- Use short sentences, active voice, and one idea per sentence.
- Keep essential meaning understandable without colour alone.
- Caption all narration and meaningful sound cues.
- Keep captions, formulas, figure numbers, and labels inside platform safe zones and readable on a phone.
- Avoid rapid flashing and visually noisy decorative motion.
- Preserve safety instructions before the depicted risk, not after it.
- Repeat important labels in accessible text when integrating with the platform.
- Give the learner a brief prediction or recall pause before revealing the answer.

### 8. Package the requested deliverable

Return only the layers the user requested, but keep the underlying source map and accuracy ledger available. For a full handoff, include:

1. Learning contract.
2. Source-fidelity map.
3. Mental-model mapping.
4. Timed storyboard.
5. Narration and on-screen text.
6. Visual, audio, caption, and asset direction.
7. Accuracy and misconception ledger.
8. Retrieval close and platform CTA if applicable.
9. Assumptions, unverified items, and production constraints.
10. Dedicated 9:16 cover/thumbnail for YouTube Shorts (Mandatory from Episode 05 onwards, saved in `thumbnails/` or `.thumbnails/`).

## Format guidance

- **Short (roughly 30-90 seconds):** teach one mechanism, misconception, comparison, or worked step. Prefer one continuous visual stage and a single takeaway.
- **Micro-lesson (roughly 2-5 minutes):** teach one textbook subsection with evidence, formal naming, and one application.
- **Lesson video:** preserve textbook order across sections; use chapters or segments so each causal chain remains digestible.
- **Acquisition video:** earn attention with curiosity, but send the learner to an exact live lesson route rather than implying the Short is complete coverage.

Treat duration as a constraint, not a target. Cut decoration before cutting an essential mechanism or source anchor.

## Completion standard

Do not call a video ready merely because it is attractive or technically renders. A ready educational video must be:

- Source-faithful.
- Causally understandable.
- Visually coherent.
- Accurate at the intended level of simplification.
- Captioned and readable.
- Honest about analogy limits.
- Closed with active recall.
- Accompanied by a dedicated 9:16 vertical thumbnail/cover (mandatory for Shorts from Episode 05 onwards).
- Integrated into the requested platform path when integration was requested.

Use [review-rubric.md](references/review-rubric.md) for the final review. Report what was inspected or rendered and what verification was intentionally skipped.
