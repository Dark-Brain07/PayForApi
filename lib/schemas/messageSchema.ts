import { z } from 'zod';

/**
 * Enterprise validation schema for Message entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const messageSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type MessageData = z.infer<typeof messageSchema>;

export const validateMessage = (data: unknown) => {
  return messageSchema.safeParse(data);
};
