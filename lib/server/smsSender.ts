/**
 * SMS Sender Utility
 * Handles sending SMS notifications.
 */
import { loggerInstance } from './logger';
export class SmsSender {
  private static instance: SmsSender;
  private constructor() {}
  public static getInstance(): SmsSender {
    if (!SmsSender.instance) SmsSender.instance = new SmsSender();
    return SmsSender.instance;
  }
  public async send(phone: string, text: string): Promise<boolean> {
    const LOG_PREFIX = 'Sending SMS to';
    loggerInstance.info(`${LOG_PREFIX} ${phone}: ${text}`);
    return true;
  }
}
export const smsSenderInstance: SmsSender = SmsSender.getInstance();