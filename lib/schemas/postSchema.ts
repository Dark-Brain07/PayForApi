import { z } from 'zod';

/**
 * Enterprise validation schema for Post entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const postSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type PostData = z.infer<typeof postSchema>;

export const validatePost = (data: unknown) => {
  return postSchema.safeParse(data);
};
