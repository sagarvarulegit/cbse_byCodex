import type { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const ipCache = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipCache.entries()) {
    if (now > record.resetTime) {
      ipCache.delete(ip);
    }
  }
}, 5 * 60 * 1000).unref?.();

export function rateLimit(options: { windowMs: number; max: number; message?: string }) {
  const { windowMs, max, message = 'Too many requests. Please try again later.' } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    // Basic IP resolution
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    const record = ipCache.get(ip);
    if (!record || now > record.resetTime) {
      ipCache.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    record.count++;
    if (record.count > max) {
      return res.status(429).json({ message });
    }

    next();
  };
}
