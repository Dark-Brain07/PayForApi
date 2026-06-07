import { z } from 'zod';

/**
 * Enterprise validation schema for Notification entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const notificationSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type NotificationData = z.infer<typeof notificationSchema>;

export const validateNotification = (data: unknown) => {
  return notificationSchema.safeParse(data);
};
