# Production templates

Use only the sections required by the task. Preserve source anchors internally even when the user asks for a short output.

## Learning contract

```markdown
# Video concept: <working title>

- Audience:
- Format and target duration:
- Exact textbook scope:
- After watching, the learner can:
- Core transformation: <before -> cause -> after>
- Sticky sentence:
- Retrieval task:
- Misconception to prevent:
- Explicitly out of scope:
```

## Source-fidelity map

```markdown
| Source anchor | Required idea | Required visual/evidence | May simplify | Must not imply |
| --- | --- | --- | --- | --- |
| Section/Figure/Activity/page | | | | |
```

For CBSE/NCERT work, include exact section, activity, figure, example, equation, and question numbers when applicable.

## Mental-model map

```markdown
| Visual device | Represents | Does not represent | Learner cue |
| --- | --- | --- | --- |
| | | | |
```

## Timed storyboard

```markdown
| Beat | Time | Learning job | Visual action | Narration | On-screen text | Source anchor | Accuracy/accessibility note |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 00:00-00:05 | | | | | | |
```

Each row must introduce or resolve one question. If the `Learning job` cell is empty, cut or combine the shot.

## Narration block

```markdown
### Segment <number>: <purpose>

Narration: "..."

Pronunciation: <spoken form -> caption form>
Caption lines:
- <short readable line>
- <short readable line>
Pause: <prediction, observation, or answer-reveal hold>
```

Do not put source citations into student narration unless they are part of the lesson. Keep provenance in the source map.

## Asset and motion ledger

```markdown
| Asset/element | Source or creation method | Educational purpose | Motion | Reuse/licence status | Final path |
| --- | --- | --- | --- | --- | --- |
| | | | | | |
```

Use textbook-based original redraws rather than cropped textbook pages. Keep important labels, captions, safety notes, and observations as readable text rather than image pixels when the platform can render them accessibly.

## Accuracy and misconception ledger

```markdown
| Claim or visual inference | Source anchor | Type | Risk | Correction or boundary | Status |
| --- | --- | --- | --- | --- | --- |
| | | literal / simplified / analogy / inferred / decorative | | | verified / unverified |
```

Resolve every high-risk row before production. Do not hide an unresolved row by removing it from the ledger.

## Implementation handoff

```markdown
- Composition/runtime:
- Resolution and aspect ratio:
- Frame rate and duration:
- Scene/component ownership:
- Narration provider and approved voice:
- Caption timing source:
- Music/SFX intent:
- Required source assets:
- Representative review frames:
- Platform route/CTA:
- Delivery target:
- Known constraints:
```

For an acquisition Short, link the CTA to the exact chapter or lesson route. For a lesson video, state the precise section range covered and what remains outside the video.

## Concise concept-only response

When the user asks for ideas rather than a full production package, return:

1. The learning contract.
2. The recommended story pattern and why it fits.
3. A 6-10 beat outline.
4. The key visual grammar.
5. The highest accuracy risk.
6. The retrieval close.
