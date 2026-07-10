# Activity 6.2 Phototropism Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live, source-faithful Activity 6.2 canvas animation that shows the Figure 6.5 setup, the first phototropic response, flask rotation, and the changed direction of new growth.

**Architecture:** A focused `PlantGrowthActivityDemo` client component owns the stage state, playback controls, accessible captions, and dependency-free canvas drawing. `LessonDemo` routes one new demo ID to this component, and the Chapter 6 plant lesson embeds that ID immediately below the Activity 6.2 heading. A source-contract test locks down placement, apparatus vocabulary, routing, and the old-growth/new-growth conclusion.

**Tech Stack:** React 19, TypeScript, HTML5 Canvas, Node test runner, existing Next.js lesson demo styles

## Global Constraints

- Preserve the exact labels `Activity 6.2` and `6.2.2 Movement Due to Growth`.
- Cover Figure 6.5 apparatus and experiment only; do not merge Figure 6.6 into this animation.
- Show a conical flask, water, wire mesh, two or three germinated bean seeds, cardboard box, window/light, shoots, and roots.
- Old grown portions retain their established direction after rotation; only newly grown tips respond to the new light direction.
- Use no new runtime dependency, CDN script, raw standalone HTML, or textbook scan.
- Preserve all unrelated dirty-worktree changes.

---

## File Map

- Create `apps/web/components/PlantGrowthActivityDemo.tsx`: stage model, controls, canvas rendering, accessible status.
- Create `apps/web/lib/plant-growth-activity-demo.test.ts`: source-level integration and fidelity contract.
- Modify `apps/web/components/LessonDemo.tsx`: import, predicate routing, and component render.
- Modify `apps/web/content/control-and-coordination/lessons/04-coordination-in-plants.md`: Activity 6.2 instructions and demo marker.
- Modify `docs/project-memory.md`: durable note recording the live demo ID and fidelity rule.

### Task 1: Lock the Activity 6.2 Contract with a Failing Test

**Files:**
- Create: `apps/web/lib/plant-growth-activity-demo.test.ts`
- Inspect: `apps/web/components/LessonDemo.tsx`
- Inspect: `apps/web/content/control-and-coordination/lessons/04-coordination-in-plants.md`

**Interfaces:**
- Consumes: repository source files as UTF-8 text.
- Produces: a failing contract for `PlantGrowthActivityDemo`, `hasPlantGrowthActivityDemo(demoId)`, and `activity-6-2-phototropism`.

- [ ] **Step 1: Write the failing source-contract test**

```ts
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repoRoot = path.resolve(import.meta.dirname, '..');
const componentPath = path.join(repoRoot, 'components', 'PlantGrowthActivityDemo.tsx');
const dispatcherPath = path.join(repoRoot, 'components', 'LessonDemo.tsx');
const lessonPath = path.join(
  repoRoot,
  'content',
  'control-and-coordination',
  'lessons',
  '04-coordination-in-plants.md',
);

test('activity 6.2 phototropism demo is source-faithful and live in lesson 6.2.2', () => {
  assert.ok(fs.existsSync(componentPath), 'Expected PlantGrowthActivityDemo.tsx');

  const component = fs.readFileSync(componentPath, 'utf8');
  const dispatcher = fs.readFileSync(dispatcherPath, 'utf8');
  const lesson = fs.readFileSync(lessonPath, 'utf8');
  const sectionIndex = lesson.indexOf('## 6.2.2 Movement Due to Growth');
  const markerIndex = lesson.indexOf('[[demo:activity-6-2-phototropism]]');
  const questionsIndex = lesson.indexOf('## Questions and answers');

  assert.ok(sectionIndex >= 0, 'Expected the 6.2.2 heading');
  assert.ok(markerIndex > sectionIndex, 'Expected Activity 6.2 demo after 6.2.2');
  assert.ok(markerIndex < questionsIndex, 'Expected Activity 6.2 demo before the Questions block');
  assert.match(dispatcher, /PlantGrowthActivityDemo/);
  assert.match(dispatcher, /hasPlantGrowthActivityDemo\(demoId\)/);
  assert.match(component, /activity-6-2-phototropism/);
  assert.match(component, /conical flask/i);
  assert.match(component, /water/i);
  assert.match(component, /wire mesh/i);
  assert.match(component, /germinated bean seeds/i);
  assert.match(component, /cardboard box/i);
  assert.match(component, /window/i);
  assert.match(component, /shoots bend towards light/i);
  assert.match(component, /roots.*away from light/i);
  assert.match(component, /old grown portions retain their direction/i);
  assert.match(component, /only the new.*growth.*changes direction/i);
  assert.doesNotMatch(component, /https?:\/\//);
  assert.doesNotMatch(component, /Figure 6\.6/);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```powershell
npm.cmd test -w apps/web -- --test-name-pattern "activity 6.2 phototropism"
```

Expected: FAIL at `Expected PlantGrowthActivityDemo.tsx` because production code does not exist yet.

### Task 2: Build the Five-Stage Canvas Component

**Files:**
- Create: `apps/web/components/PlantGrowthActivityDemo.tsx`
- Test: `apps/web/lib/plant-growth-activity-demo.test.ts`

**Interfaces:**
- Consumes: `demoId: string` supplied by `LessonDemo`.
- Produces: `hasPlantGrowthActivityDemo(demoId: string): demoId is PlantGrowthActivityId` and the default React component `PlantGrowthActivityDemo({ demoId })`.

- [ ] **Step 1: Define the exact stage model and copy**

```ts
type PlantGrowthActivityId = 'activity-6-2-phototropism';
type StageId = 'setup' | 'first-growth' | 'turned' | 'new-growth' | 'conclusion';

const STAGES: Array<{ id: StageId; title: string; caption: string }> = [
  {
    id: 'setup',
    title: 'Set up the experiment',
    caption: 'Fill a conical flask with water, cover its neck with wire mesh, and place two or three freshly germinated bean seeds on the mesh. Keep it inside a cardboard box whose open side faces light from a window.',
  },
  {
    id: 'first-growth',
    title: 'Wait for two or three days',
    caption: 'The shoots bend towards light, while the roots grow away from light.',
  },
  {
    id: 'turned',
    title: 'Turn the flask',
    caption: 'Turn the flask so the old shoots point away from light and the old roots point towards light.',
  },
  {
    id: 'new-growth',
    title: 'Watch the new tips',
    caption: 'The old grown portions retain their direction. Only the new shoot and root growth changes direction in response to light.',
  },
  {
    id: 'conclusion',
    title: 'Conclusion',
    caption: 'Shoots show positive phototropism and roots show negative phototropism. The change in direction appears in newly growing regions, not in old grown parts.',
  },
];
```

- [ ] **Step 2: Implement deterministic drawing helpers**

Create helpers with these exact responsibilities and canvas-space coordinates on an `800 x 520` canvas:

```ts
const WIDTH = 800;
const HEIGHT = 520;

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function drawScene(
  ctx: CanvasRenderingContext2D,
  stageIndex: number,
  stageProgress: number,
) {
  drawBackground(ctx);
  drawCardboardBox(ctx, 55, 70, 610, 390);
  drawWindowAndLight(ctx, 630, 95, 150, 185);
  drawFlask(ctx, 315, 305, stageIndex >= 2 ? Math.PI : 0);
  drawSeedsAndGrowth(ctx, stageIndex, clamp(stageProgress));
  drawDirectionArrows(ctx, stageIndex);
  drawApparatusLabels(ctx, stageIndex);
}
```

`drawCardboardBox` draws the three visible cardboard planes and an open right side. `drawWindowAndLight` draws a four-pane window, a yellow translucent beam, and a labelled arrow pointing left. `drawFlask` draws the conical glass outline, blue water, a cross-hatched wire mesh, and three brown bean seeds. `drawSeedsAndGrowth` draws green shoots above the mesh and red-brown roots inside the flask. During `new-growth`, draw old portions with a solid darker stroke and new tips with a brighter dashed boundary marker before curving them towards/away from light. `drawDirectionArrows` labels `towards light` and `away from light`. `drawApparatusLabels` uses leader lines for `cardboard box`, `window`, `conical flask`, `water`, `wire mesh`, and `germinated bean seeds`.

- [ ] **Step 3: Implement playback and manual stage controls**

Use one animation frame loop. Increase local stage progress at `0.32` per second. When progress reaches `1`, advance to the next stage; stop after `conclusion`. `Next stage` must set `playing` to false and advance exactly once. `Reset` must restore stage index `0`, progress `0`, and `playing` false. Cancel the frame on unmount.

Render the existing card structure:

```tsx
<section className="lesson-demo-card chemical-lab-demo">
  <div className="lesson-demo-header">
    <div>
      <p className="eyebrow">Activity 6.2</p>
      <h4>How light changes the direction of plant growth</h4>
      <p>Figure 6.5 experiment: response of the plant to the direction of light</p>
    </div>
    <div className="lesson-demo-actions">
      <button className="button-link lesson-demo-button" onClick={start} type="button">Start activity</button>
      <button className="ghost-link lesson-demo-button" onClick={nextStage} type="button">Next stage</button>
      <button className="ghost-link lesson-demo-button" onClick={reset} type="button">Reset</button>
    </div>
  </div>
  <div className="lesson-demo-progress" aria-label="Activity progress">
    {STAGES.map((stage, index) => <span className={index <= stageIndex ? 'active' : ''} key={stage.id} />)}
  </div>
  <div className="chemical-lab-canvas-frame" role="img" aria-label={`Activity 6.2, ${stage.title}. ${stage.caption}`}>
    <canvas ref={canvasRef} />
  </div>
  <p className="lesson-demo-caption"><strong>{stage.title}:</strong> {stage.caption}</p>
</section>
```

- [ ] **Step 4: Export the routing predicate**

```ts
export function hasPlantGrowthActivityDemo(
  demoId: string,
): demoId is PlantGrowthActivityId {
  return demoId === 'activity-6-2-phototropism';
}
```

- [ ] **Step 5: Run the focused test**

Run:

```powershell
npm.cmd test -w apps/web -- --test-name-pattern "activity 6.2 phototropism"
```

Expected: still FAIL because routing and lesson placement are not wired yet, while the component-specific vocabulary assertions pass.

### Task 3: Wire the Demo into Lesson 6.2.2

**Files:**
- Modify: `apps/web/components/LessonDemo.tsx`
- Modify: `apps/web/content/control-and-coordination/lessons/04-coordination-in-plants.md`
- Test: `apps/web/lib/plant-growth-activity-demo.test.ts`

**Interfaces:**
- Consumes: `hasPlantGrowthActivityDemo` and `PlantGrowthActivityDemo` from Task 2.
- Produces: a live `[[demo:activity-6-2-phototropism]]` render inside Topic 6.2.2.

- [ ] **Step 1: Add dispatcher import and routing**

```ts
import PlantGrowthActivityDemo, { hasPlantGrowthActivityDemo } from './PlantGrowthActivityDemo';
```

Insert before the static-figure fallback:

```tsx
if (hasPlantGrowthActivityDemo(demoId)) {
  return <PlantGrowthActivityDemo demoId={demoId} />;
}
```

- [ ] **Step 2: Replace the Activity 6.2 placeholder with textbook-derived steps and marker**

Keep the existing heading and add:

```md
### Activity 6.2 and Figure 6.5

1. Fill a conical flask with water and cover its neck with wire mesh.
2. Keep two or three freshly germinated bean seeds on the mesh.
3. Put the flask inside a cardboard box that is open on one side. Face the open side towards light from a window.
4. After two or three days, observe that the shoots bend towards light and the roots grow away from light.
5. Turn the flask so the shoots are away from light and the roots are towards light. Leave it undisturbed for a few days.
6. Compare the old portions with the new growth. The old portions keep their direction, while the new tips respond to light.

[[demo:activity-6-2-phototropism]]
```

Leave the existing NCERT activity and figure tracker in place; it continues to record Figure 6.6 as missing follow-up scope.

- [ ] **Step 3: Run the focused test and confirm GREEN**

Run:

```powershell
npm.cmd test -w apps/web -- --test-name-pattern "activity 6.2 phototropism"
```

Expected: PASS.

- [ ] **Step 4: Run the complete web test suite**

Run:

```powershell
npm.cmd test -w apps/web
```

Expected: all tests pass.

### Task 4: Verify Rendering and Record Durable Knowledge

**Files:**
- Modify: `docs/project-memory.md`
- Verify: `apps/web/components/PlantGrowthActivityDemo.tsx`
- Verify: `apps/web/components/LessonDemo.tsx`
- Verify: `apps/web/content/control-and-coordination/lessons/04-coordination-in-plants.md`

**Interfaces:**
- Consumes: the completed live demo.
- Produces: verified build output and a durable Chapter 6 integration note.

- [ ] **Step 1: Add the project-memory sentence**

Append to the existing Control and Coordination bullet:

```md
Activity 6.2 is live through `[[demo:activity-6-2-phototropism]]` and `PlantGrowthActivityDemo.tsx`; preserve Figure 6.5's box, window, flask, water, wire mesh, bean seeds, shoots, and roots, and show that old grown portions retain direction while only new growth redirects after the flask is turned. Figure 6.6 remains separate follow-up scope.
```

- [ ] **Step 2: Run TypeScript verification**

Run:

```powershell
npm.cmd run lint -w apps/web
```

Expected: exit code 0 with no TypeScript errors.

- [ ] **Step 3: Run the production build**

Run:

```powershell
npm.cmd run build -w apps/web
```

Expected: Next.js build completes successfully.

- [ ] **Step 4: Inspect the live lesson in a browser**

Start the existing web dev server and open the Control and Coordination `coordination-in-plants` lesson. Verify at desktop and narrow mobile width that labels are readable, the canvas is not clipped, controls work, the flask rotation is visible, old growth stays fixed, new tips redirect, and the caption matches the shown stage.

- [ ] **Step 5: Refresh Graphify as required**

Run:

```powershell
graphify update .
```

Expected: a successful refresh. If installed Graphify `0.8.47` produces incompatible broad generated drift against repo artifacts expecting `0.4.23`, record the mismatch and do not include unrelated generated changes in the feature handoff.

- [ ] **Step 6: Review the final diff and workspace status**

Run:

```powershell
git diff --check
git status --short
git diff -- apps/web/components/PlantGrowthActivityDemo.tsx apps/web/components/LessonDemo.tsx apps/web/content/control-and-coordination/lessons/04-coordination-in-plants.md apps/web/lib/plant-growth-activity-demo.test.ts docs/project-memory.md
```

Expected: no whitespace errors; every feature line maps to the approved Activity 6.2 scope; unrelated pre-existing modifications remain untouched.
