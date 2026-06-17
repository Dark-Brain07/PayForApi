import { z } from "zod";
import { CELO_MAINNET } from "../contracts";

/** x402 micropayment on Celo */
export const paymentSchema = z.object({
  id: z.string().trim().uuid("Invalid UUID format").max(100).optional(),
  txHash: z.string().length(66).regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash"),
  from: z.string().trim().toLowerCase().length(42).regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  to:   z.string().trim().toLowerCase().length(42).regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  amount: z.string().min(1, "Amount is required").max(50, "Amount string too long").regex(/^\d+(\.\d+)?$/, "Must be numeric string").refine(val => parseFloat(val) > 0, "Amount must be greater than 0"),
  token: z.enum(["cUSD", "cEUR", "cKES", "cBRL", "cGHS", "cCOP", "PUSO"], { required_error: "Token is required" }),
  endpoint: z.string().trim().min(1).max(1000).url("Must be a valid endpoint URL").refine(url => url.startsWith("https://"), "Endpoint must use HTTPS"),
  chainId: z.number().int().positive("Chain ID must be positive").describe("The EVM chain ID").default(CELO_MAINNET.chainId),
  blockNumber: z.number().int().nonnegative("Block number must be 0 or greater").optional(),
  status: z.enum(["pending", "confirmed", "failed"]).optional().default("pending"),
  createdAt: z.string().datetime().optional(),
}).strict();

export type PaymentData = z.infer<typeof paymentSchema>;
/** Validates payment data without throwing, returning a safe parsed object */
export const validatePayment = (data: unknown) => paymentSchema.safeParse(data);
/** Parses payment data and throws an error if validation fails */
export const parsePaymentOrThrow = (data: unknown): PaymentData => paymentSchema.parse(data);
