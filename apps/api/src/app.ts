import { Prisma, UserRole } from '@prisma/client';
import cors from 'cors';
import express, { type Request } from 'express';

import { createSessionToken, readSessionToken, hashPassword, verifyPassword } from './lib/auth.js';
import { buildBunnyVideoUrls, getBunnyStreamConfig, signBunnyPlaybackUrl } from './lib/bunny.js';
import { prisma } from './lib/prisma.js';
import { rateLimit } from './lib/rate-limiter.js';
import { normalizeRegistrationClassLevel } from './lib/registration.js';

const allowedOrigins = process.env.CORS_ORIGIN
  ?.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const DEFAULT_AUTH_SESSION_DAYS = 14;
const MIN_PASSWORD_LENGTH = 8;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts
  message: 'Too many registration or login attempts. Please try again after 15 minutes.',
});

app.use(cors(allowedOrigins?.length ? { origin: allowedOrigins, credentials: true } : undefined));
app.use(express.json());

function getAuthSecret() {
  if (process.env.AUTH_TOKEN_SECRET) {
    return process.env.AUTH_TOKEN_SECRET;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'local-dev-auth-secret';
  }

  throw new Error('AUTH_TOKEN_SECRET is required in production.');
}

function getAuthSessionDurationSeconds() {
  const configuredDays = Number(process.env.AUTH_SESSION_DAYS ?? DEFAULT_AUTH_SESSION_DAYS);
  if (!Number.isFinite(configuredDays) || configuredDays <= 0) {
    return DEFAULT_AUTH_SESSION_DAYS * 24 * 60 * 60;
  }

  return Math.floor(configuredDays * 24 * 60 * 60);
}

function normalizeEmail(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();
  if (!normalizedValue || !normalizedValue.includes('@')) {
    return null;
  }

  return normalizedValue;
}

function normalizeFullName(value: unknown) {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim().replace(/\s+/g, ' ');
  if (normalizedValue.length < 2) {
    return null;
  }

  return normalizedValue;
}

function validatePassword(value: unknown) {
  if (typeof value !== 'string') {
    return 'Password is required.';
  }

  const normalizedValue = value.trim();
  if (normalizedValue.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!/[A-Za-z]/.test(normalizedValue) || !/\d/.test(normalizedValue)) {
    return 'Password must include at least one letter and one number.';
  }

  return null;
}

function readBearerToken(authorizationHeader: string | undefined) {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  return token || null;
}

function formatUserResponse(user: {
  id: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  profile: {
    classLevel: number;
    fullName: string;
  } | null;
}) {
  return {
    classLevel: user.profile?.classLevel ?? 10,
    email: user.email,
    fullName: user.profile?.fullName ?? 'Student',
    id: user.id,
    phone: user.phone,
    role: user.role,
  };
}

async function getSessionUser(req: Request) {
  const token = readBearerToken(req.header('authorization'));
  if (!token) {
    return null;
  }

  const session = readSessionToken(token, getAuthSecret());
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { profile: true },
  });

  if (!user || user.status !== 'active') {
    return null;
  }

  return user;
}

async function requireSessionUser(req: Request) {
  const user = await getSessionUser(req);
  if (!user) {
    return null;
  }

  return user;
}

async function hasLessonAccess(req: Request, lesson: { accessLevel: string }) {
  if (lesson.accessLevel === 'free') {
    return { allowed: true, user: await getSessionUser(req) };
  }

  const user = await requireSessionUser(req);
  if (!user) {
    return { allowed: false, reason: 'login_required' as const, user: null };
  }

  // TODO: replace this login-only MVP gate with subscription/entitlement checks.
  return { allowed: true, user };
}

function getVideoPlaybackUrl(playbackUrl: string) {
  const config = getBunnyStreamConfig();
  if (!config.tokenAuthKey) {
    return {
      expiresAt: null,
      playbackUrl,
    };
  }

  const signedUrl = signBunnyPlaybackUrl(playbackUrl, config.tokenAuthKey, config.signedUrlTtlSeconds);
  return {
    expiresAt: signedUrl.expiresAt,
    playbackUrl: signedUrl.url,
  };
}

function normalizePercentComplete(value: unknown) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return Math.max(0, Math.min(100, Math.round(numericValue)));
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'cbse-api' });
});

app.post('/v1/auth/register', authLimiter, async (req, res) => {
  try {
    const fullName = normalizeFullName(req.body?.fullName);
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';
    const passwordError = validatePassword(password);
    const { classLevel, error: classLevelError } = normalizeRegistrationClassLevel(req.body?.classLevel);

    if (!fullName) {
      return res.status(400).json({ message: 'Full name must be at least 2 characters.' });
    }

    if (!email) {
      return res.status(400).json({ message: 'A valid email is required.' });
    }

    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    if (classLevelError || classLevel === null) {
      return res.status(400).json({ message: classLevelError ?? 'Please choose your class to continue.' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'An account already exists for this email.' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        profile: {
          create: {
            classLevel,
            fullName,
          },
        },
        role: UserRole.student,
      },
      include: {
        profile: true,
      },
    });

    const token = createSessionToken(
      {
        role: user.role,
        userId: user.id,
        fullName: user.profile?.fullName ?? 'Student',
        classLevel: user.profile?.classLevel ?? 10,
        email: user.email,
      },
      getAuthSecret(),
      getAuthSessionDurationSeconds(),
    );

    return res.status(201).json({ token, user: formatUserResponse(user) });
  } catch (error) {
    console.error('Registration failed', error);
    return res.status(500).json({ message: 'Unable to create the account right now.' });
  }
});

app.post('/v1/auth/login', authLimiter, async (req, res) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = typeof req.body?.password === 'string' ? req.body.password.trim() : '';

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user?.passwordHash) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await verifyPassword(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'This account is not active right now.' });
    }

    const token = createSessionToken(
      {
        role: user.role,
        userId: user.id,
        fullName: user.profile?.fullName ?? 'Student',
        classLevel: user.profile?.classLevel ?? 10,
        email: user.email,
      },
      getAuthSecret(),
      getAuthSessionDurationSeconds(),
    );

    return res.json({ token, user: formatUserResponse(user) });
  } catch (error) {
    console.error('Login failed', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
});

app.get('/v1/auth/session', async (req, res) => {
  try {
    const token = readBearerToken(req.header('authorization'));
    if (!token) {
      return res.status(401).json({ message: 'Missing session token.' });
    }

    const session = readSessionToken(token, getAuthSecret());
    if (!session) {
      return res.status(401).json({ message: 'Session has expired. Please log in again.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        profile: true,
      },
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Session is no longer valid.' });
    }

    return res.json({ user: formatUserResponse(user) });
  } catch (error) {
    console.error('Session lookup failed', error);
    return res.status(500).json({ message: 'Unable to validate the current session.' });
  }
});

app.post('/v1/auth/logout', (_req, res) => {
  res.status(204).send();
});

app.get('/v1/lessons/by-slug/:chapterSlug/:lessonSlug/video', async (req, res) => {
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
        durationSeconds: video.durationSeconds,
        embedUrl: video.embedUrl ?? urls.embedUrl,
        expiresAt: playback.expiresAt,
        id: video.id,
        playbackUrl: playback.playbackUrl,
        processingStatus: video.processingStatus,
        provider: video.provider,
        providerVideoId: video.providerVideoId,
        thumbnailUrl: video.thumbnailUrl ?? urls.thumbnailUrl,
      },
    });
  } catch (error) {
    console.error('Failed to load lesson video', error);
    return res.status(500).json({ message: 'Unable to load the lesson video right now.' });
  }
});

app.post('/v1/progress/video', async (req, res) => {
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
          positionSeconds,
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

app.get('/v1/catalog/pilot', async (_req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: {
        classLevel: 10,
        isPublished: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            topics: {
              where: {
                isPublished: true,
              },
              include: {
                lessons: {
                  where: {
                    publishStatus: 'published',
                  },
                },
              },
            },
          },
        },
      },
    });

    return res.json({
      classLevel: 10,
      subjects: subjects.map((subject) => ({
        name: subject.name,
        chapters: subject.chapters.map((chapter) => {
          const hasFreeLesson = chapter.topics.some((topic) =>
            topic.lessons.some((lesson) => lesson.accessLevel === 'free')
          );
          return {
            title: chapter.title,
            accessLevel: hasFreeLesson ? 'free-preview' : 'premium',
          };
        }),
      })),
    });
  } catch (error) {
    console.error('Failed to load pilot catalog', error);
    return res.status(500).json({ message: 'Unable to load the catalog right now.' });
  }
});

export default app;
