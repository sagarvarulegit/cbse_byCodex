import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import type { Prisma, QuestionVerificationStatus } from '@prisma/client';

import { assertValidBankSeed } from '../lib/exam-papers/bank-schema.js';
import { MATHS_041_SEED } from '../lib/exam-papers/seed/maths-041-seed.js';
import { MATHS_241_SEED } from '../lib/exam-papers/seed/maths-241-seed.js';
import { SCIENCE_086_SEED } from '../lib/exam-papers/seed/science-086-seed.js';
import { SOCIAL_SCIENCE_087_SEED } from '../lib/exam-papers/seed/social-science-087-seed.js';
import { ENGLISH_184_SEED } from '../lib/exam-papers/seed/english-184-seed.js';
import { HINDI_002_SEED } from '../lib/exam-papers/seed/hindi-002-seed.js';
import { HINDI_085_SEED } from '../lib/exam-papers/seed/hindi-085-seed.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL,
    },
  },
});

/**
 * Upserts the curated Maths 041, Maths 241, Science 086, Social Science 087, English 184, Hindi 002, and Hindi 085 banks into the database.
 * Rows start in `review` so nothing enters generated papers until it is
 * verified. Set SEED_BANK_AS_VERIFIED=1 to mark seeded rows `verified`
 * (local development).
 */
async function main(): Promise<void> {
  const allQuestions = [
    ...MATHS_041_SEED,
    ...MATHS_241_SEED,
    ...SCIENCE_086_SEED,
    ...SOCIAL_SCIENCE_087_SEED,
    ...ENGLISH_184_SEED,
    ...HINDI_002_SEED,
    ...HINDI_085_SEED,
  ];
  assertValidBankSeed(allQuestions);

  const verificationStatus: QuestionVerificationStatus =
    process.env.SEED_BANK_AS_VERIFIED === '1' ? 'verified' : 'review';

  console.log(`Seeding ${allQuestions.length} questions (verificationStatus=${verificationStatus})…`);

  const CHUNK_SIZE = 10;
  for (let i = 0; i < allQuestions.length; i += CHUNK_SIZE) {
    const chunk = allQuestions.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map(async (question) => {
        const data = {
          bankKey: question.bankKey,
          chapterSlug: question.chapterSlug,
          difficulty: question.difficulty,
          marks: question.marks,
          provenanceJson:
            (question.provenance ?? undefined) as unknown as Prisma.InputJsonValue | undefined,
          questionType: question.questionType,
          reviewNotes:
            verificationStatus === 'verified'
              ? null
              : `Seeded from ${question.subjectSlug}-seed; awaiting AI/manual review.`,
          sourceKind: question.sourceKind,
          subjectSlug: question.subjectSlug,
          topicId: question.topicId,
          unitId: question.unitId,
          variantsJson: question.variants as unknown as Prisma.InputJsonValue,
          verificationStatus,
        };

        await prisma.questionBankQuestion.upsert({
          where: {
            subjectSlug_bankKey: {
              bankKey: question.bankKey,
              subjectSlug: question.subjectSlug,
            },
          },
          create: data,
          update: data,
        });
      }),
    );
    console.log(`  Upserted ${Math.min(i + CHUNK_SIZE, allQuestions.length)} / ${allQuestions.length}`);
  }

  console.log(
    `Seeded question bank: ${allQuestions.length} questions upserted ` +
      `(verificationStatus=${verificationStatus}).`,
  );
}

main()
  .catch((error) => {
    console.error('Failed to seed the question bank.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
