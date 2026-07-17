import { z } from "zod";
import { CELO_MAINNET_ID } from "../contracts";

const checkSchema = z.object({
  name: z.string(),
  status: z.enum(["up", "down"]),
  latencyMs: z.number().min(0).optional(),
  message: z.string().trim().optional(),
});

export const healthReportSchema = z.object({
  id: z.string().uuid().optional(),
  status: z.enum(["healthy", "degraded", "down"]),
  checks: z.array(checkSchema).default([]),
  version: z.string().trim(),
  chainId: z.number().int().default(CELO_MAINNET_ID),
  checkedAt: z.string().datetime(),
}).strict();

export type HealthReportData = z.infer<typeof healthReportSchema>;
export const validateHealthReport = (data: unknown) => healthReportSchema.safeParse(data);
export const parseHealthReportOrThrow = (data: unknown): HealthReportData => healthReportSchema.parse(data);
