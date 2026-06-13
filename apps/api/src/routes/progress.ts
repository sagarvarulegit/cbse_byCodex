import { Prisma } from '@prisma/client';
import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireSessionUser } from '../lib/session.js';

function normalizePercentComplete(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

export const progressRouter = Router();

progressRouter.post('/video', async (req, res) => {
  try {
    const user = await requireSessionUser(req);
    if (!user) {
      return res.status(401).json({ message: 'Please log in to save video progress.' });
    }

    const lessonId = typeof req.body?.lessonId === 'string' ? req.body.lessonId : null;
    const videoId = typeof req.body?.videoId === 'string' ? req.body.videoId : null;
    const positionSeconds = Number(req.body?.positionSeconds ?? 0);
    const durationSeconds = Number(req.body?.durationSeconds ?? 0);
    const percentComplete = normalizePercentComplete(req.body?.percentComplete);

    if (!lessonId || !videoId || percentComplete === null) {
      return res.status(400).json({ message: 'lessonId, videoId, and percentComplete are required.' });
    }

    if (!Number.isFinite(positionSeconds) || positionSeconds < 0) {
      return res.status(400).json({ message: 'positionSeconds must be a positive number.' });
    }

    const video = await prisma.video.findFirst({
      where: {
        id: videoId,
        lessonId,
      },
      include: {
        lesson: {
          include: {
            topic: {
              include: {
                chapter: true,
              },
            },
          },
        },
      },
    });

    if (!video) {
      return res.status(404).json({ message: 'Video was not found.' });
    }

    await prisma.progressEvent.create({
      data: {
        chapterId: video.lesson.topic.chapter.id,
        eventType: percentComplete >= 30 ? 'video_checkpoint' : 'video_progress',
        lessonId,
        metadata: {
          durationSeconds: Number.isFinite(durationSeconds) ? durationSeconds : null,
          percentComplete,
          positionSeconds: Math.round(positionSeconds),
          videoId,
        } satisfies Prisma.InputJsonValue,
        occurredAt: new Date(),
        topicId: video.lesson.topicId,
        userId: user.id,
      },
    });

    return res.status(202).json({ saved: true });
  } catch (error) {
    console.error('Failed to save video progress', error);
    return res.status(500).json({ message: 'Unable to save video progress right now.' });
  }
});
