import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

export const sessionSchema = z.object({
  id: z.string().trim().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  chainId: z.number().int().default(CELO_MAINNET_ID),
  isMiniPay: z.boolean().default(false),
  expiresAt: z.string().datetime(),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(256).optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type SessionData = z.infer<typeof sessionSchema>;
export const validateSession = (data: unknown): ReturnType<typeof sessionSchema.safeParse> => sessionSchema.safeParse(data);
export const parseSessionOrThrow = (data: unknown): SessionData => sessionSchema.parse(data);
