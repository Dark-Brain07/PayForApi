import { z } from 'zod';

/**
 * Enterprise validation schema for Apiroute entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const apiRouteSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type ApirouteData = z.infer<typeof apiRouteSchema>;

export const validateApiroute = (data: unknown) => {
  return apiRouteSchema.safeParse(data);
};
