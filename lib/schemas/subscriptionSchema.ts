import { z } from 'zod';

/**
 * Enterprise validation schema for Subscription entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const subscriptionSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type SubscriptionData = z.infer<typeof subscriptionSchema>;

export const validateSubscription = (data: unknown) => {
  return subscriptionSchema.safeParse(data);
};
