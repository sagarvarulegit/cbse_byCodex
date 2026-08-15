import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import {
  getGeminiConfig,
  verifyBankQuestion,
  type BankQuestionVerificationOutcome,
} from '../lib/exam-papers/verify.js';
import type { BankQuestion } from '../lib/exam-papers/types.js';

const prisma = new PrismaClient();

type Row = {
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

function toBankQuestion(row: Row): BankQuestion {
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

function summarize(outcome: BankQuestionVerificationOutcome): string {
  switch (outcome.status) {
    case 'verified':
      return 'PASS';
    case 'review':
      return 'REVIEW';
    default:
      return 'UNVERIFIED';
  }
}

/**
 * Runs Gemini verification over every question bank row that is not yet
 * `verified`. Flags anything that is not a clean pass for human review.
 *
 * Usage:
 *   npm run verify:bank -w apps/api
 *   SUBJECT_SLUG=mathematics-standard npm run verify:bank -w apps/api
 *   LIMIT=20 npm run verify:bank -w apps/api   # first N unverified rows
 *
 * Without GEMINI_API_KEY every row is left as `review` (manual path) and the
 * script reports that — it never fabricates a verification result.
 */
async function main(): Promise<void> {
  const subjectSlug = process.env.SUBJECT_SLUG ?? undefined;
  const limitRaw = Number(process.env.LIMIT);
  const limit = Number.isInteger(limitRaw) && limitRaw > 0 ? limitRaw : undefined;

  const where = {
    verificationStatus: { not: 'verified' as const },
    ...(subjectSlug ? { subjectSlug } : {}),
  };

  const rows = (await prisma.questionBankQuestion.findMany({
    where,
    orderBy: [{ createdAt: 'asc' }],
    take: limit,
  })) as unknown as Row[];

  if (rows.length === 0) {
    console.log('No unverified questions found. The bank is fully verified.');
    return;
  }

  const config = getGeminiConfig();
  if (!config.apiKey) {
    console.warn(
      'GEMINI_API_KEY is not configured — automated verification is unavailable. ' +
        'Rows will be left in `review` for the manual verification path.',
    );
  }

  console.log(
    `Verifying ${rows.length} question(s) with ${config.model}…`,
  );

  let verified = 0;
  let review = 0;
  let failed = 0;

  for (const row of rows) {
    const question = toBankQuestion(row);
    const outcome = await verifyBankQuestion(question);
    const notes = [
      outcome.note,
      ...(outcome.reasons.length > 0
        ? [`Reasons: ${outcome.reasons.join('; ')}`]
        : []),
    ].join(' ');

    await prisma.questionBankQuestion.update({
      where: { id: row.id },
      data: {
        verificationStatus: outcome.status,
        reviewNotes: notes,
        ...(outcome.status === 'verified' ? { verifiedAt: new Date() } : {}),
      },
    });

    const status = summarize(outcome);
    if (outcome.status === 'verified') verified += 1;
    else if (outcome.status === 'review') review += 1;
    else failed += 1;

    console.log(`[${status}] ${row.bankKey}`);
    if (outcome.verdict !== 'pass') {
      console.log(`          ${notes}`);
    }
  }

  console.log(
    `\nDone: ${verified} verified, ${review} review, ${failed} unverified ` +
      `(${rows.length} total processed).`,
  );
}

main()
  .catch((error) => {
    console.error('Bank verification failed.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
