import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

/** On-chain Celo transaction record */
export const transactionSchema = z.object({
  id: z.string().trim().uuid().optional(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash"),
  from: z.string().toLowerCase().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  to:   z.string().trim().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  value: z.string().trim().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]),
  chainId: z.number().int().default(CELO_MAINNET_ID),
  blockNumber: z.number().int().positive().optional(),
  gasUsed: z.string().optional(),
  status: z.enum(["pending", "confirmed", "failed"]).default("pending"),
  createdAt: z.string().datetime().optional(),
}).strict();

export type TransactionData = z.infer<typeof transactionSchema>;
export const validateTransaction = (data: unknown) => transactionSchema.safeParse(data);
export const parseTransactionOrThrow = (data: unknown): TransactionData => transactionSchema.parse(data);
