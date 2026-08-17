import { randomInt } from 'node:crypto';

import { Prisma, UserRole } from '@prisma/client';
import type {
  QuestionBankQuestion as QuestionBankQuestionRow,
  QuestionVerificationStatus,
} from '@prisma/client';
import type { Request } from 'express';
import { Router } from 'express';

import { assemblePaper } from '../lib/exam-papers/assembler.js';
import { getBlueprint } from '../lib/exam-papers/blueprint.js';
import {
  getMockTestSeriesForSubject,
  indexSeriesPapers,
  isSeriesPaper,
  seriesPaperView,
} from '../lib/exam-papers/series.js';
import {
  computeWeakAreas,
  matchesExamPaperAttempt,
  normalizeExamPaperAttempt,
  type ExamPaperQuestionResult,
} from '../lib/exam-paper-attempt.js';
import type {
  BankQuestion,
  GeneratedPaper,
  PaperQuestion,
} from '../lib/exam-papers/types.js';
import { verifyBankQuestion, verifyPaper } from '../lib/exam-papers/verify.js';
import { prisma } from '../lib/prisma.js';
import { getSessionUser, requireSessionUser } from '../lib/session.js';

export const examPapersRouter = Router();
export const adminExamPapersRouter = Router();

function randomSeed(): number {
  return randomInt(1, 2_147_483_647);
}

function toBankQuestion(row: QuestionBankQuestionRow): BankQuestion {
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

async function requireAdminUser(req: Request) {
  const user = await getSessionUser(req);
  if (!user || user.role !== UserRole.admin) {
    return null;
  }
  return user;
}

function serializePaper(
  paper: Awaited<ReturnType<typeof prisma.examPaper.findUnique>>,
  questions: unknown[],
) {
  if (!paper) {
    return null;
  }
  return {
    id: paper.id,
    title: paper.title,
    subjectSlug: paper.subjectSlug,
    seed: paper.seed,
    totalMarks: paper.totalMarks,
    durationMinutes: paper.durationMinutes,
    readingTimeMinutes: paper.readingTimeMinutes,
    layoutVersion: paper.layoutVersion,
    sections: paper.sectionsJson,
    verificationStatus: paper.verificationStatus,
    verification: paper.verificationJson,
    publishStatus: paper.publishStatus,
    createdAt: paper.createdAt,
    questions,
  };
}

// ── Student endpoints ────────────────────────────────────────────────────────

/** POST /v1/exam-papers/generate  { subjectSlug?, seed?, verify? } */
examPapersRouter.post('/generate', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to generate a sample test paper.' });
  }

  const subjectSlug =
    typeof req.body?.subjectSlug === 'string'
      ? req.body.subjectSlug
      : 'mathematics-standard';

  const blueprint = getBlueprint(subjectSlug);
  if (!blueprint) {
    return res.status(422).json({
      message: `Paper generation does not support subject "${subjectSlug}".`,
    });
  }
  if (blueprint.blueprintStatus !== 'ready') {
    return res.status(422).json({
      message: `The ${blueprint.title} blueprint is not ready for paper generation.`,
    });
  }

  const rawSeed = req.body?.seed;
  const seed =
    Number.isInteger(rawSeed) && Number(rawSeed) > 0 ? Number(rawSeed) : randomSeed();

  const rows = await prisma.questionBankQuestion.findMany({
    where: { subjectSlug, verificationStatus: 'verified' },
  });
  const bankKeyToId = new Map(rows.map((row) => [row.bankKey, row.id]));

  let paper: GeneratedPaper;
  try {
    paper = assemblePaper({
      subjectSlug,
      seed,
      questions: rows.map(toBankQuestion),
    });
  } catch (error) {
    return res.status(422).json({
      message:
        error instanceof Error
          ? error.message
          : 'Unable to assemble a paper from the current question bank.',
    });
  }

  // AI verification is advisory: without a key or on failure the paper is
  // Paper-level AI verification is opt-in because the question bank is already individually verified.
  // Pass {"verify": true} for an explicit, slower Gemini review; normal student generation stays fast.
  const runVerification = req.body?.verify === true;
  const outcome = runVerification ? await verifyPaper(paper) : null;
  const verificationStatus = outcome?.status ?? 'unverified';
  const verificationJson = (outcome?.result ?? undefined) as Prisma.InputJsonValue | undefined;

  const created = await prisma.examPaper.create({
    data: {
      userId: user.id,
      subjectSlug,
      title: paper.title,
      totalMarks: paper.totalMarks,
      durationMinutes: paper.durationMinutes,
      readingTimeMinutes: paper.readingTimeMinutes,
      seed,
      layoutVersion: paper.layoutVersion,
      sectionsJson: paper.sections,
      verificationStatus,
      verificationJson,
      publishStatus: 'draft',
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
      verificationStatus: verificationStatus === 'verified' ? 'verified' : 'unverified',
      verificationJson: undefined,
      sortOrder: question.questionNumber,
    })),
  });

  return res.status(201).json({
    paper: serializePaper(
      await prisma.examPaper.findUnique({ where: { id: created.id } }),
      paper.questions,
    ),
    verificationNote: outcome?.note ?? 'Verification skipped.',
  });
});

/** GET /v1/exam-papers — the student's generated papers. */
examPapersRouter.get('/', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view sample test papers.' });
  }

  const papers = await prisma.examPaper.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return res.json({
    papers: papers.map((paper) => ({
      id: paper.id,
      title: paper.title,
      seed: paper.seed,
      totalMarks: paper.totalMarks,
      verificationStatus: paper.verificationStatus,
      publishStatus: paper.publishStatus,
      createdAt: paper.createdAt,
    })),
  });
});

/** GET /v1/exam-papers/series — the published Board Mock Test Series. */
examPapersRouter.get('/series', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view the mock test series.' });
  }

  const subjectSlug =
    typeof req.query?.subjectSlug === 'string'
      ? req.query.subjectSlug
      : 'mathematics-standard';

  const series = getMockTestSeriesForSubject(subjectSlug);

  const published = await prisma.examPaper.findMany({
    where: { subjectSlug: series.subjectSlug, userId: null, publishStatus: 'published' },
  });
  const bySeed = indexSeriesPapers(published);

  const papers = series.papers.map((definition) =>
    seriesPaperView(definition, bySeed.get(definition.seed), series),
  );

  return res.json({
    series: {
      key: series.key,
      title: series.title,
      description: series.description,
      subjectSlug: series.subjectSlug,
      freeSampleNumber: series.freeSampleNumber,
    },
    papers,
  });
});

/**
 * POST /v1/exam-papers/:id/attempt
 * Saves a submitted mock-test attempt. Idempotent on clientAttemptId — the
 * same attempt re-submitted (e.g. after a network retry) is not duplicated.
 * Returns the saved attempt plus a fresh weak-area summary.
 */
examPapersRouter.post('/:id/attempt', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to save your mock test attempt.' });
  }

  const examPaperId = String(req.params.id);
  const paper = await prisma.examPaper.findUnique({
    where: { id: examPaperId },
    select: { id: true, userId: true, totalMarks: true, publishStatus: true },
  });
  if (!paper) {
    return res.status(404).json({ message: 'Sample test paper not found.' });
  }
  const isPublishedSeries = paper.userId === null && paper.publishStatus === 'published';
  if (!isPublishedSeries && paper.userId !== user.id && user.role !== UserRole.admin) {
    return res.status(403).json({ message: 'You do not have access to this paper.' });
  }

  const normalized = normalizeExamPaperAttempt({ ...req.body, examPaperId });
  if (!normalized.data) {
    return res.status(400).json({ message: normalized.error });
  }
  const attempt = normalized.data;

  // Cross-field reconciliation: the client's totals must be consistent with the
  // paper and with the per-question results, or a buggy/tampered payload could
  // persist internally inconsistent rows that drive the aggregate report.
  if (attempt.totalMarks !== paper.totalMarks) {
    return res.status(400).json({
      message: `totalMarks (${attempt.totalMarks}) does not match the paper (${paper.totalMarks}).`,
    });
  }
  const resultsSum = attempt.questionResults.reduce(
    (sum, result) => sum + result.earnedMarks,
    0,
  );
  if (attempt.earnedMarks !== resultsSum) {
    return res.status(400).json({
      message: 'earnedMarks does not match the sum of the question results.',
    });
  }
  const mcqCount = attempt.questionResults.filter(
    (result) => result.questionType === 'mcq',
  ).length;
  if (attempt.mcqTotal !== mcqCount) {
    return res.status(400).json({
      message: 'mcqTotal does not match the number of MCQ question results.',
    });
  }

  const weakAreas = computeWeakAreas(attempt.questionResults);
  let savedResult;
  for (let attemptIndex = 0; attemptIndex < 10; attemptIndex += 1) {
    try {
      savedResult = await prisma.$transaction(async (tx) => {
        const existing = await tx.examPaperAttempt.findUnique({
          where: {
            userId_clientAttemptId: {
              clientAttemptId: attempt.clientAttemptId,
              userId: user.id,
            },
          },
        });
        if (existing) {
          const matches = matchesExamPaperAttempt(
            {
              earnedMarks: existing.earnedMarks,
              mcqCorrect: existing.mcqCorrect,
              mcqTotal: existing.mcqTotal,
              totalMarks: existing.totalMarks,
              writtenSelfMarked: existing.writtenSelfMarked,
              questionResults: existing.questionResults,
            },
            attempt,
          );
          if (matches) {
            return { attempt: existing, created: false, updated: false, matches: true };
          }

          // Same client attempt re-submitted with new content (e.g. the student
          // self-marked written answers after the initial save). Update the row
          // in place — never create a duplicate.
          const updated = await tx.examPaperAttempt.update({
            where: { id: existing.id },
            data: {
              earnedMarks: attempt.earnedMarks,
              mcqCorrect: attempt.mcqCorrect,
              mcqTotal: attempt.mcqTotal,
              totalMarks: attempt.totalMarks,
              writtenSelfMarked: attempt.writtenSelfMarked,
              questionResults: attempt.questionResults as unknown as Prisma.InputJsonValue,
              weakChapterSlugs: weakAreas.weakChapterSlugs,
              weakQuestionTypes: weakAreas.weakQuestionTypes,
            },
          });
          return { attempt: updated, created: false, updated: true, matches: false };
        }

        const latest = await tx.examPaperAttempt.findFirst({
          where: { examPaperId, userId: user.id },
          orderBy: { attemptNumber: 'desc' },
          select: { attemptNumber: true },
        });

        const created = await tx.examPaperAttempt.create({
          data: {
            userId: user.id,
            examPaperId,
            clientAttemptId: attempt.clientAttemptId,
            attemptNumber: (latest?.attemptNumber ?? 0) + 1,
            totalMarks: attempt.totalMarks,
            earnedMarks: attempt.earnedMarks,
            mcqCorrect: attempt.mcqCorrect,
            mcqTotal: attempt.mcqTotal,
            writtenSelfMarked: attempt.writtenSelfMarked,
            questionResults: attempt.questionResults as unknown as Prisma.InputJsonValue,
            weakChapterSlugs: weakAreas.weakChapterSlugs,
            weakQuestionTypes: weakAreas.weakQuestionTypes,
          },
        });

        await tx.progressEvent.create({
          data: {
            eventType: 'exam_paper_scored',
            metadata: {
              attemptId: created.id,
              attemptNumber: created.attemptNumber,
              examPaperId,
              earnedMarks: created.earnedMarks,
              mcqCorrect: created.mcqCorrect,
              mcqTotal: created.mcqTotal,
              totalMarks: created.totalMarks,
              weakChapterSlugs: created.weakChapterSlugs,
              weakQuestionTypes: created.weakQuestionTypes,
            } satisfies Prisma.InputJsonValue,
            occurredAt: new Date(),
            userId: user.id,
          },
        });

        return { attempt: created, created: true, updated: false, matches: true };
      });
      break;
    } catch (error) {
      // Only the attemptNumber uniqueness race (two submits landing together) is
      // worth retrying; anything else fails fast rather than hammering the DB.
      const isUniqueRace =
        typeof error === 'object' &&
        error !== null &&
        (error as { code?: string }).code === 'P2002';
      if (!isUniqueRace || attemptIndex === 9) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 50 * (attemptIndex + 1)));
    }
  }

  if (!savedResult) {
    return res.status(500).json({ message: 'Unable to save the attempt.' });
  }

  const saved = savedResult.attempt;
  return res.status(savedResult.created ? 201 : 200).json({
    attempt: {
      id: saved.id,
      clientAttemptId: saved.clientAttemptId,
      attemptNumber: saved.attemptNumber,
      examPaperId: saved.examPaperId,
      totalMarks: saved.totalMarks,
      earnedMarks: saved.earnedMarks,
      mcqCorrect: saved.mcqCorrect,
      mcqTotal: saved.mcqTotal,
      writtenSelfMarked: saved.writtenSelfMarked,
      createdAt: saved.createdAt,
    },
    created: savedResult.created,
    updated: savedResult.updated,
    matches: savedResult.matches,
    weakAreas,
  });
});

/**
 * GET /v1/exam-papers/attempts?paperId=…
 * Lists the signed-in student's mock-test attempts, newest first. Optionally
 * filtered to a single paper. Returns both the attempt summary rows and an
 * aggregate weak-area report across all returned attempts.
 */
examPapersRouter.get('/attempts', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view your mock test attempts.' });
  }

  const paperId = typeof req.query.paperId === 'string' ? req.query.paperId : undefined;
  const rows = await prisma.examPaperAttempt.findMany({
    where: {
      userId: user.id,
      ...(paperId ? { examPaperId: paperId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      examPaper: {
        select: {
          title: true,
          seed: true,
          totalMarks: true,
          durationMinutes: true,
        },
      },
    },
  });

  const allResults = rows.flatMap(
    (row) => (row.questionResults as ExamPaperQuestionResult[] | null) ?? [],
  );
  const weakAreas = computeWeakAreas(allResults);

  return res.json({
    attempts: rows.map((row) => ({
      id: row.id,
      clientAttemptId: row.clientAttemptId,
      attemptNumber: row.attemptNumber,
      examPaperId: row.examPaperId,
      paperTitle: row.examPaper.title,
      paperSeed: row.examPaper.seed,
      totalMarks: row.totalMarks,
      earnedMarks: row.earnedMarks,
      mcqCorrect: row.mcqCorrect,
      mcqTotal: row.mcqTotal,
      writtenSelfMarked: row.writtenSelfMarked,
      weakChapterSlugs: row.weakChapterSlugs,
      weakQuestionTypes: row.weakQuestionTypes,
      createdAt: row.createdAt,
    })),
    weakAreas,
    aggregate: rows.length
      ? {
          attempts: rows.length,
          averagePercent: Math.round(
            rows.reduce((sum, row) => sum + (row.earnedMarks / row.totalMarks) * 100, 0) /
              rows.length,
          ),
          bestPercent: Math.max(
            ...rows.map((row) => Math.round((row.earnedMarks / row.totalMarks) * 100)),
          ),
        }
      : null,
  });
});

/** GET /v1/exam-papers/:id — full paper with questions (owner, admin, or published series paper). */
examPapersRouter.get('/:id', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view a sample test paper.' });
  }

  const paper = await prisma.examPaper.findUnique({
    where: { id: String(req.params.id) },
    include: {
      questions: {
        orderBy: { questionNumber: 'asc' },
        include: { questionBank: { select: { chapterSlug: true } } },
      },
    },
  });
  if (!paper) {
    return res.status(404).json({ message: 'Sample test paper not found.' });
  }
  const isPublishedSeries = isSeriesPaper(paper);
  if (!isPublishedSeries && paper.userId !== user.id && user.role !== UserRole.admin) {
    return res.status(403).json({ message: 'You do not have access to this paper.' });
  }

  const questions = paper.questions.map((question) => ({
    questionNumber: question.questionNumber,
    sectionId: question.sectionId,
    questionType: question.questionType,
    marks: question.marks,
    statement: question.statementJson as string,
    answerKey: question.answerKeyJson,
    bankKey: question.questionBankId ?? '',
    chapterSlug: question.questionBank?.chapterSlug ?? null,
    sourceKind: question.sourceKind,
    provenance: question.provenanceJson ?? null,
  }));

  return res.json({ paper: serializePaper(paper, questions) });
});

// ── Admin endpoints (require an admin session) ───────────────────────────────

/** GET /v1/admin/exam-papers/review — papers awaiting AI/manual verification. */
adminExamPapersRouter.get('/review', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const papers = await prisma.examPaper.findMany({
    where: { verificationStatus: { not: 'verified' } },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });

  return res.json({
    papers: papers.map((paper) => ({
      id: paper.id,
      userId: paper.userId,
      title: paper.title,
      seed: paper.seed,
      verificationStatus: paper.verificationStatus,
      verification: paper.verificationJson,
      publishStatus: paper.publishStatus,
      createdAt: paper.createdAt,
      questionCount: paper.questions.length,
    })),
  });
});

/** POST /v1/admin/exam-papers/:id/approve — human sign-off publishes the paper. */
adminExamPapersRouter.post('/:id/approve', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const paper = await prisma.examPaper.findUnique({ where: { id: String(req.params.id) } });
  if (!paper) {
    return res.status(404).json({ message: 'Sample test paper not found.' });
  }

  const updated = await prisma.examPaper.update({
    where: { id: paper.id },
    data: { publishStatus: 'published', verificationStatus: 'verified' },
  });

  return res.json({ paper: { id: updated.id, publishStatus: updated.publishStatus, verificationStatus: updated.verificationStatus } });
});

/** POST /v1/admin/exam-papers/:id/reject */
adminExamPapersRouter.post('/:id/reject', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const paper = await prisma.examPaper.findUnique({ where: { id: String(req.params.id) } });
  if (!paper) {
    return res.status(404).json({ message: 'Sample test paper not found.' });
  }

  const updated = await prisma.examPaper.update({
    where: { id: paper.id },
    data: { publishStatus: 'rejected' },
  });

  return res.json({ paper: { id: updated.id, publishStatus: updated.publishStatus } });
});

/**
 * POST /v1/admin/exam-papers/series/publish
 * Generates every paper of the fixed mock-test series from its curated seed,
 * verifies each with Gemini, and publishes it as a shared paper (userId = null)
 * so all students take the same Paper 1, Paper 2, …. Re-running is idempotent:
 * already-published series papers are left untouched.
 */
adminExamPapersRouter.post('/series/publish', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const subjectSlug =
    typeof req.body?.subjectSlug === 'string'
      ? req.body.subjectSlug
      : 'mathematics-standard';

  const series = getMockTestSeriesForSubject(subjectSlug);

  const existing = await prisma.examPaper.findMany({
    where: {
      subjectSlug: series.subjectSlug,
      userId: null,
      publishStatus: 'published',
    },
  });
  const bySeed = indexSeriesPapers(existing);
  const bank = await prisma.questionBankQuestion.findMany({
    where: { subjectSlug: series.subjectSlug, verificationStatus: 'verified' },
  });
  const bankKeyToId = new Map(bank.map((row) => [row.bankKey, row.id]));

  const results: Array<{ number: number; seed: number; title: string; status: string; id?: string }> = [];

  for (const definition of series.papers) {
    const already = bySeed.get(definition.seed);
    if (already) {
      results.push({
        number: definition.number,
        seed: definition.seed,
        title: definition.title,
        status: 'already-published',
        id: already.id,
      });
      continue;
    }

    let paper: GeneratedPaper;
    try {
      paper = assemblePaper({
        subjectSlug: series.subjectSlug,
        seed: definition.seed,
        questions: bank.map(toBankQuestion),
      });
    } catch (error) {
      return res.status(422).json({
        message:
          `Unable to assemble ${definition.title} (seed ${definition.seed}): ` +
          (error instanceof Error ? error.message : String(error)),
      });
    }

    const outcome = await verifyPaper(paper);
    const verificationStatus = outcome.status === 'verified' ? 'verified' : 'review';
    const verificationJson = (outcome.result ?? undefined) as Prisma.InputJsonValue | undefined;

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
        verificationStatus,
        verificationJson,
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
        verificationStatus: verificationStatus === 'verified' ? 'verified' : 'unverified',
        verificationJson: undefined,
        sortOrder: question.questionNumber,
      })),
    });

    results.push({
      number: definition.number,
      seed: definition.seed,
      title: definition.title,
      status: verificationStatus === 'verified' ? 'published-verified' : 'published-review',
      id: created.id,
    });
  }

  const published = await prisma.examPaper.findMany({
    where: {
      subjectSlug: series.subjectSlug,
      userId: null,
      publishStatus: 'published',
    },
  });
  const bySeedFinal = indexSeriesPapers(published);

  return res.status(201).json({
    series: {
      key: series.key,
      title: series.title,
    },
    results,
    papers: series.papers.map((definition) =>
      seriesPaperView(definition, bySeedFinal.get(definition.seed), series),
    ),
  });
});

/** GET /v1/admin/exam-papers/bank?status=review — the question bank. */
adminExamPapersRouter.get('/bank', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const subjectSlug = typeof req.query.subjectSlug === 'string' ? req.query.subjectSlug : undefined;
  const rows = await prisma.questionBankQuestion.findMany({
    where: {
      ...(subjectSlug ? { subjectSlug } : {}),
      ...(status ? { verificationStatus: status as QuestionVerificationStatus } : {}),
    },
    orderBy: { bankKey: 'asc' },
  });

  return res.json({
    questions: rows.map((row) => ({
      id: row.id,
      bankKey: row.bankKey,
      unitId: row.unitId,
      topicId: row.topicId,
      questionType: row.questionType,
      marks: row.marks,
      difficulty: row.difficulty,
      sourceKind: row.sourceKind,
      variantCount: (row.variantsJson as BankQuestion['variants']).length,
      verificationStatus: row.verificationStatus,
      reviewNotes: row.reviewNotes,
      verifiedAt: row.verifiedAt,
    })),
  });
});

/** POST /v1/admin/exam-papers/bank/:id/verify — run Gemini on one bank question. */
adminExamPapersRouter.post('/bank/:id/verify', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const row = await prisma.questionBankQuestion.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!row) {
    return res.status(404).json({ message: 'Bank question not found.' });
  }

  const outcome = await verifyBankQuestion(toBankQuestion(row));
  const updated = await prisma.questionBankQuestion.update({
    where: { id: row.id },
    data: {
      verificationStatus: outcome.status === 'verified' ? 'verified' : 'review',
      reviewNotes: outcome.note,
      verifiedAt: outcome.status === 'verified' ? new Date() : null,
    },
  });

  return res.json({
    bankKey: updated.bankKey,
    verificationStatus: updated.verificationStatus,
    verdict: outcome.verdict,
    reasons: outcome.reasons,
    note: outcome.note,
  });
});

/** POST /v1/admin/exam-papers/bank/:id/approve — human sign-off. */
adminExamPapersRouter.post('/bank/:id/approve', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const row = await prisma.questionBankQuestion.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!row) {
    return res.status(404).json({ message: 'Bank question not found.' });
  }

  const updated = await prisma.questionBankQuestion.update({
    where: { id: row.id },
    data: { verificationStatus: 'verified', verifiedAt: new Date(), reviewNotes: null },
  });

  return res.json({ bankKey: updated.bankKey, verificationStatus: updated.verificationStatus });
});

/** POST /v1/admin/exam-papers/bank/:id/reject */
adminExamPapersRouter.post('/bank/:id/reject', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const row = await prisma.questionBankQuestion.findUnique({
    where: { id: String(req.params.id) },
  });
  if (!row) {
    return res.status(404).json({ message: 'Bank question not found.' });
  }

  const note =
    typeof req.body?.note === 'string' && req.body.note.trim()
      ? req.body.note.trim().slice(0, 500)
      : 'Rejected by admin review.';

  const updated = await prisma.questionBankQuestion.update({
    where: { id: row.id },
    data: { verificationStatus: 'rejected', reviewNotes: note, verifiedAt: null },
  });

  return res.json({ bankKey: updated.bankKey, verificationStatus: updated.verificationStatus });
});
