import { getApiBaseUrl } from './payments';

export type StepEvaluation = {
  stepIndex: number;
  pointDescription: string;
  allocatedMarks: number;
  marksEarned: number;
  feedback: string;
  matchedKeywords: string[];
  missingKeywords: string[];
};

export type DeductionItem = {
  reason: string;
  penaltyMarks: number;
};

export type EvaluateAnswerPayload = {
  questionId?: string;
  questionStem: string;
  maxMarks: number;
  studentAnswerText?: string;
  studentAnswerImageBase64?: string;
  imageMimeType?: string;
  officialValuePoints: string[];
  modelAnswer?: string;
  subjectSlug?: string;
};

export type EvaluateAnswerResult = {
  marksAwarded: number;
  maxMarks: number;
  percentageScore: number;
  stepEvaluations: StepEvaluation[];
  deductions: DeductionItem[];
  topperWritingTips: string[];
  overallFeedback: string;
  examinerSummary: string;
  isAiGrounded: boolean;
};

export async function evaluateStudentAnswer(
  payload: EvaluateAnswerPayload,
  token?: string | null
): Promise<EvaluateAnswerResult> {
  const baseUrl = getApiBaseUrl();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}/v1/evaluator/grade-answer`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Evaluation failed (${response.status}): ${errorText}`);
  }

  return response.json();
}
