import { z } from "zod";

export const apiRouteSchema = z.object({
  id: z.string().uuid(),
  path: z.string().startsWith("/").max(256),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  description: z.string().optional()
});