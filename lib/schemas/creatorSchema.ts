import { z } from "zod";

export const creatorSchema = z.object({
  id: z.string().uuid().optional(),
  walletAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  displayName: z.string().min(1).max(64),
  bio: z.string().max(256).optional(),
  endpoints: z.array(z.string().url()).default([]),
  totalEarnings: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string").default("0"),
  totalCalls: z.number().int().min(0).default(0),
  isVerified: z.boolean().default(false),
  createdAt: z.string().datetime().optional(),
}).strict();

export type CreatorData = z.infer<typeof creatorSchema>;
export const validateCreator = (data: unknown) => creatorSchema.safeParse(data);
export const parseCreatorOrThrow = (data: unknown): CreatorData => creatorSchema.parse(data);
