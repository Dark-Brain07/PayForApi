import { z } from 'zod';

/**
 * Enterprise validation schema for Category entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const categorySchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type CategoryData = z.infer<typeof categorySchema>;

export const validateCategory = (data: unknown) => {
  return categorySchema.safeParse(data);
};
