# ChapterReady - CBSE Class 10 Learning Portal Blueprint

## System Overview
Product and architecture for the CBSE Class 10 online learning platform across Web, Android, and iOS.

ChapterReady is a unified learning system focused on helping students master Class 10 subjects one chapter at a time. The platform features an intent-first architecture ("Learn a Chapter", "Practice Questions", "Prepare for Boards") and follows a 5-Step Method: Pick a Chapter → Learn → Practice → Master → Revise → Board Ready.

### Key Features & Milestones
- **Interactive Learning & Virtual Labs:** Explore grid linking Virtual Labs & Diagrams, Formula Cheatsheets, Arcade & Formula Rush, and AI Coach.
- **Dedicated AI Coach:** Socratic explanations and 1-click tutor activation via Tara-Firefly (pgvector RAG + Gemini Flash).
- **AI Evaluator:** Grounded AI Snap & Grade Written Evaluator for handwritten and typed student responses.
- **Mock Exams & Practice:** Exemplar HOTS Arena, PYQ Drill ladders, Hindi Mock Series, and Mathematics Basic (241) Mock Series with CBSE Step-Marking Rubrics.
- **Knowledge Base Integration:** Relies on the `cbse_KB` repository for a clean pipeline of marking schemes, exemplars, and PYQs.
- **Extensive Cheatsheets:** 27-Chapter Formula & Reaction Cheatsheet Pack covering Mathematics and Science.

### Master Documentation Reference
All project guidelines, architecture maps, database models, curriculum fidelity requirements, portal notes standards, AI systems, video pipelines, monetization models, and sprint backlogs are consolidated into a single master document:
👉 **[AGENTS.md](AGENTS.md)**

## Subdirectories & System Boundaries
- **apps**: [Applications Blueprint](./apps/README.md) - Monorepo applications container comprising the web portal (`web`), backend API service (`api`), administrative dashboard (`admin`), and mobile client specification (`mobile`).
- **scripts**: [Maintenance Scripts](./scripts/README.md) - Repository utilities for Open Knowledge Format (OKF) compliance verification and Graphify code knowledge graph generation.

## Global Invariants
- **Student Ethics & Privacy:** Zero dark patterns, zero manufactured scarcity, zero false mark guarantees. Academic accuracy and cognitive ease come first.
- **100% Free Full Mock Papers:** All CBSE Class 10 full 80-mark mock test papers (Papers 1..5 across all subjects) are 100% free forever for all students.
- **Dynamic Forensic PDF Branding:** All printable mock exam papers, formula vault sheets, and activity diagrams must render a top ChapterReady branding header, student verification license, diagonal student email/name watermark, and marketing footer.
- **Documentation Size Guard:** Rule files (`AGENTS.md`) must be kept under 20 KB (enforced by `.githooks/pre-commit`).

## Global Side Effects
- Relational data and vector persistence in PostgreSQL with `pgvector` extension (Prisma ORM).
- Payment processing transactions via Cashfree and Razorpay 1-tap UPI intent flows.
- LLM inference and embeddings via Google Gemini API (Flash 2.0 / Flash Lite).
- Voice generation via ElevenLabs API (`eleven_turbo_v2_5` and `eleven_text_to_sound_v3`).
- Telemetry events delivered to Google Analytics 4 (`G-XEXBW2SRJB`) and Google Tag Manager (`GTM-KCPF6X5X`).

## System Verification
- Run: `npm run lint` or `npx tsc --noEmit -p apps/web`
