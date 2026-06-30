export type AssessmentMode = 'board' | 'internal' | 'optional-skill';

export type CurriculumStatus = 'active' | 'future' | 'retired';

export type CurriculumScope =
  | 'board-exam'
  | 'internal-only'
  | 'project-only'
  | 'periodic-only'
  | 'supporting-resource'
  | 'excluded';

export type OfficialSourceType =
  | 'curriculum'
  | 'sample-paper'
  | 'marking-scheme'
  | 'question-paper'
  | 'prescribed-book'
  | 'map-list'
  | 'circular';

export type OfficialSourceRole =
  | 'current-curriculum'
  | 'current-curriculum-and-blueprint'
  | 'future-curriculum'
  | 'historical-comparison';

export type BoardQuestionType =
  | 'mcq'
  | 'assertion-reason'
  | 'very-short-answer'
  | 'short-answer'
  | 'long-answer'
  | 'case-study'
  | 'source-based'
  | 'extract-based'
  | 'numerical'
  | 'proof'
  | 'construction'
  | 'diagram'
  | 'map-skill'
  | 'picture-interpretation'
  | 'data-interpretation'
  | 'grammar'
  | 'creative-writing';

export type OfficialSource = {
  id: string;
  sourceType: OfficialSourceType;
  role: OfficialSourceRole;
  title: string;
  academicSession: string;
  subjectCodes: string[];
  url: string;
  publishedBy: 'CBSE' | 'NCERT';
  verifiedOn: string;
  mayDriveCurrentCurriculum: boolean;
  mayDriveCurrentBlueprint: boolean;
  notes?: string;
};

export type ExamSectionRule = {
  id: string;
  title: string;
  marks: number;
  allowedQuestionTypes: BoardQuestionType[];
  curriculumRefs?: string[];
  subsectionRules?: ExamSectionRule[];
};

export type ExamProfile = {
  maximumMarks: number;
  durationMinutes: number;
  readingTimeMinutes: number;
  sectionRules: ExamSectionRule[];
  allowedMarkValues: number[];
  blueprintStatus: 'ready' | 'blocked';
  blueprintBlockers: string[];
  blueprintSourceIds: string[];
};

export type PlatformContentRef =
  | {
      kind: 'chapter-pack';
      chapterSlug: string;
    }
  | {
      kind: 'lesson';
      chapterSlug: string;
      lessonSlug: string;
    };

export type CurriculumTopic = {
  id: string;
  title: string;
  scope: CurriculumScope;
  platformContentRefs: PlatformContentRef[];
  requiredQuestionTypes: BoardQuestionType[];
  minimumReviewedQuestionCount: number;
};

export type CurriculumChapter = {
  id: string;
  title: string;
  scope: CurriculumScope;
  platformChapterSlugs: string[];
  topics: CurriculumTopic[];
  requiredSkills?: string[];
  requiredAssets?: string[];
};

export type CurriculumUnit = {
  id: string;
  title: string;
  marks?: number;
  chapters: CurriculumChapter[];
};

export type PrescribedBook = {
  id: string;
  title: string;
  publisher: 'NCERT' | 'CBSE';
  role: 'primary' | 'supplementary' | 'workbook';
  sourceId: string;
};

export type CurriculumSubject = {
  classLevel: 10;
  academicSession: string;
  subjectCode: string;
  slug: string;
  title: string;
  assessmentMode: AssessmentMode;
  status: CurriculumStatus;
  visibleInCatalog?: boolean;
  examProfile: ExamProfile | null;
  books: PrescribedBook[];
  units: CurriculumUnit[];
  officialSourceIds: string[];
  activationBlockers: string[];
  readinessBlockers: string[];
};
