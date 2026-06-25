import { z } from "zod";

/** x402 invoice issued to a caller before payment */
export const invoiceSchema = z.object({
  id: z.string().uuid().optional(),
  callerAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  creatorAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  endpoint: z.string().url(),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]).default("USDm"),
  dueAt: z.string().datetime(),
  paidAt: z.string().datetime().optional(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash").optional(),
  status: z.enum(["unpaid", "paid", "expired"]).default("unpaid"),
  createdAt: z.string().datetime().optional(),
}).strict();

export type InvoiceData = z.infer<typeof invoiceSchema>;
export const validateInvoice = (data: unknown) => invoiceSchema.safeParse(data);
export const parseInvoiceOrThrow = (data: unknown): InvoiceData => invoiceSchema.parse(data);
