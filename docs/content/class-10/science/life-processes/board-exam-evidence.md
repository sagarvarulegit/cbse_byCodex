---
type: BoardExamEvidence
title: Life Processes Board-Exam Evidence
description: Audited CBSE board-paper demand families and their platform coverage.
tags: ['science', 'chapter-5', 'board-exam', 'pyq', 'coverage-audit']
timestamp: 2026-07-26T00:00:00Z
---

# Life Processes Board-Exam Evidence

## Audit scope

The local archive contains 165 CBSE PDFs, 3,266 extracted Science question
instances and 2,880 canonical question records. A guarded Biology screen for
Chapter 5 terms produced this review pool:

| Year | Candidate instances |
|---:|---:|
| 2023 | 33 |
| 2024 | 33 |
| 2025 | 66 |
| 2026 | 54 |
| **Total reviewed pool** | **186** |

The 186 figure is deliberately described as a candidate pool. Some extraction
records include adjacent Biology questions or OCR fragments from another
chapter. Coverage decisions were made from the complete demand after manual
review, not from a keyword hit alone.

## Representative original-paper verification

| Paper evidence | Distinct demand | Platform evidence |
|---|---|---|
| 2023, 31/1/1, Q23 | Vena cava/pulmonary artery path OR glucose breakdown | Board Q18 and Q21 |
| 2023, 31/1/1, Q29 | ATP, gas exchange in plants, diffusion direction OR stored energy/desert plants | Lessons 1 and 3; Board Q9 and Q17 |
| 2023, 31/2/1, Q29 | Glycolysis, ATP, residual air OR sunlight investigation | Lessons 1 and 3; Board Q6 and Q17 |
| 2023, 31/2/2, Q22 | Removed xylem and injured blood vessel | Board Q24 |
| 2023, 31/4/1, Q8-Q9 | Transpiration significance and guard-cell water movement | Lessons 1 and 5 |
| 2024, 31/1/1, Q29 | Respiratory pigment, cartilage rings, residual air, inhalation and alveolar vessels | Lesson 3; Board Q17-Q20 |
| 2024, 31/2/3, Q22 | Renal artery, nephron filtration and tubular role | Lesson 6; Board Q2-Q4 |
| 2024, 31/4/1, Q38, rendered printed p. 24 | Renal artery, glomerulus, bladder control, filtration/reabsorption | Board Q3; Lesson 6 |
| 2025, 31/3/2, Q29, rendered printed p. 15 | Two nitrogenous wastes, glomerulus and urine flow | Board Q2 |
| 2025 compartment, 31/S/1, Q29-Q30 | Anaerobic products/site and phloem translocation | Board Q18 and Q27 |
| 2025, 31/5/3, Q31 | Three photosynthesis raw materials and their sources | Lessons 1 and 7 |
| 2026, 31/1/3, Q3/Q7 | Trypsin/lipase and plant-excretion trap | Lessons 2 and 6; Quiz 13 |
| 2026, 31/3/1, Q12/Q15 | Heart evolution and night-time carbon-dioxide storage | Board Q9 and Q22 |
| 2026, 31/3/2, Q14 | Continuous xylem channels and upward water movement | Lesson 5; Board Q25 |
| 2026, 31/4/1, Q16, rendered printed p. 13 | Five-mark stomata/photosynthesis OR nephron/reabsorption | Board Q1 |

## Official 2026 marking-scheme verification

The official 2026 marking scheme for paper 31/4/1 was inspected for Q16.

For the photosynthesis option, it separately awards:

- diagram and labels for open/closed stomata
- absorption of light by chlorophyll
- conversion of light to chemical energy plus water splitting
- reduction of carbon dioxide to carbohydrate
- balanced photosynthesis equation

For the nephron option, it separately awards:

- nephron diagram
- any four correct labels
- filtration of blood to remove wastes
- selective reabsorption of useful substances, including glucose, amino
  acids, vitamins, salts and most water

The exact marking-point shape is reproduced in `08-board-exam-practice.md`.

## Demand-family closure

| Demand family | Taught | Practised |
|---|---|---|
| Definition/need of life processes and diffusion limit | Lesson 1 | Lesson 7; quiz |
| Photosynthesis events, equation, raw materials, storage | Lesson 1 | Board Q1, Q9; quiz |
| Chlorophyll, `CO2` and sunlight experiments | Lesson 1 | Board Q6-Q8 |
| Stomatal structure and guard-cell action | Lesson 1 | Board Q1, Q10; quiz |
| Nutrition modes and Amoeba sequence | Lesson 2 | Board Q15; quiz |
| Human digestion, enzymes, end products, villi | Lesson 2 | Board Q11-Q16; quiz |
| ATP and three pyruvate pathways | Lesson 3 | Board Q17-Q18; quiz |
| Breathing, cartilage, residual air, alveoli, haemoglobin | Lesson 3 | Board Q19-Q20; quiz |
| Four-chamber heart, vessels and double circulation | Lesson 4 | Board Q21-Q24; quiz |
| Fish/amphibian/reptile/bird/mammal circulation | Lesson 4 | Board Q22 |
| Xylem, root pressure, transpiration and Activity 5.8 | Lesson 5 | Board Q24-Q26; quiz |
| Phloem translocation and ATP loading | Lesson 5 | Board Q27; quiz |
| Renal vessels, nephron and urine formation/regulation | Lesson 6 | Board Q1-Q5; quiz |
| Dialysis and urine pathway | Lesson 6 | Board Q2-Q4 |
| Plant excretion methods | Lesson 6 | Board Q28; quiz |
| Alveolus-nephron comparison | Lessons 3 and 6 | Lesson 7; Board Q5 |

## Coverage conclusion

**Pass for the audited 2023-2026 archive.** Every distinct Chapter 5 marking
demand found after false-positive review is explicitly taught and has a direct
answer route in the lessons, NCERT answer lab, board practice or quiz.

The audit caused concrete repairs before this conclusion:

- corrected Activity 5.2 identity
- added residual air and cartilage reasoning
- added pancreas dual-function and duct-blockage reasoning
- added renal artery/vein, bladder control and filtrate composition
- added heart-evolution comparison
- added exact 2026 five-mark diagram and selective-reabsorption points

Automated platform checks and focused browser review remain intentionally
deferred until the final integrated Science pass under repository instructions.


## Verbatim board-question wording (2026-09-12)

Drill cards now show the exact question as printed, transcribed from the
official 2026 Science papers (Series LKN3M, Sets 31/3/1, 31/3/2, 31/3/3;
PDFs archived under `10th/PreviousYearExamPapers/2026/086-science/`).
Wording stored in `scripts/question_texts_2026_science.json`, merged by
`export_chapter_pyqs.py`, which refuses to export a life-processes item
without it. Per-set question numbers differ for shared questions
(respiration: 31/3/1 Q11 = 31/3/2 Q10 = 31/3/3 Q12); `questionRefs`
records each set's number. Mixed-part Q26 (31/3/2) stays filed under
chemical-reactions via `CHAPTER_OVERRIDES` — two of its three sub-parts
are chemistry.
