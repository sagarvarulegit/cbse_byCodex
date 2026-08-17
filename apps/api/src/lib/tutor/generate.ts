import type { TutorMessage } from '@prisma/client';

import { getGeminiConfig } from '../exam-papers/verify.js';
import type { RetrievedChunk } from '../rag/retrieve.js';
import { TARA_SYSTEM_PROMPT } from './tara.js';

export type TutorHistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

export type TutorAnswer = {
  answerMarkdown: string;
  citedChunkIds: string[];
  confidence: number;
  refused: boolean;
};

export type GenerateOptions = {
  chunks: RetrievedChunk[];
  history: TutorHistoryItem[];
  question: string;
  attachmentText?: string | null;
  /** Optional base64 image parts to send inline to Gemini (multimodal). */
  imageParts?: Array<{ mimeType: string; base64Data: string }>;
};

const MODEL = 'gemini-2.5-flash';

function buildChunksBlock(chunks: RetrievedChunk[]): string {
  if (chunks.length === 0) {
    return 'No study-notes passages were retrieved for this question.';
  }
  return chunks
    .map(
      (chunk, index) =>
        `[source id=${chunk.id}, ${chunk.subject}, ${chunk.chapterSlug}, ${chunk.sectionTitle}]\n${chunk.content}`,
    )
    .join('\n\n---\n\n');
}

function buildHistoryBlock(history: TutorHistoryItem[]): string {
  if (history.length === 0) {
    return '(no previous messages)';
  }
  return history
    .map((item) => `${item.role === 'user' ? 'Student' : 'Tara'}: ${item.content}`)
    .join('\n');
}

function buildPrompt(options: GenerateOptions): string {
  const { chunks, history, question, attachmentText } = options;
  return [
    TARA_SYSTEM_PROMPT,
    '',
    '## Retrieved study-notes passages',
    buildChunksBlock(chunks),
    '',
    '## Conversation so far',
    buildHistoryBlock(history),
    '',
    '## Student question',
    attachmentText ? `(The student also attached a file. Its text: ${attachmentText})` : '',
    question,
    '',
    'Respond with STRICT JSON per the output contract.',
  ].join('\n');
}

export function parseTutorAnswer(raw: string): TutorAnswer {
  const trimmed = raw.trim();
  // Strip markdown fences if the model wrapped the JSON.
  const jsonText = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    // Fallback: treat the raw text as the answer (no citations).
    return {
      answerMarkdown: trimmed || 'I could not form an answer. Could you rephrase?',
      citedChunkIds: [],
      confidence: 0,
      refused: false,
    };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('Tutor answer is not a JSON object.');
  }

  const record = parsed as Record<string, unknown>;
  const answerMarkdown =
    typeof record.answerMarkdown === 'string'
      ? record.answerMarkdown.trim()
      : trimmed || 'I could not form an answer. Could you rephrase?';
  const citedChunkIds = Array.isArray(record.citedChunkIds)
    ? record.citedChunkIds.filter((id): id is string => typeof id === 'string')
    : [];
  const confidence =
    typeof record.confidence === 'number' && Number.isFinite(record.confidence)
      ? Math.max(0, Math.min(1, record.confidence))
      : 0;
  const refused = record.refused === true;

  return { answerMarkdown, citedChunkIds, confidence, refused };
}

export async function generateTutorAnswer(
  options: GenerateOptions,
  fetchImpl: typeof fetch = fetch,
): Promise<TutorAnswer> {
  const config = getGeminiConfig();
  if (!config.apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.');
  }

  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/' +
    `${encodeURIComponent(MODEL)}:generateContent?key=${encodeURIComponent(config.apiKey)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);

  try {
    const parts: Array<Record<string, unknown>> = [{ text: buildPrompt(options) }];
    for (const image of options.imageParts ?? []) {
      parts.push({
        inlineData: { mimeType: image.mimeType, data: image.base64Data },
      });
    }

    const response = await fetchImpl(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              answerMarkdown: { type: 'STRING' },
              citedChunkIds: { type: 'ARRAY', items: { type: 'STRING' } },
              confidence: { type: 'NUMBER' },
              refused: { type: 'BOOLEAN' },
            },
            required: ['answerMarkdown', 'citedChunkIds', 'confidence', 'refused'],
          },
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(`Tutor API responded with HTTP ${response.status}: ${body.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
        finishReason?: string;
      }>;
    };
    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
    if (!text.trim()) {
      throw new Error('Tutor API returned an empty response.');
    }
    return parseTutorAnswer(text);
  } finally {
    clearTimeout(timer);
  }
}

export type { TutorMessage };
