import { z } from "zod";

/** A creator-registered API endpoint on PayForAPI */
export const endpointSchema = z.object({
  id: z.string().uuid().optional(),
  creatorAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  url: z.string().url("Must be a valid endpoint URL"),
  pricePerCall: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"]).default("cUSD"),
  name: z.string().max(64),
  description: z.string().max(256).optional(),
  isActive: z.boolean().default(true),
  callCount: z.number().int().min(0).default(0),
  totalEarnings: z.string().regex(/^\d+(\.\d+)?$/, "Must be numeric string").default("0"),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
}).strict();

export type EndpointData = z.infer<typeof endpointSchema>;
export const validateEndpoint = (data: unknown) => endpointSchema.safeParse(data);
export const parseEndpointOrThrow = (data: unknown): EndpointData => endpointSchema.parse(data);
