import { z } from 'zod';

/**
 * Enterprise validation schema for Review entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const reviewSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type ReviewData = z.infer<typeof reviewSchema>;

export const validateReview = (data: unknown) => {
  return reviewSchema.safeParse(data);
};
