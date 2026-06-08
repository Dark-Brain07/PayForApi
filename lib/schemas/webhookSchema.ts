import { z } from "zod";

export const webhookSchema = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  events: z.array(z.string()),
  secret: z.string().optional(),
  isActive: z.boolean().default(true)
});