import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import test from 'node:test';

import { buildBunnyVideoUrls, signBunnyDirectoryUrl } from './bunny.js';

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
