import { Router } from 'express';

import { hasLessonAccess } from '../lib/access.js';
import { buildBunnyVideoUrls, fetchBunnyStreamVideo, getBunnyStreamConfig } from '../lib/bunny.js';
import { prisma } from '../lib/prisma.js';
import { shouldRefreshVideoStatus } from '../lib/video-status.js';

function getVideoPlaybackUrl(playbackUrl: string) {
  return {
    expiresAt: null,
    playbackUrl,
  };
}

export const videoRouter = Router();

videoRouter.get('/by-slug/:chapterSlug/:lessonSlug/video', async (req, res) => {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: req.params.lessonSlug,
        publishStatus: 'published',
        topic: {
          chapter: {
            slug: req.params.chapterSlug,
            isPublished: true,
          },
        },
      },
      include: {
        topic: {
          include: {
            chapter: {
              include: {
                subject: true,
              },
            },
          },
        },
        videos: {
          where: {
            provider: 'bunny',
          },
          orderBy: {
            updatedAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({ message: 'Lesson video was not found.' });
    }

    const access = await hasLessonAccess(req, lesson);
    if (!access.allowed) {
      return res.status(401).json({ message: 'Please log in to watch this lesson.' });
    }

    const video = lesson.videos[0];
    if (!video?.providerVideoId || !video.providerLibraryId) {
      return res.status(404).json({ message: 'No video is attached to this lesson yet.' });
    }

    let processingStatus = video.processingStatus;
    let durationSeconds = video.durationSeconds;
    let thumbnailUrl = video.thumbnailUrl;

    if (
      video.provider === 'bunny' &&
      shouldRefreshVideoStatus({
        processingStatus: video.processingStatus,
        statusSyncedAt: video.statusSyncedAt,
      })
    ) {
      try {
        const bunnyVideo = await fetchBunnyStreamVideo(video.providerVideoId);
        const statusSyncedAt = new Date();
        const nextDurationSeconds = bunnyVideo.durationSeconds ?? video.durationSeconds;
        const nextThumbnailUrl = bunnyVideo.thumbnailUrl ?? video.thumbnailUrl;

        processingStatus = bunnyVideo.processingStatus;
        durationSeconds = nextDurationSeconds;
        thumbnailUrl = nextThumbnailUrl;

        if (
          bunnyVideo.processingStatus !== video.processingStatus ||
          nextDurationSeconds !== video.durationSeconds ||
          nextThumbnailUrl !== video.thumbnailUrl ||
          video.statusSyncedAt === null
        ) {
          await prisma.video.update({
            where: { id: video.id },
            data: {
              durationSeconds: nextDurationSeconds,
              processingStatus: bunnyVideo.processingStatus,
              statusSyncedAt,
              thumbnailUrl: nextThumbnailUrl,
            },
          });
        } else {
          await prisma.video.update({
            where: { id: video.id },
            data: {
              statusSyncedAt,
            },
          });
        }
      } catch (error) {
        console.error('Failed to refresh Bunny video status', {
          error,
          providerVideoId: video.providerVideoId,
          videoId: video.id,
        });
      }
    }

    const streamConfig = getBunnyStreamConfig();
    const urls = buildBunnyVideoUrls(
      video.providerLibraryId,
      streamConfig.cdnHostname,
      video.providerVideoId,
    );
    const sourcePlaybackUrl = video.playbackUrl ?? urls.playbackUrl;
    const playback = getVideoPlaybackUrl(sourcePlaybackUrl);

    return res.json({
      lesson: {
        accessLevel: lesson.accessLevel,
        chapterId: lesson.topic.chapter.id,
        chapterSlug: lesson.topic.chapter.slug,
        id: lesson.id,
        subjectId: lesson.topic.chapter.subject.id,
        title: lesson.title,
        topicId: lesson.topicId,
      },
      video: {
        durationSeconds,
        embedUrl: video.embedUrl ?? urls.embedUrl,
        expiresAt: playback.expiresAt,
        id: video.id,
        playbackUrl: playback.playbackUrl,
        processingStatus,
        provider: video.provider,
        providerVideoId: video.providerVideoId,
        thumbnailUrl: thumbnailUrl ?? urls.thumbnailUrl,
      },
    });
  } catch (error) {
    console.error('Failed to load lesson video', error);
    return res.status(500).json({ message: 'Unable to load the lesson video right now.' });
  }
});
