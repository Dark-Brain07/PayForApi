import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

/** Schema for user wallet authentication */
export const walletSchema = z.object({
  address: z.string().trim().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  chainId: z.number().int().positive().default(CELO_MAINNET_ID),
  isMiniPay: z.boolean().default(false),
  balances: z.record(z.string(), z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string")).default({}),
  isConnected: z.boolean().default(false),
  ensName: z.string().trim().toLowerCase().optional(),
}).strict();

export type WalletData = z.infer<typeof walletSchema>;
export const validateWallet = (data: unknown) => walletSchema.safeParse(data);
/** Parses the input data and returns it as WalletData, or throws an error */
export const parseWalletOrThrow = (data: unknown): WalletData => walletSchema.parse(data);
