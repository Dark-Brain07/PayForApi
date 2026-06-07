import { z } from 'zod';

/**
 * Enterprise validation schema for Role entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const roleSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type RoleData = z.infer<typeof roleSchema>;

export const validateRole = (data: unknown) => {
  return roleSchema.safeParse(data);
};
