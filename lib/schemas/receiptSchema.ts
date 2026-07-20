import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

/** On-chain payment receipt for a completed x402 call */
export const receiptSchema = z.object({
  id: z.string().trim().uuid().optional(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash"),
  from: z.string().toLowerCase().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  to:   z.string().trim().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  amount: z.string().min(1, "Amount must not be empty").regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]),
  endpoint: z.string().url(),
  chainId: z.number().int().default(CELO_MAINNET_ID),
  blockNumber: z.number().int().positive().optional(),
  issuedAt: z.string().datetime(),
}).strict();

export type ReceiptData = z.infer<typeof receiptSchema>;
/** Validates receipt data against the receiptSchema without throwing */
export const validateReceipt = (data: unknown) => receiptSchema.safeParse(data);
export const parseReceiptOrThrow = (data: unknown): ReceiptData => receiptSchema.parse(data);
