import { z } from 'zod';

/**
 * Enterprise validation schema for Register entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const registerSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type RegisterData = z.infer<typeof registerSchema>;

export const validateRegister = (data: unknown) => {
  return registerSchema.safeParse(data);
};
