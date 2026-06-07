import { z } from 'zod';

/**
 * Enterprise validation schema for Log entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const logSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type LogData = z.infer<typeof logSchema>;

export const validateLog = (data: unknown) => {
  return logSchema.safeParse(data);
};
