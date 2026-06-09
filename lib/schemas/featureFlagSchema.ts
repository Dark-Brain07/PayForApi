import { z } from "zod";

export const featureFlagSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().regex(/^[a-z][a-zA-Z0-9]*$/, "camelCase key required"),
  value: z.union([z.boolean(), z.string(), z.number()]),
  enabled: z.boolean().default(true),
  description: z.string().max(256).optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type FeatureFlagData = z.infer<typeof featureFlagSchema>;
export const validateFeatureFlag = (data: unknown) => featureFlagSchema.safeParse(data);
export const parseFeatureFlagOrThrow = (data: unknown): FeatureFlagData => featureFlagSchema.parse(data);
