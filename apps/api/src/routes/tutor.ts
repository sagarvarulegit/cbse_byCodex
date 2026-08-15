import { Router } from 'express';

import { retrieveChunks } from '../lib/rag/retrieve.js';
import { prisma } from '../lib/prisma.js';
import {
  serializeConversationDetail,
  serializeConversationSummary,
  type ConversationWithMessages,
} from '../lib/tutor/serialize.js';
import { requireSessionUser } from '../lib/session.js';

export const tutorRouter = Router();

/**
 * POST /v1/tutor/conversations
 * Creates a new conversation for the signed-in student.
 */
tutorRouter.post('/conversations', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to start a chat with Tara.' });
  }

  const title =
    typeof req.body?.title === 'string' && req.body.title.trim()
      ? req.body.title.trim().slice(0, 200)
      : 'New conversation';

  const conversation = await prisma.tutorConversation.create({
    data: { userId: user.id, title },
  });

  return res.status(201).json({ conversation: serializeConversationSummary(conversation) });
});

/**
 * GET /v1/tutor/conversations
 * Lists the signed-in student's conversations, newest first.
 */
tutorRouter.get('/conversations', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view your chats.' });
  }

  const conversations = await prisma.tutorConversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: 'desc' },
    take: 100,
  });

  return res.json({
    conversations: conversations.map(serializeConversationSummary),
  });
});

async function loadOwnConversation(
  conversationId: string,
  userId: string,
): Promise<ConversationWithMessages | null> {
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

/**
 * GET /v1/tutor/conversations/:id
 * Returns one of the student's conversations with its full message thread.
 */
tutorRouter.get('/conversations/:id', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to view your chat.' });
  }

  const conversation = await loadOwnConversation(String(req.params.id), user.id);
  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  return res.json({ conversation: serializeConversationDetail(conversation) });
});

/**
 * DELETE /v1/tutor/conversations/:id
 * Deletes one of the student's conversations (messages cascade).
 */
tutorRouter.delete('/conversations/:id', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to delete a chat.' });
  }

  const existing = await prisma.tutorConversation.findFirst({
    where: { id: String(req.params.id), userId: user.id },
    select: { id: true },
  });
  if (!existing) {
    return res.status(404).json({ message: 'Conversation not found.' });
  }

  await prisma.tutorConversation.delete({ where: { id: existing.id } });
  return res.json({ deleted: true });
});

/**
 * POST /v1/tutor/search
 * Debug/QA endpoint: returns the top RAG chunks for a query without calling
 * Gemini chat. Lets us validate retrieval quality during development. Kept
 * behind the student session so it is not a public API.
 */
tutorRouter.post('/search', async (req, res) => {
  const user = await requireSessionUser(req);
  if (!user) {
    return res.status(401).json({ message: 'Sign in to search the tutor corpus.' });
  }

  const query = typeof req.body?.query === 'string' ? req.body.query.trim() : '';
  if (!query) {
    return res.status(400).json({ message: 'Query is required.' });
  }
  if (query.length > 500) {
    return res.status(400).json({ message: 'Query is too long (max 500 characters).' });
  }

  const topK =
    Number.isInteger(req.body?.topK) && Number(req.body.topK) > 0
      ? Math.min(Number(req.body.topK), 20)
      : 6;

  try {
    const chunks = await retrieveChunks(query, { topK });
    return res.json({
      query,
      count: chunks.length,
      chunks: chunks.map((chunk) => ({
        id: chunk.id,
        subject: chunk.subject,
        chapterSlug: chunk.chapterSlug,
        sectionTitle: chunk.sectionTitle,
        score: Number(chunk.score.toFixed(3)),
        sourcePath: chunk.sourcePath,
        content: chunk.content.slice(0, 400),
      })),
    });
  } catch (error) {
    console.error('Tutor search failed.', error);
    return res.status(500).json({ message: 'Unable to search the tutor corpus.' });
  }
});
