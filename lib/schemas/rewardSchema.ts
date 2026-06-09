import { z } from "zod";

export const rewardSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  amount: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"]).default("cUSD"),
  reason: z.string().max(256),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash").optional(),
  claimed: z.boolean().default(false),
  claimedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type RewardData = z.infer<typeof rewardSchema>;
export const validateReward = (data: unknown) => rewardSchema.safeParse(data);
export const parseRewardOrThrow = (data: unknown): RewardData => rewardSchema.parse(data);
