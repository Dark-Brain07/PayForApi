import { z } from 'zod';

/**
 * Enterprise validation schema for Transaction entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const transactionSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type TransactionData = z.infer<typeof transactionSchema>;

export const validateTransaction = (data: unknown) => {
  return transactionSchema.safeParse(data);
};
