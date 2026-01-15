/**
 * Shared constants for the application
 */

/**
 * List of banned words for content moderation.
 * Used in forum topics, replies, and username validation.
 */
export const BANNED_WORDS = [
  "admin",
  "mod",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "nigger",
  "faggot",
  "cunt",
  "retard",
  "nazi",
  "hitler",
  "moist",
] as const;

/**
 * Check if content contains any banned words
 */
export function containsBannedWords(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return BANNED_WORDS.some((word) => lowerContent.includes(word));
}

/**
 * Rate limit configuration
 */
export const RATE_LIMITS = {
  REPLY_INTERVAL_MS: 10_000, // 10 seconds between replies
  REPLY_MAX_PER_INTERVAL: 1,
} as const;
