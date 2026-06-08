import { z } from "zod";

export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  permissions: z.array(z.string())
});