import { Router } from 'express';

import { buildFeedbackEmailHtml, sendEmail } from '../lib/email.js';
import { prisma } from '../lib/prisma.js';
import { rateLimit } from '../lib/rate-limiter.js';
import { getSessionUser, requireSessionUser } from '../lib/session.js';

export const FEEDBACK_CATEGORIES = ['suggestion', 'bug', 'content_error', 'general'] as const;
export const FEEDBACK_SUBJECTS = ['mathematics', 'science', 'social_science', 'english', 'general'] as const;
export const FEEDBACK_STATUSES = ['new', 'reviewed', 'in_progress', 'resolved'] as const;
export const FEEDBACK_SORTS = ['date', 'rating', 'status'] as const;

type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];
type FeedbackSubject = (typeof FEEDBACK_SUBJECTS)[number];
type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 4000;
const MIN_DESCRIPTION_LENGTH = 20;
const MAX_ADMIN_NOTES_LENGTH = 5000;

const feedbackLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 submissions per IP per hour
  message: 'Too many feedback submissions. Please try again later.',
});

type Result<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

function readRecord(value: unknown) {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function readText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.slice(0, maxLength);
}

function readOptionalText(value: unknown, maxLength: number) {
  return readText(value, maxLength);
}

function readRating(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const rating = Number(value);
  if (!Number.isInteger(rating)) {
    return null;
  }

  return Math.max(1, Math.min(5, rating));
}

function isFeedbackCategory(value: string): value is FeedbackCategory {
  return (FEEDBACK_CATEGORIES as readonly string[]).includes(value);
}

function isFeedbackSubject(value: string): value is FeedbackSubject {
  return (FEEDBACK_SUBJECTS as readonly string[]).includes(value);
}

function isFeedbackStatus(value: string): value is FeedbackStatus {
  return (FEEDBACK_STATUSES as readonly string[]).includes(value);
}

function isFeedbackSort(value: string) {
  return (FEEDBACK_SORTS as readonly string[]).includes(value);
}

type NormalizedFeedback = {
  category: FeedbackCategory;
  chapter: string | null;
  description: string;
  rating: number | null;
  subject: FeedbackSubject | null;
  title: string;
  userId: string | null;
};

export function normalizeFeedbackPayload(value: unknown): Result<NormalizedFeedback> {
  const body = readRecord(value);
  if (!body) {
    return { data: null, error: 'Invalid feedback payload.' };
  }

  const category = readText(body.category, 40);
  if (!category || !isFeedbackCategory(category)) {
    return { data: null, error: 'category must be suggestion, bug, content_error, or general.' };
  }

  const subject = readOptionalText(body.subject, 40);
  let normalizedSubject: FeedbackSubject | null = null;
  if (subject) {
    if (!isFeedbackSubject(subject)) {
      return { data: null, error: 'subject must be mathematics, science, social_science, english, or general.' };
    }
    normalizedSubject = subject;
  }

  const title = readText(body.title, MAX_TITLE_LENGTH);
  if (!title || title.length < 5) {
    return { data: null, error: 'Please give your feedback a short title.' };
  }

  const description = readText(body.description, MAX_DESCRIPTION_LENGTH);
  if (!description || description.length < MIN_DESCRIPTION_LENGTH) {
    return { data: null, error: 'Please share at least 20 characters of feedback.' };
  }

  return {
    data: {
      category,
      chapter: readOptionalText(body.chapter, MAX_TITLE_LENGTH),
      description,
      rating: readRating(body.rating),
      subject: normalizedSubject,
      title,
      userId: null,
    },
    error: null,
  };
}

export const feedbackRouter = Router();

// Public: students can submit feedback without logging in.
feedbackRouter.post('/', feedbackLimiter, async (req, res) => {
  try {
    const payload = normalizeFeedbackPayload(req.body);
    if (!payload.data) {
      return res.status(400).json({ message: payload.error ?? 'Invalid feedback payload.' });
    }

    // Attach the student when a valid session is present, otherwise stay anonymous.
    const user = await getSessionUser(req);
    const feedback = payload.data;

    const saved = await prisma.studentFeedback.create({
      data: {
        category: feedback.category,
        chapter: feedback.chapter,
        description: feedback.description,
        rating: feedback.rating,
        subject: feedback.subject,
        title: feedback.title,
        userId: user?.id ?? null,
      },
      select: {
        createdAt: true,
        id: true,
      },
    });

    // Send email notification to support inbox
    const categoryLabels: Record<string, string> = {
      suggestion: '💡 Suggestion',
      bug: '🐛 Bug Report',
      content_error: '📝 Content Error',
      general: '💬 General Feedback',
    };
    const categoryLabel = categoryLabels[feedback.category] || feedback.category;
    const targetInbox = process.env.FEEDBACK_NOTIFICATION_EMAIL || 'support@chapterready.in';
    const emailSubject = `[Feedback: ${categoryLabel}] ${feedback.title}`;

    const emailHtml = buildFeedbackEmailHtml({
      feedbackId: saved.id,
      category: feedback.category,
      subject: feedback.subject,
      chapter: feedback.chapter,
      title: feedback.title,
      description: feedback.description,
      rating: feedback.rating,
      studentName: user?.profile?.fullName,
      studentEmail: user?.email,
      studentPhone: user?.phone,
      classLevel: user?.profile?.classLevel,
      createdAt: saved.createdAt,
    });

    const emailText = `New Feedback Received on ChapterReady

Category: ${categoryLabel}
Subject: ${feedback.subject ?? 'General'}
Chapter: ${feedback.chapter ?? 'N/A'}
Rating: ${feedback.rating ? `${feedback.rating}/5 stars` : 'Not provided'}
Title: ${feedback.title}

Description:
${feedback.description}

Submitted By:
Name: ${user?.profile?.fullName ?? 'Anonymous Student'}
Email: ${user?.email ?? 'Not logged in (Guest)'}
Phone: ${user?.phone ?? 'N/A'}
Class Level: ${user?.profile?.classLevel ? `Class ${user.profile.classLevel}` : 'Class 10'}
Feedback ID: ${saved.id}
Date: ${saved.createdAt.toISOString()}
`;

    try {
      await sendEmail({
        to: targetInbox,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      });
    } catch (emailErr) {
      console.error('[FEEDBACK_EMAIL_ERROR] Failed to send feedback notification email:', emailErr);
    }

    return res.status(201).json({ feedbackId: saved.id, saved: true });
  } catch (error) {
    console.error('Failed to save feedback', error);
    return res.status(500).json({ message: 'Unable to send feedback right now.' });
  }
});

// Admin only: list feedback with optional filters and sorting.
feedbackRouter.get('/', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access is required to view feedback.' });
    }

    const { category, status, subject } = req.query;
    const where: Record<string, unknown> = {};
    if (typeof category === 'string' && isFeedbackCategory(category)) {
      where.category = category;
    }
    if (typeof status === 'string' && isFeedbackStatus(status)) {
      where.status = status;
    }
    if (typeof subject === 'string' && isFeedbackSubject(subject)) {
      where.subject = subject;
    }

    const sortValue = typeof req.query.sort === 'string' && isFeedbackSort(req.query.sort) ? req.query.sort : 'date';
    const orderBy =
      sortValue === 'rating'
        ? [{ rating: 'desc' as const }, { createdAt: 'desc' as const }]
        : sortValue === 'status'
          ? [{ status: 'asc' as const }, { createdAt: 'desc' as const }]
          : [{ createdAt: 'desc' as const }];

    const items = await prisma.studentFeedback.findMany({
      where,
      orderBy,
    });

    return res.json({ items });
  } catch (error) {
    console.error('Failed to list feedback', error);
    return res.status(500).json({ message: 'Unable to load feedback right now.' });
  }
});

// Admin only: aggregate stats by category and status, plus average rating.
feedbackRouter.get('/stats', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access is required to view feedback stats.' });
    }

    const [byCategory, byStatus, ratingAggregate, total] = await Promise.all([
      prisma.studentFeedback.groupBy({
        by: ['category'],
        _count: { _all: true },
      }),
      prisma.studentFeedback.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),
      prisma.studentFeedback.aggregate({
        _avg: { rating: true },
      }),
      prisma.studentFeedback.count(),
    ]);

    const categoryCounts = Object.fromEntries(
      byCategory.map((item) => [item.category, item._count._all]),
    ) as Record<string, number>;
    const statusCounts = Object.fromEntries(
      byStatus.map((item) => [item.status, item._count._all]),
    ) as Record<string, number>;

    return res.json({
      averageRating: ratingAggregate._avg.rating,
      byCategory: categoryCounts,
      byStatus: statusCounts,
      newCount: statusCounts.new ?? 0,
      resolvedCount: statusCounts.resolved ?? 0,
      total,
    });
  } catch (error) {
    console.error('Failed to load feedback stats', error);
    return res.status(500).json({ message: 'Unable to load feedback stats right now.' });
  }
});

// Admin only: update status and/or admin notes.
feedbackRouter.patch('/:id', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access is required to update feedback.' });
    }

    const body = readRecord(req.body);
    if (!body) {
      return res.status(400).json({ message: 'Invalid update payload.' });
    }

    const data: { adminNotes?: string | null; status?: string } = {};

    if (body.status !== undefined && body.status !== null && body.status !== '') {
      const status = readText(body.status, 40);
      if (!status || !isFeedbackStatus(status)) {
        return res.status(400).json({ message: 'status must be new, reviewed, in_progress, or resolved.' });
      }
      data.status = status;
    }

    if (body.adminNotes !== undefined) {
      if (body.adminNotes === null || body.adminNotes === '') {
        data.adminNotes = null;
      } else {
        const notes = readText(body.adminNotes, MAX_ADMIN_NOTES_LENGTH);
        if (!notes) {
          return res.status(400).json({ message: 'Admin notes must contain text.' });
        }
        data.adminNotes = notes;
      }
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: 'Provide a status or admin notes to update.' });
    }

    const existing = await prisma.studentFeedback.findUnique({
      where: { id: req.params.id },
      select: { id: true },
    });
    if (!existing) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    const updated = await prisma.studentFeedback.update({
      where: { id: req.params.id },
      data,
    });

    return res.json({ item: updated });
  } catch (error) {
    console.error('Failed to update feedback', error);
    return res.status(500).json({ message: 'Unable to update feedback right now.' });
  }
});
