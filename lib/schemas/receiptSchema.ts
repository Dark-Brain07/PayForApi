import { z } from "zod";

/** On-chain payment receipt for a completed x402 call */
export const receiptSchema = z.object({
  id: z.string().uuid().optional(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash"),
  from: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  to:   z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"]),
  endpoint: z.string().url(),
  chainId: z.number().int().default(42220),
  blockNumber: z.number().int().positive().optional(),
  issuedAt: z.string().datetime(),
}).strict();

export type ReceiptData = z.infer<typeof receiptSchema>;
export const validateReceipt = (data: unknown) => receiptSchema.safeParse(data);
export const parseReceiptOrThrow = (data: unknown): ReceiptData => receiptSchema.parse(data);
