import { z } from "zod";

export const subscriptionSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  planId: z.string(),
  callsUsed: z.number().int().min(0).default(0),
  callsLimit: z.number().int().min(0),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]).default("USDm"),
  status: z.enum(["active", "paused", "expired"]).default("active"),
  renewsAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type SubscriptionData = z.infer<typeof subscriptionSchema>;
export const validateSubscription = (data: unknown) => subscriptionSchema.safeParse(data);
export const parseSubscriptionOrThrow = (data: unknown): SubscriptionData => subscriptionSchema.parse(data);
