import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import {
  getGeminiConfig,
  verifyPaper,
  type PaperVerificationOutcome,
} from '../lib/exam-papers/verify.js';
import type { GeneratedPaper } from '../lib/exam-papers/types.js';

const prisma = new PrismaClient();

function summarize(outcome: PaperVerificationOutcome): string {
  switch (outcome.status) {
    case 'verified':
      return 'VERIFIED';
    case 'review':
      return 'REVIEW';
    default:
      return 'UNVERIFIED';
  }
}

/**
 * Re-verifies exam papers that are not yet `verified` (e.g. papers published
 * while the Gemini key was unavailable). Reconstructs the GeneratedPaper shape
 * from the stored rows so verifyPaper can run unchanged.
 *
 * Usage:
 *   npm run verify:papers -w apps/api
 *   PAPER_ID=<id> npm run verify:papers -w apps/api   # one paper
 */
async function main(): Promise<void> {
  const config = getGeminiConfig();
  if (!config.apiKey) {
    console.warn(
      'GEMINI_API_KEY is not configured — papers will stay in `review` for the manual path.',
    );
  }

  const where = {
    verificationStatus: { not: 'verified' as const },
    ...(process.env.PAPER_ID ? { id: process.env.PAPER_ID } : {}),
  };

  const rows = await prisma.examPaper.findMany({
    where,
    orderBy: { createdAt: 'asc' },
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
    take: 50,
  });

  if (rows.length === 0) {
    console.log('No unverified papers found. Everything is verified.');
    return;
  }

  console.log(`Verifying ${rows.length} paper(s) with ${config.model}…`);

  let verified = 0;
  let review = 0;

  for (const row of rows) {
    const paper: GeneratedPaper = {
      subjectSlug: row.subjectSlug,
      title: row.title,
      seed: row.seed,
      layoutVersion: row.layoutVersion,
      totalMarks: row.totalMarks,
      durationMinutes: row.durationMinutes,
      readingTimeMinutes: row.readingTimeMinutes,
      sections: (row.sectionsJson as GeneratedPaper['sections']) ?? [],
      questions: row.questions.map((question) => ({
        questionNumber: question.questionNumber,
        sectionId: question.sectionId,
        questionType: question.questionType,
        marks: question.marks,
        statement: question.statementJson as string,
        answerKey: question.answerKeyJson as GeneratedPaper['questions'][number]['answerKey'],
        bankKey: question.questionBankId ?? '',
        chapterSlug: '',
        topicId: '',
        sourceKind: question.sourceKind as GeneratedPaper['questions'][number]['sourceKind'],
        provenance: question.provenanceJson as GeneratedPaper['questions'][number]['provenance'],
        variantKey: '',
      })),
      compliance: {
        unitMarks: [],
        coveredTopicIds: [],
        uncoveredBoardTopicIds: [],
        excludedTopicViolations: [],
        questionBankKeys: [],
      },
    };

    const outcome = await verifyPaper(paper);
    const status = summarize(outcome);
    if (outcome.status === 'verified') verified += 1;
    else review += 1;

    await prisma.examPaper.update({
      where: { id: row.id },
      data: {
        verificationStatus: outcome.status,
        verificationJson: outcome.result ?? undefined,
      },
    });

    console.log(`[${status}] seed=${row.seed} title="${row.title}"`);
    if (outcome.note !== 'Verification passed.') {
      console.log(`          ${outcome.note}`);
    }
  }

  console.log(`\nDone: ${verified} verified, ${review} review (${rows.length} total).`);
}

main()
  .catch((error) => {
    console.error('Paper verification failed.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
