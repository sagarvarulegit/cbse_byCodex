import { randomUUID } from 'node:crypto';

import { getBunnyStorageConfig } from '../bunny.js';

export type StoredAttachment = {
  storagePath: string;
  publicUrl: string;
};

/**
 * Uploads a file buffer to the Bunny Storage zone under tutor/<conversationId>/.
 * Returns the storage path and a (read-only) CDN URL for the file.
 */
export async function uploadTutorAttachment(
  conversationId: string,
  kind: 'image' | 'pdf',
  mimeType: string,
  buffer: Buffer,
  extension: string,
): Promise<StoredAttachment> {
  const config = getBunnyStorageConfig();
  const safeId = conversationId.replace(/[^a-zA-Z0-9-]/g, '');
  const storagePath = `tutor/${safeId}/${randomUUID()}.${extension}`;

  const url = `${config.endpoint}/${config.zoneName}/${storagePath}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      AccessKey: config.accessKey,
      'Content-Type': mimeType,
    },
    body: new Uint8Array(buffer),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`Bunny Storage upload failed with HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  // Public CDN path for the attachment (Bunny Storage serves files at
  // https://<zone>.b-cdn.net/<path>).
  const publicUrl = `https://${config.zoneName}.b-cdn.net/${storagePath}`;
  return { storagePath, publicUrl };
}

/**
 * Fetches the attachment bytes from Bunny Storage (used to send image/PDF
 * content into the Gemini request). Returns null when the file is missing.
 */
export async function fetchTutorAttachment(storagePath: string): Promise<Buffer | null> {
  const config = getBunnyStorageConfig();
  const url = `${config.endpoint}/${config.zoneName}/${storagePath}`;
  const response = await fetch(url, {
    headers: { AccessKey: config.accessKey },
  });
  if (!response.ok) {
    return null;
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
