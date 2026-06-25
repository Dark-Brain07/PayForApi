import { z } from "zod";

export const ratePlanSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().max(64),
  callsPerMonth: z.number().int().min(0),
  pricePerCall: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["USDm", "EURm", "KESm", "BRLm", "GHSm", "COPm", "PUSO"]).default("USDm"),
  overage: z.boolean().default(false),
  overagePricePerCall: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string").optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type RatePlanData = z.infer<typeof ratePlanSchema>;
export const validateRatePlan = (data: unknown) => ratePlanSchema.safeParse(data);
export const parseRatePlanOrThrow = (data: unknown): RatePlanData => ratePlanSchema.parse(data);
