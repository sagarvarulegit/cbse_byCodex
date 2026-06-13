import type { Request } from 'express';

import { getSessionUser, requireSessionUser } from './session.js';

export async function hasLessonAccess(req: Request, lesson: { accessLevel: string }) {
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
