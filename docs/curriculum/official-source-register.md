---
type: ReferenceRegister
title: Official Source Register
description: Reference materials, curriculum blueprints, and official sources for Class 10 subjects.
tags: ['curriculum', 'sources', 'cbse']
timestamp: 2026-07-08T12:00:00Z
---

# Official Source Register

The 2026-27 curriculum is current. The latest verified sample-paper set remains 2025-26 as of June 24, 2026.
Historical papers may inform gap analysis but cannot define the active 2026-27 blueprint.

Each source record carries its own immutable academic session, verification date, role, and eligibility flags. A source may drive a subject blueprint only when its type is eligible, its session matches the subject, its subject code applies, and `mayDriveCurrentBlueprint` is true.

| Source ID | Subject code(s) | Academic session | Role | Verification date | Drives current curriculum? | Drives current blueprint? | URL |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `cbse-curriculum-index-2026-27` | ALL | 2026-27 | Current curriculum index | 2026-06-24 | Yes | No | `https://cbseacademic.nic.in/curriculum_2027.html` |
| `cbse-mathematics-041-2026-27` | 041, 241 | 2026-27 | Current curriculum and blueprint | 2026-06-24 | Yes | Yes | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf` |
| `cbse-science-086-2026-27` | 086 | 2026-27 | Current curriculum | 2026-06-24 | Yes | No | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf` |
| `cbse-social-science-087-2026-27` | 087 | 2026-27 | Current curriculum and blueprint | 2026-06-24 | Yes | Yes | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/SocialScience_SecP1X_2026-27.pdf` |
| `cbse-english-184-2026-27` | 184 | 2026-27 | Current curriculum | 2026-06-24 | Yes | No | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/English_LL_SecP1_2026-27.pdf` |
| `cbse-hindi-b-085-2026-27` | 085 | 2026-27 | Current curriculum | 2026-06-24 | Yes | No | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Hindi_B_SecP1_2026-27.pdf` |
| `cbse-hpe-2026-27` | HPE | 2026-27 | Current internal curriculum | 2026-06-24 | Yes | No | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/HPE_SecP1_2026-27.pdf` |
| `cbse-it-402-2026-27` | 402 | 2026-27 | Future curriculum | 2026-06-24 | No | No | `https://cbseacademic.nic.in/web_material/Curriculum27/sec/402-IT-X.pdf` |
| `cbse-sqp-index-2025-26` | ALL | 2025-26 | Historical comparison | 2026-06-24 | No | No | `https://cbseacademic.nic.in/SQP_CLASSX_2025-26.html` |
| `cbse-board-papers-2026` | ALL | 2025-26 | Historical comparison | 2026-06-24 | No | No | `https://www.cbse.gov.in/cbsenew/question-paper.html` |

## Blueprint readiness

- Mathematics Standard and Mathematics Basic may use the current Mathematics PDF because its question-paper design is explicitly labelled Class X 2026-27.
- Social Science may use its current curriculum PDF as the registered current blueprint source.
- Science is available as a current curriculum subject, but its embedded question-paper design is labelled 2025-26. Its 2026-27 blueprint remains blocked.
- English Language and Literature is available as a current curriculum subject, but its embedded section-wise assessment is labelled 2025-26. Its 2026-27 blueprint remains blocked.
- Hindi Course B is available as a current curriculum subject, but its embedded assessment table is labelled 2025-26 and the PDF points to a board sample paper for the detailed design. Its 2026-27 blueprint remains blocked.
- HPE is internal assessment and has no board-paper blueprint.

Subject availability and blueprint readiness are separate contracts. A blocked blueprint does not hide a current subject, but it must prevent current-session paper-generation claims.

## Prescribed-resource provenance

When a curriculum PDF lists a book or resource without a separate official download URL, the book record references the curriculum source ID that contains the list. Do not invent a downloadable URL.

- Mathematics: NCERT textbook, CBSE mathematics-laboratory guidelines, NCERT laboratory manual, and NCERT exemplar.
- Science: NCERT textbook, CBSE practical-skills assessment, NCERT laboratory manual, NCERT exemplar, and CBSE 2026-27 reading material.
- Social Science: the four NCERT subject books listed by the curriculum structure.
- English: First Flight, Footprints Without Feet, and Words and Expressions - II.
- Hindi B: स्पर्श भाग-2 and संचयन भाग-2.

## Activation blockers

- Mathematics Basic remains `future` and hidden until its separate activation review is completed.
- Artificial Intelligence Class X has no registered official 2026-27 source yet.
- Information Technology and Artificial Intelligence remain future subjects until source, scope, assessment, and platform readiness are all validated.
