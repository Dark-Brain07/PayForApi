import { z } from 'zod';

/**
 * Enterprise validation schema for Invoice entities.
 * Ensures strict type safety and input sanitization at boundaries.
 */
export const invoiceSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).default('PENDING'),
  metadata: z.record(z.string(), z.any()).optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type InvoiceData = z.infer<typeof invoiceSchema>;

export const validateInvoice = (data: unknown) => {
  return invoiceSchema.safeParse(data);
};
