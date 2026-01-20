import { LRUCache } from "lru-cache";

export interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval ?? 500,
    ttl: options.interval ?? 60000,
  });

  return {
    check: async (limit: number, token: string): Promise<RateLimitResult> => {
      const cachedValue = tokenCache.get(token);
      const tokenCount = Array.isArray(cachedValue) ? cachedValue : [0];
      const now = Date.now();
      const windowStart = now - options.interval;

      // Remove old requests
      while (tokenCount.length && tokenCount[0] < windowStart) {
        tokenCount.shift();
      }

      // Check if limit is exceeded
      const currentUsage = tokenCount.length;
      const isRateLimited = currentUsage >= limit;

      // Add current request
      tokenCount.push(now);
      tokenCache.set(token, tokenCount);

      return {
        success: !isRateLimited,
        limit,
        remaining: Math.max(0, limit - currentUsage),
        reset: windowStart + options.interval,
      };
    },
  };
}

// Pre-configured rate limiters for common actions
export const forumLimiter = rateLimit({
  interval: 60_000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const searchLimiter = rateLimit({
  interval: 60_000,
  uniqueTokenPerInterval: 500,
});

export const authLimiter = rateLimit({
  interval: 300_000, // 5 minutes
  uniqueTokenPerInterval: 500,
});

// Rate limit configurations
export const LIMITS = {
  createTopic: 5, // 5 per minute
  createReply: 10, // 10 per minute
  search: 30, // 30 per minute
  login: 5, // 5 per 5 minutes
  marginalia: 20, // 20 per minute
} as const;

// Helper to get identifier from request
export function getClientIdentifier(
  userId: string | null | undefined,
  request: Request
): string {
  if (userId) return `user:${userId}`;

  // Try to get IP from headers (Vercel/Cloudflare)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return `ip:${ip}`;
}
