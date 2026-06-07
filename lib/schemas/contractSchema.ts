import { z } from 'zod';

/**
 * Enterprise validation schema for Contract entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const contractSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type ContractData = z.infer<typeof contractSchema>;

export const validateContract = (data: unknown) => {
  return contractSchema.safeParse(data);
};
