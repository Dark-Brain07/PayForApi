import { loggerInstance } from './logger';
export class SmsSender {
  private static instance: SmsSender;
  private constructor() {}
  public static getInstance(): SmsSender {
    if (!SmsSender.instance) SmsSender.instance = new SmsSender();
    return SmsSender.instance;
  }
  public async send(phone: string, text: string): Promise<boolean> {
    loggerInstance.info(`Sending SMS to ${phone}: ${text}`);
    return true;
  }
}
export const smsSenderInstance = SmsSender.getInstance();