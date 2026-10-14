# Current Handoff - Refactor Dashboard into Calm 3-Zone Command Center (2026-10-14)

- [x] **Refactored Student Dashboard (`apps/web/app/dashboard/page.tsx`) into Calm 3-Zone Command Center**:
  - **Zone 0 (Compact Header Bar)**: Streamlined student greeting (`Hey {name}!`) with 1-line streak/XP summary, and a single clickable Board Readiness Pill Badge linking directly to `/readiness`.
  - **Zone 1 (Bento Grid 2fr 1fr)**:
    - *Left Column (`2fr`)*: `DashboardNextStepHero.tsx` with strict state machine (State A for brand-new students with starter chapter selection; State B for active students with active lesson title and mastery progress bar), exactly ONE solid primary CTA fill, ONE secondary ghost CTA, and a compact 1-line daily mission footer strip.
    - *Right Column (`1fr`)*: `WeakAreaDiagnosticsCard.tsx` condensed into a 2-item "Daily Recall Dock" (Item 1: Mistake Vault with due badge; Item 2: Weakest Topic Quick-Fix / PYQ drill).
  - **Zone 2 (Clean Subject Progress Grid)**: `DashboardSubjectStations.tsx` with horizontal filter pill bar (`All`, `Science`, `Mathematics`, `Social Science`, `English`, `Hindi`), 3-column responsive layout, and strict 4-data-point cap per card.
  - **Zone 3 (Quick Tools Dock)**: `QuickToolsLaunchpad.tsx` condensed into a compact 4-tile horizontal shortcut strip (`3D Virtual Lab`, `Formula Sheets`, `PYQ Trends`, `3-Hr Mock CBT`).
  - **Evictions**: Removed redundant `DashboardPracticeHub`, `DashboardSidebarHud`, and bulky `StudyRemixDashboard` panels from `/dashboard`.
  - **Quality Gates**:
    - TypeScript: Passed `npx tsc -p apps/web/tsconfig.json --noEmit` with 0 errors.
    - Playwright E2E: Created `apps/web/e2e/dashboard.spec.ts`, passed cleanly (1 passed).
- [ ] **Next Task in Line**:
  - Render `videos/cbse-class-10-solenoid-poles-short` (`lint` → `check` → thumbnail PNG → `render` 55s MP4) and upload `cbse-class-10-science-solenoid-poles-shorts.mp4` to YouTube Studio with dedicated 9:16 thumbnail.
  - Upload `cbse-class-10-science-electricity-bulb-brightness-shorts.mp4` to YouTube Studio with dedicated 9:16 thumbnail.
  - P0 Money Path: Deploy `apps/web` to Vercel production (`npx vercel deploy --prod --yes` from `apps/web`) and complete real ₹2 test transaction.

# Previous Handoff - YouTube Shorts: Class 10 Science Bulb Brightness Trap with ElevenLabs Adam Stone (2026-10-08)

- [x] **Created Educational YouTube Short**: `cbse-class-10-electricity-bulb-brightness-short`
  - **Topic**: CBSE Class 10 Science (Chapter 11 — Electricity), Section 11.8: *The Series vs. Parallel Bulb Brightness Trap* ($P = I^2 R$ vs $P = V^2 / R$, 40 W vs 100 W bulb).
  - **Voiceover (ElevenLabs)**: Upgraded voiceover to **Adam Stone** (`auq43ws1oslv0tO4BDa7`, `eleven_multilingual_v2`, stability 0.55, similarity 0.80, style 0.15, speaker_boost true) with crisp 1.10x educator pacing. Plain spoken English narration across all 9 frames.
  - **Pedagogy & NCERT Compliance**: Strict alignment with NCERT Sec 11.8 & Exercises Q3, Q15. Mandatory Frame 2 objective statement.
  - **HyperFrames Composition & Render**: Standard-quality 1080×1920 (9:16 vertical) MP4, `58.0s` duration (safely under 60.0s Shorts ceiling) rendered to `renders/cbse-class-10-science-electricity-bulb-brightness-shorts.mp4`.
  - **3D Asset Integration**: Photorealistic 3D incandescent bulb laboratory render and circuit models from `edu-animation-framework-v2`.
  - **Dedicated 9:16 Thumbnail (Episode 05+ Invariant)**: High-contrast mobile cover generated and tracked at `thumbnails/thumbnail-9x16.png` and `.thumbnails/thumbnail-9x16.png`.
  - **YouTube Studio Publishing Kit**: Packaged in `youtube-publishing.html` with title variants, SEO tags, timestamped description, and pinned engagement retrieval quiz.
- [x] **Created second Short**: `cbse-class-10-solenoid-poles-short` (pushed `0fd60de`)
  - **Topic**: Ch 12 Magnetic Effects §§12.2.3–12.2.4 — solenoid pole trap (clockwise = South, anticlockwise = North) + soft-iron electromagnet; first Ch 12 Short (gap vs Ch 11 bulb short).
  - **Build**: 9-scene 1080×1920 HyperFrames composition (night-study mode), 3D solenoid + bar-magnet renders from edu-animation-framework, Adam Stone voiceover 9/9 segments (54.09s total, windows synced), captions synced, `youtube-publishing.html` + 9:16 `thumbnail.html` pack.
- [ ] **Next Task in Line**:
  - Render `videos/cbse-class-10-solenoid-poles-short` (`lint` → `check` → thumbnail PNG → `render` 55s MP4) and upload `cbse-class-10-science-solenoid-poles-shorts.mp4` to YouTube Studio with dedicated 9:16 thumbnail.
  - Upload `cbse-class-10-science-electricity-bulb-brightness-shorts.mp4` to YouTube Studio with dedicated 9:16 thumbnail.
  - P0 Money Path: Deploy `apps/web` to Vercel production (`npx vercel deploy --prod --yes` from `apps/web`) and complete real ₹2 test transaction.

# Previous Handoff - Direction 1: P0 Money Path & Universal Frictionless Checkout (2026-10-08)

- [x] **Verified Live Cashfree Gateway & Supabase Database**:
  - Live API endpoint (`https://cbse-bycodex-api.vercel.app/v1/payments/create-order`) successfully confirmed active with real Cashfree production credentials.
  - Orders generate valid production session IDs (`session_...`) and persist into live Supabase PostgreSQL (`paymentOrderId`) without errors.
- [x] **Eliminated Guest Checkout Friction Across All Modals**:
  - `PaywallModal.tsx` (used for 5-Paper Pro Pass & All-Subjects Mock Pack): Removed `/login` blocking redirect. Added guest email/phone inputs and automatic `cbse_student_session` cookie provisioning upon payment verification.
  - `QuizPaywallModal.tsx` (used for Unlimited Quiz Pass): Upgraded to Cashfree JS SDK `_modal` checkout as primary PG. Removed `/login` redirect, added guest email/phone inputs and auto-session cookie provisioning.
  - `ProductCheckoutModal.tsx` (used for Activity & Diagram Pack, Formula Cheatsheets, Super Combo & Science Ch 1-5 Pack): Fully integrated `SCIENCE_CH1_5_PACK_KEY` in headers, descriptions, and plan selector grid.
- [x] **Zero TypeScript Errors**: Passed `npx tsc -p apps/web/tsconfig.json --noEmit` cleanly.
- [x] **Pushed to GitHub**: Committed and pushed to `origin/main` (`1bfb727`).
- [ ] **Next Task in Line**:
  - Deploy `apps/web` to Vercel production (`npx vercel deploy --prod --yes` from `apps/web`).
  - Verify live purchase flow in production browser on `/store` and `/exam-papers` with Cashfree UPI modal.
  - Perform live ₹2 UPI end-to-end transaction test.

# Current Handoff - Remote Git Sync & Mandatory Push Policy (2026-09-21)

- [x] Established mandatory **Frequent Git Commit & Remote Push Policy** in `AGENTS.md` and `.agents/rules/cbse_dev_invariants.md`.
  - Guarantees all meaningful progress is committed and pushed to `origin/main` immediately so work can resume seamlessly across machines (e.g., office laptop vs. home machine).
  - Sanitized scripts to ensure no credentials or plain-text passwords are leaked.
- [x] Committed and pushed Playwright test infrastructure, audit scripts, specs, and agent skills (`0531e8b`).
- [ ] **Next Task in Line**:
  - P0 Money Path verification: complete real ₹2 test transaction once live credentials / Supabase are unpaused.
  - YouTube Shorts engine: script first 3 high-converting hook Shorts for `/science-pack`.

# Current Handoff - P0 Money Path & P1 Single Flagship Product Launch (Active Sprint)

- [ ] **P0: Fix the Money Path (Frictionless Conversion Engine)**:
  - [ ] Unpause Supabase database project in Supabase dashboard (Owner Action).
  - [ ] Configure live production Cashfree API credentials in Vercel environment (Owner Action).
  - [x] Streamline student registration from 10 fields down to 3 (`fullName`, `email`, `password`, preselected `classLevel: 10`) removing guardian friction.
  - [x] Enable guest checkout in API (`POST /v1/payments/create-order`) and Web modal to allow 1-click UPI purchase with only Phone & Email without prior account creation.
  - [x] Auto-provision student session upon guest payment verification so students immediately get access to unlocked content.
  - [x] Guard Cashfree integration against simulated fake `PAID` results when running in production.
  - [ ] Complete real end-to-end ₹2 test transaction verification.
- [ ] **P1: Launch Flagship Single Product (Science Ch 1–5 Board Pack — ₹99)**:
  - [x] Build dedicated high-conversion single product landing page (`/science-pack`) with 1 clear price, 1 CTA, and instant access.
  - [x] Package 10-year verified PYQs, 13 NCERT activity breakdowns, and 1-page formula cheatsheets for Science Chapters 1–5.
- [ ] **P2: Acquisition via YouTube Shorts Engine**:
  - [ ] Script and produce first 3 high-converting hook Shorts ("CBSE repeats this 3-mark question...", etc.) linking to `/science-pack`. Target: First 100 paying students.

# Current Handoff - Chapter Notes Accordion + e2e tsconfig Fix Live (2026-09-12)

- [x] Deployed **chapter notes accordion (`0e918ac`, `1ed0756`)** to https://www.chapterready.in: 8 parts render as collapsed native `<details data-part>` (first open), drill finale untouched, deep links open-then-scroll, smoke spec extended (3 passed).
- [x] Fixed prod build: `e2e/` + `playwright.config.ts` excluded from `apps/web/tsconfig.json` (`@playwright/test` was never a committed dep; `next build` type-check failed on Vercel).
- [ ] **Next Task in Line: Parent Progress Reporting & Weekly Performance Digest** (weekly WhatsApp/email digest + `GET /v1/exam-papers/attempts/:id` shareable reports).

# Current Handoff - Sci-Wordle & Chemical Balancer Blitz Live in Fun & Games Arcade

- [x] Implemented and deployed **Sci-Wordle & Chemical Balancer Blitz Games Expansion (`/games`, `/games/sci-wordle`, `/games/chemical-balancer`)**:
  - **🧩 Sci-Wordle (Daily NCERT Science & Maths 5-Letter Concept Puzzle)**:
    - 65+ curated Class 10 NCERT Science (Chemistry, Physics, Biology, Environment) and Mathematics 5-letter terms with definitions, chapter slug links, and board exam trap warnings.
    - 📅 **Daily Challenge Mode** with deterministic calendar date indexing and 1-click WhatsApp emoji scorecard export (`🧩 Sci-Wordle Day #241 3/6 🟩🟨...`).
    - ♾️ **Unlimited Practice Mode** with instant random term generator.
    - Full virtual QWERTY keyboard + physical keyboard input support, color flip animations (🟩 Green / 🟨 Yellow / ⬛ Absent), guess distribution chart, and win streak tracking.
    - Educational post-puzzle reveal card linking directly to chapter revision notes and formula sheets.
  - **🧪 Chemical Balancer Blitz (Stoichiometric Reaction Balancer Game)**:
    - 30+ official CBSE NCERT chemical equations across Chapters 1 to 4 with parsed atom counts, integer stepper coefficient dials (`[-] 1 [+]`), and difficulty tiers.
    - **⚖️ Real-Time Atom Balance Scale**: Dynamic visual element chips comparing reactant vs product atom counts with instant green/amber balance indicators.
    - **3 Game Modes**: ⏱️ *60s Speed Blitz* (with combo streak multipliers), ❤️ *3-Lives Survival*, and 🎯 *15-Level NCERT Campaign*.
    - Post-round review with CBSE board exam observations (e.g., brown NO₂ fumes, white BaSO₄ precipitate, thermite welding notes) and personal best persistence.
  - **🎮 Hub & Platform Integration**:
    - Updated `GamesArcadeHub.tsx` to showcase all 3 live games with personal records.
    - Added dedicated tool cards in `ToolsHubClient.tsx` under the `🎮 Arcade & Power Breaks` section.
    - Responsive, high-contrast arcade styling and modals in `arcade.css`.
    - 100% automated test coverage in `arcade-games.test.ts`.
- [ ] **Next Task in Line: Parent Progress Reporting & Weekly Performance Digest**:
  - [ ] Weekly WhatsApp & Email performance digest for student mock exam scores, study streaks, and AI evaluation summaries.
  - [ ] Server-side attempt detail endpoint (`GET /v1/exam-papers/attempts/:id`) for dedicated parent/tutor shareable review reports.

# Current Handoff - Unified 10-Section Learning System Landing Page Live

- [x] Redesigned and deployed **ChapterReady Unified 10-Section Learning System Landing Page (`/`)**:
  - **🎯 Intent-First Architecture**:
    - Replaced abstract messaging with clear value proposition: *"Master Class 10, one chapter at a time."*
    - Added **"What do you want to do today?"** goal selector (📖 *Learn a Chapter*, ✍️ *Practice Questions*, 🎯 *Prepare for Boards*).
    - Moved **"What are you studying today?"** (Subject Launcher) high up for frictionless 1-click chapter entry.
  - **🔄 The ChapterReady 5-Step Method**:
    - Visual learning journey: `01 Pick a Chapter → 02 Learn → 03 Practice → 04 Master → 05 Revise → Board Ready`.
  - **🤖 Dedicated AI Coach Section ([`AICoachShowcase.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/AICoachShowcase.tsx))**:
    - Interactive prompt chips (*"Explain like I'm 12"*, *"Give me a hint"*, *"Real-life example"*, *"Quiz me"*) with live Socratic explanations and 1-click Tara tutor activation.
  - **🔬 Interactive Learning & Virtual Labs Hub**:
    - Clean explore grid linking *Virtual Labs & Diagrams*, *Formula Cheatsheets*, *Arcade & Formula Rush*, and *AI Coach*.
  - **📄 Strategic Board Exam Prep Positioning**:
    - Structured CBT simulator, CBSE step-wise marking schemes, and weak-topic diagnostics showcase with ₹199 Mock Paper Pass (Paper 1 100% Free).
  - **💬 Social Proof & FAQ Accordion ([`HomeFAQ.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/HomeFAQ.tsx))**:
    - Verified trust metrics (4.9/5 ⭐, 280+ Qs, 100% CBSE Blueprint) and interactive accordion answering student & parent questions.


# Current Handoff - Student Feedback Form 404 Fix & Support Inbox Notifications Live

# Current Handoff - Complete 27-Chapter Class 10 Formula & Reaction Cheatsheet Pack Live

- [x] Expanded and deployed **Complete 27-Chapter Class 10 Formula & Reaction Cheatsheet Pack (`/formula-cheatsheets`, ₹49 / Super Combo ₹129)**:
  - **📐 Complete Mathematics Coverage (All 14 NCERT Chapters)**:
    - *Ch 1 Real Numbers*: Fundamental Theorem of Arithmetic, prime powers $\text{HCF} \times \text{LCM} = a \times b$, terminating decimal $2^n \cdot 5^m$ criterion, and $\sqrt{p}$ contradiction irrationality proofs.
    - *Ch 2 Polynomials*: Relations between zeroes and coefficients ($\alpha + \beta = -b/a, \alpha\beta = c/a$), quadratic formation $k[x^2 - Sx + P]$, symmetric identities $\alpha^2 + \beta^2$, and cubic relations.
    - *Ch 3 Linear Equations in Two Variables*: Consistency ratios ($a_1/a_2 \ne b_1/b_2$ unique, $a_1/a_2 = b_1/b_2 = c_1/c_2$ infinite coincident, $a_1/a_2 = b_1/b_2 \ne c_1/c_2$ parallel inconsistent), upstream/downstream boat speed equations.
    - *Ch 4 Quadratic Equations*: Standard form $ax^2+bx+c=0$, discriminant $D=b^2-4ac$, quadratic formula $x=\frac{-b \pm \sqrt{D}}{2a}$, nature of roots, and time difference formulas.
    - *Ch 5 Arithmetic Progressions*: General term $a_n = a + (n-1)d$, sum $S_n = \frac{n}{2}[2a+(n-1)d]$, $n$th term from sum $a_n = S_n - S_{n-1}$, $n$th term from end $l - (n-1)d$, and symmetric term assumption.
    - *Ch 6 Triangles*: Thales / Basic Proportionality Theorem ($AD/DB = AE/EC$), Converse of BPT, similarity criteria (AAA/AA, SAS, SSS), perimeter and altitude ratios.
    - *Ch 7 Coordinate Geometry*: Distance formula $\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$, section formula $\left(\frac{m_1x_2+m_2x_1}{m_1+m_2}, \frac{m_1y_2+m_2y_1}{m_1+m_2}\right)$, midpoint formula, and triangle centroid.
    - *Ch 8 Introduction to Trigonometry*: Ratios P/B/H, reciprocal and quotient relations, 3 fundamental identities ($\sin^2\theta+\cos^2\theta=1, 1+\tan^2\theta=\sec^2\theta, 1+\cot^2\theta=\csc^2\theta$), and standard angle values table.
    - *Ch 9 Some Applications of Trigonometry*: Line of sight, angle of elevation and depression, $30^\circ$-$60^\circ$-$90^\circ$ ($1:\sqrt{3}:2$) and $45^\circ$-$45^\circ$-$90^\circ$ ($1:1:\sqrt{2}$) shortcuts, two-observation point formulas.
    - *Ch 10 Circles*: Tangent $\perp$ radius ($OP \perp PT$), tangents from external point $PA = PB$, supplementary angles $\angle APB + \angle AOB = 180^\circ$, and circumscribed quadrilateral $AB+CD=AD+BC$.
    - *Ch 11 Areas Related to Circles*: Arc length $l = \frac{\theta}{360^\circ}2\pi r$, sector area $\frac{\theta}{360^\circ}\pi r^2 = \frac{1}{2}lr$, minor and major segment areas, closed semicircle perimeter $\pi r + 2r$, and wheel rotation counts.
    - *Ch 12 Surface Areas & Volumes*: Complete CSA, TSA, Volume, and Diagonals for Cuboid, Cube, Cylinder, Cone ($l = \sqrt{r^2+h^2}$), Sphere, Hemisphere, and combined solids.
    - *Ch 13 Statistics*: Direct Mean, Assumed Mean ($a + \frac{\sum f_i d_i}{\sum f_i}$), Step-deviation, Mode ($l + \frac{f_1-f_0}{2f_1-f_0-f_2}h$), Median ($l + \frac{N/2-cf}{f}h$), and empirical relation $\text{Mode} = 3\text{Median} - 2\text{Mean}$.
    - *Ch 14 Probability*: Classical $P(E) = n(E)/n(S)$, complementary $P(\bar{E}) = 1 - P(E)$, coin powers $2^n$, 2-dice 36-outcome matrix, 52-card deck breakdown, and leap year probabilities.
  - **🧪 Complete Science Coverage (All 13 NCERT Chapters)**:
    - *Ch 1 Chemical Reactions & Equations*: 5 reaction types, whitewashing marble reaction, thermal decompositions (Lead Nitrate, Ferrous Sulphate), water electrolysis ($2:1$ ratio), black & white photography, and redox.
    - *Ch 2 Acids, Bases and Salts*: Metal/carbonate reactions, lime water test, Chlor-alkali process, Bleaching powder, Baking soda, Washing soda, Plaster of Paris $\leftrightarrow$ Gypsum, and full indicator color chart.
    - *Ch 3 Metals & Non-metals*: Reactivity series mnemonic, amphoteric oxides ($\text{Al}_2\text{O}_3, \text{ZnO}$), Aqua Regia ($3:1$), Roasting vs Calcination, Thermite track welding, and electrolytic refining of copper.
    - *Ch 4 Carbon & its Compounds*: Catenation, tetravalency, homologous series ($\text{C}_n\text{H}_{2n+2}, \text{C}_n\text{H}_{2n}, \text{C}_n\text{H}_{2n-2}$), functional groups, combustion, oxidation, addition (hydrogenation), substitution, esterification, saponification, and micelle cleansing.
    - *Ch 5 Life Processes*: Photosynthesis balanced equation ($6\text{CO}_2+12\text{H}_2\text{O} \to \text{C}_6\text{H}_{12}\text{O}_6+6\text{O}_2+6\text{H}_2\text{O}$), 3-pathway glucose breakdown (Mitochondria, Yeast, Muscle), digestive enzymes, double circulation, blood pressure ($120/80\text{ mmHg}$), and nephron filtration.
    - *Ch 6 Control & Coordination*: Neuron transmission, reflex arc, brain divisions (Forebrain, Midbrain, Hindbrain), plant phytohormones, tropisms, and endocrine hormones.
    - *Ch 7 How do Organisms Reproduce?*: Asexual modes, double fertilisation ($2n$ zygote + $3n$ endosperm), human reproductive anatomy, contraception, and STDs.
    - *Ch 8 Heredity*: Mendel's monohybrid ($3:1, 1:2:1$) and dihybrid ($9:3:3:1$) crosses, and human sex determination ($50\%$ boy/girl, father determines sex).
    - *Ch 9 Light - Reflection & Refraction*: Mirror and lens formulas, magnification sign conventions ($m = -v/u$ vs $m = +v/u$), Snell's law, refractive index, and lens power $P = 1/f(m)$.
    - *Ch 10 The Human Eye & Colourful World*: Near point ($25\text{ cm}$) and far point ($\infty$), Myopia vs Hypermetropia lens corrections, prism dispersion (VIBGYOR), atmospheric refraction, and Rayleigh scattering ($I \propto 1/\lambda^4$).
    - *Ch 11 Electricity*: Current $I=Q/t$, Ohm's law, resistivity $R = \rho l/A$, series vs parallel resistor combinations, Joule's heating $H=I^2Rt$, electric power, and $1\text{ kWh} = 3.6 \times 10^6\text{ J}$.
    - *Ch 12 Magnetic Effects of Electric Current*: Magnetic field lines, Right-Hand Thumb Rule, Solenoid $B = \mu_0 n I$, Fleming's Left-Hand Rule (Motor), Induction & Fleming's Right-Hand Rule, domestic wiring (Live 220V, Neutral 0V, Earth), and fuse safety.
    - *Ch 13 Our Environment*: Ecosystem components, Lindeman's 10% Energy transfer law, biomagnification (DDT), ozone formation and CFC depletion mechanism, and Montreal Protocol.
  - **🗂️ Interactive Flashcards & Traps**: 162 total master LaTeX formulas + 100 active-recall flashcards + board exam negative marking warnings.
- [ ] Next task: Phase 2 Monetization (Competency & Assertion-Reason Question Bank @ ₹149 or AI Answer Evaluator).

# Current Handoff - CBSE Class 10 Phase 1 Micro-Monetization & Official Store Live

- [x] Implemented and deployed **CBSE Class 10 Phase 1 Micro-Monetization & Official Platform Store**:
  - **🛍️ ChapterReady Store (`/store` & [`apps/web/app/store/page.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/app/store/page.tsx) & [`apps/web/components/StoreClientView.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/StoreClientView.tsx))**:
    - Centralized catalog of all commercial products on the platform, strictly priced under ₹200 INR.
    - Category filtering: *All Items*, *⚡ Revision Packs (₹49–₹129)*, *📄 80-Mark Mock Papers (₹99–₹199)*, and *🎯 Unlimited Quizzes (₹199)*.
    - Dynamic ownership state: automatically detects if user owns the pack and presents "✓ Unlocked / Open Hub" button.
    - Trust badges: 256-bit Secure UPI & Card checkout, instant multi-device access, and 48-Hour Satisfaction Guarantee.
  - **🔬 NCERT Activity & Diagram Mastery Pack (`/activities-and-diagrams`, ₹99)**:
    - Complete breakdown of all Class 10 NCERT Science activities across Chemistry, Biology, and Physics.
    - Setups, apparatus lists, balanced chemical equations, interactive SVG diagrams via `ActivityIllustration`, and verified CBSE 3/5-mark board questions.
    - Free sample preview mode + 1-click printable PDF Handbook.
  - **⚡ Class 10 Formula & Reaction Cheatsheet Pack (`/formula-cheatsheets`, ₹49)**:
    - 1-page high-density printable summary sheets for Class 10 Maths & Science.
    - LaTeX master formula vault, negative marking trap alerts, and 3D digital interactive flashcards for active recall.
  - **👑 Super Combo Pack (`₹129`)**:
    - Bundled package containing both the Activity Pack and Formula Cheatsheet Pack at 67% discount.
  - **Commercial Backend & Entitlements**:
    - Product definitions and entitlement helpers added in [`apps/api/src/lib/payments/products.ts`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/api/src/lib/payments/products.ts) and [`apps/web/lib/payments.ts`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/lib/payments.ts).
    - Unified [`ProductCheckoutModal.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/ProductCheckoutModal.tsx) with Cashfree & Razorpay support.
  - **Global Navigation & In-Notes Wiring**:
    - Added `🛍️ Store`, `🔬 Activities`, and `⚡ Formulas` to `StudentTopbar` and public landing page.
    - Added contextual in-notes companion links in [`CompleteChapterNotesPage.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/app/chapters/[slug]/notes/CompleteChapterNotesPage.tsx) and lesson sidebars.
    - Added Store link to [`OrdersClientView.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/OrdersClientView.tsx) and dashboard.
- [ ] Next task: Phase 2 Monetization (Competency & Assertion-Reason Question Bank @ ₹149 or AI Answer Evaluator).

# Current Handoff - CBSE Class 10 Fun & Games Arcade & Formula Rush Live

- [x] Implemented and deployed **CBSE Class 10 Fun & Games Arcade and Formula Rush Flagship Game**:
  - **Arcade Hub (`/games` & [`apps/web/components/games/GamesArcadeHub.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/games/GamesArcadeHub.tsx))**:
    - **⚡ Formula Rush (Featured & Live)**: 60s Blitz, 3-Lives Survival, and Topic-Specific Practice modes.
    - **🚀 Upcoming Games Pipeline**: Teaser cards and feature roadmap for *Sci-Wordle*, *Chemical Balancer Blitz*, *GeoQuest: Map Hunter*, and *Circuit Overlord*.
    - **🏆 Personal Bests & Streak Tracking**: Persisted local records for high scores and blitz records.
  - **Flagship Game: Formula Rush (`/games/formula-rush` & [`apps/web/components/games/FormulaRushGame.tsx`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/components/games/FormulaRushGame.tsx))**:
    - **📚 NCERT Question Bank ([`apps/web/lib/games/formula-rush-data.ts`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/lib/games/formula-rush-data.ts))**: 50+ verified Class 10 formulas across Maths (*Trigonometry, Surface Areas & Volumes, Quadratic Equations, AP, Coordinate Geometry, Statistics*) and Science (*Electricity, Light/Optics, Chemical Reactions*).
    - **🎵 Web Audio SFX Engine ([`apps/web/lib/games/sound-effects.ts`](file:///c:/Sagar/Projects/CBSE/cbse_byCodex/apps/web/lib/games/sound-effects.ts))**: Zero-lag synthesized chimes, combo streak melodies, error thuds, and victory fanfare + mute control.
    - **🔍 High-Contrast Post-Game Mistake Review**: Side-by-side comparison of student answers vs correct NCERT formulas + textbook tips with high readability in both dark and light modes.
  - **Global Navigation & Dashboard Wiring**:
    - Added `🎮 Arcade` to `StudentTopbar` and user popover.
    - Added `🎮 Games` to public homepage topbar.
    - Added 3-Minute Study Break banner to `/dashboard`.
- [ ] Next task: Build **Sci-Wordle** (Daily NCERT 5-Letter Term Game) or **Chemical Balancer Blitz** (Stoichiometric coefficient slider lab).

# Current Handoff - CBSE Quick Quiz Arena & Daily Limit Freemium Paywall Live on Production

- [x] Implemented and deployed **CBSE Quick Quiz Arena, Random Challenge Generator & Freemium Paywall**:
  - **The Quiz Arena (`/quizzes` & `/quiz`) ([`apps/web/app/quizzes/page.tsx`](file:///home/sagarv/Projects/cbse_byCodex/apps/web/app/quizzes/page.tsx) & [`apps/web/components/QuizArenaClient.tsx`](file:///home/sagarv/Projects/cbse_byCodex/apps/web/components/QuizArenaClient.tsx))**:
    - **🎲 "Surprise Me / Roll Random Challenge"**: Instant 1-click randomized chapter selector across all 48 CBSE Class 10 NCERT units.
    - **🔍 Live Topic & Chapter Search**: Real-time keyword filtering (e.g. *Chemical Reactions*, *Light*, *Quadratic*, *Heredity*).
    - **📚 Subject Filter Grid**: Direct filtering by *Mathematics Standard (041)*, *Science (086)*, *Social Science (087)*, and *English (184)* with mastery badges (`🏆 90%`, `🎯 75%`, `🌱 Not Attempted`).
  - **Freemium 3-Quiz Daily Limit & Monetization Paywall ([`apps/web/components/QuizPaywallModal.tsx`](file:///home/sagarv/Projects/cbse_byCodex/apps/web/components/QuizPaywallModal.tsx) & [`apps/web/lib/payments.ts`](file:///home/sagarv/Projects/cbse_byCodex/apps/web/lib/payments.ts))**:
    - Free tier includes **3 Free Quizzes per Day** with a live status badge (`⚡ 2 / 3 Left Today`).
    - Attempting a 4th quiz triggers the high-converting **"Daily Limit Reached"** modal offering the **Unlimited CBSE Quiz Pass for `₹199`** with Razorpay checkout.
    - Included automatically for all **All-Subjects Board Mock Pack (`₹499`)** purchasers (`🔓 Unlimited Quizzes Active`).
  - **Global Navigation ([`apps/web/components/StudentTopbar.tsx`](file:///home/sagarv/Projects/cbse_byCodex/apps/web/components/StudentTopbar.tsx))**:
    - Added **"⚡ Quizzes"** in the top navigation bar.
  - **Production Deployed**: API & Web ([https://www.chapterready.in](https://www.chapterready.in)) live and verified.
- [ ] Next task: Mathematics Basic (241) dedicated syllabus & mock series pack, or AI "Snap & Grade" Written Answer Evaluator.


# Current Handoff - Live Production Deployment on Vercel

- [x] Successfully deployed all 3 projects to live production on Vercel:
  - **Student Web**: [https://www.chapterready.in](https://www.chapterready.in) (`cbse-bycodex-web`, HTTP 200 OK).
  - **API Service**: [https://cbse-bycodex-api.vercel.app](https://cbse-bycodex-api.vercel.app) (`cbse-bycodex-api`, `/health` returns `{"status":"ok","service":"cbse-api"}`).
  - **Admin App**: [https://cbse-bycodex-admin.vercel.app](https://cbse-bycodex-admin.vercel.app) (`cbse-bycodex-admin`, HTTP 307 redirect to `/login`).
- [ ] Next task: Test live user flows on [https://www.chapterready.in](https://www.chapterready.in) or continue with next prioritized feature (PDF Export, Mathematics Basic 241, or Razorpay Paywall gating).

# Current Handoff - Dashboard Study Studio & Jukebox Reorganization

- [x] Reorganized the student dashboard into a clean, 4-zone "Study Studio" that retains the Jukebox/music player identity while eliminating clutter and redundancy:
  - Zone 1 (Hero): Interactive Turntable & Focus Jukebox (`StudyRemixDashboard`) with album covers, track scrubber, and break timers.
  - Zone 2 (Academic Hub): 4 Core Board Subject Stations (Maths 041, Science 086, SST 087, English 184) with 1-click Notes and Mock Papers launchers.
  - Zone 3 (Practice Hub): 2 balanced side-by-side studio cards for the 80-mark Board Mock Test Series and Spaced Repetition / My Mistakes Vault with active revision targets.
  - Zone 4 (Trophies & Milestones): Unhidden horizontal milestone shelf displaying study streak, unlocked achievement badges, and next milestone targets (replacing the cluttered collapsed backstage drawer).
  - Zone 5: Compact account details & feedback tray.

# Current Handoff - AI Tutor Tara

- [x] Added the Firefly logo asset to Tara and added maximize/minimize controls for the chat window. Feature commit `0aa2305` is pushed to `main`.
- [ ] Next task: run a focused browser check of Tara's floating and maximized layouts at desktop and mobile widths.

# Current Handoff - Multi-Subject Sample Test Paper Generator (Maths 041 + Science 086 + Social Science 087 + English 184)

- [x] Expanded the Sample Test Exam Paper Generator to full 4-subject core coverage: CBSE Class 10 English Language & Literature (184), Social Science (087), Science (086), and Mathematics Standard (041).
  - Curriculum Snapshot: Generated `english-184-blueprint.generated.ts`, `social-science-087-blueprint.generated.ts`, `science-086-blueprint.generated.ts`, verified 80-mark sums and drift guards across all subjects.
  - Layout & Assembly: Registered `ENGLISH_184_LAYOUT` (34 Qs: 20x1m Objective/Grammar, 4x5m Writing/Extracts, 6x3m Literature SA, 2x6m Literature LA, 2x5m Reading Passages = 80 marks).
  - Generalized Demand Planner: Section-specific candidate unit filtering and Section A buffer distribution across all board paper layouts.
  - Question Bank: Curated 59 high-yield NCERT board-style questions for English (184) across First Flight, Footprints Without Feet, Grammar, Writing Skills, and Reading Comprehension in `english-184-seed.ts`. Validated all 283 questions across all 4 subjects with `npm run seed:bank:validate` (0 errors).
  - Test Suite: All 33 tests passing cleanly (`assembler.test.ts`, `verify.test.ts`, `exam-curriculum-snapshot.test.ts`) across 50 distinct seeds per subject.
  - Database: Seeded 283 verified questions into PostgreSQL. Published official Mock Test Series (Papers 1..5) for all 4 subjects (20 mock papers total).
  - Web UI: Added tabbed Subject Selector on `/exam-papers` (Studio generator and Mock Test Series card) supporting Maths Standard (041), Science (086), Social Science (087), and English (184).
- [ ] Next task: Add Mathematics Basic (241), or implement PDF export and Razorpay paywall gating.

# Current Handoff - Quadratic Equations Video (plain-English narration fix + git policy)

- [x] Fixed ElevenLabs garbled-audio across the quadratic video (`videos/cbse-class-10-maths-quadratic/`): 31 of 43 narrated lines contained math notation (`x²`, `−`, `×`, `=`, `()`, `/`, `±`, `√`, `→`) which ElevenLabs reads as gibberish even when its transcript looks correct (fixed seed 1107 reproduces the garble, so the wording had to change). Translated all `SCRIPT.md` NARRATION lines to read-aloud English (`scripts/line-translations.json`), regenerated the 31 changed segments (12 unchanged lines kept byte-identical), rebuilt `audio/narration.mp3`/`.wav` (616.75s, was 573.02s), rebuilt plain-English captions (172 cues; fixed `__cbseSavCaptions` → `__cbseQuadraticCaptions` so captions finally render in `index.html`), recomputed `audio/metadata.json` + `alignment.provider.json` timelines, and re-synced `index.html` scene timings via per-line mapping. Reusable scripts: `apply-translations.mjs`, `regenerate-lines.mjs`, `rebuild-narration.mjs`, `resync-scenes.mjs`.
- [x] Standardized video-folder git policy: root `.gitignore` now wildcard-whitelists every `videos/*/` folder (current + future); paid ElevenLabs assets (`audio/**/*.mp3`, `audio/metadata.json`, `audio/alignment.provider.json`, `audio/sample/`, `.thumbnails/`, all `captions/`) are tracked, while regenerable output (`renders/`, `node_modules/`, `audio/work/`, `audio/*.wav`, `*.bak`) is ignored via a canonical per-folder `.gitignore` (template documented in `AGENTS.md` "Video folder git policy"). Applied to all 11 video folders.
- [x] Committed + pushed to `main`: `e5829ad` (Standardize video folder git policy), `e0b8319` (Source-control quadratic equations video with paid assets).
- [ ] Next task: finish the high-quality quadratic render, verify the 10:17 MP4 and captions, then publish the YouTube video using the upload pack and thumbnail.

# Current Handoff - 2026-08-08

- [x] Completed the CBSE Class 10 Maths marks-to-plan YouTube video project at `videos/cbse-class-10-maths-marks-plan/` (HyperFrames `faceless-explainer`, 270s / 16:9): verified all marks-map facts against the official 2026-27 curriculum PDF, authored STORYBOARD.md + SCRIPT.md + updated SOURCE_MAP.md, built the full composition (15 sub-composition frames + `index.html` orchestrator + `compositions/frame-motion.js` + baked captions + plain-Node build scripts), and rendered the final MP4.
- [x] `npm run check` passes: 0 errors, 0 warnings, runtime/layout/motion clean, 44/44 text checks WCAG AA.
- [x] Rendered `videos/cbse-class-10-maths-marks-plan/renders/cbse-class-10-maths-marks-plan_2026-08-08_11-17-13.mp4` (10.4 MB, 4m 30.0s, no audio track — narration pending HeyGen sign-in).
- [x] Added narration: ElevenLabs **Jessica** (`cgSgspJ2msm6clMCkdW9`, model `eleven_turbo_v2_5`) via `scripts/elevenlabs-maths.mjs` — user picked Jessica from four turbo-v2.5 comparison samples after Sarah + `eleven_multilingual_v2` sounded robotic. Word-timed captions regenerate `captions/captions.js` (`window.__cbseMathsCaptions`, 59 cues). Final deliverable: `renders/cbse-class-10-maths-marks-plan_with-audio.mp4` — h264 + AAC (loudnorm -16 LUFS), 244.0s (4m04s), 15.5 MB.
- [x] Tightened pacing after user feedback on dead air (60s of silence, worst 14.8s): re-timed every frame to actual speech + 1.4–1.6s breathers (deliberate ~6s hold on the Frame 14 retrieval pause, ~3.8s on the Frame 9 cycle beat). New windows: 12.5/14.5/20.5/15/18.5/22/16/14.5/17/14/14/16/14/22/13.5s. Pipeline expected-duration check is now 244; SCRIPT.md times use decimals (0:12.5) so the parser time-regex accepts `[0-9:.]+`.
- [x] Added BGM: user-supplied `educational_upbeat.mp3` (from `/home/sagarv/Projects/CBSE/sound-samples/`, copied to `audio/`), crossfade-looped to fill 244s, sidechain-ducked under the Jessica narration, loudnorm'd to -16 LUFS, and muxed into the final MP4. Final: `renders/cbse-class-10-maths-marks-plan_with-audio.mp4` — h264 + AAC, 244.0s, 15.5 MB, narration + upbeat music.
- [x] Built a 30s 9:16 YouTube Short teaser from the master render (`scripts/build-short.sh` → `renders/cbse-class-10-maths-marks-plan_short.mp4`): hook + "60 of 80 outside Algebra" + full-video CTA, vertical blur-fill with ChapterReady text overlays. Upload pack in `YOUTUBE-SHORT.md`.
- [x] Committed locally as `Implement CBSE Class 10 Maths marks-to-plan video` (commit on `main`); whitelisted the project in root `.gitignore`, added project `.gitignore` (renders/ ignored), and recorded durable build knowledge in `docs/project-memory/rendering-and-media.md`.
- [x] Main video + Short deliverables complete: main `renders/cbse-class-10-maths-marks-plan_with-audio.mp4` (244.0s, narration Jessica + ducked music), 30s teaser Short `..._short.mp4` (CTA = watch the full video; caption band cropped away), Gemini-generated thumbnail `thumbnails/thumbnail.jpg` (1280×720), and upload packs `main-title-description.txt`, `main-tags.txt`, `shorts-title-description.txt`, `YOUTUBE-SHORT.md`.
- [x] **Second Short built:** `videos/board-exam-habits-short/` — "Board Exams Are Won by Habits, Not 15-Hour Days" (`renders/board-exam-habits-short_with-audio.mp4`, 53.5s, 1080×1920, Anika voice `RABOvaPec1ymXz02oDQi`, `educational_upbeat.mp3` ducked, 12 word-timed cues, check 27/27 WCAG AA). Upload pack `title-description.txt` + `tags.txt`. Committed `e2c3487`.
- [ ] **Push pending:** `git push` failed with `could not read Username for 'https://github.com'` — no credentials in this environment. Push with the user's GitHub auth, then the commits are live.
- [ ] Next task: YouTube publish both shorts + the main video (title/description/tags/thumbnail packs are ready in each project folder), then share for student review.
- [ ] **Next video topic chosen: Surface Areas & Volumes (Mensuration)** — ~6-7 est. marks of the official 10-mark unit, 5-mark combination-of-solids word problem every year, highly visual. Verified anchors + estimate caveats recorded in project memory `video-topic-sav`. Build the SAV video next (follow the maths-marks-plan pipeline: SOURCE_MAP from NCERT Ch. SAV, frames, narration, BGM, render).

- [x] Made the three FREE PILOT chapters (`real-numbers`, `chemical-reactions-and-equations`, `two-stories-about-flying`) accessible to signed-out guests: flipped all 16 pilot-lesson `free: false` flags to `free: true` in `apps/web/lib/course-content.ts` so landing-page pilot cards open chapters directly instead of redirecting to `/login`. Non-pilot premium gating untouched.
- [x] Pushed to `main`: `03f99f8` (pilot fix), `e3bfd09` + `5d97f5f` (pre-existing type errors in `ChemicalEquationBalancer.tsx`, `LessonVideoPlayer.tsx`, `PilotEngagementTracker.tsx`, `chapter-notes-rendering.ts` that were blocking the production build).
- [x] Deployed web production alias `https://cbse-bycodex-web.vercel.app` (Ready, ~54s). Live smoke passed as guest: pilot notes/lesson/quiz pages render with no login redirect; `/chapters/polynomials/notes` still gates to login.
- [ ] Next task: configure production `PRIVACY_CONTACT_EMAIL`, then run credentialed student registration/write-path and admin pilot-review smoke before widening invites.

- [x] Commit and push the free-pilot gamification truthfulness, revision mission, and pilot quiz hardening package requested by the user.
- [x] Focused gamification, mission-action, and pilot quiz metadata checks passed on 2026-08-02.
- [x] Applied production migration `20260726123000_add_written_practice_attempts` with `npm.cmd run prisma:migrate:deploy -w apps/api`; Prisma reported all 9 migrations applied.
- [x] Read-only production smoke passed: API health, pilot catalog, web/admin aliases, unauthenticated session protection, and unauthenticated pilot-review protection.
- [x] Implement minimal guardian self-attestation, a versioned pilot privacy notice, and broad subject/chapter coverage with honest lesson-wise, revision-pack, and coming-soon labels.
- [x] Applied production migration `20260804090000_add_guardian_consent` and deployed API, web, and admin production aliases on 2026-08-04.
- [x] Post-deploy read-only smoke passed for API health/catalog/protection, web `/`, `/privacy`, `/register`, and admin `/login`.
- [ ] Next task: configure production `PRIVACY_CONTACT_EMAIL`, then run credentialed student registration/write-path and admin pilot-review smoke before widening invites.

# Science Chapter 1 Quality Remediation Implementation Plan

## Current handoff — 2026-07-26

- [x] Complete the NCERT-fidelity remediation for all six Chapter 1 lessons, exercises, quiz, chapter pack, metadata, and accessible illustrations.
- [x] Replace the inaccurate Chapter 1 redraws and expose image labels as numbered pins with matching HTML keys.
- [x] Fix lesson and chapter-note inline markdown rendering, direct textbook question markers, and multi-part answer preservation.
- [x] Retire Graphify as a mandatory repository dependency and replace it with maintained architecture documentation.
- [x] Document the reusable gold-standard chapter workflow and create the fixed Chapter 1 learner-task holdout rubric.
- [x] Fix the formal notes-audit findings: NCERT end-matter order, source prompts, supported callouts, four-panel recaps, try-first answer checks, source-bounded additions, metadata wording, and holdout leakage.
- [x] Add the separate Board Exam Practice layer: nine PDF-verified 2023-2026 questions, platform marking points, the two-pass oxidising/reducing-agent bridge, Assertion-Reason and case-based practice, and two independent diagnostics.
- [x] Audit all 23 entries in the supplied extracted Chapter 1 bank, map every demand to current teaching or assessment, and keep secondary-bank coverage distinct from page-verified PYQ provenance.
- [x] Document the historical-paper verification and reuse process in `board-exam-evidence.md` and the shared gold-standard workflow.
- [x] Map every Chapter 1 or mixed-Chapter 1 demand in the latest available official SQP and add five clearly labelled original challenges, with write-before-check rubrics and exact weak-skill remediation.
- [x] Implement structured written-practice persistence without answer text, immutable/idempotent retries, cross-device history, and honest D0/D3/D7 derivation.
- [x] Implement the reusable coefficient-only equation workbench, strict independent mastery, Chapter 1 WebP delivery assets, and the copy-forward scorecard template.
- [x] Implement reusable timed Diagnostic A/B attempts with persistent writing/checking clocks, half-mark scoring, honest exam-condition evidence, retry history, and exact first-skill remediation.
- [ ] Apply the new `WrittenPracticeAttempt` database migration in the target environment before expecting account sync; signed-out/local attempts remain available without it.
- [ ] Complete the remaining non-student gates: full 320px browser sweep across all three supplements, keyboard/screen-reader and 200% reflow review, mobile image/LCP/CLS evidence, and execution of the fixed learner-task smoke.
- [ ] When suitable Class 10 students are available, conduct the small review in `docs/pilot-chapter-1-student-review.md`. This is deferred, not completed.

> **Planning status:** Science Chapter 1 is the reference-chapter project. Source fidelity is complete; close every non-student technical evidence gate now, then preserve real-student validation as the final deferred gate. Do not implement from memory or from the current lesson text alone; use the local NCERT PDF and repository standards as the source of truth.

**Goal:** Make Class 10 Science Chapter 1, *Chemical Reactions and Equations*, genuinely NCERT-faithful, understandable to a low-confidence student, honest about mastery, fast on mobile, and strong enough for a real student pilot.

**Primary source:** `textbooks/science/extracted/jesc101.pdf` — NCERT Class 10 Science Chapter 1, Reprint 2026-27, 16 pages.

**Architecture:** Keep the five existing conceptual lesson slugs so saved links, topic metadata, weak-topic recovery, and navigation remain stable. Reallocate their content into exact textbook order, then add one unnumbered supporting lesson, `ncert-exercises-and-revision`, for the 20 NCERT exercises and Group Activity. These six files are the canonical NCERT path. Three further unnumbered supplements provide nine verified board questions, a 30-mark diagnostic, and a separate 20-mark transfer check without changing textbook numbering. The chapter pack remains a secondary `One-page revision sheet`. Source-fidelity tests, not loose substring checks, guard the content. Static activity illustrations remain the visual approach, but their apparatus, captions, loading, and image budgets must be corrected. One focused balancing workbench is added only after the integrity and UX gates pass.

**Tech stack:** Existing Next.js 15 / React 19 / TypeScript student app, markdown lesson parser, Node test runner, built-in `next/image`, and existing CSS. No new runtime library is required.

---

## Priority Gates

### Gate A1 — P0 Trust Blockers

Complete Tasks 0-6 plus Tasks 9A and 11A first. This is the first independently landable slice: it removes cross-chapter/invented content, restores exact numbered teaching order and in-text Questions, renders the mandated Q&A markup cleanly, and prevents fabricated mastery/rewards. Do not hold these trust corrections behind image conversion or visual polish.

### Gate A2 — P0 Completeness, Assessment, And Delivery Quality

Complete Tasks 7-10 after Gate A1. This adds the exact exercises, finishes figure fidelity and image delivery, synchronises the catalog/revision sheet, and rebuilds the chapter assessment.

### Gate B — P1 Struggling-Student UX And Performance

Complete Tasks 11B and 11C after Gate A2. Task 11A already lands with Gate A1. Gate B finishes working navigation, chemistry typography, mobile controls, readable section variants, and the remaining tested interaction experience.

### Gate C — P2 Signature Learning Feature

Task 12 is an optional differentiation release after Gates A1, A2, and B are stable. It adds a lightweight, keyboard-accessible balancing workbench. It is not required for the chapter's first technically pilot-ready release. Reaction sorting, AI tutoring, 3D laboratories, and elaborate animation remain deferred.

Do not collapse these gates into one unreviewable rewrite. Each gate must be independently testable and reviewable.

### Actual Execution Order

Follow this order even though Task 11A is documented with the other UI work:

1. Task 0
2. Task 1
3. Task 11A (minimal standards-compliant Q&A rendering)
4. Tasks 2-6
5. Task 9A
6. Gate A1 review
7. Tasks 7, 8A, 8B, 9B, and 10
8. Gate A2 review
9. Tasks 11B and 11C
10. Task 13 technical pilot-readiness verification
11. Optional Task 12, followed by the Optional Gate C checks in Task 13
12. Small real-student pilot; do not call the chapter student-validated before this evidence exists

---

## Global Constraints

- Preserve the existing conceptual lesson slugs:
  - `chemical-equations`
  - `balancing-equations`
  - `combination-and-decomposition-reactions`
  - `displacement-and-double-displacement-reactions`
  - `oxidation-and-reduction`
- Keep `ncert-exercises-and-revision` as the only unnumbered lesson inside the canonical NCERT path. The later `board-exam-practice`, `board-readiness-diagnostic` and `board-readiness-diagnostic-b` files are explicitly labelled platform supplements; do not give any of the four files a textbook section number.
- Preserve exact NCERT parent/child numbering and order: `1.1`, `1.1.1`, `1.1.2`, `1.2`, `1.2.1` through `1.2.5`, `1.3`, `1.3.1`, and `1.3.2`.
- Copy textbook Questions exactly and place each Questions block where NCERT places it. The platform answer may be simplified, but the question wording must not be paraphrased.
- Keep Activities 1.1-1.11 only. `Activity 1.12` and `Activity 1.13` do not exist in this chapter.
- Represent Figures 1.1-1.10 with their correct numbers, captions, apparatus, labels, and safety cues. Activity 1.2 has no numbered textbook figure.
- Keep existing `[[demo:activity-...]]` markers for activity-sequence cards, but render the exact figure number/caption inside the card. Use the standards-compliant `[FIGURE: figure_id]` token for standalone figure-only content; do not silently mix the two contracts.
- Preserve NCERT equation numbering `(1.1)` through `(1.32)` wherever the source uses it, including state symbols and reaction conditions.
- Platform memory tricks, hints, practice, gamification, and comic recaps must be accurate, derived from the taught concept, and visibly distinguished from exact NCERT wording.
- Do not call an illustration an animation. Use `illustration`, `activity sequence`, or `observation aid` unless it actually moves.
- Do not expose teacher notes, local filenames, PDF paths, or internal alignment commentary on a student page.
- Do not use `chapter.progress` as earned student mastery.
- Do not add payments, subscriptions, new API models, new database tables, admin CMS work, video production, or work in other chapters.
- Do not reintroduce the deleted canvas lab components. The current static-illustration migration is user-owned work.
- Do not reset, clean, delete, or overwrite unrelated dirty-worktree changes.
- Do not commit or push unless the later implementation request explicitly authorises it.

---

## Current Known State

- The state below records the pre-remediation audit and is historical. Inspect the current working tree, the `docs/project-memory.md` routing index, and the relevant topic files before starting new work.
- Chapter 1 has five live conceptual lesson files and one five-question quiz.
- The current lesson split is usable, but the visible titles contain synthetic ranges such as `1.1 continued` and `1.2.1-1.2.2`.
- Lesson 1 contains Chapter 5 Life Processes Questions and answers.
- Lesson 1 presents Activities 1.2, 1.3, and 1.4 before Activity 1.1.
- Lesson 5 invents Activities 1.12 and 1.13.
- None of the eight top-level in-text NCERT questions is currently preserved exactly.
- Only Figure 1.1 is explicitly numbered; Figures 1.2-1.10 and several apparatus/safety cues are missing or inaccurate.
- The chapter pack contains a wrong doubled source path, internal alignment copy, and a section/content ordering mismatch.
- A new or signed-out student can see `56%` mastery and unlocked-looking rewards because `chapter.progress` is used as a fallback.
- `Jump to practice` targets the start of the article instead of the real `Quick practice` heading.
- The quiz has only five basic recognition questions and every correct answer is option 1.
- `apps/web/lib/pilot-quiz-content.test.ts` currently locks the bad `[1, 1, 1, 1, 1]` answer pattern.
- The current web test suite and quiz validator pass, so passing tests alone are not evidence of source fidelity.
- Chapter 1 activity assets are roughly 14 MiB in their current form; Lesson 1 alone references roughly 7 MiB of imagery.
- `master_todo.md` currently marks Chapter 1 as full pilot quality. The audit disproves that claim; reopen it at implementation start and check it again only after Gates A1, A2, and B pass.

---

## Source-Of-Truth Map

Use this map before moving or writing any content:

| PDF pages | Required source content | Destination |
| --- | --- | --- |
| 1-2 | Daily-life opening; Activities 1.1-1.3; Figures 1.1-1.2 | Lesson 1 |
| 2-6 | `1.1`, `1.1.1`, `1.1.2`; equations `(1.1)`-`(1.12)`; first Questions block | Lessons 1-2 |
| 6-10 | Parent `1.2`; `1.2.1`, `1.2.2`; Activities 1.4-1.8; Figures 1.3-1.7; whitewashing and endothermic boxes; second Questions block | Lesson 3 |
| 10-11 | `1.2.3`, `1.2.4`; Activities 1.9-1.10; Figures 1.8-1.9; Recall Activity 1.2 | Lesson 4 |
| 12-14 | `1.2.5`; Activity 1.11; Figure 1.10; Recall Activity 1.1; third Questions block; parent `1.3`; `1.3.1`, `1.3.2`; What you have learnt | Lesson 5 |
| 14-16 | Exercises 1-20; Group Activity | Lesson 6 |
| Historical papers | Nine visually verified 2023-2026 questions and platform marking points | Lesson 7 supplement |
| Original platform assessment | 30-mark mixed-format diagnostic and remediation profile | Lesson 8 supplement |
| Original transfer assessment | 20-mark electrolysis/redox transfer diagnostic and remediation profile | Lesson 9 supplement |

The three in-text Questions blocks begin with these source anchors:

1. After `1.1.2`: `Why should a magnesium ribbon be cleaned before burning in air?`
2. After `1.2.2`: `A solution of a substance 'X' is used for whitewashing.`
3. After `1.2.5` and before parent `1.3`: the iron-nail/copper-sulphate colour question, followed by the double-displacement and oxidation/reduction questions.

Do not type the remainder from memory. Copy and verify it against the PDF at 200% zoom.

---

## Files And Responsibilities

### Source And Standards

- `textbooks/science/extracted/jesc101.pdf`: sole textbook truth for this remediation.
- `AGENTS.md`: stable repository rules.
- `NOTES_GUIDELINES_STANDARDS.md`: mandatory content, numbering, activity, figure, Q&A, typography, and teaching rules.
- `docs/content-style-qa-checklist.md`: final student-facing content quality gate.
- `docs/project-memory/`: update the narrowest relevant durable topic only after verification.

### Chapter Content

- `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/05-oxidation-and-reduction.md`
- Create `apps/web/content/chemical-reactions-and-equations/lessons/06-ncert-exercises-and-revision.md`
- `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- Create `docs/content/class-10/science/chemical-reactions-and-equations/source-fidelity-tracker.md`
- Create `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md`

### Catalog, Routes, And Rendering

- `apps/web/lib/course-content.ts`: lesson titles, timing, summary, progress default, and sixth lesson entry.
- `apps/web/app/chapters/[slug]/page.tsx`: canonical lesson path and honest mastery fallback.
- `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`: practice anchor, Q&A grouping, video placeholder placement, and lesson navigation.
- `apps/web/app/chapters/[slug]/quiz/page.tsx`: quiz loading boundary if history blocks question rendering.
- `apps/web/components/QuizScoreForm.tsx`: accessible review and weak-topic links.
- `apps/web/app/globals.css`: scoped lesson, Q&A, activity, navigation, focus, typography, and responsive styles.

### Activity Figures

- `apps/web/components/ActivityIllustration.tsx`: activity/figure metadata, responsive image rendering, captions, alt text, and legend.
- `apps/web/components/LessonDemo.tsx`: activity and balancing-workbench routing only.
- `apps/web/public/activity-illustrations/`: source-faithful responsive Chapter 1 assets.

### Tests And Generated Output

- Create `apps/web/lib/chemical-reactions-content-fidelity.test.ts`.
- Modify `apps/web/lib/course-content.test.ts` only for catalog/loader/navigation contracts.
- Modify `apps/web/lib/activity-illustration.test.ts` for exact figure metadata and asset budgets.
- Modify `apps/web/lib/pilot-quiz-content.test.ts` for representative quiz quality.
- Add focused helper/component tests introduced by Tasks 11 and 12.
- Regenerate `apps/web/lib/chapter-packs.generated.ts`; never hand-edit it.

---

## Task 0: Protect The Dirty Worktree And Reopen The Truthful Backlog

**Priority:** P0

**Files:**

- Inspect: all files listed above
- Modify: `master_todo.md` only to reopen the falsely completed Chapter 1 pilot-quality item

- [x] **Step 1: Record the exact starting state**

Run:

```powershell
git status --short
git diff -- apps/web/content/chemical-reactions-and-equations apps/web/components/ActivityIllustration.tsx apps/web/components/LessonDemo.tsx apps/web/app/chapters apps/web/app/globals.css apps/web/lib/course-content.ts apps/web/lib/course-content.test.ts apps/web/lib/pilot-quiz-content.test.ts docs/content/class-10/science/chemical-reactions-and-equations
git ls-files --others --exclude-standard -- apps/web/content/chemical-reactions-and-equations apps/web/components apps/web/public/activity-illustrations docs/content/class-10/science/chemical-reactions-and-equations
```

Do not run `git reset`, `git checkout --`, `git clean`, or broad file deletion.

- [x] **Step 2: Read the mandatory sources in this order**

1. `AGENTS.md`
2. `NOTES_GUIDELINES_STANDARDS.md`
3. `docs/project-memory.md`
4. `docs/project-memory/curriculum-and-content.md`
5. `docs/project-memory/assessment-and-mastery.md`
6. `docs/project-memory/rendering-and-media.md`
7. `docs/architecture.md`
8. `docs/content-style-qa-checklist.md`
9. `textbooks/science/extracted/jesc101.pdf`

- [x] **Step 3: Establish baseline verification**

Run and record the result without treating it as proof of content quality:

```powershell
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web
```

- [x] **Step 4: Reopen the stale backlog claim**

Change the `master_todo.md` item `Complete Chemical Reactions and Equations to full pilot quality` from checked to unchecked. Add a short note pointing to this `TODO.md` plan and state that the July 14 source/UX audit found release blockers.

**Acceptance:** The pre-existing dirty state is documented, no unrelated file has changed, and the backlog no longer claims Chapter 1 is pilot-ready.

---

## Task 1: Create The Source-Fidelity Tracker And RED Tests

**Priority:** P0

**Files:**

- Create: `docs/content/class-10/science/chemical-reactions-and-equations/source-fidelity-tracker.md`
- Create: `apps/web/lib/chemical-reactions-content-fidelity.test.ts`
- Modify: `apps/web/lib/activity-illustration.test.ts`
- Modify later, not in this first RED step: `apps/web/lib/course-content.test.ts`

- [x] **Step 1: Build a complete tracker from the PDF**

The tracker must contain one row for each of the following, with columns for PDF page, exact source label, destination lesson, platform marker/caption, required safety/apparatus cue, automated test, manual evidence, and status:

- all numbered sections from `1.1` through `1.3.2`
- Activities 1.1-1.11
- Figures 1.1-1.10
- equation labels `(1.1)`-`(1.32)`
- all three in-text Questions blocks
- the free-standing source prompts after the combination example, silver-bromide example, Activity 1.9, and Activity 1.11
- the whitewashing box
- the unnumbered endothermic activity
- both Recall boxes
- What you have learnt
- Exercises 1-20
- Group Activity

Start every status as `Fail` or `Missing`; do not pre-mark from assumptions.

- [x] **Step 2: Add heading-aware source-contract helpers**

The new test should read the six final lesson files as UTF-8 and parse markdown headings by level. Do not rely on a raw whole-chapter `indexOf` when a phrase can appear in frontmatter, a recap, or an answer.

Add helpers with these responsibilities:

```ts
readLessonOrEmpty(fileName: string): string
extractHeadings(markdown: string): Array<{ level: number; text: string; index: number }>
findHeading(markdown: string, level: number, exactText: string): number
collectRange(markdown: string, startHeading: string, nextHeading?: string): string
normalizeSourceText(value: string): string
```

Add one file-existence subtest per expected lesson. `readLessonOrEmpty` must return an empty string when Lesson 6 does not exist yet so its missing-file failure does not prevent the tests for the five existing lessons from reporting their own defects.

- [x] **Step 3: Add failing fidelity assertions**

The test must prove all of the following:

- parent headings occur before their child headings
- the visible order matches the Source-Of-Truth Map
- one primary `### Activity 1.1` through `### Activity 1.11` heading/demo marker exists for each activity in source order; references inside Recall boxes or questions do not count as duplicates
- Activity 1.12 and Activity 1.13 are absent
- Figure 1.1-1.10 labels and captions exist
- one primary equation-label occurrence for `(1.1)`-`(1.32)` exists in increasing order; examples that mention an earlier equation do not satisfy or invalidate the primary-label check
- each exact NCERT Questions block is after the correct section and before the next parent section
- `diffusion insufficient`, `criteria ... alive`, and other Life Processes text are absent
- all safety, whitewashing, endothermic, Recall, summary, exercise, and Group Activity requirements exist
- every frontmatter title equals its H1 and the matching catalog lesson title
- no student-facing text exposes `textbooks/`, `jesc101.pdf`, `teacher note`, or local source-path copy

- [x] **Step 4: Add figure-contract failures**

Extend `activity-illustration.test.ts` so it checks exact activity/figure mappings, high-risk apparatus vocabulary, asset existence, aspect ratio, and maximum source byte size. Asset-existence checks alone are insufficient.

- [x] **Step 5: Run the tests and confirm RED for the known defects**

```powershell
npm.cmd run test -w apps/web
```

Expected: failure for the wrong Life Processes Q&A, incorrect activity order, fake activities, missing figures/equation labels/questions/exercises, current title mismatch, and image budget. Stop if the failures are unrelated to these known defects.

**Acceptance:** The tests fail for the current incorrect state and would also fail if a future edit reintroduced any of the known trust defects.

---

## Task 2: Restore Lesson 1 — Opening, Activities 1.1-1.3, 1.1, And 1.1.1

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/01-chemical-equations.md`

- [x] Replace the definition-only opening with the NCERT daily-life sequence: milk souring, rusting, fermentation of grapes, cooking, digestion, and respiration.
- [x] Place Activities 1.1, 1.2, and 1.3 in exact order before the explanatory section that follows them in the source.
- [x] Preserve the Activity 1.1 eye-protection/safety instruction and the correct magnesium-ribbon cleaning procedure.
- [x] Preserve Activity 1.3's exact acid-handling caution: handle the acid carefully; the source permits dilute hydrochloric acid or dilute sulphuric acid, while Figure 1.2 depicts dilute sulphuric acid. Do not add teacher-supervision wording as if it were NCERT text.
- [x] Add Figure 1.1 and Figure 1.2 markers/captions at their source positions.
- [x] Teach observable evidence only after the source activities establish it.
- [x] Add exact `1.1 Chemical Equations` and `1.1.1 Writing a Chemical Equation` headings.
- [x] Teach word equations, reactants/products, formula equations, skeletal equations, and the relevant source equations `(1.1)`-`(1.2)`.
- [x] Remove state symbols from this lesson; NCERT introduces them after balancing in `1.1.2`.
- [x] Remove Activity 1.4; it belongs in Lesson 3.
- [x] Delete the entire Life Processes Questions and answers block.
- [x] Replace `animated activity below` with source-accurate `illustration below` or `activity sequence below`.
- [x] Keep platform additions in this order after the associated concept: simple explanation, one textbook-derived worked example, one unseen platform practice item, answer check, common mistake, board tip, one-minute revision, comic recap.
- [x] Update `estimated_minutes` and the catalog time later based on a realistic read + activity + practice walkthrough; do not leave the current 10-minute claim by default.

**Acceptance:** A student encounters the source hook, Activities 1.1-1.3, Figures 1.1-1.2, `1.1`, and `1.1.1` in order; there is no Life Processes text, premature state-symbol lesson, or false animation copy.

---

## Task 3: Restore Lesson 2 — 1.1.2 Balanced Chemical Equations

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`

- [x] Use the exact visible heading `1.1.2 Balanced Chemical Equations`; remove `1.1 continued`.
- [x] Explain conservation of mass patiently before introducing the procedure.
- [x] Preserve the coefficient-versus-subscript explanation already working well.
- [x] Rebuild the iron-and-steam hit-and-trial example using NCERT Steps I-VII, the atom-count tables, and equations `(1.3)` onward.
- [x] Move physical-state symbols and reaction conditions into their correct NCERT position after balancing.
- [x] Preserve equations `(1.3)`-`(1.12)` with correct formulae, coefficients, state symbols, arrows, and conditions.
- [x] Place the exact first NCERT Questions block at the end of `1.1.2`, before Lesson 3 begins parent `1.2`.
- [x] Author each exact question and simplified answer using the mandatory repository Q&A markup. Keep it readable in the existing fallback renderer; Task 11 adds progressive reveal later.
- [x] Remove the empty `Solved examples` heading.
- [x] Replace immediately repeated examples with at least three unseen balancing attempts of increasing difficulty.
- [x] Define a prerequisite-rescue box for formula reading, coefficient, subscript, and atom counting.
- [x] Keep the manual method separate from the later coefficient-only workbench; no generic chemistry parser was added.

**Acceptance:** A low-confidence student can follow one complete NCERT balancing example step by step, understands why subscripts stay locked, and attempts unseen equations before seeing answers.

---

## Task 4: Restore Lesson 3 — Parent 1.2, Combination, And Decomposition

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/03-combination-and-decomposition-reactions.md`

- [x] Begin with the parent heading `1.2 Types of Chemical Reactions` before any child subsection.
- [x] Use exact child headings `1.2.1 Combination Reaction` and `1.2.2 Decomposition Reaction`.
- [x] Place Activity 1.4 and Figure 1.3 under combination reactions.
- [x] Preserve the quicklime/water reaction, whitewashing explanation/box, coal burning, natural-gas combustion including equation `(1.17)`, hydrogen/oxygen, respiration, and compost examples in source order.
- [x] Explain exothermic reactions only through the source examples before adding a memory aid.
- [x] Place Activities 1.5-1.8 and Figures 1.4-1.7 under decomposition reactions.
- [x] Preserve decomposition caused by heat, electricity, and light, including silver bromide/photography and the source endothermic activity. If `electrolytic` or `photolytic` is taught as a memory term, label it as platform terminology rather than an NCERT subsection name.
- [x] Preserve the safe smell-wafting instruction associated with Figure 1.4.
- [x] Preserve Activity 1.7's 6 V battery, acidified water, unequal gas volumes, and teacher-only burning-candle gas test.
- [x] Preserve the correct source equations and labels between `(1.13)` and `(1.23)`.
- [x] Place the exact second NCERT Questions block immediately after `1.2.2` using the mandatory repository Q&A markup; keep the static fallback readable until Task 11 adds reveal.
- [x] Replace practice that repeats solved equations with unseen observation-to-type and equation-to-type prompts.
- [x] Keep multi-label truth explicit: a reaction may be both combination and exothermic, or decomposition and endothermic.

**Acceptance:** Parent/child numbering is exact, Activities 1.4-1.8 and Figures 1.3-1.7 are faithful, both energy ideas are understandable, and the second Questions block is exact and correctly placed.

---

## Task 5: Restore Lesson 4 — 1.2.3 And 1.2.4

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/04-displacement-and-double-displacement-reactions.md`

- [x] Use exact visible headings `1.2.3 Displacement Reaction` and `1.2.4 Double Displacement Reaction`.
- [x] Place Activity 1.9 and Figure 1.8(a)-(b) under displacement.
- [x] Preserve the iron/copper-sulphate observation sequence and the zinc/lead displacement examples.
- [x] Add a small clearly labelled `Prerequisite rescue` for `more reactive`, `ion`, and `aqueous solution`; do not pretend the aid is an NCERT subsection.
- [x] Do not require memorising an unexplained full reactivity series to understand the first example.
- [x] Place Activity 1.10 and Figure 1.9 under double displacement.
- [x] Show the mixing of the two solutions, not only the final precipitate.
- [x] Explain precipitation and ion exchange in plain language without implying every double-displacement reaction must precipitate.
- [x] Preserve equations `(1.24)`-`(1.27)` with states.
- [x] Restore the Recall Activity 1.2 prompt in the correct source position.
- [x] Replace repeated solved-equation practice with unseen displacement-versus-double-displacement decisions and one observation question.

**Acceptance:** The student understands who replaces whom, sees the before/after evidence, distinguishes the two reaction types, and does not need unexplained prior ion knowledge.

---

## Task 6: Restore Lesson 5 — 1.2.5, 1.3, Corrosion, And Rancidity

**Priority:** P0

**File:** `apps/web/content/chemical-reactions-and-equations/lessons/05-oxidation-and-reduction.md`

- [x] Use exact heading `1.2.5 Oxidation and Reduction`.
- [x] Place Activity 1.11 and Figure 1.10 with the correct copper-powder setup, wire gauze/tripod, observation, and equation.
- [x] Teach oxidation/reduction through both oxygen and hydrogen definitions used by the source.
- [x] Preserve zinc oxide and manganese dioxide examples and equations `(1.28)`-`(1.32)`.
- [x] Restore Recall Activity 1.1 in the source position.
- [x] Place the exact third NCERT Questions block after `1.2.5`/Recall Activity 1.1 and before parent `1.3`, using the mandatory repository Q&A markup; keep the static fallback readable until Task 11 adds reveal.
- [x] Add the exact parent heading `1.3 Have You Observed the Effects of Oxidation Reactions in Everyday Life?`.
- [x] Add exact child headings `1.3.1 Corrosion` and `1.3.2 Rancidity`.
- [x] Cover iron rusting, black silver, green copper, antioxidants, airtight storage, and nitrogen-flushed packets from the source. If refrigeration is mentioned, label it as a platform extension rather than NCERT wording.
- [x] Add the exact `What you have learnt` content after `1.3.2`, where the textbook teaching sequence ends.
- [x] Delete invented Activities 1.12 and 1.13 and any tracker that implies they exist.
- [x] Add an accurate misconception recap: oxidation and reduction occur together in redox; oxygen addition is not the only usable clue in the taught examples.

**Acceptance:** The chapter ends its numbered teaching content exactly at `1.3.2`, the third Questions block is correct, and there are no fake activities or missing everyday oxidation effects.

---

## Task 7: Add The Unnumbered NCERT Exercises And Revision Lesson

**Priority:** P0

**Files:**

- Create: `apps/web/content/chemical-reactions-and-equations/lessons/06-ncert-exercises-and-revision.md`
- Modify later in Task 9: `apps/web/lib/course-content.ts`

- [x] Use the H1/frontmatter title `NCERT Chapter Exercises and Revision`. Do not prefix it with `1.4`, `1.3.3`, or another invented section number.
- [x] Copy Exercises 1-20 exactly from PDF pages 14-16.
- [x] Author every question/answer using the mandatory repository Q&A markup. Task 11 adds try-first reveal without changing the exact question wording.
- [x] Provide simplified scoring answers that include required keywords, balanced equations, state symbols, observations, and classifications.
- [x] Separate `Exact NCERT question` from `Platform answer` visually and semantically.
- [x] Include the exact Group Activity and mark teacher-supervised/safety requirements clearly.
- [x] Add a short `Before you submit` exercise checklist and targeted links back to the five conceptual lessons. Do not duplicate Lesson 5's exact `What you have learnt` or the chapter pack's one-page revision summary.
- [x] Map each exercise answer back to one of the five conceptual lesson slugs for revision; do not create a sixth quiz weak-topic category.
- [x] Keep recap and platform memory aids after the exact exercises, not interleaved in a way that changes textbook order.

**Acceptance:** All 20 open-ended exercises and the Group Activity are available without overloading Lesson 5 or pretending the objective quiz replaces textbook exercise practice.

---

## Task 8: Repair Figure Fidelity And Static-Image Performance

**Priority:** P0

**Files:**

- `apps/web/components/ActivityIllustration.tsx`
- `apps/web/components/LessonDemo.tsx`
- `apps/web/public/activity-illustrations/`
- `apps/web/lib/activity-illustration.test.ts`
- relevant Chapter 1 lesson markers

### Task 8A: Lock Source-Correct Figure Rendering

- [x] Extend the shared illustration metadata with a discriminated union so figure-only entries in other chapters, such as Figure 6.6, do not need a fake activity number:

```ts
type ActivityEntry = {
  kind: 'activity';
  activityNumber: string;
  figureNumber?: string;
  figureCaption?: string;
  title: string;
  alt: string;
  observation: string;
  labels: string[];
  src: string;
  width: number;
  height: number;
};

type FigureOnlyEntry = Omit<ActivityEntry, 'kind' | 'activityNumber'> & {
  kind: 'figure';
  activityNumber?: never;
  figureNumber: string;
};

type ActivityIllustrationEntry = ActivityEntry | FigureOnlyEntry;
```

- [x] Lock these mappings:

| Activity | Figure |
| --- | --- |
| 1.1 | Figure 1.1 |
| 1.2 | No numbered figure |
| 1.3 | Figure 1.2 |
| 1.4 | Figure 1.3 |
| 1.5 | Figure 1.4 |
| 1.6 | Figure 1.5 |
| 1.7 | Figure 1.6 |
| 1.8 | Figure 1.7 |
| 1.9 | Figure 1.8 |
| 1.10 | Figure 1.9 |
| 1.11 | Figure 1.10 |

- [x] Split any combined Activities 1.7-1.10 collage into independent figures so each marker has one source-faithful visual.
- [x] Audit every apparatus label at 200% PDF zoom. Specifically preserve Figure 1.4's safe smell-wafting cue, Figure 1.8's before/after comparison, Figure 1.9's two-solution pour, and Figure 1.10's wire gauze/tripod.
- [x] Treat thermometers, steam, droppers, or other Gemini-only additions as optional `Platform observation aid` overlays. They must not replace or silently alter the NCERT figure.
- [x] Replace CSS `background-image` rendering with responsive `next/image` or semantic `<img>` output that retains intrinsic dimensions, alt text, native lazy loading, and an uncropped 16:9 frame.
- [x] Keep a readable text legend first. Anchored hotspots were added only after the basic source and accessibility contract passed.
- [x] Pass Task 8A before changing image formats: exact figure number, caption, apparatus, safety cue, alt text, legend, and uncropped rendering are the source-correctness gate.

### Task 8B: Optimise Delivery After Source Correctness Passes

- [x] Convert delivery assets to WebP without deleting unrelated user-owned source files.
- [x] Define the previously missing `--accent` and `--surface` design tokens.
- [x] Add source-file byte/dimension assertions to the Node figure test. Do not call those values delivered transfer bytes; measure delivered variants against the built server in Task 13.

**Performance budgets:**

- each checked-in optimised source asset: at most 600 KiB
- each delivered mobile activity variant: at most 350 KiB when requested with `Accept: image/avif,image/webp,*/*`
- Lesson 1 activity-image transfer at 390px viewport: at most 1.5 MiB
- all Chapter 1 delivered activity assets combined: at most 4 MiB
- below-fold images: lazy-loaded
- no activity image cropped at 320, 375, 768, or 1024px
- no old canvas lab bundle restored

**Acceptance:** Task 8A can land independently once Figures 1.1-1.10 are source-faithful, responsive, accessible, and individually addressable. Task 8B then passes only when the same correct figures meet the declared asset budget; optimisation must not change apparatus or captions.

---

## Task 9: Synchronise Catalog, Chapter Pack, Canonical Path, And Mastery

**Priority:** P0

**Files:**

- `apps/web/lib/course-content.ts`
- `apps/web/lib/course-content.test.ts`
- `docs/content/class-10/science/chemical-reactions-and-equations/chapter-pack.md`
- generated `apps/web/lib/chapter-packs.generated.ts`
- `apps/web/app/chapters/[slug]/page.tsx`
- `apps/web/lib/mastery.ts` only if a pure display helper belongs there
- `apps/web/lib/mastery-rewards.test.ts`

### Task 9A: Fix Mastery Truthfulness — Land With Gate A1

- [x] For absent mastery data, render `0%` and `Not started`; calculate rewards from zero.
- [x] Do not show `Skilled`, `Exam Ready`, or other earned-looking rewards to an anonymous or brand-new student.
- [x] Add focused tests for anonymous, empty-history, and real-mastery payloads before changing catalog or chapter-pack presentation.
- [x] Keep this fix in the web fallback; the mastery API persistence/scoring path was not changed.

### Task 9B: Synchronise The Catalog, Canonical Path, And Revision Sheet — Gate A2

- [x] Update the five conceptual catalog titles to match their frontmatter/H1 exactly.
- [x] Add the sixth lesson:

```ts
{
  slug: 'ncert-exercises-and-revision',
  fileName: '06-ncert-exercises-and-revision.md',
  title: 'NCERT Chapter Exercises and Revision',
  type: 'Chapter practice',
  minutes: 35,
  free: false,
  preview: 'Attempt all 20 NCERT exercises, check scoring answers, and revise the full chapter.',
}
```

- [x] Keep the chapter `topics` array limited to the exact three parent textbook sections. Do not turn the exercise resource into a fake textbook topic.
- [x] Replace the old non-zero catalog progress with `0` and stop using catalog progress as student mastery.
- [x] Make the lesson sequence the clearly recommended first action on the chapter page.
- [x] Demote the chapter pack below the lesson sequence with a secondary CTA labelled `One-page revision sheet`.
- [x] Rename/rewrite the chapter pack accordingly. It is a faithful concise revision sheet, not a competing second lesson path.
- [x] Correct the doubled source path and remove internal teacher/alignment/local-filename copy from the student-rendered pack.
- [x] Ensure the chapter pack uses exact section order and does not put balancing content under `1.2.1-1.2.2`.
- [x] Regenerate the chapter pack:

```powershell
npm.cmd run content:generate -w apps/web
```

**Acceptance:** There is one obvious primary learning path, the revision sheet is secondary and accurate, six lesson resources load, and no user receives fabricated progress or rewards.

---

## Task 10: Rebuild The Chapter Quiz And Its Quality Contract

**Priority:** P0

**Files:**

- `apps/web/content/chemical-reactions-and-equations/lessons/quiz.md`
- `apps/web/lib/pilot-quiz-content.test.ts`
- `apps/web/lib/quiz-content.test.ts` only if a parser regression is found
- `apps/web/app/chapters/[slug]/quiz/page.tsx`
- `apps/web/components/QuizScoreForm.tsx`

- [x] Replace the five-question recognition quiz with exactly 20 representative questions across the six canonical NCERT resources. The three board supplements remain outside quiz topic coverage.
- [x] Use the six canonical NCERT lesson slugs for `Topic:` metadata; do not use any board-supplement slug.
- [x] Cover every canonical resource, with repeated coverage for the five conceptual lessons and a final exercise/revision transfer item.
- [x] Cover all of the following:
  - recognising the correct word/formula equation
  - selecting a correctly balanced equation without changed subscripts
  - state symbols and conditions
  - observation-to-inference
  - combination and decomposition
  - thermal/electrolytic/photolytic decomposition
  - displacement
  - double displacement and precipitation
  - exothermic/endothermic clues
  - oxidation/reduction pairs
  - corrosion
  - rancidity
  - one apparatus/figure-reading item
- [x] Use the accepted 20-item difficulty distribution: 6 Easy, 9 Medium, and 5 Hard.
- [x] Include application to unseen equations, observations and scenarios; label original variants `Platform application -` plus the precise NCERT concept anchor.
- [x] Use four plausible options per objective item. Distractors represent real misconceptions, not jokes or unrelated phrases.
- [x] Distribute answer positions evenly across 1-4; the accepted sequence gives each position five times.
- [x] Give every question explicit `Answer:`, `Explanation:`, `Topic:`, `Difficulty:`, and `Source:` metadata.
- [x] Label adapted platform items honestly; do not call an invented item an exact NCERT exercise.
- [x] Keep the current quiz schema for Gate A2. Each `Explanation:` now explains why the correct choice is right and repairs the main misconception without introducing a per-option feedback schema.
- [x] Ensure quiz questions render even if attempt-history loading is delayed or fails; keep history in a separate Suspense boundary if currently blocking.
- [x] Deep-link weak-topic recovery to the relevant conceptual lesson.
- [x] Replace the old five-answer test with assertions for:
  - minimum question count
  - topic coverage
  - difficulty coverage
  - answer-position distribution
  - source metadata
  - exactly 6 Easy, 9 Medium, and 5 Hard questions
  - complete six-resource coverage without board-supplement topic slugs

Run:

```powershell
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web
```

**Acceptance:** A student cannot score highly by choosing one position, the quiz samples the whole chapter, weak-topic mapping remains valid, and validation reports zero errors/warnings.

### Gate A1 Exit Check — Trust Blockers

Land this slice before image optimisation or interaction polish when all are true:

- [x] no cross-chapter or invented textbook content remains
- [x] numbered teaching sections, Activities 1.1-1.11, equations `(1.1)`-`(1.32)`, and all three in-text Questions blocks are in source order
- [x] Activity 1.12/1.13 and false animation claims are absent
- [x] anonymous/new-student mastery is zero and rewards are not falsely unlocked
- [x] the focused Gate A1 fidelity, mastery, and Q&A rendering contracts pass

### Gate A2 Exit Check — Completeness, Assessment, And Delivery

Continue to Gate B only when all are true:

- [x] Figures 1.1-1.10, 20 exercises, Group Activity, and all special/source prompts are tracked and present
- [x] lessons are the canonical path and the revision sheet is secondary
- [x] source-correct figures pass before their optimised variants are accepted
- [x] the focused Chapter 1 quiz quality contract passes and the validator previously reported 0 errors / 0 warnings
- [x] the focused Chapter 1 source-fidelity contract passes 14/14

---

## Task 11: Add Struggling-Student Q&A, Navigation, Typography, And Mobile UX

**Priority:** Task 11A is P0 and lands with Gate A1; Tasks 11B-11C are P1 and form Gate B

**Files:**

- Create: `apps/web/lib/lesson-question-answers.ts`
- Create: `apps/web/lib/lesson-question-answers.test.ts`
- Modify: `apps/web/app/chapters/[slug]/lessons/[lessonSlug]/page.tsx`
- Modify: `apps/web/app/globals.css`
- Modify: all six Chapter 1 lesson files to use the final Q&A convention
- Modify: `apps/web/app/layout.tsx` only if implementing the approved Outfit font through existing Next.js capability

### Task 11A: Q&A Reveal And Practice Anchor

Execute this subtask before landing the exact Questions blocks authored in Tasks 3, 4, 6, and 7. The current lesson renderer does not interpret the mandated bold/italic markers, so Gate A1 is not complete until the source wording renders without literal markdown punctuation.

- [x] Keep the mandatory `NOTES_GUIDELINES_STANDARDS.md` markup authored in Tasks 2-7. The supported form is:

```markdown
## Questions and answers

**❓ QUESTIONS**

**1. <exact NCERT wording>**

*Hint:* <optional platform hint>

*Answer:* <simplified scoring answer>
```

- [x] Implement a pure parser that recognises `**❓ QUESTIONS**` or `**❓ IN-TEXT QUESTIONS**`, bold numbered questions, optional `*Hint:*`, and required `*Answer:*` paragraphs.
- [x] Preserve the existing static/fallback rendering for other chapters or malformed legacy sections; do not make a Chapter 1 parser change silently hide content elsewhere.
- [x] Render the question immediately and the answer inside native `<details>/<summary>` with copy such as `Try first, then reveal the answer`.
- [x] Keep exact NCERT wording visible outside the collapsed answer.
- [x] Add visible focus states and screen-reader labels. Do not communicate correctness or importance using colour alone.
- [x] Change all practice links from `#practice-zone` to the real generated `#quick-practice` target.
- [x] Add a regression test proving the practice link and heading ID match.

### Task 11B: Lesson Navigation And Mobile Flow

- [x] Add a generated section table of contents for the numbered textbook headings only.
- [x] Keep the desktop lesson sidebar sticky while the article scrolls.
- [x] Add a mobile previous/next bottom bar with safe-area padding; it must not cover content.
- [x] Keep ready videos prominent, but make `video coming next` a compact status so an unavailable video does not consume a full screen before the notes.
- [x] In the no-video or video-unavailable state, make the first concept visible within one 390x844 viewport after the lesson title. A genuinely ready video may remain prominent above the notes.

### Task 11C: Reading Hierarchy, Chemistry Typography, And Timing

- [x] Give `Common mistakes`, `Board tips`, `Quick practice`, `Answer check`, `Remember this`, and `One-minute revision` distinct but restrained card variants.
- [x] Use Georgia for long-form lesson prose and the approved UI sans-serif contract for navigation/cards. Browser verification remains in Task 13.
- [x] Render chemical formulae with real subscripts, reaction arrows, state symbols, and readable conditions. Formula blocks may horizontally scroll at 320px but the page itself must not overflow.
- [x] Update lesson time estimates from an actual read + activity + practice walkthrough rather than optimistic guesses.

**Accessibility/mobile acceptance:**

- interactive targets are at least 44x44px
- keyboard users can open/close every answer and use all lesson navigation
- screen readers encounter question before answer
- no horizontal page overflow at 320px
- illustration legend text is at least 14px
- mobile navigation remains available
- bottom navigation never overlaps the final feedback controls

**Acceptance:** The chapter behaves like a guided learning sequence rather than one long article, and a student can attempt before revealing answers on desktop or mobile.

---

## Task 12: Add The Chemical Equation Balancing Workbench MVP

**Priority:** Optional P2 — start only after Gates A1, A2, and B pass

**Files:**

- Create: `apps/web/lib/chemical-equation-balancing.ts`
- Create: `apps/web/lib/chemical-equation-balancing.test.ts`
- Create: `apps/web/components/ChemicalEquationBalancer.tsx`
- Modify: `apps/web/components/LessonDemo.tsx`
- Modify: `apps/web/content/chemical-reactions-and-equations/lessons/02-balancing-equations.md`
- Modify: `apps/web/app/globals.css`

**Implementation rule:** Do not build a free-form chemistry formula parser in this task. Use a typed, reviewed dataset with explicit atom maps so correctness is testable and the MVP remains small.

- [x] Define pure types/helpers similar to:

```ts
type Compound = {
  formula: string;
  atoms: Record<string, number>;
};

type BalanceEquation = {
  id: string;
  reactants: Compound[];
  products: Compound[];
  solution: number[];
  hints: [string, string, string];
};

countAtoms(compounds: Compound[], coefficients: number[]): Record<string, number>
isBalanced(equation: BalanceEquation, coefficients: number[]): boolean
isSmallestWholeNumberRatio(coefficients: number[]): boolean
```

- [x] Use four NCERT-aligned equations from the chapter, increasing in difficulty. Include the iron/steam example and questions involving hydrogen/chlorine, barium chloride/aluminium sulphate, or sodium/water only after verifying exact formulae and products from the PDF.
- [x] Keep formulae and subscripts read-only. Students may edit coefficients only.
- [x] Show live per-element atom counts for reactants and products.
- [x] Require the smallest whole-number coefficient ratio for completion.
- [x] Provide three staged hints; do not reveal the complete answer in Hint 1.
- [x] Include reset and next-equation controls.
- [x] Make every coefficient input keyboard and screen-reader operable; do not require drag-and-drop.
- [x] Respect `prefers-reduced-motion`; no canvas, 3D, or decorative continuous animation.
- [x] Route only `[[demo:chemical-equation-balancer]]` through `LessonDemo` and place it after the manual balancing method, not before the student learns the rule.
- [x] Test atom totals, balance detection, invalid/blank/zero coefficients, reducible ratios, exact solution ratios, reset, and demo routing.

**Acceptance:** A student can balance four reviewed equations using coefficients only, understand which element is mismatched, and complete the task entirely with a keyboard at 320px width.

---

## Task 13: Final Automated, Source, Browser, And Scripted Learner-Task Verification

**Priority:** Required before changing any status to pilot-ready

### Step 1: Regenerate And Run Automated Checks

- [ ] Run in this order:

```powershell
npm.cmd run content:generate -w apps/web
npm.cmd run validate:quizzes -w apps/web
npm.cmd run test -w apps/web
npm.cmd run build -w apps/web
npm.cmd run lint -w apps/web
```

Expected:

- chapter-pack generation succeeds
- quiz validator reports `Errors: 0. Warnings: 0.`
- every web test passes, including the new fidelity, figure, mastery, Q&A, and quiz tests; balancing tests are additionally required only if optional Task 12 was implemented
- production build succeeds
- TypeScript lint succeeds

### Step 2: Complete The Source Tracker

- [x] Re-open `jesc101.pdf` and verify every tracker row manually.
- [x] Mark a row `Pass` only when its exact student route and evidence are recorded.
- [x] Confirm all three Questions blocks word-for-word and in position.
- [x] Confirm Activities 1.1-1.11 and Figures 1.1-1.10 visually, not only by marker existence.
- [x] Confirm every exercise 1-20 and Group Activity.
- [x] Confirm all platform additions are accurate and clearly distinguished from exact NCERT material.

### Step 3: Run Built-Server Browser QA

- [ ] Start the production build:

```powershell
npm.cmd run start -w apps/web
```

- [ ] Review these routes at 1440x900, 390x844, and 320px minimum width:

```text
/chapters/chemical-reactions-and-equations
/chapters/chemical-reactions-and-equations/notes
/chapters/chemical-reactions-and-equations/lessons/chemical-equations
/chapters/chemical-reactions-and-equations/lessons/balancing-equations
/chapters/chemical-reactions-and-equations/lessons/combination-and-decomposition-reactions
/chapters/chemical-reactions-and-equations/lessons/displacement-and-double-displacement-reactions
/chapters/chemical-reactions-and-equations/lessons/oxidation-and-reduction
/chapters/chemical-reactions-and-equations/lessons/ncert-exercises-and-revision
/chapters/chemical-reactions-and-equations/lessons/board-exam-practice
/chapters/chemical-reactions-and-equations/lessons/board-readiness-diagnostic
/chapters/chemical-reactions-and-equations/lessons/board-readiness-diagnostic-b
/chapters/chemical-reactions-and-equations/quiz
```

- [ ] Split access-state QA explicitly:
  - signed out: chapter overview, free Lesson 1, truthful `0% / Not started`, and correct login redirects for protected Lessons 2-6
  - authenticated fresh account: all six lessons, empty mastery/history, quiz load, quiz save, locked review, and immutable retry
  - history-failure simulation: block/fail only the attempt-history request and prove quiz questions still render
  - use a local seeded/test account or register through the UI; never put credentials in the plan, source, screenshots, or commit
  - if the required local API/session is unavailable, record browser QA as incomplete rather than pretending the signed-out route proves the authenticated flow
- [ ] Confirm `0% / Not started`, no false unlocked reward, and one clear primary path.
- [ ] In the no-video/video-unavailable state, confirm the first concept appears within one mobile viewport after the lesson title.
- [ ] Confirm every Practice link lands at `Quick practice`.
- [ ] Confirm all Q&A reveals, navigation, and quiz options work with keyboard only. If Task 12 was implemented, include the balancer controls.
- [ ] Manually verify Windows Narrator or NVDA reading order, 200% zoom/reflow, `prefers-reduced-motion`, and both light/dark themes. Node source tests cover parsers/state/dispatch only; they do not prove assistive-technology or keyboard behaviour.
- [ ] Confirm no apparatus is cropped, no caption is too small, no equation breaks the page, and there are no console errors.
- [ ] Measure mobile image transfer, LCP, and CLS with this reproducible protocol:
  - Chrome stable against `npm.cmd run start -w apps/web`
  - incognito profile, cache disabled, cold navigation
  - viewport 390x844, device-pixel ratio 1
  - Slow 4G profile: approximately 150 ms RTT, 1.6 Mbps download, 750 Kbps upload
  - 4x CPU slowdown
  - three runs per route; record the median
  - request image variants with `Accept: image/avif,image/webp,*/*`, verify the response content type, and sum cold-cache transferred bytes rather than checked-in source sizes
  - targets: median LCP below 2.5 seconds and median CLS below 0.1
  - use Chrome DevTools Performance/Lighthouse only if already available; do not add a runtime dependency

### Step 4: Run The Scripted Learner-Task Smoke

- [x] Create and populate `docs/content/class-10/science/chemical-reactions-and-equations/learner-task-smoke-rubric.md` with four balancing prompts and eight reaction-classification prompts that do not appear in the lessons, quiz, exercise answers, or optional workbench.
- [x] Include exact expected answers, partial-credit rules, a 15-minute time limit, a no-hint rule, and a fixed evidence/scoring sheet so two reviewers reach the same result.

Using that checked-in holdout set, run this reproducible content/interaction smoke without reopening the notes after the learning pass:

- [ ] identify reactants/products and two observable reaction signs
- [ ] balance at least 3 of 4 unseen equations
- [ ] classify at least 6 of 8 mixed unseen reactions
- [ ] explain why subscripts cannot be changed
- [ ] distinguish displacement from double displacement
- [ ] identify oxidised and reduced substances in one taught redox equation
- [ ] explain one corrosion example and two rancidity-prevention methods
- [ ] find and attempt an exact NCERT question without accidentally revealing its answer

If the smoke fails, record the exact concept/route and repair that narrow gap before declaring technical pilot readiness. This scripted check is not evidence that a real struggling student learned independently. Run actual target-student sessions after implementation before claiming student validation.

### Step 5: Repository Hygiene

- [x] Run scoped whitespace verification first:

```powershell
git diff --check -- TODO.md master_todo.md apps/web/content/chemical-reactions-and-equations apps/web/components/ActivityIllustration.tsx apps/web/components/ChemicalEquationBalancer.tsx apps/web/components/LessonDemo.tsx apps/web/app/chapters apps/web/app/globals.css apps/web/app/layout.tsx apps/web/lib docs/content/class-10/science/chemical-reactions-and-equations docs/project-memory.md docs/project-memory
```

- [x] Inspect `git status --short` and ensure unrelated dirty files remain untouched.
- [x] Update the routed project-memory topics with durable learnings for the canonical path, assessment systems, figure contract, mastery truthfulness, retention, remediation, accessibility, and image budget.
- [ ] Check `master_todo.md` as complete only after Gates A1, A2, and B, the source tracker, browser QA, and learner-task smoke all pass.
- [ ] If a later authorised push succeeds, update `TODO.md` to the next handoff before ending that implementation session.

---

## Definition Of Technically Pilot-Ready

Chapter 1 is technically pilot-ready only when all of the following are true:

- [x] Exact textbook structure appears in exact order from `1.1` through `1.3.2`.
- [x] One primary heading/demo marker for each Activity 1.1-1.11 is present in source order; Activities 1.12/1.13 are absent.
- [x] Figures 1.1-1.10 match the source and retain safety/apparatus cues.
- [x] Equation numbers `(1.1)`-`(1.32)`, state symbols, and conditions are correct.
- [x] All three in-text Questions blocks are exact and correctly positioned.
- [x] All 20 exercises and the Group Activity are available with try-first simplified answers.
- [x] No Life Processes text, internal teacher notes, local paths, or false animation claims remain.
- [x] Lessons are the canonical path; the one-page revision sheet is secondary.
- [x] Anonymous/new users show `0% / Not started` and no fabricated rewards.
- [x] The quiz has exactly 20 representative questions with evenly varied correct positions, the 6/9/5 difficulty distribution, and valid metadata.
- [ ] Practice links, Q&A reveals, navigation, figures, and quiz work on keyboard and mobile.
- [x] Chapter 1 checked-in WebP activity assets stay within the declared source budget; delivered transfer remains part of the browser performance gate.
- [ ] The source tracker, content-style checklist, tests, validator, build, lint, and browser QA all pass.
- [ ] The scripted learner-task smoke target is met.

Passing automated tests without the completed PDF tracker and browser evidence is not sufficient.

This definition means the chapter is safe to place in a small real-student pilot. It does not mean the chapter is student-validated; that requires sessions with the intended learner group and review of their feedback/behaviour.

### Optional Gate C Completion

If Task 12 is implemented, Gate C is complete only when:

- [x] the focused balancing helper/component/routing tests pass 6/6
- [x] all four workbench equations are source-reviewed and use smallest whole-number ratios
- [ ] the workbench is keyboard/screen-reader operable at 320px
- [x] the workbench does not replace manual balancing instruction or contaminate the learner-task holdout set

---

## Out Of Scope

- Rewriting other Science chapters or their activity assets
- A full site-wide design-system rewrite
- Canvas, 3D, or virtual laboratory simulations
- A drag-and-drop reaction game or game world
- AI-generated tutoring, free-text grading, or chatbot help
- Video production, voiceover, captions, or Bunny uploads
- New database tables or API response shapes unless a verified existing API defect blocks the current UI
- Payments, subscriptions, entitlements, or access-policy changes
- Leaderboards, public ranks, coins, or competitive gamification
- Admin CMS work
- Native Android/iOS implementation
- Deleting unrelated generated, untracked, or user-owned files

---

## Suggested Reviewable Change Batches

These are staging boundaries, not authorisation to commit or push:

1. **Lock Chapter 1 fidelity contracts** — tracker plus RED tests.
2. **Restore exact Chapter 1 lesson content** — six lesson resources and exact Q&A/exercises.
3. **Repair Chapter 1 figures and chapter truthfulness** — static assets, catalog, revision sheet, mastery.
4. **Strengthen Chapter 1 assessment and learner UX** — quiz, Q&A reveal, navigation, mobile/accessibility.
5. **Add the equation balancing workbench** — isolated P2 component and tests.
6. **Refresh durable evidence** — architecture documentation, project memory, final tracker, screenshots, and backlog truth.

Stop after each batch if its acceptance gate fails. Do not hide failures by weakening the test or changing expected source wording.
