import { z } from "zod";

/** x402 micropayment on Celo */
export const paymentSchema = z.object({
  id: z.string().uuid("Invalid UUID format").optional(),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash"),
  from: z.string().length(42).regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  to:   z.string().length(42).regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  amount: z.string().min(1, "Amount is required").regex(/^\d+(\.\d+)?$/, "Must be numeric string"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"], { required_error: "Token is required" }),
  endpoint: z.string().trim().min(1).max(2048).url("Must be a valid endpoint URL"),
  chainId: z.number().int().describe("The EVM chain ID").default(42220),
  blockNumber: z.number().int().positive().optional(),
  status: z.enum(["pending", "confirmed", "failed"]).default("pending"),
  createdAt: z.string().datetime().optional(),
}).strict();

export type PaymentData = z.infer<typeof paymentSchema>;
export const validatePayment = (data: unknown) => paymentSchema.safeParse(data);
export const parsePaymentOrThrow = (data: unknown): PaymentData => paymentSchema.parse(data);
