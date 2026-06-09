import { z } from "zod";

export const walletSchema = z.object({
  address: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  chainId: z.number().int().positive().default(42220),
  isMiniPay: z.boolean().default(false),
  balances: z.record(z.string(), z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string")).default({}),
  isConnected: z.boolean().default(false),
  ensName: z.string().optional(),
}).strict();

export type WalletData = z.infer<typeof walletSchema>;
export const validateWallet = (data: unknown) => walletSchema.safeParse(data);
export const parseWalletOrThrow = (data: unknown): WalletData => walletSchema.parse(data);
