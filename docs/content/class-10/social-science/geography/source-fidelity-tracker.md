---
type: SourceFidelityTracker
title: Class 10 Geography Source Fidelity Tracker
description: Visual and textual source map for Contemporary India - II, Reprint 2026-27.
tags: [social-science, geography, textbook-fidelity, ncert]
timestamp: 2026-08-01T00:00:00Z
---

# Class 10 Geography source-fidelity tracker

## Source authority

- Book: *Contemporary India - II*
- Publisher: NCERT
- Local chapter PDFs: `textbooks/socialscience-geography/jess101.pdf` through `jess107.pdf`
- Edition marker on every reviewed chapter: `Reprint 2026-27`
- Curriculum and map scope: `apps/web/lib/curriculum/subjects/class-10/social-science.ts` and the active official CBSE Social Science 087 source record

The PDFs control chapter content, order, figures, activities and exercises. The active CBSE record controls whether a chapter or map item is board-exam, periodic-only or project-only.

## Review method

On 1 August 2026, all 83 chapter pages were rendered and visually inspected. Text extraction was used only to search and cross-check wording. The maintained chapter packs were then rebuilt as simplified revision notes. They remain `draft` until the regenerated student pages receive a focused browser review.

## Chapter coverage

| Chapter | PDF | Pages | Source structure and required visual matter | Exercise/end matter | Pack |
| --- | --- | ---: | --- | --- | --- |
| 1. Resources and Development | `jess101.pdf` | 12 | Resource classification; development/planning/conservation; land; soils; Figures 1.1-1.11; land-use chart; major-soil map; inline activities and source boxes | MCQs, 30-word and 120-word questions, Project/Activity 1-4 and word puzzle | `geography/resources-and-development/chapter-pack.md` |
| 2. Forest and Wildlife Resources | `jess102.pdf` | 6 | Flora/fauna; conservation; Project Tiger; forest categories; community conservation; sacred groves; Figures 2.1-2.2; media/source panels; three activity prompts | MCQ, matching, 30-word and 120-word questions | `geography/forest-and-wildlife-resources/chapter-pack.md` |
| 3. Water Resources | `jess103.pdf` | 11 | Scarcity; conservation; multi-purpose projects; rainwater harvesting; Figures 3.1-3.7; major rivers-and-dams map; flood, dam, dispute and interesting-fact boxes | Classification/MCQ/correction set, 30-word and 120-word questions | `geography/water-resources/chapter-pack.md` |
| 4. Agriculture | `jess104.pdf` | 12 | Farming types; seasons; crops; reforms; Bhoodan-Gramdan; Figures 4.1-4.15; rice and wheat maps; source activities | MCQs, 30-word and 120-word questions, Project Work and crop word puzzle | `geography/agriculture/chapter-pack.md` |
| 5. Minerals and Energy Resources | `jess105.pdf` | 16 | Mineral formation and groups; mining/conservation; conventional and non-conventional energy; Figures 5.1-5.12; three distribution/power maps; source prompts and safety panels | MCQs, comparisons, 30-word and 120-word questions, mineral crossword | `geography/minerals-and-energy-resources/chapter-pack.md` |
| 6. Manufacturing Industries | `jess106.pdf` | 13 | Importance/classification; agro/mineral/other industries; pollution/control; Figures 6.1-6.8; textile, steel and software maps; NTPC case; activities | MCQs, 30-word and 120-word questions, word activity, project and industry puzzle | `geography/manufacturing-industries/chapter-pack.md` |
| 7. Lifelines of National Economy | `jess107.pdf` | 13 | Transport modes; communication; trade; tourism; Figures 7.1-7.10; Table 7.1; highway, railway, port/airport maps; activities and project | MCQs, 30-word and 120-word questions, Quiz Drive and destination puzzle | `geography/lifelines-of-national-economy/chapter-pack.md` |

## Fidelity decisions

- The textbook uses named headings rather than decimal section numbers. The packs preserve those names and do not invent `1.1`, `2.1`, and similar labels.
- Every printed figure number, map, table and source activity is represented in an accessible tracker. Important map labels remain map-practice tasks rather than being baked into tiny note images.
- Exercise wording is retained; answers are original, simplified and scoring-friendly.
- Recent production, trade and route statistics are treated as textbook evidence for this reprint, not permanent current facts. When a question asks for current data, use a current official source.
- Chapter 7 publication and map work must respect the active CBSE curriculum scope even though the full NCERT chapter remains available for learning and project support.

## Open gates

- `apps/web/lib/chapter-packs.generated.ts` was regenerated on 1 August 2026; all 22 canonical Social Science pack keys were present and no excluded duplicate slug remained.
- Review `/subjects/social-science` and representative chapter-note routes after generation.
- Quiz metadata and topic coverage are a separate assessment pass; the existing quizzes are not evidence of chapter-pack fidelity.
