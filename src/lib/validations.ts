import { z } from "zod";

/**
 * Shared Zod validation schemas for API routes
 */

// Forum schemas
export const createTopicSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required").max(10000, "Content too long"),
});

export const deleteTopicSchema = z.object({
  topicId: z.string().min(1, "Topic ID is required"),
});

export const createReplySchema = z.object({
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  topicId: z.string().min(1, "Topic ID is required"),
});

export const deleteReplySchema = z.object({
  replyId: z.string().min(1, "Reply ID is required"),
});

// Auth schemas
export const changePasswordSchema = z.object({
  currentPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password too long"),
});

export const setUsernameSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
});

// Demo schemas
export const createDemoSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  link: z.string().url("Invalid URL").optional().or(z.literal("")),
  status: z.enum(["unfinished", "finished", "archived"]).optional(),
});

// Report schema
export const createReportSchema = z.object({
  replyId: z.string().min(1, "Reply ID is required"),
  reason: z.string().min(1, "Reason is required").max(500, "Reason too long"),
});

// Type exports
export type CreateTopicInput = z.infer<typeof createTopicSchema>;
export type DeleteTopicInput = z.infer<typeof deleteTopicSchema>;
export type CreateReplyInput = z.infer<typeof createReplySchema>;
export type DeleteReplyInput = z.infer<typeof deleteReplySchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type SetUsernameInput = z.infer<typeof setUsernameSchema>;
export type CreateDemoInput = z.infer<typeof createDemoSchema>;
export type CreateReportInput = z.infer<typeof createReportSchema>;
