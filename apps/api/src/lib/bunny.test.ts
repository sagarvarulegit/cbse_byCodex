import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';

import { buildBunnyVideoUrls, fetchBunnyStreamVideo, signBunnyDirectoryUrl } from './bunny.js';

test('buildBunnyVideoUrls creates HLS, embed, and thumbnail URLs', () => {
  const urls = buildBunnyVideoUrls('12345', 'vz-example.b-cdn.net/', 'video-guid');

  assert.equal(urls.playbackUrl, 'https://vz-example.b-cdn.net/video-guid/playlist.m3u8');
  assert.equal(urls.embedUrl, 'https://iframe.mediadelivery.net/embed/12345/video-guid');
  assert.equal(urls.thumbnailUrl, 'https://vz-example.b-cdn.net/video-guid/thumbnail.jpg');
});

test('signBunnyDirectoryUrl signs the video directory for HLS segment access', () => {
  const url = 'https://vz-example.b-cdn.net/video-guid/playlist.m3u8';
  const expiresAt = 1_800_000_000;
  const securityKey = 'secret-key';
  const tokenPath = '/video-guid/';
  const signingData = `token_path=${tokenPath}`;
  const expectedToken = `HS256-${createHmac('sha256', securityKey)
    .update(`${tokenPath}${expiresAt}${signingData}`)
    .digest('base64url')}`;

  const signed = signBunnyDirectoryUrl({
    expiresAt,
    securityKey,
    url,
  });

  assert.equal(signed.expiresAt, expiresAt);
  assert.equal(
    signed.url,
    `https://vz-example.b-cdn.net/bcdn_token=${expectedToken}&token_path=%2Fvideo-guid%2F&expires=${expiresAt}/video-guid/playlist.m3u8`,
  );
});

test('fetchBunnyStreamVideo maps transcoding status into ready state', async () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = process.env.BUNNY_STREAM_API_KEY;
  const originalLibraryId = process.env.BUNNY_STREAM_LIBRARY_ID;
  const originalCdnHostname = process.env.BUNNY_STREAM_CDN_HOSTNAME;

  process.env.BUNNY_STREAM_API_KEY = 'api-key';
  process.env.BUNNY_STREAM_LIBRARY_ID = '12345';
  process.env.BUNNY_STREAM_CDN_HOSTNAME = 'vz-example.b-cdn.net';

  globalThis.fetch = (async (input) => {
    assert.equal(String(input), 'https://video.bunnycdn.com/library/12345/videos/video-guid');

    return new Response(
      JSON.stringify({
        encodeProgress: 100,
        guid: 'video-guid',
        length: 42,
        status: 4,
        thumbnailFileName: 'thumbnail.jpg',
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
        status: 200,
      },
    );
  }) as typeof globalThis.fetch;

  try {
    const status = await fetchBunnyStreamVideo('video-guid');

    assert.equal(status.processingStatus, 'ready');
    assert.equal(status.durationSeconds, 42);
    assert.equal(status.thumbnailUrl, 'https://vz-example.b-cdn.net/video-guid/thumbnail.jpg');
  } finally {
    globalThis.fetch = originalFetch;
    process.env.BUNNY_STREAM_API_KEY = originalEnv;
    process.env.BUNNY_STREAM_LIBRARY_ID = originalLibraryId;
    process.env.BUNNY_STREAM_CDN_HOSTNAME = originalCdnHostname;
  }
});
