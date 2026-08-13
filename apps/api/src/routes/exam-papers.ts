import { randomInt } from 'node:crypto';

import { Prisma, UserRole } from '@prisma/client';
import type {
  QuestionBankQuestion as QuestionBankQuestionRow,
  QuestionVerificationStatus,
} from '@prisma/client';
import type { Request } from 'express';
import { Router } from 'express';

import { assemblePaper } from '../lib/exam-papers/assembler.js';
import { BLUEPRINT } from '../lib/exam-papers/blueprint.js';
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
      : BLUEPRINT.slug;
  if (subjectSlug !== BLUEPRINT.slug) {
    return res.status(422).json({
      message: `Paper generation currently supports ${BLUEPRINT.title} only.`,
    });
  }
  if (BLUEPRINT.blueprintStatus !== 'ready') {
    return res.status(422).json({
      message: 'The Mathematics Standard blueprint is not ready for paper generation.',
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
  // persisted as `review`/`unverified` and never claims to be AI-checked.
  const runVerification = req.body?.verify !== false;
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

/** GET /v1/exam-papers/:id — full paper with questions (owner or admin). */
examPapersRouter.get('/:id', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view a sample test paper.' });
  }

  const paper = await prisma.examPaper.findUnique({
    where: { id: String(req.params.id) },
    include: { questions: { orderBy: { questionNumber: 'asc' } } },
  });
  if (!paper) {
    return res.status(404).json({ message: 'Sample test paper not found.' });
  }
  if (paper.userId !== user.id && user.role !== UserRole.admin) {
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

/** GET /v1/admin/exam-papers/bank?status=review — the question bank. */
adminExamPapersRouter.get('/bank', async (req, res) => {
  const user = await requireAdminUser(req);
  if (!user) {
    return res.status(403).json({ message: 'Admin access required.' });
  }

  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const rows = await prisma.questionBankQuestion.findMany({
    where: {
      subjectSlug: BLUEPRINT.slug,
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
