// In-memory rate limiter.
// For production, replace with Upstash Redis or Vercel KV.
// See: https://upstash.com/docs/redis/sdks/ratelimit-ts

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, 60_000);

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: limit - 1, resetAt };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

// Convenience helpers

export function loginRateLimit(identifier: string) {
  return rateLimit(`login:${identifier}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000, // 10 per 15 min
  });
}

export function registerRateLimit(identifier: string) {
  return rateLimit(`register:${identifier}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 5 per hour
  });
}

export function messageRateLimit(userId: string) {
  return rateLimit(`message:${userId}`, {
    limit: 30,
    windowMs: 60 * 1000, // 30 per minute
  });
}

export function reportRateLimit(userId: string) {
  return rateLimit(`report:${userId}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000, // 5 per hour
  });
}

export function passwordResetRateLimit(identifier: string) {
  return rateLimit(`reset:${identifier}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000, // 3 per hour
  });
}

export function uploadRateLimit(userId: string) {
  return rateLimit(`upload:${userId}`, {
    limit: 20,
    windowMs: 60 * 60 * 1000, // 20 per hour
  });
}
