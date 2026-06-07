import { z } from 'zod';

/**
 * Enterprise validation schema for Comment entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const commentSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type CommentData = z.infer<typeof commentSchema>;

export const validateComment = (data: unknown) => {
  return commentSchema.safeParse(data);
};
