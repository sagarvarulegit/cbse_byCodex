# ChapterReady Educational Video Style Guide

## Direction

ChapterReady videos should feel like **anime-inspired study content for Gen Z**:
fast to understand, expressive, collectible, and visually rewarding. The anime
layer is a teaching device, not a replacement for the NCERT explanation.

Use an original visual language: stylised student avatars, reaction faces,
speed lines, impact frames, manga panels, chibi science objects, power-up
meters, and dramatic reveal beats. Do not copy named anime characters, logos,
scenes, costumes, or the exact style of a living artist. Generated assets must
be original and safe for commercial YouTube publishing.

## Brand foundation

Keep the ChapterReady identity recognisable in every video:

- Warm paper or deep ink background as the base surface.
- ChapterReady orange remains the brand anchor: `#f3883b`.
- Use accessible darker orange variants for small text: `#d26b16` or `#a84a08`.
- Near-black ink remains the primary text colour.
- Chapter/section number and the exact textbook term should appear early.
- End with the current ChapterReady name and the exact live chapter URL.

## Anime-inspired colour system

Declare the palette before authoring each composition. Use one base mode and
one subject accent; do not turn every scene into a rainbow.

### Warm classroom mode

Best for biology, chemistry, mathematics, and exam-skill Shorts.

```text
paper       #f7f2e7
ink         #171513
brand       #f3883b
deep-orange #a84a08
energy      #ffcf4a
success     #2f8f68
warning     #c4473d
```

### Night-study mode

Best for physics, astronomy, optical effects, and mystery-led concepts.

```text
night       #101827
paper       #f4f1e8
brand       #f3883b
electric    #55c7f2
violet      #9b7cff
energy      #ffd166
```

Electric blue, violet, and yellow are supporting accents only. They must never
replace the ChapterReady orange or be used to encode meaning without labels.

## Typography and graphic language

- Use a genuinely expressive manga/comic display face for hooks and impact
  words, with a separate readable font for teaching. The preferred anime stack
  is **Bangers** for impact headlines, **RocknRoll One** for action labels,
  **Yusei Magic** for tiny expressive accents, **Noto Sans JP** for
  body/captions, and **Space Mono** for equations, timers, and scoreboards.
- Use **Bangers** for 1–5 word hooks, final answers, and reaction words such as
  `WHY?`, `TRAP!`, or `SOLVED!`. Its irregular comic rhythm is intentional; do
  not use it for paragraphs.
- Use **RocknRoll One** for compact labels such as `CHAPTER 5`, `CLUE 03`,
  `RECALL`, and `NCERT`. It gives the chrome a Japanese pop/comic flavour.
- Use **Noto Sans JP** for narration captions, explanations, and any Japanese
  terminology that is genuinely needed. Do not add random Japanese characters
  merely as decoration.
- Use **Space Mono** for equations, units, counters, timer digits, and atom or
  step scoreboards so technical information feels precise and remains aligned.
- **Bangers**, **RocknRoll One**, and **Yusei Magic** are not assumed to be in
  the HyperFrames bundled set. Before public rendering, download appropriately
  licensed font files into `assets/fonts/` and declare them with `@font-face`.
  Keep Noto Sans JP and Space Mono as the reliable caption/equation path.
- Keep textbook equations, symbols, units, and technical terms in a clean,
  stable type treatment; never distort them for a dramatic effect.
- Use manga-style labels such as `CLUE`, `TRAP`, `WATCH`, `RECALL`, and
  `FINAL CHECK` as short chrome, not as paragraphs.
- Use speech bubbles, panel borders, halftone dots, speed lines, starbursts,
  and impact typography sparingly—normally one or two per beat.
- Captions should be large, high-contrast, short, and placed inside the mobile
  safe zone. Highlight the key term, not every spoken word.

### Font sizing defaults

For a 1080×1920 Short, start with 86–120px for the main hook, 48–68px for
section labels, 38–52px for teaching captions, and 34px or larger for essential
equations and figure labels. Scale from the actual rendered frame, not from a
browser preview. If a font is loaded from a project asset, declare it with
`@font-face`; do not rely on a machine-installed font or a live Google Fonts
request for public renders.

## Motion and pacing

The default rhythm is **hook → reaction → mechanism → power-up/reveal →
recall**.

- Open with a visual question, challenge, or surprising character reaction in
  the first 1–2 seconds.
- Use snappy entrances, punch-in camera moves, squash-and-stretch, shake, and
  speed lines only when they reinforce the beat.
- Hold the causal mechanism long enough to read and predict; do not cut every
  second merely to look energetic.
- Use a brief freeze-frame or “impact panel” for the formal definition,
  equation, figure label, or final answer.
- End with a retrieval pause before revealing the answer.
- Decorative loops must remain deterministic and seek-safe under HyperFrames.

## Story and character rules

Characters may represent learner confusion, curiosity, or a wrong prediction.
They must not become the source of scientific authority. Every character beat
must point back to an observable mechanism, source fact, diagram, or equation.

Allowed recurring roles:

- **The Curious Student** — asks the opening question.
- **The Tiny Expert** — points to the mechanism or label.
- **The Misconception Monster** — embodies one wrong idea, then is corrected.
- **The Recall Rival** — creates a friendly timed challenge.

Keep characters visually consistent within a video. Avoid adding dialogue,
backstory, or comedy that competes with the learning objective.

## Ethical learning psychology

Use psychology to make learning rewarding and memorable, not to exploit
students' attention. The audience includes minors, so every engagement device
must preserve autonomy, honest expectations, and access to the essential answer.

### Approved attention and learning techniques

- **Curiosity gap:** open with a concrete question, puzzle, contradiction, or
  challenge that the video genuinely resolves.
- **Prediction pause:** ask the learner to choose, estimate, label, or solve
  before revealing the next step.
- **Progressive reveal:** show one causal step at a time and let each reveal
  answer the question created by the previous beat.
- **Recognition reward:** use a short impact frame, character reaction, badge,
  or sound cue when the learner identifies the correct mechanism.
- **Retrieval close:** end with one question, a brief answer pause, and a clear
  invitation to practise the same skill on ChapterReady.
- **Series continuity:** connect videos through honest chapter numbering,
  recurring characters, and a visible next concept. Each video must still give
  a useful complete takeaway on its own.
- **Specific CTA:** invite a concrete next action, such as practising three
  more questions in ChapterReady, instead of vague “join now” language.

### Prohibited manipulation

- No fake scarcity, countdown pressure, guilt, shame, fear of failure, or
  “watch this or you will lose marks” claims.
- No fake exam guarantees, inflated frequency claims, hidden sponsorship, or
  deliberately incomplete explanations designed only to force a click.
- No autoplay chains, confusing CTA buttons, repeated interruption, or
  withholding the answer after the learner has made a genuine attempt.
- Do not optimise only for watch time. Track useful signals such as completed
  retrieval, practice starts, lesson visits, and return learning sessions.

The success test is: **the learner stays because the explanation is clear and
rewarding, then joins ChapterReady because the next useful practice step is
obvious—not because they were pressured.**

## Educational guardrails

- NCERT remains authoritative; anime visuals are a teaching model or creative
  decoration and must be marked as such during planning.
- Preserve textbook numbering, examples, figures, activities, units, safety
  instructions, and mechanism order.
- Never let aura, beams, magic circles, or character powers imply a false
  scientific cause.
- State when a visual is enlarged, stylised, symbolic, or not to scale.
- Keep safety instructions visible before showing a risky activity.
- Use colour plus labels, shape, position, or texture so meaning does not depend
  on colour alone.

## YouTube packaging

- Prefer titles that combine curiosity with the exact Class 10 concept.
- Thumbnail: one expressive original character or object, one large question or
  result, and no more than 4–6 words.
- Description: explain the concept, name the NCERT section/chapter, then link to
  the exact ChapterReady lesson or chapter route.
- Pinned comment: ask one retrieval question and invite the viewer to practise
  on ChapterReady.
- Use the same brand spelling everywhere: **ChapterReady**.

## Default style presets

Use one of these in `BRIEF.md`:

- `anime-study-warm` — warm classroom mode, chibi diagrams, orange energy
  accents, ideal default for CBSE exam skills.
- `anime-study-night` — night-study mode, cinematic science reveals, ideal for
  astronomy, light, electricity, and space topics.
- `anime-manga-challenge` — high-energy timed challenge with panels, impact
  frames, and recall rival beats; use for Shorts and worked problems.

Every preset still requires the normal source map, accuracy ledger, captions,
retrieval close, and platform CTA.
