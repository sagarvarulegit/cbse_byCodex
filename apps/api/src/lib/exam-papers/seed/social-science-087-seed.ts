import type { BankQuestion } from '../types.js';

type QuestionDraft = Omit<BankQuestion, 'subjectSlug' | 'verificationStatus'> & {
  subjectSlug?: 'social-science';
  verificationStatus?: BankQuestion['verificationStatus'];
};

function q(draft: QuestionDraft): BankQuestion {
  return {
    ...draft,
    subjectSlug: 'social-science',
    verificationStatus: draft.verificationStatus ?? 'review',
  };
}

/**
 * Curated starter question bank for CBSE Class 10 Social Science (087).
 * All questions are strictly aligned to the NCERT Class 10 textbooks:
 * 1. India and the Contemporary World - II (History) - 20 marks
 * 2. Contemporary India - II (Geography) - 20 marks
 * 3. Democratic Politics - II (Civics) - 20 marks
 * 4. Understanding Economic Development (Economics) - 20 marks
 */
export const SOCIAL_SCIENCE_087_SEED: BankQuestion[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 1 · History · India & Contemporary World - II (20 marks) ─────────
  // ══════════════════════════════════════════════════════════════════════════

  // 1. History - French Revolution / Nation State (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-french-rev-mcq-1',
    chapterSlug: 'rise-of-nationalism-in-europe',
    unitId: 'history',
    topicId: 'rise-nationalism-french-revolution-nation-state',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Who was proclaimed the Emperor of unified Germany in a ceremony held at Versailles in January 1871?',
        answerKey: {
          options: [
            'Kaiser William I of Prussia',
            'Otto von Bismarck',
            'Victor Emmanuel II',
            'Giuseppe Garibaldi',
          ],
          correctOptionIndex: 0,
          valuePoints: ['In January 1871, Kaiser William I of Prussia was proclaimed German Emperor at the Hall of Mirrors in Versailles.'],
          modelAnswer: 'Kaiser William I of Prussia',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'Which treaty recognised Greece as an independent nation in 1832?',
        answerKey: {
          options: [
            'Treaty of Constantinople (1832)',
            'Treaty of Vienna (1815)',
            'Treaty of Versailles (1871)',
            'Treaty of Frankfurt (1871)',
          ],
          correctOptionIndex: 0,
          valuePoints: ['The Treaty of Constantinople of 1832 recognised Greece as an independent nation.'],
          modelAnswer: 'Treaty of Constantinople (1832)',
        },
      },
    ],
  }),

  // 2. History - Mazzini & Liberal Nationalism (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-liberal-nationalism-mcq-2',
    chapterSlug: 'rise-of-nationalism-in-europe',
    unitId: 'history',
    topicId: 'rise-nationalism-european-nationalism-imperialism',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which secret society was founded by Giuseppe Mazzini in Marseilles?',
        answerKey: {
          options: ['Young Italy', 'Young Europe', 'Carbonari', 'Jacobin Club'],
          correctOptionIndex: 0,
          valuePoints: ['Mazzini founded Young Italy in Marseilles and Young Europe in Berne.'],
          modelAnswer: 'Young Italy',
        },
      },
    ],
  }),

  // 3. History - Rowlatt Act & Jallianwala Bagh (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-rowlatt-jallianwala-mcq-3',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-first-world-war-khilafat-non-cooperation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why did Mahatma Gandhi organise the Champaran Satyagraha in Bihar in 1917?',
        answerKey: {
          options: [
            'To inspire peasants to struggle against the oppressive indigo plantation system',
            'To support cotton mill workers in their demand for wage hikes',
            'To protest against the high revenue demand of the British after crop failure',
            'To oppose the Rowlatt Act passed by the Imperial Legislative Council',
          ],
          correctOptionIndex: 0,
          valuePoints: ['In 1917 Gandhi travelled to Champaran in Bihar to inspire the peasants to struggle against the oppressive plantation system.'],
          modelAnswer: 'To inspire peasants to struggle against the oppressive indigo plantation system',
        },
      },
    ],
  }),

  // 4. History - Simon Commission & Civil Disobedience (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-simon-dandi-mcq-4',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-civil-disobedience-collective-belonging',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why was the Simon Commission boycotted by all political parties in India in 1928?',
        answerKey: {
          options: [
            'There was not a single Indian member on the statutory commission',
            'It proposed dividing India into two separate dominions',
            'It banned the manufacture of salt by Indians',
            'It refused to release political prisoners arrested during Non-Cooperation',
          ],
          correctOptionIndex: 0,
          valuePoints: ['The problem was that the commission did not have a single Indian member; all members were British.'],
          modelAnswer: 'There was not a single Indian member on the statutory commission',
        },
      },
    ],
  }),

  // 5. History - Silk Routes & Global Trade (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-silk-routes-mcq-5',
    chapterSlug: 'making-of-a-global-world',
    unitId: 'history',
    topicId: 'making-of-a-global-world-pre-modern-world',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which of the following foods was introduced to Europe and Asia after Christopher Columbus discovered America?',
        answerKey: {
          options: ['Potatoes and maize', 'Wheat and barley', 'Rice and sugarcane', 'Tea and coffee'],
          correctOptionIndex: 0,
          valuePoints: ['Potatoes, soya, groundnuts, maize, tomatoes, chillies were introduced from the Americas.'],
          modelAnswer: 'Potatoes and maize',
        },
      },
    ],
  }),

  // 6. History - Print Culture & Gutenberg (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-gutenberg-print-mcq-6',
    chapterSlug: 'print-culture',
    unitId: 'history',
    topicId: 'print-culture-print-revolution',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The first book printed by Johannes Gutenberg on his printing press in 1448 was the:',
        answerKey: {
          options: ['Bible', 'Quran', 'Gita', 'Diamond Sutra'],
          correctOptionIndex: 0,
          valuePoints: ['The first book Gutenberg printed was the Bible. About 180 copies were printed in three years.'],
          modelAnswer: 'Bible',
        },
      },
    ],
  }),

  // 7. History - Napoleonic Code (VSA 2m)
  q({
    bankKey: 'sst-087-hist-napoleonic-code-vsa-1',
    chapterSlug: 'rise-of-nationalism-in-europe',
    unitId: 'history',
    topicId: 'rise-nationalism-french-revolution-nation-state',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State any two revolutionary administrative reforms introduced by Napoleon Bonaparte through the Civil Code of 1804 (Napoleonic Code).',
        answerKey: {
          valuePoints: [
            '(i) Abolished all privileges based on birth and established equality before the law [1 mark].',
            '(ii) Secured the right to property, abolished the feudal system, and freed peasants from serfdom and manorial dues [1 mark].',
          ],
          modelAnswer:
            'Two key reforms of the Napoleonic Code (1804):\n1. Abolition of all privileges based on birth and establishment of equality before the law.\n2. Securing the right to property and removal of guild restrictions in towns.',
        },
      },
    ],
  }),

  // 8. History - Vernacular Press Act (SA 3m)
  q({
    bankKey: 'sst-087-hist-vernacular-press-act-sa-1',
    chapterSlug: 'print-culture',
    unitId: 'history',
    topicId: 'print-culture-india-nationalism',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why was the Vernacular Press Act passed by the British government in India in 1878? What powers did it give to the colonial authorities?',
        answerKey: {
          valuePoints: [
            'Reason: After the revolt of 1857, the vernacular press became assertive and openly critical of oppressive colonial policies [1 mark].',
            'Model: The Act was modeled on Irish Press Laws to censor reports and editorials in vernacular newspapers [1 mark].',
            'Powers: Provided the government with extensive rights to monitor vernacular newspapers. If a report was judged seditious, the paper was warned, and if ignored, the press and printing machinery were confiscated [1 mark].',
          ],
          modelAnswer:
            '1. Reason: In the 1870s, vernacular newspapers were fiercely criticising British imperial policies and spreading nationalist sentiments among Indians.\n2. Provisions: Passed in 1878 modeled on the Irish Press Laws, it gave the government extensive rights to censor vernacular journalism.\n3. Powers: District Magistrates were empowered to seize printing presses and confiscate machinery if any newspaper published seditious content after a first warning.',
        },
      },
    ],
  }),

  // 9. History - Non-Cooperation Movement (Long Answer 5m)
  q({
    bankKey: 'sst-087-hist-non-cooperation-la-1',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-first-world-war-khilafat-non-cooperation',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Explain how the Non-Cooperation Movement unfolded in the cities and towns of India. Why did this movement gradually slow down in urban areas?',
        answerKey: {
          valuePoints: [
            'Movement in Towns: (i) Thousands of students left government schools/colleges; headmasters and teachers resigned; lawyers gave up legal practice [1½ marks].',
            '(ii) Council elections boycotted in most provinces except Madras (Justice Party); foreign goods boycotted, liquor shops picketed, and foreign cloth burnt in huge bonfires; import of foreign cloth halved between 1921 and 1922 [1½ marks].',
            'Reasons for slowdown: (i) Khadi cloth was more expensive than mass-produced British mill cloth and poor people could not afford to wear it for long [1 mark].',
            '(ii) Boycott of British institutions posed a problem because alternative Indian institutions (schools, colleges, courts) were slow to come up, forcing students, teachers, and lawyers to trickle back to government institutions [1 mark].',
          ],
          modelAnswer:
            'Course of Non-Cooperation Movement in Towns:\n1. Middle-class participation: Thousands of students left British-run schools and colleges, teachers resigned, and lawyers gave up legal practices.\n2. Economic boycott: Foreign goods were boycotted, liquor shops picketed, and foreign textiles burnt in public bonfires. Value of foreign cloth imports dropped from ₹102 crore to ₹57 crore between 1921–1922.\n3. Boycott of council elections: Political parties boycotted legislative council elections across provinces (except Madras Justice Party).\n\nReasons for Urban Slowdown:\n1. Expensive Khadi: Khadi was significantly more expensive than mill-made cloth and poor Indians could not afford it sustainably.\n2. Lack of Alternative Institutions: Indian schools, colleges, and law courts were not established fast enough, compelling students, teachers, and professionals to return to government institutions.',
        },
      },
    ],
  }),

  // 10. History - Source-Based Case Study (4m) - Print & Martin Luther
  q({
    bankKey: 'sst-087-hist-print-reformation-case-1',
    chapterSlug: 'print-culture',
    unitId: 'history',
    topicId: 'print-culture-religion-reform-public-debate',
    questionType: 'source-based',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the source given below and answer the questions that follow:\nIn 1517, the religious reformer Martin Luther wrote Ninety Five Theses criticising many of the practices and rituals of the Roman Catholic Church. A printed copy of this was posted on a church door in Wittenberg. It challenged the Church to debate his ideas. Luther’s writings were immediately reproduced in vast numbers and read widely. This led to a division within the Church and to the beginning of the Protestant Reformation. Luther famously declared: "Printing is the ultimate gift of God and the greatest one."\n\n(i) What was the immediate outcome of Martin Luther’s Ninety Five Theses? (1 mark)\n(ii) Why did Martin Luther regard printing as the greatest gift of God? (1 mark)\n(iii) Explain how print culture shaped religious debate and challenged orthodox religious authorities in sixteenth-century Europe. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) It led to a schism/division within the Roman Catholic Church and marked the beginning of the Protestant Reformation [1 mark].',
            '(ii) Because print allowed rapid reproduction and widespread dissemination of his reformist ideas to ordinary people, which was impossible through handwritten manuscripts [1 mark].',
            '(iii) Print created a new culture of reading and debate. It allowed individuals to interpret scriptures independently without priestly mediation, empowering people to question orthodox dogmas and church corruption [2 marks].',
          ],
          modelAnswer:
            '(i) Martin Luther’s Ninety Five Theses led to a major division in Western Christianity and triggered the Protestant Reformation.\n(ii) Luther called printing God’s greatest gift because it allowed rapid, cheap, and wide reproduction of new ideas, bypassing church monopolies on knowledge.\n(iii) Print made scriptures and theological treatises accessible in vernacular languages to common people. Readers could interpret the Bible directly, leading to critical questioning of papal authority, sale of indulgences, and superstitious practices.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 2 · Geography · Contemporary India - II (20 marks) ───────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 11. Geography - Resource Classification (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-resources-mcq-1',
    chapterSlug: 'resources-and-development',
    unitId: 'geography',
    topicId: 'resources-classification-planning-development',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Black soil is also known as:',
        answerKey: {
          options: ['Regur soil', 'Laterite soil', 'Bangar soil', 'Khadar soil'],
          correctOptionIndex: 0,
          valuePoints: ['Black soil is also known as regur soil and is ideal for cotton cultivation (black cotton soil).'],
          modelAnswer: 'Regur soil',
        },
      },
      {
        variantKey: 'b',
        params: {},
        statement: 'Which state in India has the highest percentage of net sown area under irrigation?',
        answerKey: {
          options: ['Punjab and Haryana', 'Arunachal Pradesh', 'Rajasthan', 'Mizoram'],
          correctOptionIndex: 0,
          valuePoints: ['Punjab and Haryana have over 80% of their total area as net sown area with extensive irrigation networks.'],
          modelAnswer: 'Punjab and Haryana',
        },
      },
    ],
  }),

  // 12. Geography - Forest Conservation (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-forests-mcq-2',
    chapterSlug: 'forest-and-wildlife-resources',
    unitId: 'geography',
    topicId: 'forest-wildlife-biodiversity-conservation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In which year was the Indian Wildlife (Protection) Act implemented?',
        answerKey: {
          options: ['1972', '1982', '1992', '1962'],
          correctOptionIndex: 0,
          valuePoints: ['The Indian Wildlife (Protection) Act was implemented in 1972 with various provisions for protecting habitats.'],
          modelAnswer: '1972',
        },
      },
    ],
  }),

  // 13. Geography - Multipurpose River Valley Projects (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-water-dams-mcq-3',
    chapterSlug: 'water-resources',
    unitId: 'geography',
    topicId: 'multipurpose-projects-rainwater-harvesting',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Who proclaimed multi-purpose river valley dams as the "temples of modern India"?',
        answerKey: {
          options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Sardar Vallabhbhai Patel', 'Subhas Chandra Bose'],
          correctOptionIndex: 0,
          valuePoints: ['Jawaharlal Nehru proudly proclaimed dams as the temples of modern India because they integrate agricultural and industrial development.'],
          modelAnswer: 'Jawaharlal Nehru',
        },
      },
    ],
  }),

  // 14. Geography - Cropping Seasons (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-agriculture-crops-mcq-4',
    chapterSlug: 'agriculture',
    unitId: 'geography',
    topicId: 'agriculture-farming-types-cropping-pattern',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Rabi crops are sown in winter from October to December and harvested in summer from:',
        answerKey: {
          options: ['April to June', 'July to September', 'January to March', 'October to November'],
          correctOptionIndex: 0,
          valuePoints: ['Rabi crops (like wheat, barley, peas, gram, mustard) are sown in Oct–Dec and harvested in April–June.'],
          modelAnswer: 'April to June',
        },
      },
    ],
  }),

  // 15. Geography - Non-Conventional Energy (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-energy-minerals-mcq-5',
    chapterSlug: 'minerals-and-energy-resources',
    unitId: 'geography',
    topicId: 'energy-resources-conventional-nonconventional',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Kudremukh iron ore deposits in Karnataka are known to be one of the largest in the world. The word "Kudre" in Kannada means:',
        answerKey: {
          options: ['Horse', 'Bullock', 'Elephant', 'Tiger'],
          correctOptionIndex: 0,
          valuePoints: ['The Kudremukh mines are named because the highest peak resembles the face of a horse ("Kudre" means horse in Kannada).'],
          modelAnswer: 'Horse',
        },
      },
    ],
  }),

  // 16. Geography - Rainwater Harvesting in Rajasthan (VSA 2m)
  q({
    bankKey: 'sst-087-geo-rainwater-tankas-vsa-1',
    chapterSlug: 'water-resources',
    unitId: 'geography',
    topicId: 'multipurpose-projects-rainwater-harvesting',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Explain the traditional system of rainwater harvesting through "Tankas" in the semi-arid regions of Rajasthan.',
        answerKey: {
          valuePoints: [
            'Structure: Underground tanks or tankas built inside main houses or courtyards connected to sloping rooftops via pipes [1 mark].',
            'Utility: Rainwater falling on roofs travels down pipes into tankas, storing clean drinking water ("Palar Pani") through dry summer months [1 mark].',
          ],
          modelAnswer:
            '1. Tankas are large underground storage tanks built inside traditional houses in arid/semi-arid parts of Rajasthan (like Bikaner, Phalodi, and Barmer).\n2. Rainwater from sloping rooftops flows through pipes into these tankas, providing reliable, clean potable drinking water (Palar Pani) when all other sources dry up.',
        },
      },
    ],
  }),

  // 17. Geography - Sustainable Agriculture / Reforms (SA 3m)
  q({
    bankKey: 'sst-087-geo-agriculture-reforms-sa-1',
    chapterSlug: 'agriculture',
    unitId: 'geography',
    topicId: 'agriculture-major-crops-reforms',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Describe any three institutional and technological reforms initiated by the Government of India to modernize the agricultural sector.',
        answerKey: {
          valuePoints: [
            '(i) Land reforms: Collectivisation, consolidation of land holdings, abolition of zamindari system [1 mark].',
            '(ii) Green Revolution & White Revolution: Introduction of High Yielding Variety (HYV) seeds, chemical fertilisers, farm mechanisation, and Operation Flood [1 mark].',
            '(iii) Financial and support schemes: Provision for crop insurance against drought/flood, establishment of Grameen Banks and cooperative credit societies, Kisan Credit Card (KCC), Personal Accident Insurance Scheme (PAIS), and Minimum Support Price (MSP) announcements [1 mark].',
          ],
          modelAnswer:
            'Three key agricultural reforms:\n1. Land Reforms: Abolition of the zamindari system and consolidation of fragmented land holdings.\n2. Technology & Inputs: Introduction of the Green Revolution (HYV seeds, fertilisers, drip irrigation) and agricultural radio/TV bulletins.\n3. Credit & Security: Kisan Credit Cards (KCC), comprehensive crop insurance schemes against natural disasters, and Minimum Support Prices (MSP) to prevent exploitation by middlemen.',
        },
      },
    ],
  }),

  // 18. Geography - Manufacturing Industries Importance (Long Answer 5m)
  q({
    bankKey: 'sst-087-geo-manufacturing-importance-la-1',
    chapterSlug: 'manufacturing-industries',
    unitId: 'geography',
    topicId: 'manufacturing-importance-classification-location',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"Manufacturing sector is considered the backbone of economic development in general and economic growth in particular." Justify the statement with five suitable arguments.',
        answerKey: {
          valuePoints: [
            '(i) Modernises agriculture: Manufacturing provides tools, tractors, pumps, fertilisers, reducing heavy dependence of population on agricultural income [1 mark].',
            '(ii) Eradicates unemployment and poverty: Creates factory jobs in secondary and tertiary sectors, bridging regional developmental disparities [1 mark].',
            '(iii) Expands trade and commerce: Export of manufactured goods brings in valuable foreign exchange [1 mark].',
            '(iv) Adds value to raw materials: Transforms raw materials into wide varieties of finished, higher-value goods (e.g. iron ore into steel, cotton into textiles) [1 mark].',
            '(v) Self-reliance: Fosters domestic technological capabilities and reduces import dependence [1 mark].',
          ],
          modelAnswer:
            'Manufacturing is the backbone of economic development because:\n1. Modernises Agriculture: Supplies tractors, threshers, harvesters, irrigation pumps, and fertilisers, boosting agricultural yield and modernising agrarian practices.\n2. Reduces Heavy Farm Dependence: Absorbs surplus rural labour into productive industrial and service sector employment, reducing disguised unemployment.\n3. Poverty and Unemployment Alleviation: Industrialisation is a prerequisite for generating mass employment and eradicating chronic poverty.\n4. Foreign Exchange Inflow: Exporting manufactured goods expands international trade and earns vital foreign currency reserves.\n5. Value Addition: Nations that transform raw commodities into high-value finished products prosper rapidly.',
        },
      },
    ],
  }),

  // 19. Geography - Case Study / Source-Based (4m) - Solar Energy & Sustainability
  q({
    bankKey: 'sst-087-geo-solar-energy-case-1',
    chapterSlug: 'minerals-and-energy-resources',
    unitId: 'geography',
    topicId: 'energy-resources-conventional-nonconventional',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the source given below and answer the questions that follow:\nIndia is a tropical country. It has enormous possibilities of tapping solar energy. Photovoltaic technology converts sunlight directly into electricity. Solar energy is fast becoming popular in rural and remote areas. Some big solar power plants are being established in different parts of India which will minimise the dependence of rural households on firewood and dung cakes, which in turn will contribute to environmental conservation and adequate supply of manure in agriculture.\n\n(i) What technology is used to convert sunlight directly into electricity? (1 mark)\n(ii) State one environmental benefit of expanding solar energy in rural India. (1 mark)\n(iii) Why is solar energy called a non-conventional energy source, and why does India possess immense potential for solar power generation? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Photovoltaic (PV) technology [1 mark].',
            '(ii) Minimises cutting of trees for firewood, reduces indoor air pollution and carbon emissions, while preserving cattle dung for organic manure [1 mark].',
            '(iii) Non-conventional because it is renewable, inexhaustible, and tapped through modern technology rather than burning finite fossil fuels. India is a tropical nation with over 300 sunny days annually and abundant solar insolation [2 marks].',
          ],
          modelAnswer:
            '(i) Solar Photovoltaic (PV) technology.\n(ii) It reduces deforestation and reliance on firewood, decreasing greenhouse emissions and conserving cow dung for agricultural compost.\n(iii) Solar energy is non-conventional because it is renewable, eco-friendly, and does not exhaust natural reserves. India has vast potential because being a tropical nation situated close to the equator, it receives strong solar insolation across ~300 clear sunny days every year.',
        },
      },
    ],
  }),

  // 20. Map Skill (5m) - History (2m) + Geography (3m)
  q({
    bankKey: 'sst-087-map-skill-board-1',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-map-skill',
    questionType: 'map-skill',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'On the outline political map of India, locate and label the following items with suitable symbols:\n\nPart A - History (2 marks):\n(i) The place where Mahatma Gandhi called off the Non-Cooperation Movement due to violence.\n(ii) The place where the Indian National Congress session was held in December 1920.\n\nPart B - Geography (3 marks):\n(iii) Salal Dam - On River Chenab in Jammu & Kashmir.\n(iv) Bhilai Iron and Steel Plant - Chhattisgarh.\n(v) Major Black Soil Region / Cotton Growing Region - Maharashtra / Gujarat.',
        answerKey: {
          valuePoints: [
            '(i) Chauri Chaura (Gorakhpur district, Uttar Pradesh) [1 mark].',
            '(ii) Nagpur (Maharashtra) [1 mark].',
            '(iii) Salal Dam located accurately on River Chenab in J&K [1 mark].',
            '(iv) Bhilai Steel Plant marked accurately in Chhattisgarh [1 mark].',
            '(v) Deccan Trap (Maharashtra / Gujarat black soil region) shaded accurately [1 mark].',
          ],
          modelAnswer:
            'Part A (History):\n(i) Chauri Chaura (Uttar Pradesh) - Violent incident in Feb 1922 led to withdrawal of Non-Cooperation.\n(ii) Nagpur (Maharashtra) - Dec 1920 INC session where Non-Cooperation programme was adopted.\n\nPart B (Geography):\n(iii) Salal Dam: Located on River Chenab in Jammu & Kashmir.\n(iv) Bhilai Iron and Steel Plant: Located in Durg district, Chhattisgarh.\n(v) Black Soil / Cotton Region: Marked across Maharashtra and Saurashtra (Gujarat).',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 3 · Political Science / Civics (20 marks) ─────────────────────────
  // ══════════════════════════════════════════════════════════════════════════

  // 21. Civics - Belgium & Sri Lanka Ethnic Composition (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-power-sharing-mcq-1',
    chapterSlug: 'power-sharing',
    unitId: 'political-science',
    topicId: 'power-sharing-belgium-sri-lanka',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In Belgium, what percentage of the total population lives in the Flemish region and speaks Dutch?',
        answerKey: {
          options: ['59%', '40%', '80%', '20%'],
          correctOptionIndex: 0,
          valuePoints: ['59% of Belgium population lives in the Flemish region and speaks Dutch; 40% lives in Wallonia region and speaks French.'],
          modelAnswer: '59%',
        },
      },
    ],
  }),

  // 22. Civics - Horizontal Power Sharing (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-horizontal-power-mcq-2',
    chapterSlug: 'power-sharing',
    unitId: 'political-science',
    topicId: 'power-sharing-forms',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Power sharing among different organs of government placed at the same level (Legislature, Executive, Judiciary) is called:',
        answerKey: {
          options: [
            'Horizontal distribution of power',
            'Vertical division of power',
            'Federal division of power',
            'Community government',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Horizontal distribution places organs at the same level to exercise different powers and maintain checks and balances.'],
          modelAnswer: 'Horizontal distribution of power',
        },
      },
    ],
  }),

  // 23. Civics - Federalism Lists (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-federal-lists-mcq-3',
    chapterSlug: 'federalism',
    unitId: 'political-science',
    topicId: 'federalism-india-decentralisation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which of the following subjects is included in the Union List of the Indian Constitution?',
        answerKey: {
          options: [
            'Defence, Foreign Affairs and Banking',
            'Police, Trade and Agriculture',
            'Education, Forests and Marriage',
            'Computer software and Cyber law',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Union List contains subjects of national importance: Defence, Foreign Affairs, Banking, Communications, Currency.'],
          modelAnswer: 'Defence, Foreign Affairs and Banking',
        },
      },
    ],
  }),

  // 24. Civics - Recognised National Parties (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-political-parties-mcq-4',
    chapterSlug: 'political-parties',
    unitId: 'political-science',
    topicId: 'political-parties-functions-necessity',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'To be recognised as a National Party by the Election Commission of India, a party must secure at least:',
        answerKey: {
          options: [
            '6% of total votes in Lok Sabha elections or Assembly elections in 4 states, and win at least 4 Lok Sabha seats',
            '10% of total votes in Lok Sabha elections and win at least 10 seats',
            '8% of votes in at least 2 states',
            '50% of the total seats in the Rajya Sabha',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Criteria: 6% votes in Lok Sabha / Assembly elections across 4 states AND at least 4 seats in the Lok Sabha.'],
          modelAnswer: '6% of total votes in Lok Sabha elections or Assembly elections in 4 states, and win at least 4 Lok Sabha seats',
        },
      },
    ],
  }),

  // 25. Civics - 73rd / 74th Constitutional Amendment (VSA 2m)
  q({
    bankKey: 'sst-087-civ-decentralisation-vsa-1',
    chapterSlug: 'federalism',
    unitId: 'political-science',
    topicId: 'federalism-india-decentralisation',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State any two major constitutional steps taken in 1992 towards strengthening local self-government (decentralisation) in India.',
        answerKey: {
          valuePoints: [
            '(i) Mandatory regular elections: It is constitutionally mandatory to hold regular elections to local government bodies [1 mark].',
            '(ii) Reservation: At least one-third (33%) of all positions are reserved for women, and seats are reserved for SCs, STs, and OBCs [1 mark].',
          ],
          modelAnswer:
            'Two major steps taken in 1992:\n1. It was made constitutionally mandatory to hold regular elections to local bodies.\n2. At least one-third (33%) of all seats and executive posts in local bodies were reserved for women.',
        },
      },
    ],
  }),

  // 26. Civics - Communalism in Politics (SA 3m)
  q({
    bankKey: 'sst-087-civ-communalism-sa-1',
    chapterSlug: 'gender-religion-and-caste',
    unitId: 'political-science',
    topicId: 'religion-caste-politics',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Explain three different forms that communalism can take in Indian politics.',
        answerKey: {
          valuePoints: [
            '(i) Everyday beliefs: Religious prejudices, stereotypes of religious communities, and belief in the superiority of one’s own religion [1 mark].',
            '(ii) Political dominance: A quest for political dominance of one’s own religious community (majoritarian dominance for majority group; desire for separate political unit for minority) [1 mark].',
            '(iii) Political mobilisation & riots: Use of sacred religious symbols, religious leaders, emotional appeal, and fear to bring voters together, culminating in communal riots and violence [1 mark].',
          ],
          modelAnswer:
            'Forms of communalism in politics:\n1. Everyday Prejudices: Ingrained religious biases, stereotypes, and belief in the superiority of one religion over others.\n2. Political Mobilisation on Religious Lines: Using holy symbols, emotive rhetoric, and sectarian appeals to polarise voters during elections.\n3. Communal Violence & Riots: Extreme manifestation of communalism leading to mass violence, riots, and ethnic clashes.',
        },
      },
    ],
  }),

  // 27. Civics - Challenges to Political Parties (Long Answer 5m)
  q({
    bankKey: 'sst-087-civ-party-challenges-la-1',
    chapterSlug: 'political-parties',
    unitId: 'political-science',
    topicId: 'political-parties-challenges-reforms',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Explain the four major challenges faced by political parties in modern democratic countries.',
        answerKey: {
          valuePoints: [
            '(i) Lack of internal democracy: Power concentrated in hands of one or few top leaders; no internal registers, organizational elections, or consultation with grassroots workers [1¼ marks].',
            '(ii) Dynastic succession: Top positions controlled by members of one family; capable grassroots workers cannot rise to top leadership [1¼ marks].',
            '(iii) Growing role of money and muscle power: Parties nominate rich candidates or criminals who can raise funds to win elections by any means [1¼ marks].',
            '(iv) Lack of meaningful choice: Parties often agree on fundamental economic policies, reducing ideological differences and leaving voters with little genuine policy choice [1¼ marks].',
          ],
          modelAnswer:
            'Major challenges faced by political parties:\n1. Lack of Internal Democracy: Most parties do not maintain membership rolls, hold regular internal organisational elections, or consult ordinary cadres before major decisions.\n2. Dynastic Succession: Leadership is passed within families rather than earned by merit, denying opportunities to dedicated grassroots workers.\n3. Money and Muscle Power: Parties prioritise wealthy candidates, corporate donors, and criminals with electoral winnability over principled candidates.\n4. Lack of Meaningful Choice: Major parties often share similar economic and governance agendas, leaving voters with no distinct ideological alternatives.',
        },
      },
    ],
  }),

  // 28. Civics - Case Study (4m) - Accommodation in Belgium
  q({
    bankKey: 'sst-087-civ-belgium-accommodation-case-1',
    chapterSlug: 'power-sharing',
    unitId: 'political-science',
    topicId: 'power-sharing-forms',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the passage below and answer the questions that follow:\nThe Belgian leaders took a path different from Sri Lanka. They recognised the existence of regional differences and cultural diversities. Between 1970 and 1993, they amended their constitution four times so as to work out an arrangement that would enable everyone to live together within the same country. The arrangement they worked out is different from any other country and is very innovative.\n\n(i) How many times did Belgian leaders amend their constitution between 1970 and 1993? (1 mark)\n(ii) Mention one feature of the Belgian model regarding representation in the Central Government. (1 mark)\n(iii) What is the role of the unique "Community Government" in Belgium? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) Four times [1 mark].',
            '(ii) Dutch and French-speaking ministers are equal in number in the Central Government; no single community can make unilateral decisions [1 mark].',
            '(iii) Community Government is elected by people belonging to one language community (Dutch, French, German-speaking), irrespective of where they live. It has power regarding cultural, educational, and language-related issues [2 marks].',
          ],
          modelAnswer:
            '(i) The Belgian Constitution was amended four times between 1970 and 1993.\n(ii) Central Government parity: The number of Dutch-speaking and French-speaking ministers is equal in the national cabinet.\n(iii) The Community Government is elected by members of each linguistic group (Dutch, French, German) regardless of region. It holds jurisdiction over cultural affairs, education, and language matters, protecting community rights.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Unit 4 · Economics · Understanding Economic Development (20 marks) ───
  // ══════════════════════════════════════════════════════════════════════════

  // 29. Economics - Per Capita Income & World Bank (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-per-capita-income-mcq-1',
    chapterSlug: 'development',
    unitId: 'economics',
    topicId: 'development-goals-income-criteria',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In World Development Reports brought out by the World Bank, which criterion is used in classifying countries as rich or low-income?',
        answerKey: {
          options: ['Per capita income', 'Total gross domestic product', 'Literacy rate', 'Human Development Index'],
          correctOptionIndex: 0,
          valuePoints: ['The World Bank uses Per Capita Income (average income) to classify countries.'],
          modelAnswer: 'Per capita income',
        },
      },
    ],
  }),

  // 30. Economics - Tertiary Sector (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-tertiary-sector-mcq-2',
    chapterSlug: 'sectors-of-indian-economy',
    unitId: 'economics',
    topicId: 'economic-sectors-primary-secondary-tertiary',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Activities like transport, storage, communication, banking and trade belong to the:',
        answerKey: {
          options: ['Tertiary sector', 'Primary sector', 'Secondary sector', 'Quaternary sector'],
          correctOptionIndex: 0,
          valuePoints: ['Tertiary activities generate services rather than tangible goods, aiding the production process.'],
          modelAnswer: 'Tertiary sector',
        },
      },
    ],
  }),

  // 31. Economics - Disguised Unemployment (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-disguised-unemployment-mcq-3',
    chapterSlug: 'sectors-of-indian-economy',
    unitId: 'economics',
    topicId: 'organised-unorganised-public-private',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Underemployment (or disguised unemployment) occurs when people are:',
        answerKey: {
          options: [
            'Working less than what they are capable of doing',
            'Not willing to work at existing wages',
            'Temporarily laid off during off-season',
            'Paid higher salaries than their skills warrant',
          ],
          correctOptionIndex: 0,
          valuePoints: ['In disguised unemployment, more people work on a farm than required; each person does some work but none is fully utilised.'],
          modelAnswer: 'Working less than what they are capable of doing',
        },
      },
    ],
  }),

  // 32. Economics - Functions of RBI (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-rbi-functions-mcq-4',
    chapterSlug: 'money-and-credit',
    unitId: 'economics',
    topicId: 'money-medium-exchange-modern-forms',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In India, which formal authority issues currency notes on behalf of the Central Government?',
        answerKey: {
          options: [
            'Reserve Bank of India (RBI)',
            'State Bank of India (SBI)',
            'Ministry of Commerce',
            'NITI Aayog',
          ],
          correctOptionIndex: 0,
          valuePoints: ['As per Indian law, the Reserve Bank of India issues currency notes on behalf of the Central Government.'],
          modelAnswer: 'Reserve Bank of India (RBI)',
        },
      },
    ],
  }),

  // 33. Economics - Collateral & Credit (VSA 2m)
  q({
    bankKey: 'sst-087-eco-collateral-credit-vsa-1',
    chapterSlug: 'money-and-credit',
    unitId: 'economics',
    topicId: 'credit-formal-informal-self-help-groups',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What is meant by "collateral"? Why do commercial banks demand collateral before sanctioning loans?',
        answerKey: {
          valuePoints: [
            'Definition: An asset that the borrower owns (land, building, vehicle, livestock, bank deposit) and uses as a guarantee to a lender until the loan is repaid [1 mark].',
            'Purpose: Protects lender against default; if the borrower fails to repay, the lender has the right to sell the collateral to recover the loan amount [1 mark].',
          ],
          modelAnswer:
            '1. Collateral is a physical or financial asset owned by the borrower (e.g. land, house title, vehicle, fixed deposit) pledged as security to the lender until the loan is paid off.\n2. Banks require collateral as a risk safeguard; if the borrower defaults on repayment, the bank has the legal right to liquidate the asset to recover outstanding dues.',
        },
      },
    ],
  }),

  // 34. Economics - Formal vs Informal Credit (SA 3m)
  q({
    bankKey: 'sst-087-eco-formal-informal-credit-sa-1',
    chapterSlug: 'money-and-credit',
    unitId: 'economics',
    topicId: 'credit-formal-informal-self-help-groups',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Compare the formal and informal sources of credit in India on three parameters: (i) Regulatory supervision, (ii) Rate of interest, (iii) Target beneficiaries.',
        answerKey: {
          valuePoints: [
            '(i) Supervision: Formal sector (banks, cooperatives) is supervised by RBI; informal sector (moneylenders, traders, relatives) has no regulatory oversight [1 mark].',
            '(ii) Interest Rate: Formal sector charges reasonable, transparent interest rates; informal lenders charge exorbitant rates leading to debt traps [1 mark].',
            '(iii) Beneficiaries: Rich urban households access ~85% of formal credit; poor rural households remain dependent on informal credit due to lack of collateral [1 mark].',
          ],
          modelAnswer:
            'Comparison of Credit Sources:\n1. Supervision: Formal sources (banks/cooperatives) are strictly monitored by the RBI. Informal sources (moneylenders, employers) have no overseeing body.\n2. Interest Rates: Formal loans have fixed, fair interest rates. Informal loans carry exploitative, exorbitant interest rates.\n3. Beneficiaries: Formal credit predominantly reaches urban and wealthy borrowers with collateral, while impoverished rural households are forced into informal loans due to lack of documentation.',
        },
      },
    ],
  }),

  // 35. Economics - Globalisation & Multinational Corporations (Long Answer 5m)
  q({
    bankKey: 'sst-087-eco-globalisation-mnc-la-1',
    chapterSlug: 'globalisation',
    unitId: 'economics',
    topicId: 'globalisation-board-exam',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'What is globalisation? Explain four major factors that have facilitated the process of globalisation in India.',
        answerKey: {
          valuePoints: [
            'Definition: Process of rapid integration or interconnection between countries through trade, foreign investment, technology, and movement of people [1 mark].',
            'Factor 1: Rapid improvement in technology (telecommunications, internet, computers, mobile phones) enabling instant transmission of information at negligible cost [1 mark].',
            'Factor 2: Improvements in transportation technology (containerisation, faster cargo vessels, air freight) making long-distance delivery of goods faster and cheaper [1 mark].',
            'Factor 3: Liberalisation of foreign trade and foreign investment policies (New Economic Policy of 1991 removing barriers and import quotas) [1 mark].',
            'Factor 4: Role of international bodies (WTO) pressuring developing nations to liberalise trade barriers [1 mark].',
          ],
          modelAnswer:
            'Globalisation is the process of rapid economic integration and interconnectedness among nations through the exchange of goods, services, capital, and technology across borders.\n\nFactors Facilitating Globalisation in India:\n1. Telecommunications & IT Revolution: Internet, satellite links, and mobile connectivity enable instantaneous global communication and frictionless cross-border services.\n2. Transportation Advancements: Container shipping and expanded air cargo drastically reduced transit times and freight costs for bulky commodities.\n3. Trade Liberalisation (1991 Reforms): Abolishing import licensing, lowering customs tariffs, and permitting foreign direct investment (FDI) allowed global MNCs to establish Indian operations.\n4. Expansion of MNC Networks: Multinational Corporations fragmented production across multiple countries to minimise manufacturing costs.',
        },
      },
    ],
  }),

  // 36. Economics - Case Study (4m) - Self-Help Groups (SHGs)
  q({
    bankKey: 'sst-087-eco-shg-rural-poor-case-1',
    chapterSlug: 'money-and-credit',
    unitId: 'economics',
    topicId: 'credit-formal-informal-self-help-groups',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the source given below and answer the questions that follow:\nIn recent years, people have tried out some newer ways of providing loans to the poor. The idea is to organise rural poor, in particular women, into small Self Help Groups (SHGs) and pool their savings. A typical SHG has 15–20 members, usually belonging to one neighbourhood, who meet and save regularly. Saving per member varies from ₹25 to ₹100 or more, depending on the ability of the people to save. Members can take small loans from the group itself to meet their needs.\n\n(i) What is the typical membership size of a rural Self Help Group (SHG)? (1 mark)\n(ii) Why are SHGs particularly beneficial for rural women? (1 mark)\n(iii) How do SHGs help poor borrowers overcome the problem of lack of collateral when taking bank loans? (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) 15 to 20 members [1 mark].',
            '(ii) Provides financial self-reliance, creates a regular savings habit, and provides a platform to discuss social issues like health, nutrition, and domestic violence [1 mark].',
            '(iii) If an SHG is regular in savings for 1-2 years, it becomes eligible for bank loans without collateral because the group as a whole acts as guarantor. In case of non-repayment by one member, other members follow up seriously [2 marks].',
          ],
          modelAnswer:
            '(i) A typical SHG consists of 15 to 20 members.\n(ii) SHGs empower rural women financially by instilling saving habits, providing credit for micro-enterprises, and offering a supportive forum for discussing health, education, and domestic welfare.\n(iii) SHGs overcome collateral barriers because after establishing consistent saving records, banks sanction group loans in the name of the SHG. The collective membership acts as mutual guarantors, eliminating the requirement for individual land or asset pledges.',
        },
      },
    ],
  }),

  // ══════════════════════════════════════════════════════════════════════════
  // ── Additional Pool for Multi-Seed Variety & Invariant Fulfillment ─────────
  // ══════════════════════════════════════════════════════════════════════════

  // 37. History - Print & Women Writers (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-women-writers-mcq-7',
    chapterSlug: 'print-culture',
    unitId: 'history',
    topicId: 'print-culture-india-nationalism',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Who wrote the first full-length autobiography in Bengali, titled "Amar Jiban", published in 1876?',
        answerKey: {
          options: ['Rashsundari Debi', 'Kailashbashini Debi', 'Tarabai Shinde', 'Pandita Ramabai'],
          correctOptionIndex: 0,
          valuePoints: ['Rashsundari Debi secretly learned to read in the kitchen and wrote Amar Jiban (1876).'],
          modelAnswer: 'Rashsundari Debi',
        },
      },
    ],
  }),

  // 38. Geography - Soil Erosion Methods (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-soil-conservation-mcq-6',
    chapterSlug: 'resources-and-development',
    unitId: 'geography',
    topicId: 'land-resources-soil-conservation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Ploughing along the contour lines to decelerate the flow of water down the slopes is called:',
        answerKey: {
          options: ['Contour ploughing', 'Terrace cultivation', 'Strip cropping', 'Shelter belts'],
          correctOptionIndex: 0,
          valuePoints: ['Contour ploughing cuts across slope lines to check water velocity and soil wash-off.'],
          modelAnswer: 'Contour ploughing',
        },
      },
    ],
  }),

  // 39. Civics - Secular State (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-secular-state-mcq-5',
    chapterSlug: 'gender-religion-and-caste',
    unitId: 'political-science',
    topicId: 'religion-caste-politics',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which constitutional provision ensures that India is a secular state?',
        answerKey: {
          options: [
            'There is no official religion for the Indian State',
            'Special privileges are given to the majority religious community',
            'Religious instruction is compulsory in government schools',
            'Only citizens belonging to a specific religion can hold constitutional posts',
          ],
          correctOptionIndex: 0,
          valuePoints: ['The Indian Constitution does not grant official status to any single religion.'],
          modelAnswer: 'There is no official religion for the Indian State',
        },
      },
    ],
  }),

  // 40. Economics - Public Sector Role (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-public-sector-mcq-5',
    chapterSlug: 'sectors-of-indian-economy',
    unitId: 'economics',
    topicId: 'organised-unorganised-public-private',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The primary objective of the public sector in an economy is:',
        answerKey: {
          options: [
            'Social welfare and public development',
            'Maximising private shareholder profits',
            'Export promotion exclusively',
            'Eradicating all private enterprises',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Public sector enterprises are guided by collective public welfare rather than purely profit motive.'],
          modelAnswer: 'Social welfare and public development',
        },
      },
    ],
  }),

  // 41. Geography - Mineral Conservation (VSA 2m)
  q({
    bankKey: 'sst-087-geo-mineral-conservation-vsa-2',
    chapterSlug: 'minerals-and-energy-resources',
    unitId: 'geography',
    topicId: 'minerals-occurrence-distribution-conservation',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why is conservation of mineral resources essential? State two methods to conserve minerals.',
        answerKey: {
          valuePoints: [
            'Need: Mineral formation takes millions of years; they are finite and non-renewable [1 mark].',
            'Methods: (i) Recycling of metals (scrap iron/copper), (ii) Using renewable substitutes, (iii) Improved mining technologies to minimise wastage [1 mark].',
          ],
          modelAnswer:
            'Need: Minerals are finite, non-renewable geological assets that take millions of years to form.\nConservation methods:\n1. Recycling metals and using scrap materials.\n2. Adopting improved technologies to extract low-grade ores efficiently and substituting with renewable materials.',
        },
      },
    ],
  }),

  // 42. Civics - Federalism Holding vs Coming Together (SA 3m)
  q({
    bankKey: 'sst-087-civ-holding-coming-together-sa-2',
    chapterSlug: 'federalism',
    unitId: 'political-science',
    topicId: 'federalism-features-levels',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Differentiate between "Coming Together" and "Holding Together" federations with one example of each.',
        answerKey: {
          valuePoints: [
            'Coming Together: Independent states come together on their own to form a bigger unit, pooling sovereignty while retaining identity (e.g. USA, Switzerland, Australia). Constituent units usually have equal power [1½ marks].',
            'Holding Together: A large country decides to divide its power between constituent states and the national government (e.g. India, Spain, Belgium). Central government tends to be more powerful [1½ marks].',
          ],
          modelAnswer:
            '1. "Coming Together" Federations:\n• Independent sovereign states unite voluntarily to increase their collective security (e.g. USA, Australia, Switzerland).\n• Constituent states typically enjoy equal powers vis-à-vis the federal government.\n\n2. "Holding Together" Federations:\n• A large unified country divides power between the national center and state governments (e.g. India, Spain, Belgium).\n• The Central government is generally stronger, and some states may enjoy special constitutional asymmetric status.',
        },
      },
    ],
  }),

  // 43. Economics - Sustainable Development (SA 3m)
  q({
    bankKey: 'sst-087-eco-sustainable-development-sa-2',
    chapterSlug: 'development',
    unitId: 'economics',
    topicId: 'development-public-facilities-sustainability',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"Consequences of environmental degradation do not respect national or state boundaries." Support this statement with suitable examples.',
        answerKey: {
          valuePoints: [
            'Interconnectedness: Environmental issues like air pollution, ozone depletion, and global warming affect all nations regardless of where emissions occur [1 mark].',
            'Resource Depletion: Overuse of groundwater in northern India or pollution of common river systems impacts multiple states and future generations [1 mark].',
            'Conclusion: Sustainable development requires collective global and national responsibility rather than isolated local action [1 mark].',
          ],
          modelAnswer:
            '1. Transboundary Impact: Air pollution, greenhouse emissions, and ocean plastic waste circulate globally, causing climate change and erratic rainfall across all continents.\n2. Shared Resources: Over-extraction of shared groundwater tables in northwest India causes regional water crises affecting downstream communities irrespective of state borders.\n3. Shared Future: Our sustainability is indivisible; environmental protection mandates universal cooperation because natural ecosystems function as interconnected global commons.',
        },
      },
    ],
  }),

  // 44. Civics - Democracy Outcomes & Accountability (Long Answer 5m)
  q({
    bankKey: 'sst-087-civ-democracy-outcomes-la-2',
    chapterSlug: 'outcomes-of-democracy',
    unitId: 'political-science',
    topicId: 'democracy-accountable-responsive-legitimate',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: '"Democracy is a better form of government when compared with dictatorship or any other alternative." Examine the statement with five arguments.',
        answerKey: {
          valuePoints: [
            '(i) Promotes equality among citizens: Recognises fundamental rights and equal voting power (universal adult suffrage) [1 mark].',
            '(ii) Enhances dignity of the individual: Protects personal freedom and human rights [1 mark].',
            '(iii) Improves quality of decision-making: Decisions involve consultation, debate, and deliberation among diverse representatives [1 mark].',
            '(iv) Provides method to resolve conflicts: Accommodates social differences amicably through negotiation rather than suppression [1 mark].',
            '(v) Allows room to correct mistakes: Public discussion and democratic accountability force leaders to alter faulty decisions or face defeat in elections [1 mark].',
          ],
          modelAnswer:
            'Democracy is superior to alternative regimes because:\n1. Promotes Civic Equality: Guarantees universal adult suffrage and constitutional equality to every citizen regardless of status.\n2. Enhances Human Dignity: Upholds fundamental freedoms of speech, assembly, and belief, preventing tyranny.\n3. Improves Decision Quality: Policies emerge through parliamentary scrutiny, debate, and public consultation, minimising hasty blunders.\n4. Amicable Conflict Resolution: Provides peaceful mechanisms to mediate linguistic, religious, and socio-economic disputes.\n5. Scope for Course Correction: Transparency and free elections ensure governments must rectify errors or face dismissal by voters.',
        },
      },
    ],
  }),

  // 45. Economics - Human Development Index vs Income (SA 3m)
  q({
    bankKey: 'sst-087-eco-hdi-vs-income-sa-3',
    chapterSlug: 'development',
    unitId: 'economics',
    topicId: 'development-goals-income-criteria',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why is the Human Development Index (HDI) published by UNDP considered a broader and better measure of development than the World Bank’s Per Capita Income criterion?',
        answerKey: {
          valuePoints: [
            '(i) Beyond Money: Income alone cannot measure human well-being, freedom, and access to basic healthcare and education [1 mark].',
            '(ii) Multi-dimensional parameters: UNDP includes Life Expectancy at birth (health) and Mean Years of Schooling (educational attainment) along with Per Capita GNI [1 mark].',
            '(iii) Distribution and quality: HDI highlights real living standards and quality of human capability rather than gross statistical averages that mask extreme poverty [1 mark].',
          ],
          modelAnswer:
            '1. Multi-dimensional scope: While the World Bank measures only financial income, the UNDP HDI combines economic health (GNI per capita) with life expectancy (health) and literacy/schooling (education).\n2. Reflects Living Quality: Money cannot buy pollution-free air, disease protection, or social respect; HDI reflects actual human welfare.\n3. Prevents Distortion: Per capita income hides inequality (a small wealthy elite can skew averages), whereas HDI reflects broad public health and education reach.',
        },
      },
    ],
  }),

  // 46. Civics - Majoritarianism in Sri Lanka (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-sri-lanka-majoritarianism-mcq-6',
    chapterSlug: 'power-sharing',
    unitId: 'political-science',
    topicId: 'power-sharing-belgium-sri-lanka',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In Sri Lanka, an Act was passed in 1956 to recognise which language as the only official language, disregarding Tamil?',
        answerKey: {
          options: ['Sinhala', 'Tamil', 'English', 'Pali'],
          correctOptionIndex: 0,
          valuePoints: ['In 1956, an Act was passed to recognise Sinhala as the only official language.'],
          modelAnswer: 'Sinhala',
        },
      },
    ],
  }),

  // 47. Civics - Concurrent List Subjects (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-concurrent-list-mcq-7',
    chapterSlug: 'federalism',
    unitId: 'political-science',
    topicId: 'federalism-india-decentralisation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which of the following subjects falls under the Concurrent List of the Indian Constitution?',
        answerKey: {
          options: [
            'Education, Forests, Trade Unions and Marriage',
            'Defence, Foreign Affairs and Currency',
            'Police, Public Health and Agriculture',
            'Cyber Laws and Computer Software',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Concurrent List includes subjects of common interest like Education, Forests, Trade Unions, Marriage, Adoption and Succession.'],
          modelAnswer: 'Education, Forests, Trade Unions and Marriage',
        },
      },
    ],
  }),

  // 48. Civics - Feminist Movement (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-feminist-movement-mcq-8',
    chapterSlug: 'gender-religion-and-caste',
    unitId: 'political-science',
    topicId: 'gender-politics',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A woman or a man who believes in equal rights and opportunities for women and men is termed a:',
        answerKey: {
          options: ['Feminist', 'Patriarch', 'Secularist', 'Communalist'],
          correctOptionIndex: 0,
          valuePoints: ['A feminist is an advocate of equal social, political, and economic rights and opportunities for women.'],
          modelAnswer: 'Feminist',
        },
      },
    ],
  }),

  // 49. Civics - Multi-Party System in India (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-party-system-mcq-9',
    chapterSlug: 'political-parties',
    unitId: 'political-science',
    topicId: 'political-parties-functions-necessity',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Why has India evolved a multi-party system instead of a two-party system?',
        answerKey: {
          options: [
            'Because the social and geographical diversity of India cannot be absorbed by two or three parties',
            'Because the Constitution mandates at least ten national parties',
            'Because regional parties are banned from forming alliances',
            'Because the President of India appoints different parties',
          ],
          correctOptionIndex: 0,
          valuePoints: ['India has evolved a multi-party system because the immense social and geographical diversity of a vast country cannot be easily represented by only two or three parties.'],
          modelAnswer: 'Because the social and geographical diversity of India cannot be absorbed by two or three parties',
        },
      },
    ],
  }),

  // 50. Civics - Transparency in Democracy (MCQ 1m)
  q({
    bankKey: 'sst-087-civ-transparency-democracy-mcq-10',
    chapterSlug: 'outcomes-of-democracy',
    unitId: 'political-science',
    topicId: 'democracy-accountable-responsive-legitimate',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'A citizen has the right and means to examine the process of decision making in a democracy. This factor is known as:',
        answerKey: {
          options: ['Transparency', 'Legitimacy', 'Accountability', 'Dictatorship'],
          correctOptionIndex: 0,
          valuePoints: ['Transparency means that decisions are taken following established norms and procedures, and citizens can examine this process.'],
          modelAnswer: 'Transparency',
        },
      },
    ],
  }),

  // 51. Civics - Prudential vs Moral Reasons for Power Sharing (SA 3m)
  q({
    bankKey: 'sst-087-civ-prudential-moral-power-sa-3',
    chapterSlug: 'power-sharing',
    unitId: 'political-science',
    topicId: 'power-sharing-forms',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Differentiate between "prudential" and "moral" reasons for power sharing in a democracy with suitable arguments.',
        answerKey: {
          valuePoints: [
            'Prudential reasons: Emphasise that power sharing brings out better outcomes by reducing the possibility of conflict between social groups, ensuring political stability [1½ marks].',
            'Moral reasons: Emphasise the very act of power sharing as valuable and essential because power sharing is the spirit of democracy (a democratic rule involves sharing power with those affected by its exercise) [1½ marks].',
          ],
          modelAnswer:
            '1. Prudential Reasons (Outcome-based):\n• Power sharing reduces friction and violent conflict between diverse linguistic and religious groups.\n• It ensures political stability and preserves national unity by preventing majoritarian tyranny.\n\n2. Moral Reasons (Principle-based):\n• Power sharing is the very soul and spirit of democracy.\n• In a genuine democracy, citizens have a fundamental right to be consulted on how they are governed.',
        },
      },
    ],
  }),

  // 52. Civics - Case Study / Source-Based (4m) - Language Policy of India
  q({
    bankKey: 'sst-087-civ-language-policy-case-2',
    chapterSlug: 'federalism',
    unitId: 'political-science',
    topicId: 'federalism-india-decentralisation',
    questionType: 'case-study',
    marks: 4,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Read the source given below and answer the questions that follow:\nA second test for Indian federation is the language policy. Our Constitution did not give the status of national language to any one language. Hindi was identified as the official language. But Hindi is the mother tongue of only about 40 per cent of Indians. Therefore, there were many safeguards to protect other languages. Besides Hindi, there are 21 other languages recognised as Scheduled Languages by the Eighth Schedule of the Constitution. A candidate in an examination conducted for the Central Government positions may opt to take the examination in any of these languages.\n\n(i) Does the Indian Constitution declare any single language as the "National Language"? (1 mark)\n(ii) How many languages are recognised in the Eighth Schedule of the Indian Constitution? (1 mark)\n(iii) Explain how the flexibility shown by Indian political leaders regarding language policy helped India avoid the kind of civil conflict that Sri Lanka experienced. (2 marks)',
        answerKey: {
          valuePoints: [
            '(i) No, the Constitution does not give the status of national language to any one language; Hindi is identified as the official language [1 mark].',
            '(ii) 22 languages (Hindi + 21 other Scheduled Languages) [1 mark].',
            '(iii) Unlike Sri Lanka which imposed Sinhala and alienated Tamils, India accommodated linguistic diversity by allowing English to continue alongside Hindi for official purposes and giving equal status to 22 scheduled languages in Central recruitment examinations [2 marks].',
          ],
          modelAnswer:
            '(i) No, the Indian Constitution did not designate any single language as the National Language; Hindi is designated as an official language.\n(ii) 22 languages are listed in the Eighth Schedule (Hindi plus 21 recognised regional languages).\n(iii) By refusing to impose Hindi on non-Hindi southern states and continuing bilingualism (English alongside Hindi) for administrative communication, Indian leaders accommodated regional identities, preserving national harmony and avoiding the violent ethnic civil war that engulfed Sri Lanka.',
        },
      },
    ],
  }),

  // 53. History - Frankfurt Parliament (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-frankfurt-parliament-mcq-8',
    chapterSlug: 'rise-of-nationalism-in-europe',
    unitId: 'history',
    topicId: 'rise-nationalism-european-nationalism-imperialism',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In 1848, the 831 elected German representatives marched in a festive procession to take their places in the Frankfurt Parliament convened in:',
        answerKey: {
          options: [
            'The Church of St. Paul',
            'The Palace of Versailles',
            'The Reichstag Building',
            'The Hall of Mirrors',
          ],
          correctOptionIndex: 0,
          valuePoints: ['On 18 May 1848, 831 elected representatives drafted a constitution in the Church of St. Paul in Frankfurt.'],
          modelAnswer: 'The Church of St. Paul',
        },
      },
    ],
  }),

  // 54. History - Poona Pact (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-poona-pact-mcq-9',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-civil-disobedience-collective-belonging',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The Poona Pact of September 1932 between Mahatma Gandhi and Dr. B.R. Ambedkar resulted in:',
        answerKey: {
          options: [
            'Reserved seats for the Depressed Classes in provincial and central legislative councils to be voted in by general electorate',
            'Separate electorates for Muslims and Dalits in all provinces',
            'Immediate declaration of Complete Independence (Purna Swaraj)',
            'The unconditional release of all political prisoners of Civil Disobedience',
          ],
          correctOptionIndex: 0,
          valuePoints: ['The Poona Pact gave Depressed Classes reserved seats in provincial and central councils, but they were to be voted in by the general electorate.'],
          modelAnswer: 'Reserved seats for the Depressed Classes in provincial and central legislative councils to be voted in by general electorate',
        },
      },
    ],
  }),

  // 55. History - Alluri Sitaram Raju (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-alluri-sitaram-raju-mcq-10',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-first-world-war-khilafat-non-cooperation',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Who led the militant guerrilla movement of tribal peasants in the Gudem Hills of Andhra Pradesh in the early 1920s?',
        answerKey: {
          options: ['Alluri Sitaram Raju', 'Baba Ramchandra', 'Birsa Munda', 'Jatindra Nath Das'],
          correctOptionIndex: 0,
          valuePoints: ['Alluri Sitaram Raju claimed special powers and led the tribal guerrilla uprising in Gudem Hills.'],
          modelAnswer: 'Alluri Sitaram Raju',
        },
      },
    ],
  }),

  // 56. History - Rinderpest in Africa (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-rinderpest-africa-mcq-11',
    chapterSlug: 'making-of-a-global-world',
    unitId: 'history',
    topicId: 'making-of-a-global-world-conquest-disease-trade',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The devastating cattle disease that arrived in Africa in the late 1880s, killing 90 percent of the cattle and destroying local livelihoods, was called:',
        answerKey: {
          options: ['Rinderpest (Cattle Plague)', 'Smallpox', 'Anthrax', 'Foot and mouth disease'],
          correctOptionIndex: 0,
          valuePoints: ['Rinderpest arrived in Africa in the late 1880s carried by infected cattle imported from British Asia and wiped out 90% of African livestock.'],
          modelAnswer: 'Rinderpest (Cattle Plague)',
        },
      },
    ],
  }),

  // 57. History - Sambad Kaumudi (MCQ 1m)
  q({
    bankKey: 'sst-087-hist-sambad-kaumudi-mcq-12',
    chapterSlug: 'print-culture',
    unitId: 'history',
    topicId: 'print-culture-religion-reform-public-debate',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'From 1821, Raja Rammohan Roy published which newspaper in Bengali to campaign against social evils like Sati and idol worship?',
        answerKey: {
          options: ['Sambad Kaumudi', 'Samachar Chandrika', 'Kesari', 'Mirat-ul-Akhbar'],
          correctOptionIndex: 0,
          valuePoints: ['Raja Rammohan Roy published Sambad Kaumudi from 1821; orthodox Hindus commissioned Samachar Chandrika to oppose his opinions.'],
          modelAnswer: 'Sambad Kaumudi',
        },
      },
    ],
  }),

  // 58. History - Impact of WWI on India (SA 3m)
  q({
    bankKey: 'sst-087-hist-ww1-impact-india-sa-2',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-first-world-war-khilafat-non-cooperation',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How did the First World War create a new economic and political situation in India? State three reasons.',
        answerKey: {
          valuePoints: [
            '(i) Huge increase in defense expenditure: Financed by war loans and increasing taxes; customs duties were raised and income tax introduced [1 mark].',
            '(ii) Price rise and extreme hardship: Prices doubled between 1913 and 1918, leading to severe inflation and distress for common people [1 mark].',
            '(iii) Forced recruitment and crop failures: Villages called upon to supply soldiers via forced recruitment; accompanied by acute food shortages due to crop failure and the influenza epidemic of 1918–21 [1 mark].',
          ],
          modelAnswer:
            'Impact of the First World War on India:\n1. Fiscal Burden & Taxes: Led to a colossal rise in British defence spending, funded by war loans, enhanced customs duties, and the first-ever introduction of income tax in India.\n2. Hyperinflation: Commodity prices doubled between 1913 and 1918, causing severe economic misery for peasants and working classes.\n3. Forced Recruitment & Epidemics: Villagers were forcibly conscripted into the colonial army, and widespread post-war crop failures combined with the 1920–21 influenza epidemic killed 12 to 13 million people.',
        },
      },
    ],
  }),

  // 59. Geography - Rio Earth Summit 1992 (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-rio-summit-mcq-7',
    chapterSlug: 'resources-and-development',
    unitId: 'geography',
    topicId: 'resources-classification-planning-development',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'In June 1992, more than 100 heads of states met in Rio de Janeiro in Brazil for the first International Earth Summit. Which global declaration was adopted at this summit?',
        answerKey: {
          options: ['Agenda 21', 'Kyoto Protocol', 'Paris Agreement', 'Montreal Protocol'],
          correctOptionIndex: 0,
          valuePoints: ['The Rio Convention endorsed Global Forest Principles and adopted Agenda 21 for achieving Sustainable Development in the 21st century.'],
          modelAnswer: 'Agenda 21',
        },
      },
    ],
  }),

  // 60. Geography - Golden Quadrilateral (MCQ 1m)
  q({
    bankKey: 'sst-087-geo-golden-quadrilateral-mcq-8',
    chapterSlug: 'manufacturing-industries',
    unitId: 'geography',
    topicId: 'manufacturing-importance-classification-location',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'The Golden Quadrilateral Super Highway project connects which four major metropolitan cities of India?',
        answerKey: {
          options: [
            'Delhi, Mumbai, Chennai and Kolkata',
            'Delhi, Bengaluru, Hyderabad and Kolkata',
            'Mumbai, Pune, Ahmedabad and Delhi',
            'Kolkata, Patna, Lucknow and Delhi',
          ],
          correctOptionIndex: 0,
          valuePoints: ['The Golden Quadrilateral connects Delhi-Kolkata-Chennai-Mumbai-Delhi by 6-lane super highways.'],
          modelAnswer: 'Delhi, Mumbai, Chennai and Kolkata',
        },
      },
    ],
  }),

  // 61. Geography - Golden Fibre (Jute) (VSA 2m)
  q({
    bankKey: 'sst-087-geo-jute-golden-fibre-vsa-3',
    chapterSlug: 'agriculture',
    unitId: 'geography',
    topicId: 'agriculture-major-crops-reforms',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Which crop is known as the "golden fibre"? Mention two ideal geographical conditions required for its growth.',
        answerKey: {
          valuePoints: [
            'Name: Jute is known as the golden fibre [1 mark].',
            'Conditions: (i) Well-drained fertile soils in flood plains where soils are renewed every year, (ii) High temperature and high humidity during the time of growth (e.g. West Bengal, Bihar, Assam) [1 mark].',
          ],
          modelAnswer:
            '1. Crop: Jute is known as the "golden fibre".\n2. Geographical conditions:\n• Fertile, well-drained alluvial soil in floodplains where silt is renewed annually.\n• High temperature (>25°C) and heavy rainfall/humidity throughout the growing cycle.',
        },
      },
    ],
  }),

  // 62. Geography - Conventional vs Non-Conventional Energy (SA 3m)
  q({
    bankKey: 'sst-087-geo-energy-sources-sa-2',
    chapterSlug: 'minerals-and-energy-resources',
    unitId: 'geography',
    topicId: 'energy-resources-conventional-nonconventional',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Distinguish between conventional and non-conventional sources of energy with two examples of each.',
        answerKey: {
          valuePoints: [
            'Conventional sources: Energy sources used for a long time; exhaustible and cause environmental pollution (e.g. Coal, Petroleum, Natural Gas, Firewood) [1½ marks].',
            'Non-conventional sources: Renewable, inexhaustible modern energy sources that are eco-friendly and produce minimal emissions (e.g. Solar energy, Wind energy, Biogas, Tidal energy) [1½ marks].',
          ],
          modelAnswer:
            '1. Conventional Energy Sources:\n• Traditional, finite, and depletable energy forms that cause significant environmental pollution upon combustion.\n• Examples: Coal, petroleum, and natural gas.\n\n2. Non-Conventional Energy Sources:\n• Modern, renewable, inexhaustible, and environmentally sustainable energy resources.\n• Examples: Solar power, wind energy, and geothermal energy.',
        },
      },
    ],
  }),

  // 63. Economics - Body Mass Index (BMI) (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-bmi-mcq-6',
    chapterSlug: 'development',
    unitId: 'economics',
    topicId: 'development-public-facilities-sustainability',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Body Mass Index (BMI) is calculated by dividing weight in kilograms by the square of height in metres. An adult is considered undernourished if their BMI is less than:',
        answerKey: {
          options: ['18.5', '25.0', '22.0', '30.0'],
          correctOptionIndex: 0,
          valuePoints: ['If BMI is less than 18.5 then the person would be considered undernourished; if BMI is over 25, the person is overweight.'],
          modelAnswer: '18.5',
        },
      },
    ],
  }),

  // 64. Economics - MGNREGA 2005 (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-mgnrega-mcq-7',
    chapterSlug: 'sectors-of-indian-economy',
    unitId: 'economics',
    topicId: 'organised-unorganised-public-private',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Under Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) 2005, the government guarantees how many days of employment in a year to rural households?',
        answerKey: {
          options: ['100 days', '150 days', '200 days', '60 days'],
          correctOptionIndex: 0,
          valuePoints: ['MGNREGA 2005 guarantees 100 days of wage employment in a year to all rural households whose adult members volunteer to do unskilled manual work.'],
          modelAnswer: '100 days',
        },
      },
    ],
  }),

  // 65. Economics - Terms of Credit (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-terms-of-credit-mcq-8',
    chapterSlug: 'money-and-credit',
    unitId: 'economics',
    topicId: 'credit-formal-informal-self-help-groups',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Interest rate, collateral and documentation requirement, and the mode of repayment together comprise what is called the:',
        answerKey: {
          options: [
            'Terms of credit',
            'Credit balance',
            'Debt trap',
            'Collateral index',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Interest rate, collateral, documentation, and mode of repayment comprise the terms of credit.'],
          modelAnswer: 'Terms of credit',
        },
      },
    ],
  }),

  // 66. Economics - Special Economic Zones (SEZs) (MCQ 1m)
  q({
    bankKey: 'sst-087-eco-sez-mcq-9',
    chapterSlug: 'globalisation',
    unitId: 'economics',
    topicId: 'globalisation-board-exam',
    questionType: 'mcq',
    marks: 1,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'To attract foreign companies to invest in India, the Central and State Governments set up industrial zones called Special Economic Zones (SEZs). Companies that set up production units in SEZs enjoy:',
        answerKey: {
          options: [
            'Exemption from paying taxes for an initial period of 5 years',
            'Complete exemption from all environmental safety laws permanently',
            'Free electricity and raw materials forever',
            'Monopoly rights to sell products in the domestic market without competition',
          ],
          correctOptionIndex: 0,
          valuePoints: ['Companies that set up units in SEZs do not have to pay taxes for an initial period of five years and have world-class infrastructure.'],
          modelAnswer: 'Exemption from paying taxes for an initial period of 5 years',
        },
      },
    ],
  }),

  // 67. Economics - Tertiary Sector Rising Importance (VSA 2m)
  q({
    bankKey: 'sst-087-eco-tertiary-importance-vsa-2',
    chapterSlug: 'sectors-of-indian-economy',
    unitId: 'economics',
    topicId: 'economic-sectors-primary-secondary-tertiary',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State any two reasons why the tertiary (service) sector has emerged as the largest producing sector in India.',
        answerKey: {
          valuePoints: [
            '(i) Basic services: Requirement of essential public services like hospitals, educational institutions, post/telegraph, police, banks, defense provided by government [1 mark].',
            '(ii) Agriculture & Industry expansion: Growth in agriculture and industry directly increases demand for transport, storage, trade, and financial services [1 mark].',
          ],
          modelAnswer:
            '1. Provision of Essential Services: Expansion of government-supported infrastructure (hospitals, schools, banking, defense, and administrative offices).\n2. Spin-off from Agrarian & Industrial Growth: Rising agricultural and manufacturing outputs inherently boost demand for transport, logistics, insurance, and marketing.',
        },
      },
    ],
  }),

  // 68. History - Civil Disobedience vs Non-Cooperation (Long Answer 5m)
  q({
    bankKey: 'sst-087-hist-civil-disobedience-vs-ncm-la-2',
    chapterSlug: 'nationalism-in-india',
    unitId: 'history',
    topicId: 'nationalism-india-civil-disobedience-collective-belonging',
    questionType: 'long-answer',
    marks: 5,
    difficulty: 'hard',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'How was the Civil Disobedience Movement of 1930 fundamentally different from the Non-Cooperation Movement of 1921? Explain with five distinct points.',
        answerKey: {
          valuePoints: [
            '(i) Core Objective: Non-Cooperation aimed at Swaraj through refusing cooperation with colonial rule; Civil Disobedience aimed at Purna Swaraj (Complete Independence) by actively breaking unjust colonial laws [1 mark].',
            '(ii) Law-breaking: In NCM, people refused cooperation but did not deliberately break laws; in CDM, salt laws, forest laws, and land revenue laws were openly violated [1 mark].',
            '(iii) Women’s Participation: Large-scale mass participation of women in CDM (manufacturing salt, picketing liquor/cloth shops) compared to limited participation in NCM [1 mark].',
            '(iv) Social Groups: Rich peasant communities (Patidars of Gujarat, Jats of UP) actively supported CDM for revenue reduction; industrialists led by GD Birla and Purshottamdas Thakurdas financed CDM [1 mark].',
            '(v) Muslim Participation: Muslim participation was significantly higher in NCM due to Khilafat alliance; in CDM, Muslim response was lukewarm due to communal suspicions and alienation after 1928 [1 mark].',
          ],
          modelAnswer:
            'Differences between Civil Disobedience Movement (1930) and Non-Cooperation Movement (1921):\n1. Scope & Objective: Non-Cooperation advocated passive non-cooperation for Swaraj, whereas Civil Disobedience demanded Complete Independence (Purna Swaraj) and active defiance of colonial decrees.\n2. Direct Violation of Laws: Non-Cooperation involved boycotting schools, courts, and foreign cloth. Civil Disobedience directly broke statutory colonial laws (Dandi Salt March, forest laws, refusal to pay chaukidari taxes).\n3. Mass Participation of Women: Women participated in record numbers during the Civil Disobedience Movement, picketing foreign shops and joining satyagrahas.\n4. Corporate & Industrial Support: Big business houses (FICCI, G.D. Birla) actively funded Civil Disobedience and refused to trade in British goods.\n5. Community Coalitions: The Non-Cooperation Movement was bonded with the Khilafat cause resulting in immense Hindu-Muslim unity, whereas Muslim participation in Civil Disobedience was comparatively subdued.',
        },
      },
    ],
  }),

  // 69. Geography - Water Scarcity in India (SA 3m)
  q({
    bankKey: 'sst-087-geo-water-scarcity-causes-sa-3',
    chapterSlug: 'water-resources',
    unitId: 'geography',
    topicId: 'water-scarcity-conservation',
    questionType: 'short-answer',
    marks: 3,
    difficulty: 'medium',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'Water scarcity is not only due to low rainfall but also due to over-exploitation and poor water management. Explain three causes of water scarcity in post-independent India.',
        answerKey: {
          valuePoints: [
            '(i) Growing population & agricultural over-extraction: Increasing food demand led to expansion of irrigated areas using private tube-wells, causing falling groundwater tables [1 mark].',
            '(ii) Intensive industrialisation & urbanisation: Heavy water consumption by industries, reliance on hydroelectric power, and urban housing societies over-pumping borewells [1 mark].',
            '(iii) Water pollution: Deterioration in water quality due to untreated domestic sewage, industrial toxic effluents, and agricultural chemical runoff (pesticides/fertilisers) making water hazardous for use [1 mark].',
          ],
          modelAnswer:
            'Causes of water scarcity in India:\n1. Agrarian Over-Extraction: Expansion of tubewell irrigation for water-intensive cash crops (paddy/sugarcane) has drastically lowered regional groundwater aquifers.\n2. Rapid Industrial & Urban Demand: Expanding industrial clusters and high-density apartment complexes consume enormous water volumes and rely on hydroelectric energy.\n3. Chemical & Sewage Pollution: Discharge of untreated urban sewage, toxic industrial effluents, and agro-chemical runoff render existing river and lake water unfit for human consumption.',
        },
      },
    ],
  }),

  // 70. Civics - Functions of Political Parties (VSA 2m)
  q({
    bankKey: 'sst-087-civ-party-functions-vsa-2',
    chapterSlug: 'political-parties',
    unitId: 'political-science',
    topicId: 'political-parties-functions-necessity',
    questionType: 'short-answer',
    marks: 2,
    difficulty: 'easy',
    sourceKind: 'board_style',
    variants: [
      {
        variantKey: 'a',
        params: {},
        statement: 'State any two essential functions performed by political parties in a democracy.',
        answerKey: {
          valuePoints: [
            '(i) Contest elections: Parties nominate candidates who contest elections across constituencies [1 mark].',
            '(ii) Form and run government: Parties that win majority recruit ministers, formulate national policies, and run the executive administration [1 mark].',
          ],
          modelAnswer:
            'Two essential functions of political parties:\n1. Contesting Elections: Parties select candidates and organise election campaigns to seek democratic mandates.\n2. Forming and Running Governments: Victorious parties formulate national legislation, appoint cabinet ministers, and execute public policies.',
        },
      },
    ],
  }),
];

