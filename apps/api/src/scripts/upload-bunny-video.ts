import 'dotenv/config';
import { promises as fs } from 'node:fs';
import path from 'node:path';

import {
  buildBunnyVideoUrls,
  buildMasterStoragePath,
  createBunnyStreamVideo,
  getBunnyStreamConfig,
  uploadBunnyStorageFile,
  uploadBunnyStreamVideo,
} from '../lib/bunny.js';
import { prisma } from '../lib/prisma.js';

type CliOptions = {
  chapterSlug?: string;
  file?: string;
  lessonId?: string;
  lessonSlug?: string;
  skipMasterStorage: boolean;
  title?: string;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    skipMasterStorage: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];

    switch (arg) {
      case '--chapter-slug':
        options.chapterSlug = next;
        index += 1;
        break;
      case '--file':
        options.file = next;
        index += 1;
        break;
      case '--lesson-id':
        options.lessonId = next;
        index += 1;
        break;
      case '--lesson-slug':
        options.lessonSlug = next;
        index += 1;
        break;
      case '--skip-master-storage':
        options.skipMasterStorage = true;
        break;
      case '--title':
        options.title = next;
        index += 1;
        break;
      default:
        throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function printUsage() {
  console.error(`Usage:
  npm run bunny:upload-video -w apps/api -- --file ./lesson.mp4 --lesson-id <lessonId>
  npm run bunny:upload-video -w apps/api -- --file ./lesson.mp4 --chapter-slug real-numbers --lesson-slug euclid-division-lemma

Required env:
  BUNNY_STREAM_LIBRARY_ID
  BUNNY_STREAM_API_KEY
  BUNNY_STREAM_CDN_HOSTNAME
  BUNNY_STORAGE_ZONE_NAME
  BUNNY_STORAGE_ACCESS_KEY

Optional:
  BUNNY_STORAGE_ENDPOINT
  --skip-master-storage
`);
}

async function findLesson(options: CliOptions) {
  if (options.lessonId) {
    return prisma.lesson.findUnique({
      where: { id: options.lessonId },
    });
  }

  if (options.chapterSlug && options.lessonSlug) {
    return prisma.lesson.findFirst({
      where: {
        slug: options.lessonSlug,
        topic: {
          chapter: {
            slug: options.chapterSlug,
          },
        },
      },
    });
  }

  throw new Error('Pass either --lesson-id or both --chapter-slug and --lesson-slug.');
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.file) {
    throw new Error('--file is required.');
  }

  const filePath = path.resolve(options.file);
  const stat = await fs.stat(filePath);
  if (!stat.isFile()) {
    throw new Error(`Not a file: ${filePath}`);
  }

  const lesson = await findLesson(options);
  if (!lesson) {
    throw new Error('Lesson was not found.');
  }

  if (!options.skipMasterStorage) {
    const storagePath = buildMasterStoragePath(filePath, lesson.slug);
    const upload = await uploadBunnyStorageFile(filePath, storagePath);
    console.log(`Uploaded master to Bunny Storage: ${upload.remotePath}`);
  }

  const streamConfig = getBunnyStreamConfig();
  const title = options.title ?? lesson.title;
  const createdVideo = await createBunnyStreamVideo(title);
  await uploadBunnyStreamVideo(createdVideo.videoId, filePath);

  const urls = buildBunnyVideoUrls(streamConfig.libraryId, streamConfig.cdnHostname, createdVideo.videoId);
  const existingVideo = await prisma.video.findFirst({
    where: {
      lessonId: lesson.id,
      provider: 'bunny',
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  const data = {
    durationSeconds: createdVideo.durationSeconds,
    embedUrl: urls.embedUrl,
    playbackUrl: urls.playbackUrl,
    processingStatus: createdVideo.processingStatus,
    provider: 'bunny',
    providerLibraryId: streamConfig.libraryId,
    providerVideoId: createdVideo.videoId,
    thumbnailUrl: urls.thumbnailUrl,
  };

  const video = existingVideo
    ? await prisma.video.update({
        where: { id: existingVideo.id },
        data,
      })
    : await prisma.video.create({
        data: {
          ...data,
          lessonId: lesson.id,
        },
      });

  console.log(`Uploaded Bunny Stream video: ${createdVideo.videoId}`);
  console.log(`Updated Video row: ${video.id}`);
  console.log(`Playback URL: ${urls.playbackUrl}`);
}

main()
  .catch((error) => {
    printUsage();
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
