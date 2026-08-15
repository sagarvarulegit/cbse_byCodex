import { prisma } from '../prisma.js';

const DEFAULT_DAILY_LIMIT = 30;

export function getTutorDailyLimit(): number {
  const raw = Number(process.env.TUTOR_DAILY_LIMIT);
  return Number.isInteger(raw) && raw > 0 ? raw : DEFAULT_DAILY_LIMIT;
}

/**
 * Counts how many user messages the student sent today (00:00 local server
 * time to now). Used to enforce the free-tier daily doubt limit.
 */
export async function countTodayUserMessages(userId: string): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  return prisma.tutorMessage.count({
    where: {
      role: 'user',
      createdAt: { gte: startOfDay },
      conversation: { userId },
    },
  });
}

export async function assertUnderDailyLimit(userId: string): Promise<{ ok: true; used: number; limit: number } | { ok: false; used: number; limit: number }> {
  const limit = getTutorDailyLimit();
  const used = await countTodayUserMessages(userId);
  return used >= limit ? { ok: false, used, limit } : { ok: true, used, limit };
}
