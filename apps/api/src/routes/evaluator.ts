import { Router } from 'express';
import type { Request, Response } from 'express';
import { gradeWrittenAnswer, type EvaluateAnswerRequest } from '../lib/evaluator/grade-answer.js';

export const evaluatorRouter = Router();

evaluatorRouter.post('/grade-answer', async (req: Request, res: Response) => {
  const body = req.body as Partial<EvaluateAnswerRequest>;

  if (!body.questionStem || typeof body.questionStem !== 'string') {
    res.status(400).json({ error: 'Missing required field: questionStem' });
    return;
  }

  if (!body.maxMarks || typeof body.maxMarks !== 'number' || body.maxMarks <= 0) {
    res.status(400).json({ error: 'Field maxMarks must be a positive number' });
    return;
  }

  if (!Array.isArray(body.officialValuePoints) || body.officialValuePoints.length === 0) {
    res.status(400).json({ error: 'Field officialValuePoints must be a non-empty array of strings' });
    return;
  }

  const hasText = Boolean(body.studentAnswerText && body.studentAnswerText.trim().length > 0);
  const hasImage = Boolean(body.studentAnswerImageBase64 && body.studentAnswerImageBase64.length > 50);

  if (!hasText && !hasImage) {
    res.status(400).json({ error: 'Either studentAnswerText or studentAnswerImageBase64 must be provided' });
    return;
  }

  try {
    const evaluation = await gradeWrittenAnswer({
      questionId: body.questionId,
      questionStem: body.questionStem,
      maxMarks: body.maxMarks,
      studentAnswerText: body.studentAnswerText?.trim(),
      studentAnswerImageBase64: body.studentAnswerImageBase64,
      imageMimeType: body.imageMimeType || 'image/jpeg',
      officialValuePoints: body.officialValuePoints,
      modelAnswer: body.modelAnswer,
      subjectSlug: body.subjectSlug,
    });

    res.json(evaluation);
  } catch (error: any) {
    console.error('Error grading written answer:', error);
    res.status(500).json({ error: 'Failed to evaluate answer' });
  }
});
