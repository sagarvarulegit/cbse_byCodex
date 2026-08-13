import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import type { Prisma, QuestionVerificationStatus } from '@prisma/client';

import { assertValidBankSeed } from '../lib/exam-papers/bank-schema.js';
import { MATHS_041_SEED } from '../lib/exam-papers/seed/maths-041-seed.js';

const prisma = new PrismaClient();

/**
 * Upserts the curated Maths 041 bank into the database. Rows start in `review`
 * so nothing enters generated papers until it is verified. Set
 * SEED_BANK_AS_VERIFIED=1 to mark seeded rows `verified` (local development).
 */
async function main(): Promise<void> {
  assertValidBankSeed(MATHS_041_SEED);

  const verificationStatus: QuestionVerificationStatus =
    process.env.SEED_BANK_AS_VERIFIED === '1' ? 'verified' : 'review';

  let created = 0;
  let updated = 0;

  for (const question of MATHS_041_SEED) {
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
          : 'Seeded from maths-041-seed; awaiting AI/manual review.',
      sourceKind: question.sourceKind,
      subjectSlug: question.subjectSlug,
      topicId: question.topicId,
      unitId: question.unitId,
      variantsJson: question.variants as unknown as Prisma.InputJsonValue,
      verificationStatus,
    };

    const existing = await prisma.questionBankQuestion.findUnique({
      where: {
        subjectSlug_bankKey: {
          bankKey: question.bankKey,
          subjectSlug: question.subjectSlug,
        },
      },
    });

    if (existing) {
      await prisma.questionBankQuestion.update({ where: { id: existing.id }, data });
      updated += 1;
    } else {
      await prisma.questionBankQuestion.create({ data });
      created += 1;
    }
  }

  console.log(
    `Seeded Maths 041 question bank: ${created} created, ${updated} updated ` +
      `(verificationStatus=${verificationStatus}).`,
  );
}

main()
  .catch((error) => {
    console.error('Failed to seed the question bank.', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
