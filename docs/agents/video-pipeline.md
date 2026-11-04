# Educational Video & YouTube Production Pipeline

> Moved verbatim from `AGENTS.md` to keep the always-loaded rules file under the 24 KB agent limit. Keep this file accurate; `AGENTS.md` links here.

## 10. Educational Video & YouTube Production Pipeline

### 10.1 Video Repository Location & Structure
- **Dedicated Repository:** Educational video production lives in `cbse_videos/` (located at `c:\Sagar\Projects\CBSE\ChapterReady.in\cbse_videos\` or `../cbse_videos/`).
- **Anime-Inspired Gen Z Visual Style:** Manga panels, reaction faces, speed lines, chibi science solids, power-up meters, starbursts. Original, commercially safe assets only (no copyrighted characters or living artist imitations).
- **Palette Defaults:**
  * Classroom Warm: Paper `#f7f2e7`, Ink `#171513`, Brand `#f3883b`, Deep Orange `#a84a08`, Energy `#ffcf4a`, Success `#2f8f68`.
  * Night Study: Night `#101827`, Paper `#f4f1e8`, Brand `#f3883b`, Electric `#55c7f2`, Violet `#9b7cff`.
- **Typography:** **Bangers** (1–5 word hooks, reaction words), **RocknRoll One** (compact labels, chapter chrome), **Noto Sans JP** (captions, body), **Space Mono** (equations, atom counts, timer digits).

### 10.2 Mandatory Frame 2 Objective Rule
Every educational video **must** state its objective clearly in Frame 2 (right after the Hook) in 2–3 sentences before any formulas or concepts appear:
- *SAV Video:* "Today we cover all 14 formulas for Surface Areas and Volumes — CSA, TSA, and Volume for every shape, plus memory tricks to recall them."
- *Quadratic Video:* "This video teaches every method to solve quadratic equations — factorisation, completing the square, the quadratic formula — and discriminant shortcuts."

### 10.3 Mandatory Plain Spoken English Narration (TTS Math Rule)
- **ElevenLabs Pronunciation Rule:** ElevenLabs TTS completely garbles raw math notation (`x²`, `√`, `±`, `ₙ`, `×`, fractions). Raw subscript $\text{a}_n$ turns into gibberish.
- **Mandatory Translation:** Preprocess narration text with `cbse_videos/ap-confusion-short/preprocess_math.py`. Spell out all formulas phonetically in `SCRIPT.md`:
  * `x² - 45x + 324 = 0` → *"x squared minus forty-five x plus three hundred twenty-four equals zero"*
  * `aₙ = a + (n-1)d` → *"a subscript n equals a plus n minus one times d"*
  * `a/b` → *"a over b"*
- Keep real mathematical notation in the `**VISUAL:**` layer; spoken audio and captions use plain phonetic English.

### 10.4 Voice Casting & Audio Engineering
- **Voice Todd (`g14YnDYCsy3k7XLlcKlO`):** Approved voice for male narration and all YouTube Shorts.
- **Voice Jessica (`cgSgspJ2msm6clMCkdW9`):** Playful, bright, warm voice with `eleven_turbo_v2_5` for maths master videos.
- **Audio Mix Pipeline:** Crossfade-loop BGM, sidechain-duck under voice (`sidechaincompress` threshold 0.02, ratio 10–14, attack 120ms, release 800ms), normalize with `loudnorm I=-16:TP=-1.5:LRA=11`. Ensure $\ge 4\text{ dB}$ speech headroom.
- **Video Git Policy:** Track paid ElevenLabs MP3s and metadata (`audio/**/*.mp3`, `audio/metadata.json`); ignore heavy regenerable WAV conversions (`audio/*.wav`, `audio/work/`, `renders/`).
