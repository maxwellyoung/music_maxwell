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
