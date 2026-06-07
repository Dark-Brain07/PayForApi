import { z } from 'zod';

/**
 * Enterprise validation schema for Permission entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const permissionSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type PermissionData = z.infer<typeof permissionSchema>;

export const validatePermission = (data: unknown) => {
  return permissionSchema.safeParse(data);
};
