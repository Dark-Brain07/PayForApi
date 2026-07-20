import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  ens: z.string().trim().toLowerCase().max(255).optional(),
  email: z.string().trim().toLowerCase().email().max(255).optional(),
  role: z.enum(["user", "creator", "admin"]).default("user"),
  isMiniPay: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type UserData = z.infer<typeof userSchema>;
export const validateUser = (data: unknown): ReturnType<typeof userSchema.safeParse> => userSchema.safeParse(data);
/** Parses the input data and returns it as UserData, or throws an error */
export const parseUserOrThrow = (data: unknown): UserData => userSchema.parse(data);
