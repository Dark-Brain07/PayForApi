import { z } from "zod";

/** On-chain Celo transaction record */
export const transactionSchema = z.object({
  id: z.string().uuid().optional(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash"),
  from: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  to:   z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  value: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"]),
  chainId: z.number().int().default(42220),
  blockNumber: z.number().int().positive().optional(),
  gasUsed: z.string().optional(),
  status: z.enum(["pending", "confirmed", "failed"]).default("pending"),
  createdAt: z.string().datetime().optional(),
}).strict();

export type TransactionData = z.infer<typeof transactionSchema>;
export const validateTransaction = (data: unknown) => transactionSchema.safeParse(data);
export const parseTransactionOrThrow = (data: unknown): TransactionData => transactionSchema.parse(data);
