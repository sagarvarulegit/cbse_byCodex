import type {
  BoardQuestionType,
  CurriculumScope,
  CurriculumSubject,
  CurriculumTopic,
} from '../../types';
import { CLASS_10_2026_27_SESSION } from '../../sessions/2026-27';
import {
  chapter,
  chapterPackTopic,
  examProfile,
  topic,
  unit,
} from './helpers';

const SOURCE_ID = 'cbse-science-086-2026-27';

function scienceTopic(
  chapterSlug: string,
  id: string,
  title: string,
  scope: CurriculumScope,
  questionTypes: BoardQuestionType[] = [],
): CurriculumTopic {
  return chapterPackTopic(chapterSlug, id, title, scope, questionTypes);
}

function scienceChapter(
  id: string,
  title: string,
  topics: CurriculumTopic[],
  scope: CurriculumScope = 'board-exam',
) {
  return chapter({
    id,
    title,
    platformChapterSlugs: [id],
    scope,
    topics,
  });
}

export const science: CurriculumSubject = {
  classLevel: 10,
  academicSession: CLASS_10_2026_27_SESSION,
  subjectCode: '086',
  slug: 'science',
  title: 'Science',
  assessmentMode: 'board',
  status: 'active',
  visibleInCatalog: true,
  activationBlockers: [],
  readinessBlockers: [
    'Current 2026-27 Science blueprint evidence has not been officially verified.',
  ],
  examProfile: examProfile(
    SOURCE_ID,
    [
      {
        id: 'chemical-substances',
        title: 'Chemical Substances - Nature and Behaviour',
        marks: 25,
        allowedQuestionTypes: [
          'mcq',
          'short-answer',
          'long-answer',
          'case-study',
          'numerical',
        ],
      },
      {
        id: 'world-of-living',
        title: 'World of Living',
        marks: 25,
        allowedQuestionTypes: [
          'mcq',
          'short-answer',
          'long-answer',
          'case-study',
          'diagram',
        ],
      },
      {
        id: 'natural-phenomena',
        title: 'Natural Phenomena',
        marks: 12,
        allowedQuestionTypes: ['mcq', 'short-answer', 'numerical', 'diagram'],
      },
      {
        id: 'effects-of-current',
        title: 'Effects of Current',
        marks: 13,
        allowedQuestionTypes: [
          'mcq',
          'short-answer',
          'long-answer',
          'numerical',
          'diagram',
        ],
      },
      {
        id: 'natural-resources',
        title: 'Natural Resources',
        marks: 5,
        allowedQuestionTypes: ['mcq', 'short-answer', 'case-study'],
      },
    ],
    {
      status: 'blocked',
      blockers: [
        'The current curriculum PDF embeds a question-paper design labelled 2025-26.',
      ],
    },
  ),
  books: [
    {
      id: 'ncert-science-class-10',
      title: 'Science Textbook for Class X',
      publisher: 'NCERT',
      role: 'primary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'cbse-assessment-of-practical-skills-science-class-10',
      title: 'Assessment of Practical Skills in Science - Class X',
      publisher: 'CBSE',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-laboratory-manual-science-class-10',
      title: 'Laboratory Manual - Science - Class X',
      publisher: 'NCERT',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'ncert-science-exemplar-class-10',
      title: 'Exemplar Problems - Science - Class X',
      publisher: 'NCERT',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
    {
      id: 'cbse-reading-material-science-class-10-2026-27',
      title: 'Reading Material - Science - Class X (2026-27)',
      publisher: 'CBSE',
      role: 'supplementary',
      sourceId: SOURCE_ID,
    },
  ],
  units: [
    unit('chemical-substances', 'Chemical Substances - Nature and Behaviour', 25, [
      scienceChapter(
        'chemical-reactions-and-equations',
        'Chemical Reactions and Equations',
        [
          scienceTopic(
            'chemical-reactions-and-equations',
            'chemical-reactions',
            'Chemical reactions and chemical equations',
            'board-exam',
            ['mcq', 'short-answer'],
          ),
          scienceTopic(
            'chemical-reactions-and-equations',
            'balanced-chemical-equations',
            'Balanced chemical equations',
            'board-exam',
            ['short-answer', 'numerical'],
          ),
          scienceTopic(
            'chemical-reactions-and-equations',
            'types-of-chemical-reactions',
            'Combination, decomposition, displacement, double displacement and precipitation reactions',
            'board-exam',
            ['mcq', 'short-answer', 'long-answer'],
          ),
          scienceTopic(
            'chemical-reactions-and-equations',
            'endothermic-and-exothermic-reactions',
            'Endothermic and exothermic reactions',
            'board-exam',
            ['mcq', 'short-answer'],
          ),
          scienceTopic(
            'chemical-reactions-and-equations',
            'oxidation-and-reduction',
            'Oxidation and reduction',
            'board-exam',
            ['mcq', 'short-answer', 'long-answer'],
          ),
        ],
      ),
      chapter({
        id: 'periodic-classification-of-elements',
        title: 'Periodic Classification of Elements',
        scope: 'internal-only',
        topics: [
          topic(
            'periodic-classification-of-elements',
            'Döbereiner, Newlands, Mendeléev and the Modern Periodic Table',
            'internal-only',
            [],
          ),
        ],
      }),
      scienceChapter('acids-bases-and-salts', 'Acids, Bases and Salts', [
        scienceTopic(
          'acids-bases-and-salts',
          'acids-bases-ions-indicators',
          'Acids and bases in terms of H+ and OH- ions and indicators',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'acids-bases-and-salts',
          'acids-bases-chemical-properties-neutralisation',
          'Chemical properties and neutralisation',
          'board-exam',
          ['short-answer', 'long-answer'],
        ),
        scienceTopic(
          'acids-bases-and-salts',
          'ph-scale-everyday-life',
          'pH scale and its importance in everyday life',
          'board-exam',
          ['mcq', 'short-answer', 'case-study'],
        ),
        scienceTopic(
          'acids-bases-and-salts',
          'common-salts-preparation-uses',
          'Preparation and uses of sodium hydroxide, bleaching powder, baking soda, washing soda and plaster of Paris',
          'board-exam',
          ['short-answer', 'long-answer'],
        ),
      ]),
      scienceChapter('metals-and-non-metals', 'Metals and Non-metals', [
        scienceTopic(
          'metals-and-non-metals',
          'properties-of-metals-and-non-metals',
          'Properties of metals and non-metals',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'metals-and-non-metals',
          'reactivity-series',
          'Reactivity series',
          'board-exam',
          ['mcq', 'short-answer', 'long-answer'],
        ),
        scienceTopic(
          'metals-and-non-metals',
          'ionic-compounds',
          'Formation and properties of ionic compounds',
          'board-exam',
          ['short-answer', 'long-answer'],
        ),
        scienceTopic(
          'metals-and-non-metals',
          'basic-metallurgical-processes',
          'Basic metallurgical processes',
          'board-exam',
          ['short-answer', 'long-answer'],
        ),
        scienceTopic(
          'metals-and-non-metals',
          'corrosion-and-prevention',
          'Corrosion and its prevention',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
      ]),
      scienceChapter('carbon-and-its-compounds', 'Carbon and its Compounds', [
        scienceTopic(
          'carbon-and-its-compounds',
          'covalent-bonds',
          'Formation and properties of covalent compounds',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'carbon-and-its-compounds',
          'versatile-nature-of-carbon',
          'Versatile nature of carbon',
          'board-exam',
          ['short-answer'],
        ),
        scienceTopic(
          'carbon-and-its-compounds',
          'hydrocarbons-homologous-series-nomenclature',
          'Hydrocarbons, homologous series and nomenclature',
          'board-exam',
          ['mcq', 'short-answer', 'long-answer'],
        ),
        scienceTopic(
          'carbon-and-its-compounds',
          'functional-groups',
          'Halogen, alcohol, ketone and aldehyde functional groups',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'carbon-and-its-compounds',
          'chemical-properties-carbon-compounds',
          'Combustion, oxidation, addition and substitution reactions',
          'board-exam',
          ['short-answer', 'long-answer'],
        ),
        scienceTopic(
          'carbon-and-its-compounds',
          'ethanol-ethanoic-acid-soaps-detergents',
          'Ethanol, ethanoic acid, soaps and detergents',
          'board-exam',
          ['mcq', 'short-answer', 'case-study'],
        ),
      ]),
    ]),
    unit('world-of-living', 'World of Living', 25, [
      scienceChapter('life-processes', 'Life Processes', [
        scienceTopic(
          'life-processes',
          'life-processes-nutrition',
          'Nutrition in plants and animals',
          'board-exam',
          ['mcq', 'short-answer', 'diagram'],
        ),
        scienceTopic(
          'life-processes',
          'life-processes-respiration',
          'Respiration in plants and animals',
          'board-exam',
          ['short-answer', 'long-answer', 'diagram'],
        ),
        scienceTopic(
          'life-processes',
          'life-processes-transport',
          'Transport in plants and animals',
          'board-exam',
          ['short-answer', 'long-answer', 'diagram'],
        ),
        scienceTopic(
          'life-processes',
          'life-processes-excretion',
          'Excretion in plants and animals',
          'board-exam',
          ['short-answer', 'long-answer', 'diagram'],
        ),
      ]),
      scienceChapter('control-and-coordination', 'Control and Coordination', [
        scienceTopic(
          'control-and-coordination',
          'plant-tropic-movements-hormones',
          'Tropic movements and plant hormones',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'control-and-coordination',
          'animal-nervous-system',
          'Animal nervous system',
          'board-exam',
          ['short-answer', 'diagram'],
        ),
        scienceTopic(
          'control-and-coordination',
          'voluntary-involuntary-reflex-actions',
          'Voluntary, involuntary and reflex actions',
          'board-exam',
          ['mcq', 'short-answer', 'diagram'],
        ),
        scienceTopic(
          'control-and-coordination',
          'animal-hormones',
          'Chemical coordination through animal hormones',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
      ]),
      scienceChapter(
        'how-do-organisms-reproduce',
        'How do Organisms Reproduce?',
        [
          scienceTopic(
            'how-do-organisms-reproduce',
            'asexual-reproduction',
            'Asexual reproduction in plants and animals',
            'board-exam',
            ['mcq', 'short-answer', 'diagram'],
          ),
          scienceTopic(
            'how-do-organisms-reproduce',
            'sexual-reproduction',
            'Sexual reproduction in plants and animals',
            'board-exam',
            ['short-answer', 'long-answer', 'diagram'],
          ),
          scienceTopic(
            'how-do-organisms-reproduce',
            'reproductive-health-family-planning',
            'Reproductive health and family planning',
            'board-exam',
            ['mcq', 'short-answer', 'case-study'],
          ),
          scienceTopic(
            'how-do-organisms-reproduce',
            'safe-sex-hiv-aids-womens-health',
            'Safe sex, HIV/AIDS, child bearing and women’s health',
            'board-exam',
            ['short-answer', 'case-study'],
          ),
        ],
      ),
      scienceChapter(
        'heredity',
        'Heredity',
        [
          scienceTopic(
            'heredity',
            'heredity',
            'Heredity, Mendel’s laws and sex determination',
            'internal-only',
          ),
          scienceTopic(
            'heredity',
            'evolution',
            'Evolution, speciation, fossils and evolutionary relationships',
            'internal-only',
          ),
        ],
        'internal-only',
      ),
    ]),
    unit('natural-phenomena', 'Natural Phenomena', 12, [
      scienceChapter(
        'light-reflection-and-refraction',
        'Light - Reflection and Refraction',
        [
          scienceTopic(
            'light-reflection-and-refraction',
            'reflection-curved-surfaces',
            'Reflection by curved surfaces and spherical mirror images',
            'board-exam',
            ['mcq', 'short-answer', 'diagram'],
          ),
          scienceTopic(
            'light-reflection-and-refraction',
            'mirror-formula-magnification',
            'Mirror formula and magnification',
            'board-exam',
            ['short-answer', 'numerical', 'diagram'],
          ),
          scienceTopic(
            'light-reflection-and-refraction',
            'laws-of-refraction-refractive-index',
            'Laws of refraction and refractive index',
            'board-exam',
            ['mcq', 'short-answer'],
          ),
          scienceTopic(
            'light-reflection-and-refraction',
            'spherical-lenses-formula-power',
            'Spherical lenses, lens formula, magnification and power',
            'board-exam',
            ['short-answer', 'numerical', 'diagram'],
          ),
        ],
      ),
      scienceChapter(
        'the-human-eye-and-the-colourful-world',
        'The Human Eye and the Colourful World',
        [
          scienceTopic(
            'the-human-eye-and-the-colourful-world',
            'human-eye-defects-corrections',
            'Functioning of the human eye, defects of vision and corrections',
            'board-exam',
            ['mcq', 'short-answer', 'diagram'],
          ),
          scienceTopic(
            'the-human-eye-and-the-colourful-world',
            'prism-dispersion-scattering',
            'Prism, dispersion and scattering of light',
            'board-exam',
            ['short-answer', 'diagram'],
          ),
          scienceTopic(
            'the-human-eye-and-the-colourful-world',
            'applications-of-light-daily-life',
            'Applications of mirrors, lenses and scattering in daily life',
            'board-exam',
            ['short-answer'],
          ),
          scienceTopic(
            'the-human-eye-and-the-colourful-world',
            'colour-of-sun-sunrise-sunset',
            'Colour of the sun at sunrise and sunset',
            'excluded',
          ),
        ],
      ),
    ]),
    unit('effects-of-current', 'Effects of Current', 13, [
      scienceChapter('electricity', 'Electricity', [
        scienceTopic(
          'electricity',
          'electric-current-potential-difference',
          'Electric current and potential difference',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'electricity',
          'ohms-law-resistance-resistivity',
          'Ohm’s law, resistance and resistivity',
          'board-exam',
          ['short-answer', 'numerical'],
        ),
        scienceTopic(
          'electricity',
          'series-parallel-resistors',
          'Series and parallel combinations of resistors',
          'board-exam',
          ['short-answer', 'long-answer', 'numerical'],
        ),
        scienceTopic(
          'electricity',
          'heating-effect-electric-current',
          'Heating effect of electric current and applications',
          'board-exam',
          ['short-answer', 'numerical'],
        ),
        scienceTopic(
          'electricity',
          'electric-power',
          'Electric power and relationships between P, V, I and R',
          'board-exam',
          ['short-answer', 'long-answer', 'numerical'],
        ),
      ]),
      scienceChapter(
        'magnetic-effects-of-electric-current',
        'Magnetic Effects of Electric Current',
        [
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'magnetic-field-and-field-lines',
            'Magnetic field and field lines',
            'board-exam',
            ['mcq', 'short-answer', 'diagram'],
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'magnetic-field-current-conductor-coil-solenoid',
            'Fields due to current-carrying conductor, coil and solenoid',
            'board-exam',
            ['short-answer', 'diagram'],
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'force-on-current-carrying-conductor',
            'Force on a current-carrying conductor and Fleming’s Left Hand Rule',
            'board-exam',
            ['short-answer', 'diagram'],
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'direct-alternating-current',
            'Direct current, alternating current and frequency',
            'board-exam',
            ['mcq', 'short-answer'],
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'advantages-ac-over-dc',
            'Advantage of AC over DC',
            'board-exam',
            ['short-answer'],
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'domestic-electric-circuits',
            'Domestic electric circuits',
            'board-exam',
            ['short-answer', 'long-answer', 'diagram'],
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'electric-motor',
            'Electric motor',
            'internal-only',
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'electromagnetic-induction',
            'Electromagnetic induction',
            'internal-only',
          ),
          scienceTopic(
            'magnetic-effects-of-electric-current',
            'electric-generator',
            'Electric generator',
            'internal-only',
          ),
        ],
      ),
    ]),
    unit('natural-resources', 'Natural Resources', 5, [
      scienceChapter('our-environment', 'Our Environment', [
        scienceTopic(
          'our-environment',
          'ecosystem',
          'Ecosystem',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'our-environment',
          'environmental-problems-solutions',
          'Environmental problems and their solutions',
          'board-exam',
          ['short-answer', 'case-study'],
        ),
        scienceTopic(
          'our-environment',
          'ozone-depletion',
          'Ozone depletion',
          'board-exam',
          ['mcq', 'short-answer'],
        ),
        scienceTopic(
          'our-environment',
          'waste-production-biodegradability',
          'Waste production and biodegradable/non-biodegradable substances',
          'board-exam',
          ['short-answer', 'case-study'],
        ),
      ]),
    ]),
  ],
  officialSourceIds: [SOURCE_ID],
};
