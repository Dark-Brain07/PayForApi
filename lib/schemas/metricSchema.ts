import { z } from "zod";

export const metricSchema = z.object({
  id: z.string().uuid().optional(),
  endpoint: z.string().url(),
  callCount: z.number().int().min(0),
  avgLatencyMs: z.number().min(0),
  errorRate: z.number().min(0).max(1),
  totalRevenue: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string").default("0"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]).default("USDm"),
  period: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format: YYYY-MM-DD"),
  createdAt: z.string().datetime().optional(),
}).strict();

export type MetricData = z.infer<typeof metricSchema>;
export const validateMetric = (data: unknown) => metricSchema.safeParse(data);
export const parseMetricOrThrow = (data: unknown): MetricData => metricSchema.parse(data);
