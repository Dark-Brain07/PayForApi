import { z } from 'zod';

/**
 * Enterprise validation schema for Payment entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const paymentSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type PaymentData = z.infer<typeof paymentSchema>;

export const validatePayment = (data: unknown) => {
  return paymentSchema.safeParse(data);
};
