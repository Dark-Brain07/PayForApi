import { z } from 'zod';

/**
 * Enterprise validation schema for Order entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const orderSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type OrderData = z.infer<typeof orderSchema>;

export const validateOrder = (data: unknown) => {
  return orderSchema.safeParse(data);
};
