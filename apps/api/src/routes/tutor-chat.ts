import { Prisma } from '@prisma/client';
import { Router } from 'express';
import multer from 'multer';

import { generateTutorAnswer, type TutorPageContext } from '../lib/tutor/generate.js';
import { sanitizeTutorMarkdown } from '../lib/tutor/format.js';
import { assertUnderDailyLimit } from '../lib/tutor/quota.js';
import { serializeConversationDetail } from '../lib/tutor/serialize.js';
import { fetchTutorAttachment, uploadTutorAttachment } from '../lib/tutor/storage.js';
import { prisma } from '../lib/prisma.js';
import { retrieveChunks, type RetrievedChunk } from '../lib/rag/retrieve.js';
import { requireSessionUser } from '../lib/session.js';

export const tutorChatRouter = Router();

function parsePageContext(raw: unknown): TutorPageContext | null {
  if (!raw) {
    return null;
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return typeof parsed === 'object' && parsed !== null ? (parsed as TutorPageContext) : null;
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') {
    return raw as TutorPageContext;
  }
  return null;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 5 },
});

const IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const PDF_MIME = 'application/pdf';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function extensionForMime(mimeType: string): string {
  if (mimeType === 'image/jpeg') return 'jpg';
  if (mimeType === 'image/png') return 'png';
  if (mimeType === 'image/webp') return 'webp';
  if (mimeType === PDF_MIME) return 'pdf';
  return 'bin';
}

function sanitizeFileName(name: string): string {
  const cleaned = name.replace(/[^\w.\- ]/g, '').slice(0, 120).trim();
  return cleaned || 'attachment';
}

function deriveConversationTitle(question: string, context?: TutorPageContext | null): string {
  const clean = question.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (context?.chapterTitle && clean.length >= 3) {
    const snippet = clean.length > 35 ? `${clean.slice(0, 32)}...` : clean;
    return `${context.chapterTitle}: ${snippet}`;
  }
  return clean.length > 45 ? `${clean.slice(0, 42)}...` : clean;
}

async function loadOwnConversation(conversationId: string, userId: string) {
  return prisma.tutorConversation.findFirst({
    where: { id: conversationId, userId },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { attachments: { orderBy: { createdAt: 'asc' } } },
      },
    },
  });
}

function sse(res: import('express').Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * POST /v1/tutor/conversations/:id/messages
 * multipart/form-data: question (string), files? (image/pdf, up to 5).
 * Validates and stores attachments, persists the user message, retrieves RAG
 * chunks, calls Gemini, then streams the assistant answer as SSE and persists it.
 */
tutorChatRouter.post('/conversations/:id/messages', upload.array('files', 5), async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to chat with Tara.' });
  }

  const conversationId = String(req.params.id);
  const conversation = await loadOwnConversation(conversationId, user.id);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question) {
    return res.status(400).json({ message: 'Question is required.' });
  }
  if (question.length > 2000) {
    return res.status(400).json({ message: 'Question is too long (max 2000 characters).' });
  }

  const quota = await assertUnderDailyLimit(user.id);
  if (!quota.ok) {
    return res.status(429).json({
      message: `You have reached your daily limit of ${quota.limit} doubts. Come back tomorrow!`,
    });
  }

  const files = (req.files as Express.Multer.File[] | undefined) ?? [];
  const validated: Array<{ kind: 'image' | 'pdf'; mimeType: string; buffer: Buffer; ext: string; name: string; sizeBytes: number }> = [];
  for (const file of files) {
    if (IMAGE_MIME.has(file.mimetype)) {
      if (file.size > MAX_IMAGE_BYTES) {
        return res.status(400).json({ message: 'Each image must be 5 MB or smaller.' });
      }
      validated.push({ kind: 'image', mimeType: file.mimetype, buffer: file.buffer, ext: extensionForMime(file.mimetype), name: sanitizeFileName(file.originalname), sizeBytes: file.size });
    } else if (file.mimetype === PDF_MIME) {
      if (file.size > MAX_PDF_BYTES) {
        return res.status(400).json({ message: 'Each PDF must be 10 MB or smaller.' });
      }
      validated.push({ kind: 'pdf', mimeType: file.mimetype, buffer: file.buffer, ext: extensionForMime(file.mimetype), name: sanitizeFileName(file.originalname), sizeBytes: file.size });
    } else {
      return res.status(400).json({ message: `Unsupported file type: ${file.mimetype}. Only JPEG, PNG, WebP and PDF are allowed.` });
    }
  }

  // Persist the user message (and attachments) first so the thread is safe even
  // if the Gemini call fails.
  const userMessage = await prisma.tutorMessage.create({
    data: {
      conversationId,
      role: 'user',
      contentMarkdown: question,
      citedChunkIds: null as unknown as Prisma.InputJsonValue,
    },
  });

  const attachmentRows: Array<{ id: string; kind: string; storagePath: string; mimeType: string; sizeBytes: number; fileName: string }> = [];
  try {
    for (const file of validated) {
      const stored = await uploadTutorAttachment(conversationId, file.kind, file.mimeType, file.buffer, file.ext);
      const row = await prisma.tutorAttachment.create({
        data: {
          messageId: userMessage.id,
          kind: file.kind,
          storagePath: stored.storagePath,
          mimeType: file.mimeType,
          sizeBytes: file.sizeBytes,
          fileName: file.name,
        },
      });
      attachmentRows.push({
        id: row.id,
        kind: row.kind,
        storagePath: row.storagePath,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
        fileName: row.fileName,
      });
    }
  } catch (error) {
    console.error('Attachment upload failed.', error);
    return res.status(500).json({ message: 'Failed to store an attachment.' });
  }

  // Parse optional screen/page context sent from the client
  const pageContext = parsePageContext(req.body?.pageContext);

  // Retrieve RAG chunks for the question (augmented with screen context if question is brief).
  let chunks: RetrievedChunk[] = [];
  try {
    const searchContext = [
      pageContext?.chapterTitle || pageContext?.chapterSlug || '',
      pageContext?.activeItem?.title || '',
      question,
    ]
      .filter(Boolean)
      .join(' ');

    chunks = await retrieveChunks(searchContext || question, { topK: 6 });
  } catch (error) {
    console.error('Retrieval failed.', error);
    chunks = [];
  }

  // Build attachment context for Gemini: images inline (base64), PDFs as text
  // note (full multimodal PDF handling is a follow-up).
  let attachmentText: string | null = null;
  const imageParts: Array<{ mimeType: string; base64Data: string }> = [];
  for (const row of attachmentRows) {
    if (row.kind === 'image') {
      const buffer = await fetchTutorAttachment(row.storagePath);
      if (buffer) {
        imageParts.push({ mimeType: row.mimeType, base64Data: buffer.toString('base64') });
      }
    } else {
      attachmentText = attachmentText
        ? `${attachmentText}\n[Attached PDF: ${row.fileName}]`
        : `[Attached PDF: ${row.fileName}]`;
    }
  }

  // Set up SSE response headers before doing the slow Gemini call.
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    // Sliding context window: last 10 messages (5 user/assistant turns) for optimal token usage
    const recentHistory = conversation.messages
      .slice(-10)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.contentMarkdown }));

    const answer = await generateTutorAnswer({
      chunks,
      history: [...recentHistory, { role: 'user', content: question }],
      question,
      attachmentText,
      imageParts,
      pageContext,
    });

    const markdown = sanitizeTutorMarkdown(answer.answerMarkdown);

    // Stream in chunks for the typing effect (still one persisted message).
    const step = Math.max(200, Math.floor(markdown.length / 5));
    for (let i = 0; i < markdown.length; i += step) {
      sse(res, 'token', { text: markdown.slice(i, i + step) });
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    const assistantMessage = await prisma.tutorMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        contentMarkdown: markdown,
        citedChunkIds: answer.citedChunkIds as unknown as Prisma.InputJsonValue,
      },
    });

    const isDefaultTitle =
      !conversation.title ||
      conversation.title === 'New conversation' ||
      conversation.title === 'New doubt' ||
      conversation.messages.length === 0;
    const titleUpdate = isDefaultTitle ? deriveConversationTitle(question, pageContext) : undefined;

    await prisma.tutorConversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        ...(titleUpdate ? { title: titleUpdate } : {}),
      },
    });

    sse(res, 'done', {
      messageId: assistantMessage.id,
      citedChunkIds: answer.citedChunkIds,
      confidence: answer.confidence,
      refused: answer.refused,
      title: titleUpdate,
      quota: { used: quota.used + 1, limit: quota.limit },
    });
    res.end();
  } catch (error) {
    console.error('Tutor answer generation failed.', error);
    const fallback = await prisma.tutorMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        contentMarkdown:
          'Sorry — I hit a snag while thinking. Could you try asking again in a moment?',
        citedChunkIds: null as unknown as Prisma.InputJsonValue,
      },
    });
    sse(res, 'done', { messageId: fallback.id, citedChunkIds: [], confidence: 0, refused: false, error: true });
    res.end();
  }
});

/** POST /v1/tutor/conversations/:id/messages-json — JSON fallback (no attachments). */
tutorChatRouter.post('/conversations/:id/messages-json', async (req, res) => {
  // Forward to the multipart handler by wrapping the body into a fake file list.
  // Simpler: handle the JSON path inline (question only).
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to chat with Tara.' });
  }
  const conversationId = String(req.params.id);
  const conversation = await loadOwnConversation(conversationId, user.id);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }
  const question = typeof req.body?.question === 'string' ? req.body.question.trim() : '';
  if (!question) {
    return res.status(400).json({ message: 'Question is required.' });
  }
  const quota = await assertUnderDailyLimit(user.id);
  if (!quota.ok) {
    return res.status(429).json({ message: `Daily limit of ${quota.limit} doubts reached.` });
  }

  const pageContext = parsePageContext(req.body?.pageContext);

  await prisma.tutorMessage.create({
    data: { conversationId, role: 'user', contentMarkdown: question, citedChunkIds: null as unknown as Prisma.InputJsonValue },
  });

  let chunks: RetrievedChunk[] = [];
  try {
    const searchContext = [
      pageContext?.chapterTitle || pageContext?.chapterSlug || '',
      pageContext?.activeItem?.title || '',
      question,
    ]
      .filter(Boolean)
      .join(' ');

    chunks = await retrieveChunks(searchContext || question, { topK: 6 });
  } catch {
    chunks = [];
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.flushHeaders();

  try {
    // Sliding context window: last 10 messages (5 user/assistant turns) for optimal token usage
    const recentHistory = conversation.messages
      .slice(-10)
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.contentMarkdown }));

    const answer = await generateTutorAnswer({
      chunks,
      history: [...recentHistory, { role: 'user', content: question }],
      question,
      pageContext,
    });
    const markdown = sanitizeTutorMarkdown(answer.answerMarkdown);
    const step = Math.max(200, Math.floor(markdown.length / 5));
    for (let i = 0; i < markdown.length; i += step) {
      sse(res, 'token', { text: markdown.slice(i, i + step) });
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    const assistantMessage = await prisma.tutorMessage.create({
      data: {
        conversationId,
        role: 'assistant',
        contentMarkdown: markdown,
        citedChunkIds: answer.citedChunkIds as unknown as Prisma.InputJsonValue,
      },
    });

    const isDefaultTitle =
      !conversation.title ||
      conversation.title === 'New conversation' ||
      conversation.title === 'New doubt' ||
      conversation.messages.length === 0;
    const titleUpdate = isDefaultTitle ? deriveConversationTitle(question, pageContext) : undefined;

    await prisma.tutorConversation.update({
      where: { id: conversationId },
      data: {
        updatedAt: new Date(),
        ...(titleUpdate ? { title: titleUpdate } : {}),
      },
    });

    sse(res, 'done', {
      messageId: assistantMessage.id,
      citedChunkIds: answer.citedChunkIds,
      confidence: answer.confidence,
      refused: answer.refused,
      title: titleUpdate,
      quota: { used: quota.used + 1, limit: quota.limit },
    });
    res.end();
  } catch (error) {
    console.error('Tutor answer generation failed.', error);
    const fallback = await prisma.tutorMessage.create({
      data: { conversationId, role: 'assistant', contentMarkdown: 'Sorry — I hit a snag. Could you try again?', citedChunkIds: null as unknown as Prisma.InputJsonValue },
    });
    sse(res, 'done', { messageId: fallback.id, citedChunkIds: [], confidence: 0, refused: false, error: true });
    res.end();
  }
});
