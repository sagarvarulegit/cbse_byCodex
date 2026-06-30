import type { CurriculumSubject } from '../../types';
import { artificialIntelligence } from './artificial-intelligence';
import { englishLanguageAndLiterature } from './english-language-and-literature';
import { healthAndPhysicalEducation } from './health-and-physical-education';
import { hindiCourseB } from './hindi-course-b';
import { informationTechnology } from './information-technology';
import { mathematicsBasic } from './mathematics-basic';
import { mathematicsStandard } from './mathematics-standard';
import { science } from './science';
import { socialScience } from './social-science';

export const CLASS_10_CURRICULUM_SUBJECTS: CurriculumSubject[] = [
  mathematicsStandard,
  mathematicsBasic,
  science,
  socialScience,
  englishLanguageAndLiterature,
  hindiCourseB,
  healthAndPhysicalEducation,
  informationTechnology,
  artificialIntelligence,
];
