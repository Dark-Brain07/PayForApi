import { z } from 'zod';

/**
 * Enterprise validation schema for Settings entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const settingsSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type SettingsData = z.infer<typeof settingsSchema>;

export const validateSettings = (data: unknown) => {
  return settingsSchema.safeParse(data);
};
