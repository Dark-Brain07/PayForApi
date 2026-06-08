import { z } from "zod";

export const permissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  action: z.string(),
  resource: z.string()
});