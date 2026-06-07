import { z } from 'zod';

/**
 * Enterprise validation schema for Profile entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const profileSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type ProfileData = z.infer<typeof profileSchema>;

export const validateProfile = (data: unknown) => {
  return profileSchema.safeParse(data);
};
