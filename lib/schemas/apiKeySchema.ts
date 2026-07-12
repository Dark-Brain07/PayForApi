import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().trim().min(32).max(128),
  ownerAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  name: z.string().min(1).max(64),
  scopes: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type ApiKeyData = z.infer<typeof apiKeySchema>;
export const validateApiKey = (data: unknown) => apiKeySchema.safeParse(data);
export const parseApiKeyOrThrow = (data: unknown): ApiKeyData => apiKeySchema.parse(data);
