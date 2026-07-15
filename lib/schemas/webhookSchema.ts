import { z } from "zod";

export const webhookSchema = z.object({
  id: z.string().uuid().optional(),
  ownerAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  url: z.string().trim().url(),
  events: z.array(
    z.enum(["payment.success", "payment.failed", "api.call", "creator.earning", "endpoint.registered"])
  ),
  secret: z.string().min(16).max(255).optional(),
  isActive: z.boolean().default(true),
  createdAt: z.string().datetime().optional(),
}).strict();

export type WebhookData = z.infer<typeof webhookSchema>;
export const validateWebhook = (data: unknown) => webhookSchema.safeParse(data);
export const parseWebhookOrThrow = (data: unknown): WebhookData => webhookSchema.parse(data);
