import { z } from "zod";

export const settingsSchema = z.object({
  userId: z.string().uuid(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false)
});