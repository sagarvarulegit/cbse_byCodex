const DEFAULT_ACTIVE_STATUS_SYNC_TTL_SECONDS = 30;
const DEFAULT_TERMINAL_STATUS_SYNC_TTL_SECONDS = 6 * 60 * 60;

function readPositiveNumberEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.floor(value);
}

export function getVideoStatusSyncTtlSeconds(processingStatus: string) {
  if (processingStatus === 'ready' || processingStatus === 'failed') {
    return readPositiveNumberEnv('VIDEO_TERMINAL_STATUS_SYNC_TTL_SECONDS', DEFAULT_TERMINAL_STATUS_SYNC_TTL_SECONDS);
  }

  return readPositiveNumberEnv('VIDEO_ACTIVE_STATUS_SYNC_TTL_SECONDS', DEFAULT_ACTIVE_STATUS_SYNC_TTL_SECONDS);
}

export function shouldRefreshVideoStatus({
  now = new Date(),
  processingStatus,
  statusSyncedAt,
}: {
  now?: Date;
  processingStatus: string;
  statusSyncedAt: Date | null;
}) {
  if (!statusSyncedAt) {
    return true;
  }

  const ttlMs = getVideoStatusSyncTtlSeconds(processingStatus) * 1000;
  return now.getTime() - statusSyncedAt.getTime() >= ttlMs;
}
