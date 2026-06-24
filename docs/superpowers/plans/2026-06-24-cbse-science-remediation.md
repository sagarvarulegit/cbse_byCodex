# CBSE Science Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Science `086` board-preparation ready with balanced Biology, Chemistry, and Physics coverage, including equations, experiments, observations, diagrams, numericals, and reasoning.

**Architecture:** Extend the structured bank with Science domain metadata and validators, then author reviewed unit modules according to current `2026-27` unit weights. Keep formative-only topics available as learning content but exclude them from summative readiness.

**Tech Stack:** TypeScript, Node test runner, curriculum registry, structured question bank.

## Global Constraints

- Plans 1 and 2 must pass.
- Active subject code: `086`.
- Unit weights: `25/25/12/13/5`.
- Use scientifically accurate terminology.
- Final chemical equations must be balanced.
- Unsafe unsupervised experiments are prohibited.
- Every diagram asset requires expected labels and alt text.
- Every numerical rubric separates formula, substitution, unit, and result.
- Formative-only topics cannot satisfy annual-exam readiness.

---

## File Structure

**Create:**

```text
apps/web/lib/question-bank/subjects/science.ts
apps/web/lib/question-bank/subjects/science.test.ts
apps/web/content/question-bank/class-10/science/chemical-substances.ts
apps/web/content/question-bank/class-10/science/world-of-living.ts
apps/web/content/question-bank/class-10/science/natural-phenomena.ts
apps/web/content/question-bank/class-10/science/effects-of-current.ts
apps/web/content/question-bank/class-10/science/natural-resources.ts
apps/web/content/question-bank/class-10/science/bank.test.ts
apps/web/content/question-bank/class-10/science/assets/
docs/curriculum/subject-readiness/science.md
```

**Modify:**

```text
apps/web/lib/curriculum/subjects/class-10/science.ts
apps/web/content/question-bank/class-10/science/index.ts
apps/web/lib/question-bank/types.ts
apps/web/lib/question-bank/validation.ts
apps/web/lib/question-bank/paper-assembler.test.ts
docs/project-memory.md
```

## Science Interfaces

```ts
export type ScienceDomain = 'biology' | 'chemistry' | 'physics';

export type ScienceQuestionMetadata = {
  domain: ScienceDomain;
  balancedEquation?: string;
  expectedObservations?: string[];
  experimentSafety?: 'textbook-only' | 'teacher-supervised' | 'student-safe';
  numerical?: {
    acceptedUnits: string[];
    formulae: string[];
    tolerance?: number;
  };
};

export function validateScienceQuestion(question: BoardQuestion): QuestionValidationIssue[];
```

### Task 1: Correct current curriculum and summative scope

- [ ] **Step 1: Add failing unit tests**

Assert:

```ts
assert.deepEqual(subject.units.map((unit) => unit.marks), [25, 25, 12, 13, 5]);
```

Assert all 13 current platform chapters map once.

- [ ] **Step 2: Mark scope from the current curriculum**

The current Science PDF explicitly identifies some topics as formative-only. Represent them with `scope: 'periodic-only'` or `supporting-resource`, not `board-exam`.

At minimum verify Chemical Reactions and Equations includes:

```text
chemical equations
balancing
combination
decomposition
displacement
double displacement
precipitation
endothermic/exothermic
oxidation/reduction
```

- [ ] **Step 3: Document gaps by chapter**

In `science.md`, list for every chapter:

- Current platform pack and quiz
- Required domain
- Required diagrams
- Required experiment/observation families
- Required numerical families
- Summative/formative scope

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/science.ts docs/curriculum/subject-readiness/science.md
git commit -m "Align Science curriculum scope"
```

### Task 2: Implement Science-specific validation

**Files:**
- Create Science validator and tests
- Modify shared types/validation

- [ ] **Step 1: Write failing cases**

Test:

- Chemistry equation not balanced.
- Observation question with no observation.
- Experiment question with no safety classification.
- Physics numerical with no formula or unit.
- Diagram question with no expected labels.
- Biology genetics question with no accepted ratio in model answer.

- [ ] **Step 2: Implement equation atom counting**

Support the simple formulas used in Class 10 authored equations. Store reactants/products separately if parsing arbitrary equation strings is unsafe:

```ts
chemicalEquation?: {
  reactants: Array<{ coefficient: number; formula: string }>;
  products: Array<{ coefficient: number; formula: string }>;
  display: string;
};
```

The validator must compare element totals. Do not claim support for ionic charge balancing beyond authored metadata.

- [ ] **Step 3: Implement domain rules**

- Chemistry reactions require valid equation metadata when the prompt asks for an equation.
- Experiment questions require observations and safety.
- Physics numericals require formulae and accepted units.
- Diagrams require expected labels.
- Genetics rubrics require cross/ratio reasoning.

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
git add apps/web/lib/question-bank/subjects/science.ts apps/web/lib/question-bank/subjects/science.test.ts apps/web/lib/question-bank/types.ts apps/web/lib/question-bank/validation.ts
git commit -m "Validate Science questions"
```

### Task 3: Define Science reviewed-bank quotas

Use:

| Unit | 1 mark | 2 mark | 3 mark | 5 mark | 4-mark case | Required special families |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Chemical Substances | 12 | 5 | 5 | 3 | 3 | 6 equations, 4 observations, 2 experiment items |
| World of Living | 12 | 5 | 5 | 3 | 3 | 6 diagrams/processes, 3 genetics/reproduction items |
| Natural Phenomena | 6 | 3 | 3 | 2 | 2 | 4 ray/eye diagrams, 4 numericals |
| Effects of Current | 7 | 3 | 4 | 2 | 2 | 5 circuit/field diagrams, 6 numericals |
| Natural Resources | 4 | 2 | 2 | 1 | 1 | 3 food-chain/environment cases |

- [ ] **Step 1: Add `assertScienceBankMinimums`**

Failure messages include unit and missing family.

- [ ] **Step 2: Run red test**

- [ ] **Step 3: Commit quota test and documentation**

```powershell
git add apps/web/content/question-bank/class-10/science/bank.test.ts docs/curriculum/subject-readiness/science.md
git commit -m "Define Science question quotas"
```

### Task 4: Author Chemistry and Biology units

- [ ] **Step 1: Author Chemical Substances**

Cover:

- Chemical Reactions and Equations
- Acids, Bases and Salts
- Metals and Non-metals
- Carbon and its Compounds

Every final equation must pass atom validation. Observation answers identify colour, gas, precipitate, temperature, or state where relevant.

- [ ] **Step 2: Verify and commit**

```text
Add Chemistry board questions
```

- [ ] **Step 3: Author World of Living**

Cover:

- Life Processes
- Control and Coordination
- How do Organisms Reproduce?
- Heredity

Add accessible diagrams for heart/circulation, nephron/excretion, neuron/reflex, reproductive structures where assessed, and genetics crosses.

- [ ] **Step 4: Verify and commit**

```text
Add Biology board questions
```

### Task 5: Author Physics and Environment units

- [ ] **Step 1: Author Natural Phenomena**

Cover:

- Light - Reflection and Refraction
- Human Eye and Colourful World

Include mirror/lens numericals, ray diagrams, defects/corrections, dispersion/scattering reasoning.

- [ ] **Step 2: Author Effects of Current**

Cover:

- Electricity
- Magnetic Effects of Electric Current

Include Ohm's law, resistance, series/parallel, power/energy, field lines, motor/generator, domestic circuits.

- [ ] **Step 3: Author Natural Resources**

Cover:

- Our Environment

Include trophic levels, energy flow, biodegradable/non-biodegradable waste, ozone, and case-based environmental decisions.

- [ ] **Step 4: Verify and commit each unit separately**

Use:

```text
Add Natural Phenomena board questions
Add Effects of Current board questions
Add Environment board questions
```

### Task 6: Generate and review three provisional Science papers

- [ ] **Step 1: Encode the latest verified section structure as provisional**

Use the latest official sample-paper structure only with `blueprintStatus: 'provisional-historical'`.

- [ ] **Step 2: Generate seeds**

```text
science-review-1
science-review-2
science-review-3
```

Assert:

- 80 marks.
- Unit weights remain within the profile's exact rules.
- Biology/Chemistry/Physics distribution is valid.
- Every paper includes at least one case question, numerical, diagram/reasoning item, and Chemistry equation item.

- [ ] **Step 3: Manually inspect one paper**

Check:

- Equations
- Units
- Diagrams
- Scientific language
- Safety
- Marking totals

- [ ] **Step 4: Verify and commit**

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
git add apps/web/lib/curriculum/subjects/class-10/science.ts apps/web/lib/question-bank/paper-assembler.test.ts apps/web/content/question-bank/class-10/science docs/curriculum/subject-readiness/science.md
git commit -m "Generate Science review papers"
```

### Task 7: Final checks and memory

```powershell
npm.cmd run test -w apps/web
npm.cmd run lint -w apps/web
npm.cmd run build -w apps/web
graphify update .
git diff --check
```

Record formative-only handling, equation validation limits, and safety conventions in `docs/project-memory.md`.

Commit:

```text
Verify Science board readiness
```

## Acceptance Criteria

- All 13 chapters map correctly.
- Unit weights total 80.
- Formative-only content is excluded from annual readiness.
- Science-specific validation passes.
- Reviewed bank meets quotas.
- Three valid review papers generate.
- Equations, observations, diagrams, experiments, numericals, and safety are checked.
- Existing Science packs and quizzes remain operational.
