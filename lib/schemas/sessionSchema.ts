import { z } from "zod";

export const sessionSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  chainId: z.number().int().default(42220),
  isMiniPay: z.boolean().default(false),
  expiresAt: z.string().datetime(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(256).optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type SessionData = z.infer<typeof sessionSchema>;
export const validateSession = (data: unknown) => sessionSchema.safeParse(data);
export const parseSessionOrThrow = (data: unknown): SessionData => sessionSchema.parse(data);
