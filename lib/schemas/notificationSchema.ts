import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string().uuid().optional(),
  recipientAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, "Invalid EVM address"),
  channel: z.enum(["in-app", "email", "push"]).default("in-app"),
  title: z.string().max(128),
  body: z.string().max(512),
  read: z.boolean().default(false),
  txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/, "Invalid tx hash").optional(),
  createdAt: z.string().datetime().optional(),
}).strict();

export type NotificationData = z.infer<typeof notificationSchema>;
/** Validates notification data against the notificationSchema safely without throwing */
export const validateNotification = (data: unknown) => notificationSchema.safeParse(data);
export const parseNotificationOrThrow = (data: unknown): NotificationData => notificationSchema.parse(data);
