import { z } from 'zod';

/**
 * Enterprise validation schema for Login entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const loginSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type LoginData = z.infer<typeof loginSchema>;

export const validateLogin = (data: unknown) => {
  return loginSchema.safeParse(data);
};
