import { z } from "zod";

export const usageSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  endpoint: z.string().trim().url(),
  callCount: z.number().int().min(0).default(0),
  totalSpent: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string").default("0"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]).default("USDm"),
  month: z.string().regex(/^\d{4}-\d{2}$/, "Format: YYYY-MM"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type UsageData = z.infer<typeof usageSchema>;
export const validateUsage = (data: unknown) => usageSchema.safeParse(data);
export const parseUsageOrThrow = (data: unknown): UsageData => usageSchema.parse(data);
