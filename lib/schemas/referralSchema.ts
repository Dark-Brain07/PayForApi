import { z } from "zod";

export const referralSchema = z.object({
  id: z.string().uuid().optional(),
  referrerAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  refereeAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  rewardAmount: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string").default("0"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]).default("USDm"),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash").optional(),
  converted: z.boolean().default(false),
  convertedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type ReferralData = z.infer<typeof referralSchema>;
export const validateReferral = (data: unknown) => referralSchema.safeParse(data);
export const parseReferralOrThrow = (data: unknown): ReferralData => referralSchema.parse(data);
