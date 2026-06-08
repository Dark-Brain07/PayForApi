import { z } from "zod";

export const apiKeySchema = z.object({
  id: z.string().uuid(),
  key: z.string().min(32),
  createdAt: z.date(),
  expiresAt: z.date().optional(),
  isActive: z.boolean().default(true)
});