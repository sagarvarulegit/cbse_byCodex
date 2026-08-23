import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import type { Prisma } from '@prisma/client';

import { assemblePaper } from '../lib/exam-papers/assembler.js';
import { getMockTestSeriesForSubject, indexSeriesPapers } from '../lib/exam-papers/series.js';
import type { BankQuestion } from '../lib/exam-papers/types.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

type BankRow = {
  id: string;
  bankKey: string;
  subjectSlug: string;
  chapterSlug: string;
  unitId: string;
  topicId: string;
  questionType: string;
  marks: number;
  difficulty: string;
  sourceKind: string;
  provenanceJson: unknown;
  variantsJson: unknown;
  verificationStatus: string;
};

function toBankQuestion(row: BankRow): BankQuestion {
  return {
    bankKey: row.bankKey,
    subjectSlug: row.subjectSlug,
    chapterSlug: row.chapterSlug,
    unitId: row.unitId,
    topicId: row.topicId,
    questionType: row.questionType,
    marks: row.marks,
    difficulty: row.difficulty as BankQuestion['difficulty'],
    sourceKind: row.sourceKind as BankQuestion['sourceKind'],
    provenance: (row.provenanceJson as BankQuestion['provenance'] | null) ?? null,
    variants: row.variantsJson as BankQuestion['variants'],
    verificationStatus: row.verificationStatus as BankQuestion['verificationStatus'],
  };
}

async function publishSeriesForSubject(subjectSlug: string): Promise<void> {
  const series = getMockTestSeriesForSubject(subjectSlug);
  console.log(`\nPublishing mock test series for ${series.title} (${series.subjectSlug})…`);

  const existing = await prisma.examPaper.findMany({
    where: {
      subjectSlug: series.subjectSlug,
      userId: null,
      publishStatus: 'published',
    },
  });
  const bySeed = indexSeriesPapers(existing);

  const bankRows = (await prisma.questionBankQuestion.findMany({
    where: { subjectSlug: series.subjectSlug, verificationStatus: 'verified' },
  })) as unknown as BankRow[];

  if (bankRows.length === 0) {
    console.error(`  No verified bank questions found for ${series.subjectSlug}. Skipping.`);
    return;
  }

  const bank = bankRows.map(toBankQuestion);
  const bankKeyToId = new Map(bankRows.map((row) => [row.bankKey, row.id]));

  for (const definition of series.papers) {
    const already = bySeed.get(definition.seed);
    if (already) {
      console.log(`  Paper ${definition.number} (seed ${definition.seed}) already published: id=${already.id}`);
      continue;
    }

    const paper = assemblePaper({
      subjectSlug: series.subjectSlug,
      seed: definition.seed,
      questions: bank,
    });

    const created = await prisma.examPaper.create({
      data: {
        userId: null,
        subjectSlug: series.subjectSlug,
        title: `${series.title} — ${definition.title}`,
        totalMarks: paper.totalMarks,
        durationMinutes: paper.durationMinutes,
        readingTimeMinutes: paper.readingTimeMinutes,
        seed: definition.seed,
        layoutVersion: paper.layoutVersion,
        sectionsJson: paper.sections,
        verificationStatus: 'verified',
        publishStatus: 'published',
      },
    });

    await prisma.examPaperQuestion.createMany({
      data: paper.questions.map((question) => ({
        examPaperId: created.id,
        questionBankId: bankKeyToId.get(question.bankKey) ?? null,
        sectionId: question.sectionId,
        questionNumber: question.questionNumber,
        questionType: question.questionType,
        marks: question.marks,
        statementJson: question.statement as unknown as Prisma.InputJsonValue,
        answerKeyJson: question.answerKey as unknown as Prisma.InputJsonValue,
        sourceKind: question.sourceKind,
        provenanceJson:
          (question.provenance ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
        verificationStatus: 'verified',
        sortOrder: question.questionNumber,
      })),
    });

    console.log(`  Created & published Paper ${definition.number} (seed ${definition.seed}): id=${created.id}`);
  }
}

async function main(): Promise<void> {
  await publishSeriesForSubject('mathematics-standard');
  await publishSeriesForSubject('mathematics-basic');
  await publishSeriesForSubject('science');
  await publishSeriesForSubject('social-science');
  await publishSeriesForSubject('english-language-and-literature');
  console.log('\nMock test series publishing complete.');
}

main()
  .catch((error) => {
    console.error('Failed to publish mock series.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
