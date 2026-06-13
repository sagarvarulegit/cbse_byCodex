import { Router } from 'express';

import { prisma } from '../lib/prisma.js';

export const catalogRouter = Router();

catalogRouter.get('/pilot', async (_req, res) => {
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
