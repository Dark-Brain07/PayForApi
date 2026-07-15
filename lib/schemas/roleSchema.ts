import { z } from "zod";

export const roleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(1),
  permissions: z.array(z.string())
});