# Activity 6.2 Phototropism Animation Design

## Goal

Add a source-faithful interactive animation for NCERT Class 10 Science Activity 6.2 under `6.2.2 Movement Due to Growth`. The animation must help students observe that shoots grow towards light, roots grow away from light, and only new growth changes direction after the flask is turned.

This first delivery covers the Activity 6.2 experiment and the Figure 6.5 apparatus. Figure 6.6 geotropism is deliberately excluded and will remain a separate follow-up visual.

## Textbook Source

The visual and sequence are derived from page 107 of the 2026-27 NCERT Chapter 6 PDF at `textbooks/science/extracted/jesc106.pdf`.

The scene must preserve these source details:

- a conical flask filled with water
- wire mesh covering the flask neck
- two or three freshly germinated bean seeds on the mesh
- a cardboard box open on one side
- light entering the open side from a window
- shoots bending towards the light after two or three days
- roots growing away from the light
- the flask being turned so the old shoot points away from light
- old grown portions retaining their direction while newly growing tips respond to the new light direction

## Student Experience

The demo appears immediately below the `Activity 6.2 and Figures 6.5-6.6` heading in the plant-coordination lesson.

The animation uses five stages:

1. **Set up:** Show and label the cardboard box, window/light, conical flask, water, wire mesh, germinated seeds, shoots, and roots.
2. **Wait two or three days:** Advance time and grow shoots towards the window while roots grow away from the light.
3. **Turn the flask:** Rotate the flask and its existing plant growth so the old shoots face away from light and the old roots face towards it.
4. **Observe new growth:** Keep old portions fixed and curve only the new shoot and root tips in response to the light.
5. **Conclude:** Explain that the direction changes in newly grown regions; old grown parts do not change their established direction.

The student can use `Start activity`, `Next stage`, and `Reset`. Starting runs the stages automatically. `Next stage` lets the student inspect the experiment one observation at a time. The current stage is always accompanied by a short teaching caption.

## Visual Design

Use a dependency-free HTML canvas inside the existing lesson demo card pattern. The canvas should echo the Figure 6.5 composition without copying the textbook image:

- cardboard box on the left and centre
- open window and yellow light beam on the right
- flask near the bottom of the box
- green shoots above the mesh and red-brown roots inside the flask
- persistent apparatus labels during the setup stage
- a visible boundary between old growth and new growth after rotation

The design must remain readable at mobile widths through the existing responsive canvas container. Colour cannot be the only cue: arrows, labels, growth-tip markers, and captions must explain direction.

## Architecture

Create a focused client component named `PlantGrowthActivityDemo.tsx`. It owns:

- the five-stage activity state
- automatic timing and manual stage controls
- canvas drawing helpers for the apparatus, plant, light, arrows, and labels
- animation-frame setup and cleanup
- accessible status text outside the canvas

Expose a small predicate such as `hasPlantGrowthActivityDemo(demoId)` so `LessonDemo.tsx` can route `activity-6-2-phototropism` without mixing Chapter 6 drawing code into the general dispatcher.

Add `[[demo:activity-6-2-phototropism]]` to `apps/web/content/control-and-coordination/lessons/04-coordination-in-plants.md` beneath the Activity 6.2 heading.

## Behaviour and Edge Cases

- `Start activity` begins from stage 1 when the demo has completed.
- `Next stage` pauses automatic playback and advances by exactly one stage.
- `Reset` returns to the complete labelled setup.
- Automatic playback stops after the conclusion.
- All animation timers and `requestAnimationFrame` callbacks are cancelled on unmount.
- If canvas drawing is unavailable, the surrounding heading, captions, controls, and conclusion still provide the essential learning content.
- The component must avoid CDN scripts, raw standalone HTML, and new runtime dependencies.

## Source-Fidelity Rules

- Use the exact textbook numbering `Activity 6.2` and section numbering `6.2.2 Movement Due to Growth`.
- Do not describe the old shoot or root as changing direction after rotation.
- Clearly distinguish the already-grown portion from the newly grown tip.
- Do not merge Figure 6.6 into this animation.
- Keep the demo next to the Activity 6.2 content rather than in the later tracker or recap.

## Verification

Add a focused source test that verifies:

- the lesson contains `[[demo:activity-6-2-phototropism]]` after the `6.2.2` heading
- `LessonDemo.tsx` routes the demo ID through the Chapter 6 component
- the component includes the required apparatus and observation vocabulary
- the conclusion distinguishes old portions from new growth
- no raw standalone HTML or external CDN dependency is introduced

Run the focused test, the existing course-content test, the web TypeScript/lint check, and the web build. After code changes, attempt `graphify update .` as required by the repository instructions, while treating the repo's known Graphify version mismatch as generated-artifact risk rather than changing unrelated source code.

## Acceptance Criteria

- Activity 6.2 renders as a live demo on the `6.2 Coordination in Plants` lesson page.
- The setup visibly contains every apparatus item named in the textbook activity.
- The first growth phase shows shoots towards light and roots away from light.
- Turning the flask preserves the direction of old growth.
- The second growth phase changes only the direction of new tips.
- Captions lead the student to the textbook conclusion.
- The focused tests and normal web verification pass.

## Out of Scope

- Figure 6.6 geotropism animation or redraw
- animations for Activities 6.1, 6.3, or 6.4
- rewriting unrelated Chapter 6 lesson content
- changing shared lesson styling unless a narrowly scoped accessibility or responsiveness fix is necessary
