// Content moderation utilities

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
];

// Normalize text for comparison (handles some bypass attempts)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    // Replace common substitutions
    .replace(/0/g, "o")
    .replace(/1/g, "i")
    .replace(/3/g, "e")
    .replace(/4/g, "a")
    .replace(/5/g, "s")
    .replace(/\$/g, "s")
    .replace(/@/g, "a")
    // Remove spaces and special chars between letters
    .replace(/[\s._-]+/g, "")
    // Remove repeated chars (e.g., "fuuuck" -> "fuck")
    .replace(/(.)\1+/g, "$1");
}

/**
 * Check if text contains banned words
 * Handles some common bypass attempts
 */
export function containsBannedWords(text: string): boolean {
  const normalized = normalizeText(text);
  return BANNED_WORDS.some((word) => normalized.includes(word));
}

/**
 * Check multiple text fields for banned words
 */
export function checkContentModeration(
  ...texts: (string | null | undefined)[]
): { passed: boolean; reason?: string } {
  for (const text of texts) {
    if (text && containsBannedWords(text)) {
      return {
        passed: false,
        reason: "Your content contains inappropriate language.",
      };
    }
  }
  return { passed: true };
}

// Content length limits
export const CONTENT_LIMITS = {
  topicTitle: { min: 3, max: 200 },
  topicContent: { min: 10, max: 10000 },
  replyContent: { min: 1, max: 5000 },
  marginalia: { min: 1, max: 500 },
  username: { min: 3, max: 30 },
  bio: { min: 0, max: 500 },
} as const;

/**
 * Validate content length
 */
export function validateLength(
  text: string,
  limits: { min: number; max: number }
): { valid: boolean; reason?: string } {
  const trimmed = text.trim();
  if (trimmed.length < limits.min) {
    return {
      valid: false,
      reason: `Content must be at least ${limits.min} characters.`,
    };
  }
  if (trimmed.length > limits.max) {
    return {
      valid: false,
      reason: `Content must be less than ${limits.max} characters.`,
    };
  }
  return { valid: true };
}
