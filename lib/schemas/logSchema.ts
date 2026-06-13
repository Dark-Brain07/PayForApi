import { z } from "zod";

export const logSchema = z.object({
  id: z.string().uuid(),
  level: z.enum(["info", "warn", "error", "debug"]),
  message: z.string(),
  timestamp: z.date(),
  meta: z.record(z.unknown()).optional()
});