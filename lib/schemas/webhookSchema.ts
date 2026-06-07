import { z } from 'zod';

/**
 * Enterprise validation schema for Webhook entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const webhookSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type WebhookData = z.infer<typeof webhookSchema>;

export const validateWebhook = (data: unknown) => {
  return webhookSchema.safeParse(data);
};
