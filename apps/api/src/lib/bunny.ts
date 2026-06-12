import { createHash, createHmac } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const STREAM_API_BASE_URL = 'https://video.bunnycdn.com';
const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 30;

type BunnyStreamVideo = {
  guid?: string;
  videoId?: string;
  id?: string;
  length?: number;
  status?: number;
  encodeProgress?: number;
  thumbnailFileName?: string;
};

export type BunnyStreamVideoStatus = {
  durationSeconds: number | null;
  processingStatus: string;
  thumbnailUrl: string | null;
};

export type BunnyVideoUrls = {
  embedUrl: string;
  playbackUrl: string;
  thumbnailUrl: string;
};

export type SignedBunnyUrl = {
  expiresAt: number;
  url: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function optionalEnv(name: string) {
  const value = process.env[name]?.trim();
  return value || null;
}

function normalizeCdnHostname(hostname: string) {
  return hostname.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

function encodePathSegment(value: string) {
  return encodeURIComponent(value).replace(/%2F/g, '/');
}

async function parseBunnyResponse(response: Response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) as any : null;

  if (!response.ok) {
    const message = data?.message ?? data?.Message ?? response.statusText;
    throw new Error(`Bunny request failed: ${message}`);
  }

  return data;
}

export function getBunnyStreamConfig() {
  return {
    apiKey: requiredEnv('BUNNY_STREAM_API_KEY'),
    cdnHostname: normalizeCdnHostname(requiredEnv('BUNNY_STREAM_CDN_HOSTNAME')),
    libraryId: requiredEnv('BUNNY_STREAM_LIBRARY_ID'),
    signedUrlTtlSeconds: Number(process.env.BUNNY_STREAM_SIGNED_URL_TTL_SECONDS ?? DEFAULT_SIGNED_URL_TTL_SECONDS),
    tokenAuthKey: optionalEnv('BUNNY_STREAM_TOKEN_AUTH_KEY'),
  };
}

export function getBunnyStorageConfig() {
  return {
    accessKey: requiredEnv('BUNNY_STORAGE_ACCESS_KEY'),
    endpoint: (process.env.BUNNY_STORAGE_ENDPOINT ?? 'https://storage.bunnycdn.com').replace(/\/+$/, ''),
    zoneName: requiredEnv('BUNNY_STORAGE_ZONE_NAME'),
  };
}

export function buildBunnyVideoUrls(libraryId: string, cdnHostname: string, videoId: string): BunnyVideoUrls {
  const normalizedHostname = normalizeCdnHostname(cdnHostname);
  const encodedVideoId = encodePathSegment(videoId);

  return {
    embedUrl: `https://iframe.mediadelivery.net/embed/${encodePathSegment(libraryId)}/${encodedVideoId}`,
    playbackUrl: `https://${normalizedHostname}/${encodedVideoId}/playlist.m3u8`,
    thumbnailUrl: `https://${normalizedHostname}/${encodedVideoId}/thumbnail.jpg`,
  };
}

export function signBunnyDirectoryUrl({
  expiresAt,
  securityKey,
  url,
  userIp,
}: {
  expiresAt: number;
  securityKey: string;
  url: string;
  userIp?: string | null;
}): SignedBunnyUrl {
  const parsedUrl = new URL(url);
  const directoryPath = parsedUrl.pathname.replace(/[^/]*$/, '');
  const signingParameters = Array.from(parsedUrl.searchParams.entries());
  signingParameters.push(['token_path', directoryPath]);
  signingParameters.sort(([a], [b]) => a.localeCompare(b));

  const signingData = signingParameters.map(([key, value]) => `${key}=${value}`).join('&');
  const urlData = signingParameters.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
  const signaturePath = directoryPath;
  const signaturePayload = `${signaturePath}${expiresAt}${signingData}${userIp ?? ''}`;
  const token = `HS256-${createHmac('sha256', securityKey).update(signaturePayload).digest('base64url')}`;

  return {
    expiresAt,
    url: `${parsedUrl.origin}/bcdn_token=${token}&${urlData}&expires=${expiresAt}${parsedUrl.pathname}`,
  };
}

export function signBunnyPlaybackUrl(url: string, securityKey: string, ttlSeconds: number, userIp?: string | null) {
  const expiresAt = Math.floor(Date.now() / 1000) + ttlSeconds;
  return signBunnyDirectoryUrl({ expiresAt, securityKey, url, userIp });
}

export async function createBunnyStreamVideo(title: string) {
  const config = getBunnyStreamConfig();
  const response = await fetch(`${STREAM_API_BASE_URL}/library/${config.libraryId}/videos`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      AccessKey: config.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  const video = await parseBunnyResponse(response) as BunnyStreamVideo;
  const videoId = video.guid ?? video.videoId ?? video.id;

  if (!videoId) {
    throw new Error('Bunny did not return a video ID.');
  }

  return {
    durationSeconds: typeof video.length === 'number' ? video.length : null,
    processingStatus: normalizeBunnyProcessingStatus(video.status, video.encodeProgress),
    videoId,
  };
}

export async function fetchBunnyStreamVideo(videoId: string): Promise<BunnyStreamVideoStatus> {
  const config = getBunnyStreamConfig();
  const response = await fetch(`${STREAM_API_BASE_URL}/library/${config.libraryId}/videos/${encodePathSegment(videoId)}`, {
    headers: {
      Accept: 'application/json',
      AccessKey: config.apiKey,
    },
  });

  const video = await parseBunnyResponse(response) as BunnyStreamVideo;

  return {
    durationSeconds: typeof video.length === 'number' ? video.length : null,
    processingStatus: normalizeBunnyProcessingStatus(video.status, video.encodeProgress),
    thumbnailUrl: typeof video.thumbnailFileName === 'string' && video.thumbnailFileName
      ? `https://${config.cdnHostname}/${encodePathSegment(videoId)}/${encodePathSegment(video.thumbnailFileName)}`
      : null,
  };
}

export async function uploadBunnyStreamVideo(videoId: string, filePath: string) {
  const config = getBunnyStreamConfig();
  const file = await fs.readFile(filePath);
  const response = await fetch(`${STREAM_API_BASE_URL}/library/${config.libraryId}/videos/${encodePathSegment(videoId)}`, {
    method: 'PUT',
    headers: {
      AccessKey: config.apiKey,
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });

  await parseBunnyResponse(response);
}

export async function uploadBunnyStorageFile(filePath: string, remotePath: string) {
  const config = getBunnyStorageConfig();
  const file = await fs.readFile(filePath);
  const checksum = createHash('sha256').update(file).digest('hex').toUpperCase();
  const normalizedRemotePath = remotePath
    .split('/')
    .map((segment) => encodePathSegment(segment))
    .join('/')
    .replace(/^\/+/, '');
  const url = `${config.endpoint}/${encodePathSegment(config.zoneName)}/${normalizedRemotePath}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      AccessKey: config.accessKey,
      Checksum: checksum,
      'Content-Type': 'application/octet-stream',
    },
    body: file,
  });

  await parseBunnyResponse(response);

  return {
    checksum,
    remotePath: normalizedRemotePath,
    storageUrl: url,
  };
}

export function normalizeBunnyProcessingStatus(status?: number, encodeProgress?: number) {
  if (encodeProgress === 100) {
    return 'ready';
  }

  switch (status) {
    case 3:
    case 4:
      return 'ready';
    case 5:
    case 6:
      return 'failed';
    default:
      return 'processing';
  }
}

export function buildMasterStoragePath(filePath: string, lessonSlug: string) {
  const extension = path.extname(filePath) || '.mp4';
  return `masters/${lessonSlug}/${Date.now()}${extension}`;
}
