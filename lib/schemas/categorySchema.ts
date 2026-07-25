import { z } from "zod";

export const CELO_MAINNET_ID = 42220;

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  description: z.string().optional(),
  chainId: z.number().default(CELO_MAINNET_ID)
});