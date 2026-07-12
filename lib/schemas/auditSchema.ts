import { z } from "zod";

export const auditSchema = z.object({
  id: z.string().uuid().optional(),
  actorAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  action: z.string().trim().max(128),
  resource: z.string().max(256),
  result: z.enum(["success", "failure"]),
  metadata: z.record(z.string(), z.unknown()).default({}),
  ipAddress: z.string().ip().optional(),
  userAgent: z.string().max(256).optional(),
  createdAt: z.string().datetime(),
}).strict();

export type AuditData = z.infer<typeof auditSchema>;
export const validateAudit = (data: unknown) => auditSchema.safeParse(data);
export const parseAuditOrThrow = (data: unknown): AuditData => auditSchema.parse(data);
