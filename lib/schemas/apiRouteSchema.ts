import { z } from "zod";

/**
 * Schema for validating REST API route registrations and endpoints.
 * Enforces valid HTTP methods and URL path formatting.
 */
export const apiRouteSchema = z.object({
  id: z.string().uuid(),
  path: z.string().startsWith("/").max(256),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  description: z.string().trim().optional()
});