import { z } from 'zod';

/**
 * Enterprise validation schema for Tag entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const tagSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type TagData = z.infer<typeof tagSchema>;

export const validateTag = (data: unknown) => {
  return tagSchema.safeParse(data);
};
