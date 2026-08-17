import type { BankQuestion } from '../types.js';

type QuestionDraft = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'> & {
  subjectSlug?: 'english-language-and-literature';
  verificationStatus?: BankQuestion['verificationStatus'];
};

function q(draft: QuestionDraft): BankQuestion {
  return {
    ...draft,
    subjectSlug: 'english-language-and-literature',
    verificationStatus: draft.verificationStatus ?? 'review',
  };
}

/**
 * Curated starter question bank for CBSE Class 10 English Language & Literature (184).
 * Aligned to NCERT First Flight, Footprints Without Feet, and CBSE Grammar/Writing/Reading specifications:
 * 1. Section A: Reading (20 marks)
 * 2. Section B: Writing Skills and Grammar (20 marks)
 * 3. Section C: Language through Literature (40 marks)
 */
export const ENGLISH_184_SEED: BankQuestion[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // ── Section A · Reading Skills (20 marks) ─────────────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 1. Reading - Discursive Passage Vocabulary (MCQ 1m)
  q({
    bankKey: 'eng-184-read-discursive-vocab-mcq-1',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the sentence: "The relentless pursuit of material wealth often creates an insidious sense of alienation among modern youth." Which of the following words is closest in meaning to "insidious"?',
        answerKey: {
          options: ['Gradual and harmful', 'Sudden and violent', 'Obvious and loud', 'Pleasant and delightful'],
          correctOptionIndex: 0,
          valuePoints: ['"Insidious" means proceeding in a gradual, subtle way, but with harmful effects.'],
          modelAnswer: 'Gradual and harmful',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'In an argumentative passage on mindfulness, the author remarks: "True resilience is not the absence of adversity, but the capacity to recuperate." The word "recuperate" means:',
        answerKey: {
          options: ['Recover or bounce back', 'Give up in despair', 'Resist aggressively', 'Retaliate immediately'],
          correctOptionIndex: 0,
          valuePoints: ['"Recuperate" means to recover from illness, exertion, or setback.'],
          modelAnswer: 'Recover or bounce back',
        },
      },
    ],
  }),

  // 2. Reading - Inference & Author Tone (MCQ 1m)
  q({
    bankKey: 'eng-184-read-tone-inference-mcq-2',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'When an author presents empirical data on climate change alongside constructive ecological solutions, the tone of the passage is best described as:',
        answerKey: {
          options: ['Objective and pragmatic', 'Cynical and despairing', 'Sarcastic and mocking', 'Aggressive and hostile'],
          correctOptionIndex: 0,
          valuePoints: ['Balancing factual evidence with practical solutions indicates an objective and pragmatic tone.'],
          modelAnswer: 'Objective and pragmatic',
        },
      },
    ],
  }),

  // 3. Reading - Case-Based Statistical Fact (MCQ 1m)
  q({
    bankKey: 'eng-184-read-case-factual-mcq-3',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'According to a survey chart on renewable energy adoption, solar installations increased by 45% while wind energy grew by 20%. Which deduction is logically valid?',
        answerKey: {
          options: [
            'Solar power recorded a higher growth percentage compared to wind power during the surveyed period.',
            'Wind energy capacity is completely obsolete in modern power grids.',
            'Fossil fuel consumption increased by 65% in the same timeframe.',
            'Hydroelectric power installations were zero.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['45% growth in solar exceeds 20% growth in wind power directly from the data.'],
          modelAnswer: 'Solar power recorded a higher growth percentage compared to wind power during the surveyed period.',
        },
      },
    ],
  }),

  // 4. Reading - Comprehension Passage Case Study 1 (5m)
  q({
    bankKey: 'eng-184-read-discursive-passage-case-1',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'case-study',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the passage given below and answer the questions that follow:\n\nIn our hurried modern lives, silence has become an endangered commodity. From blaring traffic to incessant smartphone notifications, our sensory apparatus is continually bombarded with acoustic clutter. Neuroscientists suggest that deliberate periods of silence foster neurogenesis—the growth of new brain cells in the hippocampus, the region governing memory and learning. When external noise ceases, the brain enters its default mode network, allowing internal reflection, consolidation of memories, and creative problem solving. Cultivating twenty minutes of daily quiet time is not mere escapism; it is a cognitive necessity.\n\n(i) Why does the author refer to silence as an "endangered commodity"? (1 mark)\n(ii) State one neurological benefit of silence mentioned in the passage. (1 mark)\n(iii) What happens when the brain activates its "default mode network"? (1 mark)\n(iv) Explain why the author concludes that quiet time is a "cognitive necessity" rather than escapism. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Because constant urban noise and digital notifications leave people with virtually no quiet moments in daily life [1 mark].',
            '(ii) Fosters neurogenesis (generation of new neurons) in the hippocampus, enhancing memory and learning [1 mark].',
            '(iii) Enables internal reflection, memory consolidation, and creative problem solving [1 mark].',
            '(iv) Because silence actively restores mental stamina and enhances cognitive faculties rather than being an unproductive evasion of responsibilities [2 marks].',
          ],
          modelAnswer:
            '(i) Silence is scarce due to pervasive environmental noise and persistent smartphone notifications.\n(ii) Silence stimulates neurogenesis—the formation of new brain cells in the hippocampus.\n(iii) The default mode network facilitates introspective reflection, memory consolidation, and creative ideation.\n(iv) Quiet time is essential because it actively repairs cognitive fatigue, stimulates neural growth, and enhances problem-solving ability, making it indispensable for mental health rather than a mere leisure escape.',
        },
      },
    ],
  }),

  // 5. Reading - Case-Based Factual Passage Study 2 (5m)
  q({
    bankKey: 'eng-184-read-factual-passage-case-2',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'case-study',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the case study on electric mobility in Indian cities and answer the questions:\n\nA 2025 urban transport survey across six metropolitan cities indicated that 62% of daily commuters travel less than 15 kilometres per single trip. Among two-wheeler owners, 74% expressed willingness to switch to Electric Vehicles (EVs) provided charging infrastructure is available within a 2 km radius. However, 58% cited high battery replacement costs and inadequate public charging stations as their chief hesitations. The survey concluded that targeted municipal subsidies on charging hubs could accelerate EV adoption by up to 40% in three years.\n\n(i) What percentage of commuters travel under 15 km per trip? (1 mark)\n(ii) What condition was highlighted by two-wheeler owners for switching to EVs? (1 mark)\n(iii) Mention two primary consumer deterrents in adopting EVs. (1 mark)\n(iv) Based on the findings, suggest two policy recommendations municipal corporations should implement to accelerate electric mobility. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) 62% of commuters [1 mark].',
            '(ii) Availability of charging infrastructure within a 2 km radius [1 mark].',
            '(iii) High battery replacement costs and inadequate public charging stations [1 mark].',
            '(iv) Establish subsidised public charging hubs within 2 km grids and provide battery replacement subsidies/standardisation [2 marks].',
          ],
          modelAnswer:
            '(i) 62% of urban commuters.\n(ii) Readily accessible charging stations within a 2 km radius.\n(iii) Fear of expensive battery replacements and scarcity of public charging spots.\n(iv) Municipal recommendations:\n1. Expand accessible public EV charging points across residential and commercial zones.\n2. Introduce municipal subsidies or battery-swapping policies to lower initial investment and maintenance concerns for consumers.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Section B · Writing Skills & Grammar (20 marks) ───────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 6. Grammar - Tenses & Gap Filling (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-tenses-mcq-1',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-tenses',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Fill in the blank with the correct tense form:\nBy the time the chief guest arrived at the venue, the cultural performance ______ already.',
        answerKey: {
          options: ['had begun', 'has begun', 'began', 'was beginning'],
          correctOptionIndex: 0,
          valuePoints: ['Past perfect tense (had begun) is used for an action completed before another past event.'],
          modelAnswer: 'had begun',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'Fill in the blank by choosing the correct option:\nThe scientist confirmed that the experiment ______ unexpected results since last month.',
        answerKey: {
          options: ['has been yielding', 'yielded', 'was yielded', 'had yield'],
          correctOptionIndex: 0,
          valuePoints: ['Present perfect continuous tense (has been yielding) indicates an action continuing from the past up to the present.'],
          modelAnswer: 'has been yielding',
        },
      },
    ],
  }),

  // 7. Grammar - Modals (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-modals-mcq-2',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-modals',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Choose the correct modal to complete the sentence:\n"You ______ obey the traffic signals to ensure road safety," warned the traffic warden.',
        answerKey: {
          options: ['must', 'might', 'could', 'may'],
          correctOptionIndex: 0,
          valuePoints: ['"Must" expresses obligatory duty/compulsion.'],
          modelAnswer: 'must',
        },
      },
    ],
  }),

  // 8. Grammar - Subject-Verb Concord (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-concord-mcq-3',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-subject-verb-concord',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Select the correct option to fill in the blank:\nNeither the captain nor the crew members ______ aware of the approaching tempest.',
        answerKey: {
          options: ['were', 'was', 'is', 'has been'],
          correctOptionIndex: 0,
          valuePoints: ['When subjects are joined by "neither...nor", the verb agrees with the nearer subject ("crew members" is plural -> "were").'],
          modelAnswer: 'were',
        },
      },
    ],
  }),

  // 9. Grammar - Reported Speech (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-reported-speech-mcq-4',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-reported-speech',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Report the dialogue between Rahul and Dr. Mehta:\nRahul: "Doctor, when can I resume my football practice?"\nDr. Mehta: "You should rest for two more weeks."\nRahul asked Dr. Mehta ______.',
        answerKey: {
          options: [
            'when he could resume his football practice',
            'when can he resume his football practice',
            'that when he could resume his football practice',
            'if he could resume his football practice',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Wh-question in reported speech becomes statement word order (when he could resume his football practice).'],
          modelAnswer: 'when he could resume his football practice',
        },
      },
    ],
  }),

  // 10. Grammar - Determiners (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-determiners-mcq-5',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-determiners',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Fill in the blank with the appropriate determiner:\n"There were ______ participants in the debate than we anticipated last year."',
        answerKey: {
          options: ['fewer', 'less', 'little', 'much'],
          correctOptionIndex: 0,
          valuePoints: ['"Fewer" is used with countable plural nouns (participants).'],
          modelAnswer: 'fewer',
        },
      },
    ],
  }),

  // 11. Writing - Formal Letter (5m)
  q({
    bankKey: 'eng-184-write-formal-letter-5m-1',
    chapterSlug: 'formal-letter',
    unitId: 'writing-and-grammar',
    topicId: 'writing-formal-letter',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'You are Rohit/Radhika, a resident of 12, Green Park Avenue, New Delhi. You are deeply concerned about the reckless disposal of single-use plastic waste in your local municipal parks. Write a letter to the Editor of "The National Herald" in 100–120 words highlighting the ecological nuisance and suggesting practical community-level solutions.',
        answerKey: {
          valuePoints: [
            'Format: Sender address, Date, Receiver address, Subject, Salutation, Body paragraphs, Complimentary close [1 mark].',
            'Content: Description of plastic litter in parks, health and environmental hazards to stray animals and soil, lack of municipal bins [2 marks].',
            'Organization & Suggestions: Proposing strict penalties, segregated bins, community cleanup drives, awareness boards [1 mark].',
            'Accuracy: Appropriate tone, grammar, spelling, and coherence [1 mark].',
          ],
          modelAnswer:
            '12, Green Park Avenue\nNew Delhi\n15th October 2026\n\nThe Editor\nThe National Herald\nNew Delhi\n\nSubject: Menace of Single-Use Plastic Waste in Local Municipal Parks\n\nSir/Madam,\nThrough the columns of your esteemed newspaper, I wish to draw the attention of the municipal authorities and the general public towards the rampant dumping of single-use plastic in Green Park municipal grounds.\n\nOur public parks, once hubs of recreation, are now littered with plastic wrappers, beverage cups, and polythene bags. This not only spoils the aesthetic beauty but also poses grave hazards to birds and stray animals that inadvertently ingest plastic.\n\nTo curb this menace, the Municipal Corporation must install segregated waste bins and enforce strict fines on littering. In addition, resident welfare associations should organise weekly cleanliness drives and awareness workshops.\n\nI hope this letter spurs urgent remedial action.\n\nYours sincerely,\nRadhika / Rohit',
        },
      },
    ],
  }),

  // 12. Writing - Analytical Paragraph (5m)
  q({
    bankKey: 'eng-184-write-analytical-paragraph-5m-1',
    chapterSlug: 'analytical-paragraph',
    unitId: 'writing-and-grammar',
    topicId: 'writing-analytical-paragraph',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The bar chart below shows the preferred leisure activities among teenagers in 2020 vs 2025 (Screen gaming: 35% -> 55%, Outdoor sports: 30% -> 15%, Reading books: 20% -> 10%, Art/Music: 15% -> 20%). Write an analytical paragraph in 100–120 words summarising the data, making comparisons, and drawing a valid conclusion.',
        answerKey: {
          valuePoints: [
            'Introductory statement introducing the chart parameters and period [1 mark].',
            'Data analysis with accurate comparative figures (surge in screen gaming vs sharp decline in outdoor sports and reading) [2 marks].',
            'Observation on creative arts (modest increase) and synthesis of lifestyle shift [1 mark].',
            'Concluding sentence with grammatical accuracy and formal analytical vocabulary [1 mark].',
          ],
          modelAnswer:
            'The given data illustrates a noticeable shift in adolescent leisure preferences between 2020 and 2025. Screen gaming registered the most dramatic surge, escalating from 35% to a dominant 55%, reflecting growing digital immersion. Conversely, outdoor physical sports witnessed a sharp 50% drop, plummeting from 30% down to 15%. Traditional book reading also dwindled from 20% to a mere 10%. Interestingly, engagement in artistic and musical hobbies saw a modest uptick, rising from 15% to 20%.\n\nOverall, the trend highlights an increasing inclination towards sedentary, screen-centric entertainment at the expense of outdoor physical recreation and sustained reading habits among contemporary teenagers.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Section C · Language through Literature (40 marks) ────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 13. Literature Extract - Prose (First Flight) (5m)
  q({
    bankKey: 'eng-184-lit-letter-to-god-extract-5m-1',
    chapterSlug: 'prose-a-letter-to-god',
    unitId: 'literature',
    topicId: 'prose-a-letter-to-god-official-text',
    questionType: 'extract-based',
    marks: 5,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the extract given below and answer the questions:\n"With a satisfied expression he regarded the field of ripe corn with its flowers, draped in a curtain of rain. But suddenly a strong wind began to blow and along with the rain very large hailstones began to fall. These truly did resemble new silver coins. The boys, exposing themselves to the rain, ran out to collect the frozen pearls."\n\n(i) Who is "he" in the opening sentence? (1 mark)\n(ii) What were the "frozen pearls" that the boys ran out to collect? (1 mark)\n(iii) Why did the hailstones initially resemble "new silver coins" to Lencho? (1 mark)\n(iv) How did this sudden change in weather turn Lencho’s satisfaction into utter despair? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Lencho [1 mark].',
            '(ii) Hailstones [1 mark].',
            '(iii) Because they were bright, round, and white, promising prosperity before turning destructive [1 mark].',
            '(iv) The continuous hailstorm for an hour devastated the entire ripe corn crop, leaving not a leaf on the trees and threatening his family with starvation [2 marks].',
          ],
          modelAnswer:
            '(i) Lencho.\n(ii) The hailstones falling from the sky.\n(iii) Lencho initially associated rain with prosperous harvest and economic reward (silver coins).\n(iv) The torrential hailstorm lasted an hour and completely annihilated Lencho’s ripe cornfields and blossoms, destroying his sole source of livelihood and plunging his family into existential dread of starvation.',
        },
      },
    ],
  }),

  // 14. Literature Extract - Poetry (First Flight) (5m)
  q({
    bankKey: 'eng-184-lit-tiger-in-the-zoo-extract-5m-2',
    chapterSlug: 'poem-a-tiger-in-the-zoo',
    unitId: 'literature',
    topicId: 'poem-a-tiger-in-the-zoo-official-text',
    questionType: 'extract-based',
    marks: 5,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the extract from the poem and answer the questions:\n"He should be lurking in shadow,\nSliding through long grass\nNear the water hole\nWhere plump deer pass."\n\n(i) Name the poem and the poet. (1 mark)\n(ii) Where should the tiger ideally be according to the poet? (1 mark)\n(iii) Why does the tiger wait near the water hole? (1 mark)\n(iv) Contrast the tiger’s natural habitat depicted here with his plight in the concrete cell. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Poem: A Tiger in the Zoo; Poet: Leslie Norris [1 mark].',
            '(ii) In the wild jungle / natural forest [1 mark].',
            '(iii) To hunt plump deer that come to drink water [1 mark].',
            '(iv) In the wild, the tiger moves freely, stalks prey with majestic stealth, and terrorises villages; in the zoo, his fierce strength is locked behind bars, pacing helpless and ignoring visitors [2 marks].',
          ],
          modelAnswer:
            '(i) Poem: "A Tiger in the Zoo"; Poet: Leslie Norris.\n(ii) In his natural jungle habitat.\n(iii) To ambush healthy, plump deer that frequent the watering hole.\n(iv) In nature, the tiger is a majestic, untamed predator exercising freedom and instinct; trapped in the concrete cell, his pride is suppressed, reduced to a powerless spectacle pacing the narrow confines of his cage.',
        },
      },
    ],
  }),

  // 15. Literature Short Answer - Nelson Mandela (SA 3m)
  q({
    bankKey: 'eng-184-lit-mandela-twin-obligations-sa-1',
    chapterSlug: 'prose-nelson-mandela-long-walk-to-freedom',
    unitId: 'literature',
    topicId: 'prose-nelson-mandela-long-walk-to-freedom-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What "twin obligations" does Nelson Mandela mention in his autobiography? Why was it impossible for a man of his colour in South Africa to fulfill both obligations?',
        answerKey: {
          valuePoints: [
            'Twin obligations: (i) Obligation to his family, parents, wife, and children; (ii) Obligation to his people, community, and country [1½ marks].',
            'Reason: Under Apartheid, a black man who attempted to live as a human being and fulfill duty to his people was brutally isolated, branded an outlaw, and torn from his family [1½ marks].',
          ],
          modelAnswer:
            'Mandela states that every man has twin obligations:\n1. Personal: Towards his parents, wife, and children.\n2. Public: Towards his community, people, and nation.\n\nIn Apartheid South Africa, a man of colour could not fulfill both because fighting for basic human rights and dignity resulted in relentless persecution, imprisonment, and forced separation from his family.',
        },
      },
    ],
  }),

  // 16. Literature Short Answer - From Diary of Anne Frank (SA 3m)
  q({
    bankKey: 'eng-184-lit-anne-frank-kitty-sa-2',
    chapterSlug: 'prose-from-the-diary-of-anne-frank',
    unitId: 'literature',
    topicId: 'prose-from-the-diary-of-anne-frank-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why did Anne Frank decide to keep a diary? Why did she name her diary "Kitty"?',
        answerKey: {
          valuePoints: [
            'Need: She felt that "paper has more patience than people"; despite having loving parents and friends, she had no true confidant to share her intimate innermost feelings [1½ marks].',
            'Naming: She wanted her diary to be her real friend rather than a dry record of facts, so she affectionately named it "Kitty" [1½ marks].',
          ],
          modelAnswer:
            '1. Anne believed that "paper has more patience than people." Though surrounded by family and admirers, she lacked a true, intimate friend with whom she could confide her deepest vulnerabilities.\n2. She envisioned her diary as a living companion rather than a ledger of routine facts, christening it "Kitty."',
        },
      },
    ],
  }),

  // 17. Literature Short Answer - The Ball Poem (SA 3m)
  q({
    bankKey: 'eng-184-lit-ball-poem-epistemology-sa-3',
    chapterSlug: 'poem-the-ball-poem',
    unitId: 'literature',
    topicId: 'poem-the-ball-poem-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What does the poet mean by "the epistemology of loss" in "The Ball Poem"? What lesson is the young boy learning?',
        answerKey: {
          valuePoints: [
            'Meaning: "Epistemology of loss" refers to understanding the nature and reality of loss—that loss is an inevitable part of human existence [1½ marks].',
            'Lesson: The boy learns to bear grief, accept responsibility in a world of possessions, and understand that money cannot buy back cherished memories and innocence [1½ marks].',
          ],
          modelAnswer:
            '1. "Epistemology of loss" denotes the philosophical understanding of how to cope with grief and the inevitability of losing loved things in life.\n2. By losing his ball, the boy experiences his first lesson in responsibility, discovering that material replacements cannot substitute emotional bonds and that moving forward despite loss is essential to growing up.',
        },
      },
    ],
  }),

  // 18. Literature Short Answer - A Triumph of Surgery (SA 3m)
  q({
    bankKey: 'eng-184-lit-triumph-surgery-tricki-sa-4',
    chapterSlug: 'supplementary-a-triumph-of-surgery',
    unitId: 'literature',
    topicId: 'supplementary-a-triumph-of-surgery-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How did Dr. James Herriot cure Tricki without administering any medicinal injections or surgical procedures?',
        answerKey: {
          valuePoints: [
            'Dietary restriction: Kept Tricki on a strict fast with no food for two days, giving him plenty of water [1 mark].',
            'Physical exercise: Made him run and jostle with the other dogs at the surgery [1 mark].',
            'Result: Restored normal metabolic energy and vitality purely through natural diet regulation and exercise [1 mark].',
          ],
          modelAnswer:
            'Dr. Herriot cured Tricki without drugs or surgery by:\n1. Fasting: Restricting Tricki’s food intake entirely for two days while providing abundant fresh water.\n2. Physical Activity: Encouraging him to run, play, and compete with other dogs in the open yard.\n3. This strict dietary regimen and active lifestyle rapidly burned off Tricki’s excessive body fat and restored his vitality.',
        },
      },
    ],
  }),

  // 19. Literature Short Answer - The Thief\'s Story (SA 3m)
  q({
    bankKey: 'eng-184-lit-thiefs-story-anil-sa-5',
    chapterSlug: 'supplementary-the-thiefs-story',
    unitId: 'literature',
    topicId: 'supplementary-the-thiefs-story-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why did Hari Singh return to Anil after stealing his money at the railway station?',
        answerKey: {
          valuePoints: [
            'Guilt & Trust: Anil had trusted Hari unconditionally; stealing from a careless, noble man caused acute guilt [1 mark].',
            'Value of Education: Hari realized that learning to read and write complete sentences from Anil would make him a respected, genuinely successful person, far more valuable than a few stolen hundred rupees [2 marks].',
          ],
          modelAnswer:
            'Hari Singh returned because:\n1. Anil’s unconditional trust and kindness pricked his conscience; breaking such trust caused immense remorse.\n2. He realised that the stolen money would only buy transient comfort, whereas literacy and education from Anil would give him lifelong dignity, self-respect, and honest success.',
        },
      },
    ],
  }),

  // 20. Literature Short Answer - Bholi (SA 3m)
  q({
    bankKey: 'eng-184-lit-bholi-teacher-sa-6',
    chapterSlug: 'supplementary-bholi',
    unitId: 'literature',
    topicId: 'supplementary-bholi-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How did Bholi’s teacher play a transformative role in changing her from a neglected "dumb cow" into an assertive, confident young woman?',
        answerKey: {
          valuePoints: [
            'Kindness & Encouragement: Spoke to her in a soothing, affectionate voice devoid of mockery, giving her confidence to speak without stammering [1½ marks].',
            'Education & Self-Worth: Instilled knowledge, moral strength, and self-respect, empowering her to boldly reject the greedy, elderly bridegroom Bishamber [1½ marks].',
          ],
          modelAnswer:
            '1. The teacher showered Bholi with gentle encouragement and affectionate patience, eliminating her fear of mockery and overcoming her stammer.\n2. Education endowed Bholi with profound self-respect and courage, transforming a meek, neglected child into an empowered woman capable of publicly refusing a humiliating dowry demand.',
        },
      },
    ],
  }),

  // 21. Literature Long Answer - Madam Rides the Bus (6m)
  q({
    bankKey: 'eng-184-lit-valli-bus-journey-la-1',
    chapterSlug: 'prose-madam-rides-the-bus',
    unitId: 'literature',
    topicId: 'prose-madam-rides-the-bus-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Valli’s journey to the town is not merely a sightseeing excursion but a profound encounter with the mystery of life and death. Discuss how Valli planned her journey and how the sight of the dead cow altered her perspective.',
        answerKey: {
          valuePoints: [
            'Planning: Meticulously collected sixty paise by resisting peppermints, toys, and the village fair roundabout; calculated bus timings to travel during mother’s afternoon nap [2 marks].',
            'Self-confidence: Handled conductor’s banter maturely, refused drinks from strangers, maintained independence [2 marks].',
            'Encounter with Death: Seeing the playful young cow running in front of the bus during the forward journey filled her with joy, but seeing the same cow lying dead and gory on the return journey shocked her, teaching her the fragile boundary between vibrant life and tragic death [2 marks].',
          ],
          modelAnswer:
            '1. Meticulous Preparation: Eight-year-old Valli exhibited extraordinary discipline, patiently saving every stray coin by suppressing temptations for candy and merry-go-rounds until she amassed the 60-paise fare. She timed her trip precisely during her mother’s afternoon siesta.\n2. Self-Reliance on Board: Valli navigated the journey with adult composure, refusing free treats from the conductor and preserving her autonomy.\n3. The Duality of Life and Death: On the outward journey, a frolicking young cow galloping in front of the bus brought ecstatic laughter. On the return trip, seeing the identical creature dead by the roadside, smeared with blood, silenced her joy. This sudden encounter introduced her to the somber transience of life, leaving her deeply pensive and emotionally matured.',
        },
      },
    ],
  }),

  // 22. Literature Long Answer - The Necklace (6m)
  q({
    bankKey: 'eng-184-lit-necklace-mathilde-la-2',
    chapterSlug: 'supplementary-the-necklace',
    unitId: 'literature',
    topicId: 'supplementary-the-necklace-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"Honesty and contentment are the greatest virtues." How does Guy de Maupassant’s story "The Necklace" illustrate that Mathilde Loisel’s vain aspirations and lack of honesty ruined ten precious years of her life?',
        answerKey: {
          valuePoints: [
            'Vanity & Discontent: Born into an ordinary clerk’s family, Mathilde constantly resented her modest life, dreaming of aristocratic luxury and borrowing Madame Forestier’s diamond necklace [2 marks].',
            'Lack of Honesty: When the necklace was lost, instead of confessing truthfully to her friend, the Loisels borrowed 36,000 francs at ruinous usurious rates to buy a replacement [2 marks].',
            'Tragic Consequence: Spent ten grueling years doing menial domestic labour, losing her youth and beauty, only to discover at the end that the original necklace was fake paste worth merely 500 francs [2 marks].',
          ],
          modelAnswer:
            '1. Perpetual Dissatisfaction: Mathilde was blessed with beauty and a devoted husband, yet she remained chronically miserable, craving opulent banquets and aristocratic admiration.\n2. Fatal Vanity: Her desire to outshine others at the Minister’s ball led her to borrow a dazzling diamond necklace from Madame Forestier.\n3. Cowardice vs Honesty: Losing the jewel was a mishap, but failing to confess was disastrous. Rather than admitting the loss, the Loisels mortgaged their future, borrowing 36,000 francs at ruinous interest.\n4. Irony of Fate: Ten grueling years of crushing drudgery aged Mathilde prematurely and stripped her of beauty. The climax delivers a searing irony: Madame Forestier reveals the borrowed necklace was cheap costume jewellery worth at most 500 francs. Contentment and timely honesty would have prevented a lifetime of unnecessary ruin.',
        },
      },
    ],
  }),

  // 23. Grammar - Error Correction (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-error-correction-mcq-6',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-subject-verb-concord',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Identify the error in the sentence: "Every student and teacher in the auditorium were astonished by the magical performance." Choose the correct replacement.',
        answerKey: {
          options: ['"were" -> "was"', '"in" -> "at"', '"astonished" -> "astonishing"', '"Every" -> "All"'],
          correctOptionIndex: 0,
          valuePoints: ['Phrases introduced by "Every" take a singular verb ("was astonished").'],
          modelAnswer: '"were" -> "was"',
        },
      },
    ],
  }),

  // 24. Grammar - Modals Obligation (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-modals-obligation-mcq-7',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-modals',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Complete the sentence with the appropriate modal:\n"We ______ preserve our cultural heritage for future generations," said the heritage curator.',
        answerKey: {
          options: ['ought to', 'might', 'could', 'may'],
          correctOptionIndex: 0,
          valuePoints: ['"Ought to" conveys moral obligation and duty.'],
          modelAnswer: 'ought to',
        },
      },
    ],
  }),

  // 25. Grammar - Reported Speech Question (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-reported-question-mcq-8',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-reported-speech',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Change into indirect speech:\nThe teacher said to Meera, "Have you submitted your science project?"\nThe teacher asked Meera ______.',
        answerKey: {
          options: [
            'if she had submitted her science project',
            'that whether had she submitted her project',
            'if had she submitted her science project',
            'whether she has submitted her science project',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Yes/No question in reported speech uses "if/whether" + subject + past perfect verb ("if she had submitted").'],
          modelAnswer: 'if she had submitted her science project',
        },
      },
    ],
  }),

  // 26. Grammar - Determiners (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-determiners-quantity-mcq-9',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-determiners',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Select the correct determiner:\n"Could you please lend me ______ money to buy this textbook?" asked the student.',
        answerKey: {
          options: ['some', 'any', 'few', 'many'],
          correctOptionIndex: 0,
          valuePoints: ['"Some" is used in polite requests expecting an affirmative answer.'],
          modelAnswer: 'some',
        },
      },
    ],
  }),

  // 27. Grammar - Tenses Sequence (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-tenses-conditional-mcq-10',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-tenses',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Choose the correct form:\n"If the rains ______ on time this year, the farmers will harvest a bountiful yield."',
        answerKey: {
          options: ['arrive', 'arrived', 'will arrive', 'had arrived'],
          correctOptionIndex: 0,
          valuePoints: ['First conditional uses simple present in the if-clause and simple future in the main clause.'],
          modelAnswer: 'arrive',
        },
      },
    ],
  }),

  // 28. Reading - Discursive Synonym Context (MCQ 1m)
  q({
    bankKey: 'eng-184-read-synonym-context-mcq-4',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In an editorial discussing artificial intelligence, the writer asserts: "Unfettered technological proliferation without ethical guardrails is dangerous." The antonym of "unfettered" is:',
        answerKey: {
          options: ['Restricted or restrained', 'Uncontrolled', 'Liberated', 'Expansive'],
          correctOptionIndex: 0,
          valuePoints: ['"Unfettered" means unrestrained; its antonym is restricted/restrained.'],
          modelAnswer: 'Restricted or restrained',
        },
      },
    ],
  }),

  // 29. Reading - Case-Based Data Analysis (MCQ 1m)
  q({
    bankKey: 'eng-184-read-data-analysis-mcq-5',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A statistical graph highlights that water consumption in households dropped by 30% following the installation of aerated tap nozzles. The most plausible conclusion is:',
        answerKey: {
          options: [
            'Aerated nozzles are effective water-conservation devices in domestic settings.',
            'Households stopped using tap water entirely.',
            'Water tariff rates increased by 30%.',
            'Water supply was disrupted for 30 days.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Direct logical inference from the data.'],
          modelAnswer: 'Aerated nozzles are effective water-conservation devices in domestic settings.',
        },
      },
    ],
  }),

  // 30. Literature Extract - Amanda Poem (5m)
  q({
    bankKey: 'eng-184-lit-amanda-poem-extract-5m-3',
    chapterSlug: 'poem-amanda',
    unitId: 'literature',
    topicId: 'poem-amanda-official-text',
    questionType: 'extract-based',
    marks: 5,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the lines from the poem and answer the questions:\n"Don’t bite your nails, Amanda!\nDon’t hunch your shoulders, Amanda!\nStop that slouching and sit up straight, Amanda!"\n\n(i) Name the poet of "Amanda!". (1 mark)\n(ii) What instructions are given to Amanda in these lines? (1 mark)\n(iii) How does Amanda react internally to this continuous nagging? (1 mark)\n(iv) Contrast Amanda’s fantasy world (as an orphan / mermaid / Rapunzel) with her real world. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Robin Klein [1 mark].',
            '(ii) Not to bite nails, not to hunch shoulders, to stop slouching and sit straight [1 mark].',
            '(iii) She retreats into imaginative reveries where she envisions freedom and tranquility [1 mark].',
            '(iv) In the real world, Amanda feels stifled by ceaseless parental scrutiny and constant corrections; in her fantasy world, she craves solitary freedom, silence, and uninhibited exploration without interference [2 marks].',
          ],
          modelAnswer:
            '(i) Robin Klein.\n(ii) She is reprimanded for biting her nails, hunching her shoulders, and slouching.\n(iii) Amanda escapes into daydreaming, tuning out the nagging voice to seek mental peace.\n(iv) In reality, Amanda is perpetually controlled by rigid parental codes of etiquette. In her imaginative sanctuaries—as a lone emerald mermaid or an untroubled Rapunzel in a secluded tower—she yearns for boundless freedom, golden silence, and absolute solitude.',
        },
      },
    ],
  }),

  // 31. Literature Extract - Two Stories About Flying (5m)
  q({
    bankKey: 'eng-184-lit-seagull-flying-extract-5m-4',
    chapterSlug: 'prose-stories-about-flying',
    unitId: 'literature',
    topicId: 'prose-stories-about-flying-official-text',
    questionType: 'extract-based',
    marks: 5,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the extract and answer the questions:\n"Maddened by hunger, he dived at the fish. With a loud scream he fell outwards and downwards into space. Then a monstrous terror seized him and his heart stood still. But it only lasted a minute. The next moment he felt his wings spread outwards."\n\n(i) Who is "he" in the extract? (1 mark)\n(ii) What compelled the young seagull to finally dive off the ledge? (1 mark)\n(iii) How long did the "monstrous terror" last? (1 mark)\n(iv) How does this episode illustrate that necessity and courage overcome innate fear? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) The young seagull [1 mark].',
            '(ii) Extreme hunger and the sight of fish in his mother’s beak [1 mark].',
            '(iii) It only lasted a minute [1 mark].',
            '(iv) Extreme hunger pushed him past his crippling fear of falling; once in mid-air, natural instinct took over and his wings supported him, demonstrating that taking the initial plunge is the key to overcoming self-doubt [2 marks].',
          ],
          modelAnswer:
            '(i) The young seagull.\n(ii) Desperate hunger, provoked by the tantalising sight of fish torn by his mother just out of reach.\n(iii) It lasted only about a minute.\n(iv) Paralyzed by fear of the vast sea, the seagull refused to fly until extreme hunger overpowered his hesitation. The leap forced his wings to open by survival instinct, demonstrating that overcoming fear requires confronting the challenge directly rather than remaining trapped in hesitation.',
        },
      },
    ],
  }),

  // 32. Literature Short Answer - Dust of Snow (SA 3m)
  q({
    bankKey: 'eng-184-lit-dust-of-snow-sa-7',
    chapterSlug: 'poem-dust-of-snow',
    unitId: 'literature',
    topicId: 'poem-dust-of-snow-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How does Robert Frost use unconventional symbols like a "crow" and a "hemlock tree" to convey a positive transformation of mood in "Dust of Snow"?',
        answerKey: {
          valuePoints: [
            'Unconventional symbols: Crows and poisonous hemlock trees are traditionally associated with gloom, ill-omen, and death [1½ marks].',
            'Transformation: The simple act of a crow shaking fine snow dust from the hemlock branch onto the poet dispels his sorrowful mood and saves the remainder of a ruined day from regret [1½ marks].',
          ],
          modelAnswer:
            '1. Robert Frost intentionally bypasses pleasant symbols (like nightingales or oak trees) and chooses traditionally ominous motifs—the harsh crow and poisonous hemlock tree.\n2. When the crow flutters and shakes snow dust onto the poet, this simple touch of nature abruptly lifts his heavy melancholy, reminding him that life still holds beauty and saving the rest of his day from wasted regret.',
        },
      },
    ],
  }),

  // 33. Literature Short Answer - The Sermon at Benares (SA 3m)
  q({
    bankKey: 'eng-184-lit-sermon-benares-kisa-sa-8',
    chapterSlug: 'prose-the-sermon-at-benares',
    unitId: 'literature',
    topicId: 'prose-the-sermon-at-benares-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What truth about mortal life did Gautama Buddha help Kisa Gotami realise through the task of collecting mustard seeds from a house where no one had died?',
        answerKey: {
          valuePoints: [
            'Task: Buddha asked Kisa Gotami to bring a handful of mustard seeds from a household that had never witnessed the death of a parent, child, or friend [1 mark].',
            'Realisation: When she found no such house, she realized that grief is universal, death is inevitable for all mortals, and clinging to selfish sorrow only multiplies pain [2 marks].',
          ],
          modelAnswer:
            '1. Kisa Gotami visited every house seeking mustard seeds, only to find that every family had mourned the loss of a loved one.\n2. She realised that death is common to all mortals and that her grief was selfish. Buddha illuminated that human life is brief, perishable like ripe fruits, and that peace of mind comes only through accepting the universal law of mortality.',
        },
      },
    ],
  }),

  // 34. Literature Short Answer - The Making of a Scientist (SA 3m)
  q({
    bankKey: 'eng-184-lit-making-scientist-ebright-sa-9',
    chapterSlug: 'supplementary-the-making-of-a-scientist',
    unitId: 'literature',
    topicId: 'supplementary-the-making-of-a-scientist-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What ingredients, according to the author, go into the making of a true scientist as illustrated through Richard Ebright’s life?',
        answerKey: {
          valuePoints: [
            'Three key ingredients: (i) A first-rate mind, (ii) Curiosity / inquiring spirit, (iii) The will to win for the right reasons [1½ marks].',
            'Role of environment: Support from his mother and mentorship from Dr. Urquhart channelled his natural passion into groundbreaking discoveries on cells and butterflies [1½ marks].',
          ],
          modelAnswer:
            '1. The text highlights three essential qualities of a scientist: a keen intellect, boundless curiosity, and the determination to succeed for genuine scientific pursuit rather than mere accolades.\n2. Ebright’s insatiable curiosity about monarch butterflies and cellular DNA, nurtured by his mother and Dr. Urquhart, propelled his transformative scientific discoveries.',
        },
      },
    ],
  }),

  // 35. Literature Long Answer - Nelson Mandela Freedom (6m)
  q({
    bankKey: 'eng-184-lit-mandela-courage-la-3',
    chapterSlug: 'prose-nelson-mandela-long-walk-to-freedom',
    unitId: 'literature',
    topicId: 'prose-nelson-mandela-long-walk-to-freedom-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"Courage is not the absence of fear, but the triumph over it." Explain how Nelson Mandela’s understanding of freedom and courage evolved from his boyhood to his mature years as the leader of South Africa.',
        answerKey: {
          valuePoints: [
            'Boyhood freedom: Believed he was born free—freedom to run in the fields, swim in clear streams, and roast mealies; transistory boyhood illusions [1½ marks].',
            'Youthful freedom: As a student in Johannesburg, yearned for basic freedoms to stay out late, earn a living, marry, and have a family [1½ marks].',
            'Mature freedom: Realised that not only his freedom but the freedom of all black South Africans was curtailed; joined ANC; his desire for personal freedom transformed into a hunger for collective dignity [1½ marks].',
            'Courage & Oppressor: Learned that courage means triumphing over terror; also understood that both the oppressed and the oppressor must be liberated because hatred imprisons the oppressor in prejudice [1½ marks].',
          ],
          modelAnswer:
            '1. Boyhood Illusions: As a child, Mandela thought freedom meant roaming fields and swimming in village streams. In adolescence, it meant personal freedoms like staying out late and choosing reading material.\n2. Awakening to Reality: As a young lawyer in Johannesburg, he realised his boyhood freedom was an illusion. The freedom of every black South African was brutally suppressed by institutional racism.\n3. The Transformation: This realization transformed a frightened young attorney into a bold warrior for justice. He sacrificed family life to fight for the collective emancipation of his people.\n4. True Meaning of Courage: Mandela witnessed comrades face torture without breaking, teaching him that courage is not the absence of fear, but the triumph over it.\n5. Universal Emancipation: He concluded that both the oppressed and the oppressor must be freed—one from physical subjugation, the other from the dehumanising shackles of prejudice and bigotry.',
        },
      },
    ],
  }),

  // 36. Grammar - Subject-Verb Concord Collective Noun (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-concord-committee-mcq-11',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-subject-verb-concord',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Choose the correct verb form:\n"The committee ______ submitted its unanimous recommendations to the board."',
        answerKey: {
          options: ['has', 'have', 'were', 'are'],
          correctOptionIndex: 0,
          valuePoints: ['Collective noun acting as a single unit takes a singular verb ("has submitted").'],
          modelAnswer: 'has',
        },
      },
    ],
  }),

  // 37. Grammar - Modals Advice (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-modals-advice-mcq-12',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-modals',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Select the most appropriate modal:\n"You ______ consult a doctor if the fever persists for more than three days."',
        answerKey: {
          options: ['should', 'might', 'would', 'shall'],
          correctOptionIndex: 0,
          valuePoints: ['"Should" expresses medical advice/recommendation.'],
          modelAnswer: 'should',
        },
      },
    ],
  }),

  // 38. Grammar - Reported Speech Command (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-reported-command-mcq-13',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-reported-speech',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Report the instruction:\nThe librarian said to the students, "Maintain silence in the reading room."\nThe librarian instructed the students ______.',
        answerKey: {
          options: [
            'to maintain silence in the reading room',
            'that maintain silence in the reading room',
            'that they maintain silence in the reading room',
            'for maintaining silence in the reading room',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Imperative sentences in reported speech use infinitive "to + verb".'],
          modelAnswer: 'to maintain silence in the reading room',
        },
      },
    ],
  }),

  // 39. Grammar - Determiners (MCQ 1m)
  q({
    bankKey: 'eng-184-gram-determiners-distributive-mcq-14',
    chapterSlug: 'grammar',
    unitId: 'writing-and-grammar',
    topicId: 'grammar-determiners',
    questionType: 'grammar',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Fill in the blank with the appropriate determiner:\n"______ applicant must bring their original certificates for verification."',
        answerKey: {
          options: ['Each', 'All', 'Many', 'Several'],
          correctOptionIndex: 0,
          valuePoints: ['"Each" takes a singular countable noun ("applicant").'],
          modelAnswer: 'Each',
        },
      },
    ],
  }),

  // 40. Reading - Contextual Vocabulary (MCQ 1m)
  q({
    bankKey: 'eng-184-read-context-vocab-mcq-6',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In an article on sustainable urbanism, the author notes: "The municipal body launched an ingenious rainwater harvesting initiative." The word "ingenious" means:',
        answerKey: {
          options: ['Clever, original, and inventive', 'Costly and ineffective', 'Simple and outdated', 'Deceptive and fraudulent'],
          correctOptionIndex: 0,
          valuePoints: ['"Ingenious" signifies clever, inventive, and resourceful design.'],
          modelAnswer: 'Clever, original, and inventive',
        },
      },
    ],
  }),

  // 41. Reading - Fact vs Opinion (MCQ 1m)
  q({
    bankKey: 'eng-184-read-fact-opinion-mcq-7',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which of the following statements represents an empirical fact rather than a subjective opinion?',
        answerKey: {
          options: [
            'The national forest cover increased by 1,540 square kilometres in the 2024 survey.',
            'Forests are the most enchanting places on earth.',
            'Modern city dwellers do not appreciate the serenity of wilderness.',
            'Nature photography is superior to painting.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Measurable survey data is an empirical fact.'],
          modelAnswer: 'The national forest cover increased by 1,540 square kilometres in the 2024 survey.',
        },
      },
    ],
  }),

  // 42. Writing - Formal Letter of Complaint (5m)
  q({
    bankKey: 'eng-184-write-formal-letter-complaint-5m-2',
    chapterSlug: 'formal-letter',
    unitId: 'writing-and-grammar',
    topicId: 'writing-formal-letter',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'You are Ananya/Arjun, Sports Secretary of Sunshine Public School, Chandigarh. You had placed a bulk order for sports gear (cricket bats, footballs, badminton rackets) with M/s Zenith Sports Corp, Jalandhar. On unpacking, several items were defective or not in accordance with the specifications. Write a formal letter of complaint in 100–120 words requesting prompt replacement or refund.',
        answerKey: {
          valuePoints: [
            'Format: Proper layout of formal complaint letter with reference order number and date [1 mark].',
            'Content: Specific details of defective items (cracked bats, deflated footballs, wrong racket models) [2 marks].',
            'Remedy requested: Demand for immediate replacement under warranty or refund [1 mark].',
            'Tone & Expression: Courteous yet firm business tone [1 mark].',
          ],
          modelAnswer:
            'Sunshine Public School\nSector 14, Chandigarh\n12th November 2026\n\nThe Sales Manager\nM/s Zenith Sports Corp\nRailway Road, Jalandhar\n\nSubject: Complaint Regarding Defective Sports Equipment (Order Ref: SPS/SP/2026/104)\n\nSir/Madam,\nWe received the consignment of sports goods against the above-referenced order dated 28th October 2026 on 10th November 2026. However, on inspection, we found several discrepancies:\n1. Four out of twelve English Willow cricket bats have prominent hairline cracks.\n2. Six footballs are improperly stitched and lose air pressure rapidly.\n3. The supplied badminton rackets are alloy models instead of the ordered carbon-graphite series.\n\nSince our annual inter-school tournament is scheduled next month, we request you to urgently replace the defective items with genuine stock or initiate a full refund. We anticipate a prompt response within five working days.\n\nYours faithfully,\nArjun / Ananya\nSports Secretary',
        },
      },
    ],
  }),

  // 43. Writing - Analytical Paragraph on Renewable Energy (5m)
  q({
    bankKey: 'eng-184-write-analytical-paragraph-energy-5m-2',
    chapterSlug: 'analytical-paragraph',
    unitId: 'writing-and-grammar',
    topicId: 'writing-analytical-paragraph',
    questionType: 'creative-writing',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The pie chart shows the sources of electricity generation in a progressive state in 2026: Solar (40%), Wind (25%), Hydroelectric (15%), Biomass (5%), Thermal/Coal (15%). Write an analytical paragraph in 100–120 words analyzing the transition towards green energy and highlighting key insights.',
        answerKey: {
          valuePoints: [
            'Overview: Transition from fossil fuels to clean renewable energy [1 mark].',
            'Data breakdown: Solar (40%) and Wind (25%) forming the dominant majority (65%), Hydro (15%) providing stable baseload [2 marks].',
            'Fossil fuel observation: Thermal coal curtailed to just 15% [1 mark].',
            'Synthesis & grammar: Coherent transitions and analytical conclusion [1 mark].',
          ],
          modelAnswer:
            'The given pie chart reveals a decisive clean energy transition in the state’s power generation mix for 2026. Renewable sources overwhelmingly dominate the grid, accounting for an impressive 85% of total power production. Solar energy leads the charge at 40%, followed by wind energy at 25%, establishing solar-wind synergy as the primary backbone of the power supply. Hydroelectric power provides 15% reliable baseload generation, while biomass contributes 5%. Crucially, conventional thermal coal power has been drastically curtailed to a mere 15%.\n\nIn summary, the data clearly reflects an aggressive, forward-looking decarbonisation strategy, positioning the state as a benchmark for sustainable green energy independence.',
        },
      },
    ],
  }),

  // 44. Literature Extract - The Tale of Custard the Dragon (5m)
  q({
    bankKey: 'eng-184-lit-custard-dragon-extract-5m-5',
    chapterSlug: 'poem-the-tale-of-custard-the-dragon',
    unitId: 'literature',
    topicId: 'poem-the-tale-of-custard-the-dragon-official-text',
    questionType: 'extract-based',
    marks: 5,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the poem extract and answer the questions:\n"Belinda was as brave as a barrel full of bears,\nAnd Ink and Blink chased lions down the stairs,\nMustard was as brave as a tiger in a rage,\nBut Custard cried for a nice safe cage."\n\n(i) Name the poet of "The Tale of Custard the Dragon". (1 mark)\n(ii) How is Belinda’s bravery described in the extract? (1 mark)\n(iii) Why did the other pets mock Custard? (1 mark)\n(iv) How did Custard prove his true mettle when the pirate attacked Belinda’s house? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Ogden Nash [1 mark].',
            '(ii) "As brave as a barrel full of bears" [1 mark].',
            '(iii) Because Custard was timid and constantly cried for a nice safe cage [1 mark].',
            '(iv) When the armed pirate broke in, all the boastful pets fled in terror; only Custard leaped forward fearlessly, snorting like an engine, and swallowed the pirate whole [2 marks].',
          ],
          modelAnswer:
            '(i) Ogden Nash.\n(ii) Belinda’s bravery is depicted through the humorous exaggeration "as brave as a barrel full of bears."\n(iii) They mocked Custard because he showed cowardice by craving a secure cage rather than boasting of heroism.\n(iv) When the terrifying pirate attacked with pistols and a cutlass, Belinda shrieked and her boastful pets fled. Only Custard rose to the occasion, charging like an engine and devouring the pirate, proving that quiet courage outshines empty boastfulness.',
        },
      },
    ],
  }),

  // 45. Literature Extract - Mijbil the Otter (5m)
  q({
    bankKey: 'eng-184-lit-mijbil-otter-extract-5m-6',
    chapterSlug: 'prose-mijbil-the-otter',
    unitId: 'literature',
    topicId: 'prose-mijbil-the-otter-official-text',
    questionType: 'extract-based',
    marks: 5,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the extract and answer the questions:\n"Two days later, Mijbil escaped from my bedroom as I entered it, and I turned to see his tail disappearing round the bend of the corridor that led to the bathroom. By the time I got there he was up on the end of the bathtub and fumbling at the chromium taps with his paws."\n\n(i) What was Mijbil’s breed of animal? (1 mark)\n(ii) Where did Mijbil head after escaping the bedroom? (1 mark)\n(iii) What was Mijbil trying to do at the bathtub? (1 mark)\n(iv) Describe Mijbil’s fascination with water and bathtub play. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) An otter (Lutrogale perspicillata maxwelli) [1 mark].',
            '(ii) To the bathroom [1 mark].',
            '(iii) Trying to turn on the chromium taps with his paws to make water flow [1 mark].',
            '(iv) Otters are obsessed with water; every drop must be extended and spread about; Mijbil plunged, rolled, shot up and down the bathtub, creating high water chaos [2 marks].',
          ],
          modelAnswer:
            '(i) An otter.\n(ii) The bathroom.\n(iii) He was trying to manipulate and turn the chromium tap handles to release running water.\n(iv) Otters possess an unbridled passion for water. To an otter, still water is a wasted anomaly; it must be splashed, swirled, and violently overturned. Mijbil delighted in turning taps on, plunging into full tubs, and creating joyously chaotic splashes.',
        },
      },
    ],
  }),

  // 46. Literature Short Answer - Fire and Ice (SA 3m)
  q({
    bankKey: 'eng-184-lit-fire-and-ice-sa-10',
    chapterSlug: 'poem-fire-and-ice',
    unitId: 'literature',
    topicId: 'poem-fire-and-ice-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What do "fire" and "ice" symbolize in Robert Frost’s poem "Fire and Ice"? How are they equally capable of destroying the world?',
        answerKey: {
          valuePoints: [
            'Symbolism: "Fire" symbolizes uncontrollable human desire, lust, greed, and passion. "Ice" symbolizes cold hatred, rigidity, indifference, and intolerance [1½ marks].',
            'Destruction: While burning passion and greed (fire) can ignite global conflict, cold indifference and venomous hatred (ice) can quietly and completely freeze human empathy, making both equally lethal [1½ marks].',
          ],
          modelAnswer:
            '1. In Frost’s poem, "Fire" represents burning human passions—greed, lust, and unbridled ambition. "Ice" represents cold rational hatred, emotional aloofness, intolerance, and rigidity.\n2. The poet argues that while fiery desires can consume the world in fiery fury, silent, chilling hatred possesses equal destructive potency to freeze humanity and bring complete ruin.',
        },
      },
    ],
  }),

  // 47. Literature Short Answer - The Midnight Visitor (SA 3m)
  q({
    bankKey: 'eng-184-lit-midnight-visitor-ausable-sa-11',
    chapterSlug: 'supplementary-the-midnight-visitor',
    unitId: 'literature',
    topicId: 'supplementary-the-midnight-visitor-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How did Ausable outwit Max without firing a single bullet or engaging in physical combat?',
        answerKey: {
          valuePoints: [
            'Nonchalant presence of mind: Fabricated a convincing tale about a nonexistent balcony beneath his hotel window [1½ marks].',
            'Knock at the door: When a waiter knocked to deliver drinks, Ausable calmly claimed it was the police, causing panicked Max to jump out of the window into empty air to his death [1½ marks].',
          ],
          modelAnswer:
            '1. Ausable used supreme psychological composure. He concocted a seamless lie about a nuisance balcony right under his window.\n2. When room service knocked on the door, Ausable calmly claimed it was the police checking on his safety. Terrified of arrest, Max leaped out of the window onto the "balcony"—which was non-existent on the sixth floor—falling to his death.',
        },
      },
    ],
  }),

  // 48. Literature Short Answer - A Question of Trust (SA 3m)
  q({
    bankKey: 'eng-184-lit-question-trust-horace-sa-12',
    chapterSlug: 'supplementary-a-question-of-trust',
    unitId: 'literature',
    topicId: 'supplementary-a-question-of-trust-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why does Horace Danby get angry whenever anyone mentions "honour among thieves"?',
        answerKey: {
          valuePoints: [
            'Deception by a fellow thief: Horace was outsmarted and framed by a charming young woman who was herself a thief posing as the mistress of Shotover Grange [1½ marks].',
            'Betrayal of code: She manipulated him into opening the safe without gloves, stole the jewels herself, and left Horace to be arrested by the police [1½ marks].',
          ],
          modelAnswer:
            '1. Horace believed in the traditional criminal ethic of "honour among thieves."\n2. However, at Shotover Grange, he was cleverly duped by a fellow jewel thief who pretended to be the mistress of the house. She exploited his chivalry to crack the safe without gloves, taking the jewels and leaving Horace’s fingerprints behind to face prison alone.',
        },
      },
    ],
  }),

  // 49. Literature Short Answer - The Trees (SA 3m)
  q({
    bankKey: 'eng-184-lit-trees-adrienne-rich-sa-13',
    chapterSlug: 'poem-the-trees',
    unitId: 'literature',
    topicId: 'poem-the-trees-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How does Adrienne Rich depict the struggle of the trees to break free from the house and return to the forest in "The Trees"?',
        answerKey: {
          valuePoints: [
            'Physical rebellion of nature: Roots work all night to disengage from veranda cracks, leaves strain toward glass, twigs stiffen with exertion [1½ marks].',
            'Metaphor for liberation: Trees escaping into the empty forest symbolise women breaking free from patriarchal domestic confinement into the expansive world [1½ marks].',
          ],
          modelAnswer:
            '1. The poet vividly personifies the trees: roots laboriously unclamp from floor tiles, leaves push against window panes, and cramped branches thrust through doors like newly discharged hospital patients.\n2. This desperate exodus represents nature reclaiming its rightful habitat and serves as an allegory for women emancipating themselves from domestic confinement to claim freedom.',
        },
      },
    ],
  }),

  // 50. Literature Short Answer - Glimpses of India (Coorg) (SA 3m)
  q({
    bankKey: 'eng-184-lit-glimpses-coorg-sa-14',
    chapterSlug: 'prose-glimpses-of-india',
    unitId: 'literature',
    topicId: 'prose-glimpses-of-india-official-text',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What is the traditional story behind the Greek and Arabic origin of the martial people of Coorg (Kodavus)?',
        answerKey: {
          valuePoints: [
            'Greek descent theory: A part of Alexander’s army moved south along the coast and settled there when return became impractical, marrying among locals [1½ marks].',
            'Arab descent theory: Kodavus wear the traditional long black coat with an embroidered waist-belt known as "Kuppia", resembling the "Kuffia" worn by Arabs and Kurds [1½ marks].',
          ],
          modelAnswer:
            '1. Greek Origin: Legend holds that a section of Alexander the Great’s army marched south along the coast and settled permanently in Coorg after return became impossible, assimilating through local marriages.\n2. Arabic Origin: The traditional Kodavu attire—a long black coat with an ornate waist belt called the "Kuppia"—closely resembles the "Kuffia" worn by Arabs and Kurds, supporting their Arabic lineage.',
        },
      },
    ],
  }),

  // 51. Literature Long Answer - The Proposal (6m)
  q({
    bankKey: 'eng-184-lit-proposal-chekhov-la-4',
    chapterSlug: 'prose-the-proposal',
    unitId: 'literature',
    topicId: 'prose-the-proposal-official-text',
    questionType: 'long-answer',
    marks: 6,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Anton Chekhov’s one-act play "The Proposal" is a satire on the mercenary nature of aristocratic Russian marriages. Discuss how petty quarrels over Oxen Meadows and hunting dogs overshadow Lomov and Natalya’s supposed romance.',
        answerKey: {
          valuePoints: [
            'Economic convenience over love: Marriage in 19th-century Russian gentry was a commercial transaction to consolidate adjoining estates [2 marks].',
            'Absurd squabbling: Lomov comes formally dressed to propose, yet immediately plunges into violent arguments over ownership of worthless Oxen Meadows [2 marks].',
            'Dog rivalry & hysterical climax: Second argument over hunting dogs (Guess vs Squeezer) shows explosive vanity; even after Lomov faints and they get engaged, the squabbling resumes instantly [2 marks].',
          ],
          modelAnswer:
            '1. Commercial Matchmaking: Chekhov satirises the 19th-century landed gentry, where marriage was driven by economic convenience and real estate consolidation rather than romantic love. Chubukov is thrilled to marry off his daughter to expand adjoining land.\n2. Petty Materialism: Lomov arrives in formal evening attire to propose to Natalya. However, the moment land is mentioned, their stubborn pride ignites a furious, screaming match over Oxen Meadows—a trivial strip of marshy birchwoods.\n3. Egocentric Vanity: When Chubukov reveals Lomov’s proposal intention, Natalya hysterically demands his return. Yet within minutes, they erupt into an equally absurd shouting dispute over whose hunting dog (Guess or Squeezer) is superior.\n4. Comic Climax: Even when Lomov collapses from hypochondriac palpitations and Chubukov forcibly joins their hands in engagement, they immediately resume quarrelling. Chekhov brilliantly illustrates how greed, egotism, and trivial pride reduce sacred relationships to farcical transactions.',
        },
      },
    ],
  }),

  // 52. Reading - Discursive Central Idea (MCQ 1m)
  q({
    bankKey: 'eng-184-read-central-idea-mcq-8',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In an argumentative essay on digital detox, the central proposition advanced by the author is that:',
        answerKey: {
          options: [
            'Periodic disconnection from digital devices revitalises cognitive attention and mental well-being.',
            'Technology should be permanently banned in schools.',
            'Smartphones improve memory retention during sleep.',
            'Social media is the only source of human knowledge.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['The core thesis is cognitive rejuvenation via digital disconnection.'],
          modelAnswer: 'Periodic disconnection from digital devices revitalises cognitive attention and mental well-being.',
        },
      },
    ],
  }),

  // 53. Reading - Case-Based Comparative Inference (MCQ 1m)
  q({
    bankKey: 'eng-184-read-comparative-inference-mcq-9',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Based on an urban mobility report showing bus patronage at 65% and metro patronage at 35%, which statement is directly supported?',
        answerKey: {
          options: [
            'More commuters rely on bus transit compared to metro rail in the surveyed area.',
            'Metro rail ticket fares are excessively expensive.',
            'Buses operate faster than metro trains.',
            'Private car usage was completely eradicated.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['65% bus ridership > 35% metro ridership.'],
          modelAnswer: 'More commuters rely on bus transit compared to metro rail in the surveyed area.',
        },
      },
    ],
  }),

  // 54. Reading - Discursive Passage Vocabulary Context (MCQ 1m)
  q({
    bankKey: 'eng-184-read-vocab-empathy-mcq-10',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the phrase: "Empathy is the bedrock of civilized discourse." The word "bedrock" metaphorically signifies:',
        answerKey: {
          options: ['The solid fundamental foundation', 'A geological rock formation', 'A temporary obstacle', 'An insignificant detail'],
          correctOptionIndex: 0,
          valuePoints: ['"Bedrock" metaphorically refers to the fundamental underlying principle/foundation.'],
          modelAnswer: 'The solid fundamental foundation',
        },
      },
    ],
  }),

  // 55. Reading - Case-Based Trend Analysis (MCQ 1m)
  q({
    bankKey: 'eng-184-read-trend-analysis-mcq-11',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A survey chart on youth reading habits demonstrates that audio-book consumption grew by 50% between 2022 and 2026. This data indicates:',
        answerKey: {
          options: [
            'A growing popularity and adoption of auditory formats for literature consumption among youth.',
            'Complete disappearance of printed physical books.',
            'Decline in literacy rates across the country.',
            'A reduction in smartphone availability.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['50% growth in audio-books signifies expanding popularity of auditory literature.'],
          modelAnswer: 'A growing popularity and adoption of auditory formats for literature consumption among youth.',
        },
      },
    ],
  }),

  // 56. Reading - Discursive Rhetorical Question (MCQ 1m)
  q({
    bankKey: 'eng-184-read-rhetorical-question-mcq-12',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'When a writer asks in a passage: "Can we truly call ourselves developed if clean air remains a luxury?", the author’s rhetorical intent is to:',
        answerKey: {
          options: [
            'Provoke critical reflection on the genuine definition and priorities of developmental progress.',
            'Seek technical information regarding air purifiers.',
            'Compliment municipal progress on tree planting.',
            'Discourage industrial manufacturing.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Rhetorical questions challenge assumptions and stimulate critical introspection.'],
          modelAnswer: 'Provoke critical reflection on the genuine definition and priorities of developmental progress.',
        },
      },
    ],
  }),

  // 57. Reading - Case-Based Correlation Deduction (MCQ 1m)
  q({
    bankKey: 'eng-184-read-correlation-deduction-mcq-13',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A table demonstrates that students who participate in daily physical exercise score 18% higher on spatial memory tests. What is the most valid conclusion?',
        answerKey: {
          options: [
            'There is a positive correlation between regular physical activity and spatial cognitive performance.',
            'Physical exercise is detrimental to academic studies.',
            'Students who do not exercise fail all examinations.',
            'Spatial memory is completely independent of physical health.',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Positive statistical correlation between physical exercise and test performance.'],
          modelAnswer: 'There is a positive correlation between regular physical activity and spatial cognitive performance.',
        },
      },
    ],
  }),

  // 58. Reading - Discursive Passage Tone (MCQ 1m)
  q({
    bankKey: 'eng-184-read-discursive-tone-mcq-14',
    chapterSlug: 'discursive-passage',
    unitId: 'reading',
    topicId: 'reading-discursive-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'When an author presents both traditional agricultural wisdom and modern biotechnology with balanced respect, the perspective is best categorized as:',
        answerKey: {
          options: ['Equitable and synthesized', 'Hostile and partisan', 'Derisive and cynical', 'Indifferent and aloof'],
          correctOptionIndex: 0,
          valuePoints: ['Respectful synthesis of contrasting views shows an equitable, balanced stance.'],
          modelAnswer: 'Equitable and synthesized',
        },
      },
    ],
  }),

  // 59. Reading - Case-Based Statistical Precision (MCQ 1m)
  q({
    bankKey: 'eng-184-read-precision-metric-mcq-15',
    chapterSlug: 'case-based-factual-passage',
    unitId: 'reading',
    topicId: 'reading-case-based-factual-passage',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'According to a wildlife census, the tiger population in a national park rose from 80 in 2018 to 120 in 2024. What was the exact percentage increase?',
        answerKey: {
          options: ['50%', '40%', '33.3%', '60%'],
          correctOptionIndex: 0,
          valuePoints: ['Percentage increase = ((120 - 80) / 80) * 100% = (40 / 80) * 100% = 50%.'],
          modelAnswer: '50%',
        },
      },
    ],
  }),
];



