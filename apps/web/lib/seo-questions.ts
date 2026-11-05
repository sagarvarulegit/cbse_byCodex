import exemplarHotsRaw from './exemplar-hots.generated.json';
import boardPyqsRaw from './board-pyqs-all.generated.json';
import { PYQ_TRENDS_DATA, type RepeatedConcept } from './pyq-trends';

export type SeoQuestionSourceType = 'ncert_exemplar' | 'cbse_board_pyq' | 'repeated_board_concept';

export type SocraticHint = {
  hintQuestion: string;
  guidingConcept: string;
  firstStepNudge: string;
  formulaOrKeywordTip?: string;
};

export type SeoQuestionItem = {
  id: string;
  slug: string;
  sourceType: SeoQuestionSourceType;
  subjectSlug: string;
  subjectTitle: string;
  subjectCode: string;
  chapterSlug: string;
  chapterTitle: string;
  qNo?: number;
  section?: string;
  year?: number;
  paperSet?: string;
  sets?: string[];
  marks: number;
  questionType: string;
  displayType: string;
  title: string;
  prompt: string;
  options?: { value: number; label: string }[];
  correctOptionIndex?: number | null;
  modelAnswer: string;
  valuePoints: string[];
  examinerNotes: string[];
  orAnswer?: string | null;
  officialRef: string;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  socraticHint: SocraticHint;
  frequencyBadge?: string;
};

const CHAPTER_TITLE_MAP: Record<string, { title: string; subjectTitle: string; subjectSlug: string; subjectCode: string }> = {
  // Science
  'chemical-reactions-and-equations': { title: 'Chemical Reactions and Equations', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'acids-bases-and-salts': { title: 'Acids, Bases and Salts', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'metals-and-non-metals': { title: 'Metals and Non-metals', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'carbon-and-its-compounds': { title: 'Carbon and its Compounds', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'periodic-classification-of-elements': { title: 'Periodic Classification of Elements', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'life-processes': { title: 'Life Processes', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'control-and-coordination': { title: 'Control and Coordination', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'how-do-organisms-reproduce': { title: 'How do Organisms Reproduce?', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'heredity': { title: 'Heredity', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'light-reflection-and-refraction': { title: 'Light – Reflection and Refraction', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'human-eye-and-colourful-world': { title: 'Human Eye and the Colourful World', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'electricity': { title: 'Electricity', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'magnetic-effects-of-electric-current': { title: 'Magnetic Effects of Electric Current', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'sources-of-energy': { title: 'Sources of Energy', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'our-environment': { title: 'Our Environment', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },
  'management-of-natural-resources': { title: 'Management of Natural Resources', subjectTitle: 'Science', subjectSlug: 'science', subjectCode: '086' },

  // Mathematics
  'real-numbers': { title: 'Real Numbers', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'polynomials': { title: 'Polynomials', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'pair-of-linear-equations-in-two-variables': { title: 'Pair of Linear Equations in Two Variables', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'quadratic-equations': { title: 'Quadratic Equations', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'arithmetic-progressions': { title: 'Arithmetic Progressions', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'triangles': { title: 'Triangles', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'coordinate-geometry': { title: 'Coordinate Geometry', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'introduction-to-trigonometry': { title: 'Introduction to Trigonometry', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'some-applications-of-trigonometry': { title: 'Some Applications of Trigonometry', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'circles': { title: 'Circles', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'constructions': { title: 'Constructions', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'areas-related-to-circles': { title: 'Areas Related to Circles', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'surface-areas-and-volumes': { title: 'Surface Areas and Volumes', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'statistics': { title: 'Statistics', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },
  'probability': { title: 'Probability', subjectTitle: 'Mathematics', subjectSlug: 'mathematics-standard', subjectCode: '041' },

  // Social Science
  'nationalism-in-india': { title: 'Nationalism in India', subjectTitle: 'Social Science', subjectSlug: 'social-science', subjectCode: '087' },
  'political-parties': { title: 'Political Parties', subjectTitle: 'Social Science', subjectSlug: 'social-science', subjectCode: '087' },
  'money-and-credit': { title: 'Money and Credit', subjectTitle: 'Social Science', subjectSlug: 'social-science', subjectCode: '087' },
  'manufacturing-industries': { title: 'Manufacturing Industries', subjectTitle: 'Social Science', subjectSlug: 'social-science', subjectCode: '087' },
  'sectors-of-the-indian-economy': { title: 'Sectors of the Indian Economy', subjectTitle: 'Social Science', subjectSlug: 'social-science', subjectCode: '087' },

  // English
  'a-letter-to-god': { title: 'A Letter to God', subjectTitle: 'English Language & Literature', subjectSlug: 'english-language-and-literature', subjectCode: '184' },
  'nelson-mandela-long-walk-to-freedom': { title: 'Nelson Mandela: Long Walk to Freedom', subjectTitle: 'English Language & Literature', subjectSlug: 'english-language-and-literature', subjectCode: '184' },
  'the-ball-poem': { title: 'The Ball Poem', subjectTitle: 'English Language & Literature', subjectSlug: 'english-language-and-literature', subjectCode: '184' },
  'writing-skills': { title: 'Section B: Writing Skills', subjectTitle: 'English Language & Literature', subjectSlug: 'english-language-and-literature', subjectCode: '184' },
};

function formatDisplayType(qType: string, marks: number): string {
  if (qType === 'mcq') return '1-Mark MCQ';
  if (marks === 1) return '1-Mark Objective';
  if (marks === 2 || qType.includes('2m')) return '2-Mark Very Short Answer';
  if (marks === 3 || qType.includes('3m')) return '3-Mark Short Answer';
  if (marks === 4 || qType.includes('case_study')) return '4-Mark Case Study';
  if (marks === 5 || qType.includes('long_answer') || qType.includes('5m')) return '5-Mark Long Answer';
  return `${marks}-Mark Question`;
}

function deriveCleanTopicFromAnswer(ans: string): string {
  const lines = ans.split('\n');
  for (const line of lines.slice(0, 4)) {
    const cleaned = line
      .trim()
      .replace(/^[•\-\*]\s*/, '')
      .replace(/^(\([a-z0-9]+\)\s*)+/i, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (cleaned.length > 5 && !cleaned.toLowerCase().startsWith('hint')) {
      return cleaned.length > 70 ? `${cleaned.slice(0, 67).trim()}…` : cleaned;
    }
  }
  return 'Official CBSE Marking Scheme Solution';
}

function generateSocraticHint(
  prompt: string,
  modelAnswer: string,
  chapterTitle: string,
  marks: number,
  isMcq: boolean
): SocraticHint {
  const pLower = prompt.toLowerCase();
  const aLower = modelAnswer.toLowerCase();

  // Science / Chemistry
  if (pLower.includes('reaction') || pLower.includes('oxid') || aLower.includes('reaction')) {
    return {
      hintQuestion: 'Which substances undergo oxidation (gain of oxygen/loss of electrons) and reduction here?',
      guidingConcept: `Chemical changes and balancing rules from ${chapterTitle}.`,
      firstStepNudge: 'Write the skeletal equation first, then balance atoms on reactant and product sides before identifying agents.',
      formulaOrKeywordTip: 'Remember: the substance oxidised acts as the reducing agent!',
    };
  }

  // Science / Physics Optics
  if (pLower.includes('mirror') || pLower.includes('lens') || pLower.includes('focal')) {
    return {
      hintQuestion: 'What does the New Cartesian Sign Convention tell you about the focal length and object distance?',
      guidingConcept: 'Mirror & Lens Formulas with real vs virtual image properties.',
      firstStepNudge: 'Always write given values with explicit signs (e.g. u is always negative in front of mirror/lens).',
      formulaOrKeywordTip: 'Mirror: 1/f = 1/v + 1/u, m = -v/u. Lens: 1/f = 1/v - 1/u, m = v/u.',
    };
  }

  // Science / Physics Electricity
  if (pLower.includes('current') || pLower.includes('resistance') || pLower.includes('circuit') || pLower.includes('volt')) {
    return {
      hintQuestion: 'Are the components in series (constant current) or parallel (constant voltage)?',
      guidingConcept: "Ohm's Law (V = IR) & Joule's Heating (H = I²Rt).",
      firstStepNudge: 'Calculate equivalent resistance step-by-step: 1/Rp = 1/R1 + 1/R2 or Rs = R1 + R2.',
      formulaOrKeywordTip: 'Commercial energy unit: 1 kWh = 3.6 × 10⁶ J.',
    };
  }

  // Science / Biology
  if (pLower.includes('nephron') || pLower.includes('photosynthesis') || pLower.includes('respiration') || pLower.includes('heart') || pLower.includes('stomata')) {
    return {
      hintQuestion: 'What are the 3 sequential physiological stages or anatomical structures involved?',
      guidingConcept: `Sequential biological mechanisms in ${chapterTitle}.`,
      firstStepNudge: 'Structure your answer with numbered points: 1. Organ/Site, 2. Process/Enzyme, 3. Function.',
      formulaOrKeywordTip: 'CBSE examiners award half-marks for precise biological keywords and labels.',
    };
  }

  // Mathematics / Quadratic & AP
  if (pLower.includes('root') || pLower.includes('arithmetic') || pLower.includes('equation') || pLower.includes('quadratic')) {
    return {
      hintQuestion: 'What condition connects the discriminant (D = b² - 4ac) or nth term formula (an = a + (n-1)d)?',
      guidingConcept: `Algebraic formulas and discriminant conditions in ${chapterTitle}.`,
      firstStepNudge: 'State the formula first. Identify a, b, c or first term a and common difference d.',
      formulaOrKeywordTip: 'Equal roots condition: D = b² - 4ac = 0.',
    };
  }

  // Mathematics / Geometry & Trigonometry
  if (pLower.includes('triangle') || pLower.includes('prove') || pLower.includes('tangent') || pLower.includes('sin') || pLower.includes('cos')) {
    return {
      hintQuestion: 'Can you rewrite the expression in terms of sin θ and cos θ, or apply standard identities like sin²θ + cos²θ = 1?',
      guidingConcept: `Standard CBSE theorem proofs and identities in ${chapterTitle}.`,
      firstStepNudge: 'Start with LHS. Factorise, rationalise the denominator, or use sec²θ - tan²θ = 1.',
      formulaOrKeywordTip: 'Theorem proofs require: Given, To Prove, Construction, and Proof steps.',
    };
  }

  // General fallback
  if (isMcq) {
    return {
      hintQuestion: 'Can you eliminate the two obviously false options based on NCERT textbook definitions?',
      guidingConcept: `Core definitions and properties from ${chapterTitle}.`,
      firstStepNudge: 'Carefully re-read the question stem for words like "NOT", "INCORRECT", or "EXCEPT".',
    };
  }

  return {
    hintQuestion: `What are the exact value points required by CBSE for a ${marks}-mark question on this topic?`,
    guidingConcept: `Official NCERT syllabus guidelines for ${chapterTitle}.`,
    firstStepNudge: `Provide ${marks <= 2 ? '2 concise points' : `${marks} distinct points`} with technical keywords and proper units.`,
  };
}

let CACHED_ALL_QUESTIONS: SeoQuestionItem[] | null = null;
let CACHED_QUESTIONS_BY_SLUG: Map<string, SeoQuestionItem> | null = null;

function buildAllSeoQuestions(): SeoQuestionItem[] {
  const all: SeoQuestionItem[] = [];
  const seenSlugs = new Set<string>();

  // 1. Ingest NCERT Exemplar HOTS (1,107 questions)
  const exemplarMap = exemplarHotsRaw as Record<string, any[]>;
  for (const [chapterSlug, qList] of Object.entries(exemplarMap)) {
    const chMeta = CHAPTER_TITLE_MAP[chapterSlug] ?? {
      title: chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      subjectTitle: 'Science',
      subjectSlug: 'science',
      subjectCode: '086',
    };

    for (const q of qList) {
      const qNo = q.qNo;
      const isMcq = q.questionType === 'mcq';
      const prompt = q.prompt || '';
      const modelAnswer = q.explanation || '';
      const marks = q.marks || (isMcq ? 1.0 : 3.0);
      const slug = q.id;

      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      const title = isMcq
        ? `NCERT Exemplar Class 10 ${chMeta.subjectTitle} Ch ${q.chapterNumber || ''} Q${qNo}: ${prompt.slice(0, 55).replace(/\n/g, ' ')}...`
        : `NCERT Exemplar HOTS Class 10 ${chMeta.title} Q${qNo}: ${prompt.slice(0, 55).replace(/\n/g, ' ')}...`;

      all.push({
        id: q.id,
        slug,
        sourceType: 'ncert_exemplar',
        subjectSlug: chMeta.subjectSlug,
        subjectTitle: chMeta.subjectTitle,
        subjectCode: chMeta.subjectCode,
        chapterSlug,
        chapterTitle: chMeta.title,
        qNo,
        section: q.section,
        marks,
        questionType: q.questionType,
        displayType: formatDisplayType(q.questionType, marks),
        title,
        prompt,
        options: q.options && q.options.length > 0 ? q.options : undefined,
        correctOptionIndex: q.correctOptionIndex,
        modelAnswer,
        valuePoints: q.valuePoints && q.valuePoints.length > 0 ? q.valuePoints : [modelAnswer],
        examinerNotes: [],
        officialRef: q.sourceCoverage || `NCERT Exemplar Class 10 ${chMeta.subjectTitle}, Chapter ${q.chapterNumber || ''} (Q${qNo})`,
        difficulty: 'Hard',
        socraticHint: generateSocraticHint(prompt, modelAnswer, chMeta.title, marks, isMcq),
        frequencyBadge: 'Official NCERT Exemplar HOTS',
      });
    }
  }

  // 2. Ingest Board Exam PYQs (546 questions from 2026 sets)
  const boardPyqs = boardPyqsRaw as any[];
  for (const q of boardPyqs) {
    const slug = q.id;
    if (seenSlugs.has(slug)) continue;
    seenSlugs.add(slug);

    const chMeta = CHAPTER_TITLE_MAP[q.chapterSlug] ?? {
      title: q.chapterSlug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      subjectTitle: 'Science',
      subjectSlug: 'science',
      subjectCode: '086',
    };

    const isMcq = q.questionType === 'mcq' || q.marks === 1.0;
    const cleanTopic = deriveCleanTopicFromAnswer(q.mainAnswer);
    const prompt = q.question
      ? q.question
      : `[CBSE Board Question on ${cleanTopic}]\nState the official CBSE value points and model steps required for full marks in this examination question.`;

    const title = `CBSE 2026 ${chMeta.subjectTitle} Set ${q.paperSet} Q${q.qNo}: ${cleanTopic}`;

    all.push({
      id: q.id,
      slug,
      sourceType: 'cbse_board_pyq',
      subjectSlug: chMeta.subjectSlug,
      subjectTitle: chMeta.subjectTitle,
      subjectCode: chMeta.subjectCode,
      chapterSlug: q.chapterSlug,
      chapterTitle: chMeta.title,
      qNo: q.qNo,
      section: q.section,
      year: q.year || 2026,
      paperSet: q.paperSet,
      sets: q.sets || [`2026 Set ${q.paperSet}`],
      marks: q.marks,
      questionType: q.questionType,
      displayType: formatDisplayType(q.questionType, q.marks),
      title,
      prompt,
      modelAnswer: q.mainAnswer,
      valuePoints: q.valuePoints || [q.mainAnswer],
      examinerNotes: q.examinerNotes || [],
      orAnswer: q.orAnswer || null,
      officialRef: q.officialBoardRef || `CBSE Board Exam 2026 · Class 10 Science (Set ${q.paperSet}, Q${q.qNo})`,
      difficulty: q.marks >= 5 ? 'Hard' : q.marks >= 3 ? 'Moderate' : 'Easy',
      socraticHint: generateSocraticHint(prompt, q.mainAnswer, chMeta.title, q.marks, isMcq),
      frequencyBadge: `CBSE Board 2026 · Set ${q.paperSet}`,
    });
  }

  // 3. Ingest 5-Year Repeated Board Concepts (2022–2026 multi-year trends)
  for (const [subjKey, trend] of Object.entries(PYQ_TRENDS_DATA)) {
    for (const rc of trend.repeatedConcepts) {
      const slug = `repeated-${rc.id}`;
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      const chMeta = CHAPTER_TITLE_MAP[rc.chapterSlug] ?? {
        title: rc.chapterTitle,
        subjectTitle: trend.title,
        subjectSlug: subjKey,
        subjectCode: trend.code,
      };

      const title = `CBSE Class 10 ${trend.title}: ${rc.conceptTitle} (${rc.frequencyBadge})`;

      const valuePoints = [
        `[+1.0 Mark] Formula / Fundamental Statement: State the governing theorem or definition`,
        `[+2.0 Marks] Core Working / Derivation: ${rc.examinerExpectation}`,
        `[+${rc.typicalMarks > 3 ? (rc.typicalMarks - 3).toFixed(1) : '1.0'} Mark] Conclusion & Units: Provide the final answer with required units and labels`,
      ];

      all.push({
        id: slug,
        slug,
        sourceType: 'repeated_board_concept',
        subjectSlug: subjKey,
        subjectTitle: trend.title,
        subjectCode: trend.code,
        chapterSlug: rc.chapterSlug,
        chapterTitle: chMeta.title,
        marks: rc.typicalMarks,
        questionType: rc.questionType.toLowerCase().includes('case study') ? 'case_study' : rc.typicalMarks >= 5 ? 'long_answer' : 'short_answer',
        displayType: rc.questionType,
        title,
        prompt: rc.questionPromptSample,
        modelAnswer: rc.examinerExpectation,
        valuePoints,
        examinerNotes: [`Frequent Board Pattern: Verified in ${rc.boardSets.join(', ')} across exam years ${rc.frequentYears.join(', ')}`],
        officialRef: `CBSE Board Exam 5-Year Trend (2022–2026) · ${rc.chapterTitle} (${rc.frequencyBadge})`,
        difficulty: rc.typicalMarks >= 5 ? 'Hard' : 'Moderate',
        socraticHint: generateSocraticHint(rc.questionPromptSample, rc.examinerExpectation, chMeta.title, rc.typicalMarks, false),
        frequencyBadge: rc.frequencyBadge,
      });
    }
  }

  return all;
}

export function getAllSeoQuestions(): SeoQuestionItem[] {
  if (!CACHED_ALL_QUESTIONS) {
    CACHED_ALL_QUESTIONS = buildAllSeoQuestions();
  }
  return CACHED_ALL_QUESTIONS;
}

export function getSeoQuestionBySlug(slug: string): SeoQuestionItem | undefined {
  if (!CACHED_QUESTIONS_BY_SLUG) {
    const all = getAllSeoQuestions();
    CACHED_QUESTIONS_BY_SLUG = new Map<string, SeoQuestionItem>();
    for (const q of all) {
      CACHED_QUESTIONS_BY_SLUG.set(q.slug, q);
    }
  }
  return CACHED_QUESTIONS_BY_SLUG.get(slug);
}

export function getAllSeoQuestionSlugs(): string[] {
  return getAllSeoQuestions().map((q) => q.slug);
}

export function getRelatedSeoQuestions(current: SeoQuestionItem, limit = 4): SeoQuestionItem[] {
  const all = getAllSeoQuestions();
  return all
    .filter((q) => q.slug !== current.slug && q.chapterSlug === current.chapterSlug)
    .slice(0, limit);
}
