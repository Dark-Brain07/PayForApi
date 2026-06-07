import { z } from 'zod';

/**
 * Enterprise validation schema for User entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const userSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type UserData = z.infer<typeof userSchema>;

export const validateUser = (data: unknown) => {
  return userSchema.safeParse(data);
};
